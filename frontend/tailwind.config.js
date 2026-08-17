/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          soft: '#FAFAF9',
          card: '#FFFFFF',
          elevated: '#F8FAFC',
          border: '#E2E8F0',
          muted: '#64748B',
          heading: '#0F172A',
          body: '#334155',
        },
        risk: {
          low: '#059669',
          'low-bg': '#ECFDF5',
          'low-border': '#A7F3D0',
          moderate: '#D97706',
          'moderate-bg': '#FFFBEB',
          'moderate-border': '#FDE68A',
          high: '#DC2626',
          'high-bg': '#FEF2F2',
          'high-border': '#FECACA',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
        'elevated': '0 20px 30px -10px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.03)',
        'glow-rose': '0 0 20px -5px rgba(225, 29, 72, 0.25)',
      },
      animation: {
        'heart-pulse': 'heartPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'soft-bounce': 'softBounce 3s ease-in-out infinite',
        'ecg-scan': 'ecgScan 3s linear infinite',
      },
      keyframes: {
        heartPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '15%': { transform: 'scale(1.15)', opacity: '0.9' },
          '30%': { transform: 'scale(1)' },
          '45%': { transform: 'scale(1.08)' },
          '60%': { transform: 'scale(1)' },
        },
        softBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        ecgScan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
