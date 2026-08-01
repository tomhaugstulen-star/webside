# Kodeaudit og tekniske grenser

Dette dokumentet beskriver aktiv audit for fase 25 – lokal prosjektlagring, autolagring og gjenoppretting.

## Kontrollert baseline

```text
main: 161125d00a4a7d08b4c376d82933dd1176a0cc44
branch: feature/phase-25-local-persistence
draft-PR: #52
issue: #51
PR-head ved siste kontroll: 6ff4e32a872fee5342868218e8e45bc87a2fd442
prosjektskjema: 10
storage-envelope: 1
arkitekturrapport på branch: 133 moduler, 396 avhengigheter, 0 brudd
Quality på endelig head: action_required; ingen utført jobb
status: ikke mergeklar
```

## Arkitektur som beholdes

- `PersistentEditorApp` eier startup-porten.
- `localProjectStorage` isolerer IndexedDB.
- `localProjectSnapshot` validerer envelope og refererte assets.
- `PersistenceProvider` eier autosave, skrivekø og status.
- `ImageAssetStoreProvider` eier `File`, Object URL og runtime-ressurser.
- `EditorProjectProvider` mottar bare et validert startprosjekt.
- prosjekt og assets skrives i samme IndexedDB-transaksjon.
- Object URL-er serialiseres ikke.

Dette er et egnet grunnlag og skal ikke bygges om uten en konkret feil.

## Blokkerende funn

### 1. Endelig CI mangler

Siste `Quality` på PR-head er `action_required`, og ingen jobb ble utført. Ingen kontrollstatus kan avledes fra tidligere heads.

### 2. Utrygg historisk workflow

Branchen har tidligere brukt en midlertidig workflow med `contents: write`, hardkodet artifact-ID og automatisk push til egen PR-branch. Workflowen er fjernet, men denne mekanismen skal ikke gjeninnføres. Endelig kontroll skal være read-only og reproducerbar.

### 3. Recovery-reset er ikke robust nok

`clearLocalProject()` åpner databaseversjon 1 og forventer eksisterende `project`- og `assets`-stores. Reset kan derfor feile ved høyere databaseversjon, manglende store eller inkompatibelt skjema.

Krav:

- vanlig clear for kjent gyldig database
- eksplisitt nødreset med `indexedDB.deleteDatabase`
- håndtering av `blocked`, `error` og vellykket sletting
- test av inkompatibel versjon og manglende stores

### 4. Responsive valideringshull

Headerens kanoniske posisjon/bredde og bildets crop-grenser kontrolleres bare fullt for desktop. Eventuelle lagrede `mobile`-verdier må valideres med samme relevante modellgrenser.

### 5. Adaptertesten mangler

Dagens enhetstest dekker valideringsfunksjoner, men ikke faktiske read/write/clear-operasjoner eller transaksjonsfeil i IndexedDB-adapteren.

Krav:

- adapter-seam eller deterministisk IndexedDB-testimplementasjon
- read empty/ready/invalid
- atomisk write av prosjekt og assets
- orphan-opprydding
- clear og nødreset
- blocked/error-veier der praktisk

### 6. E2E dekker ikke hele kravet

Refresh-testen dekker tekst og Bilde, men må også dekke Header-logo. Recovery-testen må utvides til strukturell databasefeil og reset.

## Ikke-blokkerende eksisterende produktgjeld

- Aktiv `Publiser`-knapp strider mot produktgrensen.
- Angre og Forhåndsvisning fremstår aktive før sine faser.
- Dette skal tas som en liten, separat UI-korreksjon eller inkluderes bare dersom den er nødvendig for fase-25-akseptansekriteriet om ærlig status. Ingen ny funksjonalitet skal implementeres.

## Fil- og ansvarsgrenser

- ordinære produksjonsfiler: under 250 linjer
- 250–299: eksplisitt begrunnet unntak
- 300+: blokkert
- adapter, validering, provider, recovery-UI og testhjelpere skal forbli separate ansvar
- ingen ny generell samlefil

## Mergeport

PR #52 kan først gjøres klar når:

- blokkeringene over er lukket
- siste head har grønn read-only `Quality`
- `npm run verify` består
- rapporter og dokumenter er synkronisert
- manuell PC-/Telefon-regresjon er dokumentert
- PR er mergebar uten uløste tråder
- brukeren eksplisitt skriver `godkjent`
