# Plan for Website-editoren

Dette dokumentet samler bekreftede krav og åpne planleggingsområder. Det skal oppdateres før nye funksjoner implementeres.

## 1. Bekreftede hovedkrav

### Blank startside

- En ny side skal åpnes helt blank.
- Editorens eget grensesnitt kan være synlig, men nettsiden skal ikke inneholde ferdige seksjoner, tekst, bilder eller farger.

### Desktop og mobil

- Editorens designverktøy skal støtte både desktop- og mobilvisning.
- Mobilvisningen skal være en faktisk redigeringsmodus, ikke bare en smal forhåndsvisning.
- Elementer som finnes på desktop skal kunne skjules på mobil uten at desktopversjonen slettes.
- Om desktop og mobil skal kunne ha forskjellige font-, bilde- og elementinnstillinger må undersøkes før implementering.

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

## 2. Bekreftet verktøymeny

Foreløpig rekkefølge:

1. Nytt prosjekt
2. Farger
3. Logo/header
4. Fonts
5. Elementer

`Importer prosjekt` er nødvendig, men endelig plassering er ikke bestemt.

### Nytt prosjekt

- Oppretter et nytt, blankt prosjekt.
- Ulagrede endringer må håndteres før et eksisterende prosjekt erstattes.

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
- Forskjellige fontvalg for desktop og mobil skal undersøkes før dette fastsettes.

### Elementer

Et element er en boks som kan inneholde tekst, bilde eller begge deler.

Panelet skal minst inneholde:

- legg til element
- legg til tekst
- bilder
- rammetykkelse
- rammefarge

Bekreftede regler for elementboksen:

- Et nytt element opprettes stort nok til at drahåndtaket er lett å finne og bruke.
- Elementet kan deretter gjøres mindre ved å dra eller skyve i håndtaket.
- Det skal være ett tydelig, firkantet drahåndtak nederst i høyre hjørne.
- Elementets høyde øker ikke automatisk når mer tekst legges inn.
- Tekst som går utenfor elementets grenser skal klippes bort og ikke vises utenfor boksen.
- Når brukeren klikker utenfor elementet, avsluttes redigeringen og størrelse/plassering blir stående.
- Ingen egen låseknapp skal brukes.
- Rammetykkelse skal minst ha valgene ingen, 1 px, 2 px, 3 px og 4 px.
- Rammefarge registreres i prosjektets felles Farger-system.
- Elementer kan ligge oppå hverandre.

### Tekstboks i element

Valget `Legg til tekst` oppretter en tekstboks som kan plasseres inne i et element.

- Tekstboksen kan utvide seg etter tekstinnholdet.
- Tekstboksen er underordnet elementboksen den ligger i.
- Brukeren kan skrive og redigere tekst direkte.
- Brukeren kan markere, rette og slette tekst.
- Markert tekst kan endre fonttype, fontstørrelse og fontfarge.
- Markert tekst kan gjøres fet eller kursiv.
- Innhold som går utenfor selve elementboksen skal skjules.

### Bilder

Valget `Bilder` skal:

1. Åpne bildevelgeren på brukerens PC.
2. La brukeren velge et bilde.
3. Legge det valgte bildet inn på redigeringsflaten.
4. La brukeren endre bildets størrelse.
5. La brukeren klikke og dra bildet inn i et element.

Bildet skal være et selvstendig redigerbart objekt fram til det plasseres i et element.

## 3. Lagring og sikkerhet

- Editoren skal ha automatisk lagring.
- Automatisk lagring regnes som en grunnfunksjon, ikke en senere ekstrafunksjon.
- Det må finnes lokal midlertidig lagring slik at arbeid ikke forsvinner ved feil eller lukket nettleser.
- Serverlagring, lagringsintervall, gjenoppretting og versjonshistorikk må planlegges før implementering.
- Angre/gjør om og automatisk lagring må bruke samme tydelige endringsmodell.

## 4. Arkitektur og arbeidsmåte

- Hver funksjon bygges i egen branch.
- `main` skal holdes stabil.
- Maksimal anbefalt størrelse for kildefiler er 300 linjer.
- Filer skal deles tidligere dersom de får for mange ansvarsområder.
- `App.tsx` skal bare sette sammen hovedstrukturen.
- Elementer, tekstredigering, bildebehandling, korrigeringslinjer og lagring skal ha separate moduler.

## 5. Foreslått funksjonsrekkefølge

1. Fullføre og fryse editorens hovedlayout.
2. Definere element- og sidemodellen.
3. Bygge markering av elementer.
4. Bygge innsetting av ett enkelt element.
5. Bygge flytting og størrelsesendring med drahåndtak.
6. Bygge tekstboks og tekstredigering.
7. Bygge bildevelger, bildeobjekt og plassering i element.
8. Bygge korrigeringslinjer og lik avstand.
9. Avklare og bygge desktop- og mobilspesifikke egenskaper.
10. Bygge angre/gjør om.
11. Bygge automatisk lagring og gjenoppretting.
12. Bygge lagpanel og elementhierarki.
13. Bygge forhåndsvisning.
14. Bygge publisering.

## 6. Planlagte branches

Branches opprettes først når delen faktisk skal bygges:

- `feature/element-model`
- `feature/element-selection`
- `feature/drag-resize`
- `feature/text-box-editing`
- `feature/image-import-and-placement`
- `feature/alignment-guides`
- `feature/mobile-design-controls`
- `feature/history-system`
- `feature/editor-autosave`
- `feature/layers-panel`
- `feature/preview-mode`
- `feature/publishing`

## 7. Åpne beslutninger

- Endelig plassering av Importer prosjekt.
- Endelig liste over de 7–8 skrifttypene.
- Eksakte fontstørrelser i listen.
- Hvilken tekst eller hvilket element en fontendring gjelder.
- Om tekstjustering og linjehøyde skal være med.
- Om desktop og mobil kan ha forskjellige font-, bilde- og elementinnstillinger.
- Endelig standardstørrelse og minimumsstørrelse på et nytt element.
- Om drahåndtaket endrer bredde og høyde fritt eller proporsjonalt.
- Hvordan bilder beskjæres eller tilpasses når de legges i et element.
- Om et bilde blir låst til elementet etter innsetting, eller fortsatt kan flyttes inni boksen.
- Hvordan tre eller flere bokser måles for lik avstand.
- Terskel og styrke for sentrering og lik avstand.
- Automatisk lagringsintervall.
- Lokal lagringsmetode, serverlagring og gjenoppretting.
- Datamodell, lagringsformat, backend og publiseringsarkitektur.
