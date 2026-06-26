import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import { CircleNotch, IconContext } from "@phosphor-icons/react";
import FloatingInstructionsButton from "@/components/FloatingInstructionsButton";
import { ThemeProvider } from "@/hooks/useTheme";

// Lazy load pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogAdmin = lazy(() => import("./pages/admin/BlogAdmin"));
const BlogPostEditor = lazy(() => import("./pages/admin/BlogPostEditor"));
const AdminAccess = lazy(() => import("./pages/admin/AdminAccess"));
const TeamAdmin = lazy(() => import("./pages/admin/TeamAdmin"));
const TeamMemberEditor = lazy(() => import("./pages/admin/TeamMemberEditor"));
const Auth = lazy(() => import("./pages/Auth"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-00">
    <CircleNotch size={32} className="animate-spin text-neutral-08" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <IconContext.Provider value={{ weight: "bold" }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
            <FloatingInstructionsButton />
            <Suspense fallback={<PageLoader />}>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/post" element={<Blog />} />
              <Route path="/post/:slug" element={<BlogPost />} />
              <Route
                path="/admin/post"
                element={
                  <ProtectedRoute requireEditor>
                    <BlogAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/post/new"
                element={
                  <ProtectedRoute requireEditor>
                    <BlogPostEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/post/edit/:id"
                element={
                  <ProtectedRoute requireEditor>
                    <BlogPostEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/team"
                element={
                  <ProtectedRoute requireEditor>
                    <TeamAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/team/new"
                element={
                  <ProtectedRoute requireEditor>
                    <TeamMemberEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/team/edit/:id"
                element={
                  <ProtectedRoute requireEditor>
                    <TeamMemberEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/access"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminAccess />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </IconContext.Provider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
