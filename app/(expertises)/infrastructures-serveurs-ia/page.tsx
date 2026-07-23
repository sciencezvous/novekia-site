import { ServiceLandingPage } from '@/components/services/service-landing-page'
import {
  createServiceMetadata,
  servicePagesBySlug,
} from '@/lib/service-pages'

const service = servicePagesBySlug['infrastructures-serveurs-ia']

export const metadata = createServiceMetadata(service)

export default function AiInfrastructureServicePage() {
  return <ServiceLandingPage service={service} />
}
