# Arbeidsplan for Website-editoren

Dette dokumentet fastsetter utviklingsrekkefølge og kontrollkrav. Det utvikles aldri direkte på `main`.

## 1. Fast arbeidsflyt

For hver avgrensede del:

1. Kontroller riktig branch og rent arbeidsområde.
2. Oppdater og kontroller `main`.
3. Opprett eller fast-forward en avgrenset feature-branch.
4. Definer omfang, brukerhandlinger, state og grenser mot senere funksjoner.
5. Lås åpne produkt- og designvalg før produksjonskode.
6. Implementer bare avtalt omfang.
7. Trekk ut ansvar før en kildefil passerer 250 linjer.
8. Gjennomfør framtidsrettet kodeaudit.
9. Kjør `npm run check` etter siste produksjonskodeendring.
10. Regenerer arkitekturrapporter ved strukturendringer.
11. Test PC, Telefon, peker og tastatur der det er relevant.
12. Oppdater dokumentasjonen.
13. Kontroller synkronisert branch og clean tree.
14. Opprett draft-PR og kontroller hele diffen, mergebarhet, review-tråder og eventuell CI.
15. Marker PR klar for review.
16. Merge bare etter eksplisitt brukergodkjenning.
17. Oppdater lokal `main` og kontroller clean tree før neste fase.

## 2. Ferdig og merget til `main`

### Fase 0 – Stabilt editorgrunnlag

- blankt PC- og Telefon-lerret
- toppmeny og kontrollert venstremeny
- Dependency Cruiser og samlet `npm run check`
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

### Fase 3 – Opprette elementer

Branch: `feature/element-creation`

- Seksjon, Bilde, Tekst og Knapp
- sikre ID-er og `updatedAt`
- kontrollerte standardstørrelser og første ledige startplass
- automatisk markering
- avledet lerretshøyde

### Fase 4 – Flytting og størrelsesendring

Branch: `feature/drag-resize`

Status: merget som PR #4.

- peker- og tastaturtransform
- minimumsmål og clamping
- edge-scroll og automatisk lerretsvekst
- transient preview
- én commit ved normalt slipp
- avbrudd uten commit ved cancel eller tapt capture

### Fase 5 – Objektlåsing

Branch: `feature/object-locking`

Status: merget som PR #5 med merge-commit `a3eed45`.

- separat objektverktøylinje
- lås og lås opp
- varig `locked` gjennom reduceren
- låste elementer kan markeres og fokuseres
- peker- og tastaturtransform blokkeres
- tilgjengelig låseknapp

### Fase 6 – Ren tekstredigering

Branch: `feature/text-box-editing`

Status: merget som PR #7 med merge-commit `c729d33`.

- prosjektskjema versjon 2
- `content` bare for tekstobjekter
- kontrollert flerlinjet `textarea`
- dobbeltklikk eller `Enter` starter redigering
- blur og `Ctrl`/`Cmd` + `Enter` committer
- `Escape` forkaster lokal draft
- IME-sikker snarveishåndtering
- låst tekst kan ikke redigeres
- reduceren avviser ugyldige og uendrede commits

### Menynavn og rekkefølge

Branch: `feature/left-menu-labels`

Status: merget som PR #8 med merge-commit `a35f59d`.

```text
Prosjekt
Farger
Logo og header
Elementer
Innstillinger
```

### Fase 7 – Høyremenyens grunnstruktur

Branch: `feature/right-properties-panel`

Status: merget som PR #9 med merge-commit `8de5f2e`.

- ingen markering gir ingen synlig eller reservert høyremeny
- valgt element åpner panelet
- elementtype og låsestatus vises
- 320 px dokket panel fra 1680 px
- overlay under 1680 px uten å redusere lerretet
- egen vertikal scrolling
- 180 ms transform-animasjon
- `prefers-reduced-motion` respekteres
- eksisterende `useElementSelection` gjenbrukes
- tekstens blur/commit beholdes
- panelinnhold rendres bare for et gyldig valgt element
- sentral variabel isolerer reservert panelbredde fra canvas-CSS

Se `docs/RIGHT_PROPERTIES_PANEL.md`.

## 3. Gjeldende fase

### Fase 8 – Tekstegenskaper

Branch:

```text
feature/text-properties
```

Utgangspunkt:

```text
main: 8de5f2e
PR #9: høyremenyens grunnstruktur
```

Sporet i:

```text
docs/TEXT_PROPERTIES.md
GitHub-sak #10
```

Fast UX-regel:

```text
Venstremeny = opprette og velge struktur
Høyremeny  = egenskaper for markert element
Lerretet   = redigere selve teksten
```

### Skal bygge

For en markert vanlig tekstboks:

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
- åtte kontrollerte nettsikre fonter
- kontrollert fontstørrelsesliste fra 12 til 96 px
- venstre, midtstilt og høyre justering
- kontrollerte linjehøyder fra 1.0 til 2.0
- standarden bevarer dagens 16 px og 1.45
- tekstfarge utsettes til prosjektfargesystemet
- tekststil er foreløpig felles for PC og Telefon
- låste tekstelementer kan inspiseres, men kontrollene er deaktivert
- tekstinnhold redigeres fortsatt bare på lerretet

### Modell og state

- prosjektskjemaet økes til versjon 3
- bare tekstelementer får obligatorisk `textStyle`
- fonttokens lagres, ikke rå CSS-fontstacker
- tekststil er varig prosjektdata
- kontrollene sender avgrensede stilpatcher
- reduceren bruker nyeste state og avviser ugyldige, låste og uendrede overganger
- `updatedAt` endres bare ved reell stilendring
- panelet eier ingen separat kopi av tekststilen

### Skal ikke bygge

- tekstfarge eller prosjektfargemodell
- bredde, høyde eller plassering i høyremenyen
- headerens hovedtekst eller undertittel
- riktekst eller formatering av enkeltord
- opplasting av fonter eller eksterne webfonter
- sletting, duplisering, historikk eller lagring
- mobile tekststiloverstyringer

### Første implementeringsrekkefølge

1. Legg inn tekststiltyper, standardverdier og validering.
2. Oppdater tekstelementets modell og oppretting.
3. Lag reducerhjelper og dispatch-hook for stilpatcher.
4. Avled fonttoken og tekststil til CSS for canvas.
5. Sikre identisk stil i vanlig visning og `textarea`.
6. Legg inn en avgrenset `TextPropertiesSection` i høyremenyen.
7. Gjennomfør kodeaudit før visuell godkjenning.

## 4. Senere faser

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
- oppdatering av alle brukere av en farge
- tekstfarge kobles hit, ikke til fase 8

### Fase 12 – Logo og header

Branch: `feature/logo-header`

- logo
- header
- hovedtekst og undertittel
- redigerbar struktur
- headertekst er ikke en vanlig fri tekstboks

### Fase 13 – Korrigeringslinjer

Branch: `feature/alignment-guides`

- horisontal midtstilling
- samme linje og lik avstand
- bare under flytting eller resizing
- ingen automatisk kollisjonsunngåelse

### Fase 14 – Responsiv redigering

Branch: `feature/mobile-design-controls`

- desktop er grunnlaget
- mobil arver desktop som standard
- eksplisitte mobiloverstyringer for posisjon, størrelse og synlighet
- mobilendring påvirker ikke desktop
- **Bruk PC-oppsett** fjerner mobiloverstyringen

### Fase 15 – Angre og gjør om

Branch: `feature/history-system`

- eksplisitt prosjektendringsmodell
- én historikkpost per avsluttet brukerhandling
- transient markering, draft, panelstate og preview holdes utenfor

### Fase 16 – Lokal automatisk lagring

Branch: `feature/local-project-autosave`

- prosjektmappe og lokale bilder
- sikker automatisk lagring
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
- alle nye kildefiler er under 250 linjer
- transient og varig state er tydelig separert
- ingen direkte DOM-lagring eller prosjektmutasjon
- `npm run check` er bestått etter siste produksjonskodeendring
- arkitekturrapporter er oppdatert
- relevant visuell og interaksjonsmessig kontroll er godkjent
- dokumentasjonen beskriver faktisk kode
- working tree er clean og branch er synkronisert
- merge krever eksplisitt godkjenning
