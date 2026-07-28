# Arbeidsplan for Website-editoren

Dette dokumentet fastsetter rekkefølgen for videre utvikling. Det utvikles aldri direkte på `main`.

## 1. Fast arbeidsflyt

For hver avgrensede del:

1. Kontroller rent arbeidsområde.
2. Oppdater og kontroller `main`.
3. Opprett eller fast-forward riktig feature-branch fra oppdatert `main`.
4. Definer omfang, brukerhandlinger, state og grenser mot senere funksjoner.
5. Få eksplisitt godkjenning på åpne produkt- og designvalg.
6. Bygg bare den avgrensede funksjonen.
7. Trekk ut ansvar før en kildefil passerer 250 linjer.
8. Gjennomfør framtidsrettet kodeaudit.
9. Kjør `npm run check` etter siste kodeendring.
10. Regenerer arkitekturrapporter ved strukturendringer.
11. Test PC, Telefon, peker og tastatur der det er relevant.
12. Fjern test-fixtures.
13. Oppdater dokumentasjonen.
14. Kontroller at branchen er synkronisert og arbeidsområdet er rent.
15. Opprett draft-PR og kontroller hele diffen, mergebarhet, review-tråder og eventuell CI.
16. Marker PR klar for review.
17. Merge først etter brukerens eksplisitte godkjenning.
18. Kontroller oppdatert lokal `main` før neste fase.

## 2. Ferdig og merget til `main`

### Fase 0 – Stabilt editorgrunnlag

- blankt lerret
- toppmeny og venstremeny
- PC- og Telefon-visning
- kontrollert venstrepanel
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

### Fase 6 – Ren tekstredigering

Branch: `feature/text-box-editing`

Status: merget som PR #7 med merge-commit `c729d33`.

- prosjektskjema versjon 2
- diskriminert elementunion
- obligatorisk `content` bare for `kind: 'text'`
- tomt standardinnhold
- ett klikk markerer
- dobbeltklikk eller `Enter` på markert tekstboks starter redigering
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

Se `docs/TEXT_BOX_EDITING.md`.

### Menynavn og rekkefølge

Branch: `feature/left-menu-labels`

Status: merget som PR #8 med merge-commit `a35f59d`.

Endelig venstremeny:

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
- funksjonaliteten i panelene ble ikke utvidet i PR #8

## 3. Gjeldende fase

### Fase 7 – Høyremenyens grunnstruktur

Branch:

```text
feature/right-properties-panel
```

Branchstatus:

- branchen er fast-forwardet til `main` etter PR #8
- base-commit er `a35f59d`
- dokumentasjonen oppdateres før implementering
- ingen produksjonskode for høyremenyen er lagt inn ennå

Sporet i:

```text
docs/RIGHT_PROPERTIES_PANEL.md
GitHub-sak #6
```

### Låste produktbeslutninger

- ingen markering gir ingen synlig eller reservert høyremeny
- markering av et element åpner høyremenyen
- klikk på tomt lerret fjerner markering og lukker høyremenyen
- bytte av markering oppdaterer panelet umiddelbart
- låst element kan fortsatt inspiseres
- panelet kan være åpent under tekstredigering
- klikk i panelet bruker eksisterende blur/commit
- markeringen beholdes etter normal tekstcommit
- panelet oppretter ikke en separat tekstdraft

En permanent synlig tom høyremeny er avvist.

### Åpne beslutninger før kode

Neste chat skal presentere ett konkret forslag og få godkjenning på:

- panelbredde
- oppførsel i smale nettleservinduer
- egen scrolling
- visuell overskrift og seksjonsstruktur
- minimum av faktisk inspeksjonsinformasjon
- eventuell åpne-/lukkeanimasjon

### Skal bygge

- høyremeny som egen komponent og eget layoutområde i `EditorShell`
- betinget rendering basert på valgt element
- gjenbruk eller kontrollert bruk av eksisterende `useElementSelection`
- korrekt oppdatering ved markering, ny markering, fjernet markering og sideskifte
- kontrollert oppførsel ved låsing og aktiv tekstredigering
- forutsigbar fokusrekkefølge
- egen CSS-grense
- PC- og Telefon-kontroll
- peker- og tastaturkontroll

### Skal ikke bygge

- fontkontroller
- tekstformattering
- bildeinnstillinger
- knapphandlinger
- fargevelgere eller prosjektfargeregister
- logo- eller headerbygger
- sletting eller duplisering
- historikk eller lagring
- prosjektimport
- mobiloverstyringer

### Første steg i neste chat

1. Les `docs/NEXT_CHAT_PROMPT.md` og `docs/RIGHT_PROPERTIES_PANEL.md`.
2. Kontroller at lokal `main` er clean.
3. Hent og bytt til `feature/right-properties-panel`.
4. Les faktisk shell-, selection-, canvas- og CSS-kode.
5. Presenter konkrete forslag for de åpne designbeslutningene.
6. Ikke skriv produksjonskode før brukeren har godkjent disse valgene.

## 4. Senere faser

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

## 5. Kontrollpunkter før merge

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
- arkitekturrapporter er regenerert ved strukturendringer
- PC og Telefon er testet
- peker og tastatur er testet
- dokumentasjonen er oppdatert
- arbeidsområdet er rent og synkronisert
- hele PR-diffen er kontrollert
- merge skjer bare etter eksplisitt godkjenning
