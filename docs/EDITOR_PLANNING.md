# Plan for Website-editoren

Dette dokumentet samler bekreftede produktkrav, implementert grunnlag og planlagte utvidelser.

## Gjeldende arbeidsstatus

```text
siste fullførte produksjonsfase: fase 12 – prosjektfarger og Seksjon-rammer
GitHub-sak: #28 – lukket som fullført
PR: #29 – merget
mergecommit på main: a781b85a718ed6e5254530849299db8dfff3dfb6
prosjektskjema: versjon 7
implementering og framtidsrettet sluttaudit: ferdig
PC og Telefon: godkjent
rammebredde: Ingen eller 1–10 px
automatiske kontroller: bestått
arkitekturrapporter: regenerert og committet i 1963088
lokal main: brukeren har bekreftet clean tree etter merge
aktiv docs-branch: docs/phase-12-handover
neste produksjonsfase: fase 13 – Logo og header, omfang ikke låst
```

Faktisk branch-, PR- og `main`-HEAD leses alltid fra Git.

## Siste verifiserte kontroll

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 102 moduler, 274 avhengigheter, ingen brudd
Vite: 111 moduler transformert
CSS: 33.62 kB, gzip 6.34 kB
JavaScript: 264.52 kB, gzip 79.47 kB
produksjonsbuild: bestått på 192 ms
git diff --check: ingen whitespace-feil
```

Nye produksjonsendringer krever ny komplett kontroll.

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
- prosjektfarger og Seksjon-rammer

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
Farger             viser konkrete fargeegenskaper på aktiv side
```

`Logo og header` er neste planlagte produksjonsområde, men produkt- og modellomfanget er ikke låst.

## Fast ansvarsdeling

```text
Venstremeny = opprette elementer, velge fil/design og gi prosjektoversikt
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere innhold og transformere elementer
Ressurslag = eie transient fil og renderings-URL
Prosjekt   = eie serialiserbar identitet, metadata og redigeringsverdier
```

## Autoritativ state

Varig prosjektdata:

- sider og elementer
- sideutseende og sidebakgrunn
- responsiv geometri og synlighet
- låsestatus
- Seksjon-bakgrunn og ramme
- tekstinnhold, tekststil og tekstfarge
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

Fargegruppene i `Farger` er avledet UI og lagres ikke som en egen palett.

## Prosjektmodell

Gjeldende skjemaversjon er 7.

```text
versjon 1  grunnmodell
versjon 2  tekstinnhold
versjon 3  tekststil
versjon 4  elementlenke
versjon 5  knappasset, knappetekst og knappelenke
versjon 6  bildeasset, metadata, alternativ tekst, visning og utsnitt
versjon 7  sidebakgrunn, Seksjon-utseende, Seksjon-ramme og tekstfarge
```

Telefon arver desktopgeometri når mobiloverstyring mangler. Farger, innhold, lenker, låsestatus og bildeutsnitt er foreløpig felles for PC og Telefon.

## Prosjektfarger

`Farger` viser:

- `Bakgrunn -> Sidebakgrunn`
- `Element N -> Bakgrunn`
- `Element N -> Ramme` når rammebredden er større enn `0`
- `Tekst N -> Tekstfarge`

Hver kontroll muterer bare én konkret egenskap. To elementer med samme farge er ikke koblet sammen.

Knapper beholder ferdig SVG-fargedesign og vises ikke i `Farger`. Bilder har ingen prosjektfarge.

## Seksjon-ramme

```text
Ingen = 0 px
1–10 px = synlig solid ramme
```

Rammefargen beholdes når rammen slås av. Høyremeny og `Farger` skriver til samme lagrede verdi. Rammen ligger innenfor elementets lagrede størrelse.

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

Standard- og minimumsstørrelser har én modellkilde. Crop-grunnrammen for skjemaversjon 6 er separat låst til 240 × 160 px.

## Bildeimport og utsnitt

Støttede filer:

```text
PNG
JPEG
WebP
maks 10 MB
maks 40 megapiksler
maks 16 384 px per side
```

`contain` viser hele motivet. `crop` fyller rammen, bruker zoom `1..3`, normalisert offset og åtte resizegrep. Crop-resize bevarer motivets størrelse og absolutte plassering.

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
- Seksjon viser egen `Ramme`-del

## Arkitektur- og filstørrelsesgrenser

- 250 linjer er aktiv terskel for ansvarstrekk
- 300 linjer er hard unntaksgrense
- linjetall kontrolleres før en stor fil utvides og igjen før PR
- filer deles etter reelt ansvar, ikke mekanisk
- alle nye og berørte produksjonsfiler i fase 12 var under 250 linjer
- `RightPropertiesPanel.tsx` forblir komposisjon
- fargeoversikten er avledet fra aktiv side
- reduceren er siste valideringsgrense
- DOM og CSS er ikke varig lagring
- ressurslager, modell, state, rendering og UI har separate ansvar

## Senere fasekrav

- prosjektimport validerer hele skjemaet før `replace-project`
- versjon 6 migreres eller avvises kontrollert ved framtidig import
- prosjektbytte avstemmer eller tømmer bilderessursbufferen
- historikk lagrer bare serialiserbar prosjektstate
- mobiloverstyringer bruker viewport-spesifikke actions
- responsive farger krever eksplisitt modellstøtte
- autolagring reagerer på gyldige prosjektmutasjoner, ikke transient state
- endret crop-grunnmodell krever ny skjemaversjon og migrering

## Planlagte senere faser

```text
fase 13  logo og header
fase 14  korrigeringslinjer
fase 15  responsive mobiloverstyringer
fase 16  angre og gjør om
fase 17  lokal automatisk lagring
fase 18  åpne og importere prosjekt
fase 19  forhåndsvisning og publisering
```

## Neste planleggingssteg

Før fase 13-kode skal følgende avklares sammen med brukeren:

- om header er en egen elementtype, en Seksjon med generert innhold eller en sammensatt prosjektstruktur
- feltene for navn, undertittel og logo
- logoens asset-ID, ressurslager og serialiserbare metadata
- forholdet til eksisterende Bilde-, Tekst- og Seksjon-modeller
- venstre- og høyremenyansvar
- standard- og minimumsstørrelser
- PC/Telefon-arv og responsive verdier
- farger og tekststil
- lagrekkefølge, låsing, sletting og tilgjengelighet
- om varige modellendringer krever skjemaversjon 8

Fase 13 starter først etter at post-merge-dokumentasjonen er merget, lokal `main` er oppdatert, omfanget er låst og en ny feature-branch er opprettet.