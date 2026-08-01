# Arbeidsplan

Dette dokumentet er den autoritative arbeidsrekkefølgen for Website-editoren. Faktisk GitHub-state og verifisert terminaloutput vinner alltid over foreldet tekst.

## Fast arbeidsflyt

1. Kontroller faktisk `main`, branch, PR-head, mergebase og clean tree.
2. Lås produkt-, modell- og testomfang før produksjonskode.
3. Implementer bare avtalt omfang på egen branch.
4. Hold ordinære produksjonsfiler under 250 linjer.
5. Gjennomfør framtidsrettet kodeaudit.
6. Kjør full automatisk kontroll etter siste produksjonsendring.
7. Test relevant funksjonalitet manuelt på PC og Telefon.
8. Regenerer arkitekturrapporter ved modul- eller importendringer.
9. Oppdater alle autoritative dokumenter i samme leveranse.
10. Kontroller diff, PR, reviews, tråder og CI på nøyaktig siste head.
11. Merge bare etter eksplisitt brukergodkjenning.

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
main: 161125d00a4a7d08b4c376d82933dd1176a0cc44
siste fullførte produksjonsfase: 17 – tekstboksbakgrunn
prosjektskjema på main: 10
aktiv produksjonsfase: 25 – lokal prosjektlagring, autolagring og gjenoppretting
aktiv branch: feature/phase-25-local-persistence
aktiv draft-PR: #52
aktiv issue: #51
PR-head ved siste kontroll: 6ff4e32a872fee5342868218e8e45bc87a2fd442
siste Quality på denne headen: action_required; ingen utført jobb
manuell PC-/Telefon-regresjon: ikke dokumentert som bestått
mergeklar: nei
neste fase etter ferdig fase 25: 18
```

## Eksplisitt roadmapbeslutning

Issue #51 prioriterer den eksisterende fase-25-leveransen foran fase 18 fordi tap av prosjekt og importerte medier er prosjektets høyeste jobbrelaterte risiko.

Denne beslutningen endrer bare utførelsesrekkefølgen:

```text
17 fullført
25 aktiv
18–24 følger deretter i opprinnelig rekkefølge
26–29 følger som tidligere planlagt
```

Fasenumrene renummereres ikke. Fase 18 og fase 26 skal ikke blandes inn i fase 25.

## Låst fase 25 – lokal prosjektlagring, autolagring og gjenoppretting

### Formål

Gjøre ett lokalt prosjekt robust mot nettleseroppfriskning, lukking og krasj uten å innføre prosjektarkiv, importformat eller skyfunksjoner.

### Omfang

- IndexedDB for gjeldende `EditorProject`
- IndexedDB for importerte bilde- og logofiler
- separat versjonert storage-envelope
- runtime-validering av envelope, prosjekt, elementer og assetmetadata
- startup-port før editoren blir interaktiv
- debounced autolagring etter reelle prosjektmutasjoner
- serialisert skrivekø og korrekt status: ikke lagret, lagrer, lagret og feil
- kontrollert orphan-opprydding etter vellykket prosjektlagring
- eksplisitt og bekreftet lokal reset
- gjenopprettingsskjerm som bevarer ugyldige data frem til reset
- deterministic adaptertester og kritisk Chromium-regresjon
- oppdaterte arkitekturrapporter og autoritative dokumenter

### Ikke del av fasen

- navigator eller `Ctrl + K`
- sideadministrasjon og navigasjonsmodell
- Header-meny eller Hero
- responsive mobiloverstyringer
- angre/gjør om
- prosjektfil, backup, eksport, import eller migreringsmotor
- fullskjermsforhåndsvisning
- OpenAI
- hosting, domene eller offentlig publisering

### Blokkerende akseptansekriterier

- gyldig prosjekt overlever refresh
- importert bilde og Header-logo overlever refresh
- startup kan ikke overskrive et gyldig lagret prosjekt med standardprosjektet
- ugyldig eller ustøttet data når aldri reducer-state
- reset fungerer også ved inkompatibel eller strukturelt mangelfull IndexedDB
- lagringsfeil er synlig og rapporteres aldri som `Lagret`
- Object URL-er er transiente og tilbakekalles korrekt
- IndexedDB-adapterens read/write/clear-feilveier er deterministisk testet
- desktop- og eventuelle mobile responsive verdier valideres likt
- produksjonsfiler følger filpolicy
- `npm run verify` og GitHub `Quality` består på samme endelige head
- manuell PC- og Telefon-regresjon består
- ingen merge uten eksplisitt `godkjent`

## Låst roadmap

```text
fase 14  Korrigeringslinjer og snapping – fullført
fase 15  Duse portalfarger og tydelig visuell struktur – fullført
fase 16  Automatisert testgrunnlag – fullført
fase 17  Tekstboksbakgrunn – fullført
fase 25  Lokal prosjektlagring, autolagring og gjenoppretting – aktiv, prioritert foran fase 18
fase 18  Arbeidsportalnavigasjon, navigator og hurtigsøk
fase 19  Sider, seksjons-ID-er og navigasjonsmodell
fase 20  Nettstedets Header og menynavigasjon
fase 21  Hero
fase 22  Header-redigering og nettstedstruktur
fase 23  Responsive mobiloverstyringer
fase 24  Angre og gjør om
fase 26  Sikkerhetskopi, prosjektformat, import og migrering
fase 27  Lokal forhåndsvisning
fase 28  Malbibliotek og gjenbrukbare seksjoner
fase 29  OpenAI-integrasjon
```

Endring av denne rekkefølgen krever en eksplisitt issue eller beslutning og oppdatering av dette dokumentet før kodearbeidet fortsetter.

## Fullført fase 17

Fase 17 ble merget via PR #50 på mergecommit `161125d00a4a7d08b4c376d82933dd1176a0cc44`.

Levert:

- `TextAppearance.backgroundColor`
- standard `#FFFFFF`
- prosjektskjema 10
- validerte reducergrenser
- `Bakgrunn` før `Tekstfarge`
- rendering fra prosjektdata
- modell-, reducer- og Chromium-test
- manuell PC-/Telefon-regresjon og eksplisitt mergegodkjenning

## Separat backlog

Disse sakene skal ikke blandes inn i fase 25:

- #36 editor-only elementgrense
- #37 elementnotat og høyrepanelendringer
- #38 like mellomrom og fordelingsguider

## Dokumentregel

Autoritative statusdokumenter skal vise samme main-commit, aktive fase, PR, issue, skjemaversjon og kvalitetsstatus. En ny chat skal aldri instrueres til å fortsette en lukket eller merget PR.
