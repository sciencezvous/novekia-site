import { ServiceLandingPage } from '@/components/services/service-landing-page'
import {
  createServiceMetadata,
  servicePagesBySlug,
} from '@/lib/service-pages'

const service = servicePagesBySlug['creation-site-web-seo-geo']

export const metadata = createServiceMetadata(service)

export default function SeoGeoWebServicePage() {
  return <ServiceLandingPage service={service} />
}
