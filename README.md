# Website-editor

Lokal webside-editor bygget med React, TypeScript og Vite.

Editoren åpner med et blankt lerret for PC og Telefon. Brukeren kan opprette, markere, flytte, endre størrelse, låse og slette elementer. Tekstbokser støtter flerlinjet redigering, tekstegenskaper og ekstern lenke. Knapper opprettes fra et bundlet SVG-bibliotek. Bildeelementer støtter lokal import, separat ramme og utsnitt, zoom, alternativ tekst og kontrollert ressurslivssyklus.

## Repo og lokal mappe

```text
https://github.com/tomhaugstulen-star/webside.git
C:\Users\tomha\Desktop\website
```

## Starte prosjektet

```powershell
cd C:\Users\tomha\Desktop\website
npm install
npm run dev
```

`npm run dev` bruker `vite --open`.

## Kvalitetskontroll

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
```

Arkitekturrapportene ligger i `architecture.json` og `docs/dependency-graph.mmd`.

## Branch-regel

Det utvikles aldri direkte på `main`.

```text
main
  -> avgrenset feature- eller docs-branch
  -> låst omfang
  -> implementering
  -> framtidsrettet audit
  -> automatiske og manuelle kontroller
  -> dokumentasjon og arkitekturrapporter
  -> PR-kontroll
  -> eksplisitt mergegodkjenning
```

## Gjeldende leveransestatus

Fase 11A er implementert og kontrollert på:

```text
branch: feature/image-import-and-placement
GitHub-sak: #25
PR: #26 – åpen, ikke draft
base main: 7e4c71f
prosjektskjema i leveransen: versjon 6
merge: ikke godkjent eller utført
```

Faktisk branch- og `main`-HEAD skal alltid leses fra Git. Dokumentasjonen bruker ikke et commitnummer som permanent forventet topp-commit.

Siste verifiserte kontroll etter resize-rettelsene:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 91 moduler, 237 avhengigheter, ingen brudd
Vite: 100 moduler transformert
CSS: 31.06 kB, gzip 6.06 kB
JavaScript: 258.04 kB, gzip 77.94 kB
produksjonsbuild: bestått
PC og Telefon: godkjent
bildeimport, lagrekkefølge, ramme, utsnitt, zoom, låsing og sletting: godkjent
```

Arkitekturrapportene ble regenerert etter siste produksjonsendring og commitet på feature-branchen.

## Implementert funksjonalitet

- stabilt React/TypeScript/Vite-grunnlag
- blankt PC- og Telefon-lerret
- toppmeny og kontrollert venstremeny
- Seksjon, Bilde, Tekst og Knapp
- prosjektmodell med stabile ID-er og sentral state
- markering, flytting, resizing og låsing
- Seksjon rendres som bakgrunnslag bak Bilde, Tekst og Knapp
- kontrollert flerlinjet tekstredigering
- høyremeny med elementspesifikke egenskaper
- tekstegenskaper og eksterne lenker
- sikker sletting via høyremeny og `Delete`
- bundlet SVG-knappbibliotek
- knappetekst, design og lenke
- lokal bildeimport for PNG, JPEG og WebP, maks 10 MB
- stabil bilde-`assetId` og serialiserbar metadata
- separat transient ressursbuffer for `File` og Object URL
- alternativ tekst, `Hele bildet` og `Juster utsnitt`
- zoom og motivflytting uten synlige tomrom
- bilderamme som kan endres fra alle kanter og hjørner
- bilderammegrep ligger innenfor rammen
- crop-resize klipper motivet uten å skalere eller flytte det automatisk
- kontrollert fallback for manglende bilderessurs
- Dependency Cruiser og samlet `npm run check`

## Gjeldende venstremeny

```text
Prosjekt
Farger
Logo og header
Elementer
Innstillinger
```

`Elementer` inneholder Seksjon, Bilde, Tekst og Knapp. `Elementer -> Knapp` åpner det interne designbiblioteket. `Elementer -> Bilde` åpner nettleserens filvelger.

## Fast ansvarsdeling

```text
Venstremeny = opprette elementer og velge fil eller ferdig design
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere innhold og transformere elementer
Ressurslag = eie transient bildefil og renderings-URL
Prosjekt   = eie serialiserbar prosjektidentitet og metadata
```

For bilder:

```text
Venstremeny = validere lokal fil og opprette bildeelement
Høyremeny  = alternativ tekst, visningsmodus, zoom, reset, metadata og sletting
Lerretet   = flytte ramme, endre ramme og flytte motiv
```

## Bildeinteraksjon

```text
Hele bildet     -> hele motivet skaleres proporsjonalt og sentreres i rammen
Juster utsnitt  -> bildet fyller rammen uten tomrom
vanlig dra      -> flytter motivet i utsnittsmodus
Shift + dra     -> flytter hele rammen
Alt + piltast   -> flytter motivet med tastaturet
piltast         -> flytter elementet
Ctrl/Cmd + pil  -> endrer størrelse fra nedre høyre hjørne
```

Bilderammen har åtte pekergrep på innsiden. I `Juster utsnitt` endrer rammeresize bare klippeområdet: motivets størrelse og absolutte plassering beholdes, aktiv kant flyttes og motsatt kant står fast. Låste bilder kan inspiseres, men ikke endres, flyttes, beskjæres eller slettes.

## Prosjektmodell

Gjeldende skjemaversjon i denne leveransen er 6.

```text
versjon 1  grunnmodell
versjon 2  tekstinnhold
versjon 3  tekststil
versjon 4  elementlenke
versjon 5  knappasset, knappetekst og knappelenke
versjon 6  bildeasset, metadata, alternativ tekst, visningsmodus og utsnitt
```

Bildeelementet lagrer aldri lokal filsti, Object URL eller binærfil i `EditorProject`. Det lagrer stabil `assetId`, validert metadata, `altText`, `mode` og `transform`. Binærfil og Object URL er transient ressursstate.

Ved crop-resize lagres bilderamme og korrigert normalisert offset i én reducerhandling. Det hindrer mellomtilstander og bevarer motivets plassering mens rammen klipper mer eller mindre.

## Filstørrelse og ansvar

- 250 linjer er aktiv terskel for ansvarstrekk i kildefiler.
- 300 linjer er hard unntaksgrense.
- `EditorCanvasElement.tsx` er under 200 linjer.
- `useElementPointerTransform.ts` er 218 linjer etter siste resize-refaktor.
- `imagePresentation.ts` er 240 linjer.
- `RightPropertiesPanel.tsx` skal forbli komposisjon.
- Varige prosjektendringer går gjennom validerte reducerhandlinger.
- Ugyldige og uendrede handlinger skal returnere samme state.

## Autoritativ dokumentrekkefølge

1. `docs/NEXT_CHAT_PROMPT.md`
2. `docs/WORK_PLAN.md`
3. `docs/EDITOR_PLANNING.md`
4. `docs/PROJECT_RULES.md`
5. `README.md`
6. `docs/ELEMENT_MODEL.md`
7. `docs/RIGHT_PROPERTIES_PANEL.md`
8. `docs/CODE_AUDIT.md`
9. relevante fasedokumenter
