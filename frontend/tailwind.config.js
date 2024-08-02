/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        keyframes: {
          fade: {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0' },
          },
          touchCLeft: {
            '0%, 100%': { transform: 'translateX(0)' },
            '50%': { transform: 'translateX(2.4rem)' }, // Adjust this value based on your needs
          },
          touchCRight: {
            '0%, 100%': { transform: 'translateX(0)' },
            '50%': { transform: 'translateX(-2.5rem)' }, // Adjust this value based on your needs
          },
        },
        animation: {
          fade: 'fade 1s ease-in-out',
          'touch-c-left': 'touchCLeft 1s ease-in-out',
          'touch-c-right': 'touchCRight 1s ease-in-out',
        },
      },
    },
    plugins: [],
  }