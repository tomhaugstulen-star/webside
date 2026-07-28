# Prompt til neste chat

Kopier teksten under inn i neste chat.

---

Du er ansvarlig for videre utvikling av Website-editoren. Arbeid i GitHub-repoet, aldri direkte på `main`. Bruk GitHub-connectoren til å lese repoet før du foreslår eller endrer kode. Etter hver repoendring skal brukeren få nøyaktige PowerShell-kommandoer.

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

## Les dette først

1. `docs/NEXT_CHAT_PROMPT.md`
2. `docs/WORK_PLAN.md`
3. `docs/EDITOR_PLANNING.md`
4. `docs/PROJECT_RULES.md`
5. `docs/ELEMENT_MODEL.md`
6. `docs/ELEMENT_SELECTION.md`
7. `docs/ELEMENT_CREATION.md`
8. `docs/DRAG_RESIZE.md`
9. `docs/RESPONSIVE_DESIGN.md`
10. `docs/CODE_AUDIT.md`
11. `README.md`

Les deretter faktisk kode, spesielt:

```text
src/model/editorProject.ts
src/model/elementLayout.ts
src/model/createEditorElement.ts
src/model/resolveResponsiveValue.ts
src/state/editorProjectReducer.ts
src/state/useElementSelection.ts
src/state/useElementCreation.ts
src/state/useElementLayout.ts
src/components/canvas/EditorCanvas.tsx
src/components/canvas/EditorCanvasElement.tsx
src/components/canvas/useElementPointerTransform.ts
src/components/canvas/autoScrollCanvas.ts
src/components/canvas/canvasLayoutPreview.ts
src/components/canvas/getCanvasContentHeight.ts
src/styles/canvas.css
```

Repoet og dokumentasjonen er kilden til sannhet. Ikke stol på en eldre chatoppsummering dersom den avviker.

## Ferdig og merget til `main`

- stabilt React/TypeScript/Vite-grunnlag
- blankt desktop- og mobillerret
- toppmeny og venstremeny
- kontrollert paneloppførsel
- Elementer-panel med Seksjon, Bilde, Tekst og Knapp
- Dependency Cruiser og samlet `npm run check`
- automatisk nettleseråpning
- prosjekt- og elementmodell
- responsive verdier og stabile ID-er
- sentral prosjekt-state og aktiv side
- elementmarkering med transient `selectedElementId`
- oppretting av alle fire elementtyper
- kontrollerte startstørrelser og startplassering
- automatisk markering av nytt element
- automatisk utvidelse av lerretshøyden

## Gjeldende branch

```text
feature/drag-resize
```

Branchen er implementert og ble visuelt godkjent på desktop og mobil før siste kodeaudit.

Implementert:

- flytting med peker
- resizing fra ett håndtak nederst til høyre
- minimumsmål per elementtype
- clamping mot venstre, høyre og øvre lerretskant
- fri bevegelse nedover
- automatisk lerretsvekst
- edge-scroll under interaksjon
- fri overlapping
- transient preview under pekerbevegelse
- én prosjekt-commit ved normalt pekerslipp
- avbrudd uten commit ved `pointercancel`
- desktop og mobil med delt desktopgeometri

Minimumsmål:

```text
Seksjon: 160 × 90
Bilde:   120 × 80
Tekst:   120 × 48
Knapp:    80 × 36
```

## Siste kodeaudit

Etter den visuelle godkjenningen ble disse framtidsrisikoene rettet:

1. **Låste elementer kunne ikke markeres med peker**
   - Markering skjer nå før låsesjekken.
   - Låste elementer kan markeres, men transform starter ikke.
   - Reduceren avviser også layoutmutasjon av låste elementer.

2. **Tapt pointer capture kunne etterlate aktiv preview**
   - `lostpointercapture` avslutter interaksjonen kontrollert.
   - Preview ryddes uten prosjekt-commit.

3. **Preview-type var duplisert**
   - `ElementLayoutPreview` ligger nå i `canvasLayoutPreview.ts`.

4. **Minimumsmål kunne eksponeres som muterbar delt referanse**
   - `getElementMinimumSize` returnerer kopi.

5. **Resize-håndtaket hadde liten treffflate**
   - Synlig firkant er fortsatt 16 × 16 px.
   - Faktisk treffflate er 32 × 32 px.

6. **Draing manglet tastaturalternativ**
   - piltaster flytter 1 px
   - `Shift` + piltast flytter 10 px
   - `Ctrl`/`Cmd` + piltast endrer størrelse
   - `Ctrl`/`Cmd` + `Shift` + piltast bruker 10 px

Disse siste auditendringene er ikke lokalt sluttkontrollert ennå.

## Kritiske arkitekturgrenser

### Varig prosjektdata

- `EditorProject` er autoritativ kilde.
- Ferdig geometri committes gjennom reduceren.
- Ugyldig, uendret eller låst layout ignoreres.
- `updatedAt` endres bare ved reell prosjektmutasjon.

### Transient state

Følgende skal ikke lagres, eksporteres eller inngå direkte i historikk:

- `selectedElementId`
- aktiv pointer-interaksjon
- layout-preview

Én ferdig pekertransform skal senere være én historikk-/autolagringsendring.

### Layout

- elementer kan overlappe
- andre elementer flyttes aldri automatisk
- ingen generell kollisjonsunngåelse
- venstre, høyre og øvre grense håndheves
- ingen fast nedre grense
- lerretshøyde er avledet visning

### Mobil

- dagens UI oppretter ikke mobiloverstyringer
- PC og Telefon redigerer foreløpig delt desktopgeometri
- viewport-bevisste actions bygges senere i `feature/mobile-design-controls`

## Første oppgave i neste chat

Kontroller lokal branch og arbeidsområde:

```powershell
cd C:\Users\tomha\Desktop\website

git status
git branch --show-current
git fetch origin
git log --oneline origin/feature/drag-resize..HEAD
```

Forventet branch:

```text
feature/drag-resize
```

Hent siste audit- og dokumentendringer:

```powershell
cd C:\Users\tomha\Desktop\website

git pull --ff-only origin feature/drag-resize
npm run check
npm run architecture:json
npm run architecture:diagram
npm run dev
```

Kjør regresjonstest:

### Peker

- opprett alle fire elementtypene
- flytt hvert element
- resize hvert element
- kontroller minimumsmål
- kontroller venstre, høyre og øvre grense
- dra nedover og kontroller lerretsvekst
- test overlapping
- test edge-scroll
- test PC og Telefon

### Tastatur

- Tab til et element
- Enter eller mellomrom markerer
- piltaster flytter
- `Shift` + piltast flytter 10 px
- `Ctrl` + piltast endrer størrelse
- `Ctrl` + `Shift` + piltast endrer størrelse 10 px
- clamping og minimumsmål gjelder også for tastatur

Kontroller at resize-håndtaket ser likt ut som før, men er lett å treffe.

Stopp serveren med `Ctrl + C` og kjør:

```powershell
git status
```

Arkitekturrapportene vil være endret etter de nye modulene. Dersom bare rapportene er endret:

```powershell
git add architecture.json
git add docs/dependency-graph.mmd
git commit -m "chore: refresh architecture reports for drag and resize"
git push origin feature/drag-resize
git status
```

Ikke påstå at sluttkontrollen er bestått før brukeren har bekreftet resultat og rent arbeidsområde.

## PR og merge

Når sluttkontrollen er bestått:

1. Gjennomgå hele diffen mot `main`.
2. Opprett PR mot `main`.
3. Dokumenter omfang, state-grenser, tilgjengelighet og kontrollstatus.
4. Kontroller mergebarhet og åpne review-tråder.
5. Merge bare etter eksplisitt brukergodkjenning og med forventet head-SHA.
6. Kontroller oppdatert `main` lokalt.

## Neste planlagte branch

Etter godkjent merge:

```text
feature/object-locking
```

Skal bygge:

- synlig lås/lås opp for valgt element
- varig `locked`-mutasjon gjennom reduceren
- tydelig låsetilstand
- fortsatt markering av låste elementer
- ingen transform når låst

Skal ikke bygge tekstredigering, sletting, historikk eller lagring.

## Kommunikasjonsregler

- svar på norsk
- vær direkte og presis
- bruk GitHub-connectoren til repoarbeid
- gi nøyaktige PowerShell-kommandoer etter repoendringer
- ikke bland neste fase med senere funksjoner
- ikke merge uten eksplisitt godkjenning

---
