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
7. Kontroller filstørrelser og trekk ut ansvar før en kildefil passerer 250 linjer.
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
siste fullførte produksjonsfase: fase 12 – prosjektfarger og Seksjon-rammer
GitHub-sak: #28 – lukket som fullført
PR: #29 – merget
mergecommit på main: a781b85a718ed6e5254530849299db8dfff3dfb6
prosjektskjema: versjon 7
implementering, audit og manuell test: godkjent
automatiske kontroller: bestått
arkitekturrapporter: regenerert og committet i 1963088
lokal main: brukeren har bekreftet clean tree etter merge
aktiv docs-branch: docs/phase-12-handover
neste produksjonsfase: fase 13 – Logo og header, omfang ikke låst
```

Faktisk branch-, PR- og `main`-HEAD leses fra GitHub/Git. Commitnumre i dokumentasjonen er kontrollpunkter, ikke permanente forventede topper.

## 3. Siste verifiserte automatiske kontroll

Brukerens lokale terminaloutput etter siste produksjonsendring bekreftet:

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

`architecture.json` og `docs/dependency-graph.mmd` ble regenerert og committet i `1963088`, som inngikk i PR #29.

## 4. Fase 12 – implementert funksjonsomfang

Leveransen omfatter:

- sidebakgrunn som serialiserbar sideverdi
- Seksjon-bakgrunn som serialiserbar elementverdi
- Seksjon-ramme med `0–10 px` og egen farge
- tekstfarge i eksisterende `TextElementStyle`
- validert og normalisert `EditorColor` i formatet `#RRGGBB`
- avledet `Farger`-oversikt for aktiv side
- én uavhengig fargekontroll per konkret egenskap
- rammefarge i `Farger` bare når rammebredden er større enn `0`
- samme rammeverdi i høyremeny og venstremeny
- låste elementer vises, men kan ikke muteres
- felles farger for PC og Telefon
- native, tastaturtilgjengelig fargevelger

Knapper beholder ferdig SVG-fargedesign og inngår ikke i fargeredigeringen. Bilder har ingen prosjektfarge og vises ikke i `Farger`.

## 5. Sluttauditens utfall

Auditen bekrefter:

- fargeoversikten lagres ikke som en separat palett
- DOM og CSS brukes ikke som permanent fargekilde
- rammebredder valideres fra én modellkilde
- rammeetiketter genereres fra samme verdiliste
- `RightPropertiesPanel.tsx` forblir komposisjon
- sentral reducer delegerer fargeansvar
- ugyldige, låste og uendrede handlinger returnerer samme state
- `updatedAt` endres bare ved gyldig reell mutasjon
- selection-outline og tekstens editorgrense er ikke publiserbare rammer
- fargeendring påvirker ikke geometri, crop, lagrekkefølge eller ressursstate
- alle nye og berørte produksjonsfiler er under 250 linjer

Detaljene står i `docs/PROJECT_COLORS.md`.

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
- fase 12: prosjektfarger og Seksjon-rammer – PR #29

## 7. Neste handling

Fullfør dokumentasjonssynkroniseringen på `docs/phase-12-handover` uten produksjonskode:

```powershell
git fetch origin
git switch docs/phase-12-handover
git pull --ff-only origin docs/phase-12-handover
git status
git log -6 --oneline --decorate
```

Kontroller at statusdokumentene beskriver PR #29 som merget og fase 12 som fullført. Kontroller diffen mot `main`, opprett en ren docs-PR og merge den bare etter eksplisitt godkjenning.

Etter docs-merge:

1. oppdater lokal `main`
2. kontroller clean tree
3. avgrens fase 13 sammen med brukeren
4. opprett ny feature-branch fra oppdatert `main`
5. start ikke produksjonskode før modell, brukerflyt, ressursansvar og responsiv oppførsel er låst

## 8. Planlagte senere faser

```text
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
- versjon 6 må migreres eller avvises kontrollert ved framtidig import
- prosjektbytte avstemmer eller tømmer bilderessursbufferen
- historikk lagrer bare serialiserbar prosjektstate
- mobiloverstyringer bruker viewport-spesifikke actions
- responsive farger krever eksplisitte viewport-spesifikke handlinger
- autolagring reagerer på gyldige prosjektmutasjoner
- endret crop-grunnmodell krever ny skjemaversjon og migrering

## 10. Faste tekniske grenser

- 250 linjer er aktiv terskel for ansvarstrekk
- 300 linjer er hard unntaksgrense
- linjetall kontrolleres før en stor fil utvides og igjen før PR
- filer deles etter reelt ansvar, ikke mekanisk
- canvas samler ikke egenskaps-, fil- eller ressursansvar
- `RightPropertiesPanel.tsx` forblir komposisjon
- varige data endres bare gjennom validerte reducerhandlinger
- ugyldige og uendrede handlinger returnerer samme state
- transient editor- og ressursstate serialiseres ikke
- ingen branch merges uten eksplisitt godkjenning