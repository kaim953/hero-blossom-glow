interface SectionHeaderProps {
  title: React.ReactNode;
  subtitle: string;
  align?: "left" | "center";
  variant?: "light" | "dark";
  className?: string;
  maxWidth?: string;
  hideSubtitleOnDesktop?: boolean;
}

const SectionHeader = ({ 
  title, 
  subtitle, 
  align = "left",
  variant = "light",
  className = "",
  maxWidth = "600px",
  hideSubtitleOnDesktop = false
}: SectionHeaderProps) => {
  const titleClass = variant === "dark" ? "text-neutral-00 dark:text-neutral-12" : "text-neutral-12";
  const subtitleClass = variant === "dark" ? "text-neutral-00/80 dark:text-neutral-12/80" : "text-neutral-10";

  return (
    <div 
      className={`${align === "center" ? "text-center mx-auto" : ""} ${className}`}
      style={{ maxWidth }}
    >
      <h2 className={`text-h2 ${titleClass}`}>{title}</h2>
      <p className={`text-body-large ${subtitleClass} mt-5 ${hideSubtitleOnDesktop ? "desktop:hidden" : ""}`}>
        {subtitle}
      </p>
    </div>
  );
};

export default SectionHeader;
