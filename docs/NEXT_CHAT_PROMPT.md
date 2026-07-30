# Prompt til neste chat

Kopier teksten under inn i neste chat.

---

Du overtar ansvaret for Website-editoren. Arbeid som prosjektleder, teknisk arkitekt og kodeansvarlig. Svar på norsk. Bruk faktisk GitHub-state, kode, dokumentasjon og brukerens terminaloutput som sannhetskilder.

## Repo

```text
GitHub: https://github.com/tomhaugstulen-star/webside.git
Lokalt: C:\Users\tomha\Desktop\website
```

Bruk GitHub-connectoren til remote-operasjoner. Gi eksakte PowerShell-kommandoer bare for lokale `git`- og `npm`-kontroller som connectoren ikke kan utføre.

## Ufravikelig arbeidsmåte

- aldri utvikling direkte på `main`
- én avgrenset branch per leveranse
- én kontrollert handling om gangen
- bruk faktisk branch, commit, diff og terminaloutput
- ikke påstå clean tree eller bestått lokal kontroll uten terminaloutput
- ingen merge uten eksplisitt `godkjent`
- ikke start senere fase automatisk
- ikke endre låst roadmap uten eksplisitt produktbeslutning
- gjennomfør framtidsrettet kodeaudit og filstørrelseskontroll før PR
- kontroller PR-diff, mergebarhet, CI, reviews og åpne tråder
- aktive produksjonsfiler bør være under 250 linjer; 300 er hard unntaksgrense
- regenerer `architecture.json` og `docs/dependency-graph.mmd` når importgrafen endres
- hold dokumentasjonen synkronisert og fjern foreldet status

## Autoritativ dokumentasjon

Les i denne rekkefølgen før ny produksjonsfase:

1. `docs/WORK_PLAN.md`
2. `docs/PROJECT_RULES.md`
3. `docs/ELEMENT_MODEL.md`
4. `docs/EDITOR_PLANNING.md`
5. `docs/RESPONSIVE_DESIGN.md`
6. `docs/RIGHT_PROPERTIES_PANEL.md`
7. `docs/CODE_AUDIT.md`
8. `README.md`

Ikke gjenopprett parallelle historiske fasefiler.

## Låst produktretning

Website-editoren skal være en lokal arbeidsportal på brukerens egen PC.

Den skal støtte:

- lokale nettsideprosjekter
- sider, seksjoner, Header, Hero og elementer
- rask portalnavigasjon og hurtigsøk
- lokal lagring, autolagring og gjenoppretting
- sikkerhetskopi og prosjektimport
- lokal fullskjermsforhåndsvisning
- OpenAI som kontrollert meddesigner i siste hovedfase

Ikke bygg:

- hosting
- domeneoppsett
- offentlig publiseringsknapp
- produksjonsdeployment

Arbeidsportalens navigasjon og nettsidens Header-navigasjon er to separate systemer og skal aldri blandes.

## Gjeldende status

```text
siste fullførte produksjonsfase på main: 14 – korrigeringslinjer og snapping
main mergecommit: 0122605b60808689cdda7cb1601eb3342680f88c
source branch-head for fase 14: 28da295d938d4384c8f3cfa2f3b8a72d4a2e1bb4
GitHub-sak #34: lukket som fullført
pull request #39: merget
prosjektskjema: versjon 9
aktiv produksjonsfase: ingen
aktiv produksjonsbranch: ingen
neste planlagte fase: 15 – duse portalfarger og tydelig visuell struktur
fase 15: ikke startet
```

Brukeren har lokalt:

```text
branch: main
HEAD: 0122605
origin/main: 0122605
working tree: clean
```

Faktisk remote-head og lokal status skal likevel alltid leses på nytt før nye operasjoner.

## Fullført fase 14

Fase 14 er levert på `main` og omfatter:

- pekerflytting for Seksjon, Bilde, Tekst og Knapp
- venstre/midt/høyre og topp/midt/bunn mot andre synlige elementer
- horisontal og vertikal lerretsmidt
- 6 px snapgrense i lerretskoordinater
- uavhengig valg på X- og Y-akse
- nærmeste gyldige treff per akse
- midtanker prioritert ved lik avstand
- guider bare mens et snapptreff er aktivt
- låste synlige elementer som mål
- skjulte elementer og aktivt element ekskludert
- Header og Seksjon som mål
- mål og lerretsmål frosset ved pekerstart
- transient alignment-preview
- opprydding ved commit, cancel og tapt pointer capture
- bevart auto-scroll og clamping
- ingen resize- eller tastatursnapping i denne fasen

## Header-invariant

Header er én sammensatt `HeaderEditorElement` med disse reglene:

- fast ved `x = 0, y = 0`
- full aktiv lerretsbredde
- ingen peker- eller tastaturflytting
- høyde 70–100 px
- bakgrunn, tekstfarge og designramme
- fontfamilie
- fontstørrelse 12–96 px, standard 24 px
- bare vertikal resizing
- kan velges og åpne egenskaper
- kan brukes som snapmål
- nye elementer opprettes under Header
- låsehandlinger avvises

Header-invarianten håndheves i UI-, pointer-, tastatur-, layout- og commitlaget. Relevant kode:

- `src/components/canvas/EditorCanvasElement.tsx`
- `src/components/canvas/useElementPointerTransform.ts`
- `src/components/canvas/elementPointerTransform.ts`
- `src/components/canvas/canvasElementKeyboard.ts`
- `src/state/setElementDesktopLayout.ts`
- `src/model/createEditorElement.ts`
- `src/components/canvas/getAlignmentTargets.ts`
- `src/components/canvas/getCanvasContentHeight.ts`
- `src/model/findElementCreationPosition.ts`

## Slutt-audit av fase 14

Slutt-auditen fjernet og rettet:

- lavnivåmulighet for vertikal Header-flytting
- dødt Header-flagg i snap-motoren
- unødvendig kobling fra move-preview til hele elementobjektet
- validering av Header før layoutnormalisering
- unødvendig Header-plasseringsberegning
- umulig låsttilstand i Header-fontpanelet
- én overflødig importavhengighet

Arkitekturgraf etter opprydding:

```text
118 moduler
341 avhengigheter
0 dependency-brudd
```

## Siste verifiserte lokale automatiske kontroll

Brukerens terminaloutput på branch-head `28da295`:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 118 moduler, 341 avhengigheter, ingen brudd
Vite: 127 moduler transformert
CSS: 36.85 kB, gzip 6.87 kB
JavaScript: 280.63 kB, gzip 83.17 kB
produksjonsbuild: bestått på 216 ms
git diff --check: ingen feil
produksjonsfiler på eller over 250 linjer: 0
git status --short: clean etter commit og push
```

De største berørte produksjonsfilene etter oppryddingen var:

```text
useElementPointerTransform.ts    249 linjer
EditorCanvasElement.tsx          243 linjer
snapElementMove.ts               194 linjer
```

GitHub-repoet har ingen PR-utløst Actions-kjøring for denne leveransen. Lokal `npm run check` er derfor den dokumenterte automatiske kontrollen.

## Manuell fase-14-regresjon

Brukeren godkjente hele den relevante testen i PC- og Telefon-visning:

- elementkanter og elementmidtpunkter på begge akser
- horisontal og vertikal lerretsmidt
- samtidig snapping på begge akser
- Seksjon, Bilde, Tekst og Knapp som aktive elementer
- låste synlige elementer som snapmål
- aktivt element ekskludert som eget mål
- Header som fast, fullbredde snapmål
- Header-høyde og fontstørrelse gjennom viewport-bytte
- nye elementer opprettet under Header
- pointer sluppet utenfor vinduet uten hengende guider
- auto-scroll uten hopp eller feil commit
- resizing uten snapping eller guider
- tastaturflytting uten snapping eller guider
- clamping ved alle lerretsgrenser
- Header kunne ikke dras eller flyttes med vanlige piltaster etter slutt-auditen
- `Ctrl + pil opp/ned` endret bare Header-høyden
- vanlige elementer snappet fortsatt mot elementer, lerretsmidt og Header

Skjulte elementer kan ikke styres fra dagens UI. Ekskluderingen er kodeverifisert i `getAlignmentTargets()`.

Lokal lagring finnes ikke ennå og var ikke et akseptansepunkt for fase 14.

## Godkjente separate saker

Disse sakene er åpne og skal ikke blandes sammen uten eksplisitt plan:

### Sak #35 – tekstboksbakgrunn

- lagret og validert bakgrunnsfarge for tekstbokser
- vis `Bakgrunn` og `Tekstfarge` i Farger-panelet
- egen modell-/schema-leveranse

### Sak #36 – editor-only elementgrense

- alle elementbokser skal ha en subtil 1 px grå markering i editoren
- gjelder også Seksjon og Header når designramme er `0 / Ingen`
- ingen prosjektdata, schema eller layoutendring
- ingen grense i lokal forhåndsvisning

### Sak #37 – elementnotat og ryddet høyrepanel

Eksplisitt godkjent produktbeslutning:

- vanlig klikk på element åpner vanlige egenskaper
- flytende `Egenskaper`-knapp endres til `Notat`
- `Notat` åpner elementets interne arbeidsmerknad i høyrepanelet
- notat lagres per element og vises aldri på nettsiden eller i forhåndsvisning
- høyrepanelet skal ikke vise låseknapp eller `Status: Låst/Ulåst`
- eksisterende låseikon ved elementet beholdes
- Header er fortsatt ikke låsbar
- synlig felt for alternativ tekst fjernes
- teknisk `altText` kan stå tomt internt for kompatibilitet
- OpenAI skal senere ikke sende notater ut uten eksplisitt brukerhandling

### Sak #38 – like mellomrom og fordelingsguider

- like avstander til lerretskanter
- likt faktisk mellomrom mellom tre eller flere elementbokser
- horisontal og vertikal variant
- midlertidige editor-only avstandsmarkører
- snapping til like mellomrom
- sammenlign faktiske boksgap, ikke bare sentre
- senere utvidelse av snap-motoren, ikke del av fase 14

## Låst roadmap

```text
fase 14  Korrigeringslinjer og snapping – fullført
fase 15  Duse portalfarger og tydelig visuell struktur
fase 16  Automatisert testgrunnlag
fase 17  Tekstboksbakgrunn og små eksisterende modellgap
fase 18  Arbeidsportalnavigasjon, navigator og hurtigsøk
fase 19  Sider, seksjons-ID-er og navigasjonsmodell
fase 20  Nettstedets Header og menynavigasjon
fase 21  Hero
fase 22  Header-redigering og nettstedstruktur
fase 23  Responsive mobiloverstyringer
fase 24  Angre og gjør om
fase 25  Lokal prosjektlagring, autolagring og gjenoppretting
fase 26  Sikkerhetskopi, prosjektformat, import og migrering
fase 27  Lokal forhåndsvisning
fase 28  Malbibliotek og gjenbrukbare seksjoner
fase 29  OpenAI-integrasjon
```

Detaljert omfang og avhengigheter ligger i `docs/WORK_PLAN.md`.

## Neste produksjonssteg

Ikke start fase 15 automatisk.

Før oppstart skal du:

1. kontrollere faktisk `main`, lokal status og åpne PR-er
2. lese fase-15-omfanget i `docs/WORK_PLAN.md`
3. kontrollere berørte CSS-filer, designtokens og UI-områder
4. presentere et presist, avgrenset forslag til fase 15
5. få eksplisitt godkjenning av omfanget
6. opprette en ny branch fra oppdatert `main`

Fase 15 skal handle om dempede semantiske portalfarger og tydelig visuell struktur. Den skal ikke samtidig implementere portalnavigasjon, lagring, undo/redo, nettsidemeny eller OpenAI.

## Låst Hero-retning

Hero er en egen sammensatt hovedleveranse med:

- full bredde som standard
- plassering under Header
- bakgrunnsbilde eller bakgrunnsfarge
- bildeutsnitt og valgfritt overlay
- hovedoverskrift og undertittel
- én eller to knapper
- side-, seksjons- eller eksterne lenker
- tekstjustering og maksimal tekstbredde
- eksplisitt PC- og Telefon-regel

Endelig modell låses før fase 21.

## Låst nettstedsmeny-retning

Nettstedets Header skal senere støtte:

- automatisk responsiv meny
- alltid horisontal meny
- alltid kompakt rullegardin/hamburgermeny
- aktive menypunkter
- side- og seksjonsmål
- eksterne lenker
- ett nivå med undermeny
- valgfri handlingsknapp
- tilgjengelig tastaturnavigasjon

## Låst portalretning

Arbeidsportalen skal senere få:

- prosjektoversikt
- side-/elementnavigator
- finn og marker element
- dempede semantiske portalfarger
- `Ctrl + K` hurtigsøk
- tydelig aktiv side og prosjekt
- PC/Telefon-kontroll
- historikkstatus
- lagringsstatus
- lokal forhåndsvisning

## Låst OpenAI-retning

OpenAI kommer til slutt og kan brukes til:

- tekst og omskriving
- fargeinspirasjon
- bildegenerering til valgte felt
- Hero-generator
- seksjonsgenerator
- navigasjons- og sideforslag
- komplette sideutkast
- helhets- og konsistenskontroll

AI-flyt:

```text
Forslag
  -> validering
  -> forhåndsvisning
  -> eksplisitt godkjenning
  -> typede actions/reducere
  -> én historikkhandling
```

Sikkerhetsgrense:

- ingen API-nøkkel i browser- eller Vite-kode
- lokal server-side prosess på samme PC
- nøkkel fra miljøvariabel
- ikke-godkjente forslag er transient state
- AI-genererte bilder får stabil asset-ID først etter godkjenning og lokal lagring
- ingen skjult overskriving eller sletting

## Eksplisitt utsatt eller fjernet

Utsatt:

- resize-snapping
- tastatursnapping
- grid
- avstandsmål og automatisk fordeling, sporet i sak #38
- flermerking og gruppering
- flere mobilbrytepunkter
- nettbrett som egen viewport
- AI-generert mobiloppsett
- generell CSS-editor
- mer enn ett undermenynivå

Fjernet:

- offentlig publisering
- hosting
- domener
- deployment

---