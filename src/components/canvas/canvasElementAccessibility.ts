import type { EditorElement } from '../../model/editorProject'

export const elementKindLabels: Record<EditorElement['kind'], string> = {
  section: 'Seksjon',
  image: 'Bilde',
  text: 'Tekstboks',
  button: 'Knapp',
}

function summarizeText(value: string) {
  return value.trim().replace(/\s+/g, ' ').slice(0, 80)
}

function getElementSummary(element: EditorElement) {
  if (element.kind === 'text') {
    const summary = summarizeText(element.content)
    return summary ? `Innhold: ${summary}.` : 'Tom tekstboks.'
  }

  if (element.kind === 'button') {
    const summary = summarizeText(element.label)
    return summary ? `Knappetekst: ${summary}.` : 'Knapp uten tekst.'
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

  return `${summary} Piltaster flytter. Control eller Command sammen med piltaster endrer størrelse. Delete åpner slettebekreftelse.`
}

export function getCanvasElementKeyboardShortcuts(locked: boolean) {
  return locked
    ? 'Enter Space'
    : 'Enter Space Delete ArrowUp ArrowDown ArrowLeft ArrowRight Control+ArrowUp Control+ArrowDown Control+ArrowLeft Control+ArrowRight Meta+ArrowUp Meta+ArrowDown Meta+ArrowLeft Meta+ArrowRight'
}
