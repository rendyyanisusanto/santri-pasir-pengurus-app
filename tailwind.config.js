/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1e805c',
                    50: '#f2fcf7',
                    100: '#e1f8eb',
                    200: '#c5eed9',
                    300: '#98dfbf',
                    400: '#64c89f',
                    500: '#3ba983',
                    600: '#1e805c', // Main brand color moved to 600 for better contrast in some contexts, but DEFAULT is still accurate
                    700: '#18664b',
                    800: '#15513d',
                    900: '#124334',
                    950: '#0a251e',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
