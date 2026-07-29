# Website-editor

Lokal webside-editor bygget med React, TypeScript og Vite.

Editoren åpner med et blankt lerret for PC og Telefon. Brukeren kan opprette, markere, flytte, endre størrelse, låse og slette Seksjon, Bilde, Tekst og Knapp. Tekst har redigering, stil og ekstern lenke. Knapper bruker et bundlet SVG-bibliotek. Bilder har lokal import, separat ramme og utsnitt, zoom, alternativ tekst og kontrollert ressurslivssyklus.

## Repo og lokal mappe

```text
https://github.com/tomhaugstulen-star/webside.git
C:\Users\tomha\Desktop\website
```

## Starte og kontrollere prosjektet

```powershell
cd C:\Users\tomha\Desktop\website
npm install
npm run dev
npm run check
npm run architecture:json
npm run architecture:diagram
```

`npm run dev` bruker `vite --open`. Arkitekturrapportene ligger i `architecture.json` og `docs/dependency-graph.mmd`.

## Fast arbeidsregel

Det utvikles aldri direkte på `main`.

```text
main
  -> avgrenset feature- eller docs-branch
  -> låst omfang
  -> implementering
  -> framtidsrettet audit
  -> automatiske og manuelle kontroller
  -> arkitekturrapporter og dokumentasjon
  -> PR-kontroll
  -> eksplisitt mergegodkjenning
```

## Gjeldende leveranse

```text
fase: 11A – bildeimport, ramme og utsnitt
branch: feature/image-import-and-placement
GitHub-sak: #25
PR: #26 – åpen, ikke draft
base main: 7e4c71f
prosjektskjema: versjon 6
merge: ikke godkjent eller utført
```

Faktisk branch- og `main`-HEAD skal alltid leses fra Git. Commitnumre i dokumentasjonen er historiske kontrollpunkter, ikke permanente forventede topper.

## Siste verifiserte produksjonskontroll

Brukerens lokale terminaloutput etter den endelige bildeauditen bekreftet:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 91 moduler, 237 avhengigheter, ingen brudd
Vite: 100 moduler transformert
CSS: 30.95 kB, gzip 6.04 kB
JavaScript: 258.38 kB, gzip 78.09 kB
produksjonsbuild: bestått på 185 ms
```

Manuelt godkjent på PC og Telefon:

- bildeimport og kontrollert avbrytelse
- Seksjon bak Bilde, Tekst og Knapp
- `Hele bildet` og `Juster utsnitt`
- zoom, reset, pekerdrag og `Alt + piltast`
- resizing fra alle kanter og hjørner
- grep innenfor bilderammen
- crop-resize med stasjonært motiv og fast motsatt kant
- låsing, sletting og manglende ressursfallback

Arkitekturrapportene skal regenereres etter den siste produksjonsauditen før PR #26 kan godkjennes for merge.

## Implementert funksjonalitet

- blankt PC- og Telefon-lerret
- kontrollert toppmeny, venstremeny og høyremeny
- Seksjon, Bilde, Tekst og Knapp
- prosjektmodell med stabile ID-er og sentral state
- markering, flytting, resizing og låsing
- Seksjon rendres deterministisk bak forgrunnselementer
- flerlinjet tekstredigering, tekstegenskaper og eksterne lenker
- sikker sletting via høyremeny og `Delete`
- bundlet SVG-knappbibliotek med tekst, design og lenke
- lokal bildeimport og transient ressursbuffer
- separat bilderamme, crop-transform og zoom
- alternativ tekst og filmetadata
- kontrollert fallback for manglende bilderessurs

## Bildeimport og ressursgrenser

Støttede formater:

```text
PNG
JPEG
WebP
```

Autoritative grenser:

```text
maks filstørrelse: 10 MB
maks dekodet pikselmengde: 40 megapiksler
maks bredde eller høyde: 16 384 px
```

Filtype, byte-størrelse, filnavn og dekodede dimensjoner valideres før elementoppretting. Importen fortsetter ikke dersom Elementer-panelet demonteres mens filen leses. Mislykket oppretting fjerner midlertidig ressurs, og Object URL tilbakekalles når ressursen fjernes eller provideren demonteres.

## Bildeinteraksjon

```text
Hele bildet     -> hele motivet skaleres proporsjonalt og sentreres
Juster utsnitt  -> motivet fyller rammen uten tomrom
vanlig dra      -> flytter motivet
Shift + dra     -> flytter hele rammen
Alt + piltast   -> flytter motivet med tastaturet
piltast         -> flytter elementet
Ctrl/Cmd + pil  -> endrer størrelse fra nedre høyre hjørne
```

Bilderammen har åtte grep på innsiden. Ved crop-resize endres bare klippeområdet: motivets størrelse og absolutte plassering beholdes, aktiv kant flyttes og motsatt kant står fast. Ramme og korrigert transform lagres atomisk.

## Prosjektmodell og skjemagrense

Gjeldende skjemaversjon er 6.

```text
versjon 1  grunnmodell
versjon 2  tekstinnhold
versjon 3  tekststil
versjon 4  elementlenke
versjon 5  knappasset, knappetekst og knappelenke
versjon 6  bildeasset, metadata, alternativ tekst, visningsmodus og utsnitt
```

Bildeelementet lagrer stabil `assetId`, validert metadata, `altText`, `mode` og `transform`. Lokal fil, binærdata og Object URL er transient ressursstate.

Crop-grunnrammen for versjon 6 er eksplisitt låst til 240 × 160 px. Senere endring av standardstørrelsen for nye bilder skal ikke endre utsnittet i eksisterende versjon-6-prosjekter. En annen crop-grunnmodell krever ny skjemaversjon og migrering.

## Grenser for senere faser

- Prosjektimport må validere hele prosjektet og skjemaversjonen før `replace-project`.
- Prosjektbytte må avstemme eller tømme den transiente bilderessursbufferen.
- Angre/gjør om skal lagre serialiserbar prosjektstate, aldri `File` eller Object URL.
- Mobiloverstyringer må bruke eksplisitte viewport-spesifikke geometrihandlinger.
- Autolagring skal reagere på gyldige prosjektmutasjoner, ikke transient editorstate.

## Filstørrelse og ansvar

- 250 linjer er aktiv terskel for ansvarstrekk.
- 300 linjer er hard unntaksgrense.
- alle berørte kildefiler er under 250 linjer
- `EditorCanvasElement.tsx` er under 200 linjer
- `useElementPointerTransform.ts` er 218 linjer
- `imagePresentation.ts` er 236 innholdslinjer
- `RightPropertiesPanel.tsx` skal forbli komposisjon

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
