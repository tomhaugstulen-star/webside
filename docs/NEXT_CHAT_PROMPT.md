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
7. `docs/ELEMENT_CREATION.md`
8. `docs/RESPONSIVE_DESIGN.md`
9. `docs/CODE_AUDIT.md`
10. `README.md`

Les deretter den faktiske koden, spesielt:

```text
src/model/editorProject.ts
src/model/createStableId.ts
src/model/createEditorProject.ts
src/model/createEditorElement.ts
src/model/findElementCreationPosition.ts
src/model/resolveResponsiveValue.ts
src/state/EditorProjectProvider.tsx
src/state/editorProjectReducer.ts
src/state/useEditorProject.ts
src/state/useElementSelection.ts
src/state/useElementCreation.ts
src/components/editor/EditorShell.tsx
src/components/canvas/EditorCanvas.tsx
src/components/canvas/EditorCanvasElement.tsx
src/components/canvas/getCanvasContentHeight.ts
src/components/sidebar/LeftSidebar.tsx
src/components/sidebar/SidebarPanels.tsx
src/styles/canvas.css
src/styles/sidebar.css
src/styles/sidebar-content.css
```

Repoet og dokumentasjonen er kilden til sannhet. Ikke stol på en eldre chatoppsummering dersom den avviker fra repoet.

## Ferdig og merget til `main`

- stabilt React/TypeScript/Vite-grunnlag
- blankt desktop- og mobillerret
- toppmeny og venstremeny
- kontrollert åpning og lukking av paneler
- Elementer-panel med Seksjon, Bilde, Tekst og Knapp
- Dependency Cruiser og samlet `npm run check`
- automatisk nettleseråpning
- prosjekt- og elementmodell
- skjemaversjon og kryptografiske stabile ID-er
- sider og elementtypene `section`, `image`, `text` og `button`
- responsive posisjons-, størrelses- og synlighetsverdier
- sentral prosjekt-state og aktiv side
- nye prosjekter starter blankt med `Forside`
- markering av eksisterende elementer
- transient `selectedElementId`
- klikk på tomt lerret fjerner markering
- tastaturmarkering med Tab, Enter og mellomrom
- validerte og uttømmende markerings-actions

## Gjeldende branch

```text
feature/element-creation
```

Branchen er implementert og visuelt godkjent på desktop og mobil.

Implementert:

- opprette Seksjon, Bilde, Tekst og Knapp fra Elementer-panelet
- sikker element-ID
- legge nytt element til aktiv side i `EditorProject`
- oppdatere `updatedAt`
- automatisk markere det nye elementet
- lukke Elementer-panelet etter oppretting
- kontrollerte standardstørrelser
- første ledige vertikale startplass med 16 px avstand
- ingen direkte overlapping ved oppretting
- automatisk utvidelse av lerretshøyden
- mobil arver desktopverdier
- blank startside før brukeren oppretter noe
- nøytrale editorrepresentasjoner for alle fire elementtypene
- sidebar-CSS delt etter ansvar

Visuelt bekreftet av brukeren:

- alle fire elementtypene opprettes
- det sist opprettede elementet markeres
- klikk på tomt lerret fjerner markering
- elementene opprettes uten direkte overlapping
- lerretet forlenges og scroller
- nederste element blir ikke klippet
- mobilvisningen fungerer og forlenges
- omlasting gir blank side fordi lagring ikke er implementert

## Siste kodeaudit

Etter den visuelle godkjenningen ble disse framtidsrisikoene rettet:

1. **Utdatert React-snapshot ved oppretting**
   - Hooken genererer bare ID, tidspunkt og brukerintensjon.
   - Reduceren oppretter elementet fra den nyeste aktive siden.
   - Raske eller batchede opprettinger kan derfor ikke beregne samme plass fra gammel state.

2. **Unødvendig kvadratisk plasseringssøk**
   - Plassering bruker nå sorterte vertikale intervaller i en mobiltrygg venstrekolonne.
   - Første ledige gap brukes.
   - Dette gjelder bare fødestedet; det er ikke kollisjonskontroll for draing.

3. **Duplisert viewport-type**
   - `ResponsiveViewport` er definert én gang i prosjektmodellen.
   - `ViewportMode` er et UI-alias til samme type.

4. **Manglende uttømmende menyhåndtering**
   - Nye `EditorTool`-verdier gir TypeScript-feil dersom panelet ikke håndteres.

Disse siste audit-endringene er ikke sluttkontrollert lokalt ennå.

## Kritiske arkitekturgrenser

### Prosjektmutasjoner

- `EditorProject` er autoritativ kilde for varige prosjektdata.
- State-avhengige beregninger skal bruke reducerens nyeste state.
- UI-hooks skal ikke beregne varig prosjektresultat fra et mulig gammelt React-snapshot.
- Reduceren skal være deterministisk; ID og klokkeslett genereres før dispatch.

### Transient state

`selectedElementId` skal ikke:

- lagres i prosjektfilen
- inngå i historikk
- utløse autolagring
- eksporteres
- publiseres

### Opprettingsplassering

- gjelder bare startposisjonen
- flytter aldri eksisterende elementer
- skal ikke brukes til å blokkere draing
- fri overlapping skal være mulig etter at flytting bygges
- er foreløpig desktop-autoritativ; mobil arver desktop

### Filansvar

- 250 linjer er aktiv terskel for å begynne uttrekking av kildekodeansvar.
- Del tidligere dersom filen får flere tydelige ansvar.
- 300 linjer er en eksplisitt unntaksgrense.
- Del etter ansvar, ikke tilfeldig linjetall.

## Første oppgave i neste chat

Kontroller først lokal branch og arbeidsområde:

```powershell
cd C:\Users\tomha\Desktop\website
git status
git branch --show-current
git fetch origin
git log --oneline origin/feature/element-creation..HEAD
```

Forventet aktiv branch før PR er:

```text
feature/element-creation
```

Dersom ingen lokale upushede commits vises, hent siste audit- og dokumentendringer:

```powershell
cd C:\Users\tomha\Desktop\website
git pull --ff-only origin feature/element-creation

npm run check
npm run architecture:json
npm run architecture:diagram
npm run dev
```

Kjør en kort visuell regresjonskontroll:

- siden starter blank
- opprett Seksjon, Bilde, Tekst og Knapp
- elementene ligger med avstand og uten direkte overlapping
- det sist opprettede elementet markeres
- klikk på tomt lerret fjerner markering
- lerretet forlenges ved behov
- desktop og mobil fungerer
- omlasting gir blank side

Stopp serveren med `Ctrl + C` og kjør:

```powershell
git status
```

Arkitekturrapportene må regenereres fordi audit-endringene endret avhengigheter. Dersom bare rapportene er endret:

```powershell
git add architecture.json
git add docs/dependency-graph.mmd
git commit -m "chore: refresh architecture reports after element creation audit"
git push origin feature/element-creation
git status
```

Ikke påstå at sluttkontrollen er bestått før brukeren har limt inn resultatet og bekreftet rent arbeidsområde.

## PR og merge

Når sluttkontrollen er bestått, rapportene er oppdatert og arbeidsområdet er rent:

1. Gjennomgå branchdiffen mot `main`.
2. Opprett en draft-PR mot `main`.
3. Dokumenter omfang, audit-herding og kontrollstatus.
4. Marker PR-en klar først etter eksplisitt brukergodkjenning.
5. Merge med forventet head-SHA, slik at en flyttet branch ikke kan merges ved en feil.
6. Kontroller oppdatert `main` lokalt med `npm run check`.

Ikke slett branch før oppdatert `main` er bekreftet.

## Neste planlagte branch

Etter godkjent merge:

```text
feature/drag-resize
```

Den opprettes fra oppdatert og kontrollert `main`.

Skal bygge:

- flytting av valgt element
- ett firkantet håndtak nederst til høyre
- størrelsesendring
- minimumsstørrelser
- klipping av innhold
- scrolling under interaksjon dersom nødvendig
- prosjektmutasjoner gjennom reducer-actions

Skal ikke bygge:

- automatisk kollisjonsunngåelse
- automatisk flytting av andre elementer
- korrigeringslinjer
- låsing
- tekstredigering
- bildebeskjæring
- historikk
- lagring

Før implementering må brukeren og utviklingsansvarlig fastsette minimumsstørrelser, lerretsgrenser og scrolling under drag.

## Kommunikasjonsregler

- svar på norsk
- vær direkte og presis
- bruk GitHub-connectoren til repoarbeid
- gi alltid nøyaktige PowerShell-kommandoer etter repoendringer
- ikke gi kommandoer for scripts som ikke finnes
- ikke bland neste fase med senere funksjoner
- ikke finn på åpne produktavgjørelser
- ikke merge uten eksplisitt godkjenning

---
