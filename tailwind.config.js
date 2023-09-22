module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px'
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      backgroundImage: {
        bkimage: "url('./banner1980_1080.png')"
      },
      colors: {
        app: {
          gray: '#545554',
          button: '#84cc16',
          bg: '#333333'
        },
        lime: {
          400: '#A3E635',
          500: '#84cc16'
        },
        zinc: {
          700: '#3f3f46'
        }
      }
    }
  },
  variants: {},
  plugins: []
}
