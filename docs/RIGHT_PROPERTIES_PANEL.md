# Høyremenyens grunnstruktur

Dette dokumentet er autoritativ spesifikasjon og historisk verifikasjonslogg for fase 7.

## Branch og utgangspunkt

```text
branch: feature/right-properties-panel
base main: a35f59d
produksjonskode og arkitekturrapporter: 2d25a542
PR: #9 – merget
mergecommit: 8de5f2e
```

PR #7 leverte kontrollert tekstredigering. PR #8 låste navn og rekkefølge i venstremenyen. Denne fasen bygde deretter høyremenyens grunnstruktur.

## Status

Høyremenyens grunnstruktur er implementert, kodeauditert, visuelt kontrollert og merget til `main` gjennom PR #9.

Tidligere formuleringer om at PR ikke var opprettet eller at dokumentasjonskontroll gjenstod beskrev branchens historiske tilstand før PR #9. De er ikke gjeldende prosjektstatus.

Panelet er senere utvidet i egne faser med tekstegenskaper, elementlenke og sikker sletting.

## Låst produktoppførsel

```text
Ingenting valgt -> ingen høyremeny
Element valgt   -> høyremeny åpnes
Tomt lerret     -> høyremeny lukkes
```

Detaljer:

- panelet er 320 px bredt
- ved vindusbredde på minst 1680 px er panelet dokket på høyre side
- under 1680 px er panelet overlay fra høyre
- overlay ligger oppå editorområdet og reduserer ikke lerretsbredden
- skjult panel reserverer ingen plass
- markering av et annet element oppdaterer samme panel umiddelbart
- låst element kan markeres og inspiseres
- panelet kan være åpent under tekstredigering
- klikk i panelet bruker eksisterende blur/commit
- markeringen beholdes etter normal tekstcommit
- panelet oppretter ikke eller eier en separat tekstdraft
- panelet har egen vertikal scrolling
- åpning og lukking bruker 180 ms transform-animasjon
- animasjonen deaktiveres ved `prefers-reduced-motion`

## Historisk grunnleveranse

Den første panelleveransen viste bare faktisk inspeksjonsinformasjon:

```text
Egenskaper
Knapp

Element
Status: Ulåst
```

Elementtypen endres mellom:

```text
Seksjon
Bilde
Tekst
Knapp
```

Status er enten `Låst` eller `Ulåst`.

Grunnleveransen hadde ingen tomme seksjoner, falske kontroller eller deaktiverte plassholdere.

## Implementert arkitektur

Ansvarsdeling:

```text
src/components/properties/RightPropertiesPanel.tsx
  - presenterer egenskaper og handlinger for valgt element
  - mottar elementet som prop
  - muterer ingen prosjektdata direkte

src/state/useElementSelection.ts
  - autoritativ avledning av selectedElementId og selectedElement

src/components/editor/EditorShell.tsx
  - komponerer venstremeny, lerret og høyremeny
  - leser selectedElement gjennom eksisterende hook
  - eier ingen egenskapslogikk

src/styles/right-properties-panel.css
  - paneloverflate, scrolling, breakpoint og transform-animasjon

src/styles/editor-base.css
  - --properties-panel-width: 320px
  - --properties-panel-reserved-width: 0px
```

Panelet:

- søker ikke etter valgt element i DOM-en
- lagrer ikke en separat kopi av elementdata
- muterer ikke prosjektdata direkte
- serialiseres ikke
- inngår ikke direkte i historikk eller autolagring

Varige egenskapsendringer fra senere utvidelser går gjennom typed state-API og reducer-actions.

## Betinget innhold og animasjon

Paneloverflaten er montert for å kunne animere ut. Selve innholdet rendres bare når et gyldig element er valgt.

Dette hindrer at framtidige inputfelt og knapper blir liggende skjult i DOM-en etter at markeringen fjernes. `aria-labelledby` brukes bare når panelet er åpent.

## Tekstredigering

Eksisterende tekstredigering bruker kontrollert `textarea` og lokal transient draft.

Når brukeren klikker i høyremenyen under redigering:

1. tekstfeltet mister fokus
2. eksisterende blur-mekanisme committer draften
3. tekstøkten avsluttes
4. elementmarkeringen beholdes
5. panelet fortsetter å lese elementet fra sentral state

Høyremenyen omgår eller dupliserer ikke commitgrensen.

## Låste elementer

Et låst element kan fortsatt være valgt og vises i panelet. Egenskapskontroller og handlinger som muterer elementet skal være deaktivert, og reducerens låsegrenser er autoritative.

## Ikke del av den historiske grunnbranchen

Følgende ble ikke implementert i selve `feature/right-properties-panel`:

- tekstegenskaper
- tekst- eller elementlenker
- bildevelger eller bildeegenskaper
- knappbibliotek
- fargevelgere eller prosjektfargeregister
- logo- eller headerbygger
- sletting eller duplisering
- lagpanel
- historikk eller lagring
- nytt prosjekt eller prosjektimport
- mobile geometri-overstyringer

Tekstegenskaper, elementlenke og sikker sletting ble senere implementert og merget i separate faser. De øvrige punktene er fortsatt planlagt eller åpne.

## Kodeaudit

Den framtidsrettede auditen kontrollerte:

- stale markering og stale elementdata
- duplisert state og parallelle selectors
- direkte DOM-søk og prosjektmutasjon
- tekstens blur/commit
- låste elementer
- sideskifte og ugyldig markering
- overlay kontra dokket layout
- CSS-eierskap og importrekkefølge
- skjult innhold og framtidige fokuserbare kontroller
- `prefers-reduced-motion`
- filstørrelser og ansvarsgrenser

To funn ble rettet før sluttkontrollen:

1. Panelinnholdet rendres bare når et element finnes.
2. Høyremenyens CSS styrer ikke `.canvas-page--desktop` direkte; en sentral variabel formidler reservert bredde.

Alle nye kildefiler var under 250 linjer.

## Verifisert før merge

```text
npm run check: bestått
Dependency Cruiser: 38 moduler, 80 avhengigheter, 0 brudd
PC-visning: godkjent
arkitekturrapporter: oppdatert
arbeidsområde: clean
```

Bekreftet oppførsel:

- ingen valgt element gir ingen synlig eller reservert høyremeny
- valgt element åpner panelet
- ny markering oppdaterer panelet uten stale data
- klikk på tomt lerret lukker panelet
- låst element kan inspiseres
- aktiv tekstdraft mistes eller overskrives ikke
- panelklikk bruker normal blur/commit
- markeringen beholdes etter commit
- ingen direkte DOM-søk eller direkte prosjektmutasjon
- overlay under 1680 px
- dokket panel fra 1680 px
- egen scrolling
- redusert bevegelse respekteres