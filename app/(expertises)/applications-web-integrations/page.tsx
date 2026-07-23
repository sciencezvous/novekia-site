import { ServiceLandingPage } from '@/components/services/service-landing-page'
import {
  createServiceMetadata,
  servicePagesBySlug,
} from '@/lib/service-pages'

const service = servicePagesBySlug['applications-web-integrations']

export const metadata = createServiceMetadata(service)

export default function WebApplicationsServicePage() {
  return <ServiceLandingPage service={service} />
}
