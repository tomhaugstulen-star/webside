import { PaintDesignControls } from './PaintDesignControls'
import type { PaintDesignPanel } from './paintDesignPanel'
import type { PaintFill } from './paintFill'

type Props = {
  panel: PaintDesignPanel
  fill: PaintFill
  textValue: string
  textColor: string
  textSize: number
  textActive: boolean
  disabled: boolean
  onFillChange: (fill: PaintFill) => void
  onFillBackground: () => void
  onTextValueChange: (value: string) => void
  onTextColorChange: (color: string) => void
  onTextSizeChange: (size: number) => void
  onActivateText: () => void
  onCommitText: () => void
  onClose: () => void
}

export function PaintDesignDialog({
  panel, fill, textValue, textColor, textSize, textActive, disabled,
  onFillChange, onFillBackground, onTextValueChange, onTextColorChange,
  onTextSizeChange, onActivateText, onCommitText, onClose,
}: Props) {
  return (
    <section className="paint-design-dialog" role="dialog"
      aria-label={panel === 'colors' ? 'Fargeinnstillinger' : 'Tekstinnstillinger'}>
      <header className="paint-design-dialog__header">
        <div>
          <h2>{panel === 'colors' ? 'Farger' : 'Tekst'}</h2>
          <p>{panel === 'colors'
            ? 'Bakgrunn og gradient for canvas.'
            : 'Skriv og formater tekst før den plasseres på canvas.'}</p>
        </div>
        <button type="button" aria-label="Lukk innstillinger" onClick={onClose}>×</button>
      </header>
      <PaintDesignControls
        panel={panel}
        fill={fill}
        textValue={textValue}
        textColor={textColor}
        textSize={textSize}
        textActive={textActive}
        disabled={disabled}
        onFillChange={onFillChange}
        onFillBackground={onFillBackground}
        onTextValueChange={onTextValueChange}
        onTextColorChange={onTextColorChange}
        onTextSizeChange={onTextSizeChange}
        onActivateText={onActivateText}
        onCommitText={onCommitText}
      />
    </section>
  )
}
