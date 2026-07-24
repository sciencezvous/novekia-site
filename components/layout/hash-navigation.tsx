'use client'

import { useEffect } from 'react'

function scrollToHash(hash = window.location.hash) {
  const id = decodeURIComponent(hash.slice(1))
  if (!id) return
  document.getElementById(id)?.scrollIntoView({ block: 'start' })
}

export function HashNavigation() {
  useEffect(() => {
    function scheduleScroll(hash = window.location.hash) {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => scrollToHash(hash)),
      )
    }

    function handleLocationChange() {
      scheduleScroll()
    }

    function handleAnchorClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      const target = event.target
      if (!(target instanceof Element)) return

      const anchor = target.closest<HTMLAnchorElement>('a[href*="#"]')
      if (!anchor || anchor.hasAttribute('download') || anchor.target === '_blank') {
        return
      }

      const destination = new URL(anchor.href, window.location.href)
      if (
        destination.origin !== window.location.origin ||
        destination.pathname !== window.location.pathname ||
        !destination.hash
      ) {
        return
      }

      const sectionId = decodeURIComponent(destination.hash.slice(1))
      if (!document.getElementById(sectionId)) return

      event.preventDefault()
      if (window.location.hash !== destination.hash) {
        window.history.pushState(null, '', destination.hash)
      }
      scheduleScroll(destination.hash)
    }

    scheduleScroll()
    document.fonts.ready.then(() => scheduleScroll())
    window.addEventListener('hashchange', handleLocationChange)
    window.addEventListener('popstate', handleLocationChange)
    document.addEventListener('click', handleAnchorClick)

    return () => {
      window.removeEventListener('hashchange', handleLocationChange)
      window.removeEventListener('popstate', handleLocationChange)
      document.removeEventListener('click', handleAnchorClick)
    }
  }, [])

  return null
}
