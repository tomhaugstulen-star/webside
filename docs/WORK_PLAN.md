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
10. Test desktop, mobil, peker og tastatur der det er relevant.
11. Fjern test-fixtures.
12. Oppdater dokumentasjonen.
13. Opprett PR og kontroller diff, mergebarhet og review-tråder.
14. Merge først etter eksplisitt godkjenning.
15. Kontroller oppdatert `main` før neste branch.

## 2. Ferdig og merget til `main`

### Fase 0 – Stabilt editorgrunnlag

- blankt lerret
- toppmeny og venstremeny
- desktop- og mobilvisning
- kontrollert paneloppførsel
- delt CSS- og komponentstruktur
- Dependency Cruiser
- samlet `npm run check`
- automatisk nettleseråpning

### Fase 1 – Prosjekt- og elementmodell

Branch: `feature/element-model`

- prosjekt med skjemaversjon, ID, navn og tidsstempler
- sider og elementlister
- elementtypene seksjon, bilde, tekst og knapp
- responsive verdier for posisjon, størrelse og synlighet
- låsestatus
- kryptografiske stabile ID-er
- sentral prosjekt-state, reducer og aktiv side
- blankt prosjekt med siden `Forside`

### Fase 2 – Markering av elementer

Branch: `feature/element-selection`

- transient `selectedElementId`
- valg av element på aktiv side
- valgt-, hover- og fokustilstand
- klikk på tomt lerret fjerner markering
- Tab, Enter og mellomrom
- validerte state-overganger
- markering holdes utenfor prosjektfil, historikk og lagring

Se `docs/ELEMENT_SELECTION.md`.

### Fase 3 – Opprette elementer

Branch: `feature/element-creation`

- opprette Seksjon, Bilde, Tekst og Knapp
- sikker ID og `updatedAt`
- oppretting gjennom reducerens nyeste state
- automatisk markering
- kontrollert standardstørrelse
- første ledige vertikale startplass med 16 px avstand
- ingen direkte overlapping ved oppretting
- automatisk utvidelse av lerretshøyden
- mobil arv fra desktop
- blank side før eksplisitt oppretting

Varige regler:

- opprettingsplassering gjelder bare elementets fødested
- eksisterende elementer flyttes aldri automatisk
- plassering er ikke et generelt kollisjonssystem
- lerretshøyde er avledet visning

Se `docs/ELEMENT_CREATION.md`.

### Fase 4 – Flytting og størrelsesendring

Branch: `feature/drag-resize`

Status: **ferdig, kontrollert og merget til `main` som PR #4**.

- flytting med peker
- resizing fra ett håndtak nederst til høyre
- minimumsmål per elementtype
- venstre, høyre og øvre lerretsgrense
- fri bevegelse nedover med automatisk lerretsvekst
- edge-scroll
- fri overlapping
- transient layout-preview
- én varig prosjektmutasjon ved normalt pekerslipp
- avbrudd uten commit ved cancel eller tapt pointer capture
- piltaster for flytting
- `Ctrl`/`Cmd` + piltaster for resizing
- `Shift` for 10 px steg
- PC- og Telefon-visning med delt desktopgeometri

Se `docs/DRAG_RESIZE.md`.

## 3. Gjeldende fase

### Fase 5 – Låsing

Branch:

```text
feature/object-locking
```

Status: **implementert og visuelt godkjent på PC og Telefon; siste auditendring og dokumentasjon må sluttkontrolleres før PR**.

Implementert:

- separat objektverktøylinje over valgt element
- åpen hengelås for å låse
- lukket hengelås for å låse opp
- varig `locked`-endring gjennom reduceren
- låseverdi beregnes fra reducerens nyeste state
- prosjektets `updatedAt` oppdateres ved gyldig låseendring
- ukjent element-ID ignoreres
- låst element beholder markeringen
- låst element får stiplet markeringsramme
- resize-håndtaket skjules når elementet er låst
- pekerflytting og pointer-resize blokkeres
- tastaturflytting og tastatur-resize blokkeres
- låseknappen er et eget tastaturtilgjengelig knapp-element
- pointer-propagation fra verktøylinjen stoppes
- låsestatus er felles for PC og Telefon

Audit-herding:

- piltaster på et låst, fokusert element stoppes uten utilsiktet scrolling
- låste elementer kan fortsatt fokuseres, markeres og låses opp
- reduceren forblir autoritativ for transformblokkering
- verktøylinjen er transient editor-UI, ikke prosjektdata
- alle berørte kildefiler er under 250 linjer

Branchen inneholder ikke:

- sletting
- lagpanel
- direkte tekstredigering
- bildeimport
- historikk
- lagring
- egne mobiloverstyringer

Varige regler:

- `locked` er varig elementdata
- en låseendring skal senere være én historikk-/autolagringsendring
- fokus, hover og synlighet for objektverktøylinjen er transient
- låst element må kunne markeres slik at brukeren kan låse det opp

Se `docs/OBJECT_LOCKING.md`.

## 4. Neste fase etter merge

### Fase 6 – Tekst og fonts

Planlagt branch:

```text
feature/text-box-editing
```

Skal bygge:

- tydelig skille mellom objektmarkering og tekstredigering
- direkte redigering av tekstinnhold
- kontrollert commit av tekstinnhold til prosjektmodellen
- tastaturbruk uten konflikt med objektets flyttekommandoer
- nettsikre fonter
- kontrollert fontstørrelsesliste
- tekstfarge, fet og kursiv dersom omfanget godkjennes før implementering
- klipping av tekst ved elementgrensen
- desktop- og mobiltest

Må avklares før implementering:

- eksakt handling som går inn i tekstredigeringsmodus
- handling som avslutter tekstredigering
- om Enter lager avsnitt eller linjeskift
- første fontliste og fontstørrelsesliste
- om formatering gjelder hele tekstboksen eller markert tekst i første versjon
- hvordan tom tekst behandles
- hvordan låst tekstboks oppfører seg
- hvordan historikk senere grupperer skrivehandlinger

Skal ikke samtidig bygge:

- bildeimport
- knapphandlinger
- fargesystem for hele prosjektet
- historikkmotor
- automatisk lagring
- responsive mobiloverstyringer

## 5. Senere faser

### Fase 7 – Knapper

Branch: `feature/button-element`

- redigerbar knappetekst
- størrelse, plassering, farger og ramme
- handling eller lenketype avklares før implementering
- knapphandling aktiveres ikke i vanlig editormodus

### Fase 8 – Bilder

Branch: `feature/image-import-and-placement`

- bildevelger
- lokale bildefiler
- selvstendig bildeobjekt
- fri plassering og størrelse

### Fase 9 – Farger

Branch: `feature/project-colors`

- register over faktiske prosjektfarger
- global endring
- oppdatere alle brukere av fargen

### Fase 10 – Logo og header

Branch: `feature/logo-header`

- logo
- header
- hovedtekst og undertittel
- redigerbar struktur

### Fase 11 – Korrigeringslinjer

Branch: `feature/alignment-guides`

- horisontal midtstilling
- samme linje
- lik avstand
- bare under flytting eller resizing
- ingen automatisk kollisjonsunngåelse

### Fase 12 – Responsiv redigering

Branch: `feature/mobile-design-controls`

Sporing:

```text
GitHub-sak #3
docs/MOBILE_DESIGN_CONTROLS.md
docs/RESPONSIVE_DESIGN.md
```

Mål:

- desktop er grunnlaget
- mobil arver desktopverdier som standard
- eksplisitte mobiloverstyringer for posisjon, størrelse og synlighet
- mobil flytting og resizing endrer ikke desktop
- **Bruk PC-oppsett** fjerner mobiloverstyringen
- tydelig status for arv, eget mobiloppsett og mobilskjuling
- viewport-bevisste prosjektmutasjoner
- kontrollerte media queries fra prosjektmodellen

### Fase 13 – Angre og gjør om

Branch: `feature/history-system`

- prosjektendringsmodell
- angre og gjør om
- pekertransform som én historikkpost
- låseendring som én historikkpost
- gruppering av tekstskriving må fastsettes
- transient markering, fokus, panelstate og preview holdes utenfor

### Fase 14 – Lokal automatisk lagring

Branch: `feature/local-project-autosave`

- prosjektmappe
- sikker automatisk lagring
- lokale bilder
- `Lagrer`, `Lagret` og `Lagringsfeil`
- gjenoppretting

### Fase 15 – Åpne og importere prosjekt

Branch: `feature/project-open-import`

- åpne prosjektmappe
- validere prosjektfil
- laste prosjektdata og bilder
- håndtere feil

### Fase 16 – Forhåndsvisning og publisering

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
- ugyldige state-overganger avvises kontrollert
- tastaturbruk er kontrollert
- planlagte senere faser er dokumentert uten skjult implementering
- `npm run check` er bestått etter siste kodeendring
- arkitekturrapporter er regenerert etter strukturendringer
- PC og Telefon er testet
- peker og tastatur er testet
- dokumentasjonen er oppdatert
- arbeidsområdet er rent
- lokal branch er synkronisert med GitHub

## 7. Neste kontrollsteg

På `feature/object-locking`:

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
npm run dev
git status
```

Etter bestått kontroll, oppdaterte rapporter, godkjent regresjon og rent arbeidsområde kan det opprettes en kontrollert PR mot `main`.
