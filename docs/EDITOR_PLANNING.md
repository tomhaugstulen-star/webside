# Plan for Website-editoren

Dette dokumentet samler bekreftede produktkrav, implementert grunnlag og planlagte utvidelser.

## 1. Implementeringsstatus

### Ferdig og merget til `main`

- blankt PC- og Telefon-lerret
- toppmeny og kontrollert venstremeny
- Elementer-panel med Seksjon, Bilde, Tekst og Knapp
- prosjekt- og elementmodell
- stabile kryptografiske ID-er
- responsive posisjons-, størrelses- og synlighetsverdier
- sentral prosjekt-state og aktiv side
- transient elementmarkering
- oppretting av alle fire elementtyper
- kontrollerte startstørrelser og startplassering
- flytting og resizing med peker og tastatur
- minimumsmål, clamping, edge-scroll og transient preview
- objektlåsing og opplåsing
- kontrollert flerlinjet tekstredigering
- høyremenyens stabile grunnstruktur
- Dependency Cruiser og samlet `npm run check`

Viktige merges:

```text
PR #4  drag og resize
PR #5  objektlåsing                 a3eed45
PR #7  ren tekstredigering          c729d33
PR #8  navn og rekkefølge i meny    a35f59d
PR #9  høyremenyens grunnstruktur    8de5f2e
```

Endelig venstremeny:

```text
Prosjekt
Farger
Logo og header
Elementer
Innstillinger
```

### Gjeldende branch

```text
feature/text-properties
```

```text
base main: 8de5f2e
sporing: docs/TEXT_PROPERTIES.md og GitHub-sak #10
```

Fasen bygger tekstutseende for markerte vanlige tekstbokser. Ingen produksjonskode er lagt inn ennå.

## 2. Bekreftede hovedkrav

### Blank startside

- En ny side åpner helt blank.
- Ingen synlige elementer opprettes automatisk.
- Elementoppretting skjer bare etter eksplisitt brukerhandling.
- Omlasting gir foreløpig blank side fordi lagring ikke er implementert.

### Autoritativ prosjektmodell

- `EditorProject` er autoritativ kilde for varige prosjektdata.
- DOM-en er rendering, ikke permanent lagring.
- Geometri, låsestatus, tekstinnhold og senere tekststil endres gjennom reduceren.
- State-avhengige beregninger bruker reducerens nyeste state.
- `updatedAt` endres bare ved gyldig prosjektmutasjon.

### Transient state

Følgende skal ikke serialiseres, publiseres eller lagres:

- `selectedElementId`
- aktiv pointer-interaksjon
- layout-preview
- aktiv tekstredigeringsøkt
- lokal tekstdraft
- aktive verktøy og paneler
- fokus, hover og lokal UI-feedback

Når historikk og autolagring bygges, skal en avsluttet brukerhandling være én eksplisitt prosjektendring.

### PC og Telefon

- Mobil arver desktopgeometri når mobiloverstyring mangler.
- Dagens UI redigerer den delte desktopgeometrien.
- Egne mobiloverstyringer bygges i `feature/mobile-design-controls`.
- Tekstinnhold, låsestatus og tekststil er foreløpig felles elementdata.

## 3. Elementer

### Startstørrelser

- Seksjon: 320 × 180 px
- Bilde: 240 × 160 px
- Tekst: 240 × 96 px
- Knapp: 160 × 48 px

### Minimumsstørrelser

- Seksjon: 160 × 90 px
- Bilde: 120 × 80 px
- Tekst: 120 × 48 px
- Knapp: 80 × 36 px

### Oppretting

- start ved x 24 px
- første ledige vertikale gap
- minst 16 px avstand ved oppretting
- eksisterende elementer flyttes aldri automatisk
- opprettet element markeres automatisk

### Flytting og resizing

- elementer kan overlappe
- ingen automatisk kollisjonsunngåelse
- venstre, høyre og øvre grense håndheves
- ingen fast nedre grense
- lerretet forlenges nedover
- transient preview under pekerbevegelse
- én commit ved normalt slipp
- cancel eller tapt capture committer ikke
- piltaster flytter
- `Ctrl`/`Cmd` + piltaster endrer størrelse
- `Shift` bruker 10 px steg

### Låsing

- valgt element får separat objektverktøylinje
- låst element kan markeres og fokuseres
- låst element kan ikke transformeres eller redigeres
- resize-håndtaket skjules
- reduceren håndhever låsen
- låsestatus er felles for PC og Telefon

### Ren tekstredigering

- bare `kind: 'text'` har `content`
- tom tekst er gyldig
- editor-placeholder lagres ikke
- ett klikk markerer
- dobbeltklikk eller `Enter` starter redigering
- vanlig `Enter` lager ny linje
- blur og `Ctrl`/`Cmd` + `Enter` committer
- `Escape` forkaster lokal draft
- linjeskift normaliseres til `\n`
- `contentEditable` og `innerHTML` brukes ikke
- tekst klippes ved elementgrensen
- boksen vokser ikke automatisk med innholdet

### Bilder og knapper

- Bilde er foreløpig en plassholder.
- Knapp er foreløpig uten handling.
- Faktiske handlinger aktiveres ikke i vanlig editormodus.

## 4. Ansvarsdeling i editoren

Fast regel:

```text
Venstremeny = opprette og velge struktur
Høyremeny  = egenskaper for markert element
Lerretet   = redigere selve teksten
```

`Elementer -> Tekst` oppretter en vanlig fri tekstboks. Font, størrelse og andre egenskaper skal ikke flyttes til venstremenyen.

`Logo og header` skal senere eie strukturelle headerdeler som logo, hovedtekst, undertittel og header-oppsett. Disse er ikke vanlige frie tekstbokser.

## 5. Høyremeny

### Implementert grunnstruktur

```text
Ingenting valgt -> ingen høyremeny
Element valgt   -> høyremeny åpnes
Tomt lerret     -> høyremeny lukkes
```

- bredde 320 px
- dokket fra 1680 px
- overlay under 1680 px
- overlay reduserer ikke lerretet
- skjult panel reserverer ingen plass
- ny markering oppdaterer panelet umiddelbart
- låst element kan inspiseres
- panelklikk bruker eksisterende blur/commit
- egen vertikal scrolling
- 180 ms transform-animasjon
- ingen animasjon ved `prefers-reduced-motion`

Arkitektur:

- `RightPropertiesPanel.tsx` presenterer valgt element
- eksisterende `useElementSelection` er autoritativ avledning
- `EditorShell` komponerer panelområdet uten egenskapslogikk
- ingen DOM-søk eller separat elementkopi
- innhold rendres bare når et element finnes
- panel-CSS styrer ikke canvas-klasser direkte

Se `docs/RIGHT_PROPERTIES_PANEL.md`.

### Gjeldende tekstegenskapsfase

For en markert vanlig tekstboks:

```text
Egenskaper
Tekst

Tekstutseende
Font
Størrelse
Fet
Kursiv
Justering
Linjehøyde

Element
Status: Ulåst
```

Låste valg:

- formateringen gjelder hele tekstboksen
- åtte nettsikre fontvalg
- kontrollert størrelse fra 12 til 96 px
- fet og kursiv som uavhengige toggles
- venstre, midtstilt og høyre justering
- kontrollerte linjehøyder fra 1.0 til 2.0
- standard: System, 16 px, normal, venstre, 1.45
- låste tekstelementer viser verdiene, men kontrollene er deaktivert
- tekstinnhold redigeres fortsatt bare på lerretet
- tekstfarge bygges senere sammen med prosjektfargene

Modell:

- prosjektskjema versjon 3
- obligatorisk `textStyle` bare for tekstelementer
- stabile fonttokens i prosjektdata
- rå CSS-fontstacker avledes i visningslaget
- stilpatcher slås sammen i reducerens nyeste state
- ugyldige, låste og uendrede overganger avvises

Se `docs/TEXT_PROPERTIES.md`.

## 6. Farger og logo/header

### Farger

- venstremenyens navn er `Farger`
- området skal senere vise faktiske prosjektfarger
- ingen ferdig fargepalett
- global endring skal oppdatere alle brukere av en farge
- tekstfarge kobles til denne modellen, ikke til tekstegenskapsbranchen

### Logo og header

- venstremenyens navn er `Logo og header`
- laste opp logo
- opprette header
- hovedtekst og undertittel
- redigerbar struktur
- headertekst får senere egenskaper i høyremenyen, men er ikke et fritt tekstelement

## 7. Arkitektur og arbeidsmåte

- én avgrenset funksjon per branch
- `main` holdes stabil
- 250 linjer er aktiv terskel for ansvarstrekk
- prosjektmodell, transient state, hendelseslogikk og visning holdes separat
- reducer-actions håndteres uttømmende
- ugyldige og uendrede state-overganger avvises
- Dependency Cruiser kontrollerer modulgrensene
- arkitekturrapporter regenereres etter strukturendringer
- repo og dokumentasjon leses før kode endres
- PR opprettes først etter kontroll og rent arbeidsområde
- merge krever eksplisitt godkjenning

## 8. Planlagte branches

- `feature/text-properties` — gjeldende fase
- `feature/button-element`
- `feature/image-import-and-placement`
- `feature/project-colors`
- `feature/logo-header`
- `feature/alignment-guides`
- `feature/mobile-design-controls`
- `feature/history-system`
- `feature/local-project-autosave`
- `feature/project-open-import`
- `feature/preview-mode`
- `feature/publishing`

## 9. Senere åpne beslutninger

- sletting og bekreftelsesregel
- endelig mobilbrytepunkt
- mobile tekststiloverstyringer
- knappens handlinger og lenketyper
- prosjektfilformat, migrering og lagringsintervall
- publiseringsarkitektur
