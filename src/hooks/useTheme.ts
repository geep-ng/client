import { useEffect, useState } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      if (theme === "system") {
        document.documentElement.classList.toggle("dark", mediaQuery.matches);
      }
    };
    applyTheme();
    mediaQuery.addEventListener("change", applyTheme);
    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next =
        prev === "system" ? "light" : prev === "light" ? "dark" : "system";
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else if (next === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.toggle(
          "dark",
          window.matchMedia("(prefers-color-scheme: dark)").matches
        );
      }
      return next;
    });
  };

  return { theme, toggleTheme };
};