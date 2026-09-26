import { expect, test, type Locator, type Page } from '@playwright/test'

const onePixelPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
)

async function createSectionAndText(page: Page) {
  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  await page.getByRole('button', { name: 'Seksjon', exact: true }).click()
  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  await page.getByRole('button', { name: 'Tekst', exact: true }).click()
}

async function createHeader(page: Page) {
  await page.getByRole('button', { name: 'Logo og header', exact: true }).click()
  await page.getByLabel('Navn på nettsted eller firma').fill('Gradienttest')
  await page.locator('.header-creation-control__file-input').setInputFiles({
    name: 'logo.png',
    mimeType: 'image/png',
    buffer: onePixelPng,
  })
  await page.getByRole('button', { name: 'Opprett header', exact: true }).click()
}

async function setGradient(
  group: Locator,
  label: string,
  first: string,
  second: string,
  third: string,
  angle: number,
) {
  await group.getByRole('button', { name: 'Gradient', exact: true }).click()
  const firstInput = group.getByRole('textbox', {
    name: `${label} farge 1 HEX-kode`,
    exact: true,
  })
  const secondInput = group.getByRole('textbox', {
    name: `${label} farge 2 HEX-kode`,
    exact: true,
  })
  const thirdInput = group.getByRole('textbox', {
    name: `${label} farge 3 HEX-kode`,
    exact: true,
  })
  await firstInput.fill(first)
  await firstInput.press('Enter')
  await secondInput.fill(second)
  await secondInput.press('Enter')
  await thirdInput.fill(third)
  await thirdInput.press('Enter')
  const angleInput = group.getByRole('spinbutton', {
    name: `${label} vinkel`,
    exact: true,
  })
  await angleInput.fill(String(angle))
  await angleInput.press('Enter')
}

test('renders three-color gradients on page, section, text and header while preserving solid colors', async ({ page }) => {
  await page.goto('/')
  await createSectionAndText(page)
  await createHeader(page)
  await page.getByRole('button', { name: 'Farger', exact: true }).click()

  const pageGroup = page.getByRole('region', { name: 'Bakgrunn', exact: true })
  const sectionGroup = page.getByRole('region', { name: 'Element 1', exact: true })
  const textGroup = page.getByRole('region', { name: 'Tekst 1', exact: true })
  const headerGroup = page.getByRole('region', { name: 'Header 1', exact: true })

  const sectionElement = page.locator('.canvas-element--section')
  const textElement = page.locator('.canvas-element--text')
  const headerElement = page.locator('.canvas-element--header')
  const textColorBefore = await textElement.evaluate(
    (element) => getComputedStyle(element).color,
  )
  const headerColorBefore = await headerElement.evaluate(
    (element) => getComputedStyle(element).color,
  )

  await setGradient(pageGroup, 'Sidebakgrunn', '#112233', '#DDBB22', '#445566', 45)
  await setGradient(sectionGroup, 'Bakgrunn', '#AA0000', '#CCCC00', '#00AA00', 90)
  await setGradient(textGroup, 'Bakgrunn', '#0000AA', '#AAAA00', '#00AAAA', 135)
  await setGradient(headerGroup, 'Bakgrunn', '#101010', '#DDBB22', '#F0F0F0', 180)

  await expect(page.getByLabel('Nettside: Forside')).toHaveCSS(
    'background-image',
    /linear-gradient/,
  )
  await expect(sectionElement).toHaveCSS('background-image', /linear-gradient/)
  await expect(textElement).toHaveCSS('background-image', /linear-gradient/)
  await expect(headerElement).toHaveCSS('background-image', /linear-gradient/)
  await expect(sectionElement).toHaveCSS('border-width', '1px')
  await expect(textElement).toHaveCSS('border-width', '1px')
  await expect(headerElement).toHaveCSS('border-width', '1px')
  await expect(textElement).toHaveCSS('color', textColorBefore)
  await expect(headerElement).toHaveCSS('color', headerColorBefore)
})

test('gradient angle rejects invalid drafts and Escape keeps the colors panel open', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Farger', exact: true }).click()
  const group = page.getByRole('region', { name: 'Bakgrunn', exact: true })
  await group.getByRole('button', { name: 'Gradient', exact: true }).click()
  const angle = group.getByRole('spinbutton', {
    name: 'Sidebakgrunn vinkel',
    exact: true,
  })

  await angle.fill('270')
  await angle.press('Enter')
  await expect(angle).toHaveValue('270')

  await angle.fill('361')
  await expect(angle).toHaveAttribute('aria-invalid', 'true')
  await angle.press('Tab')
  await expect(angle).toHaveValue('270')

  await angle.fill('-1')
  await angle.press('Escape')
  await expect(angle).toHaveValue('270')
  await expect(page.getByRole('heading', { name: 'Farger', exact: true })).toBeVisible()
})

test('three-color gradient survives project-file download and reopen', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Farger', exact: true }).click()
  const group = page.getByRole('region', { name: 'Bakgrunn', exact: true })
  await setGradient(group, 'Sidebakgrunn', '#123456', '#FEDCBA', '#ABCDEF', 123)
  await expect(page.getByLabel('Nettside: Forside')).toHaveCSS(
    'background-image',
    /linear-gradient/,
  )

  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Lagre prosjektfil', exact: true }).click()
  const download = await downloadPromise
  const projectPath = await download.path()
  expect(projectPath).not.toBeNull()

  await page.reload()
  await expect(page.getByLabel('Nettside: Forside')).toHaveCSS('background-image', 'none')
  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()
  await page.locator('.project-file-controls__input').setInputFiles(projectPath!)
  await expect(page.getByRole('status')).toHaveText('Åpnet «Nytt prosjekt».')
  await expect(page.getByLabel('Nettside: Forside')).toHaveCSS(
    'background-image',
    /linear-gradient/,
  )

  await page.getByRole('button', { name: 'Farger', exact: true }).click()
  const restored = page.getByRole('region', { name: 'Bakgrunn', exact: true })
  await expect(
    restored.getByRole('spinbutton', { name: 'Sidebakgrunn vinkel', exact: true }),
  ).toHaveValue('123')
  await expect(
    restored.getByRole('textbox', { name: 'Sidebakgrunn farge 1 HEX-kode', exact: true }),
  ).toHaveValue('#123456')
  await expect(
    restored.getByRole('textbox', { name: 'Sidebakgrunn farge 2 HEX-kode', exact: true }),
  ).toHaveValue('#FEDCBA')
  await expect(
    restored.getByRole('textbox', { name: 'Sidebakgrunn farge 3 HEX-kode', exact: true }),
  ).toHaveValue('#ABCDEF')
})
