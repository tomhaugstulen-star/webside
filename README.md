# Website-editor

Lokal webside-editor bygget med React, TypeScript og Vite.

Editoren åpner med et blankt, hvitt lerret. Brukeren kan opprette, markere, flytte, endre størrelse og låse grunnleggende elementer. Tekstbokser støtter kontrollert redigering av ren flerlinjet tekst.

## Repo og lokal mappe

```text
https://github.com/tomhaugstulen-star/webside.git
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
  -> egen avgrenset branch
  -> godkjent omfang og design
  -> implementering
  -> kodeaudit
  -> npm run check
  -> arkitekturrapporter
  -> PC-, Telefon-, peker- og tastaturtest
  -> dokumentasjon
  -> kontrollert PR
  -> eksplisitt mergegodkjenning
```

## Gjeldende `main`

Siste bekreftede merge-commit:

```text
a35f59d
```

Denne kom fra PR #8 og låste navn og rekkefølge i venstremenyen.

Endelig venstremeny:

```text
Prosjekt
Farger
Logo og header
Elementer
Innstillinger
```

`Prosjekt` står øverst. `Innstillinger` står nederst.

## Ferdig og merget til `main`

- stabilt React/TypeScript/Vite-grunnlag
- blankt PC- og Telefon-lerret
- toppmeny og kontrollert venstremeny
- Elementer-panel med Seksjon, Bilde, Tekst og Knapp
- prosjekt- og elementmodell med stabile ID-er og responsive verdier
- sentral prosjekt-state og aktiv side
- transient elementmarkering
- oppretting av alle fire elementtyper
- kontrollerte startstørrelser og startplassering
- flytting og størrelsesendring med peker og tastatur
- clamping, minimumsmål, edge-scroll og automatisk lerretsvekst
- objektlåsing med tilgjengelig lås/lås opp
- kontrollert flerlinjet tekstredigering
- Dependency Cruiser og samlet `npm run check`

Viktige merges:

```text
PR #4  drag og resize
PR #5  objektlåsing                 a3eed45
PR #7  ren tekstredigering          c729d33
PR #8  navn og rekkefølge i meny    a35f59d
```

## Gjeldende branch og fase

```text
feature/right-properties-panel
```

Branchen er fast-forwardet fra oppdatert `main` etter PR #8. Dokumentasjonen er oppdatert før implementering. Det er foreløpig ikke lagt inn produksjonskode for høyremenyen.

Fasen bygger bare høyremenyens grunnstruktur.

Låst oppførsel:

```text
Ingenting valgt -> ingen høyremeny
Element valgt   -> høyremeny åpnes
Tomt lerret     -> høyremeny lukkes
```

I tillegg:

- skjult panel reserverer ikke en tom høyrekolonne
- låst element kan fortsatt inspiseres
- panelet kan være åpent mens en tekstboks redigeres
- klikk i panelet bruker eksisterende blur/commit
- markeringen beholdes etter normal tekstcommit
- panelet oppretter ikke separat tekstdraft

En permanent synlig tom høyremeny er avvist.

Før kode må følgende fortsatt godkjennes:

- panelbredde
- oppførsel i smale nettleservinduer
- egen scrolling
- visuell overskrift og seksjonsstruktur
- minimum av faktisk inspeksjonsinformasjon
- eventuell åpne-/lukkeanimasjon

Se `docs/RIGHT_PROPERTIES_PANEL.md` og GitHub-sak #6.

Denne branchen skal ikke bygge:

- font-, tekststørrelse- eller riktekstkontroller
- fargevelgere eller prosjektfargeregister
- bildeinnstillinger
- knapphandlinger
- logo- eller headerbygger
- sletting eller duplisering
- historikk eller lagring
- prosjektimport
- mobiloverstyringer

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
- aktive verktøy og paneler
- fokus, hover og lokal UI-feedback

Transient state skal ikke serialiseres, eksporteres, publiseres eller inngå direkte i historikk eller autolagring.

## Filstørrelse og ansvar

- 250 linjer er aktiv terskel for ansvarstrekk.
- En fil deles tidligere når den får flere tydelige ansvar.
- 300 linjer er en eksplisitt unntaksgrense for kildefiler.
- Deling skjer etter ansvar, ikke tilfeldig linjetall.

## Dokumentasjon

Les i denne rekkefølgen ved ny chat eller overlevering:

1. `docs/NEXT_CHAT_PROMPT.md`
2. `docs/WORK_PLAN.md`
3. `docs/RIGHT_PROPERTIES_PANEL.md`
4. `docs/EDITOR_PLANNING.md`
5. `docs/PROJECT_RULES.md`
6. `docs/ELEMENT_MODEL.md`
7. `docs/ELEMENT_SELECTION.md`
8. `docs/ELEMENT_CREATION.md`
9. `docs/DRAG_RESIZE.md`
10. `docs/OBJECT_LOCKING.md`
11. `docs/TEXT_BOX_EDITING.md`
12. `docs/RESPONSIVE_DESIGN.md`
13. `docs/MOBILE_DESIGN_CONTROLS.md`
14. `docs/CODE_AUDIT.md`

## Ikke implementert ennå

- høyremeny/egenskapspanel
- font- og riktekstkontroller
- sletting
- ekte bildeimport
- knapphandling og lenker
- prosjektfargesystem
- logo/header
- korrigeringslinjer
- egne mobiloverstyringer
- angre/gjør om
- lokal automatisk lagring
- åpning/import av prosjekt
- forhåndsvisning og publisering
