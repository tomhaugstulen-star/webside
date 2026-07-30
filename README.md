# Website-editor

Lokal webside-editor bygget med React, TypeScript og Vite.

## Funksjonalitet

Editoren har separate visninger for PC og Telefon og støtter:

- Seksjon, Bilde, Tekst, Knapp og Header
- markering, flytting, størrelsesendring og sikker sletting
- låsing for Seksjon, Bilde, Tekst og Knapp
- tekstredigering, tekststil, tekstfarge og eksterne lenker
- bundlet SVG-knappbibliotek
- lokal bilde- og logoimport for PNG, JPEG og WebP
- bildeutsnitt, zoom, alternativ tekst og kontrollert Object URL-livssyklus
- sidebakgrunn, Seksjon-bakgrunn, tekstfarge og Header-farger
- Seksjon- og Header-ramme
- Header med logo, navn, undertittel, fontfamilie og fontstørrelse
- korrigeringslinjer og 6 px snapping ved pekerflytting

Headeren er fast øverst ved `x = 0, y = 0`, følger hele den synlige sidebredden og kan justeres mellom 70 og 100 px høyde. Header eksponerer ikke flytting eller låsing.

Korrigeringslinjene bruker venstre/midt/høyre og topp/midt/bunn mot andre synlige elementer samt horisontal og vertikal lerretsmidt. Snapmål fryses ved pekerstart, aksene behandles uavhengig, og preview er transient fram til pekerslipp.

Kjent avgrensning: Tekstbokser har foreløpig ingen lagret bakgrunnsfarge. Dette spores i GitHub-sak #35 og er ikke blandet inn i fase 14.

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
git status --short
```

Arkitekturrapportene ligger i `architecture.json` og `docs/dependency-graph.mmd`.

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
aktiv produksjonsbranch: feature/alignment-guides
base origin/main: ff39d8df7d59843c796616ad7d56cf00a41236f8
aktiv fase: 14 – korrigeringslinjer og snapping
GitHub-sak: #34 – åpen
prosjektskjema: versjon 9
fase-14-kode: implementert
manuell kontroll: element- og lerretsjustering godkjent; Header og fontstørrelse godkjent
kodeaudit: gjennomført, ett Header-layoutavvik funnet og rettet
endelig branchgodkjenning: ikke fullført
pull request: ikke opprettet
```

Siste lokalt verifiserte `npm run check` før auditrettelsen besto med 118 moduler, 342 avhengigheter og 127 Vite-moduler. Full kontroll må kjøres på nytt etter de siste fem auditcommitene før status kan regnes som endelig.

## Tekniske grenser

- 250 linjer er aktiv terskel for ansvarstrekk
- 300 linjer er hard unntaksgrense
- alle branch-endringene som er kontrollert er under 250 linjer
- varige data endres bare gjennom validerte reducerhandlinger
- ugyldige, låste og uendrede handlinger returnerer samme state
- Header lagres og avledes ved `x = 0, y = 0`
- Header-låsehandlinger avvises; Header opprettes med `locked: false`
- alignment preview, snapmål og guider er transient state
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

Historiske fasebeskrivelser som er fullt innarbeidet i dokumentene over, beholdes ikke som parallelle sannhetskilder. Roadmap-innhold, inkludert eventuell egen Hero-leveranse, vurderes etter at den aktive branchen er ferdig kontrollert.
