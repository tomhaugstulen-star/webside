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
- tekstredigering, tekststil, tekstfarge, helfarge/lineær gradient på bakgrunner, rammer og lenker
- lokal bilde- og logoimport for PNG, JPEG og WebP
- bildeutsnitt, zoom, prosjektfarger, lineære bakgrunnsgradienter og rammer
- sideoppretting, sidenavn, slug, rekkefølge og sletting
- stabile offentlige seksjons-ID-er og serialiserbar nettstednavigasjon
- korrigeringslinjer og snapping; aktiv vedlikeholdsbranch har også snapping til lik bredde/høyde
- aktiv vedlikeholdsbranch har redigerbar HEX-kode og pipette der nettleseren støtter EyeDropper
- automatiske modell-, reducer-, layout-, filstørrelses- og nettlesertester

## Leveransestatus

- `main` er fullført gjennom fase 19 – sider, seksjons-ID-er og navigasjonsmodell (PR #62)
- #63/#64 er merget i PR #65
- #66 er merget i PR #70; Prosjekt-panelet kan lagre og åpne én `.website-project`-fil med alle sider, elementer, bilder og logoer
- aktiv vedlikeholdsleveranse før fase 20 er #67 på `feature/gradient-fill-before-phase-20`
- #67 oppgraderer prosjektmodellen til schema 13 med typet bakgrunnsfyll: helfarge eller lineær gradient med to farger og vinkel 0–360°
- schema 10/11/12 migreres kontrollert til schema 13 ved prosjektimport; ugyldige filer avvises uten å endre arbeidsøkten
- neste produksjonsfase etter vedlikeholdsgaten er fase 20 – nettstedets Header og menynavigasjon
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

#66 gir manuell lagring til prosjektfil, men ingen automatisk lagring. Last ned en oppdatert prosjektfil før oppfriskning eller lukking; endringer etter siste nedlasting kan gå tapt. Toolbar-knappen «Lagre» forblir deaktivert frem til fase 25.

## Autoritativ dokumentasjon

Kun disse dokumentene er permanente sannhetskilder:

1. `docs/WORK_PLAN.md` – rekkefølge og aktiv fase
2. `docs/PROJECT_RULES.md` – varige arbeids- og arkitekturregler
3. `docs/ELEMENT_MODEL.md` – serialiserbar prosjektmodell

Fasespesifikke krav og auditfunn ligger i den aktuelle GitHub-saken og PR-en. `architecture.json` og `docs/dependency-graph.mmd` er genererte rapporter, ikke statusdokumenter.
