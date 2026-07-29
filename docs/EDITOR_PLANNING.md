# Plan for Website-editoren

Dette dokumentet samler bekreftede produktkrav, implementert grunnlag og planlagte utvidelser.

## Gjeldende arbeidsstatus

```text
aktiv leveranse: fase 11A – bildeimport, ramme og utsnitt
branch: feature/image-import-and-placement
GitHub-sak: #25
PR: #26 – åpen, ikke draft
base main: 7e4c71f
prosjektskjema: versjon 6
implementering: ferdig
framtidsrettet sluttaudit: ferdig
automatiske kontroller: bestått
PC og Telefon: godkjent
arkitekturrapporter etter sluttaudit: må regenereres
merge: ikke godkjent eller utført
```

Faktisk branch- og `main`-HEAD leses alltid fra Git.

## Siste verifiserte kontroll

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 91 moduler, 237 avhengigheter, ingen brudd
Vite: 100 moduler transformert
CSS: 30.95 kB, gzip 6.04 kB
JavaScript: 258.38 kB, gzip 78.09 kB
produksjonsbuild: bestått på 185 ms
```

## Implementert editorgrunnlag

- blankt PC- og Telefon-lerret
- toppmeny, venstremeny og høyremeny
- Seksjon, Bilde, Tekst og Knapp
- prosjektmodell med stabile ID-er og sentral state
- markering, flytting, resizing og låsing
- kontrollert flerlinjet tekstredigering
- tekstegenskaper og eksterne lenker
- sikker sletting
- bundlet SVG-knappbibliotek
- lokal bildeimport og transient ressursbuffer
- separat bilderamme og motivutsnitt
- alternativ tekst, zoom og filmetadata
- kontrollert fallback for manglende ressurs

## Gjeldende venstremeny

```text
Prosjekt
Farger
Logo og header
Elementer
Innstillinger
```

```text
Elementer -> Knapp  åpner internt SVG-designbibliotek
Elementer -> Bilde  åpner lokal filvelger
```

## Fast ansvarsdeling

```text
Venstremeny = opprette elementer og velge fil eller design
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere innhold og transformere elementer
Ressurslag = eie transient fil og renderings-URL
Prosjekt   = eie serialiserbar identitet, metadata og redigeringsverdier
```

## Autoritativ state

Varig prosjektdata:

- sider og elementer
- responsiv geometri og synlighet
- låsestatus
- tekstinnhold og tekststil
- elementlenke
- knappens stabile asset-ID og label
- bildets stabile asset-ID og metadata
- bildets alt-tekst, modus og transform
- tidsstempler

Transient state:

- markering og panelstate
- pekerøkter og preview
- tekst- og egenskapsdrafts
- filvelger og valideringsfeedback
- `File`, Object URL og ressurskart
- dialoger, fokus og hover

## Prosjektmodell

Gjeldende skjemaversjon er 6.

```text
versjon 1  grunnmodell
versjon 2  tekstinnhold
versjon 3  tekststil
versjon 4  elementlenke
versjon 5  knappasset, knappetekst og knappelenke
versjon 6  bildeasset, metadata, alternativ tekst, visning og utsnitt
```

Telefon arver desktopgeometri når mobiloverstyring mangler. Bildeinnhold, alt-tekst, modus og transform er foreløpig felles for PC og Telefon.

## Elementstørrelser

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

Standard- og minimumsstørrelser har én modellkilde. Crop-grunnrammen for skjemaversjon 6 er separat låst til 240 × 160 px, slik at senere endring av standardstørrelsen ikke endrer eksisterende utsnitt.

## Bildeimport

Støttede filer:

```text
PNG
JPEG
WebP
maks 10 MB
maks 40 megapiksler
maks 16 384 px per side
```

Importen validerer filtype, filstørrelse, navn, dekoding og dimensjoner. Den avbrytes uten prosjekt- eller ressursmutasjon dersom Elementer-panelet demonteres under lesing.

## Bildevisning og utsnitt

### Hele bildet

- viser hele motivet proporsjonalt
- sentrerer motivet i rammen
- tillater tomrom ved ulikt sideforhold
- beholder lagret crop-transform

### Juster utsnitt

- fyller rammen uten tomrom
- bevarer sideforhold
- zoom 100–300 prosent
- normalisert offset fra -1 til 1
- åtte resizegrep på innsiden
- rammeresize bevarer motivets størrelse og absolutte plassering
- aktiv kant flyttes; motsatt kant står fast
- ramme og transform lagres atomisk

```text
vanlig dra      flytter motivet
Shift + dra     flytter hele rammen
Alt + piltast   flytter motivet
piltast         flytter elementet
Ctrl/Cmd + pil  endrer størrelse fra nedre høyre hjørne
```

## Høyremeny

```text
Ingenting valgt -> ingen høyremeny
Element valgt   -> høyremeny åpnes
Tomt lerret     -> høyremeny lukkes
```

- 320 px bredde
- dokket fra 1680 px
- overlay under 1680 px
- egen vertikal scrolling
- 180 ms animasjon
- redusert bevegelse respekteres
- selection-state er autoritativ

## Arkitekturgrenser

- alle berørte kildefiler er under 250 linjer
- `EditorCanvasElement.tsx` er under 200 linjer
- `useElementPointerTransform.ts` er 218 linjer
- `imagePresentation.ts` er 236 innholdslinjer
- ressurslager, modell, state, rendering og UI har separate ansvar
- CSS for bilder eies av dedikert bildestilark og er ikke avhengig av motstridende regler i `canvas.css`

## Senere fasekrav

- prosjektimport validerer hele skjemaet før `replace-project`
- prosjektbytte avstemmer eller tømmer bilderessursbufferen
- historikk lagrer bare serialiserbar prosjektstate
- mobiloverstyringer bruker viewport-spesifikke actions
- autolagring reagerer på gyldige prosjektmutasjoner, ikke transient state
- endret crop-grunnmodell krever ny skjemaversjon og migrering

## Planlagte senere faser

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

Ingen ny fase startes før PR #26 er kontrollert og eksplisitt godkjent for merge.
