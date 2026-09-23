import type {
  EditorProject,
  HeaderEditorElement,
  ResponsiveViewport,
} from '../model/editorProject'
import type { ElementLayout } from '../model/elementLayout'
import {
  isValidHeaderAppearance,
  type HeaderAppearance,
} from '../model/headerAppearance'
import {
  isValidHeaderSiteName,
  isValidHeaderSubtitle,
} from '../model/headerElement'

export const AI_CLIP_FORMAT = 'WEBSITE_EDITOR_CLIP v1'
export const AI_PROPOSAL_FORMAT = 'website-editor-ai-v1'

export type HeaderAiProposal = {
  format: typeof AI_PROPOSAL_FORMAT
  type: 'header'
  elementId: string
  viewport: ResponsiveViewport
  width: number
  height: number
  siteName: string
  subtitle: string
  appearance: HeaderAppearance
}

type HeaderClipInput = {
  element: HeaderEditorElement
  viewport: ResponsiveViewport
  layout: ElementLayout
  project: EditorProject
}

const proposalKeys = [
  'format',
  'type',
  'elementId',
  'viewport',
  'width',
  'height',
  'siteName',
  'subtitle',
  'appearance',
] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasExactProposalKeys(value: Record<string, unknown>) {
  const keys = Object.keys(value)
  return keys.length === proposalKeys.length &&
    keys.every((key) => proposalKeys.includes(key as typeof proposalKeys[number]))
}

function stripCodeFence(value: string) {
  const trimmed = value.trim()
  const match = trimmed.match(/^\`\`\`(?:json)?\s*([\s\S]*?)\s*\`\`\`$/i)
  return match?.[1] ?? trimmed
}

export function parseHeaderAiProposal(
  input: string,
  expected: {
    elementId: string
    viewport: ResponsiveViewport
    width: number
    height: number
  },
): HeaderAiProposal {
  let parsed: unknown

  try {
    parsed = JSON.parse(stripCodeFence(input))
  } catch {
    throw new Error('Dette er ikke et gyldig Website-editor-forslag.')
  }

  if (!isRecord(parsed) || !hasExactProposalKeys(parsed)) {
    throw new Error('AI-forslaget har ukjent eller manglende struktur.')
  }

  if (
    parsed.format !== AI_PROPOSAL_FORMAT ||
    parsed.type !== 'header' ||
    parsed.elementId !== expected.elementId ||
    parsed.viewport !== expected.viewport ||
    parsed.width !== expected.width ||
    parsed.height !== expected.height
  ) {
    throw new Error('AI-forslaget passer ikke til den valgte Header-rammen.')
  }

  if (
    !isValidHeaderSiteName(parsed.siteName) ||
    !isValidHeaderSubtitle(parsed.subtitle) ||
    !isValidHeaderAppearance(parsed.appearance)
  ) {
    throw new Error('AI-forslaget inneholder verdier editoren ikke støtter.')
  }

  return parsed as HeaderAiProposal
}

export function createHeaderAiClip({
  element,
  viewport,
  layout,
  project,
}: HeaderClipInput) {
  const proposal: HeaderAiProposal = {
    format: AI_PROPOSAL_FORMAT,
    type: 'header',
    elementId: element.id,
    viewport,
    width: layout.size.width,
    height: layout.size.height,
    siteName: element.siteName,
    subtitle: element.subtitle,
    appearance: element.appearance,
  }

  const navigation = project.navigation.items.map((item) => item.label)

  return [
    AI_CLIP_FORMAT,
    '',
    'Target:',
    JSON.stringify({
      type: 'header',
      elementId: element.id,
      viewport,
      x: layout.position.x,
      y: layout.position.y,
      width: layout.size.width,
      height: layout.size.height,
      lockedFrame: true,
    }, null, 2),
    '',
    'CurrentDesign:',
    JSON.stringify({
      siteName: element.siteName,
      subtitle: element.subtitle,
      appearance: element.appearance,
      navigation,
    }, null, 2),
    '',
    'Instruks til ChatGPT:',
    '- Forbedre bare Header-designet innenfor den låste rammen.',
    '- Behold width og height nøyaktig som oppgitt.',
    '- Bruk bare feltene og verditypene i returformatet under.',
    '- Ikke returner HTML, CSS, forklaringer eller ekstra felter.',
    '- Returner kun ett JSON-objekt som Website-editoren kan lese.',
    '',
    'Returformat:',
    JSON.stringify(proposal, null, 2),
  ].join('\n')
}
