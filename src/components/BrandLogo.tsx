interface BrandLogoProps {
  className?: string;
}

/**
 * Grovia brand lockup: a squircle "growth" mark with ascending bars and a
 * rising arc, paired with the wordmark. Hover refines with a subtle tilt,
 * staggered bar growth and a sweeping shine — all 500ms ease-in-out.
 */
const BrandLogo = ({ className = "" }: BrandLogoProps) => {
  return (
    <span
      className={`group/logo inline-flex items-center gap-[10px] h-[35px] select-none ${className}`}
    >
      {/* Mark */}
      <span className="relative flex-shrink-0 w-[34px] h-[34px]">
        {/* Accent plate behind the tile */}
        <span className="absolute inset-0 rounded-[12px] bg-main rotate-[8deg] opacity-80 transition-all duration-500 ease-in-out group-hover/logo:rotate-[16deg] group-hover/logo:opacity-100 group-hover/logo:scale-[1.04]" />

        {/* Core tile */}
        <span className="absolute inset-0 rounded-[12px] bg-gradient-to-br from-neutral-10 to-neutral-12 overflow-hidden shadow-[0_2px_10px_hsl(var(--neutral-12)/0.22)] transition-all duration-500 ease-in-out group-hover/logo:-rotate-[6deg] group-hover/logo:scale-[1.06]">
          {/* Shine sweep */}
          <span className="absolute -inset-y-2 -left-[60%] w-1/2 rotate-12 bg-main/25 blur-[6px] transition-transform duration-[900ms] ease-in-out group-hover/logo:translate-x-[260%]" />

          {/* Ascending growth bars */}
          <span className="absolute bottom-[9px] left-[9px] flex items-end gap-[3px]">
            <span className="w-[3px] h-[6px] rounded-full bg-main/50 origin-bottom transition-transform duration-500 ease-in-out group-hover/logo:scale-y-[1.5]" />
            <span className="w-[3px] h-[9px] rounded-full bg-main/75 origin-bottom transition-transform delay-[60ms] duration-500 ease-in-out group-hover/logo:scale-y-[1.45]" />
            <span className="w-[3px] h-[13px] rounded-full bg-main origin-bottom transition-transform delay-[120ms] duration-500 ease-in-out group-hover/logo:scale-y-[1.25]" />
          </span>

          {/* Rising arc + spark */}
          <svg
            viewBox="0 0 34 34"
            className="absolute inset-0 w-full h-full"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M8 20c4.5 0 7.5-4.5 11.5-9"
              stroke="hsl(var(--neutral-00))"
              strokeOpacity="0.55"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle
              cx="22"
              cy="10"
              r="2.6"
              fill="hsl(var(--theme-main))"
              className="origin-center transition-transform duration-500 ease-in-out group-hover/logo:scale-125"
            />
          </svg>
        </span>
      </span>

      {/* Wordmark */}
      <span className="flex items-baseline leading-none font-albert-sans text-[22px] font-bold tracking-[-0.05em] text-neutral-12 transition-all duration-500 ease-in-out group-hover/logo:tracking-[-0.035em]">
        Grovia
        <span className="ml-[3px] w-[5px] h-[5px] rounded-full bg-main transition-all duration-500 ease-in-out group-hover/logo:scale-[1.6] group-hover/logo:-translate-y-[1px]" />
      </span>
    </span>
  );
};

export default BrandLogo;
