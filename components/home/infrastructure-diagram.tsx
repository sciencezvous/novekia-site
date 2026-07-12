'use client'

import { cn } from '@/lib/utils'

/**
 * Diagramme d'infrastructure locale — CSS + SVG uniquement.
 * Nœuds : IA locale (centre), Données, Applications, Calcul GPU, Sécurité.
 * Animations légères, respecte prefers-reduced-motion.
 */
export function InfrastructureDiagram({ className }: { className?: string }) {
  const cx = 200
  const cy = 200
  const r = 82

  // Positions angulaires des 4 nœuds périphériques (en degrés, 0 = haut)
  const nodes: { label: string; angle: number; sub?: string }[] = [
    { label: 'Données',      angle: -90  },
    { label: 'Applications', angle:   0  },
    { label: 'Calcul GPU',   angle:  90  },
    { label: 'Sécurité',     angle: 180  },
  ]

  function polar(angleDeg: number, radius: number) {
    const rad = (angleDeg * Math.PI) / 180
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    }
  }

  return (
    <div
      className={cn('relative select-none', className)}
      aria-hidden="true"
      role="presentation"
    >
      {/* Grille technique discrète */}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full opacity-[0.07]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="400" fill="url(#grid)" />
      </svg>

      {/* Diagramme principal */}
      <svg
        viewBox="0 0 400 400"
        className="relative h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Dégradé ligne bleue */}
          <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#006bff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#23a7ff" stopOpacity="0.2" />
          </linearGradient>
          {/* Dégradé nœud central */}
          <radialGradient id="core-grad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#23a7ff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#006bff" stopOpacity="0.08" />
          </radialGradient>
          {/* Pulsation douce */}
          <filter id="glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Lignes de connexion nœud → centre */}
        {nodes.map(({ angle, label }) => {
          const node = polar(angle, r)
          return (
            <line
              key={`line-${label}`}
              x1={cx}
              y1={cy}
              x2={node.x}
              y2={node.y}
              stroke="url(#line-grad)"
              strokeWidth="1"
              strokeDasharray="4 3"
              className="animate-[dash_8s_linear_infinite] [stroke-dashoffset:0] motion-reduce:animate-none"
            />
          )
        })}

        {/* Orbite discrète */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#006bff"
          strokeWidth="0.5"
          strokeOpacity="0.2"
          strokeDasharray="2 6"
        />

        {/* Nœuds périphériques */}
        {nodes.map(({ angle, label }) => {
          const pos = polar(angle, r)
          return (
            <g key={label} className="animate-[float_6s_ease-in-out_infinite] motion-reduce:animate-none" style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}>
              {/* Halo */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={22}
                fill="#006bff"
                fillOpacity="0.06"
                stroke="#006bff"
                strokeWidth="0.5"
                strokeOpacity="0.3"
              />
              {/* Point central */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={4}
                fill="#23a7ff"
                fillOpacity="0.9"
                filter="url(#glow)"
              />
              {/* Label */}
              <text
                x={pos.x}
                y={pos.y + (angle === -90 ? -30 : angle === 90 ? 34 : 5)}
                textAnchor={angle === 0 ? 'start' : angle === 180 ? 'end' : 'middle'}
                dx={angle === 0 ? 14 : angle === 180 ? -14 : 0}
                fill="#dceeff"
                fontSize="11"
                fontFamily="var(--font-mono, monospace)"
                letterSpacing="0.1em"
                opacity="0.75"
              >
                {label}
              </text>
            </g>
          )
        })}

        {/* Nœud central — IA locale */}
        <g>
          {/* Halo externe animé */}
          <circle
            cx={cx}
            cy={cy}
            r={36}
            fill="url(#core-grad)"
            stroke="#006bff"
            strokeWidth="0.75"
            strokeOpacity="0.4"
            className="animate-[pulse_4s_ease-in-out_infinite] motion-reduce:animate-none"
          />
          {/* Cercle interne */}
          <circle
            cx={cx}
            cy={cy}
            r={24}
            fill="#06265f"
            stroke="#23a7ff"
            strokeWidth="1"
            strokeOpacity="0.6"
            filter="url(#glow)"
          />
          {/* Croix technique */}
          <line x1={cx - 8} y1={cy} x2={cx + 8} y2={cy} stroke="#23a7ff" strokeWidth="1" strokeOpacity="0.7" />
          <line x1={cx} y1={cy - 8} x2={cx} y2={cy + 8} stroke="#23a7ff" strokeWidth="1" strokeOpacity="0.7" />
          {/* Label principal */}
          <text
            x={cx}
            y={cy - 40}
            textAnchor="middle"
            fill="#dceeff"
            fontSize="10.5"
            fontFamily="var(--font-mono, monospace)"
            fontWeight="500"
            letterSpacing="0.12em"
            opacity="0.9"
          >
            IA LOCALE
          </text>
        </g>

        {/* Coins décoratifs */}
        <path d="M 8 32 L 8 8 L 32 8"   fill="none" stroke="#006bff" strokeWidth="1" strokeOpacity="0.3" />
        <path d="M 368 32 L 368 8 L 344 8" fill="none" stroke="#006bff" strokeWidth="1" strokeOpacity="0.3" />
        <path d="M 8 368 L 8 392 L 32 392"  fill="none" stroke="#006bff" strokeWidth="1" strokeOpacity="0.3" />
        <path d="M 368 368 L 368 392 L 344 392" fill="none" stroke="#006bff" strokeWidth="1" strokeOpacity="0.3" />
      </svg>
    </div>
  )
}
