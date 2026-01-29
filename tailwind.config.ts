import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Ocean theme - Light mode
        'ocean-light': '#F5F9FC',
        'ocean-deep': '#006994',
        'ocean-blue': '#3182CE',
        'ocean-cyan': '#00B5D8',
        'ocean-text': '#1A202C',
        'ocean-muted': '#718096',
        // Dark mode
        'abyss': '#0A1628',
        'abyss-text': '#F7FAFC',
        'abyss-blue': '#63B3ED',
        // Legacy
        'coral': '#FF6B6B',
      },
      fontFamily: {
        'heading': ['var(--font-oswald)', 'Oswald', 'sans-serif'],
        'body': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        'mono': ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'radar-spin': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 4s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
