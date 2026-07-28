# Plan for Website-editoren

Dette dokumentet samler bekreftede produktkrav, implementert grunnlag og åpne beslutninger.

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
- oppretting av alle fire elementtypene
- kontrollerte startstørrelser og startplassering
- flytting og resizing med peker og tastatur
- minimumsmål, clamping, edge-scroll og transient preview
- objektlåsing og opplåsing
- kontrollert flerlinjet tekstredigering
- Dependency Cruiser og samlet `npm run check`

### Viktige merges

```text
PR #4  drag og resize
PR #5  objektlåsing                 a3eed45
PR #7  ren tekstredigering          c729d33
PR #8  navn og rekkefølge i meny    a35f59d
```

### Endelig venstremeny

```text
Prosjekt
Farger
Logo og header
Elementer
Innstillinger
```

- `Prosjekt` står øverst
- `Innstillinger` står nederst
- paneloverskriftene følger samme navn
- PR #8 endret ikke panelenes faktiske funksjonalitet

### Gjeldende fase

```text
feature/right-properties-panel
```

Branchen er fast-forwardet fra `main` på `a35f59d`. Dokumentasjonen er oppdatert før implementering. Ingen produksjonskode for høyremenyen er lagt inn ennå.

Fasen skal bygge høyremenyens stabile grunnstruktur uten font-, bilde-, knapp-, farge-, slettings-, historikk- eller lagringsfunksjoner.

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
- aktive verktøy og paneler
- fokus, hover og lokal UI-feedback

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

### Låst oppførsel

```text
Ingenting valgt -> ingen høyremeny
Element valgt   -> høyremeny åpnes
Tomt lerret     -> høyremeny lukkes
```

I tillegg er følgende godkjent:

- skjult panel reserverer ikke en tom høyrekolonne
- bytte av markering oppdaterer panelet
- låst element kan fortsatt inspiseres
- panelet kan være åpent under tekstredigering
- klikk i panelet bruker eksisterende blur/commit
- markeringen beholdes etter normal commit
- panelet oppretter ikke separat tekstdraft

En permanent synlig tom høyremeny er avvist.

### Åpne beslutninger

Før produksjonskode må dette godkjennes:

- eksakt bredde
- oppførsel i smale nettleservinduer
- egen scrolling
- visuell overskrift og seksjonsstruktur
- minimum av faktisk inspeksjonsinformasjon
- eventuell åpne-/lukkeanimasjon

### Arkitektur

- panelet skal følge `selectedElementId`
- aktiv side er kilden til elementdata
- eksisterende `useElementSelection` skal vurderes og normalt gjenbrukes
- panelet skal ikke lete i DOM-en
- panelet skal ikke eie en separat kopi av elementdata
- `EditorShell` skal bare komponere venstremeny, lerret og høyremeny
- høyremenyen får egen komponent og egen CSS-grense
- eksisterende `--panel-width` tilhører venstrepanelet; høyremenyen må få en egen entydig breddevariabel
- ingen midlertidige eller falske egenskapskontroller

Se `docs/RIGHT_PROPERTIES_PANEL.md`.

## 5. Farger, logo/header og fonter

### Farger

- venstremenyens navn er `Farger`
- området skal senere vise faktiske prosjektfarger
- ingen ferdig fargepalett
- global endring skal oppdatere alle brukere av fargen

### Logo og header

- venstremenyens navn er `Logo og header`
- laste opp logo
- opprette header
- hovedtekst og undertittel
- redigerbar struktur

### Fonter

- omtrent 7–8 nettsikre fonter
- fontstørrelse fra kontrollert liste
- tekstfarge kobles til fargesystemet
- fet og kursiv
- formatering av hele boksen kontra markert tekst må avklares før kode

## 6. Prosjektområdet

Venstremenyens første valg heter `Prosjekt`.

Det skal senere eie:

- nytt prosjekt
- åpne prosjekt
- importere prosjekt
- eventuell eksport og duplisering etter egen beslutning

PR #8 endret bare navn og rekkefølge. Nytt prosjekt, åpning og import er ikke implementert.

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

- `feature/right-properties-panel` — gjeldende fase
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

## 9. Åpne beslutninger

- høyremenyens bredde, smalvinduoppførsel, scrolling og visuelle struktur
- minimumsinnhold i høyremenyens første leveranse
- om tekstformatering gjelder hele boksen eller markert tekst
- endelig fontliste og fontstørrelser
- tekstjustering og linjehøyde
- sletting og bekreftelsesregel
- endelig mobilbrytepunkt
- knappens handlinger og lenketyper
- prosjektfilformat, migrering og lagringsintervall
- publiseringsarkitektur
