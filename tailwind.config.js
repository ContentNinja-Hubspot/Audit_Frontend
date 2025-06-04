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
    "bg-partner-secondary-1",
    "bg-partner-secondary-2",
    "bg-partner-secondary-3",
    "bg-partner-secondary-4",
    "bg-partner-secondary-5",
    "bg-partner-secondary-default",
    "bg-partner-tertiary-1",
    "bg-partner-tertiary-2",
    "bg-partner-tertiary-3",
    "bg-partner-tertiary-4",
    "bg-partner-tertiary-5",
    "bg-partner-tertiary-hover-1",
    "bg-partner-tertiary-hover-2",
    "bg-partner-tertiary-hover-3",
    "bg-partner-tertiary-hover-4",
    "bg-partner-tertiary-hover-5",
    "bg-partner-tertiary-default",
    "bg-partner-tertiary-hover-default",
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
        "partner-secondary-default":
          "linear-gradient(to right, #9b87f51a, #7e69ab1a)",
        "partner-tertiary-default":
          "linear-gradient(to right, #9b87f51a, #7e69ab1a)",
      },
      backgroundColor: {
        "partner-secondary-1": "#A9C1D9",
        "partner-secondary-2": "#FFA07A",
        "partner-secondary-3": "#98FB98",
        "partner-secondary-4": "#9370DB",
        "partner-secondary-5": "#8A8A8A",
        "partner-tertiary-1": "#F0F4F8",
        "partner-tertiary-hover-1": "#F0F4F8",
        "partner-tertiary-2": "#FFE5B4",
        "partner-tertiary-hover-2": "#FFE5B4",
        "partner-tertiary-3": "#F5FFFA",
        "partner-tertiary-hover-3": "#F5FFFA",
        "partner-tertiary-4": "#E6E6FA",
        "partner-tertiary-hover-4": "#E6E6FA",
        "partner-tertiary-5": "#D6D6D6",
        "partner-tertiary-hover-5": "#D6D6D6",
      },
    },
  },
  plugins: [],
};
