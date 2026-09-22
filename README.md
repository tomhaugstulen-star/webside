# Website-editor

Lokal webside-editor bygget med React, TypeScript og Vite. Programmet er laget for én bruker på egen PC.

## Hovedmål

- stabil redigering uten unødvendige stopp
- tydelig og forutsigbar arbeidsflyt
- lokal kontroll over prosjektdata
- enkel arkitektur uten konto-, flerbruker- eller skykompleksitet

## Nåværende funksjoner

- PC- og Telefon-visning
- Seksjon, Bilde, Tekst, Knapp og Header
- markering, flytting, størrelsesendring, låsing og sikker sletting
- tekstredigering, tekststil, tekstfarge, tekstboksbakgrunn, rammer og lenker
- lokal bilde- og logoimport for PNG, JPEG og WebP
- bildeutsnitt, zoom, prosjektfarger og rammer
- sideoppretting, sidenavn, slug, rekkefølge og sletting
- stabile offentlige seksjons-ID-er og serialiserbar nettstednavigasjon
- korrigeringslinjer og snapping; aktiv vedlikeholdsbranch har også snapping til lik bredde/høyde
- aktiv vedlikeholdsbranch har redigerbar HEX-kode og pipette der nettleseren støtter EyeDropper
- automatiske modell-, reducer-, layout-, filstørrelses- og nettlesertester

## Leveransestatus

- `main` er fullført gjennom fase 19 – sider, seksjons-ID-er og navigasjonsmodell (PR #62)
- aktiv vedlikeholdsleveranse før fase 20 er #63 på `feature/editor-polish-before-phase-20-v2`
- kodearbeidet for #63/#64 er ferdigstilt på aktiv branch, inkludert testdekning og regenererte arkitekturrapporter; 48 unit-tester, lint, TypeScript, filgrenser, arkitekturkontroll og bygg er grønne
- siste `npm run verify` stoppet ved E2E fordi Chromium ikke kunne installeres i arbeidsmiljøet; full lokal kontroll, manuell PC-/Telefon-test og senere PR/CI/merge gjenstår
- repo-audit #64 samler kode-/assetrester, falske UI-handlinger og testgap som skal ryddes før fase 20
- neste produksjonsfase etter disse vedlikeholdsgatene er fase 20 – nettstedets Header og menynavigasjon
- eksisterende synlige editorhandlinger som Lagre, Forhåndsvisning og Publiser er planlagte funksjoner; fase 30 skal kunne generere en komplett statisk nettsidemappe som kan lastes direkte opp til vanlig webhotell/domene
- fase 25 leverer lokal prosjektlagring, automatisk lagring og gjenoppretting
- den tidligere fase-25-PR-en #52 er parkert og skal ikke brukes som aktiv leveranse

Den låste rekkefølgen ligger i `docs/WORK_PLAN.md`.

## Starte programmet

```powershell
cd C:\Users\tomha\Desktop\website
npm install
npm run dev
```

## Full kontroll

```powershell
npm run verify
```

Ved modul- eller importendringer regenereres også:

```powershell
npm run architecture:json
npm run architecture:diagram
```

## Viktig før fase 25

Gjeldende `main` har ikke varig prosjektlagring eller automatisk lagring. Oppfriskning, lukking eller krasj kan derfor miste arbeidsøkten. Programmet skal ikke være eneste lagringssted for jobbkritisk innhold før fase 25 er ferdig kontrollert og merget.

## Autoritativ dokumentasjon

Kun disse dokumentene er permanente sannhetskilder:

1. `docs/WORK_PLAN.md` – rekkefølge og aktiv fase
2. `docs/PROJECT_RULES.md` – varige arbeids- og arkitekturregler
3. `docs/ELEMENT_MODEL.md` – serialiserbar prosjektmodell

Fasespesifikke krav og auditfunn ligger i den aktuelle GitHub-saken og PR-en. `architecture.json` og `docs/dependency-graph.mmd` er genererte rapporter, ikke statusdokumenter.
