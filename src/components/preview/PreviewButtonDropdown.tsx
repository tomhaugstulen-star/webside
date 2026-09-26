import { useEffect, useId, useRef, useState } from 'react'
import type { ButtonEditorElement, EditorElement } from '../../model/editorProject'
import type { NavigationTarget, WebsiteNavigation } from '../../model/navigation'
import { resolveNavigationTargetHref } from '../../model/navigationHref'
import { ButtonElementContent } from '../canvas/ButtonElementContent'

type Props = {
  element: ButtonEditorElement
  pages: readonly { id: string; slug: string; elements: EditorElement[] }[]
  navigation: WebsiteNavigation
  onNavigate: (target: NavigationTarget) => void
}

export function PreviewButtonDropdown({ element, pages, navigation, onNavigate }: Props) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeEscape)
    }
  }, [])

  const items = navigation.items.filter((item) => resolveNavigationTargetHref(pages, item.target))
  return <div className="preview-button-menu" ref={root}>
    <button type="button" className="preview-button-menu__trigger" aria-label={element.label} aria-expanded={open}
      aria-controls={id} onClick={() => setOpen((value) => !value)}>
      <ButtonElementContent element={element} />
    </button>
    {open && <nav id={id} className="preview-button-menu__list" aria-label={`${element.label}: navigasjon`}>
      {items.map((item) => <button key={item.id} type="button"
        className={item.parentId ? 'preview-button-menu__child' : ''}
        onClick={() => { setOpen(false); onNavigate(item.target) }}>{item.label}</button>)}
      {items.length === 0 && <span>Legg til lenker under Navigasjon.</span>}
    </nav>}
  </div>
}
