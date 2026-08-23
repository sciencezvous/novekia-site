import type { MetadataRoute } from 'next'
import { aiNewsArticles } from '@/lib/ai-news'
import { resourceArticles } from '@/lib/resources'
import { servicePages } from '@/lib/service-pages'
import { siteConfig } from '@/lib/site-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: '', priority: 1, changeFrequency: 'monthly' as const },
    { path: '/produits', priority: 0.95, changeFrequency: 'monthly' as const },
    { path: '/lead-engine-studio', priority: 0.95, changeFrequency: 'monthly' as const },
    { path: '/novekiact', priority: 0.95, changeFrequency: 'monthly' as const },
    { path: '/solutions', priority: 0.95, changeFrequency: 'monthly' as const },
    { path: '/offres', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/audit', priority: 0.95, changeFrequency: 'monthly' as const },
    { path: '/audit-approfondi', priority: 0.95, changeFrequency: 'monthly' as const },
    { path: '/preuves', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/a-propos', priority: 0.9, changeFrequency: 'monthly' as const },
    {
      path: '/auteurs/andy-legrand',
      priority: 0.65,
      changeFrequency: 'monthly' as const,
    },
    { path: '/ressources', priority: 0.8, changeFrequency: 'weekly' as const },
    {
      path: '/outils/dimensionnement-ia',
      priority: 0.85,
      changeFrequency: 'monthly' as const,
    },
    {
      path: '/actualites-ia',
      priority: 0.85,
      changeFrequency: 'weekly' as const,
    },
    ...aiNewsArticles.map((article) => ({
      path: `/actualites-ia/${article.slug}`,
      priority: 0.8,
      changeFrequency: 'monthly' as const,
      lastModified: article.modifiedAt,
    })),
    ...resourceArticles.map((article) => ({
      path: `/ressources/${article.slug}`,
      priority: 0.75,
      changeFrequency: 'monthly' as const,
      lastModified: article.modifiedAt,
    })),
    {
      path: '/ressources/checklist-cadrage-ia-locale',
      priority: 0.7,
      changeFrequency: 'monthly' as const,
      lastModified: '2026-07-24',
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
      ...('lastModified' in route
        ? { lastModified: route.lastModified }
        : {}),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
  ]
}
