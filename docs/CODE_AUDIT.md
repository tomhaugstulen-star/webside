# Kodeaudit og tekniske grenser

Dette dokumentet beskriver den framtidsrettede auditen av fase 14 – korrigeringslinjer og snapping – slik leveransen ble merget til `main` 30. juli 2026.

## Leveransestatus

```text
fullført fase: 14 – korrigeringslinjer og snapping
source branch-head: 28da295d938d4384c8f3cfa2f3b8a72d4a2e1bb4
pull request: #39 – merget
mergecommit på main: 0122605b60808689cdda7cb1601eb3342680f88c
GitHub-sak: #34 – lukket som fullført
prosjektskjema: versjon 9
```

Auditen omfatter alle produksjonsfiler endret i fase 14, deres modell- og state-avhengigheter, arkitekturrapportene og autoritativ dokumentasjon.

## Arkitekturretning

- `EditorProject` er eneste varige sannhetskilde.
- Reduceren er siste valideringsgrense.
- DOM, CSS, guider, pekerøkter og preview er transient rendering/state.
- Header er én egen sammensatt elementtype.
- Headerbredde avledes fra aktivt lerret.
- Headerposisjon er deterministisk `x = 0, y = 0`.
- Alignment-mål bygges fra prosjektmodellen og viewportverdier, ikke DOM-geometri.
- Bilderessurslageret eier `File` og Object URL.

## Auditfunn og rettelser

### 1. Headerens topposisjon var ikke konsekvent i alle lag

Etter produktendringen ble Header rendret fast ved `y = 0`, men eldre kodeveier kunne fortsatt bruke lagret `position.y`:

- ny Header kunne beregne en automatisk y-posisjon
- Header-layoutcommit kunne beholde innsendt y
- snapping kunne bruke lagret y for Header som mål
- avledet lerretshøyde kunne bruke lagret y
- plassering av nye elementer kunne bruke et foreldet Header-span

Dette kunne gitt uenighet mellom rendering, snapmål, lerretshøyde og serialisert layout.

Rettet i:

- `src/model/createEditorElement.ts`
- `src/state/setElementDesktopLayout.ts`
- `src/components/canvas/getAlignmentTargets.ts`
- `src/components/canvas/getCanvasContentHeight.ts`
- `src/model/findElementCreationPosition.ts`

Gjeldende invariant:

- ny Header opprettes ved `x = 0, y = 0`
- Header-layout normaliseres før validering og lagring
- serialisert Headerbredde er stabil, mens synlig bredde avledes fra aktivt lerret
- rendering og avledede layoutberegninger bruker samme topposisjon
- bare høyde kan endres

### 2. Header-flytting var blokkert for høyt i laget

UI-et hindret flytting, men lavnivåfunksjoner kunne fortsatt produsere et flyttet Header-layout dersom de senere ble brukt feil.

Rettet slik at Header-flytting avvises i flere uavhengige lag:

- canvas-elementets pointerstart
- pointer-transform-hooken før pointer capture
- ren pointer-layoutfunksjon
- tastaturhåndtering
- layoutcommit normaliserer alltid posisjonen

Dette reduserer risikoen for regresjon når canvas-komponentene senere bygges om.

### 3. Overflødig snapping- og previewkobling

Følgende ble fjernet under slutt-auditen:

- et dødt Header-flagg i snap-motoren
- unødvendig avhengighet fra move-preview til hele `EditorElement`
- unødvendig Header-plasseringsberegning ved oppretting
- en umulig låsttilstand og teksten «Lås opp headeren» i Header-fontpanelet

Move-preview bruker nå bare element-ID, layout, snapmål og lerretsbredde. Importgrafen ble redusert med én avhengighet.

### 4. Alignment-motoren er transient og avgrenset

Kontrollert:

- ingen snappingverdi eller visningsinnstilling lagres i prosjektet
- snapmål fryses ved pekerstart
- lerretsbredde, lerretshøyde og midtpunkter fryses i pekerøkten
- aktivt element ekskluderes
- skjulte elementer ekskluderes
- låste synlige elementer beholdes som mål
- X og Y velges uavhengig
- 6 px terskel brukes i lerretskoordinater
- center/start/end-prioritet er deterministisk
- guider fjernes ved commit, cancel og tapt pointer capture
- resizepreview inneholder ingen guider
- tastaturflytting er ikke koblet til snapping

### 5. Header-fontstørrelse er varig og validert

Kontrollert kjede:

- `HeaderAppearance.fontSize`
- standard 24 px
- validering mot felles `textFontSizes`
- typet action `set-header-font-size`
- hook og reducerkontroll
- høyrepanel med 12–96 px
- CSS-rendering av navn og relativ undertittel
- skjemaversjon 9

Det finnes ingen import- eller migreringsmotor ennå. Framtidig import av versjon 8 må legge til standard `fontSize: 24` eller avvise prosjektet kontrollert.

### 6. Tekstboksbakgrunn mangler i modellen

Tekstboksens hvite bakgrunn er fortsatt hardkodet CSS og finnes ikke som varig prosjektdata. Dette spores separat i GitHub-sak #35 og ble ikke blandet inn i fase 14.

## Filstørrelser

Repositoryomfattende lokal kontroll på siste branch-head viste ingen produksjonsfiler på eller over 250 linjer.

Største berørte produksjonsfiler etter slutt-auditen:

```text
useElementPointerTransform.ts    249
EditorCanvasElement.tsx          243
snapElementMove.ts               194
EditorCanvas.tsx                 168
editorProjectReducer.ts          203
reduceHeaderAppearanceAction.ts  173
textElementStyle.ts              154
getAlignmentTargets.ts           137
```

Genererte filer `architecture.json` og `docs/dependency-graph.mmd` vurderes ikke etter produksjonsgrensen.

## Arkitekturrapporter

Fase 14 endret grafen fra 113 moduler / 324 avhengigheter til:

```text
118 moduler
341 avhengigheter
0 dependency-brudd
```

Rapportene ble regenerert etter at den overflødige typeavhengigheten ble fjernet.

## Siste automatiske kontroll

Brukerens terminaloutput på branch-head `28da295` bekreftet:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 118 moduler, 341 avhengigheter, ingen brudd
Vite: 127 moduler transformert
CSS: 36.85 kB, gzip 6.87 kB
JavaScript: 280.63 kB, gzip 83.17 kB
produksjonsbuild: bestått på 216 ms
git diff --check: ingen feil
produksjonsfiler >= 250 linjer: 0
git status --short: clean etter commit og push
```

LF/CRLF-varslene under generering var forventede Windows-varsler og ikke diff-feil.

## Manuell kontroll

Godkjent av brukeren i PC- og Telefon-visning:

- elementkanter og elementmidtpunkter på begge akser
- horisontal og vertikal lerretsmidt
- samtidig snapping på begge akser
- Seksjon, Bilde, Tekst og Knapp som aktive elementer
- låste synlige elementer som snapmål
- aktivt element ekskludert som eget mål
- Header som fast, fullbredde snapmål
- Header-høyde og fontstørrelse gjennom viewport-bytte
- nye elementer opprettet under Header
- pointer sluppet utenfor vinduet uten hengende guider eller flyttemodus
- auto-scroll uten hopp eller feil commit
- resize uten snapping eller guider
- tastaturflytting uten snapping eller guider
- clamping ved alle lerretsgrenser
- målrettet regresjon etter slutt-auditen av Header-drag, vanlige piltaster, `Ctrl + pil opp/ned`, høydehåndtak og snapping mot Header

Skjulte elementer kan ikke styres fra dagens UI. Ekskluderingen er derfor kodeverifisert i `getAlignmentTargets()`.

Lokal lagring og gjenoppretting finnes ikke ennå og var ikke et akseptansepunkt for fase 14.

## Merge-resultat

PR #39 ble merget med eksplisitt brukergodkjenning. Issue #34 ble automatisk lukket som fullført. Brukerens lokale `main` ble deretter fast-forward-synkronisert og bekreftet clean på mergecommit `0122605`.

## Konklusjon

Fase 14 er ferdig levert på `main`. Det finnes ingen kjent funksjons-, arkitektur-, dependency- eller filstørrelsesblokkerer fra leveransen. Neste produksjonsfase er fase 15, men den er ikke startet og skal få eget låst omfang og egen branch.
