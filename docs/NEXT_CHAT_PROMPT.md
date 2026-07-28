# Prompt til neste chat

Kopier teksten under inn i neste chat.

---

Du er ansvarlig for videre utvikling av Website-editoren. Arbeid i GitHub-repoet, aldri direkte på `main`. Bruk GitHub-connectoren til å lese repoet før kode eller plan endres. Etter hver repoendring skal brukeren få nøyaktige PowerShell-kommandoer.

## Repo og lokal mappe

```text
https://github.com/tomhaugstulen-star/webside.git
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
6. `docs/TEXT_BOX_EDITING.md`
7. `docs/RIGHT_PROPERTIES_PANEL.md`
8. `docs/OBJECT_LOCKING.md`
9. `docs/DRAG_RESIZE.md`
10. `docs/MOBILE_DESIGN_CONTROLS.md`
11. `README.md`

Les deretter faktisk kode, spesielt:

```text
src/model/editorProject.ts
src/model/createEditorElement.ts
src/state/editorProjectReducer.ts
src/state/setTextElementContent.ts
src/state/useTextElementContent.ts
src/components/canvas/EditorCanvas.tsx
src/components/canvas/EditorCanvasElement.tsx
src/components/canvas/TextElementEditor.tsx
src/components/canvas/canvasElementAccessibility.ts
src/components/canvas/useElementPointerTransform.ts
src/styles/canvas.css
```

Repoet og dokumentasjonen er kilden til sannhet.

## Ferdig og merget til `main`

- stabilt React/TypeScript/Vite-grunnlag
- blankt PC- og Telefon-lerret
- toppmeny og venstremeny
- Elementer-panel
- prosjekt- og elementmodell
- transient elementmarkering
- oppretting av Seksjon, Bilde, Tekst og Knapp
- flytting og resizing med peker og tastatur
- minimumsmål, clamping, edge-scroll og lerretsvekst
- objektlåsing og opplåsing

PR #5 merget objektlåsing med merge-commit:

```text
a3eed45
```

## Gjeldende branch

```text
feature/text-box-editing
```

Branchen er implementert, kodeauditert og visuelt godkjent på PC og Telefon.

Brukeren har bekreftet:

- `npm run check` bestått etter siste kodeendring
- all tekstoppførsel fungerer
- øvrige elementtyper har ingen regresjon
- arbeidsområdet var rent før dokumentoppdateringen

## Implementert tekstmodell

Prosjektskjemaet er versjon 2.

`EditorElement` er en diskriminert union. Bare tekstobjekter har:

```ts
kind: 'text'
content: string
```

Nye tekstbokser starter med `content: ''`. Tom tekst er gyldig. Editor-placeholder lagres ikke.

Det finnes ingen lagring/import ennå, derfor ingen migreringskode i denne branchen. Skjemamigrering bygges senere med prosjektimport.

## Implementert tekstinteraksjon

- ett klikk markerer
- dobbeltklikk starter redigering
- `Enter` på markert tekstboks starter redigering
- kontrollert flerlinjet `textarea`
- vanlig `Enter` lager ny linje
- blur committer
- `Ctrl`/`Cmd` + `Enter` committer
- `Escape` forkaster aktiv draft
- snarveier respekterer IME-komposisjon
- tom tekst fungerer
- låst tekstboks kan ikke redigeres
- objekttransform, resize-håndtak og objektverktøylinje er deaktivert under redigering

## State- og commitgrenser

Varig prosjektdata:

- tekstinnhold
- geometri
- låsestatus
- `updatedAt`

Transient state:

- aktiv tekstredigeringsøkt
- lokal tekstdraft
- markering
- pointer-preview og interaksjon
- panel- og fokusstate

Reducerens tekstovergang:

- krever eksisterende tekstobjekt på aktiv side
- avviser låst element
- normaliserer linjeskift til `\n`
- avviser uendret tekst
- oppdaterer `updatedAt` bare ved reell endring

En avsluttet tekstøkt skal senere være én historikk-/autolagringsendring. Hvert tastetrykk skal ikke bli en egen prosjektmutasjon.

## Kodeaudit

Auditen bekreftet:

- ingen `contentEditable` eller `innerHTML`
- lokal draft er kontrollert
- avslutning er idempotent
- `Escape`, blur og submit har tydelige grenser
- IME-komposisjon beskyttes
- objekt- og tekstsnarveier kolliderer ikke
- reduceren er autoritativ
- alle berørte TypeScript- og TSX-filer er under 250 linjer
- branchen inneholder ikke font-, riktekst- eller høyremenyfunksjoner

Ingen produksjonskode ble endret etter brukerens beståtte sluttkontroll. Etter kontrollen ble bare dokumentasjon lagt til og oppdatert.

## Før PR

Hent dokumentendringene og regenerer arkitekturrapportene:

```powershell
cd C:\Users\tomha\Desktop\website

git pull --ff-only origin feature/text-box-editing

npm run architecture:json
npm run architecture:diagram

git status
```

Arkitekturrapportene skal være endret fordi branchen har nye kildekodemoduler. Commit og push bare rapportene:

```powershell
git add architecture.json
git add docs/dependency-graph.mmd

git commit -m "chore: refresh architecture reports for text editing"
git push origin feature/text-box-editing

git status
```

Forventet sluttstatus:

```text
On branch feature/text-box-editing
Your branch is up to date with 'origin/feature/text-box-editing'.

nothing to commit, working tree clean
```

Produksjonskoden er allerede kontrollert etter siste kodeendring. Dokumentendringene krever ikke en ny visuell regresjonstest. Ikke opprett PR før rapportene er pushet og arbeidsområdet er rent.

## PR og merge

Når arbeidsområdet er rent:

1. Sammenlign hele branchen mot `main`.
2. Kontroller at diffen bare inneholder ren tekstredigering, arkitekturrapporter og dokumentasjon.
3. Opprett draft-PR mot `main`.
4. Dokumenter skjema versjon 2, state-grenser, interaksjoner, tilgjengelighet og kontrollstatus.
5. Kontroller mergebarhet, review-tråder og eventuell CI.
6. Marker PR klar for review.
7. Merge bare etter brukerens eksplisitte godkjenning og med forventet head-SHA.
8. Kontroller oppdatert lokal `main`.

## Neste planlagte branch

Etter merge:

```text
feature/right-properties-panel
```

Sporet i:

```text
docs/RIGHT_PROPERTIES_PANEL.md
GitHub-sak #6
```

Denne branchen skal bare bygge høyremenyens grunnstruktur. Den skal ikke bygge font-, farge-, bilde-, knapp-, slettings-, historikk- eller lagringsfunksjoner.

Før kode må panelbredde, tom tilstand, smal vindusbredde, scrolling og samspill med aktiv tekstredigering godkjennes.

## Responsiv plan

PC og Telefon deler fortsatt desktopgeometrien. Tekstinnhold og låsestatus er felles elementdata.

Egne mobiloverstyringer spores i:

```text
docs/MOBILE_DESIGN_CONTROLS.md
GitHub-sak #3
feature/mobile-design-controls
```

## Kommunikasjonsregler

- svar på norsk
- vær direkte og presis
- bruk GitHub-connectoren til repoarbeid
- gi nøyaktige PowerShell-kommandoer etter repoendringer
- ikke bland senere funksjoner inn i gjeldende branch
- ikke merge uten eksplisitt godkjenning

---
