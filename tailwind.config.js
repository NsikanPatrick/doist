/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Add tailwindcss to the following extensions
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // backgroundImage: (_) => ({
      //   'custom-background': "url('./src/assets/brownish bg.jpg')",
      //   // You will use it in your page as bg-custom-background
      // })
    },
  },
  plugins: [],
}

