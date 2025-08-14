/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#4D148C",
          orange: "#FF6600",
          ink: "#1F2937"
        }
      },
      borderRadius: { xl: "14px" }
    }
  },
  plugins: []
}
