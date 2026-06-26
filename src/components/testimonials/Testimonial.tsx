import QuoteIcon from "@/assets/icons/Quotes_On_Light.svg";

interface TestimonialProps {
  quote: string;
  name: string;
  position: string;
  avatarUrl: string;
  className?: string;
}

const Testimonial = ({ quote, name, position, avatarUrl, className = "" }: TestimonialProps) => {
  return (
    <div className={`p-8 flex flex-col justify-between bg-neutral-00/40 rounded-[24px] ${className}`}>
      {/* Quote Section */}
      <div className="flex items-start">
        <img 
          src={QuoteIcon} 
          alt="Quote" 
          className="w-[44px] h-auto opacity-40 flex-shrink-0"
          loading="lazy"
          decoding="async"
        />
        <p className="text-body-large text-neutral-10 ml-4">
          {quote}
        </p>
      </div>

      {/* Profile Section */}
      <div className="flex items-end">
        {/* Profile Info */}
        <div className="w-full mr-5">
          <p className="text-body text-neutral-12">{name}</p>
          <p className="text-body text-neutral-10 mt-1">{position}</p>
        </div>

        {/* Profile Photo */}
        <div className="w-[40%] max-w-[140px] flex-shrink-0">
          <img 
            src={avatarUrl} 
            alt={name}
            className="w-full aspect-square rounded-[16px] object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
