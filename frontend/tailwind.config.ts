import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Indian Wedding Color Palette
        primary: {
          DEFAULT: '#8B0000', // Deep Maroon/Red
          50: '#FFF5F5',
          100: '#FFE0E0',
          200: '#FFB3B3',
          300: '#FF8080',
          400: '#E63946',
          500: '#8B0000',
          600: '#7A0000',
          700: '#5C0000',
          800: '#3D0000',
          900: '#1F0000',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#DAA520', // Gold
          50: '#FFFDF5',
          100: '#FFF8E1',
          200: '#FFECB3',
          300: '#FFE082',
          400: '#FFD54F',
          500: '#DAA520',
          600: '#C49000',
          700: '#9A7000',
          800: '#705000',
          900: '#4A3500',
          foreground: '#1A1A1A',
        },
        accent: {
          DEFAULT: '#FFFDD0', // Ivory/Cream
          50: '#FFFFF5',
          100: '#FFFDE8',
          200: '#FFFDD0',
          300: '#FFF8B3',
          400: '#FFF380',
          500: '#E6D9A0',
          600: '#CCB870',
          700: '#A69040',
          800: '#806820',
          900: '#594810',
        },
        maroon: {
          DEFAULT: '#800000',
          light: '#A52A2A',
          dark: '#5C0000',
        },
        gold: {
          DEFAULT: '#FFD700',
          light: '#FFEC8B',
          dark: '#B8860B',
        },
        ivory: {
          DEFAULT: '#FFFFF0',
          light: '#FFFFFF',
          dark: '#F5F5DC',
        },
        saffron: {
          DEFAULT: '#FF9933',
          light: '#FFB366',
          dark: '#CC7A29',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        hindi: ['Tiro Devanagari Hindi', 'Noto Sans Devanagari', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-wedding': 'linear-gradient(135deg, #8B0000 0%, #DAA520 50%, #8B0000 100%)',
        'gradient-gold': 'linear-gradient(135deg, #FFD700 0%, #DAA520 50%, #B8860B 100%)',
        'gradient-maroon': 'linear-gradient(135deg, #A52A2A 0%, #8B0000 50%, #5C0000 100%)',
        'pattern-mandala': "url('/patterns/mandala.svg')",
        'pattern-paisley': "url('/patterns/paisley.svg')",
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(139, 0, 0, 0.15)',
        'glass-gold': '0 8px 32px 0 rgba(218, 165, 32, 0.2)',
        'elevated': '0 20px 40px -15px rgba(139, 0, 0, 0.25)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 12px 40px rgba(139, 0, 0, 0.15)',
      },
      backdropBlur: {
        'glass': '16px',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(218, 165, 32, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(218, 165, 32, 0.6)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
