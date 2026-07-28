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
8. Kontroller ansvarsdeling fortløpende og begynn uttrekking før en fil passerer 250 linjer.
9. Kjør `npm run check`.
10. Regenerer arkitekturrapporter ved strukturendringer.
11. Test desktop og mobil der det er relevant.
12. Fjern alle midlertidige test-fixtures.
13. Oppdater dokumentasjonen.
14. Merge først etter eksplisitt godkjenning.

## 2. Ferdige faser

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

## 3. Gjeldende fase

### Fase 2 – Markering av elementer

Branch:

```text
feature/element-selection
```

Status: **implementert og visuelt godkjent; siste kode- og dokumentendringer må kontrolleres før merge**.

Implementert:

- `selectedElementId` i transient editor-state
- valg av ett eksisterende element på aktiv side
- tydelig valgt, hover- og fokusert tilstand
- klikk på tomt lerretsområde fjerner markeringen
- Enter og mellomrom markerer fokusert element
- eget `useElementSelection`-API
- automatisk nullstilling når valgt element ikke finnes
- nullstilling ved prosjektbytte og sidebytte
- ugyldige markeringsforespørsler ignoreres
- identiske valg gir ingen unødvendig state-endring
- eksisterende elementer renderer fra prosjektmodellen
- responsive posisjons-, størrelses- og synlighetsverdier brukes

Visuelt godkjent:

- valg av første og andre testelement
- flytting av markering mellom elementer
- klikk utenfor for å fjerne markering
- tastaturvalg med Tab, Enter og mellomrom
- desktop- og mobilvisning
- blank side etter at test-fixturen ble fjernet

Branchen inneholder ikke:

- elementoppretting
- draing
- størrelsesendring
- låsing eller opplåsing
- tekstredigering
- bildeimport
- knapphandlinger
- historikk
- lagring

Varig state-regel:

- `selectedElementId` er transient editor-state og skal ikke lagres i prosjektfil, historikk, autolagring, eksport eller publisering.

Se `docs/ELEMENT_SELECTION.md` for arkitektur- og framtidsregler.

## 4. Neste fase etter merge

### Fase 3 – Opprette elementer

Planlagt branch:

```text
feature/element-creation
```

Skal bygge:

- opprette Seksjon, Bilde, Tekst og Knapp fra Elementer-panelet
- generere stabil kryptografisk element-ID
- legge elementet til aktiv side i prosjektmodellen
- definere kontrollert standardstørrelse og startposisjon
- markere det nyopprettede elementet
- bevare blank startside før brukeren oppretter noe
- støtte desktop og mobil uten å bygge full responsiv redigering
- tastaturtilgjengelig oppretting fra menyen

Skal ikke bygge:

- draing
- størrelsesendring
- låsing
- direkte tekstredigering
- bildevelger
- knapphandlinger
- farger
- historikk
- lagring

Før implementering må standardstørrelse og startposisjon fastsettes kontrollert. Det skal ikke opprettes tilfeldige DOM-elementer; reduceren og prosjektmodellen er autoritative.

## 5. Senere faser

### Fase 4 – Flytting og størrelsesendring

Branch: `feature/drag-resize`

- flytting
- ett firkantet håndtak nederst til høyre
- minimumsstørrelse
- klipping av innhold

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
- media queries fra prosjektmodellen

### Fase 13 – Angre og gjør om

Branch: `feature/history-system`

- definert prosjektendringsmodell
- angre og gjør om
- markeringsstate skal ikke inngå i prosjektets historikk

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
- `npm run check` er bestått etter siste kodeendring
- arkitekturrapportene er regenerert etter siste strukturendring
- desktop og mobil er testet der relevant
- dokumentasjonen er oppdatert
- lokalt arbeidsområde er rent
- lokal branch er synkronisert med GitHub

## 7. Neste kontrollsteg

På `feature/element-selection`:

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
npm run dev
git status
```

Etter bestått kontroll og rent arbeidsområde kan branchen merges kontrollert til `main`. Deretter opprettes `feature/element-creation` fra oppdatert `main`.
