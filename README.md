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
- tekstredigering, tekststil, tekstfarge, tekstboksbakgrunn og lenker
- lokal bilde- og logoimport for PNG, JPEG og WebP
- bildeutsnitt, zoom, farger og rammer
- korrigeringslinjer og snapping
- automatiske modell-, reducer-, layout-, filstørrelses- og nettlesertester

## Leveransestatus

- fullført gjennom fase 17 – tekstboksbakgrunn
- neste fase er fase 18 – arbeidsportalnavigasjon, navigator og hurtigsøk
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
