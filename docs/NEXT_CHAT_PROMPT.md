# Prompt til neste chat

Kopier hele teksten mellom `START HANDOVER` og `SLUTT HANDOVER` inn i neste chat.

---

# START HANDOVER

Du overtar ansvaret for Website-editoren. Arbeid som prosjektleder, teknisk arkitekt og kodeansvarlig. Svar på norsk. Bruk faktisk GitHub-state, faktisk kode, autoritativ dokumentasjon og brukerens terminaloutput som sannhetskilder. Ikke gjett, og ikke påstå at noe er clean, testet eller synkronisert uten bevis.

## 1. Repo og lokal mappe

```text
GitHub: https://github.com/tomhaugstulen-star/webside.git
Lokalt: C:\Users\tomha\Desktop\website
Standardbranch: main
```

Bruk GitHub-connectoren til remote-operasjoner, kodeinspeksjon, branches, commits, issues og pull requests. Gi eksakte PowerShell- eller Windows-terminalkommandoer for lokale Git-, Node-, Vite- og manuelle kontroller.

## 2. Siste bekreftede prosjektstatus

```text
gjeldende main: ba8334dab7c423f16358ce423e1f77309884daeb
commit: Merge pull request #48 from tomhaugstulen-star/chore/automated-file-size-check
prosjektskjema: versjon 9
aktiv produksjonsfase: ingen
neste planlagte produksjonsfase: 17 – tekstboksbakgrunn og små eksisterende modellgap
```

Brukerens lokale `main` er bekreftet synkronisert og clean på:

```text
ba8334d (HEAD -> main, origin/main, origin/HEAD) Merge pull request #48 from tomhaugstulen-star/chore/automated-file-size-check
```

## 3. Fullførte leveranser

### Fase 15 – duse portalfarger og tydelig visuell struktur

```text
PR: #43 – merget
mergecommit: 1ae0bebabf3eb02104bafa80a029b40d5c06de12
issue: #42 – lukket som fullført
```

Fase 15 leverte semantiske portaltokens, tydelig oppdeling av toppmeny, venstremeny, paneler, arbeidsområde og lerret, tydelige interaksjonstilstander og semantiske ikonvariantklasser. Brukeren godkjente den visuelle retningen.

### Fase 16 – automatisert testgrunnlag

```text
source branch: feature/phase-16-test-foundation
source head: df0f42f835024d2b05939a1002599033fcd63565
PR: #46 – merget
mergecommit: b8212e84eef496286a83fbab3e05074eb591ddc5
issue: #45 – lukket som fullført
```

Fase 16 leverte:

- Playwright-basert testverktøy for rene TypeScript-moduler og Chromium
- 17 enhetstester
- én kritisk nettleserregresjon
- separat test-typecheck
- GitHub Actions-workflowen `Quality`
- Windows-sikker E2E-runner
- stabil knapp-ID-validering skilt fra SVG-presentasjonskatalogen
- oppdaterte dependency-rapporter

Fase 16 er ferdig. Ikke start den på nytt og ikke opprett en ny fase 16-branch.

### Automatisk produksjonsfilkontroll

```text
source branch: chore/automated-file-size-check
source head: d6f0b48db2a740f90e07d2342ee5ca9beb347c7d
PR: #48 – merget
mergecommit: ba8334dab7c423f16358ce423e1f77309884daeb
issue: #47 – lukket som fullført
```

Kontrollen:

- skanner `.ts`, `.tsx`, `.js`, `.jsx` og `.css` under `src`
- krever 0–249 linjer for ordinære produksjonsfiler
- tillater bare eksplisitte og begrunnede unntak på 250–299 linjer
- blokkerer alltid 300 linjer eller mer
- avviser manglende, ugyldige og foreldede unntak
- viser de ti største produksjonsfilene
- har ni egne policytester
- kjører først i `npm run check`
- kjører i GitHub Actions gjennom samme kvalitetskommando

## 4. Aktiv dokumentasjonssynk

Det arbeides på en ren dokumentasjonsbranch:

```text
branch: docs/sync-phase-16-status
base: ba8334dab7c423f16358ce423e1f77309884daeb
```

Formålet er bare å synkronisere autoritativ dokumentasjon med faktisk ferdigstilt fase 16 og automatisk filstørrelseskontroll.

Dokumenter som oppdateres:

```text
docs/WORK_PLAN.md
docs/CODE_AUDIT.md
docs/NEXT_CHAT_PROMPT.md
```

Ingen produksjonskode, runtime-avhengighet, prosjektmodell eller arkitekturrapport skal endres i denne docs-leveransen.

Kontroller faktisk GitHub-status før du antar at docs-branchen eller en eventuell docs-PR er merget. Ingen merge uten at brukeren eksplisitt skriver `godkjent`.

## 5. Ufravikelig arbeidsmåte

- Aldri utvikling direkte på `main`.
- Én avgrenset feature-, chore- eller docs-branch per leveranse.
- Ingen merge uten at brukeren eksplisitt skriver `godkjent`.
- `fungerer` godkjenner en test, ikke en merge.
- Lås omfang før produksjonskode.
- Ikke bland inn senere faser eller separate issues.
- Hold ordinære produksjonsfiler under 250 linjer.
- 250–299 linjer krever et eksplisitt og konkret begrunnet unntak.
- Ingen produksjonsfil kan være 300 linjer eller mer.
- Gjennomfør framtidsrettet kodeaudit før PR.
- Kjør full automatisk kontroll etter siste produksjonsendring.
- Kontroller diff, PR, mergebarhet, CI/status, reviews, kommentarer og åpne tråder.
- Regenerer arkitekturrapporter bare ved faktisk modul- eller importgrafendring.
- Oppdater autoritativ dokumentasjon etter faktisk mergecommit.
- Bruk faktisk terminaloutput som eneste kilde for lokal branch, HEAD, clean tree og teststatus.

## 6. Autoritative dokumenter

Les i denne rekkefølgen:

1. `docs/WORK_PLAN.md`
2. `docs/PROJECT_RULES.md`
3. `docs/ELEMENT_MODEL.md`
4. `docs/EDITOR_PLANNING.md`
5. `docs/RESPONSIVE_DESIGN.md`
6. `docs/RIGHT_PROPERTIES_PANEL.md`
7. `docs/CODE_AUDIT.md`
8. `docs/FILE_SIZE_CONTROL.md`
9. `README.md`
10. `docs/NEXT_CHAT_PROMPT.md`

Regler:

- Faktisk kode og terminaloutput vinner over foreldet dokumenttekst.
- `WORK_PLAN.md` eier låst rekkefølge og faseomfang.
- `PROJECT_RULES.md` eier varige arbeids-, modell- og arkitekturgrenser.
- `FILE_SIZE_CONTROL.md` beskriver den automatiske linjepolicyen.
- `CODE_AUDIT.md` beskriver gjeldende teknisk baseline og vedlikeholdsrisiko.

## 7. Gjeldende kvalitetsbaseline

Siste verifiserte resultater:

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
Quality-workflow: success
```

`npm run check` kjører:

```text
npm run file-size:test
npm run file-size:check
npm run lint
npm run typecheck
npm run architecture:check
npm run test:unit
npm run build
```

Chromium-regresjonen kjøres separat med:

```powershell
npm run test:e2e
```

## 8. Filstørrelser som må følges

Siste topp:

```text
247  src/components/canvas/useElementPointerTransform.ts
241  src/components/canvas/EditorCanvasElement.tsx
236  src/model/imagePresentation.ts
229  src/styles/toolbar.css
224  src/components/sidebar/HeaderCreationControl.tsx
```

`useElementPointerTransform.ts` har bare to tilgjengelige linjer før kontrollen blokkerer ved 250. Neste funksjonelle endring i denne filen skal starte med ansvarsstyrt oppdeling. Ikke legg til et unntak for å omgå nødvendig refaktorering.

## 9. Neste produksjonsfase

Neste låste fase er:

```text
fase 17 – tekstboksbakgrunn og små eksisterende modellgap
```

Primært omfang:

- implementere issue #35
- varig og validert tekstboksbakgrunn
- standardverdi og skjemakonsekvens
- `Bakgrunn` og `Tekstfarge` under hvert tekstelement i `Farger`
- reducer- og hookstøtte
- rendering fra prosjektdata i stedet for hardkodet CSS
- korrekt låseoppførsel
- kontrollere andre små dokumenterte modellgap og behandle dem separat

Akseptansekriterier:

- bakgrunnsfarge lagres og gjenbrukes stabilt
- låst tekst kan inspiseres, men ikke endres
- ugyldig farge avvises ved reducergrensen
- dokumentasjon og skjemahistorikk oppdateres
- ingen urelaterte funksjoner blandes inn

Ikke start fase 17 før dokumentasjonssynken er kontrollert og merget etter eksplisitt godkjenning.

## 10. Neste konkrete arbeidsrekkefølge

1. Kontroller remote-head og diff på `docs/sync-phase-16-status`.
2. La brukeren hente branchen lokalt.
3. Kjør `git diff --check`, `git status --short` og relevant dokumentkontroll.
4. Åpne docs-PR mot `main`.
5. Kontroller mergebarhet, changed files, CI, reviews og tråder.
6. Merge bare etter ny eksplisitt `godkjent`.
7. Synkroniser lokal `main` etter merge.
8. Les fase 17 på nytt og lås issue/branch før produksjonskode.

# SLUTT HANDOVER
