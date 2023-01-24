module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',

        // Or if using `src` directory:
        './src/**/*.{js,ts,jsx,tsx}'
    ],
    purge: [],
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
                royalblue: {
                    50: '#f8fafa',
                    100: '#eceffa',
                    200: '#d9d6f6',
                    300: '#b8b1e9',
                    400: '#9c88da',
                    500: '#8364cd',
                    600: '#6c48b7',
                    700: '#523693',
                    800: '#382568',
                    900: '#20183e'
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