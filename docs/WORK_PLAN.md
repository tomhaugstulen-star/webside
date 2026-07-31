# Arbeidsplan

Dette dokumentet er den autoritative, låste arbeidsrekkefølgen for Website-editoren.

Planen beskriver:

- gjeldende leveranse
- varige produktbeslutninger
- rekkefølgen videre
- avhengigheter mellom fasene
- akseptansekriterier
- eksplisitt utsatt eller fjernet arbeid

Ingen senere fase startes eller blandes inn i en aktiv branch uten ny eksplisitt beslutning.

## Fast arbeidsflyt

1. Kontroller branch, `origin/main` og clean tree.
2. Lås produkt- og modellomfang før produksjonskode.
3. Implementer bare avtalt omfang på egen branch.
4. Hold kildefiler under aktiv terskel på 250 linjer.
5. Gjennomfør framtidsrettet kodeaudit.
6. Kjør full automatisk kontroll etter siste produksjonsendring.
7. Test relevant funksjonalitet manuelt på PC og Telefon.
8. Regenerer arkitekturrapporter ved struktur- eller avhengighetsendringer.
9. Oppdater autoritativ dokumentasjon og fjern foreldet parallell dokumentasjon.
10. Kontroller diff, branch-synk, PR, reviews, tråder og CI.
11. Merge bare etter eksplisitt brukergodkjenning.

Standardkontroll etter siste kode- eller dokumentendring:

```powershell
npm run verify
npm run architecture:json
npm run architecture:diagram
git diff --check
git status --short
git diff --stat
```

`npm run verify` er den samlede sikkerhetskontrollen. Den kjører hele `npm run check` og deretter den kritiske Chromium-regresjonen.

## Låst produktretning

### Lokal arbeidsportal

Website-editoren skal være en komplett lokal arbeidsportal på brukerens egen PC.

Den skal brukes til å:

- opprette og redigere nettsideprosjekter
- administrere sider, seksjoner, Header, Hero og øvrige elementer
- finne innhold raskt gjennom portalnavigasjon og søk
- lagre prosjekter lokalt
- lage sikkerhetskopier og åpne prosjektfiler
- forhåndsvise resultatet lokalt
- bruke OpenAI som kontrollert meddesigner i siste hovedfase

### Offentlig publisering er fjernet

Følgende skal ikke bygges:

- hosting
- domeneoppsett
- opplasting til offentlig server
- produksjonsdeployment
- publiseringshistorikk
- offentlig publiseringsknapp

Følgende beholdes:

- lokal fullskjermsforhåndsvisning
- PC- og Telefon-forhåndsvisning
- lokal prosjektlagring
- autolagring
- sikkerhetskopi
- prosjektimport
- gjenoppretting etter feil eller krasj

En eventuell eksisterende eller planlagt `Publiser`-handling skal erstattes med lokal `Forhåndsvis` eller tilsvarende.

### To separate navigasjonssystemer

Prosjektet skal skille mellom:

1. **Arbeidsportalens navigasjon**
   - brukes for å finne prosjekter, sider, elementer, verktøy og innstillinger
   - eies av editorens UI
   - lagres ikke som nettsideinnhold

2. **Nettsidens navigasjon**
   - vises i nettstedets Header
   - peker til sider, seksjoner eller eksterne adresser
   - er varig prosjektdata

Disse skal ikke blandes i samme modell eller UI-ansvar.

### Visuell retning for portalen

Arbeidsportalens områder skal skilles med dempede, harmoniske farger.

Målet er ikke sterke farger, men tydelig visuell struktur mellom:

- toppmeny
- venstremeny
- åpent venstrepanel
- høyrepanel
- arbeidsområde
- nettsidelerret
- aktive, valgte, deaktiverte og farlige handlinger

Fargene skal defineres gjennom semantiske designtokens, ikke spres som tilfeldige enkeltverdier i CSS.

### OpenAI-retning

OpenAI skal integreres etter at editorens modell, historikk, lagring, navigasjon, Header og Hero er stabile.

OpenAI skal kunne:

- skrive og omskrive tekst
- foreslå farger og paletter som inspirasjon
- generere bilder til valgte bildefelt
- generere Hero-innhold og Hero-bilder
- generere seksjoner og bokser
- foreslå sider og navigasjon
- lage komplette sideutkast
- kontrollere helhet og konsistens

AI er en meddesigner, ikke en skjult autopilot.

Alle AI-endringer følger:

```text
Forslag
  -> validering
  -> forhåndsvisning
  -> eksplisitt godkjenning
  -> typede actions/reducere
  -> én kontrollerbar historikkhandling
```

AI skal aldri:

- overskrive prosjektdata uten godkjenning
- slette innhold skjult
- skrive direkte til state uten modellvalidering
- legge API-nøkkel i browser- eller Vite-kode
- sette inn ukontrollert React-, CSS- eller prosjektkode

OpenAI-integrasjonen skal bruke en lokal serverprosess eller tilsvarende sikker server-side grense på samme PC. API-nøkkel lastes fra miljøvariabel og eksponeres ikke i klienten.

## Leveransestatus

```text
siste fullførte produksjonsfase på main: 16 – automatisert testgrunnlag
gjeldende main: ecb443d384a1e0999ef14767419e1bea93c4a12c
aktiv produksjonsfase: 17 – tekstboksbakgrunn
aktiv branch: feature/phase-17-text-background
aktiv draft-PR: #50
aktiv GitHub-sak: #35
prosjektskjema på main: versjon 9
prosjektskjema på fase-17-branchen: versjon 10
implementert: varig TextAppearance.backgroundColor
standard tekstbakgrunn: #FFFFFF
enhetstester: 20 bestått på verifisert kode-head
nettleserregresjon: 1 bestått på verifisert kode-head
Quality på kode-head ea2a446: success
samlet kontrollkommando: npm run verify
status: dokumentasjon og arkitekturrapporter er synkronisert; siste Quality og manuell PC/Telefon-test gjenstår
neste roadmapfase etter ferdig fase 17: 18 – arbeidsportalnavigasjon, navigator og hurtigsøk
jobbberedskap: lokal lagring/autolagring er fortsatt et eksplisitt risikogap
```

Fase 14 leverte:

- korrigeringslinjer og 6 px snapping ved pekerflytting
- elementankere på venstre/midt/høyre og topp/midt/bunn
- horisontal og vertikal lerretsmidt
- uavhengig valg per akse
- låste synlige elementer som mål
- skjulte elementer og aktivt element ekskludert
- Header som fast, fullbredde snapmål
- transient preview, snapmål og guider
- kontrollert auto-scroll, clamping, cancel og tapt pointer capture
- Header-fontstørrelse 12–96 px
- Header fast ved `x = 0, y = 0` i alle identifiserte kodeveier

Sluttkontroll på branch-head `28da295`:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 118 moduler, 341 avhengigheter, ingen brudd
Vite: 127 moduler transformert
CSS: 36.85 kB, gzip 6.87 kB
JavaScript: 280.63 kB, gzip 83.17 kB
produksjonsbuild: bestått på 216 ms
produksjonsfiler på eller over 250 linjer: 0
```

Hele den relevante manuelle regresjonen ble godkjent i PC- og Telefon-visning. PR #39 ble merget etter eksplisitt brukergodkjenning, og brukerens lokale `main` ble synkronisert og bekreftet clean på mergecommit `0122605`.

Fase 15 er fullført og merget til `main` via PR #43. Faktisk mergecommit er `1ae0bebabf3eb02104bafa80a029b40d5c06de12`.

Fase 16 er fullført og merget via PR #46 på mergecommit `b8212e84eef496286a83fbab3e05074eb591ddc5`. Leveransen etablerte testverktøy, 17 enhetstester, én kritisk Chromium-regresjon og Quality-workflow i GitHub Actions.

Automatisk produksjonsfilkontroll ble deretter merget via PR #48 på mergecommit `ba8334dab7c423f16358ce423e1f77309884daeb`. Dokumentasjonssynken etter fase 16 ble merget via PR #49 på `ecb443d384a1e0999ef14767419e1bea93c4a12c`.

Fase 17 er aktiv på `feature/phase-17-text-background` i draft-PR #50. Omfanget er låst til issue #35: varig og validert tekstboksbakgrunn. Issue #36, #37, #38 og senere roadmaparbeid er eksplisitt utelatt. `npm run verify` er nå den samlede kontrollen lokalt og i GitHub Quality.

## Låst roadmap

```text
fase 14  Korrigeringslinjer og snapping – fullført
fase 15  Duse portalfarger og tydelig visuell struktur – fullført
fase 16  Automatisert testgrunnlag – fullført
fase 17  Tekstboksbakgrunn – pågår
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

Rekkefølgen er låst fordi hver fase bygger nødvendig grunnlag for senere faser. Endring av rekkefølgen krever en eksplisitt roadmapbeslutning og dokumentoppdatering.

---

## Fase 15 – duse portalfarger og tydelig visuell struktur

### Status

Fullført og merget til `main` via PR #43 på mergecommit `1ae0bebabf3eb02104bafa80a029b40d5c06de12`. Produksjonskoden ble visuelt godkjent, framtidsrettet auditert og automatisk verifisert på `7ea58a5`.

### Formål

Skille portalområdene visuelt uten å gjøre grensesnittet sterkt eller urolig.

### Omfang

- semantiske tokens for portalbakgrunn, toppmeny, venstremeny, venstrepanel, høyrepanel og arbeidsområde
- dempede, beslektede fargetoner
- tydelig aktiv og valgt tilstand
- tydelig hover, fokus, disabled, advarsel og sletting
- bevare lesbar kontrast
- bevare `prefers-reduced-motion`
- ingen endring av nettsideprosjektets farger

### Levert palett

```text
portal/header        #F6EFE6
panel                #FAF6F1
aktiv bakgrunn       #FFE8DA
kant                 #E6DED2
aktiv oransje        #E25A1C
mørk tekst           #1F1F1F
sekundær tekst       #6B6F76
blå ikon             #2F6DB6
grønn ikon           #2E7D32
lilla ikon           #7E3FA8
oransje ikon         #E07A24
```

Den røde topplinjen i brukerens referanseskjermbilde tilhører nettleserens dev-miljø og er ikke del av editorens design.

### Framtidsrettet auditrettelse

Første implementasjon koblet ikonfargene til `nth-child`. Det ville gjort fargene avhengige av DOM-rekkefølge og kunne gitt feil farge når menyen eller elementbiblioteket senere utvides.

Dette er erstattet med eksplisitte semantiske variantklasser:

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

TSX-endringene påvirker bare CSS-klassenavn. State, eventflyt, prosjektmodell, validering og elementoppretting er uendret.

### Verifisert sluttkontroll på `7ea58a5`

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
produksjonsfiler på eller over 250 linjer: 0
```

Arkitekturrapportene er ikke regenerert fordi ingen import eller modulgrense er endret.

### Ikke del av fasen

- tekstboksbakgrunn i prosjektmodellen
- globale nettsidemaler
- mørk modus
- brukerdefinerte portaltemaer
- editor-only elementgrense
- elementnotat og høyrepanelmodell
- like mellomrom og fordelingsguider
- arbeidsportalnavigator eller `Ctrl + K`
- sider eller navigasjonsmodell
- Header-meny eller Hero
- responsive mobiloverstyringer
- angre/gjør om
- lokal lagring, prosjektimport eller fullskjermsforhåndsvisning
- OpenAI
- offentlig publisering

### Akseptansekriterier

- portal, paneler og lerret kan skilles umiddelbart
- alle interaktive tilstander er tydelige
- ingen prosjektdata eller skjemaversjon endres
- CSS bruker sentrale tokens fremfor gjentatte tilfeldige farger
- PC-visning fungerer på eksisterende minimumsbredde
- ikonfarger er bundet til semantiske varianter, ikke DOM-rekkefølge
- `npm run check` og visuell regresjon er bestått

---

## Fase 16 – automatisert testgrunnlag

### Status

Fullført og merget til `main` via PR #46 på mergecommit `b8212e84eef496286a83fbab3e05074eb591ddc5`. Issue #45 er lukket som fullført.

### Formål

Redusere regresjonsrisiko før Hero, sider, navigasjon, lagring og AI gjør modellen større.

### Levert

- Playwright-basert testverktøy for rene TypeScript-moduler og Chromium
- 17 enhetstester for modellvalidatorer, stabile ID-grenser, reducerhandlinger, ugyldige og uendrede handlinger, låsing, sletting, layout, clamping og snapping
- én kritisk nettleserflyt som oppretter et tekstelement, markerer det og åpner Egenskaper
- separat test-typecheck
- GitHub Actions-workflowen `Quality`
- Windows-sikker E2E-runner som rydder Vite-prosesstreet og returnerer korrekt exitkode
- stabil knapp-ID-validering skilt fra SVG-presentasjonskatalogen
- oppdaterte dependency-rapporter og låsefil

### Verifisering

```text
npm run check: bestått
ESLint: bestått
TypeScript og test-typecheck: bestått
Dependency Cruiser: 118 moduler, 340 avhengigheter, 0 brudd
enhetstester: 17 bestått
Chromium-regresjon: 1 bestått, exitkode 0
Vite-produksjonsbuild: 127 moduler transformert
git diff --check: bestått
```

### Omfang

- testverktøy for TypeScript-moduler
- tester for modellvalidatorer
- tester for reducerhandlinger
- tester for snapping, layout og clamping
- tester for ugyldige og uendrede handlinger
- tester for ressurs- og ID-grenser der det er praktisk
- et lite, kontrollert sett nettleserbaserte regresjonstester
- én tydelig testkommando i prosjektets kvalitetskontroll

### Ikke del av fasen

- full visuell pixeltest av hele editoren
- testing av framtidige funksjoner som ikke finnes
- store mock-rammeverk uten reelt behov
- funksjonsendring i prosjektmodellen eller editorflyten
- arbeid fra fase 17 eller senere

### Akseptansekriterier

- testkommando kan kjøres lokalt og i CI – oppfylt
- eksisterende rene modell- og layoutfunksjoner er dekket – oppfylt
- reducerens valideringsgrenser er dekket – oppfylt
- minst én kritisk editorflyt testes i nettleser – oppfylt
- `npm run check` inkluderer dokumentert testkontroll – oppfylt

---

## Fase 17 – tekstboksbakgrunn

### Status

Pågår i `feature/phase-17-text-background` og draft-PR #50. Kodekjernen, dokumentasjon og arkitekturrapporter er implementert og synkronisert. Leveransen forblir draft til siste GitHub Quality på endelig head og manuell PC-/Telefon-regresjon er bestått.

### Formål

Lukke kjente, avgrensede modellmangler før større elementtyper legges til.

### Omfang

- implementere issue #35
- varig og validert tekstboksbakgrunn
- standardverdi og skjemakonsekvens
- `Bakgrunn` og `Tekstfarge` under hvert tekstelement i `Farger`
- reducer- og hookstøtte
- rendering fra prosjektdata i stedet for hardkodet CSS
- korrekt låseoppførsel
- holde issue #36, #37, #38 og senere modellarbeid utenfor denne leveransen

### Akseptansekriterier

- bakgrunnsfarge lagres og gjenbrukes stabilt
- låst tekst kan inspiseres, men ikke endres
- ugyldig farge avvises ved reducergrensen
- dokumentasjon og skjemahistorikk er oppdatert
- ingen urelaterte funksjoner blandes inn

---

## Fase 18 – arbeidsportalnavigasjon, navigator og hurtigsøk

### Formål

Gjøre editoren til en effektiv arbeidsportal der prosjektinnhold og verktøy finnes raskt.

### Portalstruktur

Anbefalt venstremeny:

```text
Oversikt
Sider og navigasjon
Farger
Logo og Header
Hero og seksjoner
Elementer
Filer og bilder
Innstillinger
AI-assistent – skjult til fase 29
```

Anbefalt toppmeny:

```text
Aktivt prosjekt / aktiv side
Hurtigsøk
PC / Telefon
Angre / Gjør om – deaktivert til fase 24
Lagringsstatus – deaktivert til fase 25
Forhåndsvisning – deaktivert til fase 27
Hovedmeny
```

### Omfang

- portaloversikt for aktivt prosjekt
- hierarkisk side-/elementnavigator basert på gjeldende modell
- finn og marker element på lerret
- vis elementtype, navn, synlighet og låsestatus
- filtrer etter elementtype og status
- globalt kommandofelt, anbefalt `Ctrl + K`
- kommandoer for å åpne paneler, bytte viewport, velge side og finne element
- tydelig fokusstyring og tastaturnavigasjon
- portalnavigasjon eier ikke prosjektinnhold

### Ikke del av fasen

- full sideadministrasjon før fase 19
- angre/gjør om
- lagringsmotor
- AI-kommandoer
- avansert flermerking eller gruppering

### Akseptansekriterier

- brukeren finner valgt side eller element uten å lete på lerretet
- `Ctrl + K` åpner og lukker kontrollert
- Escape og fokusretur fungerer
- portalstatus er avledet fra state og dupliseres ikke
- elementvalg i navigator og lerret er synkronisert

---

## Fase 19 – sider, seksjons-ID-er og navigasjonsmodell

### Formål

Bygge varig nettstedstruktur før Header-meny, Hero-responsivitet, lagring og AI.

### Sider

- opprett side
- endre sidenavn
- endre og validere slug
- dupliser side
- endre rekkefølge
- velg startside
- sikker sletting
- minst én side må alltid finnes
- stabile side-ID-er brukes som lenkemål

### Seksjoner

- stabil seksjons-ID
- visningsnavn for navigator og menybygger
- valgfritt navigasjonsanker
- kontrollert unik ankerverdi per side
- duplisering og rekkefølge der modellen tillater det

### Lenketype

Navigasjon skal kunne peke til:

- intern side-ID
- seksjons-ID på intern side
- ekstern URL

Lagrede lenker skal ikke være avhengige av at siden eller seksjonen beholder samme visningsnavn.

### Akseptansekriterier

- side- og seksjonsmål overlever navnendring
- ugyldige eller dupliserte slugs avvises
- sletting håndterer referanser kontrollert
- aktiv side er alltid gyldig
- eksisterende én-sides prosjekt kan migreres eller valideres

---

## Fase 20 – nettstedets Header og menynavigasjon

### Formål

Bygge nettstedets faktiske toppnavigasjon, separat fra arbeidsportalens navigasjon.

### Header-moduser

1. `automatisk`
   - horisontal meny på bredt lerret
   - kompakt rullegardin/hamburgermeny på smalt lerret

2. `horisontal`
   - menypunkter vises direkte

3. `kompakt`
   - menyknapp brukes i alle visninger

### Menybygger

- legg til og fjern menypunkt
- endre menynavn
- endre rekkefølge
- skjul eller vis menypunkt
- lenke til side
- lenke til seksjon
- ekstern lenke
- åpne ekstern lenke i ny fane
- ett nivå med undermeny
- valgfri handlingsknapp, for eksempel `Kom i gang`
- aktiv side eller seksjon markeres
- valgfri sticky Header
- tilgjengelig tastaturnavigasjon
- Escape og fokusretur i kompakt meny

### Modellgrense

- menyen lagrer stabile mål-ID-er
- Headerens visuelle og navigasjonsdata er serialiserbare
- portalmenyen inngår ikke i Header-modellen
- kompakt menytilstand er transient

### Akseptansekriterier

- alle tre modusene fungerer
- automatisk modus bytter kontrollert mellom horisontal og kompakt
- intern navigasjon overlever navnendring
- aktivt menypunkt vises tydelig
- menyen fungerer med tastatur i PC og Telefon
- ingen offentlig routing eller hosting kreves

---

## Fase 21 – Hero

### Formål

Innføre Hero som en egen sammensatt elementtype og hoveddel av forsiden eller andre sider.

### Første versjon

- egen `HeroEditorElement`
- full bredde som standard
- plasseres under Header som standard
- maksimalt én hoved-Hero per side uten ny beslutning
- bakgrunnsbilde eller bakgrunnsfarge
- kontrollert bildeutsnitt
- valgfritt fargeoverlegg over bilde
- hovedoverskrift
- undertittel
- én eller to handlingsknapper
- knapp kan skjules
- lenke til side, seksjon eller ekstern URL
- tekstjustering venstre, midt eller høyre
- maksimal tekstbredde
- tekstfarge
- justerbar høyde innen låste grenser
- markering, sletting og egenskapspanel som ett element
- snapmål der det er relevant

### Produktvalg som låses før kode

- eksakte høydegrenser
- om fri vertikal flytting skal tillates
- om Hero alltid skal ligge rett under Header
- standard overlay og bildeutsnitt
- knappdesign og gjenbruk av knappbibliotek
- mobilinvariant
- skjemaversjon og migrering

### Akseptansekriterier

- Hero opprettes som ett konsistent element
- bilde og tekst lagres gjennom eksisterende validerte grenser
- knapper bruker stabile lenkemål
- Header og Hero kan eksistere uten overlapp eller skjulte posisjonsavvik
- PC og Telefon har dokumentert og testet oppførsel

---

## Fase 22 – Header-redigering og nettstedstruktur

### Formål

Gjøre Header vedlikeholdbar etter oppretting og avklare hva som er globalt for nettstedet.

### Omfang

- bytte Header-logo
- endre navn
- endre undertittel
- kontrollert assetbytte og ressursopprydding
- redigere menydesign etter fase 20
- avklare og implementere nettstednivå kontra sidenivå
- sikre at navigasjon og Header tolkes likt på alle sider

### Låst retning

Header bør behandles som nettstedstruktur fremfor en tilfeldig løs seksjon. Endelig global modell bestemmes først når side- og navigasjonsmodellen fra fase 19 er verifisert.

### Akseptansekriterier

- logo kan byttes uten ressurslekkasje
- tekst kan endres gjennom validerte actions
- Header finnes og tolkes konsistent på relevante sider
- sletting eller endring bryter ikke navigasjonsreferanser

---

## Fase 23 – responsive mobiloverstyringer

### Formål

La Telefon ha eksplisitte forskjeller uten å overskrive PC-oppsettet.

### Omfang

- egen mobilposisjon
- egen mobilbredde og -høyde der elementtypen tillater det
- egen mobilsynlighet
- tydelig `Arver fra PC`
- tydelig `Eget mobiloppsett`
- `Bruk PC-oppsett` fjerner mobiloverstyring
- viewport-bevisste actions og reducere
- Header og Hero beholder sine låste bredde- og plasseringsinvarianter
- menyens automatiske eller kompakte oppførsel fungerer på Telefon

### Akseptansekriterier

- mobilendring overskriver ikke desktop
- desktopendring overskriver ikke eksplisitt mobiloppsett
- reset fjerner mobilverdi fremfor å kopiere desktop
- skjult på mobil sletter ikke elementet
- alle nye elementtyper har eksplisitt responsiv regel

---

## Fase 24 – angre og gjør om

### Formål

Gi sikker redigering og etablere nødvendig grunnlag for AI-endringer.

### Omfang

- historikk for serialiserbar prosjektstate
- én ferdig transform er én historikkoppføring
- transient preview inngår ikke
- ugyldige og uendrede handlinger inngår ikke
- tydelig angre/gjør om-status i toppmenyen
- dokumentert historikkgrense for assetendringer
- framtidige AI-forslag kan committes som én samlet handling

### Akseptansekriterier

- tekst, farger, elementoppretting, sletting og layout kan angres
- gjør om gjenoppretter samme validerte state
- ny handling etter angre forkaster korrekt redo-gren
- historikk lagrer ikke `File`, Blob eller Object URL

---

## Fase 25 – lokal prosjektlagring, autolagring og gjenoppretting

### Formål

Gjøre portalen pålitelig i daglig lokal bruk.

### Omfang

- flere lokale prosjekter
- prosjektoversikt og nylige prosjekter
- opprett, gi nytt navn, dupliser, arkiver og slett prosjekt
- lokal autolagring etter gyldige prosjektmutasjoner
- manuell lagring, anbefalt `Ctrl + S`
- status `Lagrer`, `Lagret` og `Feil`
- forsinket lagring uten å lagre transient preview
- snapshots eller versjonspunkter
- krasjgjenoppretting
- varsling før risikabel prosjektbytte

### Akseptansekriterier

- prosjekt gjenåpnes etter omstart av portalen
- autolagring mister ikke siste godkjente mutasjon
- ødelagt lokalt data erstatter ikke siste gyldige kopi ukontrollert
- ressurslager og serialiserbar state gjenopprettes kontrollert

---

## Fase 26 – sikkerhetskopi, prosjektformat, import og migrering

### Formål

Gi kontrollert portabilitet og robust skjemahåndtering uten offentlig publisering.

### Omfang

- kanonisk prosjektfilformat
- manuell sikkerhetskopi til fil
- åpne/importere prosjektfil
- full modellvalidering før prosjektbytte
- migrering mellom støttede skjemaversjoner
- kontrollert avvisning av ukjent eller ødelagt data
- inkludere eller avstemme bilde- og logoressurser
- ingen lokal maskinsti lagres i prosjektfilen

### Akseptansekriterier

- eksportert prosjekt kan åpnes igjen med samme resultat
- ugyldig fil muterer ikke aktivt prosjekt
- eldre støttet versjon migreres deterministisk
- bruker får tydelig feil ved ikke-støttet format

---

## Fase 27 – lokal forhåndsvisning

### Formål

Vise nettsiden uten editorverktøy, men fortsatt lokalt på samme PC.

### Omfang

- fullskjermsforhåndsvisning
- PC- og Telefon-visning
- alle sider
- Header-meny og intern navigasjon
- Hero og øvrige elementer
- fungerende lenker
- samme responsive modell som editoren
- ingen editorpaneler eller transformgrep

### Ikke del av fasen

- hosting
- domene
- offentlig URL
- produksjonsdeployment

### Akseptansekriterier

- forhåndsvisning tolker samme prosjektmodell som editoren
- side- og seksjonsnavigasjon fungerer
- lukking returnerer til samme editorstate
- resultatet krever ingen ekstern server

---

## Fase 28 – malbibliotek og gjenbrukbare seksjoner

### Formål

Gjøre det raskt å starte og gjenbruke gode design uten AI.

### Omfang

- tomt prosjekt
- enkle prosjektmaler
- Header-varianter
- Hero-varianter
- tjenesteseksjon
- Om oss-seksjon
- kontaktseksjon
- kortrekker
- CTA-seksjoner
- lagre valgt seksjon som lokal mal
- maldata valideres gjennom samme modellgrenser

### Akseptansekriterier

- mal gir gyldig prosjektstate
- maler kan brukes uten skjulte ID-kollisjoner
- gjenbrukte assets håndteres kontrollert
- malbruk kan angres som én handling

---

## Fase 29 – OpenAI-integrasjon

### Formål

Bruke OpenAI som kontrollert meddesigner for tekst, bilder, farger, seksjoner og sideutkast.

### Teknisk grense

- API-nøkkel ligger aldri i Vite- eller browserkode
- lokal Node-prosess eller tilsvarende sikker server-side grense brukes
- nøkkel leses fra miljøvariabel
- gjeldende offisielle OpenAI API og SDK vurderes på nytt når fasen starter
- svar valideres mot egne forslagstyper før UI viser dem
- forslag skrives aldri direkte inn i `EditorProject`

### AI-moduser

1. `Inspirasjon`
   - endrer ingenting
   - viser tekst-, farge- eller designforslag

2. `Sett inn i markert element`
   - tekst til tekstboks
   - bilde til valgt bildefelt eller Hero
   - farge til valgt seksjon eller element

3. `Lag ny del`
   - Hero
   - seksjon
   - kortrekke
   - CTA
   - sideutkast

### Leveransetrinn

#### 29A – tekst og fargeinspirasjon

- skriv ny tekst
- omskriv, forkort og utvid
- endre tone
- oversett
- Hero-overskrifter og knappetekster
- fargepaletter og designinspirasjon

#### 29B – bildegenerering

- forbedre brukerens prompt
- generere Hero-bilde
- generere seksjonsbilde eller illustrasjon
- vise varianter
- velge og lagre bildet lokalt
- sette valgt bilde direkte inn i markert felt etter godkjenning

#### 29C – Hero- og seksjonsgenerator

- lage strukturert forslag basert på eksisterende elementmodeller
- tekst, bilder, farger, knapper og lenker
- forhåndsvisning før commit
- én samlet historikkhandling

#### 29D – side- og prosjektforslag

- foreslå sider og navigasjon
- lage komplett sideutkast
- analysere manglende innhold
- kontrollere tone og designkonsistens
- aldri overskrive hele prosjektet uten eksplisitt godkjenning

### Akseptansekriterier

- nøkkel er ikke tilgjengelig i klientbundelen
- mislykket API-kall endrer ikke prosjektet
- alle forslag kan avvises uten sideeffekt
- alle godkjente endringer valideres gjennom state-laget
- bilde generert for et valgt felt lagres lokalt og får stabil asset-ID
- AI-endring kan angres som én handling
- brukeren ser tydelig hva som vil endres før godkjenning

---

## Eksplisitt utsatt arbeid

Følgende bygges ikke uten ny beslutning:

- snapping under resizing
- snapping ved tastaturflytting
- grid eller faste intervaller
- avstandsmål mellom elementer
- automatisk fordeling av tre eller flere elementer
- flermerking og gruppering
- avansert lagpanel utover nødvendig navigator
- flere mobile brytepunkter
- nettbrett som egen viewport
- automatisk omplassering eller kollisjonsunngåelse
- AI-generert mobiloppsett
- generell CSS-editor
- mer enn ett undermenynivå
- offentlig publisering

## Roadmapregel

Når en fase er ferdig:

1. status oppdateres i dette dokumentet
2. neste fases omfang leses på nytt
3. avhengigheter og faktisk kodebase kontrolleres
4. issue og branch opprettes først etter eksplisitt godkjenning
5. ingen senere funksjon legges skjult inn i aktiv leveranse
