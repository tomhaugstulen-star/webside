import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

const root = process.cwd()
const expectedBranch = 'feature/phase-17-text-background'

function git(args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
}

function pathFor(relativePath) {
  return resolve(root, relativePath)
}

function read(relativePath) {
  return readFileSync(pathFor(relativePath), 'utf8').replace(/\r\n/g, '\n')
}

function write(relativePath, content) {
  writeFileSync(pathFor(relativePath), content.replace(/\r\n/g, '\n'), 'utf8')
}

function replaceExact(relativePath, before, after) {
  const content = read(relativePath)
  const first = content.indexOf(before)
  const last = content.lastIndexOf(before)

  if (first < 0) {
    throw new Error(`${relativePath}: forventet tekst ble ikke funnet.`)
  }

  if (first !== last) {
    throw new Error(`${relativePath}: forventet tekst finnes flere ganger.`)
  }

  write(relativePath, content.replace(before, after))
}

if (git(['branch', '--show-current']) !== expectedBranch) {
  throw new Error(`Dokumentasjonen kan bare ferdigstilles på ${expectedBranch}.`)
}

if (git(['status', '--short'])) {
  throw new Error('Arbeidstreet må være clean før dokumentasjonen ferdigstilles.')
}

replaceExact(
  'README.md',
  'gjenstår før merge: dokumentasjon, oppdaterte arkitekturrapporter og manuell PC/Telefon-test',
  'dokumentasjon og arkitekturrapporter: synkronisert\ngjenstår før merge: siste Quality på endelig head og manuell PC/Telefon-test',
)

replaceExact(
  'README.md',
  '- nye funksjoner fryses når jobbregresjonen starter',
  '- nye funksjoner fryses når jobbregresjonen starter\n- AI utfører alle GitHub-operasjoner den har tilgang til; brukeren kjører bare nødvendige lokale kommandoer og manuelle UI-tester',
)

replaceExact(
  'docs/WORK_PLAN.md',
  'status: draft til dokumentasjon, arkitekturrapporter og manuell PC/Telefon-test er ferdige',
  'status: dokumentasjon og arkitekturrapporter er synkronisert; siste Quality og manuell PC/Telefon-test gjenstår',
)

replaceExact(
  'docs/WORK_PLAN.md',
  'Pågår i `feature/phase-17-text-background` og draft-PR #50. Kodekjernen og automatiske tester er implementert. Leveransen forblir draft til dokumentasjon, arkitekturrapporter, siste `npm run verify`, GitHub Quality og manuell PC-/Telefon-regresjon er bestått.',
  'Pågår i `feature/phase-17-text-background` og draft-PR #50. Kodekjernen, dokumentasjon og arkitekturrapporter er implementert og synkronisert. Leveransen forblir draft til siste GitHub Quality på endelig head og manuell PC-/Telefon-regresjon er bestått.',
)

replaceExact(
  'docs/EDITOR_PLANNING.md',
  'arkitekturrapporter etter nye moduler: gjenstår',
  'arkitekturrapporter etter nye moduler: synkronisert',
)

replaceExact(
  'docs/CODE_AUDIT.md',
  'status: ikke mergeklar før siste branch-head, dokumentasjon, rapporter og manuell regresjon er verifisert',
  'dokumentasjons- og arkitektursynk: commit 34eeb8a7523af6799330c2a642c66d37a7a105c6\nstatus: ikke mergeklar før siste Quality på endelig head og manuell PC-/Telefon-regresjon er verifisert',
)

replaceExact(
  'docs/CODE_AUDIT.md',
  'PR #50 skal forbli draft til siste branch-head har grønn `npm run verify`, oppdaterte arkitekturrapporter, ren diff og godkjent manuell PC-/Telefon-regresjon.',
  'PR #50 skal forbli draft til endelig branch-head har grønn GitHub Quality, ren diff og godkjent manuell PC-/Telefon-regresjon. Dokumentasjon og arkitekturrapporter er allerede synkronisert.',
)

replaceExact(
  'docs/PROJECT_RULES.md',
  '- Låst roadmap i `docs/WORK_PLAN.md` endres bare gjennom eksplisitt produktbeslutning.\n\n## Produktgrense',
  '- Låst roadmap i `docs/WORK_PLAN.md` endres bare gjennom eksplisitt produktbeslutning.\n\n## Remote og lokalt ansvar\n\n- AI bruker GitHub-connectoren til alle remote-operasjoner den har tilgang til: kode, dokumentasjon, branches, commits, issues, pull requests, CI-kontroll, reviews og tråder.\n- Brukeren skal ikke få repo-skrivende lokale kommandoer når samme arbeid kan utføres sikkert direkte i GitHub.\n- Brukeren utfører bare handlinger som faktisk krever den lokale PC-en: hente ferdig remote-state, starte programmet, kontrollere lokal status og gjennomføre manuell UI-/regresjonstest.\n- Lokale kommandoer skal være få, samlede og begrunnet i et konkret lokalt behov.\n- AI skal kontrollere remote-resultatet før brukeren blir bedt om lokal synk eller test.\n\n## Produktgrense',
)

replaceExact(
  'docs/PRODUCTION_READINESS.md',
  'Dette dokumentet er en kvalitetsport før Website-editoren brukes i faktisk arbeid. Det erstatter ikke roadmapen og senker ingen tekniske krav.\n\n## Full automatisk kontroll',
  'Dette dokumentet er en kvalitetsport før Website-editoren brukes i faktisk arbeid. Det erstatter ikke roadmapen og senker ingen tekniske krav.\n\n## Ansvarsdeling\n\n- AI gjør alle mulige GitHub-endringer, dokumentoppdateringer, commits, PR-kontroller og CI-kontroller direkte i repoet.\n- Brukeren gjør bare nødvendig lokal synk, starter programmet og gjennomfører den manuelle regresjonen.\n- Ingen lokal kommandorunde brukes til arbeid som AI kan utføre sikkert remote.\n\n## Full automatisk kontroll',
)

const handover = `# Prompt til neste chat

Kopier hele teksten mellom \`START HANDOVER\` og \`SLUTT HANDOVER\` inn i neste chat.

---

# START HANDOVER

Du overtar Website-editoren som prosjektleder, teknisk arkitekt og kodeansvarlig. Svar på norsk. Arbeid presist og effektivt. Faktisk GitHub-state, faktisk kode og brukerens terminaloutput er sannhetskilder. Ikke gjett og ikke påstå at branch, HEAD, clean tree, tester eller synkronisering er bekreftet uten bevis.

## 1. Repo og aktiv leveranse

\`\`\`text
GitHub: https://github.com/tomhaugstulen-star/webside.git
Lokalt: C:\\Users\\tomha\\Desktop\\website
main: ecb443d384a1e0999ef14767419e1bea93c4a12c
aktiv branch: feature/phase-17-text-background
aktiv draft-PR: #50 – Fase 17: tekstboksbakgrunn
aktiv issue: #35
prosjektskjema på branchen: 10
dokumentasjons- og arkitektursynk: 34eeb8a7523af6799330c2a642c66d37a7a105c6
\`\`\`

PR #50 er fortsatt draft og må ikke merges uten at brukeren eksplisitt skriver \`godkjent\`. \`fungerer\` betyr bare at en manuell test besto.

Hent alltid faktisk PR-head og siste CI-status før du beskriver nåstatus. Commitene etter \`34eeb8a\` kan ha flyttet head uten å endre faseomfanget.

## 2. Ufravikelig arbeidsdeling

AI skal gjøre alt den kan direkte i repoet gjennom GitHub-connectoren:

- lese og endre kode
- oppdatere dokumentasjon
- opprette og vedlikeholde branches
- committe og pushe remote-endringer
- oppdatere issues og pull requests
- kontrollere diff, changed files, mergebarhet, reviews og tråder
- kjøre eller kontrollere GitHub Actions og CI

Brukeren skal bare gjøre det som faktisk krever den lokale PC-en:

- rydde eller synkronisere den lokale arbeidskopien etter at remote er ferdig
- starte programmet
- kjøre en lokal kommando når remote-verktøy ikke kan utføre oppgaven
- gjennomføre manuell UI-/regresjonstest i PC- og Telefon-visning
- lime inn terminaloutput som bevis på lokal state

Ikke be brukeren generere dokumentasjon, arkitekturrapporter, commits eller andre repo-endringer lokalt når AI kan gjøre dette remote. Lokale kommandoer skal være få, samlede og begrunnet.

## 3. Fase 17 – låst omfang

Fase 17 er kun issue #35:

- serialiserbar \`TextAppearance\`
- \`backgroundColor: EditorColor\`
- standard \`#FFFFFF\`
- \`TextEditorElement.appearance\`
- prosjektskjema 10
- typed \`set-text-background-color\`
- reduceravvisning for ugyldig, ukjent, feil type, låst og uendret handling
- \`Bakgrunn\` før \`Tekstfarge\` i \`Farger\`
- rendering fra prosjektdata i stedet for hardkodet CSS
- modell-, reducer- og Chromium-test

Issue #36, #37, #38 og senere roadmaparbeid er eksplisitt utenfor PR #50. Ikke bland inn lokal lagring, navigator, Hero, mobiloverstyringer eller andre features i denne branchen.

## 4. Implementerte kodegrenser

Nye produksjonsmoduler:

\`\`\`text
src/model/textAppearance.ts
src/state/useTextAppearance.ts
\`\`\`

Viktige berørte filer:

- \`src/model/editorProject.ts\`: skjema 10 og \`TextAppearance\`
- \`src/model/createEditorElement.ts\`: standardbakgrunn
- \`src/state/editorProjectAction.ts\`: typed action
- \`src/state/reduceColorProjectAction.ts\`: validering og mutasjon
- \`src/model/projectColorEntries.ts\`: Bakgrunn og Tekstfarge
- \`src/state/useProjectColors.ts\`: oppdateringsruting
- \`src/components/canvas/getElementAppearanceCssStyle.ts\`: rendering
- \`src/styles/canvas.css\`: hardkodet hvit Tekst-bakgrunn fjernet

Reducergrensen bevarer samme state-identitet og \`updatedAt\` ved avviste eller uendrede handlinger. Låst Tekst kan inspiseres, men fargene kan ikke endres.

## 5. Verifisert teknisk baseline

Brukerens lokale terminal bekreftet den første kodekjernen:

\`\`\`text
filpolicytester: 9 bestått
produksjonsfiler: 139
filgrensebrudd: 0
ESLint: bestått
TypeScript og test-typecheck: bestått
Dependency Cruiser: 120 moduler, 347 avhengigheter, 0 brudd
enhetstester: 20 bestått
Vite: 129 moduler transformert
CSS: 45.35 kB, gzip 7.34 kB
JavaScript: 282.25 kB, gzip 83.33 kB
produksjonsbuild: bestått
\`\`\`

Den første E2E-feilen skyldtes testen, ikke produksjonslogikken: direkte \`input.value\` omgår React sin kontrollerte inputsporing. Testen ble rettet til Playwright \`fill()\` og GitHub Quality ble grønn.

Dokumenter og arkitekturrapporter ble senere generert i en kontrollert GitHub Actions-kjøring. Den kjørte \`npm run verify\` før commit og produserte commit \`34eeb8a7523af6799330c2a642c66d37a7a105c6\`. Engangs-workflowen og migreringsskriptet ble fjernet i samme commit.

## 6. Samlet kontroll

\`\`\`powershell
npm run verify
\`\`\`

Kommandoen kjører:

- filpolicytester
- produksjonsfilkontroll
- ESLint
- TypeScript og test-typecheck
- Dependency Cruiser
- 20 enhetstester
- produksjonsbuild
- kritisk Chromium-regresjon

GitHub-workflowen \`Quality\` bruker samme kommando. \`workflow_dispatch\` er lagt til slik at Quality også kan startes kontrollert manuelt remote.

Arkitekturrapportene er oppdatert for 120 moduler og 347 avhengigheter:

\`\`\`text
architecture.json
docs/dependency-graph.mmd
\`\`\`

## 7. Oppdatert dokumentasjon

Disse dokumentene er synkronisert med fase 17:

1. \`README.md\`
2. \`docs/WORK_PLAN.md\`
3. \`docs/PROJECT_RULES.md\`
4. \`docs/ELEMENT_MODEL.md\`
5. \`docs/EDITOR_PLANNING.md\`
6. \`docs/RIGHT_PROPERTIES_PANEL.md\`
7. \`docs/RESPONSIVE_DESIGN.md\`
8. \`docs/MOBILE_DESIGN_CONTROLS.md\`
9. \`docs/FILE_SIZE_CONTROL.md\`
10. \`docs/CODE_AUDIT.md\`
11. \`docs/PRODUCTION_READINESS.md\`
12. \`docs/NEXT_CHAT_PROMPT.md\`

Skjemahistorikken viser versjon 10. Tekstbakgrunn er dokumentert som eget \`TextAppearance\`-ansvar, mens teksttypografi og tekstfarge forblir i \`TextElementStyle\`.

## 8. Brukerens lokale state ved chatbytte

Siste viste lokale status var på gammel head \`87c936a\` med disse lokale endringene:

\`\`\`text
M architecture.json
M docs/dependency-graph.mmd
D scripts/sync-phase-17-docs.mjs
\`\`\`

Disse endringene kom fra den avbrutte lokale dokumentasjonsrunden og er nå erstattet av remote commit \`34eeb8a\`, som inneholder genererte rapporter og sletting av skriptet. Ikke be brukeren manuelt gjenskape dem.

Når remote-sluttkontrollen er ferdig, skal brukeren få én samlet PowerShell-blokk som:

1. kontrollerer at bare disse forventede lokale endringene finnes
2. gjenoppretter dem fra lokal gammel head
3. henter og fast-forwarder til faktisk remote-head
4. viser branch, status og HEAD

Ikke bruk \`git reset --hard\` uten å kontrollere statusen først. Ikke slett andre lokale filer.

## 9. Det som gjenstår for PR #50

1. Kontroller faktisk siste PR-head.
2. Kontroller GitHub Quality på nøyaktig samme head.
3. Kontroller changed files, mergebarhet, reviews og åpne tråder.
4. Synkroniser brukerens lokale branch med én sikker PowerShell-blokk.
5. La brukeren gjennomføre den manuelle regresjonen i \`docs/PRODUCTION_READINESS.md\`.
6. Rett eventuelle faktiske feil på samme branch og kjør hele \`npm run verify\` igjen.
7. Gjør PR-en klar for review først når remote og manuell test er grønne.
8. Merge bare etter ny eksplisitt \`godkjent\`.
9. Etter merge: synkroniser lokal \`main\`, lukk issue #35 dersom GitHub ikke gjør det automatisk, og oppdater status med faktisk mergecommit.

## 10. Manuell fase-17-test

Minimum som må bekreftes i programmet:

- opprett Tekst
- skriv og rediger tekst
- endre \`Bakgrunn\` og \`Tekstfarge\`
- bekreft at riktig Tekst-element endres
- lås Tekst og bekreft at fargefeltene er synlige, men deaktiverte
- lås opp, flytt og endre størrelse
- bytt mellom PC og Telefon
- kontroller at Seksjon, Knapp, Bilde og Header fortsatt fungerer
- kontroller sikker sletting og avbryt sletting én gang

Den fullstendige regresjonen ligger i \`docs/PRODUCTION_READINESS.md\`.

## 11. Jobbkritisk risiko etter fase 17

Programmet mangler fortsatt:

- lokal prosjektlagring
- autolagring
- krasjgjenoppretting
- prosjektimport
- angre/gjør om

Tester beskytter mot kodebrudd, men hindrer ikke tap av prosjektstate ved oppfriskning, lukking eller krasj. Ikke påstå at programmet er fullt jobbsikkert før denne risikoen er håndtert.

Etter ferdig fase 17 må neste chat ta en eksplisitt roadmapbeslutning om jobbberedskap skal prioriteres foran fase 18. Ikke bygg lagring skjult i PR #50.

## 12. Permanente regler

- aldri utvikling direkte på \`main\`
- ingen merge uten eksplisitt \`godkjent\`
- ordinære produksjonsfiler: 0–249 linjer
- 250–299 krever eksplisitt og konkret begrunnet unntak
- 300+ er alltid blokkert
- reduceren er siste valideringsgrense
- ugyldige, låste og uendrede handlinger returnerer samme state
- \`updatedAt\` endres bare ved reell gyldig mutasjon
- DOM, CSS, \`File\`, Blob, Object URL og lokal filsti er ikke prosjektdata
- arkitekturrapporter regenereres ved faktisk modul-/importendring
- faktisk kode, GitHub-state og terminaloutput vinner over foreldet dokumentasjon
- ingen senere feature blandes inn i aktiv branch

# SLUTT HANDOVER
`

write('docs/NEXT_CHAT_PROMPT.md', handover)

const requiredMarkers = [
  ['README.md', 'dokumentasjon og arkitekturrapporter: synkronisert'],
  ['docs/WORK_PLAN.md', 'siste Quality og manuell PC/Telefon-test gjenstår'],
  ['docs/PROJECT_RULES.md', '## Remote og lokalt ansvar'],
  ['docs/EDITOR_PLANNING.md', 'arkitekturrapporter etter nye moduler: synkronisert'],
  ['docs/CODE_AUDIT.md', 'dokumentasjons- og arkitektursynk: commit 34eeb8a'],
  ['docs/PRODUCTION_READINESS.md', '## Ansvarsdeling'],
  ['docs/NEXT_CHAT_PROMPT.md', '## 2. Ufravikelig arbeidsdeling'],
]

for (const [relativePath, marker] of requiredMarkers) {
  if (!read(relativePath).includes(marker)) {
    throw new Error(`${relativePath}: mangler kontrollmarkør ${marker}`)
  }
}

console.log('Fase 17-dokumentasjonen er ferdigstilt og kontrollert.')
console.log(git(['diff', '--stat']))
