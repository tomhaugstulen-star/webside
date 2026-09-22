import { expect, test, type Page } from '@playwright/test'

async function openColors(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Farger', exact: true }).click()
  return {
    hex: page.getByRole('textbox', { name: 'Sidebakgrunn HEX-kode', exact: true }),
    native: page.getByLabel(/Sidebakgrunn\. Nåværende farge/),
    canvas: page.getByLabel('Nettside: Forside'),
    pipette: page.getByRole('button', { name: 'Pipette for sidebakgrunn', exact: true }),
  }
}

test('HEX entry commits canonical colors and rejects invalid drafts on blur and Escape', async ({ page }) => {
  const { hex, native, canvas } = await openColors(page)
  await hex.fill('')
  await hex.pressSequentially('#a1b2c3')
  await hex.press('Tab')
  await expect(hex).toHaveValue('#A1B2C3')
  await expect(native).toHaveValue('#a1b2c3')
  await expect(canvas).toHaveCSS('background-color', 'rgb(161, 178, 195)')

  // Whole-field replacement covers the same input path as pasting HEX.
  await hex.fill('#d4e5f6')
  await hex.press('Enter')
  await expect(hex).toHaveValue('#D4E5F6')
  await expect(canvas).toHaveCSS('background-color', 'rgb(212, 229, 246)')
  for (const invalid of ['#12', '#GGGGGG', '']) {
    await hex.fill(invalid)
    await expect(hex).toHaveAttribute('aria-invalid', 'true')
    await expect(native).toHaveValue('#d4e5f6')
    await expect(canvas).toHaveCSS('background-color', 'rgb(212, 229, 246)')
    await hex.press('Tab')
    await expect(hex).toHaveValue('#D4E5F6')
  }
  await hex.fill('#AB')
  await hex.press('Escape')
  await expect(hex).toHaveValue('#D4E5F6')
  await expect(hex).toHaveAttribute('aria-invalid', 'false')
  await page.getByRole('button', { name: 'Farger', exact: true }).click()
  await page.getByRole('button', { name: 'Farger', exact: true }).click()
  await expect(hex).toHaveValue('#D4E5F6')
})

test('EyeDropper sample updates the project and cancellation preserves its color', async ({ page }) => {
  await page.addInitScript(() => {
    let calls = 0
    Object.defineProperty(window, 'EyeDropper', { configurable: true, value: class {
      async open() {
        if (++calls > 1) throw new DOMException('Cancelled', 'AbortError')
        return { sRGBHex: '#123456' }
      }
    } })
  })
  const { hex, native, canvas, pipette } = await openColors(page)
  await expect(pipette).toBeEnabled()
  await pipette.click()
  await expect(hex).toHaveValue('#123456')
  await expect(native).toHaveValue('#123456')
  await expect(canvas).toHaveCSS('background-color', 'rgb(18, 52, 86)')
  await pipette.click()
  await expect(pipette).toBeEnabled()
  await expect(hex).toHaveValue('#123456')
  await expect(canvas).toHaveCSS('background-color', 'rgb(18, 52, 86)')
  await page.getByRole('button', { name: 'Farger', exact: true }).click()
  await page.getByRole('button', { name: 'Farger', exact: true }).click()
  await expect(hex).toHaveValue('#123456')
})

test('unsupported EyeDropper keeps HEX and native color inputs available', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'EyeDropper', { configurable: true, value: undefined })
  })
  const { hex, native, pipette } = await openColors(page)
  await expect(pipette).toBeDisabled()
  await expect(hex).toBeEnabled()
  await expect(native).toBeEnabled()
})
