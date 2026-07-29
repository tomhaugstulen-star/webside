# Kodeaudit og tekniske grenser

Dette dokumentet beskriver den framtidsrettede auditen av fase 11A og grensene som skal beskytte senere lagring, import, historikk og responsive utvidelser.

## 1. Arkitekturretning

- `App.tsx` setter sammen providers og editorskall.
- `EditorShell` eier skalltilstand og hovedkomposisjon.
- `EditorProject` er autoritativ kilde for varige prosjektdata.
- reducer-/state-laget er siste valideringsgrense.
- lerret og høyremeny muterer ikke prosjektdata direkte.
- bildefil og Object URL ligger utenfor `EditorProject`.
- responsive verdier lagres i prosjektmodellen, ikke i DOM-en.
- generelle samlemapper og samlefiler skal ikke innføres.

## 2. Filgrenser etter sluttaudit

```text
EditorCanvasElement.tsx: under 200 linjer
ImagePropertiesSection.tsx: 199 linjer
imagePresentation.ts: 236 innholdslinjer
useElementPointerTransform.ts: 218 linjer
ImageImportControl.tsx: 133 linjer
setImageDesktopFrame.ts: under 100 linjer
alle berørte kildefiler: under 250 linjer
```

250 linjer er aktiv terskel for ansvarstrekk. 300 linjer er hard unntaksgrense.

## 3. State- og reducergrenser

Prosjektskjemaet i leveransen er versjon 6.

Reducerhandlinger avviser:

- manglende aktiv side eller element
- element på feil side
- duplisert element-ID
- feil elementtype
- låst element
- ugyldige eller ikke-finite verdier
- ukjent knappasset-ID
- ugyldig bildeasset eller metadata
- ukjent bildevisningsmodus
- ugyldig bildetransform
- crop-geometri som ikke kan fylles ved lagret zoom
- inkonsistent bilderamme og transform
- uendret data

Ved avvisning returneres samme state. Prosjektet og `updatedAt` endres ikke.

Transient markering, pekerøkter, preview, drafts, panelstate, filvelger, `File`, Object URL, fokus, hover, feedback og dialogstate serialiseres ikke.

## 4. Auditfunn og rettelser

### Funn 1: dupliserte størrelseskonstanter

Standard- og minimumsstørrelser ble samlet i `src/model/elementDimensions.ts`. Oppretting og layout bruker samme modellkilde.

### Funn 2: duplisert opprettingsvalidering

`src/state/isValidElementCreationRequest.ts` brukes av både UI-hook og reducer. Reduceren er fortsatt autoritativ.

### Funn 3: crop-invarianter lå bare i UI

Modell og reducer håndhever nå:

- maksimal crop-ramme ved aktuell zoom
- gyldig overgang fra contain til crop
- transformnormalisering mot faktisk ramme
- ingen skjult transformmutasjon i contain
- atomisk lagring av ramme og korrigert transform

### Funn 4: `Alt + piltast` var fokusavhengig

`useSelectedImageCropKeyboard.ts` håndterer snarveien på editornivå. Den fungerer etter bruk av zoomkontrollen, blokkeres i tekstfelter og dialoger, og stopper nettleserhistorikk på `Alt + venstre/høyre`.

```text
Alt + piltast          4 px
Shift + Alt + piltast 20 px
```

### Funn 5: import kunne bli stående opptatt eller fortsette etter panelbytte

Importflyten bruker `try/catch/finally`, rydder delvis registrert ressurs og oppdaterer ikke UI eller prosjekt etter at Elementer-panelet er demontert.

### Funn 6: ressursmetadata kunne avvike fra faktisk fil

Ressurslageret krever samsvar for filnavn, MIME-type og byte-størrelse. Duplisert `assetId` avvises.

### Funn 7: Seksjon kunne dekke forgrunnsinnhold

Seksjon rendres først som bakgrunnslag. Bilde, Tekst og Knapp rendres over uten at lagret elementrekkefølge eller den flate prosjektmodellen endres.

### Funn 8: bilderammen hadde motstridende CSS

Bildets interne border og bakgrunn eies bare av `image-element.css`. Den gamle regelen i `canvas.css` er fjernet, slik at korrekt rendering ikke avhenger av CSS-importrekkefølgen.

### Funn 9: grep og outline skapte ekstra utvendig kant

Alle åtte grep og treffområder ligger innenfor rammen. Selection-outline ligger direkte mot bilderammen.

### Funn 10: crop-resize sentrerte motivet på nytt

`getImageTransformForResizedFrame` bevarer motivets absolutte plassering. Zoom og motivstørrelse endres ikke. Aktiv kant flyttes, motsatt kant står fast, og ny normalisert offset beregnes mot den nye rammen.

`set-image-desktop-frame` lagrer ramme og transform atomisk.

### Funn 11: crop-geometri var koblet til en senere endringsbar standardstørrelse

Crop-grunnrammen for skjemaversjon 6 er nå eksplisitt låst til 240 × 160 px. Senere endring av standardstørrelsen for nye bilder kan derfor ikke endre utsnitt i eksisterende versjon-6-prosjekter.

En annen crop-grunnmodell krever ny skjemaversjon og migrering.

### Funn 12: filstørrelse begrenset ikke dekodet minnebruk

Import avviser nå bilder som overstiger:

```text
10 MB filstørrelse
40 megapiksler
16 384 px bredde eller høyde
```

Samme dimensjonsregler inngår i metadata-valideringen i modellaget.

### Funn 13: import kunne fullføre etter at kontrollen var demontert

`ImageImportControl` bruker en monteringsreferanse. Etter unmount opprettes ingen ressurs, intet element og ingen lokal state-oppdatering.

## 5. Ressurslivssyklus

Prosjektmodell:

- lagrer stabil `assetId`
- lagrer validert serialiserbar metadata
- lagrer alt-tekst, modus og transform
- lagrer aldri filsti, `File`, Blob eller Object URL

Ressurslager:

- eier `File` og Object URL
- avviser duplisert ID og metadataavvik
- tilbakekaller URL ved ressursfjerning
- tilbakekaller alle gjenværende URL-er ved provider-unmount
- fjerner ressurs ved mislykket elementoppretting
- fjerner ressurs ved sletting når asset ikke deles

## 6. Bildegeometri

- `contain` skalerer hele motivet proporsjonalt og sentrerer det.
- `crop` bruker fast versjon-6-grunnskala, zoom og normalisert offset.
- zoom normaliseres til `1..3`.
- minimum zoom avledes fra rammen.
- offset begrenses til `-1..1`.
- tomrom kan ikke bli synlig i crop.
- rammen kan endres fra åtte retninger.
- rammeresize bevarer motivets størrelse og absolutte plassering.
- pekertransform bruker transient preview og én commit.
- `pointercancel` og tapt capture forkaster draft.

## 7. Tilgjengelighet

- eksplisitt label og hjelpetekst for alt-tekst
- tom alt-tekst er gyldig for dekorative bilder
- feil bruker `role="alert"`
- lagringsfeedback bruker `role="status"`
- radiofelt grupperes med fieldset og legend
- zoom har label og synlig prosentverdi
- tastatur- og pekerhjelp er dokumentert i UI
- låste kontroller er deaktivert
- canvas-label beskriver relevante snarveier
- `prefers-reduced-motion` respekteres

## 8. Verifisert sluttkontroll

Brukerens lokale terminaloutput etter siste produksjonsendring:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 91 moduler, 237 avhengigheter, ingen brudd
Vite: 100 moduler transformert
CSS: 30.95 kB, gzip 6.04 kB
JavaScript: 258.38 kB, gzip 78.09 kB
produksjonsbuild: bestått på 185 ms
```

Manuell kontroll er godkjent for import, validering, lagrekkefølge, ramme, crop, zoom, tastatur, låsing, sletting, fallback, PC og Telefon.

## 9. Obligatoriske grenser for senere faser

### Prosjektimport

- valider hele prosjektobjektet før `replace-project`
- krev kjent skjemaversjon
- avvis eller migrer eldre og nyere skjema kontrollert
- ikke la importert metadata opprette Object URL uten en faktisk validert fil

### Prosjektbytte

- avstem eller tøm bilderessursbufferen
- tilbakekall URL-er som ikke lenger tilhører aktivt prosjekt

### Angre og gjør om

- historikk inneholder bare serialiserbar prosjektstate
- `File`, Object URL og aktive pekerøkter skal aldri inngå

### Mobiloverstyringer

- bruk viewport-spesifikke geometrihandlinger
- ikke skriv mobilendringer inn i desktopfeltet

### Autolagring

- reager bare på gyldige prosjektmutasjoner
- ikke lagre transient editor- eller ressursstate direkte

## 10. Gjenstående før merge

- regenerer `architecture.json` og `docs/dependency-graph.mmd`
- kontroller at bare rapportene endres
- commit og push rapportene
- trekk og kontroller alle dokumentendringer lokalt
- kontroller `git diff --check`, clean tree, PR-head, mergebarhet, reviews og CI
- merge bare etter eksplisitt brukergodkjenning
