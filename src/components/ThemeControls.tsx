import { Sun, Moon, Shield, ShieldCheck } from "@phosphor-icons/react";
import { useTheme } from "@/hooks/useTheme";

interface ThemeControlsProps {
  className?: string;
}

const ThemeControls = ({ className = "" }: ThemeControlsProps) => {
  const { theme, toggleTheme, eyeProtection, toggleEyeProtection } = useTheme();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        title={theme === "dark" ? "Light mode" : "Dark mode"}
        className="w-9 h-9 rounded-full bg-neutral-02 hover:bg-neutral-03 text-neutral-12 flex items-center justify-center transition-colors duration-500 border border-neutral-03"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <button
        type="button"
        onClick={toggleEyeProtection}
        aria-label={eyeProtection ? "Disable eye protection" : "Enable eye protection"}
        aria-pressed={eyeProtection}
        title={eyeProtection ? "Eye protection on" : "Eye protection off"}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-500 border ${
          eyeProtection
            ? "bg-main text-neutral-12 border-neutral-12"
            : "bg-neutral-02 hover:bg-neutral-03 text-neutral-12 border-neutral-03"
        }`}
      >
        {eyeProtection ? <ShieldCheck size={18} /> : <Shield size={18} />}
      </button>
    </div>
  );
};

export default ThemeControls;
