/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // تفعيل الوضع الليلي يدوياً
  theme: {
    extend: {
      colors: {
        titanium: {
          950: '#09090B', // خلفية التطبيق
          900: '#18181B', // خلفية البطاقات
          800: '#27272A', // حدود البطاقات
        },
        cyber: {
          cyan: '#06B6D4',
          indigo: '#4338CA',
        },
        finance: {
          green: '#10B981',
          red: '#F43F5E',
        }
      },
      fontFamily: {
        arabic: ['"IBM Plex Sans Arabic"', 'sans-serif'],
        numbers: ['"Space Grotesk"', 'monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 15px -3px rgba(16, 185, 129, 0.4)',
        'glow-red': '0 0 15px -3px rgba(244, 63, 94, 0.4)',
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.5)',
      }
    },
  },
  plugins: [],
}
