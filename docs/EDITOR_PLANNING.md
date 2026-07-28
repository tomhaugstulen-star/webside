# Plan for Website-editoren

Dette dokumentet samler bekreftede produktkrav, implementert grunnlag og åpne beslutninger.

## 1. Implementeringsstatus

### Ferdig og merget til `main`

- blankt PC- og Telefon-lerret
- toppmeny og venstremeny
- Elementer-panel med Seksjon, Bilde, Tekst og Knapp
- prosjekt- og elementmodell
- stabile kryptografiske ID-er
- responsive posisjons-, størrelses- og synlighetsverdier
- sentral prosjekt-state og aktiv side
- transient elementmarkering
- oppretting av alle fire elementtypene
- kontrollerte startstørrelser og startplassering
- flytting og resizing med peker og tastatur
- minimumsmål, clamping, edge-scroll og transient preview
- objektlåsing og opplåsing
- Dependency Cruiser og samlet `npm run check`

### Implementert i `feature/text-box-editing`

- prosjektskjema versjon 2
- diskriminert elementunion
- tekstobjekter har obligatorisk `content`
- nye tekstbokser starter med tom tekst
- tydelig skille mellom objektmarkering og tekstredigering
- kontrollert flerlinjet `textarea`
- blur og `Ctrl`/`Cmd` + `Enter` committer
- `Escape` forkaster aktiv draft
- vanlig `Enter` lager ny linje
- tom tekst er gyldig
- låst tekstboks kan ikke redigeres
- transform og objektverktøy er deaktivert under redigering
- reduceren validerer tekstcommit og oppdaterer `updatedAt` bare ved reell endring

Brukeren har bekreftet at `npm run check` bestod, at all oppførsel fungerer på PC og Telefon, og at arbeidsområdet var rent før dokumentoppdateringen.

### Neste fase etter merge

```text
feature/right-properties-panel
```

Denne fasen skal bygge høyremenyens stabile grunnstruktur uten å legge inn font-, bilde-, knapp- eller fargekontroller.

## 2. Bekreftede hovedkrav

### Blank startside

- En ny side åpner helt blank.
- Ingen synlige elementer opprettes automatisk.
- Elementoppretting skjer bare etter eksplisitt brukerhandling.
- Omlasting gir foreløpig blank side fordi lagring ikke er implementert.

### Autoritativ prosjektmodell

- `EditorProject` er autoritativ kilde for varige prosjektdata.
- DOM-en er rendering, ikke permanent lagring.
- Geometri, låsestatus og tekstinnhold endres gjennom reduceren.
- State-avhengige beregninger bruker reducerens nyeste state.
- `updatedAt` endres bare ved gyldig prosjektmutasjon.

### Transient state

Følgende skal ikke serialiseres, publiseres eller lagres:

- `selectedElementId`
- aktiv pointer-interaksjon
- layout-preview
- aktiv tekstredigeringsøkt
- lokal tekstdraft
- fokus, hover og synlighet for objektverktøy og paneler

Når historikk og autolagring bygges, skal en avsluttet brukerhandling være én eksplisitt prosjektendring.

### PC og Telefon

- Mobil arver desktopgeometri når mobiloverstyring mangler.
- Dagens UI redigerer den delte desktopgeometrien.
- Egne mobiloverstyringer bygges i `feature/mobile-design-controls`.
- Tekstinnhold og låsestatus er felles elementdata og er ikke responsive verdier.

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
- regelen gjelder bare elementets fødested

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
- låst element kan ikke transformeres
- resize-håndtaket skjules
- reduceren håndhever låsen
- låsestatus er felles for PC og Telefon

### Ren tekstredigering

- bare `kind: 'text'` har `content`
- tom tekst er gyldig
- editor-placeholder lagres ikke
- ett klikk markerer
- dobbeltklikk starter redigering
- `Enter` på markert tekstboks starter redigering
- vanlig `Enter` lager ny linje
- blur og `Ctrl`/`Cmd` + `Enter` committer
- `Escape` forkaster
- linjeskift normaliseres til `\n`
- `contentEditable` og `innerHTML` brukes ikke
- tekst klippes ved elementgrensen
- boksen vokser ikke automatisk med innholdet

Se `docs/TEXT_BOX_EDITING.md`.

### Bilder

- Bilde er foreløpig en plassholder.
- Ekte bildeinnhold og bildevelger er ikke implementert.

### Knapper

- Knapp er foreløpig uten handling.
- Faktisk handling eller lenke skal ikke aktiveres i vanlig editormodus.

## 4. Høyremeny

Neste kontrollerte fase bygger bare inspeksjonspanelets arkitektur:

- høyre kolonne i editorshellet
- følger valgt element
- viser elementtype og grunnidentitet
- tydelig tom/skjult tilstand
- stabil seksjonsstruktur for senere egenskaper
- ingen midlertidige egenskapskontroller

Font, tekststørrelse, farge, bildeinnstillinger og knappinnstillinger bygges først etter at panelet er stabilt.

## 5. Farger, logo/header og fonts

### Farger

- panelet skal vise faktiske prosjektfarger
- ingen ferdig fargepalett
- global endring skal oppdatere alle brukere av fargen

### Logo/header

- laste opp logo
- opprette header
- hovedtekst og undertittel
- redigerbar struktur

### Fonts

- omtrent 7–8 nettsikre fonter
- fontstørrelse fra kontrollert liste
- tekstfarge kobles til fargesystemet
- fet og kursiv
- formatering av hele boksen kontra markert tekst må avklares før kode

## 6. Arkitektur og arbeidsmåte

- én avgrenset funksjon per branch
- `main` holdes stabil
- 250 linjer er aktiv terskel for ansvarstrekk
- prosjektmodell, transient state, hendelseslogikk og visning holdes separat
- reducer-actions håndteres uttømmende
- ugyldige og uendrede state-overganger avvises
- Dependency Cruiser kontrollerer modulgrensene
- arkitekturrapporter regenereres etter strukturendringer

## 7. Planlagte branches

- `feature/text-box-editing` — gjeldende, klar for arkitekturrapporter og PR
- `feature/right-properties-panel`
- `feature/text-properties`
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

## 8. Åpne beslutninger

- høyremenyens eksakte bredde og oppførsel i smale vinduer
- om tekstformatering gjelder hele boksen eller markert tekst
- endelig fontliste og fontstørrelser
- tekstjustering og linjehøyde
- sletting og bekreftelsesregel
- endelig mobilbrytepunkt
- knappens handlinger og lenketyper
- prosjektfilformat, migrering og lagringsintervall
- publiseringsarkitektur
