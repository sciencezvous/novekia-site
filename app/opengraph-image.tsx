import { ImageResponse } from 'next/og'
import { SocialImage } from '@/components/brand/social-image'

export const alt = 'Novekia — entreprise technologique française'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    <SocialImage
      eyebrow="Novekia"
      title="IA, logiciels et systèmes numériques"
      description="Lead Engine, NovekiAct et services d’ingénierie technologique."
    />,
    size,
  )
}
