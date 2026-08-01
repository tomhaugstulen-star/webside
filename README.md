# Website-editor

Lokal webside-editor bygget med React, TypeScript og Vite.

## Nåværende funksjoner

- PC- og Telefon-visning
- Seksjon, Bilde, Tekst, Knapp og Header
- markering, flytting, størrelsesendring, låsing og sikker sletting
- tekstredigering, tekststil, tekstfarge, tekstboksbakgrunn og lenker
- lokalt bilde- og logovalg for PNG, JPEG og WebP
- bildeutsnitt, zoom og alternativ tekst
- side-, Seksjon-, Tekst- og Header-farger
- Seksjon- og Header-ramme
- korrigeringslinjer og 6 px snapping
- automatiske modell-, reducer-, layout-, filstørrelses- og nettlesertester

## Faktisk leveransestatus

```text
main: 161125d00a4a7d08b4c376d82933dd1176a0cc44
siste fullførte fase: 17 – tekstboksbakgrunn
prosjektskjema: 10
aktiv leveranse: fase 25 – lokal prosjektlagring, autolagring og gjenoppretting
aktiv issue: #51
aktiv draft-PR: #52
neste fase etter fase 25: 18 – arbeidsportalnavigasjon, navigator og hurtigsøk
```

Fase 25 gjennomføres eksplisitt før fase 18 fordi tap av prosjektstate ved oppfriskning, lukking eller krasj er den høyeste jobbrelaterte risikoen. De opprinnelige fasenumrene beholdes.

PR #52 er ikke mergeklar før endelig branch-head har grønn `Quality`, full testdekning for den avtalte lagringsgrensen og godkjent manuell PC-/Telefon-regresjon.

## Starte programmet

```powershell
cd C:\Users\tomha\Desktop\website
npm install
npm run dev
```

## Full sikkerhetskontroll

```powershell
npm run verify
npm run architecture:json
npm run architecture:diagram
git diff --check
git status --short
git diff --stat
```

`npm run verify` kjører filpolicy, filstørrelseskontroll, lint, TypeScript, arkitekturkontroll, enhetstester, produksjonsbuild og den kritiske Chromium-regresjonen.

## Viktig jobbgrense

`main` har ennå ikke lokal prosjektlagring, autolagring eller krasjgjenoppretting. Programmet skal derfor ikke brukes som eneste lagringssted for jobbkritisk arbeid før fase 25 er kontrollert og merget.

## Produktgrense

Website-editoren er en lokal arbeidsportal. Offentlig publisering, hosting, domeneoppsett og produksjonsdeployment er fjernet fra produktretningen. Uimplementerte handlinger skal være skjult eller tydelig deaktivert; en aktiv `Publiser`-handling skal ikke finnes.

## Arbeidsregel

- aldri utvikling direkte på `main`
- én avgrenset leveranse per branch
- faktisk GitHub-state og terminaloutput er sannhetskilde
- ingen merge uten eksplisitt `godkjent`
- ingen automatisk workflow skal skrive dokumentasjon eller kode tilbake til en PR-branch
- `npm run verify` er obligatorisk etter siste produksjonsendring og før merge
- brukeren utfører bare nødvendige lokale kommandoer og manuelle UI-tester

## Autoritativ dokumentasjon

1. `docs/WORK_PLAN.md`
2. `docs/PROJECT_RULES.md`
3. `docs/ELEMENT_MODEL.md`
4. `docs/PRODUCTION_READINESS.md`
5. `docs/CODE_AUDIT.md`
6. `docs/NEXT_CHAT_PROMPT.md`

Historiske beskrivelser i Git-historikken er ikke gjeldende prosjektstatus.
