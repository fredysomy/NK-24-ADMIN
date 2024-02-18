/** @type {import('tailwindcss').Config} */
import { defineConfig } from 'vite-plugin-windicss';
const defaultTheme = require('tailwindcss/defaultTheme');
 export default defineConfig({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pop:['Poppins', ...defaultTheme.fontFamily.sans],
      }
    },
  },
  plugins: [],
});

