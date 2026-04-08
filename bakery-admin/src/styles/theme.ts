export const theme = {
  fonts: {
    heading: "Playfair Display, serif",
    body: "JetBrains Mono, monospace",
    mono: "JetBrains Mono, monospace",
  },

  colors: {
    background: "#E8D1D8",
    background2: "#F9F2F4",
    background3: "#FFF8FA",
    background4: "#F7DCE6",
    background5: "#F5EDF1",

    primary: "#D96E97",
    secondary: "#bc2d53",

    surface: {
      primary: "#FFFDFD",
      secondary: "#FFF7FA",
    },

    text: {
      primary: "#7A3E55",
      secondary: "#7D5265",
      muted: "#7A6870",
      heading: "#3A1F2B",
    },

    accent: {
      soft: "#F7EEF1",
      cta: "#FF8400",
    },

    success: {
      background: "#EEF7F0",
      text: "#264A31",
    },

    border: {
      subtle: "#EFCFDB",
      card: "#F0D8E2",
    },
  },
} as const;

export type Theme = typeof theme;
