import type { MetadataRoute } from 'next'
import { resourceArticles } from '@/lib/resources'
import { servicePages } from '@/lib/service-pages'
import { siteConfig } from '@/lib/site-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const routes = [
    { path: '', priority: 1, changeFrequency: 'monthly' as const },
    { path: '/offres', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/a-propos', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/ressources', priority: 0.8, changeFrequency: 'weekly' as const },
    ...resourceArticles.map((article) => ({
      path: `/ressources/${article.slug}`,
      priority: 0.75,
      changeFrequency: 'monthly' as const,
    })),
    {
      path: '/ressources/checklist-cadrage-ia-locale',
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    ...servicePages.map((service) => ({
      path: `/${service.slug}`,
      priority: 0.8,
      changeFrequency: 'monthly' as const,
    })),
    { path: '/mentions-legales', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/politique-de-confidentialite', priority: 0.3, changeFrequency: 'yearly' as const },
  ]

  return [
    ...routes.map((route) => ({
      url: `${siteConfig.url}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
  ]
}
