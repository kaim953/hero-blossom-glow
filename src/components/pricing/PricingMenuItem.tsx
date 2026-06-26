import { ArrowRight } from "@phosphor-icons/react";

interface PricingMenuItemProps {
  title: string;
  subtitle: string;
  isActive?: boolean;
  onClick?: () => void;
}

const PricingMenuItem = ({
  title,
  subtitle,
  isActive = false,
  onClick,
}: PricingMenuItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-between py-4 px-5 rounded-[16px]
        transition-all duration-500 bg-neutral-00/10
        ${isActive 
          ? "opacity-100" 
          : "opacity-50 hover:opacity-80"
        }
      `}
    >
      <div className="flex flex-col items-start gap-0.5">
        <h6 className="text-neutral-00">{title}</h6>
        <span className="text-body-small text-neutral-04">{subtitle}</span>
      </div>
      
      {/* Circular arrow - only visible on active */}
      {isActive && (
        <div 
          className="rounded-full p-0.5 flex items-center justify-center"
          style={{ border: "2px solid hsl(var(--neutral-04))" }}
        >
          <ArrowRight size={16} className="text-neutral-00 rotate-90 desktop:rotate-0" />
        </div>
      )}
    </button>
  );
};

export default PricingMenuItem;
