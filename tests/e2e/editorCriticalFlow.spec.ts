import { expect, test, type Page } from '@playwright/test'

const ONE_PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg==',
  'base64',
)

async function getStoredAssetCount(page: Page) {
  return page.evaluate(
    () =>
      new Promise<number>((resolve, reject) => {
        const openRequest = indexedDB.open('website-editor', 1)

        openRequest.onerror = () =>
          reject(openRequest.error ?? new Error('Could not open IndexedDB.'))
        openRequest.onsuccess = () => {
          const database = openRequest.result
          const transaction = database.transaction('assets', 'readonly')
          const countRequest = transaction.objectStore('assets').count()

          countRequest.onsuccess = () => {
            database.close()
            resolve(countRequest.result)
          }
          countRequest.onerror = () => {
            database.close()
            reject(countRequest.error ?? new Error('Could not count assets.'))
          }
        }
      }),
  )
}

async function writeCorruptProject(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve, reject) => {
        const openRequest = indexedDB.open('website-editor', 1)

        openRequest.onerror = () =>
          reject(openRequest.error ?? new Error('Could not open IndexedDB.'))
        openRequest.onsuccess = () => {
          const database = openRequest.result
          const transaction = database.transaction('project', 'readwrite')

          transaction.objectStore('project').put({
            key: 'active',
            envelope: {
              storageVersion: 999,
              sentinel: 'preserve-corrupt-source',
            },
          })
          transaction.oncomplete = () => {
            database.close()
            resolve()
          }
          transaction.onerror = () => {
            database.close()
            reject(
              transaction.error ?? new Error('Could not write corrupt data.'),
            )
          }
          transaction.onabort = transaction.onerror
        }
      }),
  )
}

async function getStoredStorageVersion(page: Page) {
  return page.evaluate(
    () =>
      new Promise<number | null>((resolve, reject) => {
        const openRequest = indexedDB.open('website-editor', 1)

        openRequest.onerror = () =>
          reject(openRequest.error ?? new Error('Could not open IndexedDB.'))
        openRequest.onsuccess = () => {
          const database = openRequest.result
          const transaction = database.transaction('project', 'readonly')
          const request = transaction.objectStore('project').get('active')

          request.onsuccess = () => {
            database.close()
            const record = request.result as
              | { envelope?: { storageVersion?: unknown } }
              | undefined
            const storageVersion = record?.envelope?.storageVersion
            resolve(typeof storageVersion === 'number' ? storageVersion : null)
          }
          request.onerror = () => {
            database.close()
            reject(request.error ?? new Error('Could not read project data.'))
          }
        }
      }),
  )
}

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

  await restoredImageElement.click()
  await page.keyboard.press('Delete')
  await expect(
    page.getByRole('heading', { name: 'Slett bildet?' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Slett', exact: true }).click()
  await expect(restoredImageElement).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: 'Lokal lagring: Lagret' }),
  ).toBeVisible()

  await page.reload()

  await expect(
    page.getByRole('button', { name: /Innhold: Lagret tekst/ }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: /Fil: pixel\.png\./ }),
  ).toHaveCount(0)
  expect(await getStoredAssetCount(page)).toBe(0)

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

  await page.getByRole('button', { name: 'Åpne hovedmeny' }).click()
  await page
    .getByRole('button', { name: 'Nullstill lokalt prosjekt' })
    .click()
  await page.getByRole('button', { name: 'Nullstill', exact: true }).click()

  await expect(page.getByLabel('Nettside: Forside')).toBeVisible()
  await expect(
    page.getByRole('button', { name: /Innhold: Lagret tekst/ }),
  ).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: 'Lokal lagring: Lagret' }),
  ).toBeVisible()
  expect(await getStoredAssetCount(page)).toBe(0)
})

test('preserves corrupt local data until an explicit reset', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByLabel('Nettside: Forside')).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Lokal lagring: Lagret' }),
  ).toBeVisible()

  await writeCorruptProject(page)
  await page.reload()

  await expect(
    page.getByRole('heading', { name: 'Prosjektet kunne ikke åpnes' }),
  ).toBeVisible()
  await expect(page.getByLabel('Nettside: Forside')).toHaveCount(0)
  expect(await getStoredStorageVersion(page)).toBe(999)

  page.once('dialog', (dialog) => {
    void dialog.accept()
  })
  await page
    .getByRole('button', { name: 'Nullstill lokal lagring' })
    .click()

  await expect(page.getByLabel('Nettside: Forside')).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Prosjektet kunne ikke åpnes' }),
  ).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: 'Lokal lagring: Lagret' }),
  ).toBeVisible()
  expect(await getStoredAssetCount(page)).toBe(0)
})
