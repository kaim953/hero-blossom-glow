import { useEffect, useState, useRef, useCallback } from "react";

interface UseCounterAnimationOptions {
  endValue: number;
  duration?: number;
  decimals?: number;
}

export const useCounterAnimation = ({
  endValue,
  duration = 1500,
  decimals = 0,
}: UseCounterAnimationOptions) => {
  const startValue = endValue * 0.5; // Start at 50% of end value
  const [currentValue, setCurrentValue] = useState(startValue);
  const elementRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);

  // Ease-out quad function for natural deceleration
  const easeOutQuad = (t: number): number => {
    return 1 - (1 - t) * (1 - t);
  };

  const startAnimation = useCallback(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);
      
      const value = startValue + (easedProgress * (endValue - startValue));
      setCurrentValue(value);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentValue(endValue);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [endValue, duration]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Reset for hot reload / re-mount
    hasStartedRef.current = false;
    setCurrentValue(startValue);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasStartedRef.current) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [startAnimation]);

  const formattedValue = decimals > 0 
    ? currentValue.toFixed(decimals) 
    : Math.floor(currentValue).toString();

  return { formattedValue, ref: elementRef };
};
