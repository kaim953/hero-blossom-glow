import { CircleNotch, Check, WarningCircle, Cloud } from "@phosphor-icons/react";

interface AutoSaveIndicatorProps {
  status: "idle" | "saving" | "saved" | "error";
  lastSaved?: Date | null;
}

const AutoSaveIndicator = ({ status, lastSaved }: AutoSaveIndicatorProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {status === "idle" && (
        <>
          <Cloud size={16} />
          <span>Auto-save enabled</span>
        </>
      )}
      {status === "saving" && (
        <>
          <CircleNotch size={16} className="animate-spin" />
          <span>Saving...</span>
        </>
      )}
      {status === "saved" && (
        <>
          <Check size={16} className="text-green-600" />
          <span>Saved {lastSaved && `at ${formatTime(lastSaved)}`}</span>
        </>
      )}
      {status === "error" && (
        <>
          <WarningCircle size={16} className="text-destructive" />
          <span>Save failed</span>
        </>
      )}
    </div>
  );
};

export default AutoSaveIndicator;
