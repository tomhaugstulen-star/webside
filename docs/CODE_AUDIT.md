# Kodeaudit og tekniske grenser

Dette dokumentet beskriver den framtidsrettede auditen av fase 12 og grensene som skal beskytte senere lagring, import, historikk og responsive utvidelser.

## 1. Leveransestatus

```text
fase: 12 – prosjektfarger og Seksjon-rammer
branch: feature/project-colors
GitHub-sak: #28
prosjektskjema: versjon 7
implementering: ferdig
manuell PC- og Telefon-test: godkjent
rammebredde: Ingen eller 1–10 px
sluttaudit: ferdig
automatiske kontroller etter siste 10 px-endring: gjenstår
arkitekturrapporter: må regenereres
PR: ikke opprettet
merge: ikke godkjent eller utført
```

## 2. Arkitekturretning

- `App.tsx` setter sammen providers og editorskall.
- `EditorShell` eier skalltilstand og hovedkomposisjon.
- `EditorProject` er autoritativ kilde for varige prosjektdata.
- reducer-/state-laget er siste valideringsgrense.
- lerret, høyremeny og venstremeny muterer ikke prosjektdata direkte.
- fargeoversikten er avledet fra aktiv side og lagres ikke som en separat palett.
- bildefil og Object URL ligger utenfor `EditorProject`.
- responsive verdier lagres i prosjektmodellen, ikke i DOM-en.
- generelle samlemapper og samlefiler skal ikke innføres.

## 3. Filgrenser etter sluttaudit

```text
reduceColorProjectAction.ts: 156 linjer
projectColorEntries.ts: under 100 linjer
ColorsPanel.tsx: under 100 linjer
FramePropertiesSection.tsx: under 100 linjer
useSectionAppearance.ts: under 100 linjer
useProjectColors.ts: under 100 linjer
alle nye og berørte produksjonsfiler: under 250 linjer
```

250 linjer er aktiv terskel for ansvarstrekk. 300 linjer er hard unntaksgrense.

## 4. Prosjektskjema og fargemodell

Prosjektskjemaet er versjon 7.

Versjon 7 legger til:

- sidebakgrunn i `EditorPage.appearance`
- Seksjon-bakgrunn og ramme i `SectionEditorElement.appearance`
- tekstfarge i eksisterende `TextElementStyle`

`EditorColor` er kanonisk `#RRGGBB`. Gradienter, alpha og vilkårlige CSS-strenger inngår ikke.

Seksjon-rammebredde er en lukket union fra `0` til `10`. `0` betyr `Ingen`. Menyetiketter genereres fra samme verdiliste som validatoren.

## 5. State- og reducergrenser

Reducerhandlinger avviser:

- manglende aktiv side eller element
- element på feil side
- feil elementtype
- låst Seksjon eller Tekst
- ugyldig eller ikke-kanonisk farge
- rammebredde utenfor `0–10`
- uendret data
- øvrige eksisterende layout-, knapp- og bildebrudd

Ved avvisning returneres samme state. Prosjektet og `updatedAt` endres ikke.

Fargehandlingene delegeres til `reduceColorProjectAction.ts`; den sentrale reduceren beholder komposisjonsansvar.

Transient markering, pekerøkter, preview, drafts, panelstate, fargegrupper, filvelger, `File`, Object URL, fokus, hover, feedback og dialogstate serialiseres ikke.

## 6. Auditfunn og konklusjoner

### Funn 1: farger lå tidligere i CSS

Side-, Seksjon- og tekstfarger er nå eksplisitte serialiserbare prosjektverdier. CSS og DOM er ikke lenger autoritativ fargekilde.

### Funn 2: en global palett ville koblet uavhengige elementer

`Farger` avledes som én oppføring per konkret side-, element- og egenskapsmål. Like fargeverdier oppretter ingen kobling eller global erstatning.

### Funn 3: avledet oversikt kunne blitt duplisert state

Fargegruppene bygges fra aktiv side og stabile element-ID-er ved rendering. Oppretting, sletting, låsing og ramme av/på gjenspeiles uten separat lagring.

### Funn 4: høyre- og venstremeny kunne fått ulike verdier

Begge menyene bruker den samme prosjektverdien og samme delte fargekontroll. Det finnes ingen separat rammefarge for hvert panel.

### Funn 5: rammebredde og etiketter kunne komme ut av synk

Verdiene `0–10` ligger i én modelliste. UI mapper `0` til `Ingen` og øvrige verdier dynamisk til pikseltekst.

### Funn 6: publiserbar ramme kunne blandes med editorgrenser

Seksjon-rammen beregnes fra prosjektmodellen. Selection-outline og tekstens stiplede editorgrense forblir editorhjelp og serialiseres ikke.

### Funn 7: bred ramme kunne endre elementgeometri

`box-sizing: border-box` gjør at rammen opptar plass innenfor elementets lagrede bredde og høyde. Farge- og rammeendringer muterer ikke layout.

### Funn 8: låste elementer kunne omgås via `Farger`

Låste grupper vises for oversikt, men kontrollene er deaktivert. Reduceren avviser fortsatt mutasjon dersom UI-grensen omgås.

### Funn 9: knappefarger kunne få konkurrerende modeller

Knapper beholder ferdig SVG-fargedesign. Fase 12 legger ikke CSS-overstyringer oppå assetene og oppretter ingen knappefarge i prosjektmodellen.

### Funn 10: bilder kunne feilaktig opptre i fargeoversikten

Bilder har ingen prosjektfarge og utelates. Bilderessurslager, crop og import berøres ikke.

### Funn 11: responsive farger kunne bli implisitte

Versjon 7 lagrer farger felles for PC og Telefon. Eventuelle responsive farger krever eksplisitt senere modell, validering og viewport-spesifikke actions.

### Funn 12: framtidig import må håndtere versjon 6

Det finnes ennå ingen import- eller migreringsmotor. Framtidig import må migrere eller avvise versjon 6 kontrollert og validere alle nye appearance- og fargefelt før `replace-project`.

## 7. Rendering og ansvarsdeling

- sidebakgrunn rendres fra `EditorPage.appearance`
- Seksjon-bakgrunn og ramme rendres gjennom en ren stilfunksjon
- tekstfarge inngår i eksisterende tekststilfunksjon
- `EditorCanvasElement.tsx` eier ikke fargevalidering
- `RightPropertiesPanel.tsx` forblir komposisjon
- `ColorsPanel.tsx` avleder visning og sender intensjoner gjennom hooks
- reduceren er autoritativ for gyldighet og faktisk mutasjon

## 8. Tilgjengelighet

- fargekontrollen bruker native `input type="color"`
- kontrollen har tilgjengelig navn med nåværende farge
- fokusmarkering er synlig
- låste kontroller er deaktivert
- gruppen viser låsestatus
- panelet forblir åpent etter fargeendring
- `prefers-reduced-motion` for eksisterende panelanimasjon respekteres

## 9. Manuell godkjenning

Godkjent på PC og Telefon:

- blank side viser bare sidebakgrunn
- sidebakgrunn endres uavhengig
- flere Seksjoner kan ha samme farge og endres uavhengig
- ramme `Ingen` skjuler rammeoppføringen i `Farger`
- ramme `1–10 px` rendres innenfor elementet
- rammefarge synkroniseres mellom høyremeny, `Farger` og lerret
- tekstfarge endrer bare konkret Tekst-element
- låste Seksjoner og Tekster kan ikke endres
- slettede elementer fjernes fra oversikten
- Knapp og Bilde vises ikke i `Farger`
- PC og Telefon viser samme farger
- eksisterende bilde-, tekst-, knapp-, flytte- og resizefunksjonalitet fungerer

## 10. Siste komplette automatiske kontroll

Brukerens lokale terminaloutput før utvidelsen fra 4 til 10 px:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 102 moduler, 274 avhengigheter, ingen brudd
Vite: 111 moduler transformert
CSS: 33.62 kB, gzip 6.34 kB
JavaScript: 264.52 kB, gzip 79.47 kB
produksjonsbuild: bestått på 189 ms
```

Ny komplett kontroll etter 10 px-endringen gjenstår.

## 11. Obligatoriske grenser for senere faser

### Prosjektimport

- valider hele prosjektobjektet før `replace-project`
- krev kjent skjemaversjon
- migrer eller avvis versjon 6 kontrollert
- valider sideutseende, Seksjon-utseende, rammebredde og alle farger
- ikke la importert metadata opprette Object URL uten en faktisk validert fil

### Prosjektbytte

- avstem eller tøm bilderessursbufferen
- tilbakekall URL-er som ikke lenger tilhører aktivt prosjekt

### Angre og gjør om

- historikk inneholder bare serialiserbar prosjektstate
- `File`, Object URL og aktive pekerøkter skal aldri inngå

### Mobiloverstyringer

- bruk viewport-spesifikke geometrihandlinger
- responsive farger krever eksplisitte actions og modellfelt
- ikke skriv mobilendringer inn i desktopfeltet

### Autolagring

- reager bare på gyldige prosjektmutasjoner
- ikke lagre transient editor-, panel- eller ressursstate direkte

## 12. Gjenstående før PR

1. trekk siste feature-branch lokalt
2. kjør `npm run check` etter 10 px-endringen
3. regenerer `architecture.json` og `docs/dependency-graph.mmd`
4. kontroller rapportdiff, `git diff --check` og clean tree
5. oppdater kontrolltallene dersom den siste outputen endres
6. opprett og kontroller PR mot `main`
7. merge bare etter eksplisitt godkjenning
