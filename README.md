# Website-editor

Lokal webside-editor bygget med React, TypeScript og Vite.

Editoren åpner med et blankt, hvitt lerret. Brukeren kan opprette, markere, flytte, endre størrelse og låse grunnleggende elementtyper. Innholdsredigering, ekte bilder, sletting, historikk og lagring bygges i senere, avgrensede branches.

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
  → desktop-, mobil-, peker- og tastaturtest
  → dokumentasjon
  → kontrollert PR og merge
```

Etter hver repoendring skal brukeren få nøyaktige PowerShell-kommandoer.

## Ferdig og merget til `main`

- stabilt React/TypeScript/Vite-grunnlag
- blankt desktop- og mobillerret
- toppmeny og venstremeny
- kontrollert paneloppførsel
- Elementer-panel med Seksjon, Bilde, Tekst og Knapp
- prosjekt- og elementmodell med stabile ID-er og responsive verdier
- sentral prosjekt-state og aktiv side
- transient elementmarkering
- oppretting av alle fire elementtyper
- kontrollerte startstørrelser og startplassering
- flytting og størrelsesendring med peker og tastatur
- clamping, minimumsmål, edge-scroll og automatisk lerretsvekst
- Dependency Cruiser og samlet `npm run check`

## Gjeldende branch

```text
feature/object-locking
```

Implementert og visuelt godkjent før siste auditendring:

- egen objektverktøylinje over valgt element
- åpen hengelås for **Lås**
- lukket hengelås for **Lås opp**
- varig `locked`-mutasjon gjennom reduceren
- låst element beholder markeringen
- stiplet markeringsramme for låst element
- resize-håndtaket skjules når elementet er låst
- peker- og tastaturtransform blokkeres når låst
- låseknappen er tastaturtilgjengelig og starter ikke flytting
- låsestatus er felles for PC og Telefon

Siste kodeaudit har i tillegg sikret at piltaster på et låst, fokusert element ikke utløser utilsiktet scrolling.

Se `docs/OBJECT_LOCKING.md`.

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

`EditorProject` er autoritativ kilde for varige sider og elementegenskaper.

Varig prosjektdata:

- elementgeometri
- låsestatus
- prosjektets `updatedAt`

Transient state skal ikke lagres, eksporteres, publiseres eller inngå direkte i historikk/autolagring:

- `selectedElementId`
- aktiv pekerinteraksjon
- layout-preview under draing eller resizing
- synlighet, fokus og hover for objektverktøylinjen

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
9. `docs/OBJECT_LOCKING.md`
10. `docs/RESPONSIVE_DESIGN.md`
11. `docs/MOBILE_DESIGN_CONTROLS.md`
12. `docs/CODE_AUDIT.md`

## Ikke implementert ennå

- sletting
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
