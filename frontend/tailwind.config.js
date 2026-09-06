/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
      },
      colors: {
        // Values come from CSS custom properties (see index.css) so that
        // switching data-theme on <html> re-themes every resala-* class
        // instantly, with no JS re-render or Tailwind rebuild needed.
        resala: {
          50: 'rgb(var(--resala-50) / <alpha-value>)',
          100: 'rgb(var(--resala-100) / <alpha-value>)',
          200: 'rgb(var(--resala-200) / <alpha-value>)',
          300: 'rgb(var(--resala-300) / <alpha-value>)',
          400: 'rgb(var(--resala-400) / <alpha-value>)',
          500: 'rgb(var(--resala-500) / <alpha-value>)',
          600: 'rgb(var(--resala-600) / <alpha-value>)',
          700: 'rgb(var(--resala-700) / <alpha-value>)',
          800: 'rgb(var(--resala-800) / <alpha-value>)',
          900: 'rgb(var(--resala-900) / <alpha-value>)',
          950: 'rgb(var(--resala-950) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};
