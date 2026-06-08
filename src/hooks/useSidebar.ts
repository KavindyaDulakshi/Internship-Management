import { useState, useCallback } from 'react'

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggle = useCallback(() => setIsOpen(prev => !prev), [])
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggleCollapse = useCallback(() => setIsCollapsed(prev => !prev), [])

  return {
    isOpen,
    isCollapsed,
    toggle,
    open,
    close,
    toggleCollapse,
  }
}
