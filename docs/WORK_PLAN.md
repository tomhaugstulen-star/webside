# Arbeidsplan for Website-editoren

Dette dokumentet fastsetter rekkefølgen for videre utvikling uten å skrive direkte på `main`.

## 1. Rolle for `main`

- `main` er den stabile integrasjonsbranchen.
- Ingen funksjon utvikles direkte på `main`.
- Godkjent og testet arbeid merges kontrollert til `main`.
- Neste feature-branch opprettes fra oppdatert `main`.
- Dokumentasjon utvikles i `docs/project-planning`.

## 2. Fast arbeidsflyt

For hver del:

1. Kontroller at arbeidsområdet er rent.
2. Oppdater lokal `main`.
3. Merge forrige godkjente branch dersom den ikke allerede er merget.
4. Kjør `npm run check` på oppdatert `main`.
5. Opprett ny branch fra `main`.
6. Beskriv nøyaktig ansvar og berørte filer.
7. Bygg bare den avgrensede funksjonen.
8. Kontroller filstørrelse og ansvarsdeling.
9. Kjør `npm run check`.
10. Regenerer arkitekturrapporter ved strukturendringer.
11. Test visuelt på desktop og mobil der det er relevant.
12. Oppdater dokumentasjonen.
13. Merge først etter godkjenning.

## 3. Gjeldende status

### Fase 0 – Stabilt editorgrunnlag

Status: **ferdig, godkjent og merget til `main`**.

Inneholder:

- blankt lerret
- toppmeny
- venstremeny
- desktop- og mobilvisning
- kontrollert paneloppførsel
- ryddige interne navn for Elementer
- delt CSS og komponentstruktur
- Dependency Cruiser
- automatisk åpning av nettleseren med `npm run dev`

### Fase 1 – Prosjekt- og elementmodell

Branch:

```text
feature/element-model
```

Status: **ferdig og godkjent lokalt og visuelt**.

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

Branchen skal merges til `main` før neste fase starter.

## 4. Neste fase

### Fase 2 – Markering av elementer

Planlagt branch:

```text
feature/element-selection
```

Branchen opprettes først etter at `feature/element-model` er merget til oppdatert `main`.

Omfang:

- lagre valgt element-ID i editor-state
- velge ett eksisterende element
- vise tydelig valgt tilstand
- fjerne markering ved klikk utenfor
- fjerne markering når valgt element ikke lenger finnes
- legge grunnlag for senere objektverktøy
- tastaturtilgjengelig markering der det er relevant

Skal ikke bygges i denne branchen:

- elementoppretting
- draing
- størrelsesendring
- låsing og opplåsing
- tekstredigering
- bildeimport
- knapphandlinger
- historikk
- lagring

Siden prosjektet foreløpig ikke har synlige elementer, skal markeringens state, API og visuelle komponentgrense bygges uten å legge inn tilfeldig produksjonsinnhold. Et kontrollert utviklingselement kan bare brukes dersom det er tydelig avgrenset og fjernes eller dokumenteres før godkjenning.

## 5. Senere faser

### Fase 3 – Opprette elementer

Branch: `feature/element-creation`

- opprette element fra Elementer-panelet
- standardstørrelse og startposisjon
- koble elementet til prosjektmodellen
- beholde Seksjon, Bilde, Tekst og Knapp i menyen

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

- tekstobjekt og direkte redigering
- markering og sletting
- 7–8 nettsikre fonter
- fontstørrelser fra liste
- fontfarge, fet og kursiv

### Fase 7 – Knapper

Branch: `feature/button-element`

- knappobjekt
- redigerbar tekst
- størrelse, plassering, farger og ramme
- handling eller lenketype avklares før implementering

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
- bare visuell veiledning under flytting og størrelsesendring
- ingen vertikal sentreringsfunksjon
- ingen automatisk kollisjonsunngåelse

### Fase 12 – Responsiv redigering

Branch: `feature/mobile-design-controls`

- desktop-arv
- mobiloverstyringer
- skjul på mobil
- media queries fra prosjektmodellen

### Fase 13 – Angre og gjør om

Branch: `feature/history-system`

- definert endringsmodell
- angre og gjør om
- støtte for alle prosjektendringer

### Fase 14 – Lokal automatisk lagring

Branch: `feature/local-project-autosave`

- velge prosjektmappe
- automatisk sikker lagring
- lokale bilder
- statusene `Lagrer`, `Lagret` og `Lagringsfeil`
- gjenoppretting

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

Disse bygges først etter at editor, responsiv modell og lagring er stabile.

## 6. Kontrollpunkter før merge

- branchen inneholder bare avtalt omfang
- ingen fil har for mange ansvarsområder
- filer over 250 linjer er vurdert for deling
- filer ved eller over 300 linjer er eksplisitt gjennomgått
- `npm run check` er bestått
- arkitekturrapporter er oppdatert ved strukturendringer
- desktop og mobil er testet der relevant
- dokumentasjonen er oppdatert
- PowerShell-kommandoer er gitt til brukeren

## 7. Første oppgave i neste chat

1. Les `docs/NEXT_CHAT_PROMPT.md`.
2. Kontroller om `feature/element-model` allerede er merget.
3. Merge den godkjente branchen til `main` dersom det gjenstår.
4. Kjør kontroll på `main`.
5. Opprett `feature/element-selection` fra oppdatert `main`.
6. Ikke bygg elementoppretting i samme branch.