import { theme as appTheme } from "./src/theme/colors.ts";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: appTheme.colors.background,
        background2: appTheme.colors.background2,
        background3: appTheme.colors.background3,
        background4: appTheme.colors.background4,
        background5: appTheme.colors.background5,
        primary: appTheme.colors.primary,
        secondary: appTheme.colors.secondary,

        surface: {
          primary: appTheme.colors.surface.primary,
          secondary: appTheme.colors.surface.secondary,
        },

        text: {
          primary: appTheme.colors.text.primary,
          secondary: appTheme.colors.text.secondary,
          muted: appTheme.colors.text.muted,
          heading: appTheme.colors.text.heading,
        },

        accent: {
          soft: appTheme.colors.accent.soft,
          cta: appTheme.colors.accent.cta,
        },

        success: {
          background: appTheme.colors.success.background,
          text: appTheme.colors.success.text,
        },

        border: {
          subtle: appTheme.colors.border.subtle,
          card: appTheme.colors.border.card,
        },
      },

      fontFamily: {
        display: ["Playfair Display", "serif"],
        heading: [appTheme.fonts.heading],
        body: [appTheme.fonts.body],
        mono: [appTheme.fonts.mono],
      },

      fontWeight: {
        semibold: "600",
        regular: "400",
      },
    },
  },
  plugins: [],
};
