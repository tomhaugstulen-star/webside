import { expect, test } from '@playwright/test'

const onePixelPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
)

test('autosave restores project structure and image assets after refresh', async ({
  page,
}) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()
  await page.getByRole('button', { name: '+ Ny side', exact: true }).click()
  await expect(page.getByText('2 sider', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  await page
    .locator('.image-import-control:has(.element-card--image) input[type="file"]')
    .setInputFiles({
      name: 'persisted.png',
      mimeType: 'image/png',
      buffer: onePixelPng,
    })

  const image = page.locator('.image-element__image')
  await expect(image).toBeVisible()
  await expect
    .poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth))
    .toBe(1)

  await expect
    .poll(() =>
      page.evaluate(async () => {
        const database = await new Promise<IDBDatabase>((resolve, reject) => {
          const request = indexedDB.open('website-editor', 1)
          request.addEventListener('success', () => resolve(request.result))
          request.addEventListener('error', () => reject(request.error))
        })

        try {
          return await new Promise<number>((resolve, reject) => {
            const transaction = database.transaction('project', 'readonly')
            const request = transaction.objectStore('project').get('current')
            request.addEventListener('success', () =>
              resolve(request.result?.project?.pages?.length ?? 0),
            )
            request.addEventListener('error', () => reject(request.error))
          })
        } finally {
          database.close()
        }
      }),
    )
    .toBe(2)

  await page.reload()

  await expect(page.getByLabel('Nettside: Forside')).toBeVisible()
  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()
  await expect(page.getByText('2 sider', { exact: true })).toBeVisible()
  await page.locator('.project-navigator__page-button').filter({
    hasText: 'Side 2',
  }).click()
  await expect(page.getByLabel('Nettside: Side 2')).toBeVisible()
  await expect(page.locator('.image-element__image')).toBeVisible()
  await expect
    .poll(() =>
      page
        .locator('.image-element__image')
        .evaluate((node: HTMLImageElement) => node.naturalWidth),
    )
    .toBe(1)
})


test('corrupt local storage is preserved until confirmed reset', async ({
  page,
}) => {
  await page.goto('/')

  await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('website-editor', 1)
      request.addEventListener('success', () => resolve(request.result))
      request.addEventListener('error', () => reject(request.error))
    })

    try {
      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction('project', 'readwrite')
        transaction.objectStore('project').put({
          key: 'current',
          storageVersion: 999,
          project: { invalid: true },
        })
        transaction.addEventListener('complete', () => resolve())
        transaction.addEventListener('error', () => reject(transaction.error))
        transaction.addEventListener('abort', () => reject(transaction.error))
      })
    } finally {
      database.close()
    }
  })

  await page.reload()

  await expect(
    page.getByRole('heading', { name: 'Lokalt prosjekt kunne ikke åpnes' }),
  ).toBeVisible()

  page.once('dialog', (dialog) => dialog.accept())
  await page
    .getByRole('button', { name: 'Start nytt lokalt prosjekt' })
    .click()

  await expect(page.getByLabel('Nettside: Forside')).toBeVisible()
  await expect(page.locator('.top-toolbar__save-error')).toHaveCount(0)
})
