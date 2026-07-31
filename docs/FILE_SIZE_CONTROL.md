# Automatisk filstørrelseskontroll

Dette dokumentet beskriver den automatiske håndhevingen av filstørrelsesgrensene i `docs/PROJECT_RULES.md`.

## Omfang

Kontrollen skanner produksjonsfiler under `src` med disse filtypene:

```text
.css
.js
.jsx
.ts
.tsx
```

Genererte arkitekturrapporter, tester, dokumentasjon, byggresultater og verktøyskript inngår ikke i produksjonsfilgrensen.

## Grenser

```text
ordinær produksjonsfil: 0–249 linjer
eksplisitt unntak:       250–299 linjer
absolutt blokkering:     300 linjer eller mer
```

En fil på 250 linjer eller mer må normalt deles etter reelt ansvar. Et unntak krever en eksplisitt oppføring og konkret begrunnelse i `scripts/check-file-lines.mjs`.

Kontrollen feiler også når:

- et unntak mangler begrunnelse
- et unntak peker på en fil som ikke finnes eller ikke kontrolleres
- et unntak er foreldet fordi filen igjen er under 250 linjer
- en fil når 300 linjer, også når den står i unntakslisten

Det finnes ingen aktive unntak ved innføringen av kontrollen.

## Regelmotor og tester

Den rene regelmotoren ligger i `scripts/file-line-policy.mjs`. Grenseverdier, linjetelling og unntaksvalidering testes uten å opprette midlertidige produksjonsfiler.

Testene dekker:

- ordinær fil på 249 linjer
- ordinær fil på 250 linjer
- eksplisitt unntak på 250 og 299 linjer
- absolutt blokkering på 300 linjer, også med unntak
- manglende begrunnelse
- manglende eller ukontrollert fil
- foreldet unntak
- LF- og CRLF-linjetelling

## Kommandoer

Kjør bare regeltestene:

```powershell
npm run file-size:test
```

Kjør bare repositorykontrollen:

```powershell
npm run file-size:check
```

Kjør repositorykontrollen uten nettleserregresjon:

```powershell
npm run check
```

Kjør full sikkerhetskontroll, inkludert Chromium-regresjonen:

```powershell
npm run verify
```

`npm run check` kjører regeltestene og repositorykontrollen først. `npm run verify` kjører deretter den kritiske E2E-flyten. GitHub Actions-workflowen bruker `npm run verify` på pull requests og ved push til `main`.

## Resultat

Ved hver repositorykontroll vises:

- antall kontrollerte produksjonsfiler
- de ti største produksjonsfilene sortert etter linjetall
- eventuelle terskelbrudd eller ugyldige unntak

En feil gir exitkode 1 og blokkerer resten av kvalitetskontrollen og CI-jobben.
