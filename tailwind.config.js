/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366F1",
          light: "#EEF2FF",
          dark: "#4F46E5",
        },
        success: {
          DEFAULT: "#10B981",
          light: "#ECFDF5",
        },
        danger: {
          DEFAULT: "#EF4444",
          light: "#FEF2F2",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FFFBEB",
        },
        neutral: {
          900: "#111827",
          700: "#374151",
          500: "#6B7280",
          300: "#D1D5DB",
          200: "#E5E7EB",
          100: "#F3F4F6",
          50:  "#F9FAFB",
        },
        surface: "#FFFFFF",
      },
    },
  },
  plugins: [],
};
