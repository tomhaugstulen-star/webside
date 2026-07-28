# Plan for Website-editoren

Dette dokumentet samler bekreftede krav og åpne planleggingsområder. Det skal oppdateres før nye funksjoner implementeres.

## 1. Bekreftede hovedkrav

### Blank startside

- En ny side skal åpnes helt blank.
- Editorens eget grensesnitt kan være synlig, men nettsiden skal ikke inneholde ferdige seksjoner, tekst, bilder eller farger.
- Objektverktøy, låseknapp og drahåndtak skal ikke vises før et faktisk objekt finnes og er markert.

### Desktop og mobil

- Editorens designverktøy skal støtte både desktop- og mobilvisning.
- Mobilvisningen skal være en faktisk redigeringsmodus, ikke bare en smal forhåndsvisning.
- Elementer som finnes på desktop skal kunne skjules på mobil uten at desktopversjonen slettes.
- CSS media queries skal brukes i ferdig forhåndsvisning og eksport.
- Desktop og mobil kan teknisk ha forskjellige font-, bilde- og elementinnstillinger.
- Hvilke egenskaper som kan overstyres i første versjon skal avklares før implementering.
- Den tekniske retningen er beskrevet i `docs/RESPONSIVE_DESIGN.md`.

### Korrigerings- og hjelpesystem

- Varsle når et element er sentrert horisontalt på siden eller i aktuell beholder.
- Vise når bokser eller elementer ligger på samme linje.
- Vise når tre eller flere bokser har lik avstand mellom seg.
- Hjelpelinjene skal bare vises under relevant flytting eller størrelsesendring.
- Vertikal midtstilling skal ikke være en egen korrigeringsfunksjon.
- Systemet skal ikke reagere bare fordi en boks nærmer seg en annen.
- Elementer kan overlappe hverandre.
- Korrigeringssystemet skal være veiledende og ikke flytte elementer automatisk uten tydelig tilbakemelding.

Arbeidsnavn: `alignment-guides`.

## 2. Menystruktur

### Nåværende editorrail

Editorgrunnlaget har disse hovedvalgene:

1. Design
2. Bilder og logo
3. Elementer
4. Filer
5. Innstillinger

`Elementer` het tidligere `Bokser`. Både synlig navn og intern verktøy-ID skal bruke begrepet Elementer.

Elementer-panelet skal beholde:

- Seksjon
- Bilde
- Tekst
- Knapp

### Planlagte prosjektfunksjoner

Følgende funksjoner er bekreftet, men endelig plassering i eksisterende rail eller hovedmeny er ikke fastsatt:

- Nytt prosjekt
- Importer prosjekt
- Farger
- Logo/header
- Fonts

### Nytt prosjekt

- Oppretter et nytt, blankt prosjekt.
- Ulagrede eller ikke ferdig skrevne endringer må håndteres før et eksisterende prosjekt erstattes.

### Farger

- Panelet viser alle fargene som faktisk brukes i prosjektet.
- Dette omfatter sidebakgrunn, header, elementbakgrunner, tekst, rammer og knapper.
- En prosjektfarge skal kunne endres fra ett sted og oppdatere alle elementer som bruker den.
- Det skal ikke ligge ferdige fargepaletter i editoren.

### Logo/header

- Brukeren skal kunne legge til et logobilde.
- Brukeren skal kunne opprette en header automatisk.
- Headeren skal kunne inneholde logo, hovedtekst og mindre tekst under hovedteksten.
- Hovedtekst og undertittel skal være redigerbare etter opprettelse.

### Fonts

Panelet skal inneholde:

- fonttype
- fontstørrelse
- fontfarge
- fet skrift
- kursiv

Bekreftede regler:

- Første versjon skal bruke omtrent 7–8 vanlige, nettsikre skrifttyper.
- Fontstørrelse skal velges fra en liste tilsvarende vanlige størrelsesvalg på PC.
- Fontfarger registreres i prosjektets felles Farger-system.
- Fet skrift og kursiv skal være tilgjengelig i første versjon.
- Hvilken tekst eller hvilket element fontinnstillingen gjelder, bestemmes senere.
- Forskjellige fontvalg for desktop og mobil er teknisk mulig og planlegges gjennom responsive overstyringer.

## 3. Elementer og innhold

### Elementboks

Et element er en boks som kan inneholde tekst, bilde eller begge deler.

Bekreftede regler:

- Et nytt element opprettes stort nok til at drahåndtaket er lett å finne og bruke.
- Elementet kan deretter gjøres mindre ved å dra eller skyve i håndtaket.
- Det skal være ett tydelig, firkantet drahåndtak nederst i høyre hjørne.
- Elementets høyde øker ikke automatisk når mer tekst legges inn.
- Tekst som går utenfor elementets grenser skal klippes bort og ikke vises utenfor boksen.
- Når brukeren klikker utenfor elementet, avsluttes redigeringen og størrelse/plassering blir stående.
- Rammetykkelse skal minst ha valgene ingen, 1 px, 2 px, 3 px og 4 px.
- Rammefarge registreres i prosjektets felles Farger-system.
- Elementer kan ligge oppå hverandre.
- Et valgt element eller bilde skal kunne låses slik at det ikke flyttes eller endrer størrelse ved et uhell.
- Låsing skal kunne oppheves igjen.

### Tekstboks i element

Valget `Tekst` skal opprette en tekstboks som kan plasseres inne i et element.

- Tekstboksen kan utvide seg etter tekstinnholdet.
- Tekstboksen er underordnet elementboksen den ligger i.
- Brukeren kan skrive og redigere tekst direkte.
- Brukeren kan markere, rette og slette tekst.
- Markert tekst kan endre fonttype, fontstørrelse og fontfarge.
- Markert tekst kan gjøres fet eller kursiv.
- Innhold som går utenfor selve elementboksen skal skjules.

### Bilder

Valget `Bilde` eller bildeverktøyet skal:

1. Åpne bildevelgeren på brukerens PC.
2. La brukeren velge et bilde.
3. Legge det valgte bildet inn på redigeringsflaten.
4. La brukeren endre bildets størrelse.
5. La brukeren klikke og dra bildet inn over eller inn i et element.

Bekreftede regler:

- Bildet skal alltid være et selvstendig redigerbart objekt.
- Bildet skal ikke festes til elementet det visuelt ligger i.
- Flyttes elementboksen, følger ikke bildet automatisk med.
- Brukeren flytter bildet separat.
- Bildet skal kunne låses for å hindre utilsiktet flytting eller størrelsesendring.

### Knapper

Elementer-panelet skal inneholde `Knapp`.

Før faktisk knappobjekt bygges må det defineres:

- redigerbar knappetekst
- størrelse og plassering
- bakgrunn, tekstfarge og ramme
- hvilken handling eller lenketype knappen skal støtte
- responsive egenskaper

Planlagt branch: `feature/button-element`.

## 4. Lokal automatisk lagring

- Editoren skal ha automatisk lagring som grunnfunksjon.
- Prosjektet skal lagres direkte på brukerens PC i en egen prosjektmappe.
- Brukeren skal velge eller opprette prosjektmappen når prosjektet opprettes eller åpnes første gang.
- Etter at prosjektmappen er valgt, skal endringer lagres automatisk i denne mappen.
- Prosjektmappen skal inneholde prosjektdata og nødvendige lokale filer, inkludert bilder som brukes i prosjektet.
- Lagring skal skje uten at brukeren må trykke Lagre etter hver endring.
- Editoren skal vise tydelig status, for eksempel `Lagrer`, `Lagret` eller `Lagringsfeil`.
- Det må finnes gjenoppretting etter feil eller uventet lukking.
- Automatisk lagring og angre/gjør om skal bruke samme tydelige endringsmodell.
- Serverlagring er ikke et krav for første lokale versjon.

## 5. Arkitektur og arbeidsmåte

- Hver funksjon bygges i egen branch.
- `main` skal holdes stabil.
- Maksimal anbefalt størrelse for kildefiler er 300 linjer.
- Filer skal deles tidligere dersom de får for mange ansvarsområder.
- `App.tsx` skal bare sette sammen hovedstrukturen.
- Elementer, tekstredigering, bildebehandling, knapper, korrigeringslinjer, responsive regler og lagring skal ha separate moduler.
- Dependency Cruiser skal stoppe sirkulære, uløselige og kildekodemoduler som ikke kan nås fra `src/main.tsx`.
- Gjennomført grunnlagskontroll er dokumentert i `docs/CODE_AUDIT.md`.

## 6. Planlagte branches

Branches opprettes først når delen faktisk skal bygges:

- `feature/element-model`
- `feature/element-selection`
- `feature/element-creation`
- `feature/drag-resize`
- `feature/object-locking`
- `feature/text-box-editing`
- `feature/button-element`
- `feature/image-import-and-placement`
- `feature/project-colors`
- `feature/logo-header`
- `feature/alignment-guides`
- `feature/mobile-design-controls`
- `feature/history-system`
- `feature/local-project-autosave`
- `feature/project-open-import`
- `feature/layers-panel`
- `feature/preview-mode`
- `feature/publishing`

## 7. Åpne beslutninger

- Endelig plassering av Nytt prosjekt og Importer prosjekt.
- Hvordan Farger, Logo/header og Fonts plasseres i den nåværende menystrukturen.
- Endelig liste over de 7–8 skrifttypene.
- Eksakte fontstørrelser i listen.
- Hvilken tekst eller hvilket element en fontendring gjelder.
- Om tekstjustering og linjehøyde skal være med.
- Hvilke font-, bilde- og elementegenskaper som kan overstyres separat på mobil.
- Endelig mobilbrytepunkt.
- Endelig standardstørrelse og minimumsstørrelse på et nytt element.
- Om drahåndtaket endrer bredde og høyde fritt eller proporsjonalt.
- Nøyaktig plassering og utforming av låsefunksjonen.
- Hvordan tre eller flere bokser måles for lik avstand.
- Terskel og styrke for sentrering og lik avstand.
- Knappens handlinger og lenketyper.
- Filformatet for prosjektdata i prosjektmappen.
- Nøyaktig lagringsintervall og metode for sikker skriving uten ødelagte filer.
- Hvordan prosjektet åpnes igjen fra en eksisterende prosjektmappe.
- Datamodell, publiseringsarkitektur og eventuell senere backend.
