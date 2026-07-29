# Kodeaudit og tekniske grenser

Dette dokumentet samler gjeldende arkitekturretning og den framtidsrettede auditen som ble gjennomført og utvidet under kontrollen av PR #26 for fase 11A.

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

Etter de siste fase-11A-rettelsene:

```text
EditorCanvasElement.tsx: under 200 linjer
ImagePropertiesSection.tsx: 199 linjer
imagePresentation.ts: 240 linjer
useElementPointerTransform.ts: 218 linjer
setImageDesktopFrame.ts: 88 linjer
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
- ramme og transform som ikke er konsistente
- uendret data

Ved avvisning returneres samme state, prosjektet muteres ikke og `updatedAt` endres ikke.

Transient markering, pekerinteraksjon, layout-preview, preview-transform, åpne paneler, drafts, filvelger, bildefil, Object URL, validering, feedback, fokus, hover og dialogstate serialiseres ikke.

## 4. Fase-11A-audit

Auditen ble gjennomført etter at bildeimport, rammeresize og utsnittsredigering fungerte manuelt. Den ble utvidet da PR-testen avdekket interaksjonsfeil som automatiske kontroller ikke kunne finne.

### Funn 1: dupliserte størrelseskonstanter

Risiko:

- oppretting, minimumsstørrelse og bildeutsnitt kunne utvikle ulike tall
- framtidige elementtyper måtte oppdateres flere steder

Rettelse:

```text
src/model/elementDimensions.ts
```

Denne modulen eier autoritative standard- og minimumsstørrelser. Oppretting, layout og bildegrunnramme bruker samme kilde.

### Funn 2: duplisert opprettingsvalidering

Risiko:

- hook og reducer kunne godta ulike opprettingsforespørsler
- UI-validering kunne bli sterkere enn stategrensen

Rettelse:

```text
src/state/isValidElementCreationRequest.ts
```

Hook og reducer bruker samme valideringsfunksjon. Reduceren er fortsatt siste autoritative grense.

### Funn 3: crop-invarianter bare i UI

Risiko:

- en direkte action eller framtidig prosjektimport kunne lagre en ramme større enn motivet
- overgang fra en stor contain-ramme kunne gi ugyldig crop-state

Rettelser:

- `isValidElementDesktopLayout` validerer bildegeometri mot aktuell crop-størrelse
- `setImageMode` tilpasser en for stor ramme til en sentrert, gyldig crop-ramme
- `setImageTransform` normaliserer transform mot faktisk ramme
- ugyldig transform avvises
- transform muteres ikke når bildet står i `contain`

Resultat:

Crop-reglene håndheves i modell og reducer, ikke bare av pekerkoden eller høyremenyen.

### Funn 4: motivets tastatursnarvei var fokusavhengig

Risiko:

- `Alt + piltast` fungerte bare når canvas-elementet hadde fokus
- bruk av høyremeny eller zoom-slider gjorde snarveien utilgjengelig
- `Alt + venstre/høyre` kunne aktivere nettleserhistorikk

Rettelse:

```text
src/components/editor/useSelectedImageCropKeyboard.ts
```

Den valgte bildeutsnittssnarveien håndteres på editornivå. Den virker fra canvas og relevante høyremenyfelt, men blokkeres i tekstredigering og dialoger. Nettleserens standardnavigasjon stoppes. Vanlig steg er 4 px; `Shift + Alt + piltast` bruker 20 px.

Vanlige piltaster på canvas-elementet beholder ansvar for elementflytting og `Ctrl/Cmd + piltast` for størrelse.

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

Ressurslageret krever samsvar mellom `File` og metadata for:

- filnavn
- MIME-type
- byte-størrelse

### Funn 7: Seksjon kunne dekke et senere opprettet bilde

Risiko:

- visuelt innhold kunne forsvinne bak en Seksjon avhengig av opprettingsrekkefølge
- brukerens oppfatning av Seksjon som bakgrunn ble brutt

Rettelse:

Canvas-rendering deler elementene i Seksjon og forgrunnselementer. Seksjon rendres først, mens Bilde, Tekst og Knapp rendres over. Prosjektets flate elementrekkefølge og datamodell endres ikke.

### Funn 8: bilderammens grep skapte en ekstra utvendig kant

Risiko:

- grep og outline gjorde det vanskelig å se den faktiske klippekanten
- presis plassering helt inntil motivet ble visuelt uklar

Rettelse:

- bildeelementets interne border ble fjernet
- selection-outline ligger direkte mot bilderammen
- alle åtte synlige grep og treffområder ligger innenfor rammen
- resize-retninger og hitbox-størrelse er beholdt

### Funn 9: crop-resize sentrerte motivet på nytt

Risiko:

- samme normaliserte offset ble tolket mot et nytt overløp
- side- og toppresize flyttet eller sentrerte motivet automatisk
- rammen kunne bli mindre uten at brukeren opplevde reell klipping
- layout og transform kunne bli commitet som separate mellomtilstander

Rettelser:

```text
src/model/imagePresentation.ts
  getImageTransformForResizedFrame

src/state/setImageDesktopFrame.ts
  set-image-desktop-frame
```

Ved crop-resize beregnes motivets absolutte posisjon fra den opprinnelige rammen. Ny normalisert offset avledes mot den nye rammen. Zoom og motivstørrelse beholdes. Aktiv kant flyttes, motsatt kant står fast og rammen klipper mer eller mindre av et stasjonært motiv.

Ramme og korrigert transform lagres atomisk i én reducerhandling. Preview bruker samme beregning som committen.

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
- rendrer Seksjon deterministisk bak forgrunnselementer
- leser ikke prosjektdata fra DOM-en

## 6. Bilderamme- og utsnittsaudit

- ramme og motiv har separate beregninger
- `contain` bruker proporsjonal skalering og sentrering etter rammen
- `crop` bruker fast grunnskala, zoom og normalisert offset
- zoom normaliseres til `1..3`
- minimum crop-zoom avledes fra rammen
- offset begrenses til `-1..1`
- tomrom blir ikke synlig i crop-modus
- rammen kan endres fra åtte retninger
- grepene ligger innenfor rammen
- motsatt kant står fast ved alle kanthåndtak
- crop-resize bevarer motivets størrelse og absolutte plassering
- crop-resize skalerer eller sentrerer ikke motivet automatisk
- pekertransform bruker transient preview og én commit
- ramme og transform committes atomisk
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
- `Alt + piltast` fungerer etter bruk av zoomkontrollen
- låste kontroller er deaktivert
- tilgjengelig canvas-label beskriver relevante snarveier
- `prefers-reduced-motion` respekteres

## 8. Sluttkontroll etter siste produksjonsendring

Brukerens lokale terminaloutput bekreftet:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 91 moduler, 237 avhengigheter, ingen brudd
Vite: 100 moduler transformert
CSS: 31.06 kB, gzip 6.06 kB
JavaScript: 258.04 kB, gzip 77.94 kB
produksjonsbuild: bestått
```

Manuell kontroll ble godkjent for:

- PNG-, JPEG- og WebP-import
- avbrytelse og feilvalidering
- markering, flytting og låsing
- Seksjon bak bilde og øvrig innhold
- rammeresize fra alle kanter og hjørner
- grep på innsiden av bilderammen
- `Hele bildet` og `Juster utsnitt`
- zoom, reset og motivflytting
- `Alt + piltast`
- crop-resize med stasjonært motiv og fast motsatt kant
- sletting og ressursopprydding
- manglende ressursfallback
- PC og Telefon

Arkitekturrapportene ble regenerert etter siste resize- og state-endring og commitet på feature-branchen i `94ed2fb`.

## 9. Gjenstående før merge

- trekk siste dokumentcommits lokalt
- kontroller dokumentdiffen etter `94ed2fb` med `git diff --check`
- kontroller clean og synkronisert feature-branch
- oppdater PR #26-beskrivelsen med siste funksjons- og kontrollstatus
- kontroller PR-ens mergebarhet, changed files, review-tråder og CI på nytt
- merge bare etter eksplisitt brukergodkjenning
