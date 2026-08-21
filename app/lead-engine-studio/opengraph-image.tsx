import { ImageResponse } from 'next/og'
import { SocialImage } from '@/components/brand/social-image'

export const alt = 'Lead Engine — produit de prospection B2B développé par Novekia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    <SocialImage
      eyebrow="Lead Engine by Novekia"
      title="Prospection B2B fondée sur les signaux"
      description="Qualification documentée, sources traçables et supervision humaine."
    />,
    size,
  )
}
