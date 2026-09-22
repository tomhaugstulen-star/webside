# Arbeidsplan

Dette dokumentet er den autoritative rekkefølgen for Website-editoren.

Programmet er et lokalt énbrukerverktøy. Stabilitet, enkelhet og forutsigbar drift prioriteres foran kontoer, flerbrukerfunksjoner og skyarkitektur.

## Nåstatus

- `main` er fullført gjennom fase 19 – sider, seksjons-ID-er og navigasjonsmodell (PR #62)
- separat header-descender-fiks er merget i PR #59
- aktiv vedlikeholdsleveranse før fase 20 er #63 på `feature/editor-polish-before-phase-20-v2`
- #63 er ferdig implementert og `npm run verify` er grønn; manuell PC-/Telefon-kontroll, oppdaterte arkitekturrapporter i commit, PR/CI og uttrykkelig mergegodkjenning gjenstår
- repo-audit #64 er en egen oppryddingsgate før fase 20
- neste produksjonsfase etter #63 og #64 er fase 20 – nettstedets Header og menynavigasjon
- synlige topp-/menyhandlinger som ennå ikke virker skal beholdes som planlagte produktfunksjoner og aktiveres i riktig fase
- den tidligere fase-25-PR-en #52 er parkert og skal ikke videreutvikles eller merges
- ny faseimplementering starter alltid fra oppdatert `main` på en egen branch

## Låst roadmap

```text
fase 18  Arbeidsportalnavigasjon og navigator
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
fase 29  ChatGPT clipboard-arbeidsflyt
fase 30  Prosjektinnstillinger, SEO, statisk eksport og publisering
```

Konseptreferanse for fase 29: `docs/AI_CHATGPT_CLIPBOARD_WORKFLOW.md`. Fase 29 er låst til en manuell ChatGPT-workflow der valgte editorområder sendes via kontrollert utklipp med eksakte mål og prosjektkontekst, og resultatet valideres og forhåndsvises før godkjenning. Direkte OpenAI API-integrasjon, AI-backend og API-nøkler er ikke del av prosjektplanen, verken nå eller som planlagt senere oppgradering. Dokumentet er en produktreferanse, ikke en egen status- eller roadmap-sannhetskilde. Endelig fase-29-omfang låses i egen GitHub-sak når fasen starter.

Rekkefølgen endres bare etter en ny, uttrykkelig beslutning fra brukeren. Endringen dokumenteres her før kodearbeidet starter.

## Fast arbeidsflyt per fase

1. Kontroller faktisk `main`, åpne PR-er, branch og mergebase.
2. Opprett eller oppdater én GitHub-sak med låst omfang og akseptansekriterier.
3. Implementer bare den aktive fasen på egen branch.
4. Hold ordinære produksjonsfiler under 250 linjer.
5. Kjør full automatisk kontroll etter siste produksjonsendring.
6. Regenerer arkitekturrapporter ved modul- eller importendringer.
7. Test relevant funksjonalitet manuelt i PC- og Telefon-visning.
8. Kontroller diff, PR, reviews, tråder og CI på nøyaktig siste head.
9. Oppdater de tre permanente dokumentene bare når modell, regler eller roadmap faktisk er endret.
10. Merge bare etter uttrykkelig godkjenning.

Standardkontroll:

```powershell
npm run verify
npm run architecture:json
npm run architecture:diagram
git diff --check
git status --short
git diff --stat
```

## Fase 18 – arbeidsportalnavigasjon og navigator

Fasen er fullført og merget i PR #58.

### Levert

- oversikt for aktivt prosjekt
- hierarkisk navigator for gjeldende sider og elementer
- finne og markere element fra navigatoren
- vise elementtype, navn, synlighet og låsestatus
- filtrering etter elementtype og status
- synkronisert valg mellom navigator og lerret
- eksisterende `EditorProject` og selection-flyt uten parallell prosjekt-/selection-state

Globalt `Ctrl + K`-hurtigsøk ble prøvd lokalt, men ble eksplisitt tatt ut før commit fordi funksjonen ikke er ønsket. Ingen hurtigsøk-kode ble merget.

## Fase 19 – sider, seksjons-ID-er og navigasjonsmodell

Fasen er fullført og merget i PR #62. Sak #60 er avsluttet.

Levert:

- kontrollert sideoppretting, navngiving, slug, sletting og rekkefølge
- minst én side i prosjektet til enhver tid
- stabile offentlige seksjons-/anker-ID-er separat fra interne element-ID-er
- én serialiserbar, typet navigasjonsmodell med stabile side- og seksjonsmål
- deterministisk opprydding av dangling navigasjonsreferanser
- schema 10 → 11 med kontrollert migrering
- sidevelger i toppverktøylinjen og side-/navigasjonsredigering i Prosjekt-panelet
- faktisk Header-meny og menyrendering er fortsatt utsatt til fase 20

## Vedlikeholdsgate før fase 20

### #63 – editor polish

Implementert på aktiv branch:

- 1 px standardramme for nye innrammede elementer
- Tekst får serialiserbar ramme med `Ingen` og 1–10 px
- snapping og guider for lik bredde/høyde under resize
- redigerbar HEX-kode i delte fargekontroller
- pipette via EyeDropper med kontrollert fallback
- schema 11 → 12 for tekstboksramme
- `npm run verify` er grønn med 31 unit-tester og 3 E2E-tester

Gjenstår før #63 kan merges:

- manuell kontroll av standardramme, tekstramme, lik-størrelse-snapping, HEX og pipette
- commit av regenererte `architecture.json` og `docs/dependency-graph.mmd`
- PR, diff/review/trådkontroll og CI på nøyaktig siste head
- uttrykkelig brukergodkjenning før merge

### #64 – repo-opprydding

Auditen før fase 20 fant:

- ubrukte template-/assetfiler
- aktive UI-kontroller uten implementert handling
- et testgap for resize-snapping og HEX/pipette
- BOM i `SidebarPanels.tsx`
- behov for å sikre at genererte arkitekturrapporter følger siste modulendringer

Dette ryddes separat uten å implementere funksjonene som hører til fase 20, 24, 25 eller 27.

## Synlige UI-handlinger som skal bli funksjonelle

Knappene som allerede finnes i editoren er ikke ment som permanent dødt UI. De kobles til roadmapen slik:

- `Angre` / `Gjør om` → fase 24
- `Lagre` → fase 25
- `Dupliser prosjekt` → fase 26
- `Forhåndsvisning` → fase 27
- `Prosjektnavn`, `Prosjektinnstillinger`, `Domene`, `SEO`, `Publiser` og `Hjelp` → fase 30

Før den aktuelle fasen er implementert skal kontrollen være tydelig deaktivert eller merket som kommende, men ikke fjernes som om funksjonen er avlyst.

Fase 30 skal låse den konkrete publiseringsmodellen før kodearbeid starter, inkludert hvordan domene, SEO og faktisk publisering/deployment skal fungere.

## Fase 25 – lokal prosjektlagring, autolagring og gjenoppretting

Fasen er planlagt, men ikke aktiv.

Låste hovedkrav:

- automatisk, debounced lagring etter reelle prosjektendringer
- lokal IndexedDB-lagring av prosjekt og importerte bilde-/logofiler
- gjenoppretting før normal redigering starter
- tydelig status for lagrer, lagret og feil
- en feil skal aldri rapporteres som `Lagret`
- lagringsfeil skal være synlig uten å stoppe hele arbeidsøkten når midlertidig videre arbeid er trygt
- robust reset ved inkompatibel eller strukturelt mangelfull database
- ingen kontoer, flerbrukerfunksjoner eller skykrav

Fasen implementeres på en ny branch fra den da gjeldende `main`. Gammel kode fra PR #52 kan brukes som referanse, men skal ikke merges direkte etter fase 18–24.

## Separat backlog

Disse sakene blandes ikke inn i aktiv fase uten uttrykkelig beslutning:

- #36 editor-only elementgrense når designramme er `Ingen`
- #37 elementnotat og høyrepanelendringer
- #38 like mellomrom og fordelingsguider
- #3 er den eldre planleggingsaken for viewport-spesifikke mobilkontroller og hører funksjonelt til fase 23
- #57 er dekket av implementasjonen i #63 og skal ikke ha en separat kodeleveranse; saken kan lukkes når #63 er merget

## Dokumentregel

Detaljert faseomfang, auditfunn, testplan og handover lagres i GitHub-saken og PR-en. Permanente status-, audit-, readiness- eller chat-handoverdokumenter opprettes ikke.


## Fase 30 – prosjektinnstillinger, SEO, statisk eksport og publisering

Målet er at et ferdig nettsted kan tas ut av Website-editoren som en komplett statisk mappe og legges direkte på vanlig webhotell/domene.

Låste krav:

- generer ferdige statiske filer for hele nettstedet
- output skal kunne lastes direkte opp til domenets dokumentrot eller en valgt undermappe i cPanel/vanlig webhotell
- generert nettsted skal ikke kreve Node.js, Vite, React-devserver, database eller egen backend for å vises
- generer nødvendige HTML-, CSS-, JavaScript- og assetfiler med relative eller kontrollerte URL-er
- flere sider skal genereres med stabil og forståelig mappestruktur/URL-struktur
- interne side- og seksjonslenker skal fungere i den eksporterte siden
- bilder, logoer og øvrige assets skal kopieres til eksportpakken
- SEO-felter og relevante metadata skal inngå i genererte HTML-filer
- eksporten skal kunne pakkes som én mappe/ZIP som brukeren selv kan laste opp
- eventuell senere direkte publisering til hosting er et tillegg; statisk eksport er grunnkravet
- editorens egne kildefiler, prosjektstate og utviklingsverktøy skal ikke følge med i den offentlige nettsidepakken

Den konkrete URL-/mappestrukturen, asset-cache-regler og eventuell direkte hostingintegrasjon låses når fase 30 starter.
