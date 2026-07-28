import { useEffect, useRef, useState, useCallback } from "react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  enabled?: boolean;
  debounceMs?: number;
}

export const useAutoSave = <T>({
  data,
  onSave,
  enabled = true,
  debounceMs = 2000,
}: UseAutoSaveOptions<T>) => {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialDataRef = useRef<string>(JSON.stringify(data));
  const isFirstRender = useRef(true);

  const hasChanges = JSON.stringify(data) !== initialDataRef.current;

  const save = useCallback(async () => {
    if (!enabled) return;

    setStatus("saving");
    try {
      await onSave(data);
      setStatus("saved");
      setLastSaved(new Date());
      initialDataRef.current = JSON.stringify(data);
    } catch (error) {
      setStatus("error");
    }
  }, [data, onSave, enabled]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      initialDataRef.current = JSON.stringify(data);
      return;
    }

    if (!enabled || !hasChanges) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(save, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, save, enabled, hasChanges, debounceMs]);

  return { status, lastSaved, hasChanges };
};
