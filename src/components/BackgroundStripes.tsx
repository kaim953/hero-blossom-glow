const BackgroundStripes = () => {
  const bars = Array.from({ length: 8 });

  return (
    <div className="absolute top-0 left-0 right-0 h-[69vh] overflow-hidden pointer-events-none z-0">
      {/* Left stripe container */}
      <div className="absolute left-0 top-0 w-[35vw] h-full flex overflow-hidden">
        {bars.map((_, i) => (
          <div
            key={i}
            className="flex-1 min-w-[70px] max-w-[82px] h-full bg-gradient-to-r from-[rgba(255,255,255,0.5)] to-transparent"
          />
        ))}
        {/* Fade overlay: left to right */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-bg-01" />
      </div>

      {/* Right stripe container */}
      <div className="absolute right-0 top-0 w-[35vw] h-full flex justify-end overflow-hidden">
        {bars.map((_, i) => (
          <div
            key={i}
            className="flex-1 min-w-[70px] max-w-[82px] h-full bg-gradient-to-r from-[rgba(255,255,255,0.5)] to-transparent"
          />
        ))}
        {/* Fade overlay: right to left */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-bg-01" />
      </div>

      {/* Bottom fade overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-b from-transparent to-bg-01" />
    </div>
  );
};

export default BackgroundStripes;
