/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'; // Import the default theme

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    // All custom styles go inside the 'extend' object
    extend: {
      colors: {
        'space-dark': '#100F3A', // A deep blue like the background
        'brand-aqua': '#2AF5FF',
        'glow-blue': '#00D1FF',
        'glow-lime': '#CFFF3C',
        'glow-yellow': '#FFD700',
      },

      // fontFamily was moved inside extend
      fontFamily: {
        // This adds 'Poppins' as the primary sans-serif font,
        // but keeps Tailwind's default fonts as fallbacks.
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },

      // boxShadow was moved inside extend
      boxShadow: {
        'glow-blue': '0 0 0 3px rgba(0, 209, 255, 0.8), 1px 1px 0 3px rgba(0, 209, 255, 0.6)',
        'glow-lime': '0 0 15px 5px rgba(207, 255, 60, 0.7)',
        'glow-yellow': '0 0 15px 5px rgba(255, 215, 0, 0.7)',
      },
    },
  },

  plugins: [],
}