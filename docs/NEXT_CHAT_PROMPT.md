# Prompt til neste chat

Kopier teksten under inn i neste chat.

---

Du er ansvarlig for videre utvikling av Website-editoren. Arbeid direkte i GitHub-repoet, men aldri direkte på `main`. Bruk GitHub-connectoren for å lese og endre repoet. Etter hver repoendring skal du alltid legge ved de nøyaktige PowerShell-kommandoene brukeren skal kjøre lokalt.

## 1. Repo og lokal mappe

GitHub:

```text
https://github.com/tomhaugstulen-star/webside.git
```

Lokal mappe:

```text
C:\Users\tomha\Desktop\website
```

Brukeren kjører prosjektet med:

```powershell
cd C:\Users\tomha\Desktop\website
npm run dev
```

`npm run dev` bruker `vite --open`, så nettleseren skal åpnes automatisk.

## 2. Les dette først

Les disse filene fra `docs/project-planning` før du gjør noe:

1. `docs/NEXT_CHAT_PROMPT.md`
2. `docs/WORK_PLAN.md`
3. `docs/EDITOR_PLANNING.md`
4. `docs/PROJECT_RULES.md`
5. `docs/RESPONSIVE_DESIGN.md`
6. `docs/CODE_AUDIT.md`
7. `README.md`

Les også denne filen fra `feature/element-model`:

```text
docs/ELEMENT_MODEL.md
```

Les deretter den faktiske koden på `feature/element-model`, spesielt:

```text
src/model/editorProject.ts
src/model/createEditorProject.ts
src/state/EditorProjectProvider.tsx
src/state/editorProjectContext.ts
src/state/editorProjectReducer.ts
src/state/useEditorProject.ts
src/App.tsx
src/components/editor/EditorShell.tsx
src/components/toolbar/TopToolbar.tsx
```

Ikke stol på en tidligere chatoppsummering dersom repoet sier noe annet. Repoet og dokumentasjonen er kilden til sannhet.

## 3. Gjeldende status

Editorgrunnlaget er ferdig, kontrollert, visuelt godkjent og merget til `main`.

Dette finnes på `main`:

- React, TypeScript og Vite
- blankt, hvitt desktop- og mobillerret
- toppmeny
- venstremeny
- Elementer-panel med Seksjon, Bilde, Tekst og Knapp
- kontrollert åpning og lukking av paneler
- Escape-lukking
- hovedmeny som lukkes med Escape og klikk utenfor
- delt CSS og komponentstruktur
- ingen ubrukt kildekode fra grunnlaget
- Dependency Cruiser
- `npm run check`
- arkitekturrapporter
- automatisk nettleseråpning ved `npm run dev`

Godkjente kvalitetskontroller for grunnlaget:

- ESLint bestått
- TypeScript bestått
- Dependency Cruiser uten regelbrudd
- produksjonsbuild bestått
- 0 kjente npm-sårbarheter ved siste kontroll

## 4. Gjeldende feature-branch

```text
feature/element-model
```

Denne branchen er ferdig og godkjent lokalt og visuelt.

Den inneholder:

- `EDITOR_PROJECT_SCHEMA_VERSION = 1`
- `ResponsiveValue<T>` med `desktop` og valgfri `mobile`
- `CanvasPosition`
- `ElementSize`
- `ElementKind = 'section' | 'image' | 'text' | 'button'`
- `EditorElement`
- `EditorPage`
- `EditorProject`
- `EditorProjectState`
- stabile kryptografiske UUID-er
- blankt prosjekt med siden `Forside`
- sentral prosjekt-state med provider og reducer
- aktiv side fra prosjektmodellen
- toppmenyen viser aktivt sidenavn

Branchen oppretter ikke synlige elementer og bygger ikke markering, draing, størrelsesendring, tekstredigering eller bildeimport.

Branchen er godkjent, men denne overleveringen bekrefter ikke at brukeren allerede har merget den lokalt etter siste dokumentoppdatering. Første oppgave er derfor å kontrollere dette.

## 5. Første oppgave i neste chat

Start med å få brukeren til å kontrollere aktiv branch og arbeidsområde:

```powershell
cd C:\Users\tomha\Desktop\website
git status
git branch --show-current
```

Dersom `feature/element-model` ikke er merget til `main`, skal du gi disse kommandoene:

```powershell
cd C:\Users\tomha\Desktop\website

git switch feature/element-model
git pull origin feature/element-model
npm run check

git switch main
git pull origin main
git merge --no-ff feature/element-model -m "merge: add approved project and element model"
npm run check
git push origin main
git status
```

Etter merge skal forventet status være rent arbeidsområde på `main`.

Deretter skal neste branch opprettes fra oppdatert `main`:

```text
feature/element-selection
```

Ikke opprett branchen før `feature/element-model` er merget og `main` er kontrollert.

## 6. Nøyaktig omfang for neste branch

`feature/element-selection` skal bare bygge markering av eksisterende elementer.

Skal bygges:

- valgt element-ID i editorens state
- valg av ett eksisterende element
- tydelig valgt tilstand
- klikk utenfor for å fjerne markering
- sikker fjerning av markering dersom valgt element ikke finnes lenger
- grunnlag for senere objektverktøy
- tastaturtilgjengelig valg der det er relevant

Skal ikke bygges:

- elementoppretting
- draing
- størrelsesendring
- låsing eller opplåsing
- tekstredigering
- bildeimport
- knapphandlinger
- farger
- historikk
- lagring

Prosjektet har foreløpig ingen synlige elementer. Ikke legg inn tilfeldig produksjonsinnhold bare for å demonstrere markering. Dersom en kontrollert utviklingsfixture er nødvendig for testing, må den være tydelig avgrenset, dokumentert og fjernes før godkjenning, med mindre brukeren eksplisitt godkjenner noe annet.

## 7. Viktige produktkrav

### Blank side

- En ny side åpner helt blank.
- Ingen ferdige seksjoner, tekst, bilder eller farger.
- Objektverktøy vises først når et faktisk objekt finnes og er valgt.

### Elementer

- Elementer-panelet beholder Seksjon, Bilde, Tekst og Knapp.
- Et element er en boks som senere kan inneholde tekst, bilde eller begge deler.
- Elementer kan overlappe.
- Ingen automatisk kollisjonsunngåelse.

### Størrelsesendring senere

- Ett tydelig, firkantet håndtak nederst til høyre.
- Elementet skal ikke vokse automatisk på grunn av tekst.
- Innhold utenfor elementet klippes.

### Bilder senere

- Bilder er selvstendige objekter.
- Et bilde festes ikke automatisk til boksen det ligger over.
- Flytting av boksen flytter ikke bildet.

### Korrigeringslinjer senere

- horisontal midtstilling
- samme linje
- lik avstand mellom tre eller flere elementer
- bare under flytting eller størrelsesendring
- ingen vertikal sentreringsfunksjon
- ingen skjult automatisk flytting

### Mobil senere

- mobil er en faktisk redigeringsmodus
- mobil kan arve desktopverdier
- mobile overstyringer lagres i prosjektmodellen
- elementer kan skjules på mobil uten å slettes på desktop
- media queries genereres kontrollert ved preview og eksport
- ikke bruk DOM-en som permanent prosjektlagring
- ikke bruk én `<style>` per element
- ikke bruk `!important` som standard

### Lokal lagring senere

- prosjektet lagres i egen mappe på PC
- automatisk lagring
- prosjektdata og bilder i mappen
- `Lagrer`, `Lagret`, `Lagringsfeil`
- sikker skriving og gjenoppretting

## 8. Arkitekturregler

- aldri utvikle direkte på `main`
- én avgrenset funksjon per branch
- `App.tsx` skal bare komponere hovedstrukturen
- kildefiler bør være under 300 linjer
- vurder deling rundt 200–250 linjer
- del etter ansvar, ikke tilfeldig etter linjetall
- prosjektmodellen er autoritativ datakilde
- DOM-en er ikke permanent lagring
- unngå skjulte koblinger mellom editorområder
- Dependency Cruiser skal fange sirkulære, uløselige og utilgjengelige moduler
- ikke påstå at en kontroll er bestått før brukeren har kjørt den eller verifisert CI finnes

## 9. Obligatoriske kontroller

Etter repoendringer skal brukeren normalt kjøre:

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
npm run dev
```

Etter arkitekturrapporter:

```powershell
git status
git add architecture.json
git add docs/dependency-graph.mmd
git commit -m "chore: refresh architecture reports for element selection"
git push origin feature/element-selection
git status
```

Bare bruk rapport-commit dersom filene faktisk er endret.

## 10. Kommunikasjonsregler

- Svar på norsk.
- Vær direkte og presis.
- Ikke bruk CLI-arbeid som brukeren ikke har bedt om uten å forklare nøyaktig hvorfor.
- Bruk GitHub-connectoren for repoendringer.
- Gi alltid PowerShell-kommandoer etter hver repoendring.
- Ikke gi kommandoer for scripts som ikke finnes.
- Ikke bland neste fase med senere funksjoner.
- Ikke finn på produktavgjørelser som står som åpne.
- Når brukeren sier at noe er godkjent, oppdater relevante dokumenter og flytt planen videre kontrollert.

## 11. Åpne beslutninger som ikke skal avgjøres uten brukeren

- plassering av Nytt prosjekt og Importer prosjekt
- plassering av Farger, Logo/header og Fonts
- endelig fontliste og fontstørrelser
- scope for fontendring
- tekstjustering og linjehøyde
- mobile overstyringer i første versjon
- endelig mobilbrytepunkt
- standard- og minimumsstørrelse for element
- fri eller proporsjonal størrelsesendring
- låsefunksjonens plassering
- terskler for korrigeringslinjer
- knappens handlinger og lenketyper
- prosjektfilformat
- lagringsintervall og sikker skrivemetode
- publiseringsarkitektur og eventuell backend

## 12. Mål for første svar i neste chat

Etter å ha lest repoet og dokumentene skal du:

1. bekrefte korrekt status uten å gjette
2. gi PowerShell-kommandoene for å kontrollere eller merge `feature/element-model`
3. forklare at neste branch er `feature/element-selection`
4. ikke begynne på elementoppretting
5. fortsette etter arbeidsplanen

---
