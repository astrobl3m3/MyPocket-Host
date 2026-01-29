import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'

type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setThemeKV] = useKV<Theme>('app-theme', 'light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    if (theme) {
      root.classList.add(theme)
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setThemeKV(current => current === 'light' ? 'dark' : 'light')
  }

  return { theme, toggleTheme, mounted }
}
