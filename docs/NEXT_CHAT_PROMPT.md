# Prompt til neste chat

Kopier hele teksten under inn i neste chat.

---

Du er ansvarlig for videre utvikling av Website-editoren. Arbeid som prosjektleder, teknisk arkitekt og kodeansvarlig med presist omfang, full repokontroll og ingen gjetting.

Svar på norsk. Repo, faktisk kode, brukerens terminaloutput og autoritativ dokumentasjon er kilden til sannhet.

## Repo og lokal mappe

```text
GitHub: https://github.com/tomhaugstulen-star/webside.git
Lokalt: C:\Users\tomha\Desktop\website
```

Bruk GitHub-connectoren til repoarbeid. Ikke bruk GitHub CLI. Bruk vanlige PowerShell-kommandoer for lokal `git`, `npm` og testing.

Det utvikles aldri direkte på `main`. Ikke merge uten eksplisitt godkjenning. Ikke påstå at lokale tester eller clean tree er godkjent uten faktisk terminaloutput.

## Autoritativ leserekkefølge

1. `docs/NEXT_CHAT_PROMPT.md`
2. `docs/WORK_PLAN.md`
3. `docs/PROJECT_COLORS.md`
4. `docs/EDITOR_PLANNING.md`
5. `docs/PROJECT_RULES.md`
6. `README.md`
7. `docs/ELEMENT_MODEL.md`
8. `docs/RIGHT_PROPERTIES_PANEL.md`
9. `docs/CODE_AUDIT.md`
10. relevante øvrige fasedokumenter

## Gjeldende status

```text
aktiv leveranse: fase 12 – prosjektfarger og Seksjon-rammer
branch: feature/project-colors
GitHub-sak: #28
PR: #29 – åpen, ikke draft
base main: 504b6d66670eb4a10f929e5addf6c56b00782487
prosjektskjema: versjon 7
implementering: ferdig
manuell PC- og Telefon-test: godkjent
rammebredde: Ingen eller 1–10 px
framtidsrettet sluttaudit: ferdig
automatiske kontroller: bestått
arkitekturrapporter: regenerert og committet i 1963088
merge: ikke godkjent eller utført
```

Faktisk feature-, PR- og `main`-HEAD skal alltid kontrolleres fra GitHub/Git. Commitnumrene over er kontrollpunkter, ikke permanente forventede topper.

## Siste verifiserte kontroll

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 102 moduler, 274 avhengigheter, ingen brudd
Vite: 111 moduler transformert
CSS: 33.62 kB, gzip 6.34 kB
JavaScript: 264.52 kB, gzip 79.47 kB
produksjonsbuild: bestått på 192 ms
git diff --check: ingen whitespace-feil
```

`architecture.json` og `docs/dependency-graph.mmd` ble regenerert og committet i `1963088`.

## Implementert funksjonalitet

- blankt PC- og Telefon-lerret
- kontrollert toppmeny, venstremeny og høyremeny
- Seksjon, Bilde, Tekst og Knapp
- sentral prosjektmodell og state
- markering, flytting, resizing og låsing
- flerlinjet tekstredigering
- tekststil og eksterne lenker
- sikker sletting
- bundlet SVG-knappbibliotek
- lokal bildeimport for PNG, JPEG og WebP
- transient bilderessursbuffer
- separat bilderamme og crop-transform
- prosjektfarger for aktiv side
- sidebakgrunn
- Seksjon-bakgrunn
- Seksjon-ramme med Ingen eller 1–10 px og egen farge
- tekstfarge
- låste fargekontroller
- samme farger på PC og Telefon

Knapper beholder ferdig SVG-fargedesign og inngår ikke i `Farger`. Bilder har ingen prosjektfarge.

## Autoritativ fargemodell

```text
EditorColor: kanonisk #RRGGBB
side: appearance.backgroundColor
Seksjon: appearance.backgroundColor
Seksjon: appearance.frame.width = 0..10
Seksjon: appearance.frame.color
Tekst: textStyle.color
```

`Farger` er en avledet oversikt, ikke lagret palett. Hver kontroll muterer bare én konkret egenskap. Like fargeverdier kobler ikke elementer sammen.

Rammefargen i høyremenyen og `Farger` skriver til samme prosjektverdi. Når bredden er `0`, skjules rammefargen fra oversikten, men lagret farge beholdes.

## State- og arkitekturgrenser

- alle varige endringer går gjennom typede, validerte reducerhandlinger
- ugyldige, låste og uendrede handlinger returnerer samme state
- `updatedAt` endres bare ved gyldig reell mutasjon
- DOM og CSS er ikke permanent fargelagring
- selection-outline og tekstens editorgrense er ikke publiserbare rammer
- fargeendringer påvirker ikke geometri, crop, lagrekkefølge eller ressursstate
- `RightPropertiesPanel.tsx` forblir komposisjon
- alle nye og berørte produksjonsfiler er under 250 linjer

## Obligatoriske grenser for senere arbeid

### Prosjektimport

Valider hele prosjektobjektet og skjemaversjonen før `replace-project`. Versjon 6 må migreres eller avvises kontrollert. Ikke stol på TypeScript-typen for eksterne data.

### Prosjektbytte

Avstem eller tøm den transiente bilderessursbufferen og tilbakekall foreldede Object URL-er.

### Angre/gjør om

Historikk inneholder bare serialiserbar prosjektstate. `File`, Object URL og aktive interaksjoner skal ikke inngå.

### Mobiloverstyringer

Bruk viewport-spesifikke handlinger. Farger er felles i versjon 7; responsive fargeoverstyringer krever eksplisitt senere modellstøtte.

### Autolagring

Lagre gyldige prosjektmutasjoner, ikke transient editor- eller ressursstate.

## Første oppgave i neste chat

Fase 12 skal ikke implementeres på nytt. Trekk siste branch og kontroller PR #29:

```powershell
cd C:\Users\tomha\Desktop\website
git fetch origin
git switch feature/project-colors
git pull --ff-only origin feature/project-colors
git status
git log -6 --oneline --decorate
```

Forventet:

- branch er synkronisert med `origin/feature/project-colors`
- working tree er clean
- de siste statusdokumentene finnes på lokal branch

Kontroller deretter med GitHub-connectoren:

1. PR #29 har base `main` og head `feature/project-colors`
2. PR-en er åpen og ikke draft
3. head-SHA samsvarer med branch-head
4. changed files og samlet diff er som forventet
5. mergebarhet er ferdigberegnet
6. reviews og uløste tråder er kontrollert
7. CI/statuskontroller er kontrollert
8. merge bare etter brukerens eksplisitte ord `godkjent`
9. oppdater lokal `main` etter merge

---
