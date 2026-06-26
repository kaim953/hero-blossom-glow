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
      main: "#FEF7AF",
      /* Background Colors */
      bg: {
        '01': "#F4F2EE",
        '02': "#F0ECE6",
        '03': "#EDE9E6",
      },
      /* Overlay Colors */
      overlay: {
        '00': "rgba(0, 0, 0, 0.20)",
        '01': "rgba(0, 0, 0, 0.30)",
        '02': "rgba(0, 0, 0, 0.68)",
      },
      /* Neutral Colors - Edit these hex values to customize */
      neutral: {
        '00': "#FFFFFF",  // White
        '01': "#FAFAFA",
        '02': "#F4F4F4",
        '03': "#EEEEEE",
        '04': "#E6E6E6",
        '05': "#DADADA",
        '06': "#CCCCCC",
        '07': "#BDBDBD",
        '08': "#AEAEAE",
        '09': "#999999",
        '10': "#605F5F",
        '11': "#1A1A1A",
        '12': "#000000",  // Black
      },
      /* Success & Rating Colors */
      success: "#22C55E",
      star: "#FBBF24",
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
