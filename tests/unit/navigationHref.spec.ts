import { expect, test } from '@playwright/test'
import type { NavigationTarget } from '../../src/model/navigation'
import { resolveNavigationTargetHref } from '../../src/model/navigationHref'

const pages = [
  {
    id: 'home',
    slug: '/',
    elements: [
      { id: 'hero-section', kind: 'section', anchorId: 'hero' },
      { id: 'text-1', kind: 'text' },
    ],
  },
  {
    id: 'about',
    slug: '/om-oss',
    elements: [
      { id: 'contact-section', kind: 'section', anchorId: 'kontakt' },
    ],
  },
]

test('resolves public page and section hrefs from stable project targets', () => {
  expect(
    resolveNavigationTargetHref(pages, { type: 'page', pageId: 'about' }),
  ).toBe('/om-oss')

  expect(
    resolveNavigationTargetHref(pages, {
      type: 'section',
      pageId: 'about',
      elementId: 'contact-section',
    }),
  ).toBe('/om-oss#kontakt')

  expect(
    resolveNavigationTargetHref(pages, {
      type: 'section',
      pageId: 'home',
      elementId: 'hero-section',
    }),
  ).toBe('/#hero')
})

test('never exposes dangling IDs as a public href', () => {
  const missingPage: NavigationTarget = {
    type: 'page',
    pageId: 'missing-page',
  }
  const missingSection: NavigationTarget = {
    type: 'section',
    pageId: 'about',
    elementId: 'missing-section',
  }

  expect(resolveNavigationTargetHref(pages, missingPage)).toBeNull()
  expect(resolveNavigationTargetHref(pages, missingSection)).toBeNull()
})
