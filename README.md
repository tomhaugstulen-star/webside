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

## Repo og lokal mappe

```text
GitHub: https://github.com/tomhaugstulen-star/webside.git
Lokalt: C:\Users\tomha\Desktop\website
```

## Starte programmet

```powershell
cd C:\Users\tomha\Desktop\website
npm install
npm run dev
```

## Full sikkerhetskontroll

Bruk én kommando før en viktig arbeidsøkt og etter kodeendringer:

```powershell
npm run verify
```

`npm run verify` kjører filpolicy, filstørrelseskontroll, lint, TypeScript, arkitekturkontroll, 20 enhetstester, produksjonsbuild og den kritiske Chromium-flyten.

GitHub-workflowen `Quality` kjører samme kommando på pull requests og ved push til `main`.

## Gjeldende utviklingsstatus

```text
main: ecb443d384a1e0999ef14767419e1bea93c4a12c
aktiv branch: feature/phase-17-text-background
aktiv draft-PR: #50
aktiv issue: #35
prosjektskjema på branchen: versjon 10
fase 17-kjerne: implementert og automatisk verifisert
gjenstår før merge: dokumentasjon, oppdaterte arkitekturrapporter og manuell PC/Telefon-test
```

Fase 17 legger til varig og validert bakgrunnsfarge for Tekst-elementer. `Farger` viser `Bakgrunn` før `Tekstfarge`, og låste Tekst-elementer kan inspiseres, men ikke endres.

## Viktig jobbgrense

Programmet har ennå ikke lokal prosjektlagring, autolagring, krasjgjenoppretting eller prosjektimport. Nettleseroppfriskning eller avslutning kan derfor miste prosjektstate. Dette må behandles som høyeste jobbrelaterte risiko etter at PR #50 er kontrollert.

## Arbeidsregel

- aldri utvikling direkte på `main`
- ingen merge uten eksplisitt `godkjent`
- faktisk GitHub-state og terminaloutput er sannhetskilde
- `npm run verify` er obligatorisk før merge og før kritisk bruk
- nye funksjoner fryses når jobbregresjonen starter

## Autoritativ dokumentasjon

1. `docs/WORK_PLAN.md`
2. `docs/PROJECT_RULES.md`
3. `docs/ELEMENT_MODEL.md`
4. `docs/PRODUCTION_READINESS.md`
5. `docs/CODE_AUDIT.md`
6. `docs/NEXT_CHAT_PROMPT.md`
