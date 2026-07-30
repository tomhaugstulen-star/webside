# Website-editor

Lokal webside-editor bygget med React, TypeScript og Vite.

## Funksjonalitet

Editoren har separate visninger for PC og Telefon og støtter:

- Seksjon, Bilde, Tekst, Knapp og Header
- markering, flytting, størrelsesendring og sikker sletting
- låsing for Seksjon, Bilde, Tekst og Knapp
- tekstredigering, tekststil, tekstfarge og eksterne lenker
- bundlet SVG-knappbibliotek
- lokal bildeimport for PNG, JPEG og WebP
- bildeutsnitt, zoom, alternativ tekst og kontrollert Object URL-livssyklus
- side-, Seksjon-, Tekst- og Header-farger
- Seksjon- og Header-ramme
- Header med logo, navn og undertittel

Headeren følger hele den synlige sidebredden. Den kan flyttes vertikalt og justeres mellom 70 og 100 px høyde. Horisontal plassering og bredde redigeres ikke. Header eksponerer ikke låsing eller låsestatus.

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
siste fullførte produksjonsfase: fase 13 – Logo og header
GitHub-sak: #31 – lukket som fullført
pull request: #32 – merget
mergecommit på main: b2e8e05c6daeec494130ce695bc51875d0d949f0
prosjektskjema: versjon 8
automatisk kontroll: bestått etter siste produksjonsendring
manuell regresjon: godkjent
lokal main: synkronisert og clean
aktiv dokumentasjonsbranch: docs/record-phase-13-merge
neste produksjonsfase: ikke startet
```

Fase 14 er neste planlagte kandidat, men omfanget skal låses før en produksjonsbranch opprettes.

## Tekniske grenser

- 250 linjer er aktiv terskel for ansvarstrekk
- 300 linjer er hard unntaksgrense
- ingen produksjonsfiler er på eller over 250 linjer etter fase 13
- varige data endres bare gjennom validerte reducerhandlinger
- ugyldige, låste og uendrede handlinger returnerer samme state
- Header-låsehandlinger avvises; Header opprettes med `locked: false`
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
