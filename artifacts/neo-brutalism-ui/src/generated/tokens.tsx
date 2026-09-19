/* GENERATED FROM tokens.json -- DO NOT EDIT. Run scripts/build-tokens.mjs. */
// Portable design tokens (colors as hex). Web consumes the theme via
// src/index.css; mobile (Expo) and any other platform import this object so the
// whole product shares one source of truth.
export const tokens = {
  "color": {
    "light": {
      "background": "#FFF59F",
      "foreground": "#000000",
      "border": "#000000",
      "card": "#FFFFFF",
      "cardForeground": "#000000",
      "popover": "#FFFFFF",
      "popoverForeground": "#000000",
      "primary": "#A6FAFF",
      "primaryForeground": "#000000",
      "secondary": "#FFA6F6",
      "secondaryForeground": "#000000",
      "muted": "#D4D4D4",
      "mutedForeground": "#676767",
      "accent": "#B8FF9F",
      "accentForeground": "#000000",
      "destructive": "#FF9F9F",
      "destructiveForeground": "#000000",
      "input": "#000000",
      "ring": "#918EFA",
      "chart1": "#A8A6FF",
      "chart2": "#FFA6F6",
      "chart3": "#FF965B",
      "chart4": "#FFE500",
      "chart5": "#79F7FF",
      "sidebar": "#A8A6FF",
      "sidebarForeground": "#000000",
      "sidebarBorder": "#000000",
      "sidebarPrimary": "#FFF066",
      "sidebarPrimaryForeground": "#000000",
      "sidebarAccent": "#FFA6F6",
      "sidebarAccentForeground": "#000000",
      "sidebarRing": "#000000"
    },
    "dark": {
      "background": "#171717",
      "foreground": "#FFFFFF",
      "border": "#FFFFFF",
      "card": "#242424",
      "cardForeground": "#FFFFFF",
      "popover": "#242424",
      "popoverForeground": "#FFFFFF",
      "primary": "#53F2FC",
      "primaryForeground": "#000000",
      "secondary": "#FA7FEE",
      "secondaryForeground": "#000000",
      "muted": "#3A3A3A",
      "mutedForeground": "#D4D4D4",
      "accent": "#7DF752",
      "accentForeground": "#000000",
      "destructive": "#F76363",
      "destructiveForeground": "#000000",
      "input": "#FFFFFF",
      "ring": "#A8A6FF",
      "chart1": "#A8A6FF",
      "chart2": "#FA8CEF",
      "chart3": "#FA8543",
      "chart4": "#FFE500",
      "chart5": "#53F2FC",
      "sidebar": "#242424",
      "sidebarForeground": "#FFFFFF",
      "sidebarBorder": "#FFFFFF",
      "sidebarPrimary": "#FFF066",
      "sidebarPrimaryForeground": "#000000",
      "sidebarAccent": "#807DFA",
      "sidebarAccentForeground": "#000000",
      "sidebarRing": "#FFFFFF"
    }
  },
  "fontFamily": {
    "sans": [
      "Arial",
      "Helvetica",
      "sans-serif"
    ],
    "serif": [
      "Georgia",
      "serif"
    ],
    "mono": [
      "Courier New",
      "monospace"
    ]
  },
  "radius": "0.375rem",
  "spacing": "0.25rem"
} as const;

export type Tokens = typeof tokens;
export default tokens;
