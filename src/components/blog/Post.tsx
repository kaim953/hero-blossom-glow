interface PostProps {
  thumbnailUrl: string | null;
  logoUrl?: string | null;
  publishedDate: string | null;
  title: string;
  briefIntro: string | null;
  className?: string;
}

const Post = ({ thumbnailUrl, logoUrl, publishedDate, title, briefIntro, className = "" }: PostProps) => {
  const year = publishedDate ? new Date(publishedDate).getFullYear() : null;

  return (
    <div className={`group p-2 rounded-[20px] bg-neutral-00/60 transition-shadow duration-500 hover:shadow-[5px_8px_15px_rgba(0,0,0,0.15)] ${className}`}>
      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden">
        <img 
          src={thumbnailUrl || "/placeholder.svg"} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          decoding="async"
        />
        
        {/* Conditional Overlay + Logo */}
        {logoUrl && (
          <>
            <div className="absolute inset-0 bg-overlay-00" />
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[35px] w-auto z-10 transition-all duration-500 group-hover:h-[32px]"
              loading="lazy"
              decoding="async"
            />
          </>
        )}
        
        {/* Year Badge */}
        {year && (
          <div className="absolute bottom-6 right-6 px-2 py-1 bg-overlay-01 rounded-[40px]">
            <span className="text-body-small text-neutral-00">{year}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 mt-2">
        <h5 className="text-h5">{title}</h5>
        {briefIntro && (
          <p className="text-body text-neutral-10 mt-2">{briefIntro}</p>
        )}
      </div>
    </div>
  );
};

export default Post;
