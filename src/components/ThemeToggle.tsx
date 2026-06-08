import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { Button } from './ui/Button'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-10 h-10 text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
      aria-label="Toggle dark/light mode"
    >
      {theme === 'dark' ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all duration-300 rotate-0 scale-100" />
      )}
    </Button>
  )
}
