import avatarMan from "@/assets/pricing/avatars/modern-man.png";
import avatarGradient from "@/assets/pricing/avatars/modern-gradient.png";
import avatarContemplative from "@/assets/pricing/avatars/contemplative-woman.png";
import avatarDreamy from "@/assets/pricing/avatars/dreamy-woman.png";

const avatars = [avatarMan, avatarGradient, avatarContemplative, avatarDreamy];

interface RatingBadgeProps {
  variant?: "light" | "dark";
  className?: string;
}

const RatingBadge = ({ 
  variant = "light", 
  className = "" 
}: RatingBadgeProps) => {
  const textPrimaryClass = variant === "dark" ? "text-neutral-00 dark:text-neutral-12" : "text-neutral-12";
  const textSecondaryClass = variant === "dark" ? "text-neutral-04 dark:text-neutral-09" : "text-neutral-10";
  const borderClass = variant === "dark" ? "border-neutral-04 dark:border-neutral-06" : "border-neutral-04";

  return (
    <div className={`flex items-center ${className}`}>
      {/* Stacked Avatars */}
      <div className="flex -space-x-2">
        {avatars.map((avatar, index) => (
          <img
            key={index}
            src={avatar}
            alt={`Customer ${index + 1}`}
            className={`w-8 h-8 rounded-full border ${borderClass} object-cover`}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
      
      {/* Rating Details */}
      <div className="ml-3 flex flex-col">
        <span className={`text-body-small ${textPrimaryClass}`}>4.9 / 5 Rated</span>
        <span className={`text-body-small ${textSecondaryClass}`}>Over 9.2k Customers</span>
      </div>
    </div>
  );
};

export default RatingBadge;
