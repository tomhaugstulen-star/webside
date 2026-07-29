# Element- og prosjektmodell

Dette dokumentet beskriver den autoritative prosjektmodellen for Website-editoren.

## 1. Gjeldende skjemaversjon

```ts
EDITOR_PROJECT_SCHEMA_VERSION = 7
```

```text
versjon 1  grunnmodell for prosjekt, sider og elementer
versjon 2  varig tekstinnhold
versjon 3  varig tekststil
versjon 4  varig elementlenke
versjon 5  stabilt knappasset, knappetekst og knappelenke
versjon 6  bildeasset, metadata, alternativ tekst, visningsmodus og utsnitt
versjon 7  sidebakgrunn, Seksjon-utseende, Seksjon-ramme og tekstfarge
```

Det finnes ennå ingen prosjektfilimport eller migreringsmotor. Framtidig import må migrere eller avvise versjon 6 kontrollert før `replace-project`.

## 2. Prosjektstruktur

```text
EditorProject
  schemaVersion
  id
  name
  pages: EditorPage[]
    id
    name
    slug
    appearance
    elements: EditorElement[]
  createdAt
  updatedAt
```

Et nytt prosjekt starter med én blank side kalt `Forside`.

Prosjektmodellen er flat. En Seksjon eier ikke elementer som ligger visuelt over den. Rendering plasserer Seksjon bak Bilde, Tekst og Knapp uten å endre lagret elementrekkefølge.

## 3. Farger

```ts
type EditorColor = string // kanonisk #RRGGBB
```

Gyldige farger:

- seks heksadesimale sifre
- ledende `#`
- normalisert til store bokstaver
- ingen alpha
- ingen gradient
- ingen vilkårlig CSS-streng

```ts
type PageAppearance = {
  backgroundColor: EditorColor
}
```

Standard sidebakgrunn er `#FFFFFF`.

## 4. Felles elementdata

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

## 5. Elementtyper

### Seksjon

```ts
type SectionFrameWidth =
  | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

type SectionFrame = {
  width: SectionFrameWidth
  color: EditorColor
}

type SectionAppearance = {
  backgroundColor: EditorColor
  frame: SectionFrame
}

type SectionEditorElement = BaseEditorElement & {
  kind: 'section'
  appearance: SectionAppearance
}
```

Standard:

```text
bakgrunn: #FFFDFB
rammebredde: 0
rammefarge: #D8CEC8
```

`0` betyr `Ingen`. Rammefargen beholdes selv om bredden er `0`. Rammen ligger innenfor elementets lagrede størrelse.

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

Nye bilder starter med tom alternativ tekst, `contain`, zoom `1` og sentrert offset.

### Tekst

```ts
type TextElementStyle = {
  fontFamily: TextFontFamily
  fontSize: TextFontSize
  fontWeight: TextFontWeight
  fontStyle: TextFontStyle
  textAlign: TextAlignment
  lineHeight: TextLineHeight
  color: EditorColor
}

type TextEditorElement = BaseEditorElement & {
  kind: 'text'
  content: string
  textStyle: TextElementStyle
  link: ElementLink
}
```

Standard tekstfarge er `#625C58`.

### Knapp

```ts
type ButtonEditorElement = BaseEditorElement & {
  kind: 'button'
  assetId: ButtonAssetId
  label: string
  link: ElementLink
}
```

Knapper bruker ferdig SVG-fargedesign. Fargene er del av det valgte assetet og overstyres ikke av prosjektfargemodellen.

## 6. Prosjektfargeoversikt

`Farger` er avledet UI og lagres ikke i prosjektet.

Oversikten avledes fra aktiv side:

```text
Bakgrunn
  Sidebakgrunn
Element N
  Bakgrunn
  Ramme      bare når width > 0
Tekst N
  Tekstfarge
```

Bilde og Knapp oppretter ingen fargeoppføring. Nummerering avledes fra elementrekkefølgen og lagres ikke.

Hver oppføring peker til stabil side- eller element-ID og én konkret egenskap. Like fargeverdier kobler ikke elementer sammen.

## 7. Stabile asset-ID-er

### Knapp

- peker til en statisk katalog som bundles av Vite
- prosjektet lagrer ikke filsti, rå SVG eller Vite-URL
- ukjent ID gir kontrollert fallback

### Bilde

- kryptografisk UUID-basert identitet
- nøkkel til et separat transient ressurslager
- prosjektet lagrer ikke filsti, `File`, Blob eller Object URL
- manglende ressurs gir kontrollert fallback

## 8. Bilderessurslager

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
- import etter panel-unmount oppretter ikke ressurs eller element

Ressursbufferen gjelder bare aktiv nettleserøkt.

## 9. Bildevalidering og transform

```text
format: PNG, JPEG eller WebP
maks filstørrelse: 10 MB
maks dekodet pikselmengde: 40 megapiksler
maks bredde eller høyde: 16 384 px
zoom: 1..3
offsetX og offsetY: -1..1
```

`contain` viser hele motivet proporsjonalt. `crop` fyller rammen uten tomrom og bevarer sideforhold.

Versjon-6-transformen er definert mot:

```text
IMAGE_CROP_BASE_FRAME_SIZE_V6 = 240 × 160 px
```

Denne verdien forblir en skjemainvariant også i versjon 7. Endring krever ny skjemaversjon og migrering.

Ved crop-rammeresize flyttes aktiv kant, motsatt kant står fast, motivets størrelse og absolutte plassering beholdes, og ramme og transform lagres atomisk.

## 10. Elementstørrelser

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

## 11. Responsive verdier

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

- side- og elementfarger
- Seksjon-ramme
- låsestatus
- tekstinnhold og tekststil
- elementlenke
- knappdata
- bildeasset, metadata, alt-tekst, modus og transform

Responsive farger krever eksplisitt senere modellstøtte.

## 12. Sentral state og reducergrenser

Varige mutasjoner går gjennom typede actions for blant annet:

- opprette og slette element
- endre desktopgeometri
- endre låsestatus
- endre sidebakgrunn
- endre Seksjon-bakgrunn, rammebredde og rammefarge
- endre tekst, stil, tekstfarge og lenke
- endre knappetekst og design
- endre bildealternativ tekst, visning og transform
- endre crop-ramme og transform atomisk

Reducergrensene krever:

- aktiv side
- eksisterende element på aktiv side
- riktig elementtype
- ulåst element ved mutasjon
- gyldig kanonisk farge
- rammebredde innenfor `0–10`
- gyldige øvrige verdier og metadata
- faktisk endring

Ugyldige og uendrede handlinger returnerer samme state og endrer ikke `updatedAt`.

## 13. Varig og transient state

Varig:

- prosjekt, sider og elementer
- geometri, synlighet og låsestatus
- sideutseende, Seksjon-utseende og tekstfarge
- innhold, stil, lenker og asset-ID-er
- bildemetadata, modus og transform
- tidsstempler

Transient:

- markering
- pekerøkter og preview
- redigeringsøkter og drafts
- avledede fargegrupper
- `File`, Object URL og ressurskart
- paneler, dialoger, fokus og feedback

## 14. Krav til senere utvidelser

### Prosjektimport

Hele prosjektet må valideres før `replace-project`. Kjent skjemaversjon, unike ID-er, sider, farger, elementunion, layout og bildeinvarianter må kontrolleres samlet. Versjon 6 må migreres eller avvises kontrollert.

### Prosjektbytte

Bilderessursbufferen må avstemmes eller tømmes, og foreldede Object URL-er må tilbakekalles.

### Historikk

Angre/gjør om lagrer bare serialiserbar prosjektstate. `File`, Object URL og aktive interaksjoner skal aldri inngå.

### Mobiloverstyringer

Egne mobilgeometrier og eventuelle framtidige mobilfarger må bruke viewport-spesifikke actions.

### Autolagring

Autolagring skal trigges av gyldig prosjektstate, ikke transient editor- eller ressursstate.
