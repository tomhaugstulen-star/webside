# Element- og prosjektmodell

Dette dokumentet beskriver den autoritative prosjektmodellen for Website-editoren.

## 1. Gjeldende skjemaversjon

```ts
EDITOR_PROJECT_SCHEMA_VERSION = 6
```

```text
versjon 1  grunnmodell for prosjekt, sider og elementer
versjon 2  varig tekstinnhold
versjon 3  varig tekststil
versjon 4  varig elementlenke
versjon 5  stabilt knappasset, knappetekst og knappelenke
versjon 6  bildeasset, metadata, alternativ tekst, visningsmodus og utsnitt
```

Det finnes ennå ingen prosjektfilimport eller migreringsmotor. En annen bilde- eller crop-modell krever ny skjemaversjon og kontrollert migrering.

## 2. Prosjektstruktur

```text
EditorProject
  schemaVersion
  id
  name
  pages: EditorPage[]
    elements: EditorElement[]
  createdAt
  updatedAt
```

Et nytt prosjekt starter med én blank side kalt `Forside`.

Prosjektmodellen er flat. En Seksjon eier ikke elementer som ligger visuelt over den. Rendering plasserer Seksjon bak Bilde, Tekst og Knapp uten å endre lagret elementrekkefølge.

## 3. Felles elementdata

```ts
type BaseEditorElement = {
  id: string
  position: ResponsiveValue<CanvasPosition>
  size: ResponsiveValue<ElementSize>
  visibility: ResponsiveValue<boolean>
  locked: boolean
}
```

```ts
type EditorElement =
  | SectionEditorElement
  | ImageEditorElement
  | TextEditorElement
  | ButtonEditorElement
```

## 4. Elementtyper

### Seksjon

```ts
type SectionEditorElement = BaseEditorElement & {
  kind: 'section'
}
```

### Bilde

```ts
type ImageEditorElement = BaseEditorElement & {
  kind: 'image'
  assetId: ImageAssetId
  assetMetadata: ImageAssetMetadata
  altText: string
  mode: 'contain' | 'crop'
  transform: ImageTransform
}
```

```ts
type ImageAssetMetadata = {
  fileName: string
  mimeType: 'image/png' | 'image/jpeg' | 'image/webp'
  byteSize: number
  width: number
  height: number
}

type ImageTransform = {
  zoom: number
  offsetX: number
  offsetY: number
}
```

Nye bilder starter med:

```text
altText: ''
mode: contain
zoom: 1
offsetX: 0
offsetY: 0
```

### Tekst

```ts
type TextEditorElement = BaseEditorElement & {
  kind: 'text'
  content: string
  textStyle: TextElementStyle
  link: ElementLink
}
```

### Knapp

```ts
type ButtonEditorElement = BaseEditorElement & {
  kind: 'button'
  assetId: ButtonAssetId
  label: string
  link: ElementLink
}
```

## 5. Stabile asset-ID-er

### Knapp

- peker til en statisk katalog som bundles av Vite
- prosjektet lagrer ikke filsti, rå SVG eller Vite-URL
- ukjent ID gir kontrollert fallback

### Bilde

- kryptografisk UUID-basert identitet
- nøkkel til et separat transient ressurslager
- prosjektet lagrer ikke filsti, `File`, Blob eller Object URL
- manglende ressurs gir kontrollert fallback

## 6. Bilderessurslager

```text
ImageAssetId -> {
  file: File
  objectUrl: string
  metadata: ImageAssetMetadata
}
```

Regler:

- fil og metadata har samme filnavn, MIME-type og byte-størrelse
- samme `assetId` registreres ikke to ganger
- Object URL tilbakekalles ved ressursfjerning
- alle URL-er tilbakekalles ved provider-unmount
- sletting fjerner ressursen bare når asset ikke deles
- mislykket elementoppretting rydder registrert ressurs
- import som avsluttes etter panel-unmount oppretter ikke ressurs eller element

Ressursbufferen gjelder bare aktiv nettleserøkt. Varig binærlagring bygges senere.

## 7. Bildevalidering

Autoritative import- og metadatagrenser:

```text
format: PNG, JPEG eller WebP
maks filstørrelse: 10 MB
maks dekodet pikselmengde: 40 megapiksler
maks bredde eller høyde: 16 384 px
```

Metadata er gyldig bare når:

- filnavnet er ikke tomt
- MIME-type er støttet
- byte-størrelse er heltall innenfor grensen
- bredde og høyde er positive heltall
- dimensjon og pikselmengde er innenfor modellgrensene

Disse reglene gjelder både UI-import og framtidig prosjektvalidering.

## 8. Bildevisning og transform

### `contain`

- hele motivet vises proporsjonalt
- motivet sentreres i rammen
- tomrom er tillatt ved ulikt sideforhold
- transform beholdes, men brukes ikke visuelt

### `crop`

- motivet fyller rammen uten tomrom
- sideforholdet bevares
- zoom begrenses til `1..3`
- minimum zoom økes når rammen krever det
- offset normaliseres til `-1..1`
- offset begrenses slik at tomrom ikke blir synlig
- rammen kan ikke være større enn motivet ved aktiv zoom

## 9. Fast crop-grunnramme for versjon 6

Versjon-6-transformen er definert mot:

```text
IMAGE_CROP_BASE_FRAME_SIZE_V6 = 240 × 160 px
```

Denne verdien er en skjemainvariant, ikke bare standardstørrelsen for nye bilder. Senere endring av bildets opprettingsstørrelse skal derfor ikke endre hvordan lagret `zoom`, `offsetX` eller `offsetY` tolkes.

Endring av crop-grunnrammen krever:

1. ny skjemaversjon
2. eksplisitt migrering av transformdata
3. verifisering av eksisterende prosjekter

## 10. Rammeresize i crop

Bilderammen og motivet er separate konsepter.

Ved rammeresize:

- aktiv kant flyttes
- motsatt kant står fast
- motivets størrelse beholdes
- motivets absolutte plassering på lerretet beholdes
- ny normalisert offset beregnes mot den nye rammen
- ramme og transform lagres atomisk

Pekerpreview og reducercommit bruker samme modellberegning.

## 11. Elementstørrelser

```text
Standard:
Seksjon  320 × 180 px
Bilde    240 × 160 px
Tekst    240 × 96 px
Knapp    160 × 48 px

Minimum:
Seksjon  160 × 90 px
Bilde    120 × 80 px
Tekst    120 × 48 px
Knapp    80 × 36 px
```

Bildeelementets størrelse er den synlige rammen, ikke motivets egen størrelse.

## 12. Responsive verdier

```ts
type ResponsiveValue<T> = {
  desktop: T
  mobile?: T
}
```

Når mobilverdien mangler, arver Telefon desktopverdien.

Responsive verdier:

- posisjon
- størrelse
- synlighet

Foreløpig felles for PC og Telefon:

- låsestatus
- tekstinnhold og tekststil
- elementlenke
- knappdata
- bildeasset, metadata, alt-tekst, modus og transform

## 13. Sentral state og reducergrenser

Varige mutasjoner går gjennom typede actions for blant annet:

- opprette og slette element
- endre desktopgeometri
- endre låsestatus
- endre tekst, stil og lenke
- endre knappetekst og design
- endre bildealternativ tekst
- endre bildevisning og transform
- endre crop-ramme og transform atomisk

Reducergrensene krever:

- aktiv side
- eksisterende element på aktiv side
- riktig elementtype
- ulåst element ved mutasjon
- gyldige verdier og metadata
- gyldig crop-geometri
- faktisk endring

Ugyldige og uendrede handlinger returnerer samme state og endrer ikke `updatedAt`.

## 14. Varig og transient state

Varig:

- prosjekt, sider og elementer
- geometri, synlighet og låsestatus
- innhold, stil, lenker og asset-ID-er
- bildemetadata, modus og transform
- tidsstempler

Transient:

- markering
- pekerøkter og preview
- redigeringsøkter og drafts
- `File`, Object URL og ressurskart
- paneler, dialoger, fokus og feedback

## 15. Krav til senere utvidelser

### Prosjektimport

Hele prosjektet må valideres før `replace-project`. Kjent skjemaversjon, unike ID-er, aktive sider, elementunion, layout og bildeinvarianter må kontrolleres samlet.

### Prosjektbytte

Bilderessursbufferen må avstemmes eller tømmes, og foreldede Object URL-er må tilbakekalles.

### Historikk

Angre/gjør om lagrer bare serialiserbar prosjektstate. `File`, Object URL og aktive interaksjoner skal aldri inngå.

### Mobiloverstyringer

Egne mobilgeometrier må bruke viewport-spesifikke actions og ikke overskrive desktopverdier.

### Autolagring

Autolagring skal trigges av gyldig prosjektstate, ikke transient editor- eller ressursstate.
