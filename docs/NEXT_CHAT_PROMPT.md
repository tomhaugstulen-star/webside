# Prompt til neste chat

Kopier teksten under inn i neste chat.

---

Du overtar ansvaret for Website-editoren. Arbeid som prosjektleder, teknisk arkitekt og kodeansvarlig. Svar på norsk. Bruk faktisk GitHub-state, kode, dokumentasjon og brukerens terminaloutput som sannhetskilder.

## Repo

```text
GitHub: https://github.com/tomhaugstulen-star/webside.git
Lokalt: C:\Users\tomha\Desktop\website
```

Bruk GitHub-connectoren til remote-operasjoner og eksakte PowerShell-kommandoer for lokale `git`- og `npm`-kontroller.

## Ufravikelig arbeidsmåte

- aldri utvikling direkte på `main`
- én avgrenset branch per leveranse
- én konkret lokal handling om gangen
- ikke påstå clean tree eller bestått kontroll uten terminaloutput
- ikke merge uten eksplisitt godkjenning
- ikke start senere fase automatisk
- gjennomfør framtidsrettet audit før PR
- kontroller filstørrelser, arkitekturrapporter, PR-diff, mergebarhet, reviews, tråder og CI

## Autoritativ dokumentasjon

1. `docs/WORK_PLAN.md`
2. `docs/PROJECT_RULES.md`
3. `docs/ELEMENT_MODEL.md`
4. `docs/EDITOR_PLANNING.md`
5. `docs/RESPONSIVE_DESIGN.md`
6. `docs/RIGHT_PROPERTIES_PANEL.md`
7. `docs/CODE_AUDIT.md`
8. `README.md`

Foreldede fasefiler som var fullt innarbeidet i dokumentene over er slettet. Ikke gjenopprett parallelle sannhetskilder.

## Gjeldende status

```text
aktiv fase: 13 – Logo og header
branch: feature/logo-header
GitHub-sak: #31 – åpen
base main: 9937e4fd785da9cbd171443ea4f1d93041a8b326
prosjektskjema: versjon 8
manuell funksjonstest: godkjent
framtidsrettet kodeaudit og opprydding: gjennomført
PR: ikke opprettet
merge: ikke godkjent
```

Faktisk branch-head og `origin/main` skal leses på nytt før PR.

## Siste verifiserte automatiske kontroll

Brukerens lokale terminaloutput etter avsluttende kodeopprydding bekreftet:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 113 moduler, 324 avhengigheter, ingen brudd
Vite: 122 moduler transformert
CSS: 36.54 kB, gzip 6.80 kB
JavaScript: 275.73 kB, gzip 81.65 kB
produksjonsbuild: bestått på 198 ms
architecture.json: regenerert
docs/dependency-graph.mmd: regenerert
git diff --check: ingen whitespace-feil
```

LF til CRLF-advarslene for de to genererte arkitekturrapportene er forventede Windows-linjesluttadvarsler, ikke whitespace-feil.

## Implementert Header

Header er én egen sammensatt elementtype med:

- lokal PNG-, JPEG- eller WebP-logo
- stabil logoasset-ID og serialiserbar metadata
- navn på nettsted eller firma
- valgfri undertittel
- bakgrunn
- felles tekstfarge
- felles font
- ramme `Ingen` eller 1–10 px
- låsing og sikker sletting

Layout:

- full bredde i aktiv PC- eller Telefon-visning
- rendres ved `x = 0`
- ingen fri horisontal flytting eller resizing
- bare vertikal flytting
- standardhøyde 88 px
- minimum 70 px
- maksimum 100 px
- Telefon arver desktop y/høyde fram til fase 15

Panel:

- markering og panelåpen tilstand er separate
- panelet lukkes under transform
- `Egenskaper` i objektverktøyet åpner det igjen
- Header viser font, ramme, status og sletting i høyremenyen
- bakgrunn, tekstfarge og aktiv rammefarge vises i `Farger`

Utenfor fase 13:

- bytte av Header-logo eller tekst etter oppretting
- mobiloverstyringer
- historikk
- autolagring
- prosjektimport
- publisering

## Avsluttende kodeopprydding

- duplisert bilderessursopprydding er fjernet fra `EditorShell`
- `useElementDeletion` er eneste ansvarssted for opprydding av Bilde- og Header-assets
- `useElementCreation` kontrollerer aktiv side og ID-kollisjon før den rapporterer suksess
- nye Header-elementer lagrer `x = 0`
- Header-layoutcommits normaliserer `x = 0` og kanonisk serialisert bredde
- rene pekerberegninger ligger i `elementPointerTransform.ts`
- `useElementPointerTransform.ts` er redusert til 204 linjer
- canvas-stiler er delt mellom grunnlayout og interaksjon
- alle kjente berørte produksjonsfiler er under 250 linjer
- foreldet og duplisert dokumentasjon er fjernet
- issue #31 er synkronisert med faktisk omfang

## Neste handling

Trekk siste dokumentasjonsretting lokalt:

```powershell
git pull --ff-only origin feature/logo-header
```

Vent på hele outputen. Kontroller deretter at slettede dokumentreferanser og foreldet fase-12-status ikke finnes:

```powershell
git grep -n -E 'docs/(PROJECT_COLORS|DRAG_RESIZE|OBJECT_LOCKING)\.md|docs/phase-12-handover|feature/project-colors|aktiv docs-branch|omfang ikke låst|prosjektskjema: versjon 7|Gjeldende skjemaversjon er 7|EDITOR_PROJECT_SCHEMA_VERSION = 7'
```

Forventet resultat er ingen treff.

Deretter kontrolleres:

```powershell
git status --short
git diff --stat
```

Arkitekturrapportene skal committes og pushes. Dersom dokumentasjonsrettingen kom remote etter siste lokale kontroll, trenger ikke `npm run check` kjøres på nytt fordi rettingen bare endrer Markdown. `git diff --check` skal likevel kjøres etter siste lokale commitklargjøring.

## Obligatorisk kort regresjonstest

Kontroller:

- Header full bredde i PC og Telefon
- bare vertikal flytting
- høyde 70–100 px
- panel lukkes under transform og åpnes fra `Egenskaper`
- font, bakgrunn, tekstfarge og ramme
- låsing og sletting
- Seksjon, Bilde, Tekst og Knapp fungerer som før

## Før PR

- clean tree og synkronisert branch
- arkitekturrapporter committet
- alle berørte filer under 250 linjer
- ingen gamle width-mode-referanser
- ingen foreldede dokumentreferanser
- ingen duplisert ressursopprydding
- samlet diff kontrollert mot `main`
- issue #31 samsvarer med faktisk omfang
- PR opprettes ikke som draft
- merge utføres bare etter brukerens eksplisitte godkjenning

---
