import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    screens: {
      'tablet': '810px',
      'desktop': '1200px',
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    colors: {
      /* Theme Color - Main */
      main: "hsl(var(--theme-main))",
      /* Background Colors */
      bg: {
        '01': "hsl(var(--bg-01))",
        '02': "hsl(var(--bg-02))",
        '03': "hsl(var(--bg-03))",
      },
      /* Overlay Colors */
      overlay: {
        '00': "rgba(0, 0, 0, 0.20)",
        '01': "rgba(0, 0, 0, 0.30)",
        '02': "rgba(0, 0, 0, 0.68)",
      },
      /* Neutral Colors - driven by CSS variables for dark mode support */
      neutral: {
        '00': "hsl(var(--neutral-00))",
        '01': "hsl(var(--neutral-01))",
        '02': "hsl(var(--neutral-02))",
        '03': "hsl(var(--neutral-03))",
        '04': "hsl(var(--neutral-04))",
        '05': "hsl(var(--neutral-05))",
        '06': "hsl(var(--neutral-06))",
        '07': "hsl(var(--neutral-07))",
        '08': "hsl(var(--neutral-08))",
        '09': "hsl(var(--neutral-09))",
        '10': "hsl(var(--neutral-10))",
        '11': "hsl(var(--neutral-11))",
        '12': "hsl(var(--neutral-12))",
      },
      /* Success & Rating Colors */
      success: "hsl(var(--success))",
      star: "hsl(var(--star))",
      /* Semantic Colors */
      transparent: 'transparent',
      current: 'currentColor',
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
    },
    extend: {
      fontFamily: {
        'albert-sans': ['Albert Sans', 'sans-serif'],
        'geist': ['Geist', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
        keyframes: {
          "accordion-down": {
            from: {
              height: "0",
            },
            to: {
              height: "var(--radix-accordion-content-height)",
            },
          },
          "accordion-up": {
            from: {
              height: "var(--radix-accordion-content-height)",
            },
            to: {
              height: "0",
            },
          },
          "ticker": {
            "0%": { transform: "translateX(0)" },
            "100%": { transform: "translateX(-33.333%)" },
          },
          "ticker-reverse": {
            "0%": { transform: "translateX(-33.333%)" },
            "100%": { transform: "translateX(0)" },
          },
          "ticker-up": {
            "0%": { transform: "translateY(0)" },
            "100%": { transform: "translateY(-33.333%)" },
          },
          "ticker-down": {
            "0%": { transform: "translateY(-33.333%)" },
            "100%": { transform: "translateY(0)" },
          },
          "appear": {
            "0%": { opacity: "0", transform: "translateY(20px)" },
            "100%": { opacity: "1", transform: "translateY(0)" },
          },
          "slide-in-from-left": {
            "0%": { opacity: "0", transform: "translateX(-30px)" },
            "100%": { opacity: "1", transform: "translateX(0)" },
          },
          "slide-in-from-right": {
            "0%": { opacity: "0", transform: "translateX(30px)" },
            "100%": { opacity: "1", transform: "translateX(0)" },
          },
          "slide-in-from-bottom": {
            "0%": { opacity: "0", transform: "translateY(30px)" },
            "100%": { opacity: "1", transform: "translateY(0)" },
          },
          "slide-in-from-top": {
            "0%": { opacity: "0", transform: "translateY(-20px)" },
            "100%": { opacity: "1", transform: "translateY(0)" },
          },
          // Widget.png animations (2deg rotation)
          "slide-in-right-rotate-cw": {
            "0%": { opacity: "0", transform: "translateX(30px) rotate(2deg)" },
            "100%": { opacity: "1", transform: "translateX(0) rotate(2deg)" },
          },
          "slide-in-top-rotate-cw": {
            "0%": { opacity: "0", transform: "translateY(-20px) rotate(2deg)" },
            "100%": { opacity: "1", transform: "translateY(0) rotate(2deg)" },
          },
          // Chart.png animations (-3deg rotation)
          "slide-in-right-rotate-ccw": {
            "0%": { opacity: "0", transform: "translateX(30px) rotate(-3deg)" },
            "100%": { opacity: "1", transform: "translateX(0) rotate(-3deg)" },
          },
          "slide-in-top-rotate-ccw": {
            "0%": { opacity: "0", transform: "translateY(-20px) rotate(-3deg)" },
            "100%": { opacity: "1", transform: "translateY(0) rotate(-3deg)" },
          },
          // Scroll-triggered animations
          "scroll-slide-in-bottom": {
            "0%": { opacity: "0", transform: "translateY(30px)" },
            "100%": { opacity: "1", transform: "translateY(0)" },
          },
          "scroll-slide-in-bottom-20": {
            "0%": { opacity: "0", transform: "translateY(20px)" },
            "100%": { opacity: "1", transform: "translateY(0)" },
          },
          "scroll-slide-in-left": {
            "0%": { opacity: "0", transform: "translateX(-20px)" },
            "100%": { opacity: "1", transform: "translateX(0)" },
          },
          "scroll-slide-in-left-30": {
            "0%": { opacity: "0", transform: "translateX(-30px)" },
            "100%": { opacity: "1", transform: "translateX(0)" },
          },
          "scroll-slide-in-right": {
            "0%": { opacity: "0", transform: "translateX(30px)" },
            "100%": { opacity: "1", transform: "translateX(0)" },
          },
          "scroll-fade-in": {
            "0%": { opacity: "0" },
            "100%": { opacity: "1" },
          },
          "about-fade-in": {
            "0%": { opacity: "0" },
            "100%": { opacity: "1" },
          },
          "about-scale-rotate-in": {
            "0%": { opacity: "0", transform: "scale(0.9) rotate(0deg)" },
            "100%": { opacity: "1", transform: "scale(1) rotate(-3deg)" },
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
          "ticker": "ticker 14.5s linear infinite",
          "ticker-reverse": "ticker-reverse 14.5s linear infinite",
          "ticker-up": "ticker-up 20s linear infinite",
          "ticker-down": "ticker-down 20s linear infinite",
          "appear": "appear 0.6s ease-in-out forwards",
          "appear-delayed": "appear 0.8s ease-in-out 0.5s forwards",
          "slide-in-left": "slide-in-from-left 0.5s ease-in-out forwards",
          "slide-in-left-delayed": "slide-in-from-left 0.5s ease-in-out 0.2s forwards",
          "slide-in-right": "slide-in-from-right 0.5s ease-in-out forwards",
          "slide-in-right-delayed": "slide-in-from-right 0.5s ease-in-out 0.2s forwards",
          "slide-in-bottom-delayed": "slide-in-from-bottom 0.5s ease-in-out 0.5s forwards",
          "slide-in-top": "slide-in-from-top 0.5s ease-in-out forwards",
          "slide-in-top-delayed": "slide-in-from-top 0.5s ease-in-out 0.2s forwards",
          "slide-in-top-delayed-2": "slide-in-from-top 0.5s ease-in-out 0.4s forwards",
          // Widget animations (2deg clockwise)
          "slide-in-right-widget": "slide-in-right-rotate-cw 0.5s ease-in-out forwards",
          "slide-in-top-widget": "slide-in-top-rotate-cw 0.5s ease-in-out 0.4s forwards",
          // Chart animations (-3deg counter-clockwise)
          "slide-in-right-chart": "slide-in-right-rotate-ccw 0.5s ease-in-out 0.2s forwards",
          "slide-in-top-chart": "slide-in-top-rotate-ccw 0.5s ease-in-out 0.4s forwards",
          // Scroll-triggered animations
          "scroll-in-bottom": "scroll-slide-in-bottom 0.5s ease-in-out forwards",
          "scroll-in-bottom-20": "scroll-slide-in-bottom-20 0.5s ease-in-out forwards",
          "scroll-in-left": "scroll-slide-in-left 0.5s ease-in-out forwards",
          "scroll-in-left-delayed-1": "scroll-slide-in-left 0.5s ease-in-out 0.1s forwards",
          "scroll-in-left-delayed-2": "scroll-slide-in-left 0.5s ease-in-out 0.2s forwards",
          "scroll-in-left-30": "scroll-slide-in-left-30 0.5s ease-in-out forwards",
          "scroll-in-right": "scroll-slide-in-right 0.5s ease-in-out forwards",
          "scroll-fade-in": "scroll-fade-in 0.5s ease-in-out forwards",
          "about-fade-in": "about-fade-in 0.5s ease-in-out 0.2s forwards",
          "about-scale-rotate": "about-scale-rotate-in 0.5s ease-in-out forwards",
        },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
