# Website-editor

Lokal webside-editor bygget med React, TypeScript og Vite.

Editoren åpner med et blankt, hvitt lerret og skal gi kontroll over elementer, tekst, bilder, knapper, farger, header, desktop/mobil og lokal prosjektlagring.

## Lokal mappe

```text
C:\Users\tomha\Desktop\website
```

## Starte prosjektet

```powershell
cd C:\Users\tomha\Desktop\website
npm install
npm run dev
```

`npm run dev` starter Vite og åpner editoren automatisk i standardnettleseren.

## Kvalitetskontroll

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
```

`npm run check` kjører:

- ESLint
- TypeScript-kontroll
- Dependency Cruiser
- produksjonsbuild

Arkitekturrapportene skrives til:

```text
architecture.json
docs/dependency-graph.mmd
```

## Branch-regel

Det utvikles ikke direkte på `main`.

```text
main
  → egen feature-, fix-, chore-, tooling- eller docs-branch
  → avgrenset implementering
  → npm run check
  → arkitekturrapporter ved strukturendringer
  → visuell kontroll
  → dokumentasjon
  → kontrollert merge til main
```

PowerShell-kommandoene som brukeren skal kjøre lokalt skal alltid følge hver repoendring.

## Gjeldende status

Godkjent og ferdig:

- editorgrunnlaget
- blankt desktop- og mobillerret
- toppmeny og venstremeny
- kontrollert åpning og lukking av paneler
- Elementer-panel med Seksjon, Bilde, Tekst og Knapp
- Dependency Cruiser og samlet `npm run check`
- automatisk åpning av nettleseren med `npm run dev`
- prosjekt- og elementmodellen i `feature/element-model`

`feature/element-model` er lokalt og visuelt godkjent. Den skal merges til `main` før neste feature-branch opprettes.

Neste planlagte fase:

```text
feature/element-selection
```

Denne fasen skal bygge markering av eksisterende elementer. Den skal ikke bygge elementoppretting, draing, størrelsesendring eller tekstredigering.

## Dokumentasjon

Les i denne rekkefølgen ved ny chat eller overlevering:

1. `docs/NEXT_CHAT_PROMPT.md`
2. `docs/WORK_PLAN.md`
3. `docs/EDITOR_PLANNING.md`
4. `docs/PROJECT_RULES.md`
5. `docs/ELEMENT_MODEL.md` på `feature/element-model`
6. `docs/RESPONSIVE_DESIGN.md`
7. `docs/CODE_AUDIT.md`

## Ikke implementert ennå

- markering av elementer
- oppretting av synlige elementer
- flytting og størrelsesendring
- låsing
- tekstredigering
- bildeimport
- knappfunksjonalitet
- fargesystem
- logo/header
- angre/gjør om
- automatisk lokal prosjektlagring
- forhåndsvisning og publisering