'use client'

import { Component, type ReactNode } from 'react'
import Link from 'next/link'

type Props = {
  children: ReactNode
  onClose: () => void
  onRestart: () => void
}

type State = { hasError: boolean }

export class ConciergeErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch() {
    // Intentionally no network logging: this sprint keeps all activity local.
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="fixed bottom-6 right-6 z-[90] w-[min(27.5rem,calc(100vw-3rem))] border border-border bg-[#061225] p-5 text-foreground shadow-2xl">
        <h2 className="text-lg font-semibold">Nova</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Une difficulté empêche de poursuivre cette étape. Vous pouvez recommencer ou contacter directement Novekia.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              this.props.onRestart()
              this.setState({ hasError: false })
            }}
            className="min-h-11 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Recommencer
          </button>
          <Link href="/#contact" className="inline-flex min-h-11 items-center rounded-md border border-border px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Contacter Novekia
          </Link>
          <button type="button" onClick={this.props.onClose} className="min-h-11 px-3 text-sm text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Fermer
          </button>
        </div>
      </div>
    )
  }
}
