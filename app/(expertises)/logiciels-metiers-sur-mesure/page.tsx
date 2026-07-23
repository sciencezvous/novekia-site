import { ServiceLandingPage } from '@/components/services/service-landing-page'
import {
  createServiceMetadata,
  servicePagesBySlug,
} from '@/lib/service-pages'

const service = servicePagesBySlug['logiciels-metiers-sur-mesure']

export const metadata = createServiceMetadata(service)

export default function SoftwareServicePage() {
  return <ServiceLandingPage service={service} />
}
