"use strict";
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./views/*.{html,js,ejs}", "./views/**/*.{html,js,ejs}"],
    theme: {
        colors: {
            "primary": "#3498db",
            "black": "#000"
        },
        extend: {},
    },
    plugins: [],
};
