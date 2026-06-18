import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "../../theme";

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-muted transition-colors hover:text-text"
    >
      {mounted ? (isDark ? <Sun size={16} strokeWidth={1.8} /> : <Moon size={16} strokeWidth={1.8} />) : <div className="h-4 w-4" />}
    </button>
  );
}
