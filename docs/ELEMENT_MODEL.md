# Element- og prosjektmodell

Dette dokumentet beskriver den autoritative serialiserbare modellen.

## Skjemaversjon

```ts
EDITOR_PROJECT_SCHEMA_VERSION = 8
```

```text
1  grunnmodell for prosjekt, sider og elementer
2  tekstinnhold
3  tekststil
4  elementlenke
5  knappasset, knappetekst og knappelenke
6  bildeasset, metadata, alternativ tekst, visning og utsnitt
7  sidebakgrunn, Seksjon-utseende, Seksjon-ramme og tekstfarge
8  Header med logo, tekst, utseende og ramme
```

Det finnes ennå ingen prosjektimport eller migreringsmotor. Framtidig import må validere hele versjon-8-objektet før `replace-project`, og eldre versjoner må migreres eller avvises kontrollert.

## Prosjektstruktur

```ts
type EditorProject = {
  schemaVersion: 8
  id: string
  name: string
  pages: EditorPage[]
  createdAt: string
  updatedAt: string
}

type EditorPage = {
  id: string
  name: string
  slug: string
  appearance: PageAppearance
  elements: EditorElement[]
}
```

Et nytt prosjekt starter med én blank side kalt `Forside`.

## Felles elementdata

```ts
type ResponsiveValue<T> = {
  desktop: T
  mobile?: T
}

type BaseEditorElement = {
  id: string
  position: ResponsiveValue<{ x: number; y: number }>
  size: ResponsiveValue<{ width: number; height: number }>
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
  | HeaderEditorElement
```

Telefon arver desktopverdien når `mobile` mangler. Dagens UI oppretter ikke mobiloverstyringer.

## Seksjon

```ts
type SectionEditorElement = BaseEditorElement & {
  kind: 'section'
  appearance: {
    backgroundColor: EditorColor
    frame: ElementFrame
  }
}
```

Standardstørrelse: `320 × 180 px`  
Minimum: `160 × 90 px`

## Bilde

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

Standardstørrelse: `240 × 160 px`  
Minimum: `120 × 80 px`

Crop-grunnrammen for versjon 6 forblir `240 × 160 px`. Endring krever ny skjemaversjon og migrering.

## Tekst

```ts
type TextEditorElement = BaseEditorElement & {
  kind: 'text'
  content: string
  textStyle: TextElementStyle
  link: ElementLink
}
```

Standardstørrelse: `240 × 96 px`  
Minimum: `120 × 48 px`

## Knapp

```ts
type ButtonEditorElement = BaseEditorElement & {
  kind: 'button'
  assetId: ButtonAssetId
  label: string
  link: ElementLink
}
```

Standardstørrelse: `160 × 48 px`  
Minimum: `80 × 36 px`

Knapper bruker ferdig SVG-fargedesign.

## Header

```ts
type HeaderEditorElement = BaseEditorElement & {
  kind: 'header'
  logoAssetId: ImageAssetId
  logoAssetMetadata: ImageAssetMetadata
  siteName: string
  subtitle: string
  appearance: HeaderAppearance
}

type HeaderAppearance = {
  backgroundColor: EditorColor
  textColor: EditorColor
  fontFamily: TextFontFamily
  frame: ElementFrame
}
```

Regler:

- `siteName` er obligatorisk, normalisert og maks 80 tegn
- `subtitle` er valgfri, normalisert og maks 120 tegn
- logo bruker samme validerte metadata og transiente ressurslager som Bilde
- Header rendres alltid ved `x = 0` og med aktiv lerretsbredde
- brukeren kan bare endre `y` og høyde
- standardhøyde er 88 px
- minimumshøyde er 70 px
- maksimumshøyde er 100 px
- Telefon arver desktop y/høyde inntil fase 15
- navn og undertittel deler font og tekstfarge

Baseelementet krever fortsatt `position.desktop.x` og `size.desktop.width`. For Header er disse horisontale feltene deterministiske, normaliseres av modell/state-laget og brukes ikke som fri brukerredigerbar bredde.

## Farge og ramme

```ts
type EditorColor = string // kanonisk #RRGGBB

type ElementFrame = {
  width: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  color: EditorColor
}
```

- `0` betyr `Ingen`
- rammefargen beholdes når bredden settes til `0`
- rammen ligger innenfor elementets ytre størrelse
- `Farger` er avledet UI og lagres ikke som egen palett
- Seksjon og Header viser bakgrunn og eventuell rammefarge
- Tekst og Header viser tekstfarge

## Asset-ID og ressurslager

Prosjektet lagrer stabil asset-ID og serialiserbar metadata. Følgende lagres ikke:

- `File`
- Blob
- Object URL
- lokal filsti

Det transiente ressurslageret eier faktisk fil og Object URL. Sletting fjerner ressursen bare når ingen Bilde- eller Header-elementer refererer til asset-ID-en.

## Reducergrenser

Reducerhandlinger krever:

- aktiv side
- eksisterende element på aktiv side
- riktig elementtype
- ulåst element ved mutasjon
- gyldig og kanonisk verdi
- gyldig layout og størrelsesintervall
- faktisk endring

Ugyldige og uendrede handlinger returnerer samme state og endrer ikke `updatedAt`.

## Senere utvidelser

- prosjektimport validerer hele skjemaet før prosjektbytte
- prosjektbytte avstemmer eller tømmer ressurslageret
- historikk lagrer bare serialiserbar prosjektstate
- mobiloverstyringer bruker viewport-spesifikke actions
- autolagring reagerer på gyldige prosjektmutasjoner, ikke transient state
