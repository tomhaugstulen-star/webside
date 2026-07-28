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

### Fase 5 – Objektlåsing

Branch: `feature/object-locking`

Status: merget som PR #5 med merge-commit `a3eed45`.

### Fase 6 – Ren tekstredigering

Branch: `feature/text-box-editing`

Status: merget som PR #7 med merge-commit `c729d33`.

- prosjektskjema versjon 2
- `content` bare for tekstobjekter
- kontrollert flerlinjet `textarea`
- blur, submit og cancel med eksplisitte grenser
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
- panelinnhold rendres bare for et gyldig valgt element

Se `docs/RIGHT_PROPERTIES_PANEL.md`.

## 3. Gjeldende fase

### Fase 8 – Tekstegenskaper

```text
branch: feature/text-properties
base main: 8de5f2e
sporing: docs/TEXT_PROPERTIES.md og GitHub-sak #10
```

Fast UX-regel:

```text
Venstremeny = opprette og velge struktur
Høyremeny  = egenskaper for markert element
Lerretet   = redigere selve teksten
```

### Implementert

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

- formateringen gjelder hele tekstboksen
- åtte kontrollerte nettsikre fonter
- kontrollert fontstørrelsesliste fra 12 til 96 px
- venstre, midtstilt og høyre justering
- kontrollerte linjehøyder fra 1.0 til 2.0
- standarden bevarer System, 16 px og 1.45
- tekstfarge er utsatt til prosjektfargesystemet
- tekststil er foreløpig felles for PC og Telefon
- låste tekstelementer kan inspiseres, men kontrollene er deaktivert
- tekstinnhold redigeres fortsatt bare på lerretet
- andre elementtyper åpner høyremenyen uten tekstkontroller

### Modell og state

- prosjektskjema versjon 3
- bare tekstelementer har obligatorisk `textStyle`
- stabile fonttokens lagres i prosjektet
- CSS-fontstacker avledes i visningslaget
- hver reducerhandling endrer én validert stilegenskap
- runtime-validatoren avviser utypede og ødelagte data
- validatorregisteret er uttømmende ved framtidige modellutvidelser
- låste, ugyldige og uendrede overganger avvises
- `updatedAt` endres bare ved reell stilendring
- panelet eier ingen separat stilstate
- visning og `textarea` arver samme stil

### Framtidsrettet audit

Rettede funn:

```text
95dae75  fix: harden text style runtime validation
3d01336  refactor: make text style validation exhaustive
```

`EditorCanvasElement.tsx` er 244 linjer. Den skal ikke få flere nye ansvarsområder; senere canvaslogikk må trekkes ut.

### Sluttkontroll

Brukeren har bekreftet:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 44 moduler, 97 avhengigheter, ingen brudd
produksjonsbuild: bestått
Vite: 54 moduler transformert, bygget på 164 ms
arkitekturrapporter: regenerert
working tree: clean
branch: synkronisert med origin
```

Rapportcommit:

```text
a267ca3  chore: refresh architecture reports for text properties
```

`git diff --check` viste bare LF/CRLF-varsler.

### Visuell godkjenning

- alle tekstkontroller fungerer
- hele tekstboksen endres som avtalt
- låste kontroller er deaktivert
- ikke-tekstelementer viser bare sine generelle elementopplysninger
- den blå markeringsrammen kan forsvinne når fokus flyttes til høyremenyen
- elementet forblir valgt i state, og høyremenyen fortsetter å virke
- denne fokusoppførselen er eksplisitt godkjent

### Gjenstående før PR

1. Hent dokumentasjonscommitene lokalt.
2. Kontroller clean tree på nytt.
3. Sammenlign hele branchen mot `main`.
4. Kontroller at diffen bare inneholder tekstegenskaper, rapporter og relevant dokumentasjon.
5. Opprett draft-PR.
6. Kontroller mergebarhet, review-tråder og eventuell CI.
7. Marker PR klar for review.
8. Merge bare etter eksplisitt godkjenning.

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
- tekstfarge kobles hit

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

### Fase 14 – Responsiv redigering

Branch: `feature/mobile-design-controls`

- desktop er grunnlaget
- mobil arver desktop som standard
- eksplisitte mobiloverstyringer for posisjon, størrelse og synlighet
- **Bruk PC-oppsett** fjerner mobiloverstyringen

### Fase 15 – Angre og gjør om

Branch: `feature/history-system`

- én historikkpost per avsluttet brukerhandling
- transient markering, draft, panelstate og preview holdes utenfor

### Fase 16 – Lokal automatisk lagring

Branch: `feature/local-project-autosave`

- prosjektmappe og lokale bilder
- sikker automatisk lagring og gjenoppretting

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
