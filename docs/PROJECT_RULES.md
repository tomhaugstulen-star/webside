# Prosjektregler

Dette dokumentet fastsetter arbeidsmåte, arkitekturgrenser og produktansvar for Website-editoren.

## 1. Repo- og branchkontroll

Faktisk branch- og `main`-HEAD leses alltid fra Git.

```powershell
git fetch origin
git status
git log -6 --oneline --decorate
```

Regler:

- utvikling skjer aldri direkte på `main`
- hver funksjon eller dokumentasjonsfase har en avgrenset branch
- `main` skal være stabil
- branchen synkroniseres kontrollert dersom den ligger bak `main`
- ingen skjult funksjonalitet for senere faser legges inn
- merge krever eksplisitt brukergodkjenning
- ny produksjonsbranch starter først etter godkjent merge og oppdatert lokal `main`

Gjeldende status:

```text
siste fullførte leveranse: fase 11A – bildeimport, ramme og utsnitt
GitHub-sak: #25 – lukket som fullført
PR: #26 – merget
mergecommit på main: f5e46577a15b548fc6c0140cd05b13ae554a6b76
prosjektskjema: versjon 6
lokal main: synkronisert og clean
neste produksjonsfase: ikke valgt
```

## 2. Filstørrelser og ansvar

- 250 linjer er aktiv terskel for ansvarstrekk
- 300 linjer er hard unntaksgrense
- filer deles etter ansvar, ikke tilfeldig
- `App.tsx` setter bare sammen hovedproviders og skall
- `EditorShell` koordinerer skalltilstand og komposisjon
- `RightPropertiesPanel.tsx` forblir komposisjon
- canvas eier ikke filvalg eller ressurslagring
- store CSS-filer deles etter editorområde
- motstridende regler for samme komponent skal ikke fordeles mellom generelle og spesifikke stilark
- tilfeldig generell `features`-mappe eller samlefil skal ikke innføres

Etter fase-11A-auditen:

```text
alle berørte kildefiler: under 250 linjer
EditorCanvasElement.tsx: under 200 linjer
useElementPointerTransform.ts: 218 linjer
imagePresentation.ts: 236 innholdslinjer
ImageImportControl.tsx: 133 linjer
```

## 3. Autoritativ prosjektmodell

- `EditorProject` eier alle varige prosjektdata
- gjeldende prosjektskjema er versjon 6
- DOM-en er ikke permanent lagring
- Object URL er ikke prosjektdata
- ID-er er stabile og kryptografisk generert
- reduceren er deterministisk for samme state og action
- `updatedAt` endres bare ved reell og gyldig prosjektmutasjon

Skjemahistorikk:

```text
versjon 1  grunnmodell
versjon 2  tekstinnhold
versjon 3  tekststil
versjon 4  elementlenke
versjon 5  knappasset, knappetekst og knappelenke
versjon 6  bildeasset, metadata, alternativ tekst, visningsmodus og utsnitt
```

## 4. Varig og transient state

Varig prosjektdata omfatter:

- sider og elementer
- responsiv geometri og synlighet
- låsestatus
- tekstinnhold, tekststil og lenke
- knappens asset-ID og label
- bildets asset-ID, metadata, alt-tekst, modus og transform
- tidsstempler

Transient state omfatter:

- markering og aktivt verktøy
- pekerøkter og preview
- åpne paneler og dialoger
- redigerings- og formulardrafts
- filvelger og feedback
- `File`, Object URL og ressurskart
- fokus, hover og animasjon

Transient state skal ikke serialiseres, publiseres eller inngå direkte i historikk eller autolagring.

## 5. State- og reducergrenser

Alle varige endringer går gjennom typede actions.

Reducergrensene avviser:

- manglende aktiv side eller element
- element på feil side
- duplisert element-ID
- feil elementtype
- låst element
- ugyldig eller ikke-finit verdi
- ukjent knappasset-ID
- ugyldig bildeasset eller metadata
- ukjent visningsmodus
- ugyldig transform
- crop-ramme som ikke kan fylles ved aktuell zoom
- inkonsistent ramme og transform
- uendret data

Ved avvisning returneres samme state og `updatedAt` endres ikke.

## 6. Elementstørrelser og layout

Standard- og minimumsstørrelser har én modellkilde.

```text
Standard:
Seksjon  320 × 180 px
Bilde    240 × 160 px
Tekst    240 × 96 px
Knapp    160 × 48 px

Minimum:
Seksjon  160 × 90 px
Bilde    120 × 80 px
Tekst    120 × 48 px
Knapp    80 × 36 px
```

- elementer kan overlappe
- andre elementer flyttes ikke automatisk
- flytting og resizing beregnes av rene modellfunksjoner
- pekerbevegelse bruker transient preview
- normalt pekerslipp gir én commit
- `pointercancel` og tapt capture forkaster draft
- låste elementer kan markeres, men ikke muteres
- lerretshøyde er avledet visning og lagres ikke

## 7. Bildeimport og ressurslivssyklus

Støttede filer:

```text
PNG
JPEG
WebP
maks 10 MB
maks 40 megapiksler
maks 16 384 px per side
```

Regler:

- type, filstørrelse, filnavn, dekoding og dimensjoner valideres før oppretting
- avbrutt filvalg muterer ikke prosjekt eller `updatedAt`
- import etter panel-unmount oppretter ikke ressurs eller element
- ressurslageret kontrollerer faktisk fil mot metadata
- mislykket oppretting rydder registrert ressurs
- sletting tilbakekaller URL når asset ikke deles
- provider-unmount tilbakekaller alle gjenværende URL-er
- manglende ressurs gir kontrollert fallback

## 8. Bilderamme og utsnitt

Bilderammen og motivet er separate konsepter.

### Hele bildet

- viser hele motivet proporsjonalt
- sentrerer motivet
- tillater tomrom ved ulikt sideforhold
- beholder lagret crop-transform

### Juster utsnitt

- fyller rammen uten tomrom
- bevarer sideforhold
- zoom normaliseres til `1..3`
- offset normaliseres til `-1..1`
- rammen kan ikke være større enn motivet ved aktuell zoom
- overgang fra stor contain-ramme gir gyldig crop-ramme
- reset bruker minimum zoom og sentrert motiv

### Versjon-6-invariant

```text
IMAGE_CROP_BASE_FRAME_SIZE_V6 = 240 × 160 px
```

Denne verdien skal ikke endres fordi standardstørrelsen for nye bilder endres. En ny crop-grunnmodell krever ny skjemaversjon og migrering.

### Rammeresize

- åtte grep ligger innenfor rammen
- aktiv kant flyttes
- motsatt kant står fast
- motivets størrelse og absolutte plassering beholdes
- ny normalisert offset beregnes mot ny ramme
- ramme og transform lagres atomisk

## 9. Interaksjon og tilgjengelighet

```text
Enter / mellomrom  markerer fokusert element
piltast             flytter ulåst element
Shift + piltast     flytter 10 px
Ctrl/Cmd + piltast  endrer størrelse
Alt + piltast       flytter crop-motiv 4 px
Shift+Alt+piltast   flytter crop-motiv 20 px
vanlig dra på crop  flytter motivet
Shift + dra         flytter hele rammen
Delete              åpner slettebekreftelse
```

- låste elementer kan fokuseres og inspiseres
- tekstredigering skiller objektmarkering fra innholdsredigering
- tilgjengelige navn beskriver innhold og relevante snarveier
- feil og status bruker riktige live-regionroller
- `prefers-reduced-motion` respekteres

## 10. Menyansvar

```text
Venstremeny = opprette elementer og velge fil eller design
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere og transformere
Ressurslag = eie transient bildefil og renderings-URL
```

Høyremenyen følger `selectedElementId`, eier ingen separat elementkopi og muterer ikke prosjektdata direkte.

## 11. Responsiv grense

- Telefon arver desktopverdier når mobiloverstyring mangler
- dagens UI oppretter ikke mobiloverstyringer
- innhold, stil, lenker, låsestatus og bildeutsnitt er foreløpig felles
- senere mobiloverstyringer må bruke viewport-spesifikke actions
- mobilendringer skal ikke skrives inn i desktopfeltet

## 12. Krav til senere faser

### Prosjektimport

- valider hele eksterne prosjektobjektet før `replace-project`
- krev kjent skjemaversjon
- valider unike ID-er, sider, uniontyper, layout og bildeinvarianter
- migrer eller avvis ukjent skjema kontrollert

### Prosjektbytte

- avstem eller tøm ressursbufferen
- tilbakekall foreldede Object URL-er

### Angre og gjør om

- historikk lagrer bare serialiserbar prosjektstate
- `File`, Object URL og aktive interaksjoner inngår ikke

### Autolagring

- reager på gyldige prosjektmutasjoner
- transient editor- og ressursstate lagres ikke direkte

## 13. Kvalitetskrav

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
git diff --check
```

Siste verifiserte produksjonskontroll:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 91 moduler, 237 avhengigheter, ingen brudd
Vite: 100 moduler transformert
CSS: 30.95 kB, gzip 6.04 kB
JavaScript: 258.38 kB, gzip 78.09 kB
produksjonsbuild: bestått på 185 ms
```

Arkitekturrapportene ble regenerert etter sluttauditen og ga ingen diff. Fase 11A ble deretter merget etter eksplisitt godkjenning. Neste produksjonsfase krever ny branch fra oppdatert `main` og nytt låst omfang.
