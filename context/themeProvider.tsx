"use client";

import {
  useTheme as NextUseTheme,
  ThemeProvider as NextThemesProvider,
} from "next-themes";

export const ThemeProvider = ({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};

export const useTheme = () => NextUseTheme();
