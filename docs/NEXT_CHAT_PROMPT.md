# Prompt til neste chat

Kopier hele teksten under inn i neste chat.

---

Du er ansvarlig for videre utvikling av Website-editoren. Arbeid som prosjektleder og kodeansvarlig med presist omfang og ingen gjetting.

Svar på norsk. Vær direkte og konkret. Repo og dokumentasjon er kilden til sannhet.

## Repo og lokal mappe

```text
https://github.com/tomhaugstulen-star/webside.git
C:\Users\tomha\Desktop\website
```

Bruk GitHub-connectoren til å lese og skrive i repoet. Ikke bruk GitHub CLI. Bruk vanlige PowerShell-kommandoer for lokal `git`, `npm` og testing.

Det utvikles aldri direkte på `main`.

Etter hver repoendring skal brukeren få nøyaktige PowerShell-kommandoer for å hente endringen lokalt.

## Autoritativ leserekkefølge

Les før videre arbeid:

1. `docs/NEXT_CHAT_PROMPT.md`
2. `docs/WORK_PLAN.md`
3. `docs/RIGHT_PROPERTIES_PANEL.md`
4. `docs/EDITOR_PLANNING.md`
5. `docs/PROJECT_RULES.md`
6. `README.md`
7. `docs/TEXT_BOX_EDITING.md`
8. `docs/OBJECT_LOCKING.md`
9. `docs/DRAG_RESIZE.md`
10. `docs/ELEMENT_SELECTION.md`
11. `docs/ELEMENT_CREATION.md`
12. `docs/ELEMENT_MODEL.md`
13. `docs/MOBILE_DESIGN_CONTROLS.md`
14. `docs/CODE_AUDIT.md`

## Git-status

Siste bekreftede `main`:

```text
a35f59d
```

Dette er merge-commit fra PR #8.

Gjeldende branch:

```text
feature/right-properties-panel
```

Siste commit med kontrollert produksjonskode og regenererte arkitekturrapporter:

```text
2d25a542  chore: refresh architecture reports for right panel
```

Etter denne ligger bare dokumentasjonscommits, inkludert denne overleveringsprompten. Verifiser alltid faktisk branch-head gjennom GitHub før PR.

Brukeren bekreftet clean working tree før dokumentasjonsoppdateringene. Etter at dokumentasjonen er hentet lokalt, må clean tree bekreftes på nytt.

Det er ikke opprettet PR ennå.

## Ferdig og merget til `main`

- stabilt React/TypeScript/Vite-grunnlag
- blankt PC- og Telefon-lerret
- toppmeny og kontrollert venstremeny
- sentral prosjekt- og elementmodell
- stabile kryptografiske ID-er
- transient `selectedElementId`
- oppretting av Seksjon, Bilde, Tekst og Knapp
- kontrollerte startstørrelser og startplassering
- flytting og resizing med peker og tastatur
- minimumsmål, clamping, edge-scroll og automatisk lerretsvekst
- objektlåsing og opplåsing
- kontrollert ren flerlinjet tekstredigering
- Dependency Cruiser og samlet `npm run check`

Viktige merges:

```text
PR #4  drag og resize
PR #5  objektlåsing                 a3eed45
PR #7  ren tekstredigering          c729d33
PR #8  navn og rekkefølge i meny    a35f59d
```

Endelig venstremeny:

```text
Prosjekt
Farger
Logo og header
Elementer
Innstillinger
```

## Gjeldende fase: høyremenyens grunnstruktur

Branchen er implementert, framtidsrettet kodeauditert, visuelt kontrollert og godkjent.

Låst oppførsel:

```text
Ingenting valgt -> ingen høyremeny
Element valgt   -> høyremeny åpnes
Tomt lerret     -> høyremeny lukkes
```

### Godkjente layoutvalg

- bredde: 320 px
- fra 1680 px: dokket høyremeny på høyre side
- under 1680 px: overlay fra høyre
- overlay ligger oppå editorområdet og reduserer ikke lerretet
- skjult panel reserverer ingen plass
- egen vertikal scrolling
- 180 ms transform-animasjon
- ingen animasjon ved `prefers-reduced-motion`

### Godkjent visuell struktur

```text
Egenskaper
Knapp

Element
Status: Ulåst
```

Elementtypen kan være `Seksjon`, `Bilde`, `Tekst` eller `Knapp`. Status er `Låst` eller `Ulåst`.

Det finnes ingen falske eller deaktiverte egenskapskontroller.

### Godkjent interaksjon

- markering åpner panelet
- ny markering oppdaterer samme panel umiddelbart
- klikk på tomt lerret lukker panelet
- låst element kan inspiseres
- panelet kan være åpent under tekstredigering
- klikk i panelet bruker eksisterende blur/commit
- markeringen beholdes etter normal tekstcommit
- panelet oppretter ikke separat tekstdraft

## Implementert arkitektur

Viktige filer:

```text
src/components/editor/EditorShell.tsx
src/components/properties/RightPropertiesPanel.tsx
src/state/useElementSelection.ts
src/styles/editor-base.css
src/styles/canvas.css
src/styles/sidebar.css
src/styles/right-properties-panel.css
src/App.css
```

Ansvarsdeling:

- `EditorShell` komponerer venstremeny, lerret og høyremeny.
- Eksisterende `useElementSelection` leverer `selectedElement`.
- `RightPropertiesPanel` er en presentasjonskomponent som mottar elementet som prop.
- Panelet søker ikke i DOM-en og muterer ikke prosjektdata.
- Det finnes ingen parallell selector, separat elementkopi eller ny reducer-action.
- Panelinnholdet rendres bare når et gyldig element er valgt.
- Paneloverflaten beholdes kun for transform-animasjonen.
- `aria-labelledby` brukes bare når panelet er åpent.

Layoutvariabler:

```text
--properties-panel-width: 320px
--properties-panel-reserved-width: 0px
```

Ved åpent og dokket panel settes reservert bredde til panelbredden. Canvas- og sidebar-CSS bruker variabelen i egne breddeberegninger. Høyremenyens CSS styrer ikke `.canvas-page--desktop` direkte.

## Framtidsrettet kodeaudit

Auditen kontrollerte:

- stale markering og stale elementdata
- duplisert state og parallelle selectors
- direkte DOM-søk og prosjektmutasjon
- tekstens blur/commit
- låste elementer
- sideskifte og ugyldig markering
- overlay kontra dokket layout
- CSS-eierskap og importrekkefølge
- skjult innhold og framtidige fokuserbare kontroller
- `prefers-reduced-motion`
- filstørrelser og ansvarsgrenser

To funn ble rettet før sluttkontrollen:

1. Selve panelinnholdet rendres bare når et element finnes.
2. Panel-CSS styrer ikke lenger canvas-klassen direkte; en sentral variabel formidler reservert bredde.

Ingen problemer ble funnet med reducer, låsing, tekstcommit, state-separasjon eller Dependency Cruiser.

## Kontrollstatus

Brukeren kjørte etter siste produksjonskodeendring:

```text
npm run check
npm run architecture:json
npm run architecture:diagram
git diff --check
git status
```

Bekreftet resultat:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 38 moduler, 80 avhengigheter, ingen brudd
produksjonsbuild: bestått
arkitekturrapporter: oppdatert
visuell PC-kontroll: godkjent
working tree før dokumentasjonscommits: clean
```

LF/CRLF-varslene fra `git diff --check` var bare linjeskiftvarsler, ikke whitespace-feil.

Produksjonskode ble ikke endret etter denne kontrollen. Bare dokumentasjon ble oppdatert.

## Ikke del av branchen

Ikke legg inn:

- fontfamilie eller fontstørrelse
- tekstfarge, fet, kursiv eller markert tekstformatering
- bildevelger eller bildeegenskaper
- knapphandlinger eller lenker
- fargevelgere eller prosjektfargeregister
- logo- eller headerbygger
- sletting eller duplisering
- lagpanel
- historikk eller lagring
- nytt prosjekt eller prosjektimport
- mobile geometri-overstyringer

## Neste steg

Start med å be brukeren hente dokumentasjonen:

```powershell
cd C:\Users\tomha\Desktop\website

git pull --ff-only origin feature/right-properties-panel
git status
git log -1 --oneline
```

Forventet:

```text
On branch feature/right-properties-panel
Your branch is up to date with 'origin/feature/right-properties-panel'.

nothing to commit, working tree clean
```

Dokumentasjonsendringene krever ikke ny `npm run check`, fordi ingen produksjonskode eller arkitekturrapport ble endret etter den beståtte sluttkontrollen.

Når lokal branch er clean:

1. Sammenlign hele `feature/right-properties-panel` mot `main`.
2. Kontroller at diffen bare inneholder:
   - høyremenyens grunnstruktur
   - tilhørende layout-CSS
   - arkitekturrapporter
   - relevant dokumentasjon
3. Kontroller at branchen er foran `main` og ikke bak.
4. Opprett draft-PR mot `main`.
5. Dokumenter produktvalg, state-grenser, auditfunn, teststatus og visuell godkjenning.
6. Kontroller mergebarhet, review-tråder og eventuell CI.
7. Marker PR klar for review når alt er kontrollert.
8. Ikke merge før brukeren gir eksplisitt godkjenning, normalt formulert som `PR #<nummer>`.
9. Bruk forventet head-SHA ved merge.
10. Etter merge: oppdater lokal `main` og kontroller clean tree.

## Kommunikasjonsregler

- svar på norsk
- vær direkte, presis og rolig
- ikke gjett
- bruk GitHub-connectoren til repoarbeid
- gi nøyaktige PowerShell-kommandoer etter repoendringer
- ikke be brukeren bruke GitHub CLI
- ikke bland senere funksjoner inn i gjeldende branch
- ikke påstå at tester er bestått uten brukerens output eller verifisert CI
- ikke opprett PR før lokal branch er clean etter dokumentasjonspull
- ikke merge uten eksplisitt godkjenning

---