import type { CSSProperties } from 'react'
import { findButtonAsset } from '../../assets/buttons/buttonAssetCatalog'
import type { ButtonEditorElement } from '../../model/editorProject'

type ButtonElementContentProps = {
  element: ButtonEditorElement
}

type ButtonElementStyle = CSSProperties & {
  '--button-label-color': string
}

export function ButtonElementContent({
  element,
}: ButtonElementContentProps) {
  const asset = findButtonAsset(element.assetId)

  if (!asset) {
    return (
      <span
        className="button-element-content button-element-content--missing"
        aria-hidden="true"
        data-button-asset-id={element.assetId}
      >
        <span className="button-element-content__missing-label">
          Knappdesign mangler
        </span>
      </span>
    )
  }

  const style: ButtonElementStyle = {
    '--button-label-color': asset.labelColor,
  }

  return (
    <span
      className="button-element-content"
      style={style}
      aria-hidden="true"
      data-button-asset-id={asset.id}
    >
      <img
        className="button-element-content__asset"
        src={asset.src}
        alt=""
        draggable={false}
      />
      <span className="button-element-content__label">
        {element.label}
      </span>
    </span>
  )
}
