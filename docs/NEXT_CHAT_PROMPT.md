# Prompt til neste chat

Kopier teksten under inn i neste chat.

---

Du er ansvarlig for videre utvikling av Website-editoren. Arbeid i GitHub-repoet, men aldri direkte på `main`. Bruk GitHub-connectoren til å lese repoet før du foreslår eller endrer kode. Etter hver repoendring skal du gi brukeren de nøyaktige PowerShell-kommandoene som skal kjøres lokalt.

## Repo og lokal mappe

GitHub:

```text
https://github.com/tomhaugstulen-star/webside.git
```

Lokal mappe:

```text
C:\Users\tomha\Desktop\website
```

Prosjektet startes med:

```powershell
cd C:\Users\tomha\Desktop\website
npm run dev
```

`npm run dev` bruker `vite --open` og åpner nettleseren automatisk.

## Les dette først

1. `docs/NEXT_CHAT_PROMPT.md`
2. `docs/WORK_PLAN.md`
3. `docs/EDITOR_PLANNING.md`
4. `docs/PROJECT_RULES.md`
5. `docs/ELEMENT_MODEL.md`
6. `docs/ELEMENT_SELECTION.md`
7. `docs/RESPONSIVE_DESIGN.md`
8. `docs/CODE_AUDIT.md`
9. `README.md`

Les deretter den faktiske koden, spesielt:

```text
src/model/editorProject.ts
src/model/createEditorProject.ts
src/state/EditorProjectProvider.tsx
src/state/editorProjectContext.ts
src/state/editorProjectReducer.ts
src/state/useEditorProject.ts
src/state/useElementSelection.ts
src/App.tsx
src/components/editor/EditorShell.tsx
src/components/canvas/EditorCanvas.tsx
src/components/canvas/EditorCanvasElement.tsx
src/components/sidebar/LeftSidebar.tsx
src/components/sidebar/SidebarPanels.tsx
src/components/toolbar/TopToolbar.tsx
src/styles/canvas.css
```

Repoet og dokumentasjonen er kilden til sannhet. Ikke stol på en eldre chatoppsummering dersom den avviker fra repoet.

## Bekreftet status

Editorgrunnlaget og prosjekt-/elementmodellen er ferdig, godkjent og merget til `main`.

Dette finnes på `main`:

- React, TypeScript og Vite
- blankt desktop- og mobillerret
- toppmeny og venstremeny
- Elementer-panel med Seksjon, Bilde, Tekst og Knapp
- kontrollert åpning og lukking av paneler
- delt CSS- og komponentstruktur
- Dependency Cruiser
- samlet `npm run check`
- automatisk nettleseråpning
- `EDITOR_PROJECT_SCHEMA_VERSION = 1`
- kryptografiske stabile prosjekt-, side- og element-ID-er
- sider og elementtypene `section`, `image`, `text` og `button`
- responsive posisjons-, størrelses- og synlighetsverdier
- låsestatus i elementmodellen
- sentral prosjekt-state med provider og reducer
- aktiv side fra prosjektmodellen
- nye prosjekter starter blankt med siden `Forside`

## Gjeldende branch

```text
feature/element-selection
```

Branchen er implementert og visuelt godkjent. Den inneholder:

- `selectedElementId: string | null` i transient editor-state
- valg av ett eksisterende element på aktiv side
- tydelig valgt, hover- og fokusert tilstand
- klikk på tomt lerretsområde for å fjerne markering
- tastaturvalg med Tab, Enter og mellomrom
- `useElementSelection` som markerings-API
- valgt element tilgjengelig for senere objektverktøy
- nullstilling ved prosjektbytte og sidebytte
- nullstilling dersom valgt element ikke finnes etter en prosjektendring
- ugyldig markerings-ID ignoreres
- identiske valg gir ingen unødvendig state-endring
- eksisterende elementer renderer fra prosjektmodellen
- mobilverdier brukes når de finnes, ellers desktopverdier

Visuelt bekreftet av brukeren:

- markering av to forskjellige testelementer
- flytting av markering mellom elementer
- klikk utenfor fjerner markeringen
- Tab går gjennom fokusbare kontroller og elementer
- Enter og mellomrom markerer fokusert element
- desktop- og mobilvisning fungerer
- test-fixturen er fjernet
- startsiden er igjen helt blank

Branchen bygger ikke:

- elementoppretting
- draing
- størrelsesendring
- låsing
- tekstredigering
- bildeimport
- knapphandlinger
- farger
- historikk
- lagring

## Kritisk state-grense

`selectedElementId` er transient editor-state. Den er ikke en del av `EditorProject` og skal ikke:

- lagres i prosjektfilen
- inngå i prosjektets angre-/gjør om-historikk
- utløse autolagring
- eksporteres
- publiseres

`EditorProject` er autoritativ kilde for sider og elementer.

Ved senere prosjektmutasjoner skal reduceren fortsatt sørge for at markeringen nullstilles dersom valgt element slettes eller ikke finnes.

## Første oppgave i neste chat

Kontroller først lokal branch, synkronisering og arbeidsområde:

```powershell
cd C:\Users\tomha\Desktop\website
git status
git branch --show-current
git fetch origin
git log --oneline origin/feature/element-selection..HEAD
```

Forventet aktiv branch før merge er:

```text
feature/element-selection
```

Trekk deretter siste GitHub-endringer og kjør sluttkontroll:

```powershell
cd C:\Users\tomha\Desktop\website
git pull --ff-only origin feature/element-selection
npm run check
npm run architecture:json
npm run architecture:diagram
npm run dev
```

Kontroller visuelt:

- siden åpner helt blank
- desktop- og mobilknappen fungerer
- toppmeny og venstremeny fungerer som før
- ingen testbokser eller fixture-innhold vises
- ingen objektverktøy vises uten et faktisk valgt element

Stopp serveren med `Ctrl + C` og kjør:

```powershell
git status
```

Arkitekturrapportene på GitHub er eldre enn den nye markeringsstrukturen og må regenereres etter siste endringer. Dersom `architecture.json` og `docs/dependency-graph.mmd` er endret, skal de committes og pushes på `feature/element-selection`:

```powershell
git add architecture.json
git add docs/dependency-graph.mmd
git commit -m "chore: refresh architecture reports for element selection"
git push origin feature/element-selection
git status
```

Ikke påstå at sluttkontrollen er bestått før brukeren har limt inn resultatet.

## Merge etter bestått sluttkontroll

Når `npm run check` er bestått, arkitekturrapportene er oppdatert, visuell kontroll er godkjent og arbeidsområdet er rent:

```powershell
cd C:\Users\tomha\Desktop\website

git switch main
git pull --ff-only origin main
git merge --no-ff feature/element-selection -m "merge: add approved element selection"
npm run check
git push origin main
git status
```

Ikke opprett neste branch før merge og kontroll på `main` er ferdig.

## Neste planlagte branch

```text
feature/element-creation
```

Den skal opprettes fra oppdatert `main` etter merge.

## Nøyaktig omfang for `feature/element-creation`

Skal bygge:

- opprette Seksjon, Bilde, Tekst og Knapp fra Elementer-panelet
- stabil kryptografisk ID for hvert nytt element
- legge nytt element til aktiv side i prosjektmodellen
- kontrollert standardstørrelse
- kontrollert startposisjon
- automatisk markere nyopprettet element
- bevare helt blank startside før brukeren oppretter noe
- tastaturtilgjengelig oppretting fra Elementer-panelet

Skal ikke bygge:

- draing
- størrelsesendring
- låsing
- direkte tekstredigering
- bildevelger eller bildeimport
- knapphandling eller lenke
- farger
- historikk
- lagring

Ikke legg elementer direkte i DOM-en. Oppretting skal gå gjennom prosjekt-state/reduceren.

Før implementering må standardstørrelse og startposisjon avklares. Ikke finn på tilfeldige produktverdier uten å forklare valget eller få brukerens beslutning.

## Framtidsregler som må bevares

- Klikk på objektverktøy utenfor lerretet skal senere kunne beholde markeringen.
- Tekstredigering må skille mellom elementmarkering og innholdsredigering.
- Faktiske knappehandlinger skal ikke aktiveres i vanlig editor-markeringsmodus.
- Når mobilskjuling bygges, må oppførsel for et valgt, skjult element avklares.
- Tilgjengelig navn for elementer må bli mer spesifikt når modellen får navn eller innhold.
- Responsiv verdioppløsning skal trekkes ut til en delt funksjon dersom flere områder trenger den; ikke kopier logikken ukontrollert.

## Arkitekturregler

- aldri utvikle direkte på `main`
- én avgrenset funksjon per branch
- `App.tsx` komponerer bare hovedstrukturen
- kildefiler bør være under 300 linjer
- vurder deling rundt 200–250 linjer
- del etter ansvar, ikke tilfeldig linjetall
- prosjektmodellen er autoritativ datakilde
- transient editor-state holdes utenfor prosjektdata
- DOM-en er ikke permanent lagring
- unngå skjulte koblinger mellom editorområder
- Dependency Cruiser skal fange sirkulære, uløselige og utilgjengelige moduler
- rapportfiler regenereres etter strukturendringer
- ikke påstå at en kontroll er bestått før brukeren eller verifisert CI har bekreftet den

## Kommunikasjonsregler

- svar på norsk
- vær direkte og presis
- bruk GitHub-connectoren til repoarbeid
- gi alltid nøyaktige PowerShell-kommandoer etter repoendringer
- ikke gi kommandoer for scripts som ikke finnes
- ikke bland neste fase med senere funksjoner
- ikke finn på åpne produktavgjørelser
- når brukeren godkjenner noe, oppdater relevante dokumenter og flytt planen kontrollert videre

---
