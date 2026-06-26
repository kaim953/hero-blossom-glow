interface SectionBackgroundProps {
  imageSrc: string;
  imageAlt?: string;
}

const SectionBackground = ({ imageSrc, imageAlt = "Section background" }: SectionBackgroundProps) => {
  return (
    <div className="absolute top-0 bottom-0 left-1 right-1 tablet:left-5 tablet:right-5 rounded-[28px] desktop:rounded-[32px] overflow-hidden">
      {/* Background Image */}
      <img 
        src={imageSrc} 
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        loading="lazy"
        decoding="async"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-overlay-02" />
    </div>
  );
};

export default SectionBackground;
