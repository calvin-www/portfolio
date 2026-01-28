"use client";

import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
      <Button
          variant="ghost"
          type="button"
          size="icon"
          className="size-16 px-2"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <SunIcon className="h-6 w-6 text-neutral-800 dark:hidden dark:text-neutral-200" />
        <MoonIcon className="hidden h-6 w-6 text-neutral-800 dark:block dark:text-neutral-200" />
      </Button>
  );
}
