# Arbeidsplan

Dette dokumentet er den autoritative arbeidsrekkefølgen for Website-editoren. Faktisk GitHub-state og verifisert kontrolloutput vinner over foreldet tekst.

## Produktretning

Programmet er et lokalt énbrukerverktøy. Prioritetene er:

1. stabil redigering uten unødvendige stopp
2. tydelig og forutsigbar arbeidsflyt
3. lokal kontroll over prosjektdata
4. enkel arkitektur uten flerbruker-, konto- eller skykompleksitet

## Fast arbeidsflyt

1. Kontroller faktisk `main`, branch, PR-head og mergebase.
2. Lås omfanget for én fase.
3. Implementer bare denne fasen på egen branch.
4. Hold ordinære produksjonsfiler under 250 linjer.
5. Kjør relevant kodeaudit og full automatisk kontroll.
6. Test påvirket funksjonalitet manuelt i PC- og Telefon-visning.
7. Regenerer arkitekturrapporter ved modul- eller importendringer.
8. Oppdater autoritative dokumenter i samme leveranse.
9. Kontroller diff, PR, reviews, tråder og CI på siste head.
10. Merge bare etter eksplisitt godkjenning.

Standardkontroll:

```powershell
npm run verify
npm run architecture:json
npm run architecture:diagram
git diff --check
git status --short
git diff --stat
```

## Faktisk status 1. august 2026

```text
main: e48aa0613176a2209c6277b2c3b0ce65918324fc
siste fullførte produksjonsfase: 17 – tekstboksbakgrunn
prosjektskjema på main: 10
neste produksjonsfase: 18 – arbeidsportalnavigasjon, navigator og hurtigsøk
aktiv implementeringsbranch for fase 18: ikke opprettet ennå
parkert draft-PR: #52 – fase 25 lokal prosjektlagring, autolagring og gjenoppretting
```

PR #52 er ikke aktiv leveranse og skal ikke merges eller videreutvikles før fase 25 nås i den låste rekkefølgen.

## Låst roadmap

```text
fase 18  Arbeidsportalnavigasjon, navigator og hurtigsøk
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
fase 29  OpenAI-integrasjon
```

Denne rekkefølgen endres bare etter en ny, eksplisitt beslutning fra brukeren og en dokumentoppdatering før kodearbeidet starter.

## Fase 18 – arbeidsportalnavigasjon, navigator og hurtigsøk

### Formål

Gjøre editorens innhold og verktøy raske å finne uten å opprette parallelle kopier av prosjektstate.

### Omfang

- portaloversikt for aktivt prosjekt
- hierarkisk navigator for gjeldende sider og elementer
- finne og markere element fra navigatoren
- vise elementtype, navn, synlighet og låsestatus
- filtrering etter elementtype og status
- globalt hurtigsøk, anbefalt `Ctrl + K`
- tastaturnavigasjon, Escape og korrekt fokusretur
- synkronisert valg mellom navigator og lerret

### Ikke del av fasen

- full sideadministrasjon fra fase 19
- nettstedets Header-meny fra fase 20
- Hero
- mobiloverstyringer
- angre/gjør om
- lokal lagring eller autolagring
- OpenAI

### Akseptansekriterier

- brukeren finner valgt side eller element uten å lete på lerretet
- `Ctrl + K` åpner og lukker kontrollert
- Escape og fokusretur fungerer
- portalstatus avledes fra eksisterende state
- elementvalg i navigator og lerret er synkronisert
- `npm run verify` og manuell PC-/Telefon-regresjon består

## Fase 25 – lokal prosjektlagring, autolagring og gjenoppretting

Fasen er planlagt, men ikke aktiv.

Krav som allerede er låst:

- automatisk, debounced lagring etter reelle prosjektendringer
- lokal IndexedDB-lagring av prosjekt og importerte bilde-/logofiler
- gjenoppretting før normal redigering starter
- tydelig status for lagrer, lagret og feil
- feil skal ikke feilaktig rapporteres som `Lagret`
- en lagringsfeil skal være synlig uten å stoppe hele arbeidsøkten når det er trygt å fortsette i midlertidig modus
- robust reset også ved inkompatibel eller strukturelt mangelfull database
- ingen kontoer, flerbrukerfunksjoner eller skykrav

Detaljert implementering gjenopptas først etter fase 24.

## Fullført fase 17

Fase 17 ble merget via PR #50 på mergecommit `161125d00a4a7d08b4c376d82933dd1176a0cc44`.

Levert:

- `TextAppearance.backgroundColor`
- standard `#FFFFFF`
- prosjektskjema 10
- validerte reducergrenser
- rendering fra prosjektdata
- modell-, reducer- og Chromium-test
- manuell PC-/Telefon-regresjon

## Separat backlog

Disse sakene blandes ikke inn i fase 18 uten eksplisitt beslutning:

- #36 editor-only elementgrense
- #37 elementnotat og høyrepanelendringer
- #38 like mellomrom og fordelingsguider

## Dokumentregel

Alle autoritative statusdokumenter skal vise samme main-commit, aktive fase, roadmap og kvalitetsstatus. En ny chat skal aldri instrueres til å fortsette en parkert, lukket eller merget leveranse.