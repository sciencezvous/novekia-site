import { ImageResponse } from 'next/og'
import { SocialImage } from '@/components/brand/social-image'

export const alt = 'NovekiAct — produit de gouvernance IA développé par Novekia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    <SocialImage
      eyebrow="NovekiAct by Novekia"
      title="Gouvernance des usages IA pour les PME"
      description="Un produit Novekia en développement pour rendre les décisions explicables."
    />,
    size,
  )
}
