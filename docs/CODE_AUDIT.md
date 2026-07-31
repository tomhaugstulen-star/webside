# Kodeaudit og tekniske grenser

Dette dokumentet beskriver gjeldende framtidsrettede kodeaudit etter at fase 16 – automatisert testgrunnlag – og den automatiske produksjonsfilkontrollen er merget til `main` 31. juli 2026.

## Leveransestatus

```text
siste fullførte produksjonsfase: 16 – automatisert testgrunnlag
fase 16 source-head: df0f42f835024d2b05939a1002599033fcd63565
fase 16 pull request: #46 – merget
fase 16 mergecommit: b8212e84eef496286a83fbab3e05074eb591ddc5
fase 16 GitHub-sak: #45 – lukket som fullført
filstørrelseskontroll pull request: #48 – merget
filstørrelseskontroll mergecommit: ba8334dab7c423f16358ce423e1f77309884daeb
filstørrelseskontroll GitHub-sak: #47 – lukket som fullført
gjeldende main: ba8334dab7c423f16358ce423e1f77309884daeb
prosjektskjema: versjon 9
aktiv produksjonsfase: ingen
neste planlagte fase: 17 – tekstboksbakgrunn og små eksisterende modellgap
```

## Auditomfang

Auditen omfatter:

- testarkitektur og testkommandoer
- modellvalidatorer og stabile ID-grenser
- reducerens validerings- og identitetsgrenser
- layout, clamping og snapping
- nettleserbasert kritisk editorflyt
- GitHub Actions og Windows-sikker E2E-kjøring
- produksjonsfilenes linjegrenser
- dependency-graf og produksjonsbuild
- autoritativ dokumentasjon og neste fasegrense

Fase 15 sin visuelle audit er fortsatt historisk gyldig via PR #43 og mergecommit `1ae0bebabf3eb02104bafa80a029b40d5c06de12`. Denne filen beskriver nå den nyere tekniske baselinen som senere produksjonsfaser skal bygge på.

## Arkitekturgrenser

Følgende grenser er kontrollert og bevart:

- `EditorProject` er fortsatt eneste varige, serialiserbare sannhetskilde.
- Reduceren er fortsatt siste valideringsgrense for prosjektmutasjoner.
- Ugyldige og uendrede handlinger skal returnere samme state-identitet.
- Transient pekerpreview, snapping-guider, paneltilstand og nettleserfokus lagres ikke i prosjektmodellen.
- `File`, Blob, Object URL og lokal filsti er ikke prosjektdata.
- Bilderessurslageret eier fortsatt transient fil- og Object URL-livssyklus.
- Testkode skriver ikke parallelle produksjonsregler; den verifiserer eksporterte, rene grenser.
- GitHub Actions bruker samme sentrale kvalitetskommando som lokal utvikling.
- Filstørrelseskontrollen endrer ikke produksjonsadferd eller produksjonsmodellen.
- Ingen funksjon fra fase 17 eller senere er skjult implementert.

## Fase 16 – levert testgrunnlag

Fase 16 leverte:

- Playwright-basert testverktøy for rene TypeScript-moduler
- Chromium-basert nettleserregresjon
- separat TypeScript-konfigurasjon for tester
- 17 enhetstester
- én kritisk nettleserflyt
- Quality-workflow for pull requests og push til `main`
- Windows-sikker E2E-runner
- stabil knapp-ID-validering flyttet bort fra SVG-presentasjonskatalogen
- oppdaterte dependency-rapporter

### Dekning

Enhetstestene verifiserer:

- bilde- og ressursmetadata ved dokumenterte grenser
- normalisert Header-tekst
- kjente stabile knapp-ID-er mot vilkårlige gyldige ID-formater
- bilde-, knapp- og Header-opprettingsforespørsler
- gyldige og ugyldige reducerhandlinger
- objektidentitet ved avviste og uendrede handlinger
- dupliserte element-ID-er
- låste elementer og sletting
- ugyldig prosjektbytte uten side
- bevegelses- og resize-clamping
- minimums- og maksimumsgrenser for layout
- snapping på én og to akser
- snapgrense og prioritet ved lik avstand
- avvisning av snap som flytter element utenfor lerretet

Nettleserregresjonen verifiserer en kritisk eksisterende flyt:

```text
opprett tekstelement
-> marker elementet
-> åpne Egenskaper
```

Dette gir en reell integrasjonssjekk mellom editor-UI, elementoppretting, markering og høyrepanel uten å innføre full visuell pixeltesting.

## Teststruktur og ansvar

Rene regler testes uten unødvendige browser-mocks. Nettlesertesten brukes bare der DOM, fokus og faktisk editorflyt er relevant.

Følgende prinsipper gjelder videre:

- nye rene validatorer og layoutregler skal ha direkte enhetstester
- reducerendringer skal teste både gyldig mutasjon og avviste grenser
- ugyldige handlinger skal kontrollere state-identitet når det er en invariant
- kritiske brukerflyter legges til E2E bare når de gir reell regresjonsverdi
- full pixeltesting innføres ikke uten eget behov og beslutning
- framtidige tester skal ikke bygge store mock-systemer rundt kode som kan trekkes ut som rene funksjoner

## Automatisk produksjonsfilkontroll

PR #48 automatiserte den eksisterende prosjektregelen for filstørrelse.

Kontrollen skanner disse produksjonsfiltypene under `src`:

```text
.ts
.tsx
.js
.jsx
.css
```

Gjeldende grenser:

```text
ordinær produksjonsfil: 0–249 linjer
eksplisitt begrunnet unntak: 250–299 linjer
absolutt blokkering: 300 linjer eller mer
```

Kontrollen avviser også:

- unntak uten konkret begrunnelse
- unntak som peker på en manglende eller ukontrollert fil
- foreldede unntak når filen igjen er under 250 linjer
- alle filer på 300 linjer eller mer, også registrerte unntak

Regelmotoren er skilt fra filsystemskanningen og har ni egne policytester. Testene dekker 249, 250, 299 og 300 linjer, ugyldige unntak og LF-/CRLF-linjetelling.

## Gjeldende filstørrelsesstatus

Siste verifiserte kontroll omfattet 137 produksjonsfiler. Ingen fil krevde unntak.

Største produksjonsfiler:

```text
247  src/components/canvas/useElementPointerTransform.ts
241  src/components/canvas/EditorCanvasElement.tsx
236  src/model/imagePresentation.ts
229  src/styles/toolbar.css
224  src/components/sidebar/HeaderCreationControl.tsx
211  src/components/properties/ElementLinkPropertiesSection.tsx
201  src/state/editorProjectReducer.ts
199  src/components/properties/ImagePropertiesSection.tsx
192  src/components/canvas/snapElementMove.ts
190  src/styles/sidebar-content.css
```

`useElementPointerTransform.ts` har bare to tilgjengelige linjer før en ny linje vil blokkere kvalitetskontrollen. Neste funksjonelle endring i denne filen skal derfor begynne med en ansvarsstyrt oppdeling, ikke et unntak eller mer logikk i samme fil.

`EditorCanvasElement.tsx` skal også overvåkes tett. Oppdeling skal gjøres etter reelt ansvar og ikke gjennom tilfeldige hjelpefiler.

## Dependency- og modulstatus

Etter fase 16:

```text
118 moduler
340 avhengigheter
0 dependency-brudd
```

Fase 16 endret test- og valideringsstrukturen og oppdaterte derfor arkitekturrapportene.

PR #48 endret bare verktøyskript, dokumentasjon, package-kommando og workflowtekst. Produksjonsmodul- og importgrafen ble ikke endret, og arkitekturrapportene ble derfor ikke regenerert i den leveransen.

## Sentrale kvalitetskommandoer

```powershell
npm run file-size:test
npm run file-size:check
npm run check
npm run test:e2e
npm run architecture:json
npm run architecture:diagram
git diff --check
git status --short
git diff --stat
```

`npm run check` kjører i denne rekkefølgen:

```text
policytester for filstørrelse
produksjonsfilkontroll
ESLint
TypeScript og test-typecheck
Dependency Cruiser
enhetstester
produksjonsbuild
```

GitHub Actions kjører `npm run check` og deretter Chromium-regresjonen.

## Siste verifiserte kvalitetsbaseline

Brukerens terminaloutput og grønn CI bekreftet:

```text
policytester for filstørrelse: 9 bestått
kontrollerte produksjonsfiler: 137
produksjonsfiler på eller over 250 linjer: 0
ESLint: bestått
TypeScript og test-typecheck: bestått
Dependency Cruiser: 118 moduler, 340 avhengigheter, 0 brudd
enhetstester: 17 bestått
Chromium-regresjon: 1 bestått
Vite: 127 moduler transformert
CSS: 45.36 kB, gzip 7.34 kB
JavaScript: 280.88 kB, gzip 83.22 kB
produksjonsbuild: bestått
git diff --check: ingen feil
Quality-workflow: success
```

## Kjente modellgap og neste fasegrense

Følgende kjente saker er ikke blandet inn i fase 16 eller filstørrelsesleveransen:

- issue #35: tekstboksbakgrunn som varig prosjektdata
- issue #36: editor-only elementgrense
- issue #37: elementnotat og høyrepanelmodell
- issue #38: like mellomrom og fordelingsguider
- issue #3: senere mobile designkontroller

Neste planlagte produksjonsfase er fase 17. Før produksjonskode skal omfanget låses rundt issue #35 og andre små modellgap skal vurderes separat, ikke samles ukritisk i samme branch.

Fase 17 skal ikke starte før dokumentasjonssynken er kontrollert og merget etter eksplisitt brukergodkjenning.

## Konklusjon

Fase 16 er fullført og oppfyller de låste akseptansekriteriene. Den automatiske filstørrelseskontrollen er aktiv lokalt og i CI.

Det finnes ingen kjent test-, build-, dependency-, dokumentasjons- eller filstørrelsesblokkerer på `main` ved commit `ba8334dab7c423f16358ce423e1f77309884daeb`.

Den tydeligste vedlikeholdsrisikoen er størrelsen på `useElementPointerTransform.ts`. Denne risikoen er nå automatisk håndhevet og skal håndteres før filen utvides.
