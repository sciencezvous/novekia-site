'use client'

import { useEffect } from 'react'

function scrollToCurrentHash() {
  const id = decodeURIComponent(window.location.hash.slice(1))
  if (!id) return
  document.getElementById(id)?.scrollIntoView({ block: 'start' })
}

export function HashNavigation() {
  useEffect(() => {
    function scheduleScroll() {
      requestAnimationFrame(() => requestAnimationFrame(scrollToCurrentHash))
    }

    scheduleScroll()
    document.fonts.ready.then(scheduleScroll)
    window.addEventListener('hashchange', scheduleScroll)

    return () => window.removeEventListener('hashchange', scheduleScroll)
  }, [])

  return null
}
