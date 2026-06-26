import { cn } from "@/lib/utils";

interface StepCardProps {
  stepNumber: string;
  title: string;
  description: string;
  backgroundImage: string;
  mainImage: string;
  isOpen: boolean;
  onHover: () => void;
  variant?: "horizontal" | "vertical";
}

const StepCard = ({
  stepNumber,
  title,
  description,
  backgroundImage,
  mainImage,
  isOpen,
  onHover,
  variant = "horizontal",
}: StepCardProps) => {
  const isVertical = variant === "vertical";

  return (
    <div
      className={cn(
        "rounded-[20px] p-[24px] overflow-hidden",
        isVertical
          ? "flex flex-col gap-[24px] h-auto border-2 border-neutral-00"
          : "flex h-[340px] transition-all duration-500 ease-out",
        !isVertical && (isOpen ? "flex-[2] border-2 border-neutral-00" : "flex-1")
      )}
      style={{
        backgroundColor: isVertical
          ? "rgba(255, 255, 255, 0.9)"
          : isOpen
          ? "rgba(255, 255, 255, 0.9)"
          : "rgba(255, 255, 255, 0.7)",
        boxShadow: isVertical || isOpen
          ? "0 8px 20px rgba(0, 0, 0, 0.1)"
          : "none",
      }}
      onMouseEnter={isVertical ? undefined : onHover}
    >
      {/* Step Content */}
      <div
        className={cn(
          "flex flex-col w-full min-w-0",
          isVertical
            ? "gap-[24px]"
            : "h-full justify-between transition-all duration-500 ease-out",
          !isVertical && (isOpen ? "mr-[16px]" : "mr-0")
        )}
      >
        {/* Step Number */}
        <span className="text-body-large text-neutral-10">{stepNumber}</span>

        {/* Step Details */}
        <div className="w-full">
          <h5 className="text-h5">{title}</h5>
          <p className="text-body text-neutral-10 mt-[16px] break-words">
            {description}
          </p>
        </div>
      </div>

      {/* Step Image */}
      <div
        className={cn(
          "rounded-[16px] overflow-hidden bg-cover bg-center",
          isVertical
            ? "w-full aspect-square"
            : "h-full transition-all duration-500 ease-out",
          !isVertical &&
            (isOpen
              ? "w-full max-w-[350px] opacity-100"
              : "w-0 max-w-0 opacity-0")
        )}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Main Image */}
        <img
          src={mainImage}
          alt={title}
          className="mt-[20px] ml-[20px] rounded-[16px] border-2 border-neutral-00 h-auto"
          style={{
            width: "120%",
            boxShadow: "-2px 4px 15px rgba(0, 0, 0, 0.25)",
          }}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
};

export default StepCard;
