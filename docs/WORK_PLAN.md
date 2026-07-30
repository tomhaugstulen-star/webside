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

Standardkontroll:

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
git diff --check
git status --short
git diff --stat
```

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
siste fullførte produksjonsfase: 14 – korrigeringslinjer og snapping
source branch-head: 28da295d938d4384c8f3cfa2f3b8a72d4a2e1bb4
pull request: #39 – merget
mergecommit på main: 0122605b60808689cdda7cb1601eb3342680f88c
GitHub-sak: #34 – lukket som fullført
prosjektskjema: versjon 9
aktiv produksjonsfase: ingen
neste planlagte fase: 15 – duse portalfarger og tydelig visuell struktur
fase 15: ikke startet
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

Ingen produksjonsbranch er aktiv. Fase 15 skal ikke startes før omfanget under er gjennomgått og eksplisitt godkjent.

## Låst roadmap

```text
fase 14  Korrigeringslinjer og snapping – fullført
fase 15  Duse portalfarger og tydelig visuell struktur
fase 16  Automatisert testgrunnlag
fase 17  Tekstboksbakgrunn og små eksisterende modellgap
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

### Ikke del av fasen

- tekstboksbakgrunn i prosjektmodellen
- globale nettsidemaler
- mørk modus
- brukerdefinerte portaltemaer

### Akseptansekriterier

- portal, paneler og lerret kan skilles umiddelbart
- alle interaktive tilstander er tydelige
- ingen prosjektdata eller skjemaversjon endres
- CSS bruker sentrale tokens fremfor gjentatte tilfeldige farger
- PC-visning fungerer på eksisterende minimumsbredde
- `npm run check` og visuell regresjon er bestått

---

## Fase 16 – automatisert testgrunnlag

### Formål

Redusere regresjonsrisiko før Hero, sider, navigasjon, lagring og AI gjør modellen større.

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

### Akseptansekriterier

- testkommando kan kjøres lokalt og i CI
- eksisterende rene modell- og layoutfunksjoner er dekket
- reducerens valideringsgrenser er dekket
- minst én kritisk editorflyt testes i nettleser
- `npm run check` inkluderer eller følges av dokumentert testkontroll

---

## Fase 17 – tekstboksbakgrunn og små eksisterende modellgap

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
- kontrollere andre små dokumenterte modellgap og behandle dem separat

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
