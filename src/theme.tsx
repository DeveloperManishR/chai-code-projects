"use client";

import { useTheme as useNextTheme } from "next-themes";

export { ThemeProvider } from "next-themes";

export const useTheme = () => {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const isDark = resolvedTheme === "dark";
  const toggle = () => setTheme(isDark ? "light" : "dark");
  return { isDark, toggle, theme, setTheme };
};
