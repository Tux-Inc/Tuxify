/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['DM Sans', 'sans-serif'],
      },
      colors: {
        'base': {
          'dark': '#111827',
          'light': '#e9f3ff',
        },
        'tint-dark': '#1B2329',
        'tint-light': '#F5F7FA',
        'primary': {
            '100': '#E6F2FF',
            '200': '#D6E9FF',
            '300': '#AED4FF',
            '400': '#148eff',
            '500': '#0085FF',
            '600': '#007bef',
            '700': '#006cd7',
            '800': '#005fbe',
        },
        'secondary': {
            '100': '#f2e6ff',
            '200': '#e6ccff',
            '300': '#b300ff',
            '400': '#a300ff',
            '500': '#8c00ff',
            '600': '#7a00e6',
            '700': '#6900cc',
            '800': '#5700b3',
        },
      },
      height: {
        'header': '4rem',
      },
    },
  },
  plugins: [],
}
