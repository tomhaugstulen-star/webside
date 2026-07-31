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

GitHub-workflowen `Quality` kjører samme kommando på pull requests, ved kontrollert manuell start og ved push til `main`.

## Leveransestatus

Fase 17 leverer varig og validert bakgrunnsfarge for Tekst-elementer gjennom PR #50 og prosjektskjema 10. `Farger` viser `Bakgrunn` før `Tekstfarge`, og låste Tekst-elementer kan inspiseres, men ikke endres.

Produksjonskoden på `b1ef9fed0633ab8eb0bd93c8ea841e05f1423115` besto `npm run verify` og GitHub Quality run #20. Manuell regresjon i PC- og Telefon-visning ble bestått 1. august 2026, og eksplisitt mergegodkjenning ble mottatt.

Neste planlagte roadmapfase er fase 18: arbeidsportalnavigasjon, navigator og hurtigsøk.

## Viktig jobbgrense

Programmet har ennå ikke lokal prosjektlagring, autolagring, krasjgjenoppretting eller prosjektimport. Nettleseroppfriskning eller avslutning kan derfor miste prosjektstate. Dette er den høyeste kjente jobbrelaterte risikoen.

## Arbeidsregel

- aldri utvikling direkte på `main`
- ingen merge uten eksplisitt `godkjent`
- faktisk GitHub-state og terminaloutput er sannhetskilde
- `npm run verify` er obligatorisk før merge og før kritisk bruk
- nye funksjoner fryses når jobbregresjonen starter
- AI utfører alle GitHub-operasjoner den har tilgang til; brukeren kjører bare nødvendige lokale kommandoer og manuelle UI-tester

## Autoritativ dokumentasjon

1. `docs/WORK_PLAN.md`
2. `docs/PROJECT_RULES.md`
3. `docs/ELEMENT_MODEL.md`
4. `docs/PRODUCTION_READINESS.md`
5. `docs/CODE_AUDIT.md`
6. `docs/NEXT_CHAT_PROMPT.md`
