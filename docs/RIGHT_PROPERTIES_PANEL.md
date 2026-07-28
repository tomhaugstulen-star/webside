# Høyremenyens grunnstruktur

Dette dokumentet er autoritativ spesifikasjon og implementeringsstatus for fase 7.

## Branch og utgangspunkt

```text
branch: feature/right-properties-panel
base main: a35f59d
produksjonskode og arkitekturrapporter: 2d25a542
```

PR #7 leverte kontrollert tekstredigering. PR #8 låste navn og rekkefølge i venstremenyen.

## Status

Høyremenyens grunnstruktur er implementert, kodeauditert, visuelt kontrollert og godkjent.

Bekreftet etter siste produksjonskodeendring:

```text
npm run check: bestått
Dependency Cruiser: 38 moduler, 80 avhengigheter, 0 brudd
PC-visning: godkjent
arbeidsområde etter arkitekturrapporter: clean
```

Det er ikke opprettet PR ennå.

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

## Visuell struktur

Første leveranse viser bare faktisk inspeksjonsinformasjon:

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

Det finnes ingen tomme seksjoner, falske kontroller eller deaktiverte plassholdere.

## Implementert arkitektur

Ansvarsdeling:

```text
src/components/properties/RightPropertiesPanel.tsx
  - presenterer valgt elementtype og låsestatus
  - mottar elementet som prop
  - muterer ingen prosjektdata

src/state/useElementSelection.ts
  - eksisterende autoritativ avledning av selectedElementId og selectedElement

src/components/editor/EditorShell.tsx
  - komponerer venstremeny, lerret og høyremeny
  - leser selectedElement gjennom eksisterende hook
  - eier ingen egenskapslogikk

src/styles/right-properties-panel.css
  - paneloverflate, scrolling, breakpoint og transform-animasjon

src/styles/editor-base.css
  - --properties-panel-width: 320px
  - --properties-panel-reserved-width: 0px

src/styles/canvas.css og src/styles/sidebar.css
  - egne lerretsberegninger bruker bare den sentrale reserverte breddevariabelen
```

Panelet:

- søker ikke etter valgt element i DOM-en
- lagrer ikke en separat kopi av elementdata
- oppretter ingen ny selector eller reducer-action
- muterer ikke prosjektdata direkte
- serialiseres ikke
- inngår ikke direkte i historikk eller autolagring

## Betinget innhold og animasjon

Paneloverflaten er montert for å kunne animere ut. Selve innholdet rendres bare når et gyldig element er valgt.

Dette sikrer at fremtidige inputfelt og knapper ikke blir liggende skjult i DOM-en etter at markeringen fjernes. `aria-labelledby` brukes bare når panelet er åpent.

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

Et låst element kan fortsatt være valgt og vises i panelet. Grunnfasen viser bare status og introduserer ingen ny prosjektmutasjon.

Reducerens eksisterende låsegrenser er fortsatt autoritative.

## Ikke del av denne branchen

Følgende er ikke implementert:

- fontfamilie eller fontstørrelse
- tekstfarge, fet, kursiv eller markert tekstformatering
- bildevelger eller bildeegenskaper
- knapphandlinger eller lenker
- fargevelgere eller prosjektfargeregister
- logo- eller headerbygger
- sletting eller duplisering
- lagpanel
- historikk eller lagring
- nytt prosjekt eller prosjektimport
- mobile geometri-overstyringer

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

1. Panelinnholdet rendres nå bare når et element finnes.
2. Høyremenyens CSS styrer ikke lenger `.canvas-page--desktop` direkte; en sentral variabel formidler reservert bredde.

Alle nye kildefiler er under 250 linjer.

## Akseptansekriterier

Bekreftet:

- ingen valgt element gir ingen synlig eller reservert høyremeny
- valgt element åpner panelet
- ny markering oppdaterer panelet uten stale data
- klikk på tomt lerret lukker panelet
- låst element kan inspiseres
- aktiv tekstdraft mistes eller overskrives ikke
- panelklikk bruker normal blur/commit
- markeringen beholdes etter commit
- ingen falske egenskapskontroller
- ingen direkte DOM-søk eller direkte prosjektmutasjon
- overlay under 1680 px
- dokket panel fra 1680 px
- egen scrolling
- redusert bevegelse respekteres
- `npm run check` består
- arkitekturrapportene er oppdatert
- PC-visning er godkjent
- arbeidsområdet er rent og synkronisert

Neste steg er dokumentasjonskontroll og PR-gjennomgang mot `main`.