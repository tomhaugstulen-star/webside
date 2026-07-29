# Element- og prosjektmodell

Dette dokumentet beskriver den autoritative prosjektmodellen for Website-editoren.

## 1. Gjeldende skjemaversjon

Fase 11A utvider prosjektmodellen til:

```ts
EDITOR_PROJECT_SCHEMA_VERSION = 6
```

Skjemahistorikk:

```text
versjon 1  grunnmodell for prosjekt, sider og elementer
versjon 2  varig tekstinnhold
versjon 3  varig tekststil
versjon 4  varig elementlenke
versjon 5  stabilt knappasset, knappetekst og knappelenke
versjon 6  bildeasset, metadata, alternativ tekst, visningsmodus og utsnitt
```

Det finnes ennå ingen prosjektfilimport eller migreringsmotor. Migrering mellom skjemaversjoner bygges sammen med en senere lagrings- og importfase.

## 2. Prosjektstruktur

Et `EditorProject` inneholder:

- skjemaversjon
- stabil prosjekt-ID
- prosjektnavn
- én eller flere sider
- opprettet- og oppdatert-tidspunkt

Et nytt prosjekt starter med én blank side kalt `Forside`.

```text
EditorProject
  pages: EditorPage[]
    elements: EditorElement[]
```

Prosjektmodellen er flat. En Seksjon eier ikke automatisk elementer som ligger visuelt over den. Canvas-rendereren legger Seksjon bak Bilde, Tekst og Knapp uten å endre lagret elementrekkefølge eller innføre parent-child-relasjoner.

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

`EditorElement` er en diskriminert union:

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
  mode: ImageMode
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

type ImageMode = 'contain' | 'crop'

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

`assetId`, metadata, alternativ tekst, visningsmodus og transform er varig prosjektdata. Lokal fil, binærdata og Object URL er ikke prosjektdata.

### Tekst

```ts
type TextEditorElement = BaseEditorElement & {
  kind: 'text'
  content: string
  textStyle: TextElementStyle
  link: ElementLink
}
```

Nye tekstbokser starter med tomt innhold, standardstil og ingen lenke. Editor-placeholder lagres aldri som innhold.

### Knapp

```ts
type ButtonEditorElement = BaseEditorElement & {
  kind: 'button'
  assetId: ButtonAssetId
  label: string
  link: ElementLink
}
```

Nye knapper starter med:

```text
assetId: button.primary-rounded.v1
label: Les mer
link: none
```

## 5. Stabile asset-ID-er

Knapp- og bildeasset bruker stabile ID-er, men ressursmodellene er forskjellige.

### Knapp

- ID-en peker til en statisk katalog som bundles av Vite.
- Prosjektet lagrer ikke filsti, rå SVG eller Vite-generert URL.
- Ukjent lagret ID gir kontrollert fallback.

### Bilde

- ID-en er en kryptografisk UUID-basert prosjektidentitet.
- ID-en er nøkkel til et separat transient ressurslager.
- Prosjektet lagrer ikke lokal filsti, `File`, Blob eller Object URL.
- Ukjent eller manglende ressurs gir kontrollert fallback.
- Ressurslageret eier oppretting og tilbakekalling av Object URL.

## 6. Bilderessurslager

Ressurslageret inneholder transient:

```text
ImageAssetId -> {
  file: File
  objectUrl: string
  metadata: ImageAssetMetadata
}
```

Regler:

- fil og metadata må ha samme MIME-type, filstørrelse og filnavn
- samme `assetId` registreres ikke to ganger
- en Object URL tilbakekalles ved ressursfjerning
- alle gjenværende Object URL-er tilbakekalles når provideren demonteres
- sletting fjerner ressursen bare når ingen andre bildeelementer deler samme `assetId`
- mislykket elementoppretting rydder den registrerte ressursen

Ressursbufferen er foreløpig bare for aktiv nettleserøkt. Varig binærlagring hører til en senere lagringsfase.

## 7. Bildevisning og transform

### `contain`

- hele bildet vises proporsjonalt
- bildet skaleres etter gjeldende ramme og sentreres
- tomrom er tillatt ved ulikt sideforhold
- transformen beholdes, men brukes ikke visuelt
- rammeresize kan derfor endre motivets viste størrelse i denne modusen

### `crop`

- bildet fyller rammen uten tomrom
- sideforholdet bevares
- zoom er begrenset til `1..3`
- minimum zoom økes automatisk når rammen krever det
- `offsetX` og `offsetY` er normalisert til `-1..1`
- offset begrenses slik at tomrom ikke blir synlig
- crop-rammen kan ikke være større enn motivet ved aktiv zoom
- overgang fra en for stor contain-ramme gir en sentrert, gyldig crop-ramme

Crop-resize følger en egen regel:

- motivets skalerte bredde og høyde beholdes
- motivets absolutte plassering på lerretet beholdes så langt crop-grensene tillater
- bare den aktive rammekanten flyttes
- motsatt rammekant står fast
- mindre ramme klipper mer av motivet i stedet for å skalere eller sentrere det på nytt
- større ramme avslører mer av motivet uten å øke zoom automatisk
- normalisert offset beregnes på nytt fra motivets absolutte plassering og den nye rammen

Normalisert offset er serialiserbar og skjermuavhengig. Fordi normaliseringen avhenger av gjeldende overløp, må offset korrigeres når crop-rammen endrer størrelse. Ramme og korrigert transform lagres derfor i én atomisk reducerhandling.

## 8. Elementstørrelser

Standard- og minimumsstørrelser har én autoritativ modellkilde.

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

Bildeelementets størrelse representerer den synlige rammen, ikke motivets egen størrelse.

## 9. Responsive verdier

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
- knappens `assetId` og `label`
- bildets `assetId`, metadata, alternativ tekst, visningsmodus og transform

## 10. Sentral state og reducergrenser

`EditorProjectProvider` eier prosjektmodell, aktiv side og markering.

Varige mutasjoner går gjennom uttømmende reducer-actions, blant annet:

- opprette og slette element
- endre desktopgeometri
- endre låsestatus
- endre tekstinnhold og tekststil
- endre elementlenke
- endre knappetekst og knappdesign
- endre bildealternativ tekst
- endre bildevisning
- endre bildetransform
- endre crop-bilderamme og korrigert transform atomisk

`set-image-desktop-frame` brukes for crop-resize. Handlingen inneholder:

```ts
{
  type: 'set-image-desktop-frame'
  elementId: string
  layout: ElementLayout
  transform: ImageTransform
  updatedAt: string
}
```

Reducergrensene krever:

- aktiv side
- eksisterende element på aktiv side
- riktig elementtype
- ulåst element ved mutasjon
- gyldig verdi
- faktisk endring

Bildegrensene validerer i tillegg:

- gyldig stabil `assetId`
- gyldig serialiserbar metadata
- kjent visningsmodus
- finitte zoom- og offsetverdier
- gyldig crop-ramme ved lagret zoom
- transform normalisert mot den nye rammen ved atomisk crop-resize
- ingen transformmutasjon når bildet står i `contain`

Ugyldige eller uendrede handlinger returnerer samme state og endrer ikke `updatedAt`.

## 11. Varig og transient state

Varig prosjektdata:

- sider og elementer
- geometri og synlighet
- låsestatus
- tekstinnhold og tekststil
- elementlenke
- knappens asset-ID og label
- bildets asset-ID, metadata, alternativ tekst, modus og transform
- tidsstempler

Transient state:

- `selectedElementId`
- pekerinteraksjon og layout-preview
- midlertidig bilderamme og korrigert preview-transform under drag
- aktiv tekstredigeringsøkt
- formularutkast og feedback
- bildefil, Object URL og ressurskart
- katalogvisning
- slettedialogens mål og fokusreferanse
- åpne paneler, fokus og hover

Transient state skal ikke serialiseres, eksporteres eller publiseres.

## 12. Videre modellutvidelser

Planlagte senere utvidelser:

- prosjektfarger
- logo og header
- eksplisitte mobiloverstyringer
- historikk
- varig lokal lagring og ressursserialisering
- prosjektimport og migrering
- forhåndsvisning og publisering

Ingen senere modellutvidelse er aktiv før fase 11A er eksplisitt godkjent og merget.
