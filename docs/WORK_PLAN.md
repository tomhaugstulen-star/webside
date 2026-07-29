# Arbeidsplan for Website-editoren

Dette dokumentet fastsetter utviklingsrekkefølge og kontrollkrav. Det utvikles aldri direkte på `main`.

## 1. Fast arbeidsflyt

For hver avgrensede del:

1. Kontroller riktig branch og clean tree.
2. Oppdater og kontroller faktisk `origin/main`.
3. Bruk én avgrenset feature- eller docs-branch.
4. Definer brukerhandlinger, varig state og transient state.
5. Lås produkt-, validerings- og designvalg før produksjonskode.
6. Implementer bare avtalt omfang.
7. Trekk ut ansvar før en kildefil passerer 250 linjer.
8. Gjennomfør framtidsrettet kodeaudit.
9. Kjør automatiske kontroller etter siste produksjonsendring.
10. Test PC, Telefon, peker og tastatur der det er relevant.
11. Regenerer arkitekturrapporter etter struktur- eller avhengighetsendringer.
12. Oppdater all autoritativ dokumentasjon.
13. Kontroller synkronisert branch og clean tree.
14. Kontroller PR-diff, mergebarhet, reviews og CI.
15. Merge bare etter eksplisitt brukergodkjenning.
16. Oppdater lokal `main` før neste fase.

Normale kontroller:

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
git diff --check
```

## 2. Gjeldende status

```text
siste fullførte leveranse: fase 11A – bildeimport, ramme og utsnitt
GitHub-sak: #25 – lukket som fullført
PR: #26 – merget
mergecommit på main: f5e46577a15b548fc6c0140cd05b13ae554a6b76
prosjektskjema: versjon 6
manuell test: godkjent
automatiske kontroller: godkjent
framtidsrettet sluttaudit: ferdig
arkitekturrapporter: regenerert, ingen diff
lokal main: synkronisert og clean
neste produksjonsfase: ikke valgt
```

Faktisk branch- og `main`-HEAD leses fra Git.

## 3. Siste verifiserte produksjonskontroll

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 91 moduler, 237 avhengigheter, ingen brudd
Vite: 100 moduler transformert
CSS: 30.95 kB, gzip 6.04 kB
JavaScript: 258.38 kB, gzip 78.09 kB
produksjonsbuild: bestått på 185 ms
PC og Telefon: godkjent
```

## 4. Fase 11A – ferdig og merget funksjonsomfang

Leveransen omfatter:

- lokal filvelger gjennom `Elementer -> Bilde`
- PNG, JPEG og WebP
- maksimal filstørrelse 10 MB
- maksimal dekodet størrelse 40 megapiksler
- maksimal bredde eller høyde 16 384 px
- synlige feil for type, størrelse, dimensjon og dekoding
- avbrutt filvalg uten prosjektmutasjon
- avbrutt behandling etter panel-unmount
- skjemaversjon 6
- stabil bilde-`assetId`
- serialiserbar metadata
- alternativ tekst
- `contain | crop`
- zoom og normalisert offset
- versjon-6-crop-grunnramme låst til 240 × 160 px
- transient ressursbuffer for `File` og Object URL
- kontrollert URL-opprydding
- fallback ved manglende ressurs
- åtte resizegrep på innsiden
- resizing fra alle kanter og hjørner
- motsatt kant står fast
- crop-resize bevarer motivets størrelse og absolutte plassering
- ramme og transform lagres atomisk
- `Hele bildet` og `Juster utsnitt`
- motivflytting med peker og tastatur
- `Shift + dra` for rammeflytting
- zoom 100–300 prosent
- reset av utsnitt
- metadata og sletting i høyremenyen
- låste bilder kan inspiseres, men ikke muteres
- Telefon arver desktopgeometri
- Seksjon rendres bak forgrunnsinnhold

## 5. Sluttauditens utfall

Auditen bekreftet eller rettet:

- én modellkilde for standard- og minimumsstørrelser
- delt opprettingsvalidering mellom hook og reducer
- crop-invarianter i modell og reducer
- atomisk ramme- og transformcommit
- global, kontrollert `Alt + piltast`
- trygg import ved feil og unmount
- fil/metadata-samsvar i ressurslageret
- dekodet dimensjonsgrense
- stabil versjon-6-tolkning av crop-transform
- deterministisk bakgrunnslag for Seksjon
- ingen motstridende bildestil i `canvas.css`
- alle berørte kildefiler under 250 linjer

## 6. Ferdige og mergede leveranser

- fase 0: stabilt editorgrunnlag
- fase 1: prosjekt- og elementmodell
- fase 2: markering
- fase 3: elementoppretting
- fase 4: flytting og resizing – PR #4
- fase 5: objektlåsing – PR #5
- fase 6: ren tekstredigering – PR #7
- menynavn og rekkefølge – PR #8
- fase 7: høyremenyens grunnstruktur – PR #9
- fase 8: tekstegenskaper – PR #11
- elementlenker – PR #14
- fase 9: sikker sletting – PR #16
- dokumentasjonsaudit – PR #19
- fase 10: SVG-knappbibliotek – PR #21
- dokumentasjonsstatus – PR #22 og PR #24
- fase 11A: bildeimport, ramme og utsnitt – PR #26

## 7. Neste handling

Ingen produksjonsfase er valgt.

Før neste fase:

1. kontroller at lokal `main` er synkronisert og clean
2. velg fase og lås omfanget sammen med brukeren
3. opprett en ny branch fra oppdatert `main`
4. opprett eller oppdater GitHub-sak før produksjonskode
5. ikke gjenbruk `feature/image-import-and-placement`

Fase 12 eller en annen produksjonsfase startes ikke automatisk.

## 8. Planlagte senere faser

```text
fase 12  prosjektfarger
fase 13  logo og header
fase 14  korrigeringslinjer
fase 15  responsive mobiloverstyringer
fase 16  angre og gjør om
fase 17  lokal automatisk lagring
fase 18  åpne og importere prosjekt
fase 19  forhåndsvisning og publisering
```

## 9. Obligatoriske framtidsgrenser

- prosjektimport validerer hele prosjektet og skjemaversjonen før `replace-project`
- prosjektbytte avstemmer eller tømmer bilderessursbufferen
- historikk lagrer bare serialiserbar prosjektstate
- mobiloverstyringer bruker viewport-spesifikke actions
- autolagring reagerer på gyldige prosjektmutasjoner
- endret crop-grunnmodell krever ny skjemaversjon og migrering

## 10. Faste tekniske grenser

- 250 linjer er aktiv terskel
- 300 linjer er hard unntaksgrense
- canvas samler ikke egenskaps-, fil- eller ressursansvar
- `RightPropertiesPanel.tsx` forblir komposisjon
- varige data endres bare gjennom validerte reducerhandlinger
- ugyldige og uendrede handlinger returnerer samme state
- transient editor- og ressursstate serialiseres ikke
- ingen branch merges uten eksplisitt godkjenning
