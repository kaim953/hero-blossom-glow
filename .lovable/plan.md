
Problem restatement (what you’re seeing)
- After a successful login, refreshing a protected admin page (or /auth while logged-in) can get stuck showing an infinite spinner again.
- This keeps recurring because the current auth architecture still allows the UI to be blocked by a role-check that has no “escape hatch” if the network/RPC call never resolves, and it can also trigger duplicate role checks on initial load.

What I found in the current code
- Protected pages are gated by `ProtectedRoute`:
  - It shows a full-screen spinner whenever `loading || rolesLoading` is true.
- `useAuth.tsx` sets `loading=true` initially and in `initSession()` it does:
  - `await safeCheckRoles(session.user.id);`
  - then (in finally) `setLoading(false)`
- If the role fetch hangs (network stall, browser offline, request never returns), `safeCheckRoles()` never resolves, so:
  - `initSession()` never reaches its finally
  - `loading` stays `true`
  - ProtectedRoute stays on the spinner forever
- There is also duplicated initial work:
  - Supabase auth subscriptions often fire an `INITIAL_SESSION` event shortly after subscribing.
  - Your code also calls `getSession()` manually.
  - Both can trigger role loading for the same user during initial mount, increasing race/overlap and making “stuck” states more likely.
- `checkUserRoles()` currently toggles `rolesLoading` itself (it has a `finally { setRolesLoading(false) }`), while `safeCheckRoles()` also toggles `rolesLoading`. This makes role-loading state harder to reason about and increases the chance of inconsistent UI gating.

Likely root causes for the repeating issue
1) No timeout / no cancellation for role RPC calls
   - Browser fetch requests can hang indefinitely in some network conditions.
   - Because the UI is blocked on `rolesLoading/loading`, any hung request becomes an infinite loading screen.
2) UI uses “spinner as the only state” (no error state)
   - Even when something goes wrong, there’s no `rolesError` to render a recoverable UI (Retry / Sign out).
3) Duplicate role fetches on initial mount (`INITIAL_SESSION` + `getSession()`)
   - Two overlapping role checks can step on each other; if one hangs, you can end up waiting longer than necessary.
4) Coupling global app readiness (`loading`) to role readiness
   - `loading` should represent “did we restore a session?” not “did we finish every downstream permission call?”.

Fix goals
- Never allow the app to stay in a spinner forever.
- Make the initial refresh flow deterministic:
  - Restore session quickly.
  - Fetch roles with a deadline.
  - If role fetching fails/times out, show a clear recovery UI instead of a permanent spinner.
- Reduce duplicate initial role fetching and eliminate overlapping role-fetch state updates.

Implementation plan (code changes)

A) Harden `src/hooks/useAuth.tsx` (main fix)
1) Add explicit role error + retry support to the auth context
   - Extend `AuthContextType` with:
     - `rolesError: string | null`
     - `refreshRoles: () => Promise<void>` (re-run role fetch for the current user)
2) Make role loading state “single-owner”
   - Remove all `setRolesLoading(...)` calls from inside `checkUserRoles()`.
   - `checkUserRoles()` should only compute/set role booleans (and/or return roles), not manage loading flags.
   - `safeCheckRoles()` becomes the only place that sets `rolesLoading` true/false.
3) Add a timeout guard so role checks can’t block forever
   - Implement a small helper inside `useAuth.tsx`, e.g.:
     - `withTimeout(promise, ms, label)` using `Promise.race`
   - Wrap each RPC involved in role loading (`get_user_roles`, `bootstrap_first_admin`, and the “refetch after bootstrap”) with `withTimeout(...)` (e.g., 8–10 seconds).
   - If timed out:
     - set `rolesError` to a user-friendly message like “Unable to verify your access right now. Please retry.”
     - ensure `rolesLoading` is set to false in `finally` so the UI can proceed.
4) Add a “latest request wins” guard to avoid stale/overlapping updates
   - Introduce `const rolesRequestSeq = useRef(0)`
   - Each `safeCheckRoles()` call increments seq and captures it locally.
   - Only apply results / set error states if the seq matches the latest (`rolesRequestSeq.current`).
   - This prevents an older, slower request from overwriting a newer result.
5) Simplify initial loading coordination to avoid repeated races
   - Keep “session restoration” (`loading`) separate from “roles loading”.
   - Initial mount flow:
     - Subscribe to auth changes.
     - Call `getSession()` once.
     - Set `loading=false` in a `finally` that always runs, regardless of role fetch outcome.
   - Do not block `loading` on role checks indefinitely; role checks are bounded by timeout and guarded by `rolesError`.
6) Reduce duplicate work from auth events
   - In `onAuthStateChange`, detect and ignore the `INITIAL_SESSION` event (because `getSession()` already handles initial restoration).
   - For real changes (SIGNED_IN, TOKEN_REFRESHED, USER_UPDATED, SIGNED_OUT):
     - update `user/session`
     - if user changed, trigger `safeCheckRoles()` (prefer “fire and forget” with `void safeCheckRoles(...)` to avoid blocking the auth event handler itself)
     - on sign-out, clear role flags and `rolesError`

B) Update `src/components/ProtectedRoute.tsx` to avoid “spinner forever”
1) Consume new auth fields: `rolesError` and `refreshRoles`
2) Update render logic:
   - If `loading`: show spinner (session restoration)
   - If no `user`: redirect to /auth
   - If `rolesLoading`: show spinner (“Verifying access…”)
   - If `rolesError`:
     - render a centered error state with:
       - message: “We couldn’t verify your access.”
       - a Retry button calling `refreshRoles()`
       - a Sign out button calling `signOut()` and redirecting to /auth (or just signOut and let routing handle)
   - Otherwise proceed with existing admin/editor checks

C) Update `src/pages/Auth.tsx` to handle “logged-in but roles failed” cleanly
1) Read `rolesError` from `useAuth()`
2) Redirect effect adjustments:
   - Currently it waits on `rolesLoading` and can keep you on /auth if roles never settle.
   - With the new timeout + error state, add logic:
     - If `user` exists and `rolesError` is set, show a toast explaining permissions couldn’t be verified and provide a clear next step:
       - either let them retry (call `refreshRoles`) or sign them out automatically.
   - Prefer not to auto-sign-out immediately unless you want strict behavior; the safer UX is: show message + “Retry” button (but that requires UI). Minimum: toast + sign out button.

Testing / verification checklist (end-to-end)
1) Fresh visit to /auth (logged out)
   - Login form renders immediately.
2) Login via magic link
   - Redirects to /admin/post successfully.
3) Refresh /admin/post
   - No infinite spinner:
     - either roles load quickly and page renders
     - or after timeout you see a “couldn’t verify access” screen with Retry/Sign out
4) Temporarily simulate bad network (offline / throttling)
   - Confirm you get the recoverable error UI, not a permanent spinner.
5) Confirm remix-first-admin bootstrap still works
   - If a user has no roles, role fetch triggers bootstrap (still server-side) and retries role retrieval; timeout protections shouldn’t break this, just bound how long it can block.

Files to change
- src/hooks/useAuth.tsx
- src/components/ProtectedRoute.tsx
- src/pages/Auth.tsx

Notes on impact to remixed projects
- This plan does not change the underlying role model (still server-derived from the roles table and SECURITY DEFINER RPCs).
- The primary change is resilience: timeouts, reduced duplicate initial role checks, and a visible error state instead of an infinite spinner.
- Bootstrap logic for “first admin” remains intact; it will simply be subject to a timeout so it can’t hang the UI indefinitely.
