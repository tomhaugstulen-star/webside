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
9. `docs/OBJECT_LOCKING.md`
10. `docs/RESPONSIVE_DESIGN.md`
11. `docs/MOBILE_DESIGN_CONTROLS.md`
12. `docs/CODE_AUDIT.md`
13. `README.md`

Les deretter faktisk kode, spesielt:

```text
src/model/editorProject.ts
src/model/elementLayout.ts
src/state/editorProjectReducer.ts
src/state/toggleElementLock.ts
src/state/useElementLocking.ts
src/state/useElementSelection.ts
src/state/useElementLayout.ts
src/components/canvas/EditorCanvas.tsx
src/components/canvas/EditorCanvasElement.tsx
src/components/canvas/ElementSelectionToolbar.tsx
src/components/canvas/useElementPointerTransform.ts
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
- prosjekt- og elementmodell med responsive verdier og stabile ID-er
- sentral prosjekt-state og aktiv side
- transient elementmarkering
- oppretting av alle fire elementtyper
- kontrollerte startstørrelser og startplassering
- flytting og resizing med peker og tastatur
- minimumsmål, clamping, edge-scroll og automatisk lerretsvekst
- transient pointer-preview og én commit ved normalt pekerslipp

PR #4 merget `feature/drag-resize` til `main` med merge-commit:

```text
cfddf90
```

## Gjeldende branch

```text
feature/object-locking
```

Branchen er implementert og visuelt godkjent på PC og Telefon før siste kodeaudit.

Implementert:

- separat objektverktøylinje over valgt element
- åpen hengelås for **Lås**
- lukket hengelås for **Lås opp**
- varig `locked`-mutasjon gjennom reduceren
- neste låseverdi beregnes fra reducerens nyeste state
- gyldig endring oppdaterer prosjektets `updatedAt`
- ukjent element-ID ignoreres
- låst element beholder markeringen
- låst element får stiplet markeringsramme
- resize-håndtaket skjules når låst
- pekerflytting og pointer-resize blokkeres
- tastaturflytting og tastatur-resize blokkeres
- låseknappen er tastaturtilgjengelig
- pointer-propagation fra verktøylinjen stoppes
- låsestatus er felles for PC og Telefon

## Siste kodeaudit

Auditen kontrollerte:

1. **State-avhengig toggle**
   - UI sender element-ID og tidspunkt.
   - Reduceren beregner neste `locked`-verdi fra nyeste state.

2. **Dobbel transformbeskyttelse**
   - UI starter ikke peker- eller tastaturtransform når låst.
   - Reduceren avviser layoutmutasjon av låst element.

3. **Markering og opplåsing**
   - Låst element kan fortsatt fokuseres og markeres.
   - Objektverktøylinjen forblir tilgjengelig for opplåsing.

4. **Event-propagation**
   - Verktøylinjen er en separat sibling, ikke en knapp inni elementets `role="button"`.
   - Pointer down stoppes slik at låseknappen ikke starter flytting eller fjerner markering.

5. **Tastaturkant**
   - Piltaster på låst element stoppes før låsesjekken.
   - Elementet flyttes ikke, og nettleseren scroller ikke utilsiktet.

6. **Filansvar**
   - State-overgang, hook, verktøylinje, elementrendering og CSS er delt etter ansvar.
   - Alle berørte kildefiler er under 250 linjer.

Den siste tastaturrettingen og dokumentendringene er ikke lokalt sluttkontrollert ennå.

## Kritiske arkitekturgrenser

### Varig prosjektdata

- `EditorProject` er autoritativ kilde.
- `locked` er varig elementdata.
- Gyldig låseendring går gjennom reduceren og oppdaterer `updatedAt`.
- En låseendring skal senere være én historikk-/autolagringsendring.

### Transient state

Følgende skal ikke lagres, eksporteres eller inngå direkte i historikk:

- `selectedElementId`
- aktiv pointer-interaksjon
- layout-preview
- fokus, hover og synlighet for objektverktøylinjen

### Låsing

- låst element kan markeres og fokuseres
- låst element kan ikke flyttes eller resizes
- låst element kan låses opp fra objektverktøylinjen
- låsestatus er felles for PC og Telefon
- låseknappen skal ikke starte transform eller fjerne markering

## Responsiv design må ikke glemmes

Dagens midlertidige regel:

- PC og Telefon deler desktopgeometrien
- en transform i Telefon påvirker derfor også PC
- ingen mobiloverstyring opprettes skjult

Endelig responsiv redigering er dokumentert og spores i:

```text
docs/MOBILE_DESIGN_CONTROLS.md
docs/RESPONSIVE_DESIGN.md
GitHub-sak #3
feature/mobile-design-controls
```

Låsestatus er ikke responsiv. Den gjelder elementet i begge visninger.

## Første oppgave i neste chat

Kontroller lokal branch og arbeidsområde:

```powershell
cd C:\Users\tomha\Desktop\website

git status
git branch --show-current
git fetch origin
git log --oneline origin/feature/object-locking..HEAD
```

Forventet branch:

```text
feature/object-locking
```

Hent siste audit- og dokumentendringer:

```powershell
cd C:\Users\tomha\Desktop\website

git pull --ff-only origin feature/object-locking
npm run check
npm run architecture:json
npm run architecture:diagram
npm run dev
```

Kjør kort regresjonstest:

- opprett alle fire elementtypene
- lås og lås opp hver type
- kontroller at markering beholdes
- kontroller stiplet markeringsramme
- kontroller at resize-håndtaket forsvinner og kommer tilbake
- kontroller at pekerflytting og resizing blokkeres når låst
- Tab til et låst element og trykk piltaster
- elementet skal ikke flyttes, og editoren skal ikke scrolles utilsiktet
- Tab videre til låseknappen og lås opp med Enter eller mellomrom
- klikk på tomt lerret og kontroller at verktøylinjen skjules
- test PC og Telefon

Stopp serveren med `Ctrl + C` og kjør:

```powershell
git status
```

Arkitekturrapportene må regenereres fordi branchen har nye kildekodemoduler. Dersom bare rapportene er endret:

```powershell
git add architecture.json
git add docs/dependency-graph.mmd
git commit -m "chore: refresh architecture reports for object locking"
git push origin feature/object-locking
git status
```

Ikke påstå at sluttkontrollen er bestått før brukeren har bekreftet resultat og rent arbeidsområde.

## PR og merge

Når sluttkontrollen er bestått:

1. Gjennomgå hele diffen mot `main`.
2. Kontroller at branchen bare inneholder objektlåsing, audit-herding og tilhørende dokumentasjon.
3. Opprett draft-PR mot `main`.
4. Dokumenter state-grenser, tilgjengelighet og kontrollstatus.
5. Kontroller mergebarhet og åpne review-tråder.
6. Marker PR klar først etter eksplisitt godkjenning.
7. Merge bare med forventet head-SHA.
8. Kontroller oppdatert `main` lokalt.

## Neste planlagte branch

Etter godkjent merge:

```text
feature/text-box-editing
```

Før implementering må redigeringsmodus, Enter-regel, fontliste, fontstørrelser, formateringsscope, tom tekst og historikkgrense fastsettes. Ikke bygg dette før `feature/object-locking` er kontrollert og merget.

## Kommunikasjonsregler

- svar på norsk
- vær direkte og presis
- bruk GitHub-connectoren til repoarbeid
- gi nøyaktige PowerShell-kommandoer etter repoendringer
- ikke bland neste fase med senere funksjoner
- ikke merge uten eksplisitt godkjenning

---
