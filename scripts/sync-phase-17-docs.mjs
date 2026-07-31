import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

const EXPECTED_BRANCH = 'feature/phase-17-text-background'
const root = process.cwd()

function runGit(args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
}

function filePath(relativePath) {
  return resolve(root, relativePath)
}

function read(relativePath) {
  return readFileSync(filePath(relativePath), 'utf8')
}

function write(relativePath, content) {
  writeFileSync(filePath(relativePath), content.replace(/\r\n/g, '\n'), 'utf8')
}

function replaceExact(relativePath, before, after) {
  const content = read(relativePath)
  const firstIndex = content.indexOf(before)
  const lastIndex = content.lastIndexOf(before)

  if (firstIndex < 0) {
    throw new Error(`${relativePath}: forventet tekst ble ikke funnet.`)
  }

  if (firstIndex !== lastIndex) {
    throw new Error(`${relativePath}: forventet tekst finnes flere ganger.`)
  }

  write(relativePath, content.replace(before, after))
}

function assertContains(relativePath, expected) {
  if (!read(relativePath).includes(expected)) {
    throw new Error(`${relativePath}: mangler kontrollmarkør: ${expected}`)
  }
}

const branch = runGit(['branch', '--show-current'])
if (branch !== EXPECTED_BRANCH) {
  throw new Error(`Feil branch: ${branch || '(ingen)'}. Forventet ${EXPECTED_BRANCH}.`)
}

const statusBefore = runGit(['status', '--short'])
if (statusBefore) {
  throw new Error(`Arbeidstreet må være clean før dokumentasjonssynk:\n${statusBefore}`)
}

replaceExact(
  'docs/WORK_PLAN.md',
  `Standardkontroll:\n\n\`\`\`powershell\nnpm run check\nnpm run architecture:json\nnpm run architecture:diagram\ngit diff --check\ngit status --short\ngit diff --stat\n\`\`\``,
  `Standardkontroll etter siste kode- eller dokumentendring:\n\n\`\`\`powershell\nnpm run verify\nnpm run architecture:json\nnpm run architecture:diagram\ngit diff --check\ngit status --short\ngit diff --stat\n\`\`\`\n\n\`npm run verify\` er den samlede sikkerhetskontrollen. Den kjører hele \`npm run check\` og deretter den kritiske Chromium-regresjonen.`,
)

replaceExact(
  'docs/WORK_PLAN.md',
  `\`\`\`text\nsiste fullførte produksjonsfase på main: 16 – automatisert testgrunnlag\nsource branch-head: df0f42f835024d2b05939a1002599033fcd63565\nverifisert produksjons-head: df0f42f835024d2b05939a1002599033fcd63565\npull request: #46 – merget\nfase 16-mergecommit på main: b8212e84eef496286a83fbab3e05074eb591ddc5\nGitHub-sak: #45 – lukket som fullført\ngjeldende main: ba8334dab7c423f16358ce423e1f77309884daeb\nfilstørrelseskontroll: PR #48 – merget\nfilstørrelsessak: #47 – lukket som fullført\nprosjektskjema: versjon 9\nframtidsrettet kodeaudit: fullført\nautomatisk sluttkontroll: bestått\npolicytester for filstørrelse: 9 bestått\nenhetstester: 17 bestått\nnettleserregresjon: 1 bestått\naktiv produksjonsfase: ingen\nneste planlagte fase: 17 – tekstboksbakgrunn og små eksisterende modellgap\nfase 17: ikke startet\n\`\`\``,
  `\`\`\`text\nsiste fullførte produksjonsfase på main: 16 – automatisert testgrunnlag\ngjeldende main: ecb443d384a1e0999ef14767419e1bea93c4a12c\naktiv produksjonsfase: 17 – tekstboksbakgrunn\naktiv branch: feature/phase-17-text-background\naktiv draft-PR: #50\naktiv GitHub-sak: #35\nprosjektskjema på main: versjon 9\nprosjektskjema på fase-17-branchen: versjon 10\nimplementert: varig TextAppearance.backgroundColor\nstandard tekstbakgrunn: #FFFFFF\nenhetstester: 20 bestått på verifisert kode-head\nnettleserregresjon: 1 bestått på verifisert kode-head\nQuality på kode-head ea2a446: success\nsamlet kontrollkommando: npm run verify\nstatus: draft til dokumentasjon, arkitekturrapporter og manuell PC/Telefon-test er ferdige\nneste roadmapfase etter ferdig fase 17: 18 – arbeidsportalnavigasjon, navigator og hurtigsøk\njobbberedskap: lokal lagring/autolagring er fortsatt et eksplisitt risikogap\n\`\`\``,
)

replaceExact(
  'docs/WORK_PLAN.md',
  `Automatisk produksjonsfilkontroll ble deretter merget via PR #48 på mergecommit \`ba8334dab7c423f16358ce423e1f77309884daeb\`. \`npm run check\` kjører nå policytester, faktisk filkontroll, lint, typecheck, dependency-kontroll, enhetstester og produksjonsbuild. Ingen produksjonsfase er aktiv; neste planlagte fase er fase 17.`,
  `Automatisk produksjonsfilkontroll ble deretter merget via PR #48 på mergecommit \`ba8334dab7c423f16358ce423e1f77309884daeb\`. Dokumentasjonssynken etter fase 16 ble merget via PR #49 på \`ecb443d384a1e0999ef14767419e1bea93c4a12c\`.\n\nFase 17 er aktiv på \`feature/phase-17-text-background\` i draft-PR #50. Omfanget er låst til issue #35: varig og validert tekstboksbakgrunn. Issue #36, #37, #38 og senere roadmaparbeid er eksplisitt utelatt. \`npm run verify\` er nå den samlede kontrollen lokalt og i GitHub Quality.`,
)

replaceExact(
  'docs/WORK_PLAN.md',
  `fase 17  Tekstboksbakgrunn og små eksisterende modellgap`,
  `fase 17  Tekstboksbakgrunn – pågår`,
)

replaceExact(
  'docs/WORK_PLAN.md',
  `## Fase 17 – tekstboksbakgrunn og små eksisterende modellgap\n\n### Formål`,
  `## Fase 17 – tekstboksbakgrunn\n\n### Status\n\nPågår i \`feature/phase-17-text-background\` og draft-PR #50. Kodekjernen og automatiske tester er implementert. Leveransen forblir draft til dokumentasjon, arkitekturrapporter, siste \`npm run verify\`, GitHub Quality og manuell PC-/Telefon-regresjon er bestått.\n\n### Formål`,
)

replaceExact(
  'docs/WORK_PLAN.md',
  `- kontrollere andre små dokumenterte modellgap og behandle dem separat`,
  `- holde issue #36, #37, #38 og senere modellarbeid utenfor denne leveransen`,
)

replaceExact(
  'docs/PROJECT_RULES.md',
  `- Gjeldende prosjektskjema er versjon 9.`,
  `- Gjeldende prosjektskjema på fase-17-branchen er versjon 10; main er versjon 9 fram til godkjent merge.`,
)

replaceExact(
  'docs/PROJECT_RULES.md',
  `9  Header-fontstørrelse\n\`\`\``,
  `9  Header-fontstørrelse\n10 Tekstutseende med varig tekstboksbakgrunn\n\`\`\``,
)

replaceExact(
  'docs/PROJECT_RULES.md',
  `- tekst, lenker og asset-ID-er`,
  `- tekst, tekststil, tekstutseende, lenker og asset-ID-er`,
)

replaceExact(
  'docs/PROJECT_RULES.md',
  `- Tekst og Header har tekstfarge.\n- Headerens navn og undertittel deler fontfamilie og tekstfarge.\n- Header-fontstørrelse er en validert verdi fra 12 til 96 px.\n- Knapper beholder ferdig SVG-fargedesign.\n- Bilder har ingen prosjektfarge.\n- Tekstboksbakgrunn finnes ikke som varig modellverdi i versjon 9; gapet spores i sak #35.`,
  `- Tekst har varig \`TextAppearance.backgroundColor\` og tekstfarge i \`TextElementStyle.color\`.\n- Ny Tekst opprettes med kanonisk bakgrunn \`#FFFFFF\`.\n- Tekstbakgrunn og tekstfarge er felles for PC og Telefon fram til fase 23.\n- Låst Tekst kan inspiseres, men fargekontrollene er deaktiverte og reduceren avviser mutasjon.\n- Headerens navn og undertittel deler fontfamilie og tekstfarge.\n- Header-fontstørrelse er en validert verdi fra 12 til 96 px.\n- Knapper beholder ferdig SVG-fargedesign.\n- Bilder har ingen prosjektfarge.`,
)

replaceExact(
  'docs/PROJECT_RULES.md',
  `\`\`\`powershell\nnpm run check\nnpm run architecture:json\nnpm run architecture:diagram\ngit diff --check\ngit status --short\ngit diff --stat\n\`\`\`\n\nFør PR kontrolleres også filstørrelser, framtidige import-/historikkgrenser, ressurslivssyklus, tilgjengelighet, regresjoner, PR-diff, mergebarhet, reviews, uløste tråder og CI.`,
  `\`\`\`powershell\nnpm run verify\nnpm run architecture:json\nnpm run architecture:diagram\ngit diff --check\ngit status --short\ngit diff --stat\n\`\`\`\n\n\`npm run verify\` er obligatorisk etter siste kodeendring og før merge. Den kjører hele repositorykontrollen og den kritiske Chromium-regresjonen. Før PR kontrolleres også filstørrelser, framtidige import-/historikkgrenser, ressurslivssyklus, tilgjengelighet, manuell PC-/Telefon-regresjon, PR-diff, mergebarhet, reviews, uløste tråder og CI.`,
)

replaceExact(
  'docs/ELEMENT_MODEL.md',
  `EDITOR_PROJECT_SCHEMA_VERSION = 9`,
  `EDITOR_PROJECT_SCHEMA_VERSION = 10`,
)

replaceExact(
  'docs/ELEMENT_MODEL.md',
  `9  Header-fontstørrelse\n\`\`\``,
  `9  Header-fontstørrelse\n10 Tekstutseende med varig tekstboksbakgrunn\n\`\`\``,
)

replaceExact(
  'docs/ELEMENT_MODEL.md',
  `Det finnes ennå ingen prosjektimport eller migreringsmotor. Framtidig import må validere hele versjon-9-objektet før \`replace-project\`.`,
  `Det finnes ennå ingen prosjektimport eller migreringsmotor. Framtidig import må validere hele versjon-10-objektet før \`replace-project\`.`,
)

replaceExact(
  'docs/ELEMENT_MODEL.md',
  `- versjon 8 til 9 må legge til \`HeaderAppearance.fontSize\`, standard 24 px`,
  `- versjon 8 til 9 må legge til \`HeaderAppearance.fontSize\`, standard 24 px\n- versjon 9 til 10 må legge til \`TextAppearance.backgroundColor\`, standard \`#FFFFFF\``,
)

replaceExact(
  'docs/ELEMENT_MODEL.md',
  `schemaVersion: 9`,
  `schemaVersion: 10`,
)

replaceExact(
  'docs/ELEMENT_MODEL.md',
  `type TextEditorElement = BaseEditorElement & {\n  kind: 'text'\n  content: string\n  textStyle: TextElementStyle\n  link: ElementLink\n}`,
  `type TextEditorElement = BaseEditorElement & {\n  kind: 'text'\n  content: string\n  textStyle: TextElementStyle\n  appearance: TextAppearance\n  link: ElementLink\n}\n\ntype TextAppearance = {\n  backgroundColor: EditorColor\n}`,
)

replaceExact(
  'docs/ELEMENT_MODEL.md',
  `Tekststilen inneholder tekstfarge, men ikke bakgrunnsfarge. Tekstboksbakgrunn er derfor ikke varig prosjektdata i versjon 9. Mangelen spores i GitHub-sak #35.`,
  `Teksttypografi og tekstfarge ligger fortsatt i \`TextElementStyle\`. Tekstboksens varige bakgrunn ligger separat i \`TextAppearance.backgroundColor\`. Ny Tekst opprettes med kanonisk \`#FFFFFF\`. Modellen validerer nøyaktig objektform og gyldig \`EditorColor\`.`,
)

replaceExact(
  'docs/ELEMENT_MODEL.md',
  `- Seksjon og Header viser bakgrunn og eventuell rammefarge\n- Tekst og Header viser tekstfarge`,
  `- Seksjon og Header viser bakgrunn og eventuell rammefarge\n- Tekst viser Bakgrunn før Tekstfarge\n- Header viser bakgrunn og tekstfarge`,
)

replaceExact(
  'docs/ELEMENT_MODEL.md',
  `- versjon 8 migreres kontrollert til versjon 9`,
  `- versjon 8 migreres kontrollert til versjon 9 og deretter versjon 10`,
)

replaceExact(
  'docs/EDITOR_PLANNING.md',
  `\`\`\`text\nsiste fullførte produksjonsfase på main: 15 – duse portalfarger og tydelig visuell struktur\nsource branch-head: 7a4e6882cc3be69145de08f1478d385c5503193b\nverifisert produksjons-head: 7ea58a500b500efb884544751f0913a1a07cf285\npull request #43: merget\nmergecommit på main: 1ae0bebabf3eb02104bafa80a029b40d5c06de12\nGitHub-sak #42: lukket som fullført\nprosjektskjema: versjon 9\nframtidsrettet kodeaudit: fullført\nautomatisk sluttkontroll: bestått\nfilstørrelseskontroll: bestått\nvisuell fase-15-regresjon: godkjent\naktiv produksjonsfase: ingen\nneste planlagte fase: 16 – automatisert testgrunnlag\nfase 16: ikke startet\n\`\`\`\n\nFase 15 er fullført på \`main\`. PR #43 ble merget etter eksplisitt brukergodkjenning på mergecommit \`1ae0bebabf3eb02104bafa80a029b40d5c06de12\`. Ingen produksjonsfase er aktiv.`,
  `\`\`\`text\nsiste fullførte produksjonsfase på main: 16 – automatisert testgrunnlag\ngjeldende main: ecb443d384a1e0999ef14767419e1bea93c4a12c\naktiv produksjonsfase: 17 – tekstboksbakgrunn\naktiv branch: feature/phase-17-text-background\naktiv draft-PR: #50\naktiv sak: #35\nprosjektskjema på branchen: versjon 10\nsamlet kontroll: npm run verify\nautomatisk kodekontroll: bestått på verifisert kode-head\nmanuell PC-/Telefon-regresjon: gjenstår\narkitekturrapporter etter nye moduler: gjenstår\n\`\`\`\n\nFase 15 og 16 er ferdige på \`main\`. Fase 17 er avgrenset til tekstboksbakgrunn og forblir draft til siste automatiske og manuelle kontroll er dokumentert.`,
)

replaceExact(
  'docs/EDITOR_PLANNING.md',
  `- side- og elementfarger`,
  `- side- og elementfarger, inkludert varig tekstboksbakgrunn`,
)

replaceExact(
  'docs/EDITOR_PLANNING.md',
  `fase 16  Automatisert testgrunnlag\nfase 17  Tekstboksbakgrunn og små eksisterende modellgap`,
  `fase 16  Automatisert testgrunnlag – fullført\nfase 17  Tekstboksbakgrunn – pågår`,
)

replaceExact(
  'docs/RIGHT_PROPERTIES_PANEL.md',
  `Tekstboksbakgrunn er ikke en modellert egenskap i versjon 9 og vises derfor ikke i panelet eller \`Farger\`. Gapet spores i sak #35.`,
  `Tekstboksbakgrunn er varig \`TextAppearance\` i versjon 10. Den redigeres i \`Farger\`, ikke som en parallell verdi i høyremenyen. Låst Tekst kan fortsatt inspiseres i høyremenyen, mens Bakgrunn og Tekstfarge er deaktiverte i \`Farger\` og avvises ved reducergrensen.`,
)

replaceExact(
  'docs/FILE_SIZE_CONTROL.md',
  `Kjør hele kvalitetskontrollen:\n\n\`\`\`powershell\nnpm run check\n\`\`\`\n\n\`npm run check\` kjører regeltestene og repositorykontrollen først. Den eksisterende GitHub Actions-workflowen kjører samme kommando på pull requests og ved push til \`main\`.`,
  `Kjør repositorykontrollen uten nettleserregresjon:\n\n\`\`\`powershell\nnpm run check\n\`\`\`\n\nKjør full sikkerhetskontroll, inkludert Chromium-regresjonen:\n\n\`\`\`powershell\nnpm run verify\n\`\`\`\n\n\`npm run check\` kjører regeltestene og repositorykontrollen først. \`npm run verify\` kjører deretter den kritiske E2E-flyten. GitHub Actions-workflowen bruker \`npm run verify\` på pull requests og ved push til \`main\`.`,
)

replaceExact(
  'docs/RESPONSIVE_DESIGN.md',
  `- farger og rammer`,
  `- farger og rammer, inkludert Tekst-bakgrunn`,
)

replaceExact(
  'docs/MOBILE_DESIGN_CONTROLS.md',
  `- \`npm run check\` og separate desktop-/mobiltester er bestått`,
  `- \`npm run verify\` og separate desktop-/mobiltester er bestått`,
)

const codeAudit = `# Kodeaudit og tekniske grenser\n\nDette dokumentet beskriver den aktive framtidsrettede auditen for fase 17 – tekstboksbakgrunn.\n\n## Status\n\n\`\`\`text\nmain: ecb443d384a1e0999ef14767419e1bea93c4a12c\nbranch: feature/phase-17-text-background\ndraft-PR: #50\nissue: #35\nprosjektskjema på branchen: 10\nverifisert kode-head: ea2a446044eca7423d40c027320922d1ea444151\nQuality på verifisert kode-head: success\nstatus: ikke mergeklar før siste branch-head, dokumentasjon, rapporter og manuell regresjon er verifisert\n\`\`\`\n\n## Levert modellendring\n\n- \`TextEditorElement\` har egen serialiserbar \`appearance: TextAppearance\`.\n- \`TextAppearance\` inneholder bare validert \`backgroundColor: EditorColor\`.\n- standardverdien er kanonisk \`#FFFFFF\`.\n- typografi og tekstfarge forblir i \`TextElementStyle\`.\n- prosjektskjemaet økes fra 9 til 10.\n- framtidig migrering 9 → 10 må legge til standard \`TextAppearance\`.\n- hardkodet hvit tekstbakgrunn er fjernet fra CSS; rendering leser prosjektdata.\n\n## State- og valideringsgrenser\n\nReducerhandlingen \`set-text-background-color\` avviser:\n\n- ugyldig eller ikke-kanonisk farge\n- manglende element\n- feil elementtype\n- element på feil side\n- låst Tekst\n- uendret farge\n\nAvviste handlinger returnerer samme state-identitet og bevarer \`updatedAt\`. Gyldig mutasjon endrer bare målrettet Tekst-element.\n\n## UI-grense\n\n- \`Farger\` viser \`Bakgrunn\` før \`Tekstfarge\` for hvert Tekst-element.\n- kontrollene er avledet fra aktiv side; ingen parallell palett lagres.\n- låste Tekst-elementer vises, men begge fargefeltene er deaktiverte.\n- høyremenyen beholder teksttypografi, lenke og elementhandlinger; tekstbakgrunn dupliseres ikke der.\n\n## Testdekning\n\nDen verifiserte kodekjernen hadde:\n\n\`\`\`text\nfilpolicytester: 9 bestått\nproduksjonsfiler kontrollert: 139\nproduksjonsfiler >= 250 linjer: 0\nESLint: bestått\nTypeScript og test-typecheck: bestått\nDependency Cruiser: 120 moduler, 347 avhengigheter, 0 brudd\nenhetstester: 20 bestått\nChromium-regresjon: 1 bestått\nVite: 129 moduler transformert\nCSS: 45.35 kB, gzip 7.34 kB\nJavaScript: 282.25 kB, gzip 83.33 kB\nproduksjonsbuild: bestått\n\`\`\`\n\nEnhetstestene dekker nøyaktig \`TextAppearance\`-form, standardoppretting, gyldig mutasjon, ugyldig/ukjent/uendret handling og låsing. E2E-flyten oppretter Tekst, åpner \`Farger\`, verifiserer rekkefølgen og kontrollerer faktisk rendret bakgrunn.\n\n## Samlet sikkerhetskontroll\n\n\`\`\`powershell\nnpm run verify\n\`\`\`\n\nKommandoen kjører hele \`npm run check\` og deretter den kritiske Chromium-regresjonen. GitHub Quality bruker samme kommando. Arkitekturrapportene genereres fortsatt eksplisitt når modul-/importgrafen er endret:\n\n\`\`\`powershell\nnpm run architecture:json\nnpm run architecture:diagram\n\`\`\`\n\n## Filstørrelsesrisiko\n\nSiste målte topp:\n\n\`\`\`text\n247  src/components/canvas/useElementPointerTransform.ts\n241  src/components/canvas/EditorCanvasElement.tsx\n236  src/model/imagePresentation.ts\n229  src/styles/toolbar.css\n226  src/state/reduceColorProjectAction.ts\n224  src/components/sidebar/HeaderCreationControl.tsx\n211  src/components/properties/ElementLinkPropertiesSection.tsx\n202  src/state/editorProjectReducer.ts\n199  src/components/properties/ImagePropertiesSection.tsx\n192  src/components/canvas/snapElementMove.ts\n\`\`\`\n\n\`useElementPointerTransform.ts\` skal deles etter ansvar før ny logikk legges til. \`reduceColorProjectAction.ts\` har vokst til 226 linjer og skal overvåkes; neste større fargeansvar bør vurderes trukket ut før terskelen nås. Ingen unntak er aktive.\n\n## Arkitekturkonsekvens\n\nFase 17 legger til to produksjonsmoduler:\n\n- \`src/model/textAppearance.ts\`\n- \`src/state/useTextAppearance.ts\`\n\nImportgrafen er derfor endret, og både \`architecture.json\` og \`docs/dependency-graph.mmd\` må regenereres på siste branch-head før PR-en kan gjøres klar.\n\n## Jobbkritisk risiko utenfor fase 17\n\nEditoren har ennå ikke lokal prosjektlagring, autolagring, krasjgjenoppretting, import eller angre/gjør om. Automatiske tester kan beskytte eksisterende funksjoner mot kodefeil, men de kan ikke hindre tap av prosjektstate ved nettleseroppfriskning eller avslutning.\n\nFør programmet brukes som eneste arbeidsverktøy må denne risikoen behandles eksplisitt. Roadmapendring eller en avgrenset jobbberedskapsfase skal ikke bygges skjult i PR #50; den må besluttes og dokumenteres separat.\n\n## Konklusjon\n\nFase-17-kjernen følger eksisterende modell- og reducergrenser og har målrettet testdekning. Ingen senere feature er blandet inn. PR #50 skal forbli draft til siste branch-head har grønn \`npm run verify\`, oppdaterte arkitekturrapporter, ren diff og godkjent manuell PC-/Telefon-regresjon.\n`
write('docs/CODE_AUDIT.md', codeAudit)

const readiness = `# Produksjonsklarhet for jobbbruk\n\nDette dokumentet er en kvalitetsport før Website-editoren brukes i faktisk arbeid. Det erstatter ikke roadmapen og senker ingen tekniske krav.\n\n## Full automatisk kontroll\n\n\`\`\`powershell\nnpm run verify\n\`\`\`\n\nKommandoen kjører:\n\n1. ni tester av filstørrelsespolicyen\n2. kontroll av alle produksjonsfiler\n3. ESLint\n4. TypeScript for produksjon og tester\n5. Dependency Cruiser\n6. alle enhetstester\n7. produksjonsbuild\n8. kritisk Chromium-regresjon\n\nGitHub Quality kjører samme kommando. Lokal og remote kontroll skal derfor måle samme leveranse.\n\n## Krav før PR #50 kan gjøres klar\n\n- siste remote branch-head er kjent\n- \`npm run verify\` består på samme head\n- GitHub Quality består på samme head\n- \`git diff --check\` er ren\n- arkitekturrapportene er regenerert og kontrollert\n- alle påvirkede autoritative dokumenter viser skjema 10 og korrekt fase-17-status\n- kodeaudit er gjennomført mot framtidige fasegrenser\n- manuell PC- og Telefon-regresjon er bestått\n- PR-en er mergebar og uten uløste reviewtråder\n- merge skjer bare etter eksplisitt \`godkjent\`\n\n## Manuell regresjon\n\n1. Start med \`npm run dev\`.\n2. Opprett Tekst og skriv innhold.\n3. Endre font, størrelse, stil, justering, linjehøyde og tekstfarge.\n4. Endre Tekst \`Bakgrunn\` i \`Farger\`; bekreft at riktig Tekst endres.\n5. Lås Tekst; bekreft at Bakgrunn og Tekstfarge kan ses, men ikke endres.\n6. Lås opp, flytt og endre størrelse med peker og relevante tastatursnarveier.\n7. Opprett Seksjon og kontroller bakgrunn og ramme.\n8. Opprett Knapp og kontroller design, tekst og lenke.\n9. Importer Bilde og kontroller alternativ tekst, modus, utsnitt og zoom.\n10. Opprett Header og kontroller logo, navn, undertittel, farger, font og høyde.\n11. Bytt mellom PC og Telefon og kontroller at eksisterende verdier vises konsistent.\n12. Kontroller markering, panelåpning/-lukking, låsing og sikker sletting.\n\nEt avvik dokumenteres og rettes på samme branch. Etter en feilretting kjøres hele \`npm run verify\` på nytt.\n\n## Kjent kritisk begrensning\n\nProgrammet mangler fortsatt lokal prosjektlagring, autolagring, krasjgjenoppretting, prosjektimport og angre/gjør om. Nettleseroppfriskning, lukking eller krasj kan derfor miste prosjektstate. Dette er en reell jobbrelatert risiko og skal ikke omtales som løst av tester.\n\nEn separat, eksplisitt beslutning må avgjøre om jobbberedskap skal prioriteres foran fase 18. Ingen slik funksjon blandes inn i PR #50.\n\n## Stabilitetsregel\n\nNår en kjent godkjent commit er valgt til jobbbruk:\n\n- nye features utvikles ikke på samme arbeidskopi under kritisk arbeid\n- bare dokumenterte feil med direkte konsekvens rettes\n- hver rettelse går gjennom branch, \`npm run verify\`, PR og eksplisitt godkjenning\n- kjent god commit og synkronisert \`main\` beholdes som gjenopprettingspunkt\n`
write('docs/PRODUCTION_READINESS.md', readiness)

const handover = `# Prompt til neste chat\n\nKopier hele teksten mellom \`START HANDOVER\` og \`SLUTT HANDOVER\` inn i neste chat.\n\n---\n\n# START HANDOVER\n\nDu overtar Website-editoren som prosjektleder, teknisk arkitekt og kodeansvarlig. Svar på norsk. Bruk faktisk GitHub-state, faktisk kode og brukerens terminaloutput som sannhetskilder. Ikke gjett og ikke påstå at branch, HEAD, clean tree, tester eller synkronisering er bekreftet uten bevis.\n\n## Repo\n\n\`\`\`text\nGitHub: https://github.com/tomhaugstulen-star/webside.git\nLokalt: C:\\Users\\tomha\\Desktop\\website\nmain: ecb443d384a1e0999ef14767419e1bea93c4a12c\naktiv branch: feature/phase-17-text-background\naktiv draft-PR: #50 – Fase 17: tekstboksbakgrunn\naktiv issue: #35\n\`\`\`\n\nAldri utvikling direkte på \`main\`. Ingen merge uten at brukeren eksplisitt skriver \`godkjent\`. \`fungerer\` betyr bare at en manuell test passerte.\n\n## Tids- og kvalitetskontekst\n\nBrukeren skal bruke programmet i faktisk arbeid svært snart og ønsker høy sikkerhet mot regresjoner. Dette betyr ikke at kvalitet eller dokumentasjon kan kuttes. Arbeidet skal være effektivt, men hver endring må være avgrenset, testet, auditert og dokumentert. Ikke bruk tid på å gjenta allerede verifisert arbeid.\n\n## Fase 17 – låst omfang\n\nFase 17 er avgrenset til issue #35:\n\n- ny serialiserbar \`TextAppearance\`\n- \`backgroundColor: EditorColor\`\n- standard \`#FFFFFF\`\n- \`TextEditorElement.appearance\`\n- prosjektskjema 10\n- typed \`set-text-background-color\`\n- validering av feil type, manglende, låst, ugyldig og uendret handling\n- \`Bakgrunn\` før \`Tekstfarge\` i \`Farger\`\n- rendering fra prosjektdata\n- modell-, reducer- og Chromium-test\n\nIssue #36, #37, #38 og senere roadmaparbeid er eksplisitt utenfor PR #50. Ikke bland inn lokal lagring, navigator, Hero eller andre features i denne branchen.\n\n## Implementert kode\n\nNye produksjonsmoduler:\n\n\`\`\`text\nsrc/model/textAppearance.ts\nsrc/state/useTextAppearance.ts\n\`\`\`\n\nBerørte hovedgrenser:\n\n- \`src/model/editorProject.ts\` bruker skjema 10 og TextAppearance\n- \`src/model/createEditorElement.ts\` oppretter standardbakgrunn\n- \`src/state/editorProjectAction.ts\` har typed action\n- \`src/state/reduceColorProjectAction.ts\` validerer og muterer\n- \`src/model/projectColorEntries.ts\` eksponerer Bakgrunn og Tekstfarge\n- \`src/state/useProjectColors.ts\` ruter oppdatering\n- \`src/components/canvas/getElementAppearanceCssStyle.ts\` renderer lagret bakgrunn\n- hardkodet hvit Tekst-bakgrunn er fjernet fra \`src/styles/canvas.css\`\n\n## Verifisert kodebaseline\n\nBrukerens terminal bekreftet på den første fase-17-kodekjernen:\n\n\`\`\`text\nfilpolicytester: 9 bestått\nproduksjonsfiler: 139\nfilgrensebrudd: 0\nESLint: bestått\nTypeScript: bestått\nDependency Cruiser: 120 moduler, 347 avhengigheter, 0 brudd\nenhetstester: 20 bestått\nVite: 129 moduler transformert\nCSS: 45.35 kB, gzip 7.34 kB\nJavaScript: 282.25 kB, gzip 83.33 kB\nproduksjonsbuild: bestått\n\`\`\`\n\nDen første E2E-testen feilet fordi testen satte en kontrollert fargeinput med direkte DOM-JavaScript. Produksjonslogikken var ikke årsaken. Testen ble rettet til Playwright \`fill()\`. GitHub Quality på kode-head \`ea2a446044eca7423d40c027320922d1ea444151\` fullførte med \`success\`, inkludert E2E.\n\nSenere commits la til samlet \`npm run verify\`, endret Quality til samme kommando og startet dokumentasjonssynken. Derfor må PR #50 sin faktiske siste head og siste CI alltid leses på nytt før noen status påstås.\n\n## Samlet kontroll\n\n\`\`\`powershell\nnpm run verify\n\`\`\`\n\nDette kjører hele \`npm run check\` og deretter \`npm run test:e2e\`. GitHub Quality bruker samme kommando.\n\nFordi fase 17 la til produksjonsmoduler og imports, må også disse kjøres før PR-klargjøring:\n\n\`\`\`powershell\nnpm run architecture:json\nnpm run architecture:diagram\n\`\`\`\n\n## Dokumentasjon\n\nFølgende påvirkes og skal være synkronisert:\n\n1. \`README.md\`\n2. \`docs/WORK_PLAN.md\`\n3. \`docs/PROJECT_RULES.md\`\n4. \`docs/ELEMENT_MODEL.md\`\n5. \`docs/EDITOR_PLANNING.md\`\n6. \`docs/RIGHT_PROPERTIES_PANEL.md\`\n7. \`docs/RESPONSIVE_DESIGN.md\`\n8. \`docs/MOBILE_DESIGN_CONTROLS.md\`\n9. \`docs/FILE_SIZE_CONTROL.md\`\n10. \`docs/CODE_AUDIT.md\`\n11. \`docs/PRODUCTION_READINESS.md\`\n12. \`docs/NEXT_CHAT_PROMPT.md\`\n\nEt kontrollert midlertidig skript \`scripts/sync-phase-17-docs.mjs\` kan ligge på branchen fram til lokal dokumentasjonssynk er utført. Skriptet skal stoppe ved feil branch, dirty tree eller uventet dokumenttekst. Etter vellykket kjøring fjernes skriptet før sluttcommit, med mindre det finnes en eksplisitt grunn til å beholde det.\n\n## Neste konkrete rekkefølge\n\n1. Hent faktisk PR #50-head og CI-status fra GitHub.\n2. Kontroller brukerens lokale branch og clean tree fra terminaloutput.\n3. Hent siste remote branch.\n4. Kjør det kontrollerte dokumentasjonsskriptet dersom dokumentene ikke allerede er synkronisert.\n5. Les og kontroller dokumentdiffen; ikke anta at skriptets suksess alene er nok.\n6. Fjern det midlertidige skriptet etter bruk.\n7. Regenerer \`architecture.json\` og \`docs/dependency-graph.mmd\`.\n8. Kjør \`npm run verify\`.\n9. Kjør \`git diff --check\`, \`git status --short\` og \`git diff --stat\`.\n10. La brukeren gjennomføre manuell regresjon fra \`docs/PRODUCTION_READINESS.md\` i PC og Telefon.\n11. Commit og push bare kontrollerte endringer.\n12. Verifiser PR-filer, mergebarhet, reviews, tråder og GitHub Quality på nøyaktig siste head.\n13. Gjør PR-en klar for review først når alt er grønt.\n14. Merge bare etter ny eksplisitt \`godkjent\`.\n\n## Jobbkritisk ærlighet\n\nProgrammet mangler fortsatt lokal prosjektlagring, autolagring, krasjgjenoppretting, prosjektimport og angre/gjør om. Tester kan oppdage kodebrudd, men kan ikke hindre tap av prosjektstate ved oppfriskning eller lukking. Ikke påstå at programmet er fullt jobbsikkert før denne risikoen er eksplisitt besluttet og håndtert. Ikke bland løsningen inn i PR #50; opprett en separat, avgrenset jobbberedskapsbeslutning etter at fase 17 er ferdig.\n\n## Permanente regler\n\n- ordinære produksjonsfiler: 0–249 linjer\n- 250–299 krever eksplisitt, begrunnet unntak\n- 300+ er alltid blokkert\n- reduceren er siste valideringsgrense\n- ugyldige og uendrede handlinger returnerer samme state\n- \`updatedAt\` endres bare ved reell gyldig mutasjon\n- DOM, CSS, File, Blob, Object URL og lokal filsti er ikke prosjektdata\n- arkitekturrapporter regenereres ved faktisk modul-/importendring\n- faktisk kode og terminaloutput vinner over foreldet dokumentasjon\n\n# SLUTT HANDOVER\n`
write('docs/NEXT_CHAT_PROMPT.md', handover)

const expectedMarkers = [
  ['docs/WORK_PLAN.md', 'aktiv produksjonsfase: 17 – tekstboksbakgrunn'],
  ['docs/PROJECT_RULES.md', 'prosjektskjema på fase-17-branchen er versjon 10'],
  ['docs/ELEMENT_MODEL.md', 'EDITOR_PROJECT_SCHEMA_VERSION = 10'],
  ['docs/EDITOR_PLANNING.md', 'aktiv draft-PR: #50'],
  ['docs/RIGHT_PROPERTIES_PANEL.md', 'TextAppearance'],
  ['docs/FILE_SIZE_CONTROL.md', 'npm run verify'],
  ['docs/RESPONSIVE_DESIGN.md', 'inkludert Tekst-bakgrunn'],
  ['docs/MOBILE_DESIGN_CONTROLS.md', 'npm run verify'],
  ['docs/CODE_AUDIT.md', '120 moduler, 347 avhengigheter'],
  ['docs/PRODUCTION_READINESS.md', 'Full automatisk kontroll'],
  ['docs/NEXT_CHAT_PROMPT.md', 'aktiv draft-PR: #50'],
]

for (const [relativePath, marker] of expectedMarkers) {
  assertContains(relativePath, marker)
}

console.log('Dokumentasjonssynk fullført med alle kontrollmarkører.')
console.log(runGit(['diff', '--stat']))
