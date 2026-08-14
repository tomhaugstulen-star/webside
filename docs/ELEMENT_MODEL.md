# Element- og prosjektmodell

Dette dokumentet beskriver den autoritative serialiserbare modellen.

## Skjemaversjon

```ts
EDITOR_PROJECT_SCHEMA_VERSION = 12
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
9  Header-fontstørrelse
10 Tekstutseende med varig tekstboksbakgrunn
11 Sider, offentlige seksjons-ID-er og nettstednavigasjon
12 Tekstboksramme og 1 px standardramme for nye innrammede elementer
```

Det finnes ennå ingen prosjektimport-UI. Modellen har en deterministisk migreringskjede fra versjon 10 til gjeldende skjema, og framtidig import må validere den ferdig migrerte strukturen før `replace-project`.

Kontrollert migreringsretning:

- versjon 8 til 9 må legge til `HeaderAppearance.fontSize`, standard 24 px
- versjon 9 til 10 må legge til `TextAppearance.backgroundColor`, standard `#FFFFFF`
- versjon 10 til 11 legger til stabile seksjonsankere og tom `WebsiteNavigation`
- versjon 11 til 12 legger til `TextAppearance.frame` med 1 px standardramme
- Header med lagret `x` eller `y` ulik 0 må normaliseres eller avvises
- Header med `locked: true` må normaliseres eller avvises
- eldre ukjente versjoner må ikke lastes delvis

## Prosjektstruktur

```ts
type EditorProject = {
  schemaVersion: 12
  id: string
  name: string
  pages: EditorPage[]
  navigation: WebsiteNavigation
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

`locked` beholdes som felles data. Seksjon, Bilde, Tekst og Knapp kan endre feltet. Header er ikke låsbar: nye Header-elementer opprettes med `locked: false`, UI eksponerer ingen låsing, og reduceren avviser Header-låsehandlinger.

## Seksjon

```ts
type SectionEditorElement = BaseEditorElement & {
  kind: 'section'
  anchorId: string
  appearance: {
    backgroundColor: EditorColor
    frame: ElementFrame
  }
}
```

Standardstørrelse: `320 × 180 px`  
Minimum: `160 × 90 px`

`anchorId` er en offentlig, URL-/fragmentvennlig seksjons-ID som er separat fra elementets interne `id`. Den er unik innen siden, opprettes deterministisk som `seksjon`, `seksjon-2` osv., og endres bare ved en eksplisitt brukerhandling. Flytting, sidenavn og andre redigeringer endrer ikke en etablert seksjons-ID.

Editorens interne DOM kan fortsatt bruke egne editoridentifikatorer. Det offentlige ankeret er prosjektdata og skal brukes av senere Header-/forhåndsvisningsrendering.

## Nettstednavigasjon

```ts
type WebsiteNavigation = {
  items: NavigationItem[]
}

type NavigationItem = {
  id: string
  label: string
  target:
    | { type: 'page'; pageId: string }
    | { type: 'section'; pageId: string; elementId: string }
}
```

Navigasjonsmål peker på stabile prosjekt-ID-er, ikke DOM-noder, slugs, ankertekst eller visningstekst. Seksjonsmål bruker den interne stabile element-ID-en for referanseintegritet; offentlig URL-fragment avledes senere fra seksjonens `anchorId`.

Side- og seksjonssletting rydder navigasjonspunkter som ellers ville blitt hengende. Ugyldige mål avvises ved reducergrensen. Menymodellen er serialiserbar prosjektdata; faktisk Header-meny og navigasjonsrendering bygges i fase 20.

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
  appearance: TextAppearance
  link: ElementLink
}

type TextAppearance = {
  backgroundColor: EditorColor
  frame: ElementFrame
}
```

Standardstørrelse: `240 × 96 px`  
Minimum: `120 × 48 px`

Teksttypografi og tekstfarge ligger fortsatt i `TextElementStyle`. Tekstboksens varige bakgrunn og ramme ligger i `TextAppearance`. Ny Tekst opprettes med kanonisk `#FFFFFF` og 1 px ramme. Rammen kan eksplisitt settes til `Ingen`/0 px eller 1–10 px med egen rammefarge.

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
  fontSize: TextFontSize
  frame: ElementFrame
}
```

Regler:

- `siteName` er obligatorisk, normalisert og maks 80 tegn
- `subtitle` er valgfri, normalisert og maks 120 tegn
- logo bruker samme validerte metadata og transiente ressurslager som Bilde
- Header opprettes, lagres og rendres ved `x = 0, y = 0`
- synlig bredde er hele aktivt lerret
- brukeren kan bare endre høyden
- standardhøyde er 88 px
- minimumshøyde er 70 px
- maksimumshøyde er 100 px
- fontstørrelse er en validert verdi fra 12 til 96 px
- standard fontstørrelse er 24 px
- navn og undertittel deler fontfamilie og tekstfarge
- undertittelens størrelse avledes relativt fra Header-fontstørrelsen
- Header eksponerer ikke låsing eller låsestatus
- Header-låsehandlinger avvises ved reducergrensen

Baseelementet krever fortsatt `position` og `size`. For Header er `x`, `y` og serialisert bredde deterministiske kompatibilitetsverdier. De er ikke frie brukerredigerbare layoutverdier.

## Alignment preview

Korrigeringslinjer og snapping lagres ikke i `EditorProject`.

Transient alignment-state omfatter:

- snapmål for X og Y ved flytting
- størrelsesmål for lik bredde og høyde ved resize
- aktive guider, inkludert begge ytterkanter når størrelser matcher
- fryst lerretsbredde og -høyde
- fryste målekoordinater for aktiv pekerøkt
- layoutpreview før commit

Ved normalt pekerslipp committes bare ferdig `ElementLayout`. Ved cancel eller tapt pointer capture forkastes preview og guider.

## Farge og ramme

```ts
type EditorColor = string // kanonisk #RRGGBB

type ElementFrame = {
  width: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  color: EditorColor
}
```

- nye innrammede elementer starter med 1 px
- `0` betyr `Ingen`
- rammefargen beholdes når bredden settes til `0`
- rammen ligger innenfor elementets ytre størrelse
- `Farger` er avledet UI og lagres ikke som egen palett
- Seksjon, Tekst og Header viser bakgrunn og eventuell rammefarge
- Tekst viser Bakgrunn før Tekstfarge
- Header viser bakgrunn og tekstfarge
- fargekontroller viser redigerbar kanonisk HEX-kode
- pipette er transient UI og endrer bare den valgte fargeverdien; den lagres ikke som prosjektdata

## Asset-ID og ressurslager

Prosjektet lagrer stabil asset-ID og serialiserbar metadata. Følgende lagres ikke:

- `File`
- Blob
- Object URL
- lokal filsti

Det transiente ressurslageret eier faktisk fil og Object URL. Sletting fjerner ressursen bare når ingen Bilde- eller Header-elementer refererer til asset-ID-en.

Ved sletting av en hel side ryddes bilde- og logoressurser som ikke lenger refereres av andre sider, uten å legge `File`, Blob eller Object URL inn i prosjektstate.

## Reducergrenser

Reducerhandlinger krever:

- aktiv side
- eksisterende element på aktiv side
- riktig elementtype
- ulåst element ved mutasjon for elementtyper som støtter låsing
- Header-låsehandlinger avvises uavhengig av UI
- gyldig og kanonisk verdi
- gyldig layout og størrelsesintervall
- faktisk endring

Header-layoutcommit normaliserer alltid `x = 0, y = 0` og kanonisk serialisert bredde.

Ugyldige og uendrede handlinger returnerer samme state og endrer ikke `updatedAt`.

Sideadministrasjon avviser ugyldig navn, ugyldig eller duplisert slug, duplisert side-ID og sletting av prosjektets siste side. Ved sletting av aktiv side velges neste side på samme indeks når mulig, ellers forrige siste side, og elementmarkeringen tømmes.

Seksjons-ID kan bare endres eksplisitt på en eksisterende ulåst Seksjon og må være gyldig og unik på siden. Navigasjonspunkter validerer label og mål, og side-/seksjonssletting fjerner dangling navigasjonsreferanser deterministisk.

## Senere utvidelser

- prosjektimport validerer hele skjemaet før prosjektbytte
- versjon 8 migreres kontrollert til versjon 9, deretter 10, 11 og 12
- prosjektbytte avstemmer eller tømmer ressurslageret
- historikk lagrer bare serialiserbar prosjektstate
- mobiloverstyringer bruker viewport-spesifikke actions
- autolagring reagerer på gyldige prosjektmutasjoner, ikke transient state
