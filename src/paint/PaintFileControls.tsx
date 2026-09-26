import type { SupportedImageMimeType } from '../model/imageAsset'

type Props = {
  name: string
  format: SupportedImageMimeType
  message: string | null
  error: string | null
  onNameChange: (name: string) => void
  onFormatChange: (format: SupportedImageMimeType) => void
}

export function PaintFileControls({
  name, format, message, error, onNameChange, onFormatChange,
}: Props) {
  return (
    <>
      <div className="paint-dialog__save">
        <h3>Fil</h3>
        <label>Filnavn
          <input value={name} onChange={(event) => onNameChange(event.target.value)} />
        </label>
        <label>Format
          <select value={format} onChange={(event) =>
            onFormatChange(event.target.value as SupportedImageMimeType)}>
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/webp">WebP</option>
          </select>
        </label>
      </div>
      {(message || error) &&
        <p className="paint-dialog__message" role="status">{message || error}</p>}
    </>
  )
}
