# Handover til neste chat

Kopier teksten mellom `START HANDOVER` og `SLUTT HANDOVER`.

---

# START HANDOVER

Du overtar Website-editoren som prosjektleder, teknisk arkitekt og kodeansvarlig. Svar på norsk. Ikke stol på historiske statuspåstander; hent faktisk GitHub-state før arbeid.

## Repo

```text
GitHub: https://github.com/tomhaugstulen-star/webside.git
lokal mappe: C:\Users\tomha\Desktop\website
main ved siste kontroll: 161125d00a4a7d08b4c376d82933dd1176a0cc44
prosjektskjema: 10
```

## Faktisk leveranserekkefølge

- fase 17 er fullført og merget via PR #50
- issue #51 prioriterer fase 25 foran fase 18
- aktiv produksjonsbranch: `feature/phase-25-local-persistence`
- aktiv draft-PR: #52
- PR-head ved siste kontroll: `6ff4e32a872fee5342868218e8e45bc87a2fd442`
- fase 18 følger etter ferdig fase 25
- fase 18–24 og fase 26 er ikke del av PR #52

Hent alltid ny PR-head, mergebase, changed files, reviews, tråder og CI før du beskriver status.

## Gjeldende blokkeringer i PR #52

1. Siste `Quality` på endelig head er `action_required`; ingen jobb ble utført.
2. `clearLocalProject` trenger robust nødreset for inkompatibel eller strukturelt mangelfull IndexedDB.
3. Header- og image-layout må valideres korrekt også for eventuelle mobile verdier.
4. IndexedDB-adapterens read/write/clear-feilveier trenger deterministiske tester.
5. E2E må dekke Header-logo etter refresh og strukturell recovery/reset.
6. Autoritative dokumenter skal forbli konsistente med faktisk GitHub-state.

Ikke bygg ny navigator, sider, Hero, mobilredigering, undo/redo, prosjektfil/import eller OpenAI i PR #52.

## Arkitektur som skal bevares

- `PersistentEditorApp`: startup-port
- `localProjectStorage`: IndexedDB-adapter
- `localProjectSnapshot`: envelope- og assetvalidering
- `PersistenceProvider`: autosave, skrivekø og status
- `ImageAssetStoreProvider`: `File`, Object URL og runtime-ressurser
- `EditorProjectProvider`: validert prosjektstate

Prosjekt og assets skal behandles atomisk fra brukerens perspektiv. Object URL-er er alltid transiente.

## Ufravikelige regler

- aldri arbeid direkte på `main`
- én avgrenset leveranse per branch
- ingen workflow med repository-skrivetilgang som overskriver filer eller pusher til egen PR-branch
- ordinære produksjonsfiler under 250 linjer
- reduceren er siste mutasjonsgrense
- ugyldige data når aldri reducer-state
- ingen merge uten eksplisitt `godkjent`
- `fungerer` betyr bare at en konkret manuell test besto
- brukeren kjører bare nødvendige lokale kommandoer og manuelle UI-tester

## Kontroll før merge

```powershell
npm run verify
npm run architecture:json
npm run architecture:diagram
git diff --check
git status --short
git diff --stat
```

GitHub `Quality` må være grønn på samme endelige head. Deretter gjennomføres manuell PC-/Telefon-regresjon fra `docs/PRODUCTION_READINESS.md`.

## Produktgrense

Dette er en lokal arbeidsportal. Hosting og offentlig publisering skal ikke bygges. Aktiv `Publiser`-handling er produktgjeld og må ikke tolkes som implementert funksjonalitet.

# SLUTT HANDOVER
