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

Ikke gjenopprett parallelle historiske fasefiler.

## Gjeldende status

```text
siste fullførte produksjonsfase på main: 13 – Logo og header
aktiv produksjonsfase: 14 – korrigeringslinjer og snapping
aktiv branch: feature/alignment-guides
base origin/main: ff39d8df7d59843c796616ad7d56cf00a41236f8
GitHub-sak: #34 – åpen
pull request: ikke opprettet
prosjektskjema: versjon 9
```

Faktisk branch-head og `origin/main` skal alltid leses på nytt før nye operasjoner.

## Implementert fase 14

- pekerflytting for Seksjon, Bilde, Tekst og Knapp
- venstre/midt/høyre og topp/midt/bunn mot andre synlige elementer
- horisontal og vertikal lerretsmidt
- 6 px snapgrense i lerretskoordinater
- X og Y velges uavhengig
- nærmeste treff per akse
- midtanker prioriteres ved lik avstand
- guider vises bare mens snap er aktiv
- låste elementer kan være mål
- skjulte elementer og aktivt element ekskluderes
- Header og Seksjon kan være mål
- mål og lerretsmål fryses ved pekerstart
- alignment preview er transient
- resize og tastatur snapping er ikke implementert

Manuelt godkjent:

- elementkanter og elementmidt
- horisontal og vertikal lerretsmidt
- samtidig snapping på begge akser

## Gjeldende Header

- én sammensatt `HeaderEditorElement`
- lokal PNG-, JPEG- eller WebP-logo
- navn og valgfri undertittel
- fast ved `x = 0, y = 0`
- full aktiv lerretsbredde
- ingen peker- eller tastaturflytting
- høyde 70–100 px
- bakgrunn, tekstfarge og ramme
- fontfamilie
- fontstørrelse 12–96 px, standard 24 px
- ingen låseknapp eller låsestatus
- sikker sletting og delt asset-livssyklus

Header og fontstørrelse er manuelt godkjent av brukeren.

## Kodeaudit 30. juli 2026

Hele branch-diffen og dens modell-/state-avhengigheter ble gjennomgått.

Funnet avvik:

- Header rendret ved `y = 0`, men fem kodeveier kunne fortsatt lese eller lagre gammel y.

Rettet i:

- `src/model/createEditorElement.ts`
- `src/state/setElementDesktopLayout.ts`
- `src/components/canvas/getAlignmentTargets.ts`
- `src/components/canvas/getCanvasContentHeight.ts`
- `src/model/findElementCreationPosition.ts`

Ny invariant:

- Header opprettes, serialiseres, rendres og brukes i avledede beregninger ved `x = 0, y = 0`.

Ingen nye modul- eller importkanter ble lagt til av auditrettelsen.

## Siste verifiserte automatiske kontroll

Brukerens siste terminaloutput var på commit `b05baf0`, før de fem auditrettelsene:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 118 moduler, 342 avhengigheter, ingen brudd
Vite: 127 moduler transformert
CSS: 36.85 kB, gzip 6.87 kB
JavaScript: 280.85 kB, gzip 83.22 kB
produksjonsbuild: bestått på 195 ms
```

Ikke bruk dette som endelig branch-status. Ny full kontroll er obligatorisk.

## Arkitekturrapporter

`architecture.json` og `docs/dependency-graph.mmd` ble regenerert etter alignment-modulene.

Senere Header-font- og auditrettelser endret ingen avhengighetskanter. Rapportene trenger ikke regenereres bare av den grunn, men `npm run architecture:check`, diff og status må verifiseres på siste head.

## Gjenstående kontrollrekkefølge

1. Hent siste branch-head lokalt.
2. Kjør `npm run check` og les hele outputen.
3. Kjør repositoryomfattende filstørrelseskontroll.
4. Regresjonstest Header-normaliseringen:
   - Header ligger fast øverst
   - andre elementer opprettes under Header
   - snapping mot Header bruker synlig topp/midt/bunn
   - lerretet får ikke ekstra høyde fra gammel Header-y
5. Fullfør fase-14-manualtestene:
   - låste mål
   - skjulte elementer
   - aktivt element ekskludert
   - alle flyttbare elementtyper
   - pointercancel/tapt capture
   - auto-scroll
   - resize og tastatur uten snapping
   - clamp ved lerretsgrensene
6. Kontroller `git diff --check`, `git status --short` og `git diff --stat`.
7. Oppdater dokumentert kontrollstatus med terminaloutput.
8. Kontroller branch mot `main` og opprett PR først når alt er bestått.
9. Merge aldri uten eksplisitt `godkjent`.

Anbefalt filstørrelseskommando:

```powershell
Get-ChildItem src -Recurse -Include *.ts,*.tsx,*.css |
ForEach-Object {
  $lines = (Get-Content $_.FullName).Count
  if ($lines -ge 240) {
    [PSCustomObject]@{
      Lines = $lines
      File = $_.FullName.Replace("$PWD\", "")
    }
  }
} | Sort-Object Lines -Descending
```

## Kjent separat gap

Tekstboksbakgrunn finnes ikke i modellen og er hardkodet hvit CSS. Dette spores i GitHub-sak #35. Ikke bland denne skjemautvidelsen inn i fase 14.

## Roadmap

Eksisterende senere kandidater er mobiloverstyringer, historikk, autolagring, prosjektimport og publisering.

Hero er ikke registrert som egen leveranse i dagens plan. Roadmapet skal gjennomgås med brukeren etter at fase 14 er fullført og kontrollert. Ikke legg Hero skjult inn i en annen fase.

---
