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
- Endringer skal kunne gjelde begge visninger, bare desktop eller bare mobil.
- Om desktop og mobil skal kunne ha forskjellige font- og elementinnstillinger må undersøkes nærmere før implementering.

### Korrigerings- og hjelpesystem

Editoren skal ha visuelle korrigeringshjelpemidler under flytting og plassering.

Bekreftede behov:

- Varsle når et element er sentrert horisontalt på siden eller i aktuell beholder.
- Vise når bokser eller elementer ligger på samme linje.
- Vise når tre eller flere bokser har lik avstand mellom seg.
- Hjelpelinjene skal bare vises under relevant flytting eller størrelsesendring.
- Vertikal midtstilling skal ikke være en egen korrigeringsfunksjon.
- Elementer skal som hovedregel ikke overlappe hverandre.
- Systemet skal ikke flytte elementer uten at brukeren ser og forstår korreksjonen.

Arbeidsnavn for denne delen: `alignment-guides`.

## 2. Bekreftet verktøymeny

Foreløpig rekkefølge:

1. Nytt prosjekt
2. Farger
3. Logo/header
4. Fonts
5. Elementer

`Importer prosjekt` er bekreftet som nødvendig, men endelig plassering er ikke bestemt.

### Nytt prosjekt

- Oppretter et nytt, blankt prosjekt.
- Ulagrede endringer må håndteres før et eksisterende prosjekt erstattes.

### Farger

- Panelet skal vise alle fargene som faktisk brukes i prosjektet.
- Dette omfatter blant annet sidebakgrunn, header, elementbakgrunner, tekst, rammer og knapper.
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
- Fontfarger skal registreres i prosjektets felles Farger-system.
- Fet skrift og kursiv skal være tilgjengelig i første versjon.
- Hvilken tekst eller hvilket element fontinnstillingen gjelder, bestemmes senere.
- Forskjellige fontvalg for desktop og mobil skal undersøkes før dette fastsettes.

### Elementer

Et element er en boks som kan inneholde tekst, bilde eller begge deler.

Panelet skal minst inneholde:

- legg til element
- legg til tekst
- rammetykkelse
- rammefarge

Bekreftede regler for elementboksen:

- Et nytt element opprettes som en redigerbar boks.
- Foreløpig standardstørrelse er omtrent 2 × 4 cm på skjermen.
- Foreløpig minste størrelse er omtrent 1 × 3 cm.
- Størrelsen endres med ett drahåndtak nederst i høyre hjørne.
- Elementets høyde skal ikke øke automatisk når mer tekst legges inn.
- Et element er aktivt mens det er markert.
- Når brukeren klikker utenfor elementet, avsluttes redigeringen og størrelsen/plasseringen blir stående.
- Dette skal ikke kreve en egen låseknapp.
- Rammetykkelse skal minst ha valgene ingen, 1 px, 2 px, 3 px og 4 px.
- Rammefarge skal registreres i prosjektets felles Farger-system.
- Elementer skal normalt ikke ligge oppå hverandre.

### Tekstboks i element

Valget `Legg til tekst` skal opprette en tekstboks som kan plasseres inne i et element.

Bekreftede regler:

- Tekstboksen skal kunne utvide seg etter tekstinnholdet.
- Tekstboksen skal være underordnet elementboksen den ligger i.
- Brukeren skal kunne skrive og redigere tekst direkte.
- Brukeren skal kunne markere tekst.
- Markert tekst skal kunne rettes, slettes og formateres.
- Markert tekst skal kunne få annen fonttype, fontstørrelse og fontfarge.
- Markert tekst skal kunne gjøres fet eller kursiv.

## 3. Editorområder som må planlegges

### Elementmodell

For hver elementtype må vi definere:

- tillatte foreldre og barn
- størrelse og plassering
- responsive egenskaper
- redigerbare stiler
- duplisering og sletting
- lagrekkefølge

### Markering og manipulering

Det må planlegges hvordan brukeren:

- markerer ett eller flere elementer
- flytter elementer
- bruker drahåndtaket nederst til høyre
- avslutter redigering ved å klikke utenfor
- dupliserer og sletter
- flytter elementer i lagrekkefølgen
- avbryter en handling

### Layoutsystem

Før dra-og-slipp bygges må layoutmodellen velges. Løsningen må være responsiv og stabil. Elementer skal normalt ikke overlappe, og plassering på desktop må ikke ødelegge mobiloppsettet.

### Historikk og lagring

Det må defineres:

- hvilke handlinger som registreres i angre/gjør om
- automatisk lagringsfrekvens
- lokal midlertidig lagring
- serverlagring
- gjenoppretting etter feil eller lukket nettleser
- versjonshistorikk og konfliktbehandling

### Forhåndsvisning og publisering

Det må planlegges:

- forhåndsvisning uten editorgrensesnitt
- forhåndsvisning per skjermstørrelse
- kladd kontra publisert versjon
- domene, URL-struktur, SEO og metadata
- publiseringsfeil og tilbakerulling

## 4. Foreslått funksjonsrekkefølge

Denne rekkefølgen er foreløpig og skal godkjennes før bygging:

1. Fullføre og fryse editorens hovedlayout.
2. Definere element- og sidemodellen.
3. Bygge markering av elementer.
4. Bygge innsetting av ett enkelt element.
5. Bygge flytting og størrelsesendring med drahåndtak.
6. Bygge tekstboks og tekstredigering.
7. Bygge korrigeringslinjer og lik avstand.
8. Avklare og bygge desktop- og mobilspesifikke egenskaper.
9. Bygge lagpanel og elementhierarki.
10. Bygge angre/gjør om.
11. Bygge lagring og gjenoppretting.
12. Bygge forhåndsvisning.
13. Bygge publisering.

## 5. Planlagte branches

Branches opprettes først når den aktuelle delen faktisk skal bygges:

- `feature/element-model`
- `feature/element-selection`
- `feature/drag-resize`
- `feature/text-box-editing`
- `feature/alignment-guides`
- `feature/mobile-design-controls`
- `feature/layers-panel`
- `feature/history-system`
- `feature/editor-persistence`
- `feature/preview-mode`
- `feature/publishing`

## 6. Åpne beslutninger

Følgende er ikke bestemt ennå:

- endelig plassering av Importer prosjekt
- endelig liste over de 7–8 skrifttypene
- eksakte fontstørrelser i listen
- hvilken tekst eller hvilket element en fontendring gjelder
- om tekstjustering og linjehøyde skal være med
- om desktop og mobil kan ha forskjellige fontvalg
- om desktop og mobil kan ha forskjellig elementstørrelse og plassering
- om målene 2 × 4 cm og 1 × 3 cm skal oversettes til faste piksler eller relativ skjermstørrelse
- om elementer kan endres bare proporsjonalt eller fritt i bredde og høyde
- hva som skjer når tekstinnholdet blir større enn elementboksen
- hvordan tekstboksen plasseres og begrenses inne i elementet
- om tekstboksen kan flyttes og endre størrelse separat
- hvordan bilder legges inn og tilpasses i elementer
- hvordan boksene flyttes uten overlapping
- hvordan like avstander beregnes for to, tre og flere bokser
- terskel og styrke for sentrering og lik avstand
- datamodell, lagringsformat, backend og publiseringsarkitektur

Disse punktene fylles inn etter hvert som kravene blir avklart.
