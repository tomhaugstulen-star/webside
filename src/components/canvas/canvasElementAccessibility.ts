import type { EditorElement } from '../../model/editorProject'

export const elementKindLabels: Record<EditorElement['kind'], string> = {
  section: 'Seksjon',
  image: 'Bilde',
  text: 'Tekstboks',
  button: 'Knapp',
}

export function getAccessibleElementLabel(element: EditorElement) {
  const kindLabel = elementKindLabels[element.kind]

  if (element.locked) {
    return `${kindLabel}, låst. Bruk objektverktøyet for å låse opp.`
  }

  if (element.kind === 'text') {
    const summary = element.content.trim().replace(/\s+/g, ' ').slice(0, 80)
    const contentLabel = summary ? `Innhold: ${summary}.` : 'Tom tekstboks.'
    return `${contentLabel} Dobbeltklikk eller trykk Enter når elementet er markert for å redigere. Piltaster flytter. Control eller Command sammen med piltaster endrer størrelse. Delete åpner slettebekreftelse.`
  }

  return `${kindLabel}. Piltaster flytter. Control eller Command sammen med piltaster endrer størrelse. Delete åpner slettebekreftelse.`
}

export function getCanvasElementKeyboardShortcuts(locked: boolean) {
  return locked
    ? 'Enter Space'
    : 'Enter Space Delete ArrowUp ArrowDown ArrowLeft ArrowRight Control+ArrowUp Control+ArrowDown Control+ArrowLeft Control+ArrowRight Meta+ArrowUp Meta+ArrowDown Meta+ArrowLeft Meta+ArrowRight'
}
