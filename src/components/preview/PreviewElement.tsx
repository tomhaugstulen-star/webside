import type { CSSProperties } from 'react'
import type { EditorElement } from '../../model/editorProject'
import { resolveResponsiveElementLayout } from '../../model/resolveResponsiveElementLayout'
import { resolveResponsiveValue } from '../../model/resolveResponsiveValue'
import type { NavigationTarget, WebsiteNavigation } from '../../model/navigation'
import type { ViewportMode } from '../../types/editor'
import { ButtonElementContent } from '../canvas/ButtonElementContent'
import { HeaderElementContent } from '../canvas/HeaderElementContent'
import { HeroElementContent } from '../canvas/HeroElementContent'
import { ImageElementContent } from '../canvas/ImageElementContent'
import { getElementAppearanceCssStyle } from '../canvas/getElementAppearanceCssStyle'
import { getTextElementCssStyle } from '../canvas/getTextElementCssStyle'

type PreviewElementProps = {
  element: EditorElement
  viewport: ViewportMode
  canvasWidth: number
  pages: readonly { id: string; slug: string; elements: EditorElement[] }[]
  navigation: WebsiteNavigation
  activePageId: string
  onNavigate: (target: NavigationTarget) => void
}

function externalLinkProps(link: { type: string; url?: string; openInNewTab?: boolean }) {
  if (link.type !== 'external-url' || !link.url) return null

  return {
    href: link.url,
    target: link.openInNewTab ? '_blank' : undefined,
    rel: link.openInNewTab ? 'noreferrer' : undefined,
  }
}

export function PreviewElement({
  element,
  viewport,
  canvasWidth,
  pages,
  navigation,
  activePageId,
  onNavigate,
}: PreviewElementProps) {
  if (!resolveResponsiveValue(element.visibility, viewport)) return null

  const layout = resolveResponsiveElementLayout(element, viewport, canvasWidth)
  const style: CSSProperties = {
    left: layout.position.x,
    top: layout.position.y,
    width: layout.size.width,
    height: layout.size.height,
    ...getElementAppearanceCssStyle(element),
    ...(element.kind === 'text'
      ? getTextElementCssStyle(element.textStyle)
      : {}),
  }

  let content
  switch (element.kind) {
    case 'section':
      content = null
      break
    case 'image':
      content = (
        <ImageElementContent
          element={element}
          frameSize={layout.size}
          selected={false}
          onSelect={() => undefined}
        />
      )
      break
    case 'text': {
      const link = externalLinkProps(element.link)
      const text = <span className="preview-element__text">{element.content}</span>
      content = link ? <a {...link}>{text}</a> : text
      break
    }
    case 'button': {
      const link = externalLinkProps(element.link)
      const button = <ButtonElementContent element={element} />
      content = link ? <a className="preview-element__link" {...link}>{button}</a> : button
      break
    }
    case 'header':
      content = (
        <HeaderElementContent
          element={element}
          onNavigate={onNavigate}
          navigationContext={{ pages, navigation, activePageId }}
        />
      )
      break
    case 'hero':
      content = <HeroElementContent element={element} previewLinks />
      break
  }

  return (
    <div
      id={element.kind === 'section' ? element.anchorId : undefined}
      className={`preview-element preview-element--${element.kind}`}
      style={style}
      data-element-id={element.id}
    >
      {content}
    </div>
  )
}
