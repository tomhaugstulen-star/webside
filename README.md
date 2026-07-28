# Website-editor

Lokal webside-editor bygget med React, TypeScript og Vite.

Editoren åpner med et blankt, hvitt lerret. Brukeren kan opprette, markere, flytte, endre størrelse og låse grunnleggende elementer. Tekstbokser støtter kontrollert redigering av ren flerlinjet tekst. Den gjeldende branchen legger til en kontrollert høyremeny for inspeksjon av valgt element.

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
  -> avgrenset feature-branch
  -> godkjent omfang og design
  -> implementering
  -> framtidsrettet kodeaudit
  -> npm run check
  -> arkitekturrapporter
  -> PC-, Telefon-, peker- og tastaturkontroll
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

```text
Prosjekt
Farger
Logo og header
Elementer
Innstillinger
```

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

## Gjeldende branch

```text
feature/right-properties-panel
```

Utgangspunkt og siste kontrollerte kode-/rapportcommit:

```text
base main: a35f59d
kode og arkitekturrapporter: 2d25a542
```

Branchen er implementert, auditert og visuelt godkjent. Dokumentasjonen ferdigstilles før PR.

### Implementert høyremeny

```text
Ingenting valgt -> ingen høyremeny
Element valgt   -> høyremeny åpnes
Tomt lerret     -> høyremeny lukkes
```

Beslutninger:

- bredde 320 px
- dokket på høyre side fra 1680 px
- overlay under 1680 px uten å redusere lerretet
- ingen reservert plass når panelet er skjult
- egen vertikal scrolling
- 180 ms transform-animasjon
- ingen animasjon ved `prefers-reduced-motion`

Visningen er:

```text
Egenskaper
Tekst

Element
Status: Ulåst
```

Elementtype og låsestatus leses fra sentral editor-state. Panelet bruker eksisterende `useElementSelection`, oppretter ingen parallell state og muterer ingen prosjektdata.

Panelinnholdet rendres bare når et gyldig element er valgt. En sentral layoutvariabel formidler reservert bredde til lerretet slik at panel-CSS ikke styrer canvas-klasser direkte.

Bekreftet etter siste produksjonskodeendring:

```text
npm run check: bestått
Dependency Cruiser: 38 moduler, 80 avhengigheter, 0 brudd
arkitekturrapporter: oppdatert
visuell PC-kontroll: godkjent
working tree: clean
```

Se `docs/RIGHT_PROPERTIES_PANEL.md`.

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

## Responsiv redigering

PC og Telefon deler foreløpig desktopgeometrien. Egne mobiloverstyringer bygges senere i `feature/mobile-design-controls`.

Tekstinnhold og låsestatus er felles elementdata og er ikke responsive verdier.

## Filstørrelse og ansvar

- 250 linjer er aktiv terskel for ansvarstrekk.
- En fil deles tidligere når den får flere tydelige ansvar.
- 300 linjer er en eksplisitt unntaksgrense for kildefiler.
- Deling skjer etter ansvar, ikke tilfeldig linjetall.

## Dokumentasjon

Les i denne rekkefølgen:

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

- faktiske egenskapskontroller i høyremenyen
- font- og riktekstkontroller
- sletting og duplisering
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