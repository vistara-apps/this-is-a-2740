/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(220, 15%, 98%)',
        surface: 'hsl(0, 0%, 100%)',
        primary: 'hsl(200, 80%, 50%)',
        accent: 'hsl(160, 70%, 45%)',
        error: 'hsl(0, 70%, 50%)',
        'text-primary': 'hsl(220, 15%, 15%)',
        'text-secondary': 'hsl(220, 15%, 45%)',
        'dark-bg': 'hsl(240, 15%, 8%)',
        'dark-surface': 'hsl(240, 15%, 12%)',
        'dark-card': 'hsl(240, 15%, 16%)',
        'purple-primary': 'hsl(260, 70%, 60%)',
        'purple-light': 'hsl(260, 70%, 70%)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 16px hsla(0, 0%, 0%, 0.12)',
        'modal': '0 8px 32px hsla(0, 0%, 0%, 0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 250ms cubic-bezier(0.22,1,0.36,1)',
        'slide-up': 'slideUp 250ms cubic-bezier(0.22,1,0.36,1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}