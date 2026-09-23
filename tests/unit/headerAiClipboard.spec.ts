import { expect, test } from '@playwright/test'
import {
  createHeaderAiClip,
  parseHeaderAiProposal,
} from '../../src/ai/headerAiClipboard'
import { createImageAssetId } from '../../src/model/imageAsset'
import {
  editorProjectReducer,
  getInitialEditorProjectState,
} from '../../src/state/editorProjectReducer'

const metadata = {
  fileName: 'logo.png',
  mimeType: 'image/png' as const,
  byteSize: 68,
  width: 64,
  height: 64,
}

function createHeaderState() {
  const state = editorProjectReducer(getInitialEditorProjectState(), {
    type: 'add-element-to-active-page',
    elementId: 'header-ai-1',
    request: {
      kind: 'header',
      logoAssetId: createImageAssetId(),
      logoAssetMetadata: metadata,
      siteName: 'Mitt nettsted',
      subtitle: 'En undertittel',
    },
    updatedAt: '2026-09-24T00:00:00.000Z',
  })
  const header = state.project.pages[0]?.elements[0]
  if (!header || header.kind !== 'header') throw new Error('Expected Header.')
  return { state, header }
}

test('creates a locked Header ChatGPT clip from project values', () => {
  const { state, header } = createHeaderState()
  const layout = {
    position: header.position.desktop,
    size: header.size.desktop,
  }
  const clip = createHeaderAiClip({
    element: header,
    viewport: 'desktop',
    layout,
    project: state.project,
  })

  expect(clip).toContain('WEBSITE_EDITOR_CLIP v1')
  expect(clip).toContain('"lockedFrame": true')
  expect(clip).toContain(`"width": ${layout.size.width}`)
  expect(clip).toContain('"format": "website-editor-ai-v1"')
})

test('accepts only a proposal matching the selected Header frame', () => {
  const { header } = createHeaderState()
  const proposal = {
    format: 'website-editor-ai-v1',
    type: 'header',
    elementId: header.id,
    viewport: 'desktop',
    width: header.size.desktop.width,
    height: header.size.desktop.height,
    siteName: 'Nytt nettsted',
    subtitle: '',
    appearance: {
      ...header.appearance,
      textColor: '#112233',
    },
  }

  expect(parseHeaderAiProposal(JSON.stringify(proposal), {
    elementId: header.id,
    viewport: 'desktop',
    width: header.size.desktop.width,
    height: header.size.desktop.height,
  }).siteName).toBe('Nytt nettsted')

  expect(() => parseHeaderAiProposal(JSON.stringify({
    ...proposal,
    width: proposal.width + 1,
  }), {
    elementId: header.id,
    viewport: 'desktop',
    width: header.size.desktop.width,
    height: header.size.desktop.height,
  })).toThrow('passer ikke til den valgte Header-rammen')
})

test('rejects unknown fields and unsupported Header values', () => {
  const { header } = createHeaderState()
  const base = {
    format: 'website-editor-ai-v1',
    type: 'header',
    elementId: header.id,
    viewport: 'desktop',
    width: header.size.desktop.width,
    height: header.size.desktop.height,
    siteName: 'Nytt nettsted',
    subtitle: '',
    appearance: header.appearance,
  }
  const expected = {
    elementId: header.id,
    viewport: 'desktop' as const,
    width: header.size.desktop.width,
    height: header.size.desktop.height,
  }

  expect(() => parseHeaderAiProposal(JSON.stringify({
    ...base,
    html: '<header>nei</header>',
  }), expected)).toThrow('ukjent eller manglende struktur')

  expect(() => parseHeaderAiProposal(JSON.stringify({
    ...base,
    appearance: { ...header.appearance, fontSize: 17 },
  }), expected)).toThrow('verdier editoren ikke støtter')
})

test('applies a valid AI Header proposal through one typed action', () => {
  const { state, header } = createHeaderState()
  const updated = editorProjectReducer(state, {
    type: 'apply-header-ai-proposal',
    elementId: header.id,
    siteName: 'Nytt nettsted',
    subtitle: 'Roligere uttrykk',
    appearance: {
      ...header.appearance,
      textColor: '#112233',
      fontSize: 28,
    },
    updatedAt: '2026-09-24T00:01:00.000Z',
  })
  const next = updated.project.pages[0]?.elements[0]
  if (!next || next.kind !== 'header') throw new Error('Expected Header.')

  expect(next.siteName).toBe('Nytt nettsted')
  expect(next.subtitle).toBe('Roligere uttrykk')
  expect(next.appearance.textColor).toBe('#112233')
  expect(next.appearance.fontSize).toBe(28)
  expect(updated.project.updatedAt).toBe('2026-09-24T00:01:00.000Z')
})


test('accepts a valid proposal wrapped in a JSON code fence', () => {
  const { header } = createHeaderState()
  const proposal = {
    format: 'website-editor-ai-v1',
    type: 'header',
    elementId: header.id,
    viewport: 'desktop',
    width: header.size.desktop.width,
    height: header.size.desktop.height,
    siteName: 'Kodeblokk navn',
    subtitle: '',
    appearance: header.appearance,
  }

  const parsed = parseHeaderAiProposal(
    `\`\`\`json\n${JSON.stringify(proposal)}\n\`\`\``,
    {
      elementId: header.id,
      viewport: 'desktop',
      width: header.size.desktop.width,
      height: header.size.desktop.height,
    },
  )

  expect(parsed.siteName).toBe('Kodeblokk navn')
})
