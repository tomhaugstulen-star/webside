# Website-editor

Lokal webside-editor bygget med React, TypeScript og Vite.

Editoren åpner med et blankt, hvitt lerret. Brukeren kan opprette, markere, flytte, endre størrelse og låse grunnleggende elementer. Tekstbokser støtter nå kontrollert redigering av ren flerlinjet tekst.

## Lokal mappe

```text
C:\Users\tomha\Desktop\website
```

## Starte prosjektet

```powershell
cd C:\Users\tomha\Desktop\website
npm install
npm run dev
```

`npm run dev` bruker `vite --open` og åpner editoren automatisk.

## Kvalitetskontroll

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
```

`npm run check` kjører ESLint, TypeScript-kontroll, Dependency Cruiser og produksjonsbuild.

Arkitekturrapportene skrives til:

```text
architecture.json
docs/dependency-graph.mmd
```

## Branch-regel

Det utvikles aldri direkte på `main`.

```text
main
  → egen avgrenset branch
  → implementering
  → kodeaudit
  → npm run check
  → arkitekturrapporter
  → PC-, Telefon-, peker- og tastaturtest
  → dokumentasjon
  → kontrollert PR og merge
```

## Ferdig og merget til `main`

- stabilt React/TypeScript/Vite-grunnlag
- blankt PC- og Telefon-lerret
- toppmeny og venstremeny
- Elementer-panel med Seksjon, Bilde, Tekst og Knapp
- prosjekt- og elementmodell med stabile ID-er og responsive verdier
- sentral prosjekt-state og aktiv side
- transient elementmarkering
- oppretting av alle fire elementtyper
- kontrollerte startstørrelser og startplassering
- flytting og størrelsesendring med peker og tastatur
- clamping, minimumsmål, edge-scroll og automatisk lerretsvekst
- objektlåsing med tilgjengelig lås/lås opp
- Dependency Cruiser og samlet `npm run check`

PR #5 merget objektlåsing til `main` med merge-commit:

```text
a3eed45
```

## Gjeldende branch

```text
feature/text-box-editing
```

Implementert, kodeauditert og visuelt godkjent:

- prosjektskjema versjon 2
- diskriminert elementunion
- obligatorisk `content` bare for tekstobjekter
- tomt standardinnhold i nye tekstbokser
- ett klikk markerer
- dobbeltklikk eller `Enter` på markert tekstboks starter redigering
- kontrollert flerlinjet `textarea`
- vanlig `Enter` lager ny linje
- blur og `Ctrl`/`Cmd` + `Enter` committer
- `Escape` forkaster aktiv draft
- tom tekst er gyldig
- låst tekstboks kan ikke redigeres
- flytting, resizing og objektverktøy er deaktivert under redigering
- tekstcommit valideres av reduceren
- uendret eller ugyldig tekst oppdaterer ikke state eller `updatedAt`
- PC og Telefon viser samme tekstinnhold

Se `docs/TEXT_BOX_EDITING.md`.

Arkitekturrapportene må regenereres før PR fordi branchen har nye kildekodemoduler.

## Neste fase etter merge

```text
feature/right-properties-panel
```

Denne fasen skal bygge høyremenyens grunnstruktur:

- følger `selectedElementId`
- viser valgt elementtype
- tom/skjult tilstand når ingenting er valgt
- stabil layout for senere egenskaper
- ingen font-, farge-, bilde- eller knappfunksjoner ennå

Fontfamilie, fontstørrelse, tekstfarge, fet, kursiv og eventuell markert tekstformatering bygges senere i en egen branch.

## Responsiv redigering

PC og Telefon deler foreløpig desktopgeometrien. Dette er en kontrollert midlertidig regel.

Egne mobiloverstyringer spores i:

```text
docs/MOBILE_DESIGN_CONTROLS.md
GitHub-sak #3
feature/mobile-design-controls
```

Tekstinnhold og låsestatus er felles elementdata og er ikke responsive verdier.

## State-grenser

Varig prosjektdata:

- elementgeometri
- låsestatus
- tekstinnhold
- prosjektets `updatedAt`

Transient editor-state:

- `selectedElementId`
- aktiv pekerinteraksjon
- layout-preview
- aktiv tekstredigeringsøkt og lokal draft
- fokus, hover og synlighet for objektverktøy

Transient state skal ikke serialiseres, eksporteres, publiseres eller inngå direkte i historikk/autolagring.

## Filstørrelse og ansvar

- 250 linjer er aktiv terskel for ansvarstrekk.
- En fil deles tidligere når den får flere tydelige ansvar.
- 300 linjer er en eksplisitt unntaksgrense.
- Deling skjer etter ansvar, ikke tilfeldig linjetall.

## Dokumentasjon

Les i denne rekkefølgen ved ny chat eller overlevering:

1. `docs/NEXT_CHAT_PROMPT.md`
2. `docs/WORK_PLAN.md`
3. `docs/EDITOR_PLANNING.md`
4. `docs/PROJECT_RULES.md`
5. `docs/ELEMENT_MODEL.md`
6. `docs/ELEMENT_SELECTION.md`
7. `docs/ELEMENT_CREATION.md`
8. `docs/DRAG_RESIZE.md`
9. `docs/OBJECT_LOCKING.md`
10. `docs/TEXT_BOX_EDITING.md`
11. `docs/RESPONSIVE_DESIGN.md`
12. `docs/MOBILE_DESIGN_CONTROLS.md`
13. `docs/CODE_AUDIT.md`

## Ikke implementert ennå

- høyremeny/egenskapspanel
- font- og riktekstkontroller
- sletting
- bildeimport
- knapphandling og lenker
- fargesystem
- logo/header
- korrigeringslinjer
- egne mobiloverstyringer
- angre/gjør om
- lokal automatisk lagring
- åpning/import av prosjekt
- forhåndsvisning og publisering
