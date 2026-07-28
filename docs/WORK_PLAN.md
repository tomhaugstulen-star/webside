# Arbeidsplan for Website-editoren

Dette dokumentet fastsetter rekkefølgen for videre utvikling. Det utvikles aldri direkte på `main`.

## 1. Fast arbeidsflyt

For hver avgrensede del:

1. Kontroller rent arbeidsområde.
2. Oppdater og kontroller `main`.
3. Opprett egen branch fra oppdatert `main`.
4. Definer omfang, brukerhandlinger, state og grenser mot senere funksjoner.
5. Bygg bare den avgrensede funksjonen.
6. Trekk ut ansvar før en kildefil passerer 250 linjer.
7. Gjennomfør framtidsrettet kodeaudit.
8. Kjør `npm run check`.
9. Regenerer arkitekturrapporter ved strukturendringer.
10. Test PC, Telefon, peker og tastatur der det er relevant.
11. Fjern test-fixtures.
12. Oppdater dokumentasjonen.
13. Opprett PR og kontroller diff, mergebarhet og review-tråder.
14. Merge først etter eksplisitt godkjenning.
15. Kontroller oppdatert `main` før neste branch.

## 2. Ferdig og merget til `main`

### Fase 0 – Stabilt editorgrunnlag

- blankt lerret
- toppmeny og venstremeny
- PC- og Telefon-visning
- kontrollert paneloppførsel
- Dependency Cruiser
- samlet `npm run check`
- automatisk nettleseråpning

### Fase 1 – Prosjekt- og elementmodell

Branch: `feature/element-model`

- prosjekt, sider og elementer
- skjemaversjon, stabile ID-er og tidsstempler
- responsive verdier for posisjon, størrelse og synlighet
- låsestatus
- sentral prosjekt-state og aktiv side

### Fase 2 – Markering

Branch: `feature/element-selection`

- transient `selectedElementId`
- peker- og tastaturmarkering
- klikk på tomt lerret fjerner markering
- markering holdes utenfor prosjektfil, historikk og lagring

Se `docs/ELEMENT_SELECTION.md`.

### Fase 3 – Opprette elementer

Branch: `feature/element-creation`

- Seksjon, Bilde, Tekst og Knapp
- sikre ID-er og `updatedAt`
- kontrollerte standardstørrelser
- første ledige startplass
- automatisk markering
- avledet lerretshøyde

Se `docs/ELEMENT_CREATION.md`.

### Fase 4 – Flytting og størrelsesendring

Branch: `feature/drag-resize`

Status: merget som PR #4.

- pekerflytting og resizing
- tastaturflytting og resizing
- minimumsmål og clamping
- edge-scroll og automatisk lerretsvekst
- transient preview
- én commit ved normalt pekerslipp
- avbrudd uten commit ved cancel eller tapt capture

Se `docs/DRAG_RESIZE.md`.

### Fase 5 – Objektlåsing

Branch: `feature/object-locking`

Status: merget som PR #5 med merge-commit `a3eed45`.

- separat objektverktøylinje
- lås og lås opp
- varig `locked` gjennom reduceren
- låste elementer kan markeres og fokuseres
- peker- og tastaturtransform blokkeres
- stiplet låsetilstand
- tilgjengelig låseknapp

Se `docs/OBJECT_LOCKING.md`.

## 3. Gjeldende fase

### Fase 6 – Ren tekstredigering

Branch:

```text
feature/text-box-editing
```

Status: **implementert, kodeauditert, `npm run check` bestått og visuelt godkjent på PC og Telefon før dokumentoppdateringen**.

Implementert:

- prosjektskjema versjon 2
- diskriminert elementunion
- obligatorisk `content` bare for `kind: 'text'`
- tomt standardinnhold
- ett klikk markerer
- dobbeltklikk starter redigering
- `Enter` på markert tekstboks starter redigering
- kontrollert flerlinjet `textarea`
- vanlig `Enter` lager ny linje
- blur og `Ctrl`/`Cmd` + `Enter` committer
- `Escape` forkaster aktiv draft
- IME-sikker snarveishåndtering
- tom tekst er gyldig
- linjeskift normaliseres til `\n`
- låst tekstboks kan ikke redigeres
- transform og objektverktøy er deaktivert under redigering
- reduceren avviser feil type, låst element og uendret tekst
- `updatedAt` endres bare ved reell tekstendring
- tekstinnhold er felles for PC og Telefon

Arkitekturgrenser:

- tekstinnhold er varig prosjektdata
- aktiv redigeringsøkt og lokal draft er transient state
- én avsluttet økt skal senere være én historikk-/autolagringsendring
- DOM-en og `innerHTML` brukes ikke som lagringskilde
- alle berørte TypeScript- og TSX-filer er under 250 linjer

Branchen inneholder ikke:

- høyremeny
- fontfamilie eller fontstørrelse
- tekstfarge, fet eller kursiv
- formatering av markert tekst
- bildeimport
- knapphandlinger
- historikk eller lagring
- responsive mobiloverstyringer

Se `docs/TEXT_BOX_EDITING.md`.

Før PR gjenstår:

- hent dokumentendringene lokalt
- regenerer arkitekturrapportene
- commit og push rapportene
- bekreft rent og synkronisert arbeidsområde

## 4. Neste fase etter merge

### Fase 7 – Høyremenyens grunnstruktur

Planlagt branch:

```text
feature/right-properties-panel
```

Skal bygge:

- stabil høyre kolonne i editorshellet
- følger `selectedElementId`
- viser valgt elementtype og grunnidentitet
- tydelig tom/skjult tilstand når ingenting er valgt
- kontrollert oppførsel når element låses eller tekst redigeres
- seksjonsstruktur for senere egenskaper
- forutsigbar fokusrekkefølge
- PC- og Telefon-kontroll

Skal ikke bygge:

- fontkontroller
- tekstformattering
- bildeinnstillinger
- knapphandlinger
- fargevelgere
- sletting
- historikk eller lagring

Menyen bygges før innholdet i den, slik at senere egenskapsfunksjoner får én stabil arkitektur.

## 5. Senere faser

### Fase 8 – Tekstegenskaper

Branch: `feature/text-properties`

- nettsikre fonter
- kontrollert fontstørrelsesliste
- linjehøyde og tekstjustering etter eksplisitt beslutning
- tekstfarge kobles senere til prosjektets fargesystem
- fet og kursiv
- om formatering gjelder hele boksen eller markert tekst må besluttes før kode

### Fase 9 – Knapper

Branch: `feature/button-element`

- redigerbar knappetekst
- størrelse, plassering, farger og ramme
- handling eller lenketype avklares før implementering
- handling aktiveres ikke i vanlig editormodus

### Fase 10 – Bilder

Branch: `feature/image-import-and-placement`

- bildevelger
- lokale bildefiler
- selvstendig bildeobjekt
- fri plassering og størrelse

### Fase 11 – Farger

Branch: `feature/project-colors`

- register over faktiske prosjektfarger
- global endring
- oppdatere alle brukere av en farge

### Fase 12 – Logo og header

Branch: `feature/logo-header`

- logo
- header
- hovedtekst og undertittel
- redigerbar struktur

### Fase 13 – Korrigeringslinjer

Branch: `feature/alignment-guides`

- horisontal midtstilling
- samme linje
- lik avstand
- bare under flytting eller resizing
- ingen automatisk kollisjonsunngåelse

### Fase 14 – Responsiv redigering

Branch: `feature/mobile-design-controls`

Sporet i GitHub-sak #3 og `docs/MOBILE_DESIGN_CONTROLS.md`.

- desktop er grunnlaget
- mobil arver desktop som standard
- eksplisitte mobiloverstyringer for posisjon, størrelse og synlighet
- mobilendring påvirker ikke desktop
- **Bruk PC-oppsett** fjerner mobiloverstyringen
- viewport-bevisste prosjektmutasjoner

### Fase 15 – Angre og gjør om

Branch: `feature/history-system`

- prosjektendringsmodell
- pekertransform som én historikkpost
- låseendring som én historikkpost
- avsluttet tekstøkt som én historikkpost
- transient markering, draft, panelstate og preview holdes utenfor

### Fase 16 – Lokal automatisk lagring

Branch: `feature/local-project-autosave`

- prosjektmappe
- sikker automatisk lagring
- lokale bilder
- `Lagrer`, `Lagret` og `Lagringsfeil`
- gjenoppretting

### Fase 17 – Åpne og importere prosjekt

Branch: `feature/project-open-import`

- validere prosjektfil
- migrere eldre skjemaversjoner
- laste prosjektdata og bilder
- håndtere feil

### Fase 18 – Forhåndsvisning og publisering

Branches:

- `feature/preview-mode`
- `feature/publishing`

Bygges først etter at editor, responsiv modell og lagring er stabile.

## 6. Kontrollpunkter før merge

- branchen inneholder bare avtalt omfang
- ingen test-fixture ligger igjen
- ingen kildefil har uklare samleansvar
- uttrekking starter før 250 linjer
- state-avhengige mutasjoner bruker nyeste reducer-state
- transient og varig state er tydelig separert
- ugyldige og uendrede state-overganger avvises
- tastaturbruk og fokus er kontrollert
- senere faser er dokumentert uten skjult implementering
- `npm run check` er bestått etter siste kodeendring
- arkitekturrapporter er regenerert
- PC og Telefon er testet
- peker og tastatur er testet
- dokumentasjonen er oppdatert
- arbeidsområdet er rent og synkronisert

## 7. Neste kontrollsteg

På `feature/text-box-editing`:

```powershell
npm run architecture:json
npm run architecture:diagram
git status
```

Rapportene committes og pushes før PR. Produksjonskoden er allerede kontrollert etter siste kodeendring; dokumentoppdateringene krever ikke ny visuell regresjonstest.
