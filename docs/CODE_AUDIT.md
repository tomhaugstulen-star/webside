# Kodeaudit og tekniske grenser

Dette dokumentet beskriver den aktive framtidsrettede auditen for fase 17 – tekstboksbakgrunn.

## Status

```text
main: ecb443d384a1e0999ef14767419e1bea93c4a12c
branch: feature/phase-17-text-background
draft-PR: #50
issue: #35
prosjektskjema på branchen: 10
verifisert kode-head: ea2a446044eca7423d40c027320922d1ea444151
Quality på verifisert kode-head: success
dokumentasjons- og arkitektursynk: commit 34eeb8a7523af6799330c2a642c66d37a7a105c6
status: ikke mergeklar før siste Quality på endelig head og manuell PC-/Telefon-regresjon er verifisert
```

## Levert modellendring

- `TextEditorElement` har egen serialiserbar `appearance: TextAppearance`.
- `TextAppearance` inneholder bare validert `backgroundColor: EditorColor`.
- standardverdien er kanonisk `#FFFFFF`.
- typografi og tekstfarge forblir i `TextElementStyle`.
- prosjektskjemaet økes fra 9 til 10.
- framtidig migrering 9 → 10 må legge til standard `TextAppearance`.
- hardkodet hvit tekstbakgrunn er fjernet fra CSS; rendering leser prosjektdata.

## State- og valideringsgrenser

Reducerhandlingen `set-text-background-color` avviser:

- ugyldig eller ikke-kanonisk farge
- manglende element
- feil elementtype
- element på feil side
- låst Tekst
- uendret farge

Avviste handlinger returnerer samme state-identitet og bevarer `updatedAt`. Gyldig mutasjon endrer bare målrettet Tekst-element.

## UI-grense

- `Farger` viser `Bakgrunn` før `Tekstfarge` for hvert Tekst-element.
- kontrollene er avledet fra aktiv side; ingen parallell palett lagres.
- låste Tekst-elementer vises, men begge fargefeltene er deaktiverte.
- høyremenyen beholder teksttypografi, lenke og elementhandlinger; tekstbakgrunn dupliseres ikke der.

## Testdekning

Den verifiserte kodekjernen hadde:

```text
filpolicytester: 9 bestått
produksjonsfiler kontrollert: 139
produksjonsfiler >= 250 linjer: 0
ESLint: bestått
TypeScript og test-typecheck: bestått
Dependency Cruiser: 120 moduler, 347 avhengigheter, 0 brudd
enhetstester: 20 bestått
Chromium-regresjon: 1 bestått
Vite: 129 moduler transformert
CSS: 45.35 kB, gzip 7.34 kB
JavaScript: 282.25 kB, gzip 83.33 kB
produksjonsbuild: bestått
```

Enhetstestene dekker nøyaktig `TextAppearance`-form, standardoppretting, gyldig mutasjon, ugyldig/ukjent/uendret handling og låsing. E2E-flyten oppretter Tekst, åpner `Farger`, verifiserer rekkefølgen og kontrollerer faktisk rendret bakgrunn.

## Samlet sikkerhetskontroll

```powershell
npm run verify
```

Kommandoen kjører hele `npm run check` og deretter den kritiske Chromium-regresjonen. GitHub Quality bruker samme kommando. Arkitekturrapportene genereres fortsatt eksplisitt når modul-/importgrafen er endret:

```powershell
npm run architecture:json
npm run architecture:diagram
```

## Filstørrelsesrisiko

Siste målte topp:

```text
247  src/components/canvas/useElementPointerTransform.ts
241  src/components/canvas/EditorCanvasElement.tsx
236  src/model/imagePresentation.ts
229  src/styles/toolbar.css
226  src/state/reduceColorProjectAction.ts
224  src/components/sidebar/HeaderCreationControl.tsx
211  src/components/properties/ElementLinkPropertiesSection.tsx
202  src/state/editorProjectReducer.ts
199  src/components/properties/ImagePropertiesSection.tsx
192  src/components/canvas/snapElementMove.ts
```

`useElementPointerTransform.ts` skal deles etter ansvar før ny logikk legges til. `reduceColorProjectAction.ts` har vokst til 226 linjer og skal overvåkes; neste større fargeansvar bør vurderes trukket ut før terskelen nås. Ingen unntak er aktive.

## Arkitekturkonsekvens

Fase 17 legger til to produksjonsmoduler:

- `src/model/textAppearance.ts`
- `src/state/useTextAppearance.ts`

Importgrafen er derfor endret, og både `architecture.json` og `docs/dependency-graph.mmd` må regenereres på siste branch-head før PR-en kan gjøres klar.

## Jobbkritisk risiko utenfor fase 17

Editoren har ennå ikke lokal prosjektlagring, autolagring, krasjgjenoppretting, import eller angre/gjør om. Automatiske tester kan beskytte eksisterende funksjoner mot kodefeil, men de kan ikke hindre tap av prosjektstate ved nettleseroppfriskning eller avslutning.

Før programmet brukes som eneste arbeidsverktøy må denne risikoen behandles eksplisitt. Roadmapendring eller en avgrenset jobbberedskapsfase skal ikke bygges skjult i PR #50; den må besluttes og dokumenteres separat.

## Konklusjon

Fase-17-kjernen følger eksisterende modell- og reducergrenser og har målrettet testdekning. Ingen senere feature er blandet inn. PR #50 skal forbli draft til endelig branch-head har grønn GitHub Quality, ren diff og godkjent manuell PC-/Telefon-regresjon. Dokumentasjon og arkitekturrapporter er allerede synkronisert.
