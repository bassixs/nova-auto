import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { CONTACT, LEGAL, LOCATIONS, SITE, yandexCardUrl } from './src/data/business.js'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

/** Schema.org: организация и обе автомойки. Рейтинги с Яндекс Карт сюда намеренно не попадают. */
function schema() {
  const orgId = `${SITE.url}#organization`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': orgId,
        name: SITE.name,
        url: SITE.url,
        logo: `${SITE.url}brand/logo-512.png`,
        ...(CONTACT.phone && { telephone: CONTACT.phone }),
        sameAs: CONTACT.socials.map((s) => s.url),
      },
      ...LOCATIONS.map((loc) => ({
        '@type': 'AutoWash',
        '@id': `${SITE.url}#${loc.id}`,
        name: `${SITE.name} — ${loc.street}`,
        description: SITE.lead,
        url: SITE.url,
        image: `${SITE.url}brand/og.jpg`,
        parentOrganization: { '@id': orgId },
        address: {
          '@type': 'PostalAddress',
          streetAddress: loc.street,
          addressLocality: SITE.city,
          addressRegion: 'Калужская область',
          addressCountry: 'RU',
        },
        geo: { '@type': 'GeoCoordinates', latitude: loc.geo.lat, longitude: loc.geo.lon },
        hasMap: yandexCardUrl(loc),
        ...(loc.phone && { telephone: loc.phone }),
        ...(loc.hours && {
          openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: DAYS,
            opens: loc.hours.opens,
            closes: loc.hours.closes,
          },
        }),
      })),
    ],
  }
}

const blank = (value) => value || '<mark>[указать]</mark>'

/** Подставляет в HTML-страницы данные из src/data/business.js: токены вида {{NAME}}. */
function htmlData() {
  const tokens = {
    SITE_URL: SITE.url,
    SITE_NAME: SITE.name,
    SITE_TITLE: SITE.title,
    SITE_DESCRIPTION: SITE.description,
    SITE_TAGLINE: SITE.tagline,
    SITE_LEAD: SITE.lead,
    SCHEMA_JSON: JSON.stringify(schema()).replace(/</g, '\\u003c'),
    OPERATOR: blank(LEGAL.operatorName),
    INN: blank(LEGAL.inn),
    OGRN: blank(LEGAL.ogrn),
    LEGAL_ADDRESS: blank(LEGAL.legalAddress),
    EMAIL: blank(LEGAL.email),
    PHONE: blank(CONTACT.phone),
    POLICY_DATE: blank(LEGAL.policyDate),
    DRAFT_CLASS: LEGAL.approved ? '' : 'is-draft',
    ROBOTS: LEGAL.approved ? 'index, follow' : 'noindex',
  }
  return {
    name: 'html-data',
    transformIndexHtml: (html) => html.replace(/\{\{(\w+)\}\}/g, (match, key) => (key in tokens ? tokens[key] : match)),
  }
}

// Relative base lets the build work under /nova-auto/ on GitHub Pages and on a custom domain alike
export default defineConfig({
  base: './',
  plugins: [react(), htmlData()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        privacy: resolve(import.meta.dirname, 'privacy.html'),
      },
    },
  },
})
