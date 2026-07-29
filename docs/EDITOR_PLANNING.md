# Plan for Website-editoren

Dette dokumentet samler bekreftede produktkrav, implementert grunnlag og planlagte utvidelser.

## Gjeldende arbeidsstatus

```text
aktiv leveranse: fase 11A – bildeimport, ramme og utsnitt
branch: feature/image-import-and-placement
GitHub-sak: #25
base main: 7e4c71f
prosjektskjema i leveransen: versjon 6
status: implementert, auditert, testet og klar for PR-kontroll
```

Faktisk branch- og `main`-HEAD skal alltid leses fra Git. Historiske commitnumre brukes bare som kontrollpunkter.

Siste verifiserte kontroll:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 89 moduler, 228 avhengigheter, ingen brudd
Vite: 98 moduler transformert
CSS: 31.07 kB, gzip 6.07 kB
JavaScript: 255.44 kB, gzip 77.18 kB
produksjonsbuild: bestått
PC og Telefon: godkjent
```

## Implementert editorgrunnlag

- blankt PC- og Telefon-lerret
- kontrollert topp- og venstremeny
- Seksjon, Bilde, Tekst og Knapp
- prosjektmodell, stabile ID-er og sentral state
- markering, flytting, resizing og låsing
- kontrollert flerlinjet tekstredigering
- høyremenyens grunnstruktur
- tekstegenskaper
- eksterne lenker for tekst og knapp
- sikker sletting
- bundlet SVG-knappbibliotek
- lokal bildeimport og transient ressursbuffer
- separat bilderamme og motivutsnitt
- alternativ tekst, zoom og bildefilmetadata
- kontrollert fallback for manglende knapp- og bilderessurs
- Dependency Cruiser og samlet `npm run check`

## Gjeldende venstremeny

```text
Prosjekt
Farger
Logo og header
Elementer
Innstillinger
```

`Elementer` inneholder Seksjon, Bilde, Tekst og Knapp.

```text
Elementer -> Knapp  åpner internt SVG-designbibliotek
Elementer -> Bilde  åpner nettleserens lokale filvelger
```

## Fast ansvarsdeling

```text
Venstremeny = opprette elementer og velge fil eller ferdig design
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere innhold og transformere elementer
Ressurslag = eie transient fil og renderings-URL
Prosjekt   = eie serialiserbar identitet, metadata og redigeringsverdier
```

For bilder:

```text
Venstremeny = velge og validere PNG, JPEG eller WebP
Høyremeny  = alt-tekst, visning, zoom, reset, metadata og sletting
Lerretet   = markere, flytte ramme, endre ramme og flytte motiv
```

## Autoritativ state

Varig prosjektdata:

- sider og elementer
- responsiv geometri og synlighet
- låsestatus
- tekstinnhold og tekststil
- lenke for tekstbokser og knapper
- knappens stabile `assetId` og `label`
- bildets stabile `assetId`
- bildets serialiserbare metadata
- bildets `altText`, `mode` og `transform`
- `updatedAt`

Transient editor- og ressursstate:

- `selectedElementId`
- pekerinteraksjon og layout-preview
- tekst-, knappetekst-, lenke- og alttekstdrafts
- filvelger og valideringsfeedback
- `File`, Object URL og ressurskart
- intern bibliotekvisning
- slettedialogens mål og fokusreferanse
- panel-, fokus-, hover- og trykkstate

DOM-en og Object URL-er er rendering, ikke permanent prosjektlagring. Gyldige prosjektendringer går gjennom reduceren.

## Prosjektmodell

Gjeldende skjemaversjon i leveransen er 6.

```text
versjon 1  grunnmodell
versjon 2  tekstinnhold
versjon 3  tekststil
versjon 4  elementlenke
versjon 5  knappasset, knappetekst og knappelenke
versjon 6  bildeasset, metadata, alternativ tekst, visning og utsnitt
```

```ts
type ImageEditorElement = BaseEditorElement & {
  kind: 'image'
  assetId: ImageAssetId
  assetMetadata: ImageAssetMetadata
  altText: string
  mode: 'contain' | 'crop'
  transform: {
    zoom: number
    offsetX: number
    offsetY: number
  }
}
```

Bildeelementet lagrer ikke lokal filsti, binærfil eller Object URL. PC og Telefon bruker foreløpig samme bildeinnhold, alt-tekst, visning og utsnitt. Telefon arver desktopgeometrien når mobiloverstyring mangler.

## Elementregler

Startstørrelser:

```text
Seksjon  320 × 180 px
Bilde    240 × 160 px
Tekst    240 × 96 px
Knapp    160 × 48 px
```

Minimumsstørrelser:

```text
Seksjon  160 × 90 px
Bilde    120 × 80 px
Tekst    120 × 48 px
Knapp    80 × 36 px
```

Standard- og minimumsstørrelser har én autoritativ kilde i modellen. Flytting og resizing bruker transient preview og én commit ved normalt slipp. Låste elementer kan markeres, men ikke transformeres, redigeres eller slettes.

## Bildevisning og utsnitt

### Hele bildet

- hele bildet vises proporsjonalt
- bildet sentreres i rammen
- tomrom er tillatt når sideforholdene er ulike
- lagret utsnitt beholdes for senere retur til crop-modus

### Juster utsnitt

- motivet fyller rammen uten tomrom
- originalt sideforhold bevares
- zoom er begrenset til 100–300 prosent og minst nødvendig fyllingszoom
- offset er normalisert og begrenset
- bilderammen kan ikke bli større enn motivet ved aktiv zoom
- overgang fra en stor contain-ramme gir automatisk gyldig crop-ramme
- reset sentrerer motivet og bruker minimum gyldig zoom

Interaksjon:

```text
vanlig dra      flytter motivet
Shift + dra     flytter hele rammen
Alt + piltast   flytter motivet med tastaturet
piltast         flytter elementet
Ctrl/Cmd + pil  endrer størrelse fra nedre høyre hjørne
```

Bilderammen har åtte pekergrep for alle kanter og hjørner.

## Høyremeny

```text
Ingenting valgt -> ingen høyremeny
Element valgt   -> høyremeny åpnes
Tomt lerret     -> høyremeny lukkes
```

- bredde 320 px
- dokket fra 1680 px
- overlay under 1680 px
- egen vertikal scrolling
- 180 ms transform-animasjon
- `prefers-reduced-motion` respekteres
- selection-state er autoritativ
- ingen separat elementkopi eller direkte prosjektmutasjon

Betinget innhold:

```text
Tekst   -> tekstutseende + lenke + elementhandlinger
Knapp   -> knappetekst + design + lenke + elementhandlinger
Bilde   -> alternativ tekst + visning + zoom + metadata + elementhandlinger
Seksjon -> elementstatus + sletting
```

## Arkitekturgrenser etter fase-11A-audit

- `EditorCanvasElement.tsx` er redusert til 189 linjer.
- Tastaturtransform ligger i en egen canvasmodul.
- Bilderendering og motivdrag ligger i egne avgrensede moduler.
- Opprettingsvalidering deles av hook og reducer.
- Crop-invarianter håndheves i modell og reducer, ikke bare i UI.
- Ressurslageret eier Object URL-oppretting og opprydding.
- Alle berørte kildefiler er under 250 linjer.

## Planlagte senere faser

Ingen ny fase startes før fase 11A er kontrollert i PR og eksplisitt godkjent for merge.

```text
fase 12  prosjektfarger
fase 13  logo og header
fase 14  korrigeringslinjer
fase 15  responsive mobiloverstyringer
fase 16  angre og gjør om
fase 17  lokal automatisk lagring
fase 18  åpne og importere prosjekt
fase 19  forhåndsvisning og publisering
```
