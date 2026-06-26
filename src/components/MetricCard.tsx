import { useCounterAnimation } from "@/hooks/useCounterAnimation";

interface MetricCardProps {
  value: number;
  suffix?: string;
  unit: string;
  description: string;
  bgColor?: string;
  decimals?: number;
  className?: string;
}

const MetricCard = ({
  value,
  suffix = "",
  unit,
  description,
  bgColor = "bg-neutral-00/40",
  decimals = 0,
  className = ""
}: MetricCardProps) => {
  // Animation triggers when card scrolls into view (20% visible)
  const { formattedValue, ref } = useCounterAnimation({
    endValue: value,
    decimals,
    duration: 1500
  });

  return (
    <div 
      ref={ref}
      className={`p-6 rounded-[20px] ${bgColor} flex flex-col justify-between ${className}`}
    >
      {/* Metric Header */}
      <div className="flex flex-col">
        <span 
          className="text-neutral-12 font-albert-sans font-medium tracking-[-0.05em] leading-[1.1em]"
          style={{ fontSize: '48px' }}
        >
          {formattedValue}{suffix}
        </span>
        <span className="text-body-large text-neutral-12">{unit}</span>
      </div>

      {/* Description */}
      <p className="text-body text-neutral-10 mt-4">{description}</p>
    </div>
  );
};

export default MetricCard;
