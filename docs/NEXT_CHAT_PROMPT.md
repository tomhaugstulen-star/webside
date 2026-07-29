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
3. `docs/EDITOR_PLANNING.md`
4. `docs/PROJECT_RULES.md`
5. `README.md`
6. `docs/ELEMENT_MODEL.md`
7. `docs/RIGHT_PROPERTIES_PANEL.md`
8. `docs/CODE_AUDIT.md`
9. relevante øvrige fasedokumenter

## Gjeldende status

```text
aktiv leveranse: fase 11A – bildeimport, ramme og utsnitt
branch: feature/image-import-and-placement
GitHub-sak: #25
PR: #26 – åpen, ikke draft
base main: 7e4c71fed4a26dfb829cc19ae81df95215c42a64
prosjektskjema: versjon 6
implementering: ferdig
manuell PC- og Telefon-test: godkjent
framtidsrettet sluttaudit: ferdig
siste produksjonskontroll: bestått
arkitekturrapporter etter sluttaudit: må regenereres
merge: ikke godkjent eller utført
```

Faktisk feature- og `main`-HEAD skal alltid kontrolleres fra GitHub/Git. Ikke bruk et hardkodet commitnummer som permanent forventet topp-commit.

Historiske kontrollpunkter:

```text
main-base for fase 11A: 7e4c71f
arkitekturrapporter før sluttaudit: 94ed2fb
første fullførte dokumentstatus: 9c92fb1
siste verifiserte produksjonscommit ved kontrollen: 7378e24
```

Dokumentcommits ligger etter `7378e24`. Faktisk feature-head må leses fra Git.

## Siste verifiserte kvalitetskontroll

Brukerens lokale terminaloutput bekreftet etter den endelige kodeauditen:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 91 moduler, 237 avhengigheter, ingen brudd
Vite: 100 moduler transformert
CSS: 30.95 kB, gzip 6.04 kB
JavaScript: 258.38 kB, gzip 78.09 kB
produksjonsbuild: bestått på 185 ms
```

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
- transient ressursbuffer for `File` og Object URL
- stabil bilde-`assetId` og serialiserbar metadata
- alt-tekst, `Hele bildet` og `Juster utsnitt`
- zoom, reset, pekerdrag og tastaturstyrt motivflytting
- åtte resizegrep innenfor bilderammen
- Seksjon rendret bak Bilde, Tekst og Knapp
- crop-resize med stasjonært motiv og fast motsatt kant
- kontrollert fallback ved manglende ressurs

## Autoritative bildegrenser

```text
maks filstørrelse: 10 MB
maks dekodet pikselmengde: 40 megapiksler
maks bredde eller høyde: 16 384 px
crop-grunnramme for skjemaversjon 6: 240 × 160 px
zoom: 1..3
offsetX og offsetY: -1..1
```

Crop-grunnrammen er en skjemainvariant. Senere endring av standardstørrelsen for nye bilder skal ikke endre versjon-6-transformer. En annen grunnmodell krever ny skjemaversjon og migrering.

## Bildeinteraksjon

```text
Hele bildet     viser hele motivet proporsjonalt og sentrert
Juster utsnitt  fyller rammen uten tomrom
vanlig dra      flytter motivet
Shift + dra     flytter hele rammen
Alt + piltast   flytter motivet 4 px
Shift+Alt+pil   flytter motivet 20 px
piltast         flytter elementet
Ctrl/Cmd + pil  endrer størrelse fra nedre høyre hjørne
```

Ved crop-resize:

- motivets størrelse og absolutte plassering beholdes
- bare den aktive rammekanten flyttes
- motsatt kant står fast
- ny normalisert offset beregnes mot ny ramme
- ramme og transform lagres atomisk

## Sluttauditens viktigste rettelser

- crop-invarianter håndheves i modell og reducer
- `Alt + piltast` fungerer etter bruk av zoomkontrollen
- nettleserhistorikk stoppes for `Alt + venstre/høyre`
- Seksjon rendres deterministisk bak forgrunnsinnhold
- bilderammen har ingen motstridende regel i `canvas.css`
- grep og treffområder ligger innenfor bilderammen
- import avsluttes sikkert ved feil og panel-unmount
- metadata kontrolleres mot faktisk fil
- dekodet bildestørrelse er begrenset
- crop-grunnskala er låst til skjemaversjon 6
- alle berørte kildefiler er under 250 linjer

## Obligatoriske grenser for senere arbeid

### Prosjektimport

Valider hele prosjektobjektet og skjemaversjonen før `replace-project`. Ikke stol på TypeScript-typen for eksterne data.

### Prosjektbytte

Avstem eller tøm den transiente bilderessursbufferen og tilbakekall foreldede Object URL-er.

### Angre/gjør om

Historikk inneholder bare serialiserbar prosjektstate. `File`, Object URL og aktive interaksjoner skal ikke inngå.

### Mobiloverstyringer

Bruk viewport-spesifikke geometrihandlinger. Ikke skriv mobilendringer inn i desktopfeltet.

### Autolagring

Lagre gyldige prosjektmutasjoner, ikke transient editor- eller ressursstate.

## Første oppgave i neste chat

Fase 11A skal ikke implementeres på nytt. Ikke start fase 12.

Trekk siste feature-branch og regenerer arkitekturrapportene etter sluttauditen:

```powershell
cd C:\Users\tomha\Desktop\website
git pull --ff-only origin feature/image-import-and-placement
git status
git log -10 --oneline --decorate
npm run architecture:json
npm run architecture:diagram
git status --short
git diff --check
git diff --stat
```

Forventet:

- working tree var clean før rapportgenerering
- bare `architecture.json` og `docs/dependency-graph.mmd` endres
- `git diff --check` har ingen reelle feil

Etter lokal rapportkontroll:

1. commit og push bare de to rapportene
2. trekk og kontroller alle dokumentcommits lokalt
3. kontroller samlet PR #26 mot `main`
4. kontroller PR-head, mergebarhet, changed files, review-tråder, reviews og CI
5. oppdater PR-body med siste kontroll og rapportcommit
6. presenter PR #26 for eksplisitt brukergodkjenning
7. ikke merge før brukeren skriver `godkjent`

Etter eventuell godkjent merge:

```powershell
git switch main
git pull --ff-only origin main
git status
git log -6 --oneline --decorate
```

Velg først deretter neste produksjonsfase sammen med brukeren.

---
