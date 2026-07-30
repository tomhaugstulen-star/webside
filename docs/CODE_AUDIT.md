# Kodeaudit og tekniske grenser

Dette dokumentet beskriver framtidsrettet audit av den aktive `feature/alignment-guides`-branchen per 30. juli 2026.

## Leveransestatus

```text
aktiv fase: 14 – korrigeringslinjer og snapping
branch: feature/alignment-guides
base origin/main: ff39d8df7d59843c796616ad7d56cf00a41236f8
GitHub-sak: #34 – åpen
pull request: ikke opprettet
prosjektskjema: versjon 9
```

Fase-14-koden og de etterfølgende Header-korreksjonene er gjennomgått mot `main`. Auditen omfatter alle produksjonsfiler endret på branchen, deres modell- og state-avhengigheter, arkitekturrapportene og autoritativ dokumentasjon.

## Arkitekturretning

- `EditorProject` er eneste varige sannhetskilde.
- Reduceren er siste valideringsgrense.
- DOM, CSS, guider, pekerøkter og preview er transient rendering/state.
- Header er én egen sammensatt elementtype.
- Headerbredde avledes fra aktivt lerret.
- Headerposisjon er deterministisk `x = 0, y = 0`.
- Alignment-mål bygges fra prosjektmodellen og viewportverdier, ikke DOM-geometri.
- Bilderessurslageret eier `File` og Object URL.

## Auditfunn

### 1. Headerens topposisjon var ikke konsekvent i alle lag

Etter produktendringen ble Header rendret fast ved `y = 0`, men flere eldre kodeveier kunne fortsatt bruke lagret `position.y`:

- ny Header ble opprettet ved en automatisk funnet y-posisjon
- Header-layoutcommit beholdt innsendt y
- snapping brukte lagret y for Header som mål
- avledet lerretshøyde brukte lagret y
- plassering av nye elementer brukte lagret Header-span

Konsekvens:

- synlig Header og snapmål kunne være uenige
- lerretshøyde kunne bli for stor
- nye elementer kunne plasseres ut fra en usynlig gammel Header-posisjon
- serialisert Header-layout kunne bryte den nye fast-topp-invarianten

Rettet i:

- `src/model/createEditorElement.ts`
- `src/state/setElementDesktopLayout.ts`
- `src/components/canvas/getAlignmentTargets.ts`
- `src/components/canvas/getCanvasContentHeight.ts`
- `src/model/findElementCreationPosition.ts`

Gjeldende regel:

- ny Header opprettes ved `x = 0, y = 0`
- Header-layoutcommit serialiserer `x = 0, y = 0`
- rendering og alle avledede layoutberegninger bruker samme topposisjon
- bare høyde kan endres

### 2. Alignment-motoren er transient og avgrenset

Kontrollert:

- ingen ny prosjekt- eller innstillingsverdi er lagt til
- snapmål fryses ved pekerstart
- lerretsbredde, lerretshøyde og midtpunkter fryses i pekerøkten
- aktivt element ekskluderes
- skjulte elementer ekskluderes
- låste elementer beholdes som mål
- X og Y velges uavhengig
- 6 px terskel brukes i lerretskoordinater
- center/start/end-prioritet er deterministisk
- guider fjernes ved commit, cancel og tapt pointer capture
- resizepreview inneholder ingen guider
- tastaturflytting er ikke koblet til snapping

### 3. Header-fontstørrelse er varig og validert

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

### 4. Tekstboksbakgrunn mangler i modellen

Tekstboksens hvite bakgrunn er fortsatt hardkodet CSS og finnes ikke som varig prosjektdata. Dette er registrert i GitHub-sak #35 og er ikke blandet inn i fase 14.

## Filstørrelser

Alle produksjonsfiler endret på branchen som er lest under auditen er under aktiv terskel på 250 linjer.

Største kontrollerte filer:

```text
EditorCanvasElement.tsx          243
useElementPointerTransform.ts    243
snapElementMove.ts               190
EditorCanvas.tsx                 166
editorProjectAction.ts           161
reduceHeaderAppearanceAction.ts  153
textElementStyle.ts              152
getAlignmentTargets.ts           135
```

Genererte filer `architecture.json` og `docs/dependency-graph.mmd` vurderes ikke etter produksjonsgrensen.

Full repositoryomfattende filstørrelseskontroll må kjøres lokalt på siste branch-head før PR.

## Arkitekturrapporter

Alignment-implementasjonen økte grafen fra 113 moduler / 324 avhengigheter til 118 moduler / 342 avhengigheter. Rapportene ble regenerert etter modulendringene.

Senere Header-font-, audit- og dokumentasjonsrettelser endret ingen modul- eller importkanter. Det er derfor ikke nødvendig å regenerere rapportene bare for disse endringene, men `git diff` og `npm run architecture:check` skal fortsatt verifiseres på siste branch-head.

## Siste automatiske kontroll

Brukerens terminaloutput på commit `8893a9c` bekreftet:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 118 moduler, 342 avhengigheter, ingen brudd
Vite: 127 moduler transformert
CSS: 36.85 kB, gzip 6.87 kB
JavaScript: 280.88 kB, gzip 83.22 kB
produksjonsbuild: bestått på 198 ms
```

Senere commits endret bare dokumentasjon. Produksjonskoden og importgrafen er uendret, men en endelig lokal `npm run check` på siste branch-head er fortsatt obligatorisk før PR.

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
- samme grunnregler i PC og Telefon

Skjulte elementer kan ikke styres fra dagens UI. Ekskluderingen er derfor kodeverifisert i `getAlignmentTargets()` og inngår ikke som en utestet synlig kontroll.

Lokal lagring og gjenoppretting finnes ikke ennå og er ikke et akseptansepunkt for fase 14.

## Gjenstående før PR

1. Pull siste remote-head lokalt.
2. Kjør `npm run check` på siste branch-head.
3. Kjør `git diff --check`.
4. Kjør repositoryomfattende filstørrelseskontroll.
5. Bekreft clean working tree og eksakt HEAD.
6. Opprett og gjennomgå PR, CI, reviews og tråder.
7. Merge aldri uten eksplisitt `godkjent`.

## Konklusjon

Ingen kjent funksjons-, arkitektur- eller filstørrelsesblokkerer er funnet i branch-diffen. Den manuelle fase-14-regresjonen er fullført og godkjent. Branchen er klar for endelig lokal branch-head-kontroll før PR.