# Arbeidsplan

Dette dokumentet er den autoritative rekkefølgen for Website-editoren.

Programmet er et lokalt énbrukerverktøy. Stabilitet, enkelhet og forutsigbar drift prioriteres foran kontoer, flerbrukerfunksjoner og skyarkitektur.

## Nåstatus

- fullført gjennom fase 18 – arbeidsportalnavigasjon og navigator
- separat header-descender-fiks er merget i PR #59
- neste produksjonsfase er fase 19 – sider, seksjons-ID-er og navigasjonsmodell (#60)
- den tidligere fase-25-PR-en #52 er parkert og skal ikke videreutvikles eller merges
- ny implementering starter alltid fra oppdatert `main` på en egen branch

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

Aktiv planleggingssak: #60.

Låste hovedmål:

- kontrollert sideoppretting, navngiving, slug, sletting og rekkefølge
- minst én side i prosjektet til enhver tid
- stabile offentlige seksjons-/anker-ID-er separat fra interne element-ID-er
- én serialiserbar, typet navigasjonsmodell med stabile side- og seksjonsmål
- ingen dangling navigasjonsreferanser etter relevante slettinger
- eksplisitt schema/migrering dersom serialisert prosjektform endres
- faktisk Header-meny og menyrendering utsettes til fase 20

Detaljert omfang og akseptansekriterier ligger i GitHub-sak #60.

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

- #36 editor-only elementgrense
- #37 elementnotat og høyrepanelendringer
- #38 like mellomrom og fordelingsguider
- #57 rammetykkelse for tekstelementer

## Dokumentregel

Detaljert faseomfang, auditfunn, testplan og handover lagres i GitHub-saken og PR-en. Permanente status-, audit-, readiness- eller chat-handoverdokumenter opprettes ikke.
