export const colors = {
  // Primary Colors
  primary: "#009FE3",      // R: 0, G: 159, B: 227
  primaryDark: "#007BB8",  // Darker shade for hover states
  
  // Grayscale Colors
  darkGray: "#626260",     // R: 98, G: 98, B: 96
  mediumGray: "#9D9D9C",   // R: 157, G: 157, B: 156
  charcoal: "#3C3C3B",     // R: 60, G: 60, B: 59
  navy: "#181B33",         // R: 24, G: 27, B: 51
  
  // Semantic Colors
  background: "#FFFFFF",
  foreground: "#3C3C3B",
  muted: "#9D9D9C",
  border: "#E5E5E5",
  
  // Utility Colors
  white: "#FFFFFF",
  black: "#000000",
}

// CSS Custom Properties for Tailwind
export const cssVariables = {
  "--primary": colors.primary,
  "--primary-dark": colors.primaryDark,
  "--dark-gray": colors.darkGray,
  "--medium-gray": colors.mediumGray,
  "--charcoal": colors.charcoal,
  "--navy": colors.navy,
  "--background": colors.background,
  "--foreground": colors.foreground,
  "--muted": colors.muted,
  "--border": colors.border,
}
