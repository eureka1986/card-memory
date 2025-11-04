import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif']
      },
      colors: {
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f5f5f6',
          dark: '#111827'
        },
        accent: {
          DEFAULT: '#2563eb',
          subtle: '#dbeafe'
        },
        mastery: {
          low: '#f97316',
          mid: '#facc15',
          high: '#10b981'
        }
      },
      boxShadow: {
        card: '0 20px 45px -24px rgba(15, 23, 42, 0.45)'
      }
    }
  },
  plugins: []
};

export default config;
