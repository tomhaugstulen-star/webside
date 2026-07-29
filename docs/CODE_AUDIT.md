# Kodeaudit og tekniske grenser

Dette dokumentet samler gjeldende arkitekturretning og den framtidsrettede auditen som ble gjennomført før PR for fase 11A.

## 1. Bekreftet arkitekturretning

- `App.tsx` setter sammen applikasjonens providers og skall.
- `EditorShell` eier skalltilstand og komposisjon.
- sentral prosjekt-state eier varige prosjektdata.
- reducer-/state-laget er autoritativ valideringsgrense.
- høyremenyen eier ingen separat elementmodell.
- canvas-komponentene eier ikke filvalg eller ressurslagring.
- bildefiler og Object URL-er ligger utenfor `EditorProject`.
- responsive prosjektverdier lagres i prosjektmodellen, ikke i DOM-en.
- automatisk lagring og prosjektimport bygges senere mot den serialiserbare modellen.

## 2. Faste filgrenser

- 250 linjer er aktiv terskel for ansvarstrekk.
- 300 linjer er hard unntaksgrense.
- en fil deles tidligere når den får flere tydelige ansvar.
- `RightPropertiesPanel.tsx` skal være komposisjon.
- tilfeldig generell `features`-samlemappe skal ikke innføres.

Etter fase-11A-auditen:

```text
EditorCanvasElement.tsx: 189 linjer
ImagePropertiesSection.tsx: 199 linjer
imagePresentation.ts: 198 linjer
useElementPointerTransform.ts: 221 linjer
alle berørte kildefiler: under 250 linjer
```

## 3. Gjeldende prosjekt- og stategrenser

Prosjektskjemaet i leveransen er versjon 6.

Reducerhandlinger skal avvise:

- manglende aktiv side
- manglende element
- element på feil side
- duplisert element-ID
- feil elementtype
- låst element
- ugyldig verdi
- ukjent knappasset-ID
- ugyldig bildeasset eller metadata
- ugyldig visningsmodus eller bildetransform
- crop-geometri som ikke kan fylles ved lagret zoom
- uendret data

Ved avvisning returneres samme state, prosjektet muteres ikke og `updatedAt` endres ikke.

Transient markering, pekerinteraksjon, layout-preview, åpne paneler, drafts, filvelger, bildefil, Object URL, validering, feedback, fokus, hover og dialogstate serialiseres ikke.

## 4. Fase-11A-audit

Auditen ble gjennomført etter at bildeimport, rammeresize og utsnittsredigering fungerte manuelt. Formålet var å finne kode som kunne skape inkonsistens i senere lagrings-, historikk- og responsivfaser.

### Funn 1: dupliserte størrelseskonstanter

Risiko:

- oppretting, minimumsstørrelse og bildeutsnitt kunne utvikle ulike tall
- framtidige elementtyper måtte oppdateres flere steder

Rettelse:

```text
src/model/elementDimensions.ts
```

Denne modulen eier nå autoritative standard- og minimumsstørrelser. Oppretting, layout og bildegrunnramme bruker samme kilde.

### Funn 2: duplisert opprettingsvalidering

Risiko:

- hook og reducer kunne godta ulike opprettingsforespørsler
- UI-validering kunne bli sterkere enn stategrensen

Rettelse:

```text
src/state/isValidElementCreationRequest.ts
```

Hook og reducer bruker nå samme valideringsfunksjon. Reduceren er fortsatt siste autoritative grense.

### Funn 3: crop-invarianter bare i UI

Risiko:

- en direkte action eller framtidig prosjektimport kunne lagre en ramme større enn motivet
- overgang fra en stor contain-ramme kunne gi ugyldig crop-state

Rettelser:

- `isValidElementLayoutForElement` validerer bildegeometri mot aktuell crop-størrelse
- `setImageMode` tilpasser en for stor ramme til en sentrert, gyldig crop-ramme
- `setImageTransform` normaliserer transform mot faktisk ramme
- ugyldig transform avvises
- transform muteres ikke når bildet står i `contain`

Resultat:

Crop-reglene håndheves i modell og reducer, ikke bare av pekerkoden eller høyremenyen.

### Funn 4: manglende tastaturalternativ for motivflytting

Risiko:

- motivflytting var avhengig av draing
- senere tilgjengelighetsarbeid ville måtte bryte opp canvas-komponenten på nytt

Rettelse:

```text
src/components/canvas/canvasElementKeyboard.ts
Alt + piltast = flytt motiv i crop-modus
```

Tastaturlogikken ble trukket ut av `EditorCanvasElement.tsx`. Komponentens ansvar og linjetall ble redusert.

### Funn 5: importflyt kunne bli stående som opptatt

Risiko:

- en framtidig uventet feil etter filvalidering kunne la knappen stå deaktivert
- en delvis registrert ressurs kunne bli liggende igjen

Rettelse:

- importflyten bruker `try/catch/finally`
- `busy` avsluttes alltid
- delvis registrert ressurs fjernes ved feil
- brukeren får en kontrollert feilmelding

### Funn 6: ressursmetadata var ikke fullt krysskontrollert

Risiko:

- filnavn i prosjektmetadata kunne avvike fra faktisk fil
- senere lagring kunne få uklar ressursidentitet

Rettelse:

Ressurslageret krever nå samsvar mellom `File` og metadata for:

- filnavn
- MIME-type
- byte-størrelse

## 5. Bilde- og ressursaudit

Prosjektmodell:

- lagrer stabil `assetId`
- lagrer validert serialiserbar metadata
- lagrer alternativ tekst, visningsmodus og transform
- lagrer aldri lokal filsti, rå binærfil eller Object URL

Ressurslager:

- eier `File` og Object URL
- avviser duplisert ID
- avviser fil/metadata-mismatch
- tilbakekaller Object URL ved fjerning
- tilbakekaller gjenværende URL-er ved provider-unmount
- fjerner ressurs ved mislykket elementoppretting
- fjerner ressurs ved sletting når den ikke deles

Rendering:

- bruker kontrollert fallback ved manglende ressurs
- bruker eksplisitt beregnet layout for contain og crop
- leser ikke prosjektdata fra DOM-en

## 6. Bilderamme- og utsnittsaudit

- ramme og motiv har separate beregninger
- `contain` bruker proporsjonal sentrering
- `crop` bruker fast grunnskala, zoom og normalisert offset
- zoom normaliseres til `1..3`
- minimum crop-zoom avledes fra rammen
- offset begrenses til `-1..1`
- tomrom blir ikke synlig i crop-modus
- rammen kan endres fra åtte retninger
- motsatt kant står fast ved topp-/venstre-resize
- pekertransform bruker transient preview og én commit
- motivdrag bruker transient transform og én commit
- `pointercancel` og tapt capture forkaster draft

## 7. Tilgjengelighetsaudit

- bildealternativ tekst har eksplisitt label og hjelpetekst
- tom alt-tekst er tillatt for dekorative bilder
- feil bruker `role="alert"`
- lagringsfeedback bruker `role="status"`
- radiofelt grupperer visningsmodus
- zoom har tilgjengelig label og prosentverdi
- hjelpetekst beskriver peker og `Alt + piltast`
- låste kontroller er deaktivert
- tilgjengelig canvas-label beskriver relevante snarveier
- `prefers-reduced-motion` respekteres

## 8. Sluttkontroll etter audit

Brukerens lokale terminaloutput bekreftet:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 89 moduler, 228 avhengigheter, ingen brudd
Vite: 98 moduler transformert
CSS: 31.07 kB, gzip 6.07 kB
JavaScript: 255.44 kB, gzip 77.18 kB
produksjonsbuild: bestått
```

Manuell kontroll ble godkjent for:

- PNG-, JPEG- og WebP-import
- avbrytelse og feilvalidering
- markering, flytting og låsing
- rammeresize fra alle kanter og hjørner
- `Hele bildet` og `Juster utsnitt`
- zoom, reset og motivflytting
- sletting og ressursopprydding
- manglende ressursfallback
- PC og Telefon

Arkitekturrapportene ble regenerert etter siste audit og commitet på feature-branchen.

## 9. Gjenstående før merge

- sluttfør og kontroller dokumentasjonsdiffen
- trekk feature-branchen lokalt
- kontroller `git diff --check` og clean tree
- opprett PR med `Closes #25`
- kontroller mergebarhet, changed files, review-tråder og CI
- merge bare etter eksplisitt brukergodkjenning
