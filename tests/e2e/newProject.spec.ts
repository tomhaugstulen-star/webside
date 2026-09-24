import { expect, test } from '@playwright/test'

const image = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
)

async function savedProject(page: import('@playwright/test').Page) {
  return page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('website-editor', 1)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    try {
      return await new Promise<{ pages: number; elements: number; assets: number }>((resolve, reject) => {
        const transaction = database.transaction(['project', 'assets'], 'readonly')
        const current = transaction.objectStore('project').get('current')
        const assets = transaction.objectStore('assets').count()
        transaction.oncomplete = () => resolve({
          pages: current.result?.project.pages.length ?? 0,
          elements: current.result?.project.pages[0].elements.length ?? 0,
          assets: assets.result,
        })
        transaction.onerror = () => reject(transaction.error)
      })
    } finally { database.close() }
  })
}

test('new project clears pages, assets and undo history and persists after reload', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()
  await page.getByRole('button', { name: '+ Ny side', exact: true }).click()
  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  await page.locator('.image-import-control:has(.element-card--image) input[type="file"]')
    .setInputFiles({ name: 'before.png', mimeType: 'image/png', buffer: image })
  await expect.poll(async () => (await savedProject(page)).pages).toBe(2)
  await expect.poll(async () => (await savedProject(page)).assets).toBe(1)

  page.once('dialog', (dialog) => dialog.dismiss())
  await page.getByRole('button', { name: 'Åpne hovedmeny' }).click()
  await page.getByRole('button', { name: 'Nytt prosjekt', exact: true }).click()
  await expect(page.locator('.image-element__image')).toBeVisible()

  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Åpne hovedmeny' }).click()
  await page.getByRole('button', { name: 'Nytt prosjekt', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Angre' })).toBeDisabled()
  await expect(page.locator('.image-element__image')).toHaveCount(0)
  await expect.poll(savedProject.bind(null, page)).toEqual({ pages: 1, elements: 0, assets: 0 })
  await page.reload()
  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()
  await expect(page.getByText('1 side', { exact: true })).toBeVisible()
  await expect(page.locator('.image-element__image')).toHaveCount(0)
})
