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

Historiske fasefiler som var fullt innarbeidet i dokumentene over er slettet for å unngå parallelle sannhetskilder.

## Gjeldende status

```text
aktiv fase: 13 – Logo og header
branch: feature/logo-header
GitHub-sak: #31 – åpen
base main: 9937e4fd785da9cbd171443ea4f1d93041a8b326
prosjektskjema: versjon 8
manuell funksjonstest: godkjent
kodeaudit og opprydding: gjennomført
ny automatisk kontroll etter opprydding: gjenstår
PR: ikke opprettet
merge: ikke godkjent
```

Branchen var på `1587d76` før den avsluttende dokumentasjons- og kodeoppryddingen. Faktisk head skal leses på nytt.

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

## Avsluttende kodeopprydding som er gjort remote

- duplisert bilderessursopprydding er fjernet fra `EditorShell`
- `useElementDeletion` er eneste ansvarssted for opprydding av Bilde- og Header-assets
- `useElementCreation` kontrollerer aktiv side og ID-kollisjon før den rapporterer suksess
- nye Header-elementer lagrer `x = 0`
- Header-layoutcommits normaliserer `x = 0` og kanonisk serialisert bredde
- ren pekerberegning er flyttet til `elementPointerTransform.ts`
- `useElementPointerTransform.ts` er redusert fra 247 til 204 linjer
- `canvas.css` er delt i `canvas.css` og `canvas-interaction.css`
- alle kjente berørte produksjonsfiler er under 250 linjer

Tre foreldede dokumenter er slettet:

```text
docs/PROJECT_COLORS.md
docs/DRAG_RESIZE.md
docs/OBJECT_LOCKING.md
```

## Neste handling

Brukeren skal først trekke siste remote-endringer:

```powershell
git pull --ff-only origin feature/logo-header
```

Vent på hele outputen.

Deretter:

```powershell
npm run check
```

Ved bestått kontroll:

```powershell
npm run architecture:json
npm run architecture:diagram
```

Deretter:

```powershell
git diff --check
git status --short
git diff --stat
```

Arkitekturrapportene skal committes og pushes etter kontroll. Dokumentasjonen skal bare justeres igjen dersom faktiske kontrolltall eller auditfunn krever det.

## Obligatorisk manuell regresjonstest

Kontroller kort:

- Header full bredde i PC og Telefon
- bare vertikal flytting
- høyde 70–100 px
- panel lukkes under transform og åpnes fra `Egenskaper`
- font, bakgrunn, tekstfarge og ramme
- låsing og sletting
- Header-logoressurs fjernes uten å skade delte Bilde-assets
- Seksjon, Bilde, Tekst og Knapp fungerer som før

## Før PR

- clean tree og synkronisert branch
- nye arkitekturrapporter
- alle berørte filer under 250 linjer
- ingen gamle width-mode-referanser
- ingen duplisert ressursopprydding
- samlet diff kontrollert mot `main`
- issue #31 samsvarer med faktisk omfang
- PR opprettes ikke som draft
- merge utføres bare etter brukerens eksplisitte godkjenning

---
