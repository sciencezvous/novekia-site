import { ServiceLandingPage } from '@/components/services/service-landing-page'
import {
  createServiceMetadata,
  servicePagesBySlug,
} from '@/lib/service-pages'

const service = servicePagesBySlug['intelligence-artificielle-locale']

export const metadata = createServiceMetadata(service)

export default function LocalAiServicePage() {
  return <ServiceLandingPage service={service} />
}
