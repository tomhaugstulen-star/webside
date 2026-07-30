# Kodeaudit og tekniske grenser

Dette dokumentet beskriver den framtidsrettede auditen av fase 15 – duse portalfarger og tydelig visuell struktur – på featurebranchen før merge til `main`.

## Leveransestatus

```text
siste fullførte fase på main: 14 – korrigeringslinjer og snapping
aktiv fase: 15 – duse portalfarger og tydelig visuell struktur
branch: feature/phase-15-portal-colors
verifisert branch-head: 7ea58a500b500efb884544751f0913a1a07cf285
pull request: #43 – draft etter audit, ikke merget
GitHub-sak: #42 – åpen til merge
prosjektskjema: versjon 9
```

Auditen omfatter alle produksjonsfiler endret i fase 15, samspillet mellom portaltema og nettsideprosjektets designverdier, CSS-vedlikehold, komponentklassifisering, filstørrelser, dependency-graf og autoritativ dokumentasjon.

## Arkitekturgrenser

Fase 15 er et editor-UI-tema og skal ikke flytte ansvar mellom lag.

Følgende grenser er kontrollert og bevart:

- `EditorProject` er fortsatt eneste varige sannhetskilde.
- Reduceren er fortsatt siste valideringsgrense.
- Portaltema, hover, fokus, disabled og panelbakgrunner er transient rendering.
- Ingen portalverdi lagres i prosjektmodellen.
- Ingen action, reducer, hook eller validator er lagt til eller endret.
- Ingen skjemaversjon er endret.
- Ingen import er lagt til, fjernet eller flyttet.
- Bilderessurslageret eier fortsatt `File` og Object URL.
- Nettsideprosjektets egne farger eies fortsatt av prosjektdata og prosjektspesifikke renderingsstiler.

## Endringsomfang

Fase 15 endrer portalstiler for:

- toppmeny
- venstre rail
- åpent venstrepanel
- høyrepanel
- arbeidsområde
- kontrollflater
- hover, fokus og disabled
- advarsel, sletting og suksess
- ikonfarger i venstremeny og elementbibliotek

Tre TSX-filer er endret kun for eksplisitte CSS-variantklasser:

```text
src/components/sidebar/LeftSidebar.tsx
src/components/sidebar/ElementsPanel.tsx
src/components/sidebar/ImageImportControl.tsx
```

Det er ingen endring i props, state, eventflyt, elementoppretting eller modellkobling.

## Auditfunn og rettelser

### 1. Ikonfarger var koblet til DOM-rekkefølge

Første implementasjon brukte `nth-child` for å gi hovedverktøy og elementkort egne ikonfarger.

Risiko:

- et nytt menypunkt kunne forskyve alle etterfølgende farger
- endret rekkefølge kunne gi feil semantisk farge
- CSS-en beskrev posisjon i stedet for verktøyets identitet
- regresjonen ville være lett å overse fordi funksjonaliteten fortsatt virket

Rettelse:

```text
rail-button--files
rail-button--design
rail-button--media
rail-button--elements
rail-button--settings

element-card--section
element-card--image
element-card--text
element-card--button
```

Variantene settes eksplisitt fra eksisterende typede verktøy- og elementverdier. Fargene er dermed robuste mot senere utvidelser og omorganisering.

### 2. Semantiske tokens og kompatibilitetsaliaser

Fase 15 innfører eksplisitte `--portal-*`-roller for:

- flater
- kontroller
- tekst
- border
- fokus
- disabled
- fare
- advarsel
- suksess
- ikonvarianter

Eksisterende aliaser beholdes foreløpig:

```text
--text
--muted
--accent
--border
--border-strong
--panel
--app-bg
```

Dette er bevisst kompatibilitet, ikke et nytt parallelt temasystem. Flere eldre stilfiler bruker fortsatt aliasene. De skal ikke fjernes før all restbruk er kartlagt og migrert i en egen kontrollert opprydding.

Nye portalstiler skal foretrekke eksplisitte `--portal-*`-roller.

### 3. Nettsideprosjektets farger er avgrenset

`project-colors.css` er endret bare for editorens kontrollgruppe, overskrift og skillelinjer. Ingen lagret sidebakgrunn, Seksjon-bakgrunn, tekstfarge, Header-farge eller knappdesign er endret.

I `canvas.css` er bare arbeidsområdets portalbakgrunn endret. `.canvas-page` og elementenes prosjektstyrte designverdier er utenfor temaet.

### 4. Panel- og layoutinvarianter er bevart

Kontrollert:

- høyrepanelet er fortsatt 320 px bredt
- under 1680 px er høyrepanelet overlay
- ved 1680 px og bredere reserveres plass
- venstrepanelets bredde og åpne-/lukkelogikk er uendret
- portaltemaet endrer ikke canvasberegninger
- `prefers-reduced-motion` er bevart
- alignment-guider og markeringer bruker eksisterende rendering

### 5. Interaksjonstilstander er samlet

Tidligere dupliserte hvite kontrollflater, fokusfarger og statusfarger er erstattet med semantiske roller.

Kontrollert:

- hover er synlig uten å bli dominant
- valgt tilstand er tydelig
- tastaturfokus bruker felles fokus-ring
- disabled er lesbart og ser ikke aktivt ut
- fare, advarsel og suksess kan skilles
- slettingsdialogen beholder tydelig farehierarki

### 6. Eksisterende kjente modellgap er ikke blandet inn

Følgende er fortsatt separate saker og ble ikke skjult implementert i fase 15:

- issue #35: tekstboksbakgrunn som varig prosjektdata
- issue #36: editor-only elementgrense
- issue #37: elementnotat og høyrepanelmodell
- issue #38: like mellomrom og fordelingsguider
- issue #3: senere mobile designkontroller

Tekstboksens hvite bakgrunn er fortsatt et dokumentert modellgap og håndteres i fase 17.

## Filstørrelser

Repositoryomfattende lokal kontroll på `7ea58a5` ga ingen produksjonsfiler på eller over 250 linjer.

`toolbar.css` er holdt under den aktive terskelen. Fase 15 har ikke flyttet nytt funksjonelt ansvar inn i stilfilen; endringen normaliserer eksisterende visuelle regler.

Genererte filer `architecture.json` og `docs/dependency-graph.mmd` vurderes ikke etter produksjonsgrensen.

## Arkitekturrapporter

Dependency-grafen er uendret:

```text
118 moduler
341 avhengigheter
0 dependency-brudd
```

Rapportene er ikke regenerert fordi fase 15 ikke endrer import- eller modulgrafen. De tre TSX-endringene legger bare til CSS-klassenavn og introduserer ingen import.

## Siste automatiske kontroll

Brukerens terminaloutput på branch-head `7ea58a5` bekreftet:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 118 moduler, 341 avhengigheter, 0 brudd
Vite: 127 moduler transformert
CSS: 45.36 kB, gzip 7.34 kB
JavaScript: 280.72 kB, gzip 83.19 kB
produksjonsbuild: bestått på 197 ms
git diff --check origin/main...HEAD: ingen feil
git status --short: clean
produksjonsfiler >= 250 linjer: 0
```

## Manuell kontroll

Brukeren godkjente den reviderte paletten og den visuelle retningen.

Kontrollert i den visuelle regresjonen:

- toppmeny og portalflater kan skilles
- hovedikonene er lettere å skille
- aktiv PC-/Telefon-tilstand er tydelig
- aktiv venstremenyknapp er tydelig
- venstre rail og åpent panel har ulike roller
- høyrepanelets kontroller er lesbare
- arbeidsområdet kan skilles fra nettsidelerretet
- prosjektets egne farger er uendret
- fare-, advarsel- og fokusuttrykk er tydelige

Den røde topplinjen i referanseskjermbildet tilhører nettleserens dev-miljø og inngår ikke i editorens design.

## PR-kontroll

PR #43 er satt tilbake til draft etter auditrettelsen fordi den oppdaterte branch-headen måtte gjennom ny lokal sluttkontroll. Den kontrollen er nå bestått.

Før PR-en markeres klar for merge skal følgende kontrolleres på nytt mot siste dokumentcommit:

- faktisk PR-head og base
- full changed-file-liste
- mergebarhet
- CI/status
- reviews og kommentarer
- åpne review-tråder
- at dokumentendringene ikke introduserer diff-feil

## Konklusjon

Det finnes ingen kjent funksjons-, modell-, state-, dependency- eller filstørrelsesblokkerer i fase 15.

Den eneste framtidsrettede vedlikeholdsrisikoen som ble funnet – rekkefølgeavhengige ikonfarger – er rettet med eksplisitte semantiske variantklasser.

Fase 15 er teknisk og visuelt klar for endelig PR-kontroll. Den er ikke fullført på `main` før PR #43 er merget etter eksplisitt brukergodkjenning.
