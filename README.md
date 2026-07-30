# Website-editor

Lokal webside-editor bygget med React, TypeScript og Vite.

## Funksjonalitet

Editoren har separate visninger for PC og Telefon og støtter:

- Seksjon, Bilde, Tekst, Knapp og Header
- markering, flytting, størrelsesendring, låsing og sikker sletting
- tekstredigering, tekststil, tekstfarge og eksterne lenker
- bundlet SVG-knappbibliotek
- lokal bildeimport for PNG, JPEG og WebP
- bildeutsnitt, zoom, alternativ tekst og kontrollert Object URL-livssyklus
- side-, Seksjon-, Tekst- og Header-farger
- Seksjon- og Header-ramme
- Header med logo, navn og undertittel

Headeren følger hele den synlige sidebredden. Den kan flyttes vertikalt og justeres mellom 70 og 100 px høyde. Horisontal plassering og bredde redigeres ikke.

## Repo og lokal mappe

```text
GitHub: https://github.com/tomhaugstulen-star/webside.git
Lokalt: C:\Users\tomha\Desktop\website
```

## Starte og kontrollere prosjektet

```powershell
cd C:\Users\tomha\Desktop\website
npm install
npm run dev
npm run check
npm run architecture:json
npm run architecture:diagram
git diff --check
```

`npm run dev` åpner Vite automatisk. Arkitekturrapportene ligger i `architecture.json` og `docs/dependency-graph.mmd`.

## Arbeidsregel

Det utvikles aldri direkte på `main`.

```text
main
  -> avgrenset feature- eller docs-branch
  -> låst omfang
  -> implementering
  -> framtidsrettet kodeaudit
  -> automatiske og manuelle kontroller
  -> filstørrelseskontroll
  -> arkitekturrapporter og dokumentasjon
  -> PR-kontroll
  -> eksplisitt mergegodkjenning
```

## Gjeldende status

```text
aktiv produksjonsfase: fase 13 – Logo og header
branch: feature/logo-header
GitHub-sak: #31
prosjektskjema: versjon 8
status: funksjonelt godkjent, dokumentasjon og sluttaudit pågår
```

Ingen merge utføres uten eksplisitt godkjenning.

## Tekniske grenser

- 250 linjer er aktiv terskel for ansvarstrekk
- 300 linjer er hard unntaksgrense
- varige data endres bare gjennom validerte reducerhandlinger
- ugyldige, låste og uendrede handlinger returnerer samme state
- `updatedAt` endres bare ved en gyldig reell prosjektmutasjon
- `File`, Blob, Object URL og lokal filsti lagres ikke i prosjektmodellen
- Telefon arver desktopverdier inntil egne mobiloverstyringer bygges

## Autoritativ dokumentasjon

1. `docs/WORK_PLAN.md`
2. `docs/PROJECT_RULES.md`
3. `docs/ELEMENT_MODEL.md`
4. `docs/EDITOR_PLANNING.md`
5. `docs/RESPONSIVE_DESIGN.md`
6. `docs/RIGHT_PROPERTIES_PANEL.md`
7. `docs/CODE_AUDIT.md`
8. `docs/NEXT_CHAT_PROMPT.md`

Historiske fasebeskrivelser som er fullt innarbeidet i dokumentene over, beholdes ikke som parallelle sannhetskilder.
