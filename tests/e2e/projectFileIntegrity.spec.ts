import { expect, test, type Page } from '@playwright/test'
import { projectFileFixture } from '../fixtures/projectFileFixture'

async function openFile(page: Page, content: unknown) {
  await page.locator('.project-file-controls__input').setInputFiles({
    name: 'test.website-project', mimeType: 'application/json',
    buffer: Buffer.from(typeof content === 'string' ? content : JSON.stringify(content)),
  })
}

async function expectImages(page: Page) {
  for (const selector of [
    '.image-element__image',
    '.header-element__logo',
    '.hero-element__image',
  ]) {
    const image = page.locator(selector)
    await expect(image).toBeVisible()
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(1)
  }
  await expect(page.getByText('Bildet mangler', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Logo mangler', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Hero-bildet mangler', { exact: true })).toHaveCount(0)
}

test('shared image/logo round-trip survives a new session, mobile view and editing', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()
  const fixture = projectFileFixture()
  await openFile(page, fixture)
  await expect(page.getByRole('status')).toHaveText('Åpnet «Bilder og logo».')
  await expectImages(page)
  await page.getByRole('button', { name: 'Vis elementer (3)' }).click()
  await expect(page.locator('.project-navigator__element')).toHaveCount(3)
  await page.locator('.project-navigator__page-button').filter({ hasText: 'Side 2' }).click()
  await expect(page.locator('.project-navigator__element')).toHaveCount(1)
  await page.locator('.project-navigator__page-button').filter({ hasText: 'Forside' }).click()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Lagre prosjektfil', exact: true }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('bilder-og-logo.website-project')
  const path = await download.path()
  await page.reload()
  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()
  await page.locator('.project-file-controls__input').setInputFiles(path!)
  await expect(page.getByRole('status')).toHaveText('Åpnet «Bilder og logo».')
  await expect(page.getByText('2 sider', { exact: true })).toBeVisible()
  await expectImages(page)
  await page.getByRole('button', { name: 'Mobil', exact: true }).click()
  await expectImages(page)
  await page.getByRole('button', { name: 'Skrivebord', exact: true }).click()
  await expectImages(page)
  await page.getByRole('button', { name: '+ Ny side', exact: true }).click()
  await expect(page.getByText('3 sider', { exact: true })).toBeVisible()
  await page.getByLabel('Velg side').selectOption({ label: 'Forside' })
  await expectImages(page)
})

test('corrupt files preserve project, image/logo URLs and editability', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()
  await openFile(page, projectFileFixture())
  await expectImages(page)
  const originalSrc = await page.locator('.image-element__image').getAttribute('src')
  const corruptions = [
    (f: ReturnType<typeof projectFileFixture>) => { f.formatVersion = 99 as 1 },
    (f: ReturnType<typeof projectFileFixture>) => { f.assets = [] },
    (f: ReturnType<typeof projectFileFixture>) => { f.assets.push({ ...f.assets[0] }) },
    (f: ReturnType<typeof projectFileFixture>) => { f.assets[0].base64 = '%'.repeat(f.assets[0].base64.length) },
    (f: ReturnType<typeof projectFileFixture>) => { f.assets[0].base64 = 'A'.repeat(f.assets[0].base64.length) },
    (f: ReturnType<typeof projectFileFixture>) => { f.assets[0].metadata.width = 2 },
    (f: ReturnType<typeof projectFileFixture>) => { f.assets[0].metadata.mimeType = 'image/jpeg' },
    (f: ReturnType<typeof projectFileFixture>) => { f.assets[0].assetId = 'cfa1cdee-86a6-4dee-affe-542181600034' as typeof f.assets[0]['assetId'] },
  ]
  const candidates: unknown[] = ['{', { broken: true }, ...corruptions.map((corrupt) => {
    const fixture = projectFileFixture()
    corrupt(fixture)
    return fixture
  })]
  for (const candidate of candidates) {
    await openFile(page, candidate)
    await expect(page.getByRole('status')).toHaveText('Prosjektfilen er ugyldig eller skadet.')
    await expect(page.getByText('2 sider', { exact: true })).toBeVisible()
    await expect(page.locator('.image-element__image')).toHaveAttribute('src', originalSrc!)
    await expectImages(page)
  }
  await page.getByRole('button', { name: '+ Ny side', exact: true }).click()
  await expect(page.getByText('3 sider', { exact: true })).toBeVisible()
})

test('failed URL allocation rolls back new URLs and preserves all current assets', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()
  await openFile(page, projectFileFixture())
  await expectImages(page)
  const originalSrc = await page.locator('.image-element__image').getAttribute('src')
  await page.evaluate(() => {
    const create = URL.createObjectURL.bind(URL)
    const revoke = URL.revokeObjectURL.bind(URL)
    const tracker = { created: [] as string[], revoked: [] as string[], fail: true }
    Object.assign(window, { urlTracker: tracker })
    URL.createObjectURL = (blob) => {
      if (tracker.fail && tracker.created.length === 1) throw Error('Allocation failed')
      const url = create(blob)
      tracker.created.push(url)
      return url
    }
    URL.revokeObjectURL = (url) => { tracker.revoked.push(url); revoke(url) }
  })
  const fixture = projectFileFixture()
  const secondId = 'cfa1cdee-86a6-4dee-affe-542181600034' as typeof fixture.assets[0]['assetId']
  fixture.assets.push({ ...fixture.assets[0], assetId: secondId })
  const header = fixture.project.pages[0].elements[1]
  if (header.kind !== 'header') throw Error('Expected header')
  header.logoAssetId = secondId
  await openFile(page, fixture)
  await expect(page.getByRole('status')).toHaveText('Bildene i prosjektfilen kunne ikke lastes inn.')
  await expect(page.locator('.image-element__image')).toHaveAttribute('src', originalSrc!)
  await expectImages(page)
  const tracker = await page.evaluate(() => (window as unknown as { urlTracker: { created: string[]; revoked: string[]; fail: boolean } }).urlTracker)
  expect(tracker.created).toHaveLength(1)
  expect(tracker.revoked).toEqual(tracker.created)
  await page.evaluate(() => { (window as unknown as { urlTracker: { fail: boolean } }).urlTracker.fail = false })
  await openFile(page, fixture)
  await expect(page.getByRole('status')).toHaveText('Åpnet «Bilder og logo».')
  await expectImages(page)
  const revoked = await page.evaluate(() => (window as unknown as { urlTracker: { revoked: string[] } }).urlTracker.revoked)
  expect(revoked).toContain(originalSrc)
})

test('closing the panel cancels pending import before it can replace a newer project', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()
  await page.evaluate(() => {
    const read = File.prototype.text
    File.prototype.text = function () {
      return new Promise<string>((resolve) => {
        Object.assign(window, { finishProjectRead: () => read.call(this).then(resolve) })
      })
    }
  })
  const pending = projectFileFixture()
  pending.assets = []
  pending.project.pages.forEach((item) => { item.elements = [] })
  await openFile(page, pending)
  await expect(page.getByRole('button', { name: 'Åpner…' })).toBeDisabled()
  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()
  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()
  await page.evaluate(async () => {
    await (window as unknown as { finishProjectRead: () => Promise<void> }).finishProjectRead()
    await new Promise(requestAnimationFrame)
  })
  // The cancelled read has completed; it must not overwrite this mounted panel.
  await page.getByRole('button', { name: '+ Ny side', exact: true }).click()
  await expect(page.getByText('Nytt prosjekt', { exact: true })).toBeVisible()
  await expect(page.getByText('2 sider', { exact: true })).toBeVisible()
  await expect(page.locator('.image-element__image')).toHaveCount(0)
})
