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

## Kommandoer

Kjør bare filstørrelseskontrollen:

```powershell
npm run file-size:check
```

Kjør hele kvalitetskontrollen:

```powershell
npm run check
```

`npm run check` kjører filstørrelseskontrollen først. Den eksisterende GitHub Actions-workflowen kjører samme kommando på pull requests og ved push til `main`.

## Resultat

Ved hver kjøring vises:

- antall kontrollerte produksjonsfiler
- de ti største produksjonsfilene sortert etter linjetall
- eventuelle terskelbrudd eller ugyldige unntak

En feil gir exitkode 1 og blokkerer resten av kvalitetskontrollen og CI-jobben.
