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

## 3. Gjeldende fase

### Fase 4 – Flytting og størrelsesendring

Branch:

```text
feature/drag-resize
```

Status: **implementert og visuelt godkjent på desktop og mobil før siste audit; auditendringer må sluttkontrolleres før PR**.

Implementert:

- flytting med peker
- størrelsesendring fra ett firkantet håndtak nederst til høyre
- minimumsstørrelser per elementtype
- venstre, høyre og øvre lerretsgrense
- fri bevegelse nedover med automatisk lerretsvekst
- edge-scroll nær editorområdets kanter
- innhold klippes av elementgrensen
- fri overlapping
- transient layout-preview under pekerbevegelse
- én varig prosjektmutasjon ved normalt pekerslipp
- avbrudd uten commit ved `pointercancel`
- PC- og Telefon-visning med delt desktopgeometri

Minimumsmål:

- Seksjon: 160 × 90 px
- Bilde: 120 × 80 px
- Tekst: 120 × 48 px
- Knapp: 80 × 36 px

Audit-herding:

- tapt pointer capture rydder interaksjonen uten commit
- låste elementer kan markeres, men ikke flyttes eller resizes
- reduceren avviser layoutmutasjon av låste eller ukjente elementer
- uendrede og ugyldige layouts ignoreres
- minimumsmål returneres som kopi
- preview-typen har én autoritativ definisjon
- resize-håndtaket har 32 × 32 px treffflate
- piltaster flytter 1 px
- `Shift` + piltast flytter 10 px
- `Ctrl`/`Cmd` + piltast endrer størrelse

Branchen inneholder ikke:

- automatisk kollisjonsunngåelse
- automatisk flytting av andre elementer
- korrigeringslinjer
- låseknapp eller låsepanel
- direkte tekstredigering
- bildebeskjæring
- historikk
- lagring
- egne mobiloverstyringer

Varige regler:

- peker-preview er transient og skal ikke lagres eller inngå direkte i historikk
- én ferdig pekertransform skal senere være én historikk-/autolagringsendring
- låste elementer skal fortsatt kunne markeres for senere opplåsing
- mobiloverstyringer skal bygges eksplisitt i egen fase

Se `docs/DRAG_RESIZE.md`.

## 4. Neste fase etter merge

### Fase 5 – Låsing

Planlagt branch:

```text
feature/object-locking
```

Skal bygge:

- synlig lås/lås opp for valgt element
- varig endring av `locked` gjennom reduceren
- blokkere peker- og tastaturtransform når låst
- fortsatt tillate markering av låst element
- tydelig visuell låsetilstand
- desktop- og mobiltest

Skal ikke bygge:

- tekstredigering
- bildeimport
- lagpanel
- sletting
- historikk
- lagring

Før implementering må plassering og utforming av låsekontrollen fastsettes.

## 5. Senere faser

### Fase 6 – Tekst og fonts

Branch: `feature/text-box-editing`

- direkte tekstredigering
- skille mellom elementmarkering og innholdsredigering
- nettsikre fonter
- fontstørrelse, farge, fet og kursiv

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

- desktop-arv
- mobiloverstyringer
- skjul på mobil
- viewport-bevisste layout-actions
- media queries fra prosjektmodellen

### Fase 13 – Angre og gjør om

Branch: `feature/history-system`

- prosjektendringsmodell
- angre og gjør om
- pekertransform som én historikkpost
- vurder sammenslåing av gjentatte tastaturendringer
- transient markering og preview holdes utenfor

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
- ugyldige og uendrede state-overganger avvises
- tastaturalternativ finnes der draing ellers er eneste handling
- `npm run check` er bestått etter siste kodeendring
- arkitekturrapporter er regenerert
- desktop og mobil er testet
- peker og tastatur er testet
- dokumentasjonen er oppdatert
- arbeidsområdet er rent
- lokal branch er synkronisert med GitHub

## 7. Neste kontrollsteg

På `feature/drag-resize`:

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
npm run dev
git status
```

Etter bestått kontroll, oppdaterte rapporter, godkjent regresjon og rent arbeidsområde kan det opprettes en kontrollert PR mot `main`.
