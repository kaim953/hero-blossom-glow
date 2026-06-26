import IntegrationLogo from "./IntegrationLogo";
import Logo223 from "@/assets/logoipsum-223.png";
import Logo224 from "@/assets/logoipsum-224.png";
import Logo245 from "@/assets/logoipsum-245.png";
import Logo291 from "@/assets/logoipsum-291.png";
import Logo329 from "@/assets/logoipsum-329.png";
import Logo331 from "@/assets/logoipsum-331.png";
import Logo394 from "@/assets/logoipsum-394.png";

const leftLogos = [
  { src: Logo223, alt: "Integration 1" },
  { src: Logo224, alt: "Integration 2" },
  { src: Logo245, alt: "Integration 3" },
  { src: Logo291, alt: "Integration 4" },
];

const rightLogos = [
  { src: Logo329, alt: "Integration 5" },
  { src: Logo331, alt: "Integration 6" },
  { src: Logo394, alt: "Integration 7" },
  { src: Logo223, alt: "Integration 8" },
];

const IntegrationTicker = () => {
  return (
    <>
      {/* Mobile Layout - Horizontal rows */}
      <div 
        className="flex flex-col gap-2 w-full overflow-hidden tablet:hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
        }}
      >
        {/* Upper row - moving right */}
        <div className="flex animate-ticker-reverse">
          {[1, 2, 3].map((setIndex) => (
            <div key={setIndex} className="flex gap-2 pr-2">
              {leftLogos.map((logo, index) => (
                <IntegrationLogo key={index} src={logo.src} alt={logo.alt} />
              ))}
            </div>
          ))}
        </div>
        
        {/* Lower row - moving left */}
        <div className="flex animate-ticker">
          {[1, 2, 3].map((setIndex) => (
            <div key={setIndex} className="flex gap-2 pr-2">
              {rightLogos.map((logo, index) => (
                <IntegrationLogo key={index} src={logo.src} alt={logo.alt} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Tablet+ Layout - Vertical columns (existing, unchanged) */}
      <div 
        className="hidden tablet:flex gap-4 h-[465px] overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
        }}
      >
        {/* Left column - moving up */}
        <div className="flex flex-col animate-ticker-up">
          {[1, 2, 3].map((setIndex) => (
            <div key={setIndex} className="flex flex-col gap-3 pb-3">
              {leftLogos.map((logo, index) => (
                <IntegrationLogo key={index} src={logo.src} alt={logo.alt} />
              ))}
            </div>
          ))}
        </div>
        
        {/* Right column - moving down */}
        <div className="flex flex-col animate-ticker-down">
          {[1, 2, 3].map((setIndex) => (
            <div key={setIndex} className="flex flex-col gap-3 pb-3">
              {rightLogos.map((logo, index) => (
                <IntegrationLogo key={index} src={logo.src} alt={logo.alt} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default IntegrationTicker;
