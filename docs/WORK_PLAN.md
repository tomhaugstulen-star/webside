# Arbeidsplan for Website-editoren

Dette dokumentet fastsetter rekkefølgen for videre utvikling. Det utvikles aldri direkte på `main`.

## 1. Fast arbeidsflyt

For hver avgrensede del:

1. Kontroller at arbeidsområdet er rent.
2. Oppdater lokal `main`.
3. Merge forrige godkjente branch dersom det gjenstår.
4. Kjør `npm run check` på oppdatert `main`.
5. Opprett neste branch fra oppdatert `main`.
6. Definer nøyaktig omfang, brukerhandlinger, state og berørte filer.
7. Bygg bare den avgrensede funksjonen.
8. Kontroller ansvarsdeling fortløpende og begynn uttrekking før en kildefil passerer 250 linjer.
9. Kjør `npm run check`.
10. Regenerer arkitekturrapporter ved strukturendringer.
11. Test desktop og mobil der det er relevant.
12. Fjern alle midlertidige test-fixtures.
13. Gjennomfør framtidsrettet kodeaudit.
14. Oppdater dokumentasjonen.
15. Opprett draft-PR ved behov.
16. Merge først etter eksplisitt godkjenning.

## 2. Ferdige og mergede faser

### Fase 0 – Stabilt editorgrunnlag

Status: **ferdig, godkjent og merget til `main`**.

Inneholder:

- blankt lerret
- toppmeny og venstremeny
- desktop- og mobilvisning
- kontrollert paneloppførsel
- Elementer-panel
- delt CSS- og komponentstruktur
- Dependency Cruiser
- samlet `npm run check`
- automatisk åpning av nettleseren

### Fase 1 – Prosjekt- og elementmodell

Branch: `feature/element-model`

Status: **ferdig, godkjent og merget til `main`**.

Inneholder:

- prosjekt med skjemaversjon, ID, navn og tidsstempler
- sider med ID, navn, slug og elementliste
- elementtypene seksjon, bilde, tekst og knapp
- responsive verdier for posisjon, størrelse og synlighet
- låsestatus
- kryptografiske stabile ID-er
- sentral prosjekt-state med provider og reducer
- aktiv side fra prosjektmodellen
- blankt prosjekt med siden `Forside`

### Fase 2 – Markering av elementer

Branch: `feature/element-selection`

Status: **ferdig, godkjent og merget til `main`**.

Inneholder:

- `selectedElementId` i transient editor-state
- valg av ett eksisterende element på aktiv side
- tydelig valgt, hover- og fokusert tilstand
- klikk på tomt lerret fjerner markeringen
- Enter og mellomrom markerer fokusert element
- eget `useElementSelection`-API
- nullstilling ved prosjekt- og sidebytte
- nullstilling når valgt element ikke finnes
- ugyldige markeringsforespørsler ignoreres
- responsive verdier brukes i lerretsrenderingen

Varig regel:

- `selectedElementId` skal ikke lagres, eksporteres, publiseres eller inngå i historikk/autolagring.

Se `docs/ELEMENT_SELECTION.md`.

## 3. Gjeldende fase

### Fase 3 – Opprette elementer

Branch:

```text
feature/element-creation
```

Status: **implementert og visuelt godkjent på desktop og mobil; siste audit-endringer må sluttkontrolleres før PR**.

Implementert:

- opprette Seksjon, Bilde, Tekst og Knapp fra Elementer-panelet
- sikker kryptografisk element-ID
- legge element til aktiv side i prosjektmodellen
- oppdatere prosjektets `updatedAt`
- automatisk markere nyopprettet element
- lukke Elementer-panelet etter oppretting
- bevare blank side før første eksplisitte brukerhandling
- kontrollerte standardstørrelser
- første ledige vertikale startplass med 16 px avstand
- ingen direkte overlapping ved oppretting
- automatisk utvidelse av lerretshøyden
- mobilvisning arver desktopverdier
- tastaturtilgjengelige elementkort

Audit-herding:

- state-avhengig oppretting beregnes i reduceren fra nyeste state
- UI-hooken sender bare brukerintensjon, sikker ID og tidspunkt
- raske eller batchede handlinger kan ikke bruke en gammel elementliste
- plasseringsalgoritmen bruker sorterte vertikale intervaller fremfor kvadratisk kandidatsøk
- responsive viewport-typer har én autoritativ definisjon
- `EditorTool` håndteres uttømmende av TypeScript
- sidebar-CSS er delt etter ansvar før videre vekst

Branchen inneholder ikke:

- draing
- størrelsesendring
- sletting
- låsing eller opplåsing
- direkte tekstredigering
- bildevelger eller ekte bildeinnhold
- knapphandling eller lenke
- farger
- historikk
- lagring

Varige regler:

- opprettingsplassering gjelder bare elementets fødested
- eksisterende elementer flyttes aldri automatisk
- fri overlapping skal fortsatt være mulig når draing bygges
- plassering skal ikke utvikles til et generelt kollisjonssystem
- høyden på lerretet er avledet visning og skal ikke lagres i prosjektfilen
- oppretting er desktop-autoritativ frem til full responsiv redigering bygges

Se `docs/ELEMENT_CREATION.md`.

## 4. Neste fase etter merge

### Fase 4 – Flytting og størrelsesendring

Planlagt branch:

```text
feature/drag-resize
```

Skal bygge:

- flytte valgt element med peker
- kontrollert scrolling under flytting dersom nødvendig
- ett tydelig, firkantet håndtak nederst til høyre
- størrelsesendring fra håndtaket
- minimumsstørrelser per elementtype
- klipping av innhold utenfor elementets grenser
- prosjektmutasjoner gjennom reducer-actions
- støtte desktop og mobil uten å bygge full mobiloverstyring
- tastatur- og tilgjengelighetsvurdering for objektverktøy

Skal ikke bygge:

- automatisk kollisjonsunngåelse
- automatisk flytting av andre elementer
- korrigeringslinjer
- låsing
- direkte tekstredigering
- bildebeskjæring
- historikk
- lagring

Før implementering må dette fastsettes:

- minimumsbredde og minimumshøyde per elementtype
- om elementer kan flyttes delvis utenfor lerretet
- hvordan pekerfangst og scrolling skal samvirke
- hvordan mobilmodus håndteres før egne mobiloverstyringer finnes

## 5. Senere faser

### Fase 5 – Låsing

Branch: `feature/object-locking`

- lås og lås opp valgt objekt
- blokkere flytting og størrelsesendring når låst

### Fase 6 – Tekst og fonts

Branch: `feature/text-box-editing`

- direkte tekstredigering
- klart skille mellom elementmarkering og innholdsredigering
- nettsikre fonter
- fontstørrelse, farge, fet og kursiv

### Fase 7 – Knapper

Branch: `feature/button-element`

- redigerbar knappetekst
- størrelse, plassering, farger og ramme
- handling eller lenketype avklares før implementering
- knapphandling skal ikke aktiveres i vanlig editor-markeringsmodus

### Fase 8 – Bilder

Branch: `feature/image-import-and-placement`

- bildevelger
- lokal prosjektfil
- selvstendig bildeobjekt
- fri plassering og størrelse

### Fase 9 – Farger

Branch: `feature/project-colors`

- register over faktiske prosjektfarger
- global endring
- oppdatering av alle brukere av fargen

### Fase 10 – Logo og header

Branch: `feature/logo-header`

- logo
- automatisk header
- hovedtekst og undertittel
- redigerbar struktur

### Fase 11 – Korrigeringslinjer

Branch: `feature/alignment-guides`

- horisontal midtstilling
- samme linje
- lik avstand mellom tre eller flere elementer
- bare under flytting eller størrelsesendring
- ingen vertikal sentreringsfunksjon
- ingen automatisk kollisjonsunngåelse

### Fase 12 – Responsiv redigering

Branch: `feature/mobile-design-controls`

- desktop-arv
- mobiloverstyringer
- skjul på mobil
- avklare markering av element som er skjult i aktiv visning
- viewport-bevisst oppretting
- media queries fra prosjektmodellen

### Fase 13 – Angre og gjør om

Branch: `feature/history-system`

- definert prosjektendringsmodell
- angre og gjør om
- oppretting, flytting og størrelse som prosjektendringer
- markeringsstate skal ikke inngå i historikken

### Fase 14 – Lokal automatisk lagring

Branch: `feature/local-project-autosave`

- velge prosjektmappe
- automatisk sikker lagring
- lokale bilder
- `Lagrer`, `Lagret` og `Lagringsfeil`
- gjenoppretting
- transient markeringsstate skal ikke lagres

### Fase 15 – Åpne og importere prosjekt

Branch: `feature/project-open-import`

- åpne eksisterende prosjektmappe
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
- ingen midlertidig fixture eller testinnhold ligger igjen
- ingen fil har flere uklare ansvarsområder
- ved 250 linjer er ansvar allerede begynt trukket ut i egne moduler
- filer over 250 linjer har en konkret, dokumentert begrunnelse og plan for videre deling
- filer ved eller over 300 linjer krever eksplisitt teknisk gjennomgang og skal være et unntak
- state-avhengige prosjektberegninger bruker nyeste reducer-state
- union-baserte switcher er uttømmende
- `npm run check` er bestått etter siste kodeendring
- arkitekturrapportene er regenerert etter siste strukturendring
- desktop og mobil er testet der relevant
- dokumentasjonen er oppdatert
- lokalt arbeidsområde er rent
- lokal branch er synkronisert med GitHub

## 7. Neste kontrollsteg

På `feature/element-creation`:

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
npm run dev
git status
```

Etter bestått kontroll, oppdaterte rapporter, godkjent visuell regresjon og rent arbeidsområde kan det opprettes en kontrollert draft-PR mot `main`.
