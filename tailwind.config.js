module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      'xsm': '400px',
      '460': '460px',
      'sm': '640px',
      'md': '768px',
      'lg': { 'raw': '(min-height: 860px) and (min-width: 1024px)' },
      'safari': { 'raw': 'not all and (min-resolution:.001dpcm)' },
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'mygray': '#EFF0F1',
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif']
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}