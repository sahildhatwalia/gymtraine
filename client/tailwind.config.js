/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#000000",
                neonRed: "#ff003c",
                electricBlue: "#00d2ff",
                cardBg: "#111111",
            },
            fontFamily: {
                athletic: ['Outfit', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
