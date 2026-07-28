import { Check } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import FilledButton from "@/components/FilledButton";

interface PricingCardProps {
  icon: Icon;
  title: string;
  price: string;
  priceUnit: string;
  details: string;
  buttonText: string;
  buttonHref?: string;
  features: string[];
  variant?: "vertical" | "horizontal";
  className?: string;
}

const PricingCard = ({
  icon: Icon,
  title,
  price,
  priceUnit,
  details,
  buttonText,
  buttonHref,
  features,
  variant = "vertical",
  className = "",
}: PricingCardProps) => {
  return (
    <div className={`bg-overlay-02 backdrop-blur-[5px] rounded-[24px] p-[32px] text-neutral-00 dark:text-neutral-12 ${
      variant === "horizontal" 
        ? "flex flex-row items-center gap-[40px]" 
        : "flex flex-col gap-[40px]"
    } ${className}`}>
      {/* Card Header */}
      <div className={`flex flex-col gap-[24px] ${variant === "horizontal" ? "w-1/2" : ""}`}>
        {/* Icon + Title Row */}
        <div className="flex items-center gap-3">
        {/* Icon wrapper - 24px icon + 8px padding each side */}
          <div className="rounded-full bg-neutral-00/10 p-2 flex items-center justify-center">
            <Icon className="w-5 h-5 text-neutral-00 dark:text-neutral-12" />
          </div>
          <h4>{title}</h4>
        </div>

        {/* Price Details */}
        <div>
          <div className="flex items-baseline gap-1">
            <h2>{price}</h2>
            <span className="text-body text-neutral-04 dark:text-neutral-09">{priceUnit}</span>
          </div>
          <p className="text-body text-neutral-04 dark:text-neutral-09 mt-2">{details}</p>
        </div>

        {/* CTA Button */}
        <FilledButton 
          href={buttonHref} 
          variant="filled-main"
          className="w-fit"
        >
          {buttonText}
        </FilledButton>
      </div>

      {/* Card List - Features */}
      <div className={`flex flex-col gap-2 ${variant === "horizontal" ? "w-1/2" : ""}`}>
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <Check size={20} className="text-neutral-04 dark:text-neutral-09 flex-shrink-0" />
            <span className="text-body text-neutral-04 dark:text-neutral-09">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingCard;
