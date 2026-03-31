/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7366ff',
          rgb: '115, 102, 255',
        },
        secondary: '#f73164',
        success: '#51bb25',
        info: '#a927f9',
        warning: '#f8d62b',
        danger: '#dc3545',
        'shop-primary': '#00b894',
        'shop-accent': '#fab1a0',
        'dark-sidebar': '#1a1f36',
        'body-bg': '#f5f7fb',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'sm': '0 2px 4px rgba(0,0,0,0.05)',
        'md': '0 4px 12px rgba(0,0,0,0.08)',
        'lg': '0 10px 25px rgba(0,0,0,0.1)',
      }
    },
  },
  plugins: [],
}
