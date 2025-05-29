/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    "bg-partner-gradient-1",
    "bg-partner-gradient-2",
    "bg-partner-gradient-3",
    "bg-partner-gradient-4",
    "bg-partner-gradient-5",
    "bg-partner-gradient-default",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "partner-gradient-1": "linear-gradient(to right, #F0F4F8, #ffffff)", // Trust & Stability
        "partner-gradient-2": "linear-gradient(to right, #FFE5B4, #ffffff)", // Innovation & Energy
        "partner-gradient-3": "linear-gradient(to right, #F5FFFA, #ffffff)", // Growth & Sustainability
        "partner-gradient-4": "linear-gradient(to right, #E6E6FA, #ffffff)", // Luxury & Sophistication
        "partner-gradient-5": "linear-gradient(to right, #D6D6D6, #ffffff)", // Modern Minimal
        "partner-gradient-default":
          "linear-gradient(to right, #e3ffff, #e6e4ef)", // Default
      },
    },
  },
  plugins: [],
};
