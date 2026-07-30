import type { EditorElement } from '../../model/editorProject'

export const elementKindLabels: Record<EditorElement['kind'], string> = {
  section: 'Seksjon',
  image: 'Bilde',
  text: 'Tekstboks',
  button: 'Knapp',
  header: 'Header',
}

function summarizeText(value: string) {
  return value.trim().replace(/\s+/g, ' ').slice(0, 80)
}

function getElementSummary(element: EditorElement) {
  if (element.kind === 'image') {
    const altText = summarizeText(element.altText)
    const fileName = summarizeText(element.assetMetadata.fileName)

    return altText
      ? `Bilde. Alternativ tekst: ${altText}.`
      : `Bilde uten alternativ tekst. Fil: ${fileName}.`
  }

  if (element.kind === 'text') {
    const summary = summarizeText(element.content)
    return summary ? `Innhold: ${summary}.` : 'Tom tekstboks.'
  }

  if (element.kind === 'button') {
    const summary = summarizeText(element.label)
    return summary ? `Knappetekst: ${summary}.` : 'Knapp uten tekst.'
  }

  if (element.kind === 'header') {
    const siteName = summarizeText(element.siteName)
    const subtitle = summarizeText(element.subtitle)
    return subtitle
      ? `Header for ${siteName}. Undertittel: ${subtitle}.`
      : `Header for ${siteName}.`
  }

  return `${elementKindLabels[element.kind]}.`
}

export function getAccessibleElementLabel(element: EditorElement) {
  const summary = getElementSummary(element)

  if (element.locked) {
    return `${summary} Låst. Bruk objektverktøyet for å låse opp.`
  }

  if (element.kind === 'text') {
    return `${summary} Dobbeltklikk eller trykk Enter når elementet er markert for å redigere. Piltaster flytter. Control eller Command sammen med piltaster endrer størrelse. Delete åpner slettebekreftelse.`
  }

  if (element.kind === 'image' && element.mode === 'crop') {
    return `${summary} Piltaster flytter rammen. Alt sammen med piltaster flytter motivet i rammen. Control eller Command sammen med piltaster endrer rammestørrelse. Delete åpner slettebekreftelse.`
  }

  if (element.kind === 'header') {
    return `${summary} Headeren følger hele sidebredden. Pil opp og ned flytter den. Control eller Command sammen med pil opp og ned endrer høyden. Delete åpner slettebekreftelse.`
  }

  return `${summary} Piltaster flytter. Control eller Command sammen med piltaster endrer størrelse. Delete åpner slettebekreftelse.`
}

export function getCanvasElementKeyboardShortcuts(element: EditorElement) {
  if (element.locked) {
    return 'Enter Space'
  }

  if (element.kind === 'header') {
    return 'Enter Space Delete ArrowUp ArrowDown Control+ArrowUp Control+ArrowDown Meta+ArrowUp Meta+ArrowDown'
  }

  const baseShortcuts =
    'Enter Space Delete ArrowUp ArrowDown ArrowLeft ArrowRight Control+ArrowUp Control+ArrowDown Control+ArrowLeft Control+ArrowRight Meta+ArrowUp Meta+ArrowDown Meta+ArrowLeft Meta+ArrowRight'

  return element.kind === 'image' && element.mode === 'crop'
    ? `${baseShortcuts} Alt+ArrowUp Alt+ArrowDown Alt+ArrowLeft Alt+ArrowRight`
    : baseShortcuts
}
