import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  eyeProtection: boolean;
  toggleEyeProtection: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_KEY = "app-theme";
const EYE_KEY = "app-eye-protection";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getInitialEye = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(EYE_KEY) === "1";
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [eyeProtection, setEyeProtection] = useState<boolean>(getInitialEye);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(EYE_KEY, eyeProtection ? "1" : "0");
  }, [eyeProtection]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const toggleEyeProtection = useCallback(() => {
    setEyeProtection((v) => !v);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, eyeProtection, toggleEyeProtection }}>
      {children}
      {eyeProtection && <div className="eye-protection-overlay" aria-hidden="true" />}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
