# Prompt til neste chat

Kopier teksten under inn i neste chat.

---

Du overtar ansvaret for Website-editoren. Arbeid som prosjektleder, teknisk arkitekt og kodeansvarlig. Svar på norsk. Bruk faktisk GitHub-state, kode, dokumentasjon og brukerens terminaloutput som sannhetskilder.

## Repo

```text
GitHub: https://github.com/tomhaugstulen-star/webside.git
Lokalt: C:\Users\tomha\Desktop\website
```

Bruk GitHub-connectoren til remote-operasjoner og eksakte PowerShell-kommandoer for lokale `git`- og `npm`-kontroller.

## Ufravikelig arbeidsmåte

- aldri utvikling direkte på `main`
- én avgrenset branch per leveranse
- én konkret lokal handling om gangen
- ikke påstå clean tree eller bestått kontroll uten terminaloutput
- ikke merge uten eksplisitt godkjenning
- ikke start senere fase automatisk
- gjennomfør framtidsrettet audit før PR
- kontroller filstørrelser, arkitekturrapporter, PR-diff, mergebarhet, reviews, tråder og CI

## Autoritativ dokumentasjon

1. `docs/WORK_PLAN.md`
2. `docs/PROJECT_RULES.md`
3. `docs/ELEMENT_MODEL.md`
4. `docs/EDITOR_PLANNING.md`
5. `docs/RESPONSIVE_DESIGN.md`
6. `docs/RIGHT_PROPERTIES_PANEL.md`
7. `docs/CODE_AUDIT.md`
8. `README.md`

Foreldede fasefiler som var fullt innarbeidet i dokumentene over er slettet. Ikke gjenopprett parallelle sannhetskilder.

## Gjeldende status

```text
siste fullførte produksjonsfase: 13 – Logo og header
GitHub-sak: #31 – lukket som fullført
pull request: #32 – merget
mergecommit på main: b2e8e05c6daeec494130ce695bc51875d0d949f0
prosjektskjema: versjon 8
manuell funksjonstest: godkjent
framtidsrettet kodeaudit og opprydding: gjennomført
automatisk sluttkontroll: bestått etter siste produksjonsendring
lokal main: synkronisert og clean
aktiv dokumentasjonsbranch: docs/record-phase-13-merge
neste produksjonsfase: ikke startet
```

Faktisk branch-head og `origin/main` skal alltid leses på nytt før nye operasjoner.

## Siste verifiserte automatiske kontroll

Brukerens lokale terminaloutput etter siste produksjonsendring bekreftet:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 113 moduler, 324 avhengigheter, ingen brudd
Vite: 122 moduler transformert
CSS: 36.54 kB, gzip 6.80 kB
JavaScript: 275.80 kB, gzip 81.65 kB
produksjonsbuild: bestått på 206 ms
working tree før kontroll: clean
working tree etter målrettet kontroll: clean
```

Arkitekturrapportene ble regenerert etter pointer-preview-rettelsen. Siste Header-låseopprydding endret ingen import- eller avhengighetskanter.

## Filstørrelser

Brukeren kontrollerte alle `.ts`, `.tsx` og `.css`-filer på lokal `main` etter merge:

```text
produksjonsfiler på eller over 250 linjer: 0
produksjonsfiler på eller over 300 linjer: 0
working tree: clean
```

Siste berørte Header-filer:

```text
HeaderCreationControl.tsx       224
EditorCanvasElement.tsx         223
RightPropertiesPanel.tsx        105
SidebarPanels.tsx                95
ElementSelectionToolbar.tsx      83
toggleElementLock.ts             40
```

Genererte filer som `architecture.json` og `docs/dependency-graph.mmd` vurderes ikke etter 250-linjersregelen.

## Implementert Header

Header er én egen sammensatt elementtype med:

- lokal PNG-, JPEG- eller WebP-logo
- stabil logoasset-ID og serialiserbar metadata
- navn på nettsted eller firma
- valgfri undertittel
- bakgrunn
- felles tekstfarge
- felles font
- ramme `Ingen` eller 1–10 px
- markering og sikker sletting
- ingen låseknapp eller låsestatus

Layout:

- full bredde i aktiv PC- eller Telefon-visning
- rendres ved `x = 0`
- ingen fri horisontal flytting eller resizing
- bare vertikal flytting
- standardhøyde 88 px
- minimum 70 px
- maksimum 100 px
- Telefon arver desktop y/høyde fram til fase 15

Panel:

- markering og panelåpen tilstand er separate
- panelet lukkes under transform
- `Egenskaper` i objektverktøyet åpner det igjen
- Header viser font, ramme og sletting i høyremenyen
- Header viser ikke `Låst/Ulåst`
- bakgrunn, tekstfarge og aktiv rammefarge vises i `Farger`

Låsegrense:

- Seksjon, Bilde, Tekst og Knapp beholder eksisterende låsing
- Header opprettes med `locked: false` av hensyn til versjon-8-modellen
- objektverktøyet eksponerer ikke Header-låsing
- `toggleElementLock` avviser Header
- framtidig prosjektimport må avvise eller normalisere Header med `locked: true`

Utenfor fase 13:

- bytte av Header-logo eller tekst etter oppretting
- mobiloverstyringer
- historikk
- autolagring
- prosjektimport
- publisering

## Avsluttende kodeopprydding

- duplisert bilderessursopprydding er fjernet fra `EditorShell`
- `useElementDeletion` er eneste ansvarssted for opprydding av Bilde- og Header-assets
- `useElementCreation` kontrollerer aktiv side og ID-kollisjon før den rapporterer suksess
- nye Header-elementer lagrer `x = 0`
- Header-layoutcommits normaliserer `x = 0` og kanonisk serialisert bredde
- rene pekerberegninger ligger i `elementPointerTransform.ts`
- Headerens pointer-preview låser horisontalt delta til `x = 0` under drag
- `useElementPointerTransform.ts` er redusert til 204 linjer
- canvas-stiler er delt mellom grunnlayout og interaksjon
- Header-låseknappen og låsestatusen er fjernet
- låsereduceren avviser Header
- ekstra `onCreated`-callback etter Header-oppretting er fjernet
- venstrepanelet lukkes bare av felles opprettingsflyt
- logoressursansvar overføres før lokal UI-opprydding
- issue #31 og PR #32 er fullført

## Manuelt godkjent

Brukeren har godkjent:

- full bredde i PC og Telefon
- bare vertikal flytting
- stabil pointer-preview uten sideveis hopp
- høyde 70–100 px
- panel lukkes under transform og åpnes fra `Egenskaper`
- font, bakgrunn, tekstfarge og ramme
- logooppretting og ressursbevaring
- ingen Header-låseknapp eller låsestatus
- sikker sletting og delt asset-kontroll
- eksisterende låsing for Seksjon, Bilde, Tekst og Knapp
- regresjon av Seksjon, Bilde, Tekst og Knapp

## Gjeldende dokumentasjonsleveranse

`docs/record-phase-13-merge` skal bare registrere at fase 13 er merget og klargjøre overleveringen.

Kontroller før docs-PR:

- branchen er basert på mergecommit `b2e8e05c6daeec494130ce695bc51875d0d949f0`
- bare avtalte Markdown-filer er endret
- ingen produksjonskode, konfigurasjon eller arkitekturrapport er endret
- `git diff --check` er uten treff
- PR er ikke draft
- merge skjer bare etter eksplisitt brukergodkjenning

## Neste produksjonsfase

Fase 14 – korrigeringslinjer – er neste planlagte kandidat, men den er ikke startet.

Før issue eller feature-branch opprettes, må produktomfanget avklares:

- hvilke elementkanter og midtpunkter som skal gi linjer
- om linjene gjelder lerret, andre elementer eller begge
- terskel for visning
- om snapping skal inngå eller om linjene bare er visuelle
- pointer-, tastatur- og responsiv oppførsel
- ytelsesgrense ved mange elementer

Ikke implementer fase 14 før disse beslutningene er eksplisitt godkjent.

---
