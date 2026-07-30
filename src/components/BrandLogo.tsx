interface BrandLogoProps {
  className?: string;
}

const BrandLogo = ({ className = "" }: BrandLogoProps) => {
  return (
    <span className={`group inline-flex items-center gap-[10px] h-[35px] select-none ${className}`}>
      {/* Mark */}
      <span className="relative flex-shrink-0 w-[32px] h-[32px] flex items-center justify-center">
        {/* Accent halo */}
        <span className="absolute inset-0 rounded-[11px] bg-main rotate-6 opacity-70 transition-all duration-500 ease-in-out group-hover:rotate-[18deg] group-hover:opacity-100" />
        {/* Core tile */}
        <span className="relative w-[32px] h-[32px] rounded-[10px] bg-neutral-12 flex items-center justify-center shadow-[0_2px_8px_hsl(var(--neutral-12)/0.2)] transition-transform duration-500 ease-in-out group-hover:scale-105">
          <svg viewBox="0 0 24 24" className="w-[17px] h-[17px]" fill="none" aria-hidden="true">
            <path
              d="M19 8.2A7.5 7.5 0 1 0 20 12h-7"
              stroke="hsl(var(--theme-main))"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </span>

      {/* Wordmark */}
      <span className="flex items-baseline leading-none font-albert-sans text-[22px] font-bold tracking-[-0.05em] text-neutral-12 transition-colors duration-500">
        Grovia
        <span className="ml-[3px] w-[5px] h-[5px] rounded-full bg-main transition-transform duration-500 ease-in-out group-hover:scale-150" />
      </span>
    </span>
  );
};

export default BrandLogo;
