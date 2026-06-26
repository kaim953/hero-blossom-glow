import { Target, Plus } from "@phosphor-icons/react";

interface MissionCardProps {
  title: string;
  description: string;
  imageSrc: string;
  backgroundSrc: string;
  className?: string;
}

const MissionCard = ({
  title,
  description,
  imageSrc,
  backgroundSrc,
  className = ""
}: MissionCardProps) => {
  return (
    <div 
      className={`rounded-[20px] overflow-hidden relative ${className}`}
      style={{
        boxShadow: "8px 8px 20px rgba(0, 0, 0, 0.25)"
      }}
    >
      {/* Background Image */}
      <img 
        src={backgroundSrc}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-overlay-02" />
      
      {/* Content */}
      <div className="relative z-10 p-8 desktop:p-10 flex flex-col justify-start desktop:justify-between h-full">
        {/* Header */}
        <div className="w-full">
          {/* Title with Icon */}
          <div className="flex items-center gap-3">
            <Target size={28} className="text-neutral-00" />
            <h2 className="text-neutral-00">{title}</h2>
          </div>
          
          {/* Description */}
          <p className="text-body-large text-neutral-04 mt-6">
            {description}
          </p>
        </div>
        
        {/* Image Wrap */}
        <div className="w-full flex items-end justify-between mt-16 desktop:mt-0">
          {/* Plus Icon Divider */}
          <div className="flex gap-8">
            {[1, 2, 3].map((i) => (
              <Plus key={i} size={12} className="text-neutral-08" />
            ))}
          </div>
          
          {/* Content Image */}
          <img 
            src={imageSrc}
            alt="Mission"
            className="w-[72px] h-[72px] tablet:w-[120px] tablet:h-[120px] object-cover rounded-[12px]"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
};

export default MissionCard;
