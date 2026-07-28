# Website-editor

Lokal webside-editor bygget med React, TypeScript og Vite.

Editoren åpner med et blankt, hvitt lerret. Brukeren kan opprette, markere, flytte og endre størrelse på grunnleggende elementtyper. Innholdsredigering, bilder, låsegrensesnitt, historikk og lagring bygges i senere, avgrensede branches.

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

`npm run dev` bruker `vite --open` og åpner editoren automatisk i standardnettleseren.

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
  → desktop- og mobiltest
  → dokumentasjon
  → kontrollert PR og merge
```

Etter hver repoendring skal brukeren få nøyaktige PowerShell-kommandoer.

## Ferdig og merget til `main`

- stabilt editorgrunnlag
- blankt desktop- og mobillerret
- toppmeny og venstremeny
- kontrollert paneloppførsel
- Elementer-panel med Seksjon, Bilde, Tekst og Knapp
- Dependency Cruiser og samlet `npm run check`
- automatisk nettleseråpning
- prosjekt- og elementmodell
- skjemaversjon, sikre ID-er, sider og responsive verdier
- sentral prosjekt-state og aktiv side
- markering av eksisterende elementer
- transient `selectedElementId`
- oppretting av alle fire elementtyper
- kontrollerte standardstørrelser og startplassering
- automatisk markering av nytt element
- automatisk utvidelse av lerretshøyden

## Gjeldende branch

```text
feature/drag-resize
```

Implementert og visuelt godkjent:

- flytting med peker
- ett resize-håndtak nederst til høyre
- størrelsesendring med minimumsmål
- clamping mot venstre, høyre og øvre lerretskant
- fri flytting nedover med automatisk lerretsvekst
- edge-scroll under interaksjon
- fri overlapping uten automatisk kollisjonssystem
- transient preview under pekerbevegelse
- én prosjekt-commit ved normalt pekerslipp
- desktop og mobil fungerer med delt desktopgeometri

Siste kodeaudit har i tillegg sikret:

- låste elementer kan markeres, men ikke transformeres
- `pointercancel` og tapt pointer capture rydder preview uten commit
- minimumsmål kan ikke muteres gjennom en delt objektreferanse
- preview-typen har én autoritativ definisjon
- resize-håndtaket har 32 × 32 px treffflate
- piltaster flytter elementer
- `Ctrl`/`Cmd` + piltaster endrer størrelse
- `Shift` bruker 10 px steg
- preview-state nullstilles uten synkron `setState` i effect

## Planlagt responsiv redigering

Dagens PC- og Telefon-visning deler desktopgeometrien. Dette er en midlertidig, kontrollert regel.

Egen responsiv redigering spores i:

```text
docs/MOBILE_DESIGN_CONTROLS.md
GitHub-sak #3
feature/mobile-design-controls
```

Planen er desktop-arv med eksplisitte mobiloverstyringer for posisjon, størrelse og synlighet. En mobilendring skal senere ikke overskrive desktop-oppsettet.

## Viktige state-grenser

`EditorProject` er autoritativ kilde for varige sider, elementer og geometri.

Transient state skal ikke lagres, eksporteres, publiseres eller inngå direkte i historikk/autolagring:

- `selectedElementId`
- aktiv pekerinteraksjon
- layout-preview under draing eller resizing

En ferdig pekertransform committes én gang til prosjektet ved normalt pekerslipp.

## Filstørrelse og ansvar

- 250 linjer er aktiv terskel for å trekke ut ansvar.
- En fil deles tidligere dersom den får flere tydelige ansvarsområder.
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
9. `docs/RESPONSIVE_DESIGN.md`
10. `docs/MOBILE_DESIGN_CONTROLS.md`
11. `docs/CODE_AUDIT.md`

## Ikke implementert ennå

- sletting
- låse- og opplåsingsgrensesnitt
- direkte tekstredigering
- bildeimport
- knapphandling og lenker
- fargesystem
- logo/header
- korrigeringslinjer
- egne mobiloverstyringer
- angre/gjør om
- automatisk lokal prosjektlagring
- åpning/import av prosjekt
- forhåndsvisning og publisering
