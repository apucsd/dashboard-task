"use client"
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // ====== NEXT THEME PROVIDER ======
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}