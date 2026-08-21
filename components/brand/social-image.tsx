type SocialImageProps = {
  eyebrow: string
  title: string
  description: string
}

export function SocialImage({ eyebrow, title, description }: SocialImageProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#020817',
        color: '#f8fafc',
        padding: '64px 72px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 620,
          height: 620,
          right: -180,
          top: -260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(40,147,247,0.42), rgba(2,8,23,0) 68%)',
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          position: 'relative',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #2893f7',
            color: '#2893f7',
            fontSize: 27,
            fontWeight: 700,
          }}
        >
          N
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>
            NOVEKIA
          </div>
          <div style={{ marginTop: 5, color: '#8fa8c8', fontSize: 15, letterSpacing: '0.18em' }}>
            SYNERGIES INTELLIGENTES
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 960,
          position: 'relative',
        }}
      >
        <div style={{ color: '#2893f7', fontSize: 19, fontWeight: 700, letterSpacing: '0.16em' }}>
          {eyebrow.toUpperCase()}
        </div>
        <div
          style={{
            marginTop: 22,
            fontSize: 64,
            lineHeight: 1.02,
            fontWeight: 700,
            letterSpacing: '-0.045em',
          }}
        >
          {title}
        </div>
        <div style={{ marginTop: 24, maxWidth: 880, color: '#b7c8e4', fontSize: 24, lineHeight: 1.4 }}>
          {description}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(143,168,200,0.32)',
          paddingTop: 22,
          color: '#8fa8c8',
          fontSize: 16,
          letterSpacing: '0.12em',
          position: 'relative',
        }}
      >
        <span>ENTREPRISE TECHNOLOGIQUE FRANÇAISE</span>
        <span>NOVEKIA.FR</span>
      </div>
    </div>
  )
}
