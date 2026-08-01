import { expect, test } from '@playwright/test'

const ONE_PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZDpQAAAAASUVORK5CYII=',
  'base64',
)

test('restores project state and imported images after refresh', async ({
  page,
}) => {
  await page.goto('/')

  await expect(page.getByLabel('Nettside: Forside')).toBeVisible()

  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Elementer', exact: true }),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Tekst', exact: true }).click()

  const emptyTextElement = page.getByRole('button', { name: /Tom tekstboks/ })
  await expect(emptyTextElement).toBeVisible()
  await expect(emptyTextElement).toHaveAttribute('aria-pressed', 'true')
  await expect(emptyTextElement).toHaveCSS(
    'background-color',
    'rgb(255, 255, 255)',
  )

  await emptyTextElement.dblclick()
  const textEditor = page.getByRole('textbox', { name: 'Rediger tekst' })
  await textEditor.fill('Lagret tekst')
  await textEditor.press('Control+Enter')

  const textElement = page.getByRole('button', {
    name: /Innhold: Lagret tekst/,
  })
  await expect(textElement).toBeVisible()
  await textElement.press('ArrowRight')
  const storedLeft = await textElement.evaluate(
    (element) => getComputedStyle(element).left,
  )

  await textElement.click()
  await expect(
    page.getByRole('heading', { name: 'Egenskaper', exact: true }),
  ).toBeVisible()
  await expect(page.getByText('Ulåst', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Lukk egenskaper' }).click()
  await page.getByRole('button', { name: 'Farger', exact: true }).click()

  const textColorGroup = page.getByRole('region', { name: 'Tekst 1' })
  await expect(textColorGroup).toBeVisible()
  await expect(
    textColorGroup.locator('.color-swatch-input > span:first-child'),
  ).toHaveText(['Bakgrunn', 'Tekstfarge'])

  const backgroundInput = textColorGroup.getByLabel(/Bakgrunn\. Nåværende farge/)
  await backgroundInput.fill('#e8f1ff')

  await expect(backgroundInput).toHaveValue('#e8f1ff')
  await expect(textElement).toHaveCSS(
    'background-color',
    'rgb(232, 241, 255)',
  )
  await expect(
    page.getByRole('button', { name: 'Lokal lagring: Lagret' }),
  ).toBeVisible()

  await page.reload()

  const restoredTextElement = page.getByRole('button', {
    name: /Innhold: Lagret tekst/,
  })
  await expect(restoredTextElement).toBeVisible()
  await expect(restoredTextElement).toHaveCSS(
    'background-color',
    'rgb(232, 241, 255)',
  )
  await expect(restoredTextElement).toHaveCSS('left', storedLeft)

  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  await page.locator('.image-import-control__input').setInputFiles({
    name: 'pixel.png',
    mimeType: 'image/png',
    buffer: ONE_PIXEL_PNG,
  })

  const imageElement = page.getByRole('button', {
    name: /Fil: pixel\.png\./,
  })
  await expect(imageElement).toBeVisible()
  const importedImage = imageElement.locator('img.image-element__image')
  await expect(importedImage).toBeVisible()
  await expect(importedImage).toHaveAttribute('src', /^blob:/)
  await expect(
    page.getByRole('button', { name: 'Lokal lagring: Lagret' }),
  ).toBeVisible()

  await page.reload()

  await expect(
    page.getByRole('button', { name: /Innhold: Lagret tekst/ }),
  ).toHaveCSS('background-color', 'rgb(232, 241, 255)')
  const restoredImageElement = page.getByRole('button', {
    name: /Fil: pixel\.png\./,
  })
  await expect(restoredImageElement).toBeVisible()
  await expect(
    restoredImageElement.locator('img.image-element__image'),
  ).toHaveAttribute('src', /^blob:/)
  await expect(page.getByText('Bildet mangler', { exact: true })).toHaveCount(0)

  await page.getByRole('button', { name: 'Åpne hovedmeny' }).click()
  await page
    .getByRole('button', { name: 'Nullstill lokalt prosjekt' })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Nullstill lokalt prosjekt?' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Avbryt' }).click()
  await expect(
    page.getByRole('heading', { name: 'Nullstill lokalt prosjekt?' }),
  ).toBeHidden()
})
