// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // make sure this is correct
  theme: {
    extend: {
      screens: {
        customLg: "1238px", // Custom screen size for showing the sidebar
      },
    },
  },
  plugins: [],
};
