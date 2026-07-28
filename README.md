# Website-editor

Lokal webside-editor bygget med React, TypeScript og Vite.

Editoren åpner med et blankt, hvitt lerret. Brukeren kan opprette, markere, flytte, endre størrelse og låse grunnleggende elementer. Tekstbokser støtter kontrollert flerlinjet tekstredigering. Høyremenyens grunnstruktur er merget og neste fase bygger tekstutseende for markerte vanlige tekstbokser.

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
8de5f2e
```

Denne kom fra PR #9 og la inn høyremenyens grunnstruktur.

Viktige merges:

```text
PR #4  drag og resize
PR #5  objektlåsing                 a3eed45
PR #7  ren tekstredigering          c729d33
PR #8  navn og rekkefølge i meny    a35f59d
PR #9  høyremenyens grunnstruktur    8de5f2e
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
- kontrollert høyremeny for valgt elementtype og låsestatus
- Dependency Cruiser og samlet `npm run check`

## Fast ansvarsdeling

```text
Venstremeny = opprette og velge struktur
Høyremeny  = egenskaper for markert element
Lerretet   = redigere selve teksten
```

Venstremenyen skal ikke inneholde font, størrelse eller andre egenskaper for markert tekst.

`Elementer -> Tekst` oppretter en vanlig fri tekstboks. `Logo og header` skal senere eie strukturelle headerdeler som logo, hovedtekst, undertittel og header-oppsett.

## Implementert høyremeny

```text
Ingenting valgt -> ingen høyremeny
Element valgt   -> høyremeny åpnes
Tomt lerret     -> høyremeny lukkes
```

- bredde 320 px
- dokket fra 1680 px
- overlay under 1680 px uten å redusere lerretet
- ingen reservert plass når panelet er skjult
- egen vertikal scrolling
- 180 ms transform-animasjon
- ingen animasjon ved `prefers-reduced-motion`
- valgt elementtype og `Låst`/`Ulåst` vises
- eksisterende `useElementSelection` er autoritativ kilde
- panelinnhold rendres bare for et gyldig element
- ingen parallell elementstate eller direkte prosjektmutasjon

Se `docs/RIGHT_PROPERTIES_PANEL.md`.

## Gjeldende branch og fase

```text
feature/text-properties
```

Utgangspunkt:

```text
main: 8de5f2e
sporing: docs/TEXT_PROPERTIES.md og GitHub-sak #10
```

Fasen bygger for en markert vanlig tekstboks:

```text
Tekstutseende
Font
Størrelse
Fet
Kursiv
Justering
Linjehøyde
```

Låste valg:

- formateringen gjelder hele tekstboksen
- tekstinnhold redigeres fortsatt bare på lerretet
- åtte kontrollerte nettsikre fontvalg
- kontrollerte størrelser fra 12 til 96 px
- venstre, midtstilt og høyre justering
- kontrollerte linjehøyder fra 1.0 til 2.0
- standarden bevarer System, 16 px, venstre og 1.45
- låste tekstbokser kan inspiseres, men kontrollene er deaktivert
- tekstfarge utsettes til prosjektfargesystemet
- bredde, høyde og plassering bygges ikke i denne branchen
- headertekst, riktekst og mobile tekststiloverstyringer bygges ikke

Modellen skal oppgraderes til skjemaversjon 3 med obligatorisk `textStyle` bare for tekstelementer. Fonttokens lagres i prosjektet, mens CSS-fontstacker avledes i visningslaget.

Se `docs/TEXT_PROPERTIES.md`.

## State-grenser

Varig prosjektdata:

- elementgeometri
- låsestatus
- tekstinnhold
- tekststil etter fase 8
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

Tekstinnhold, låsestatus og tekststil er foreløpig felles elementdata.

## Filstørrelse og ansvar

- 250 linjer er aktiv terskel for ansvarstrekk.
- En fil deles tidligere når den får flere tydelige ansvar.
- 300 linjer er en eksplisitt unntaksgrense for kildefiler.
- Deling skjer etter ansvar, ikke tilfeldig linjetall.

## Dokumentasjon

Les i denne rekkefølgen:

1. `docs/NEXT_CHAT_PROMPT.md`
2. `docs/WORK_PLAN.md`
3. `docs/TEXT_PROPERTIES.md`
4. `docs/RIGHT_PROPERTIES_PANEL.md`
5. `docs/EDITOR_PLANNING.md`
6. `docs/PROJECT_RULES.md`
7. `docs/ELEMENT_MODEL.md`
8. `docs/TEXT_BOX_EDITING.md`
9. `docs/OBJECT_LOCKING.md`
10. `docs/DRAG_RESIZE.md`
11. `docs/ELEMENT_SELECTION.md`
12. `docs/ELEMENT_CREATION.md`
13. `docs/MOBILE_DESIGN_CONTROLS.md`
14. `docs/CODE_AUDIT.md`

## Ikke implementert ennå

- tekstegenskaper i høyremenyen
- tekstfarge og prosjektfargesystem
- sletting og duplisering
- ekte bildeimport
- knapphandling og lenker
- logo/header
- korrigeringslinjer
- egne mobiloverstyringer
- angre/gjør om
- lokal automatisk lagring
- åpning/import av prosjekt
- forhåndsvisning og publisering
