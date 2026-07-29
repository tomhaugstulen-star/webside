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
aktiv leveranse: fase 12 – prosjektfarger og Seksjon-rammer
branch: feature/project-colors
GitHub-sak: #28
prosjektskjema: versjon 7
implementering og manuell test: godkjent
automatiske kontroller etter siste 10 px-endring: gjenstår
arkitekturrapporter: må regenereres
PR: ikke opprettet
merge: ikke godkjent eller utført
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

Etter fase-12-auditen:

```text
alle nye og berørte produksjonsfiler: under 250 linjer
reduceColorProjectAction.ts: 156 linjer
projectColorEntries.ts: under 100 linjer
ColorsPanel.tsx: under 100 linjer
FramePropertiesSection.tsx: under 100 linjer
```

## 3. Autoritativ prosjektmodell

- `EditorProject` eier alle varige prosjektdata
- gjeldende prosjektskjema er versjon 7
- DOM-en er ikke permanent lagring
- CSS er ikke permanent fargelagring
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
versjon 7  sidebakgrunn, Seksjon-utseende, Seksjon-ramme og tekstfarge
```

## 4. Varig og transient state

Varig prosjektdata omfatter:

- sider og elementer
- sidebakgrunn
- responsiv geometri og synlighet
- låsestatus
- Seksjon-bakgrunn og ramme
- tekstinnhold, tekststil, tekstfarge og lenke
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
- avledede fargegrupper i UI

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
- ugyldig eller ikke-kanonisk farge
- rammebredde utenfor `0–10`
- ukjent knappasset-ID
- ugyldig bildeasset eller metadata
- ukjent visningsmodus
- ugyldig transform
- crop-ramme som ikke kan fylles ved aktuell zoom
- inkonsistent bilderamme og transform
- uendret data

Ved avvisning returneres samme state og `updatedAt` endres ikke.

## 6. Prosjektfarger og rammer

Autoritativ fargemodell:

```text
EditorColor = #RRGGBB
sidebakgrunn = page.appearance.backgroundColor
Seksjon-bakgrunn = section.appearance.backgroundColor
Seksjon-rammebredde = 0..10
Seksjon-rammefarge = section.appearance.frame.color
tekstfarge = text.textStyle.color
```

Regler:

- `Farger` avledes fra aktiv side og lagres ikke som egen palett
- hver kontroll muterer bare én konkret egenskap
- like fargeverdier kobler ikke elementer sammen
- rammefargen vises i `Farger` bare når bredden er større enn `0`
- rammefargen beholdes når bredden settes til `0`
- høyremeny og venstremeny skriver til samme verdi
- selection-outline og tekstens editorgrense er ikke publiserbare rammer
- knapper beholder ferdig SVG-fargedesign
- bilder har ingen prosjektfarge
- fargene er felles for PC og Telefon i versjon 7

## 7. Elementstørrelser og layout

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
- Seksjon-rammen bruker `box-sizing: border-box` og endrer ikke ytre størrelse
- lerretshøyde er avledet visning og lagres ikke

## 8. Bildeimport og ressurslivssyklus

```text
PNG
JPEG
WebP
maks 10 MB
maks 40 megapiksler
maks 16 384 px per side
```

- type, filstørrelse, filnavn, dekoding og dimensjoner valideres før oppretting
- avbrutt filvalg muterer ikke prosjekt eller `updatedAt`
- import etter panel-unmount oppretter ikke ressurs eller element
- ressurslageret kontrollerer faktisk fil mot metadata
- mislykket oppretting rydder registrert ressurs
- sletting tilbakekaller URL når asset ikke deles
- provider-unmount tilbakekaller alle gjenværende URL-er
- manglende ressurs gir kontrollert fallback

Crop-grunnrammen for versjon 6 er fortsatt `240 × 160 px`. Endring krever ny skjemaversjon og migrering.

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
- native fargekontroller har tilgjengelige navn og synlig fokus
- feil og status bruker riktige live-regionroller
- `prefers-reduced-motion` respekteres

## 10. Menyansvar

```text
Venstremeny = opprette elementer, velge fil/design og vise prosjektoversikt
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere og transformere
Ressurslag = eie transient bildefil og renderings-URL
```

Høyremenyen følger `selectedElementId`, eier ingen separat elementkopi og muterer ikke prosjektdata direkte.

## 11. Responsiv grense

- Telefon arver desktopverdier når mobiloverstyring mangler
- dagens UI oppretter ikke mobiloverstyringer
- innhold, stil, lenker, låsestatus, farger og bildeutsnitt er foreløpig felles
- senere mobiloverstyringer må bruke viewport-spesifikke actions
- responsive farger krever eksplisitt modellstøtte
- mobilendringer skal ikke skrives inn i desktopfeltet

## 12. Krav til senere faser

### Prosjektimport

- valider hele eksterne prosjektobjektet før `replace-project`
- krev kjent skjemaversjon
- valider unike ID-er, sider, uniontyper, layout, farger og bildeinvarianter
- migrer eller avvis versjon 6 og ukjent skjema kontrollert

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

Siste komplette kontroll før 10 px-utvidelsen:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 102 moduler, 274 avhengigheter, ingen brudd
Vite: 111 moduler transformert
CSS: 33.62 kB, gzip 6.34 kB
JavaScript: 264.52 kB, gzip 79.47 kB
produksjonsbuild: bestått på 189 ms
```

Ny komplett kontroll og regenererte arkitekturrapporter kreves før PR. Ingen merge uten eksplisitt godkjenning.
