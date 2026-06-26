interface IntegrationLogoProps {
  src: string;
  alt: string;
}

const IntegrationLogo = ({ src, alt }: IntegrationLogoProps) => {
  return (
    <div className="w-20 h-20 tablet:w-[100px] tablet:h-[100px] p-5 tablet:p-7 bg-bg-02 rounded-[16px] flex items-center justify-center flex-shrink-0">
      <img 
        src={src} 
        alt={alt}
        className="w-8 tablet:w-11 h-auto object-contain"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

export default IntegrationLogo;
