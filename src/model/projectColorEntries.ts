import type { EditorColor } from './editorColor'
import type { EditorPage } from './editorProject'

export type ProjectColorTarget =
  | { type: 'page-background' }
  | { type: 'section-background'; elementId: string }
  | { type: 'section-frame'; elementId: string }
  | { type: 'text-background'; elementId: string }
  | { type: 'text-color'; elementId: string }
  | { type: 'header-background'; elementId: string }
  | { type: 'header-text'; elementId: string }
  | { type: 'header-frame'; elementId: string }

export type ProjectColorEntry = {
  id: string
  label: string
  value: EditorColor
  disabled: boolean
  target: ProjectColorTarget
}

export type ProjectColorGroup = {
  id: string
  label: string
  locked: boolean
  entries: ProjectColorEntry[]
}

export function getProjectColorGroups(page: EditorPage): ProjectColorGroup[] {
  const groups: ProjectColorGroup[] = [
    {
      id: `page-${page.id}`,
      label: 'Bakgrunn',
      locked: false,
      entries: [
        {
          id: `page-${page.id}-background`,
          label: 'Sidebakgrunn',
          value: page.appearance.backgroundColor,
          disabled: false,
          target: { type: 'page-background' },
        },
      ],
    },
  ]
  let sectionNumber = 0
  let textNumber = 0
  let headerNumber = 0

  page.elements.forEach((element) => {
    if (element.kind === 'section') {
      sectionNumber += 1
      const entries: ProjectColorEntry[] = [
        {
          id: `${element.id}-background`,
          label: 'Bakgrunn',
          value: element.appearance.backgroundColor,
          disabled: element.locked,
          target: { type: 'section-background', elementId: element.id },
        },
      ]

      if (element.appearance.frame.width > 0) {
        entries.push({
          id: `${element.id}-frame`,
          label: 'Ramme',
          value: element.appearance.frame.color,
          disabled: element.locked,
          target: { type: 'section-frame', elementId: element.id },
        })
      }

      groups.push({
        id: element.id,
        label: `Element ${sectionNumber}`,
        locked: element.locked,
        entries,
      })
      return
    }

    if (element.kind === 'text') {
      textNumber += 1
      groups.push({
        id: element.id,
        label: `Tekst ${textNumber}`,
        locked: element.locked,
        entries: [
          {
            id: `${element.id}-background`,
            label: 'Bakgrunn',
            value: element.appearance.backgroundColor,
            disabled: element.locked,
            target: { type: 'text-background', elementId: element.id },
          },
          {
            id: `${element.id}-text`,
            label: 'Tekstfarge',
            value: element.textStyle.color,
            disabled: element.locked,
            target: { type: 'text-color', elementId: element.id },
          },
        ],
      })
      return
    }

    if (element.kind === 'header') {
      headerNumber += 1
      const entries: ProjectColorEntry[] = [
        {
          id: `${element.id}-background`,
          label: 'Bakgrunn',
          value: element.appearance.backgroundColor,
          disabled: element.locked,
          target: { type: 'header-background', elementId: element.id },
        },
        {
          id: `${element.id}-text`,
          label: 'Tekstfarge',
          value: element.appearance.textColor,
          disabled: element.locked,
          target: { type: 'header-text', elementId: element.id },
        },
      ]

      if (element.appearance.frame.width > 0) {
        entries.push({
          id: `${element.id}-frame`,
          label: 'Ramme',
          value: element.appearance.frame.color,
          disabled: element.locked,
          target: { type: 'header-frame', elementId: element.id },
        })
      }

      groups.push({
        id: element.id,
        label: `Header ${headerNumber}`,
        locked: element.locked,
        entries,
      })
    }
  })

  return groups
}
