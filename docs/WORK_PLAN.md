# Arbeidsplan for Website-editoren

Dette dokumentet fastsetter utviklingsrekkefølge og kontrollkrav. Det utvikles aldri direkte på `main`.

## 1. Fast arbeidsflyt

For hver avgrensede del:

1. Kontroller riktig branch og rent arbeidsområde.
2. Oppdater og kontroller faktisk `origin/main`.
3. Opprett én avgrenset feature- eller docs-branch.
4. Definer brukerhandlinger, varig state og transient state.
5. Lås produkt-, validerings- og designvalg før produksjonskode.
6. Implementer bare avtalt omfang.
7. Trekk ut ansvar før en kildefil passerer 250 linjer.
8. Gjennomfør framtidsrettet kodeaudit.
9. Kjør automatiske kontroller etter siste produksjonsendring.
10. Regenerer arkitekturrapporter ved strukturendringer.
11. Test PC, Telefon, peker og tastatur der det er relevant.
12. Oppdater nødvendig dokumentasjon.
13. Kontroller synkronisert branch og clean tree.
14. Opprett eller oppdater PR og kontroller diff, mergebarhet, review-tråder og CI.
15. Merge bare etter eksplisitt brukergodkjenning.
16. Oppdater lokal `main` og kontroller clean tree før neste fase.

Produksjonsbrancher bruker normalt:

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
git diff --check
```

## 2. Gjeldende status

```text
aktiv leveranse: fase 11A – bildeimport, ramme og utsnitt
branch: feature/image-import-and-placement
GitHub-sak: #25
PR: #26 – åpen, ikke draft
base main: 7e4c71f
prosjektskjema i leveransen: versjon 6
implementering: ferdig
kodeaudit: ferdig
PC- og Telefon-test: godkjent
automatiske kontroller: godkjent
arkitekturrapporter: regenerert og commitet
dokumentasjon: sluttføres etter siste resize-rettelser
merge: ikke godkjent eller utført
```

Faktisk branch- og `main`-HEAD skal leses fra Git. Commitnumre i dokumentasjonen er historiske kontrollpunkter, ikke permanente forventede topper.

Siste verifiserte produksjonskontroll:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 91 moduler, 237 avhengigheter, ingen brudd
Vite: 100 moduler transformert
CSS: 31.06 kB, gzip 6.06 kB
JavaScript: 258.04 kB, gzip 77.94 kB
produksjonsbuild: bestått
PC og Telefon: godkjent
```

## 3. Fase 11A – ferdig på feature-branchen

Leveransen omfatter:

- lokal filvelger gjennom `Elementer -> Bilde`
- PNG, JPEG og WebP
- maksimal filstørrelse 10 MB
- synlige feil for ugyldig type, størrelse og dekoding
- avbrutt filvalg uten prosjektmutasjon
- skjemaversjon 6
- stabil bilde-`assetId`
- serialiserbar filmetadata
- `altText`
- `mode: contain | crop`
- serialiserbar zoom og normalisert offset
- separat transient ressursbuffer for `File` og Object URL
- kontrollert Object URL-opprydding
- fallback ved manglende ressurs
- Seksjon rendres bak Bilde, Tekst og Knapp
- bilderamme med åtte pekergrep på innsiden
- resizing fra topp, bunn, venstre, høyre og hjørner
- motsatt kant står fast ved kanthåndtering
- `Hele bildet` med proporsjonal skalering og sentrering
- `Juster utsnitt` uten synlige tomrom
- crop-resize klipper motivet uten automatisk skalering eller sentrering
- motivets absolutte plassering bevares når rammekanten flyttes
- motivflytting med peker
- `Shift + dra` for å flytte hele rammen i utsnittsmodus
- `Alt + piltast` for tastaturstyrt motivflytting fra editoren og relevante høyremenyfelt
- zoom mellom 100 og 300 prosent, begrenset av rammens minimumsbehov
- kontrollert reset av utsnitt
- alternativ tekst, visning, zoom, metadata og sletting i høyremenyen
- låst bilde kan inspiseres, men ikke muteres eller slettes
- desktopgeometri arves foreløpig av Telefon

## 4. Auditutfall for fase 11A

Oppryddingen før PR samlet framtidige invariantgrenser:

- elementenes standard- og minimumsstørrelser har én modellkilde
- opprettingsvalidering deles av hook og reducer
- crop-rammens maksimum håndheves også i reduceren
- overgang fra `Hele bildet` til `Juster utsnitt` produserer gyldig ramme
- bildeimport rydder opptatt-status og delvis registrerte ressurser ved feil
- ressurslageret kontrollerer at fil og metadata samsvarer
- tastaturlogikk for motivflytting ligger i en avgrenset editor-hook
- `Alt + venstre/høyre` stoppes før nettleseren kan navigere historikk
- Seksjon får deterministisk bakgrunnslagring uten å endre prosjektets elementrekkefølge
- crop-resize beregner ny normalisert offset for å bevare motivets absolutte plassering
- ramme og korrigert transform lagres atomisk gjennom `set-image-desktop-frame`
- `EditorCanvasElement.tsx` er under 200 linjer
- `useElementPointerTransform.ts` er 218 linjer
- `imagePresentation.ts` er 240 linjer
- alle berørte kildefiler er under 250 linjer

## 5. Ferdig og merget før fase 11A

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
- dokumentasjonsstatus etter knappbiblioteket – PR #22 og PR #24

## 6. Neste handling

Ingen ny produksjonsfase startes fra denne branchen.

Etter denne dokumentoppdateringen:

1. trekk siste feature-branch lokalt
2. kontroller `git status`, `git diff --check` og dokumentdiffen etter siste rapportcommit
3. oppdater PR #26-beskrivelsen med siste funksjons- og kontrollstatus
4. kontroller PR-ens mergebarhet, changed files, review-tråder og CI på nytt
5. presenter PR #26 for eksplisitt brukergodkjenning
6. merge først etter ordet `godkjent`
7. oppdater lokal `main` og kontroller clean tree
8. velg neste fase eksplisitt

## 7. Senere faser

Ingen senere fase er aktiv før omfanget er eksplisitt valgt og godkjent.

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

## 8. Faste tekniske grenser

- 250 linjer er aktiv terskel for ansvarstrekk i kildefiler.
- 300 linjer er hard unntaksgrense.
- Canvas-komponentene skal ikke samle egenskaps-, ressurs- og stateansvar.
- `RightPropertiesPanel.tsx` skal forbli komposisjon.
- Varige prosjektdata endres bare gjennom validerte reducerhandlinger.
- Ugyldige og uendrede handlinger returnerer samme state.
- Transient markering, drafts, pekerøkter, filer, Object URL-er, fokus og feedback serialiseres ikke.
- Ingen branch merges uten eksplisitt brukergodkjenning.
