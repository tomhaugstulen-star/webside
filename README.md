# Website-editor

Lokal webside-editor bygget med React, TypeScript og Vite.

Editoren åpner med et blankt lerret for PC og Telefon. Brukeren kan opprette, markere, flytte, endre størrelse, låse og slette Seksjon, Bilde, Tekst og Knapp. Tekst har redigering, stil, tekstfarge og ekstern lenke. Knapper bruker et bundlet SVG-bibliotek. Bilder har lokal import, separat ramme og utsnitt, zoom, alternativ tekst og kontrollert ressurslivssyklus. Aktiv side har prosjektfarger for sidebakgrunn, Seksjon-bakgrunn, Seksjon-ramme og tekst.

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
  -> oppdatert lokal main
```

## Gjeldende prosjektstatus

```text
aktiv fase: 12 – prosjektfarger og Seksjon-rammer
branch: feature/project-colors
GitHub-sak: #28
PR: #29 – åpen, ikke draft
prosjektskjema: versjon 7
implementering: ferdig
manuell PC- og Telefon-test: godkjent
rammebredde: Ingen eller 1–10 px
automatiske kontroller: bestått
arkitekturrapporter: regenerert og committet i 1963088
merge: ikke godkjent eller utført
```

Faktisk branch-, PR- og `main`-HEAD skal alltid leses fra Git. Commitnumre i dokumentasjonen er kontrollpunkter, ikke permanente forventede topper.

## Siste verifiserte produksjonskontroll

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 102 moduler, 274 avhengigheter, ingen brudd
Vite: 111 moduler transformert
CSS: 33.62 kB, gzip 6.34 kB
JavaScript: 264.52 kB, gzip 79.47 kB
produksjonsbuild: bestått på 192 ms
git diff --check: ingen whitespace-feil
```

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
- prosjektfarger og Seksjon-rammer

## Prosjektfarger

`Farger` viser konkrete fargeegenskaper på aktiv side:

```text
Bakgrunn
  Sidebakgrunn
Element N
  Bakgrunn
  Ramme      når rammebredden er større enn 0
Tekst N
  Tekstfarge
```

Regler:

- hver kontroll endrer bare én konkret egenskap
- like fargeverdier kobler ikke elementer sammen
- fargegruppene avledes fra prosjektstate og lagres ikke som egen palett
- låste elementer vises, men kan ikke endres
- PC og Telefon deler fargene i versjon 7
- knapper beholder ferdig SVG-fargedesign
- bilder har ingen prosjektfarge

## Seksjon-ramme

```text
Ingen = 0 px
1–10 px = synlig solid ramme
```

Rammefargen beholdes når rammen slås av. Høyremeny og `Farger` skriver til samme lagrede verdi. Rammen ligger innenfor elementets eksisterende størrelse.

## Bildeimport og ressursgrenser

```text
PNG
JPEG
WebP
maks filstørrelse: 10 MB
maks dekodet pikselmengde: 40 megapiksler
maks bredde eller høyde: 16 384 px
```

Filtype, byte-størrelse, filnavn og dekodede dimensjoner valideres før elementoppretting. Lokal fil, binærdata og Object URL er transient ressursstate.

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

Gjeldende skjemaversjon er 7.

```text
versjon 1  grunnmodell
versjon 2  tekstinnhold
versjon 3  tekststil
versjon 4  elementlenke
versjon 5  knappasset, knappetekst og knappelenke
versjon 6  bildeasset, metadata, alternativ tekst, visningsmodus og utsnitt
versjon 7  sidebakgrunn, Seksjon-utseende, Seksjon-ramme og tekstfarge
```

Crop-grunnrammen for versjon 6 er låst til 240 × 160 px og forblir invariant i versjon 7. En annen crop-grunnmodell krever ny skjemaversjon og migrering.

## Grenser for senere faser

- Prosjektimport må validere hele prosjektet og skjemaversjonen før `replace-project`.
- Versjon 6 må migreres eller avvises kontrollert.
- Prosjektbytte må avstemme eller tømme den transiente bilderessursbufferen.
- Angre/gjør om skal lagre serialiserbar prosjektstate, aldri `File` eller Object URL.
- Mobiloverstyringer må bruke eksplisitte viewport-spesifikke handlinger.
- Responsive farger krever eksplisitt modellstøtte.
- Autolagring skal reagere på gyldige prosjektmutasjoner, ikke transient editorstate.

## Filstørrelse og ansvar

- 250 linjer er aktiv terskel for ansvarstrekk.
- 300 linjer er hard unntaksgrense.
- alle nye og berørte produksjonsfiler i fase 12 er under 250 linjer
- `reduceColorProjectAction.ts` er 156 linjer
- `RightPropertiesPanel.tsx` skal forbli komposisjon

## Autoritativ dokumentrekkefølge

1. `docs/NEXT_CHAT_PROMPT.md`
2. `docs/WORK_PLAN.md`
3. `docs/PROJECT_COLORS.md`
4. `docs/EDITOR_PLANNING.md`
5. `docs/PROJECT_RULES.md`
6. `README.md`
7. `docs/ELEMENT_MODEL.md`
8. `docs/RIGHT_PROPERTIES_PANEL.md`
9. `docs/CODE_AUDIT.md`
10. relevante fasedokumenter
