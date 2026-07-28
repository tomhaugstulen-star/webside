# Website-editor

Lokal webside-editor bygget med React, TypeScript og Vite.

Editoren skal åpne med et blankt, hvitt lerret og gi kontroll over elementer, tekst, bilder, knapper, farger, header, desktop/mobil og lokal prosjektlagring.

## Lokal mappe

Prosjektet brukes lokalt fra:

```text
C:\Users\tomha\Desktop\website
```

## Starte prosjektet

```powershell
cd C:\Users\tomha\Desktop\website
npm install
npm run dev
```

## Kvalitetskontroll

Kjør hele kontrollrekken:

```powershell
npm run check
```

Dette kjører:

- ESLint
- TypeScript-kontroll
- Dependency Cruiser
- produksjonsbuild

Arkitekturrapporter oppdateres separat:

```powershell
npm run architecture:json
npm run architecture:diagram
```

Rapportene skrives til:

```text
architecture.json
docs/dependency-graph.mmd
```

## Branch-regel

Det utvikles ikke direkte på `main`.

Arbeidsflyt:

```text
main
  → egen feature-, fix-, chore- eller tooling-branch
  → implementering
  → npm run check
  → visuell kontroll
  → dokumentasjon
  → kontrollert merge til main
```

## Gjeldende grunnbranches

- `tooling/dependency-cruiser`
- `chore/editor-foundation-audit`
- `docs/project-planning`

Disse skal testes og godkjennes før videre funksjonsutvikling bygges fra oppdatert `main`.

## Arkitekturregler

Dependency Cruiser kontrollerer blant annet:

- sirkulære avhengigheter
- importer som ikke kan løses
- helt frakoblede filer
- kildekodemoduler som ikke kan nås fra `src/main.tsx`

Maksimal anbefalt filstørrelse er 300 linjer, men filer skal deles tidligere når de får flere ansvarsområder.

## Dokumentasjon

Planlegging og prosjektregler ligger i `docs`:

- `docs/PROJECT_RULES.md`
- `docs/EDITOR_PLANNING.md`
- `docs/WORK_PLAN.md`
- `docs/RESPONSIVE_DESIGN.md`
- `docs/CODE_AUDIT.md`

## Nåværende status

Editorgrunnlaget inneholder:

- toppmeny
- venstremeny med kontrollert åpning og lukking
- Elementer-panel med Seksjon, Bilde, Tekst og Knapp
- blankt desktop- og mobillerret
- grunnleggende arkitektursjekk

Objektmodell, reell elementoppretting, tekstredigering, bilder, knapper, lagring og publisering er ikke implementert ennå.
