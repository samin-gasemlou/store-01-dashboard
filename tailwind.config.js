/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",   // ← content max width
      "2xl": "1440px" // ← figma frame
    },
 extend: {
      colors: {
        primary: "#2B4168",       // 43 65 104
        secondary: "#EFEFEF",     // 239 239 239
        accent: "#F59E0B",        // 245 158 11

        text: {
          main: "#111827",        // 17 24 39
          muted: "#6B7280",       // 107 114 128
        },

        bg: {
          main: "#4287f5",        //x
          soft: "#F2F3F5",        // 242 243 245
        },

        border: "#E5E7EB",        // 229 231 235

        status: {
          success: "#22C55E",     // 34 197 94
          error: "#EF4444",       // 239 68 68
          warning: "#F59E0B",     // 245 158 11
        },
      },
    },
    },
  plugins: [],
};
