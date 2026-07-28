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
- Desktop og mobil skal kunne bruke forskjellig skrifttype og skriftstørrelse.
- Det må vises tydelig når mobil bruker en egen verdi i stedet for desktopverdien.

### Korrigerings- og hjelpesystem

Editoren skal ha visuelle korrigeringshjelpemidler under flytting og plassering.

Bekreftede behov:

- Varsle når et element er sentrert horisontalt på siden eller i aktuell beholder.
- Vise når bokser eller elementer ligger på samme linje.
- Vise når avstanden mellom bokser er lik.
- Hjelpelinjene skal bare vises under relevant flytting eller størrelsesendring.
- Vertikal midtstilling skal ikke være en egen korrigeringsfunksjon.
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

Bekreftede regler:

- Bare vanlige, nettsikre skrifttyper skal brukes.
- Fontstørrelse skal velges fra en liste, ikke skrives fritt.
- Desktop og mobil skal kunne ha forskjellig skrifttype.
- Desktop og mobil skal kunne ha forskjellig fontstørrelse.
- Fontfarger skal registreres i prosjektets felles Farger-system.
- Hvilken tekst eller hvilket element fontinnstillingen gjelder, bestemmes senere.

### Elementer

Et element er en boks som kan inneholde tekst, bilde eller begge deler.

Panelet skal minst inneholde:

- legg til element
- størrelse
- rammetykkelse
- rammefarge

Bekreftede regler:

- Et nytt element opprettes som en redigerbar boks.
- Størrelsen skal endres direkte med drahåndtak på elementet.
- Rammetykkelse skal minst ha valgene ingen, 1 px, 2 px, 3 px og 4 px.
- Rammefarge skal registreres i prosjektets felles Farger-system.

## 3. Editorområder som må planlegges

### Elementmodell

For hver elementtype må vi definere:

- tillatte foreldre og barn
- størrelse og plassering
- responsive egenskaper
- redigerbare stiler
- duplisering og sletting
- låsing
- lagrekkefølge

### Markering og manipulering

Det må planlegges hvordan brukeren:

- markerer ett eller flere elementer
- flytter elementer
- bruker drahåndtak til å endre størrelse
- dupliserer, låser og sletter
- flytter elementer i lagrekkefølgen
- avbryter en handling

### Layoutsystem

Før dra-og-slipp bygges må layoutmodellen velges. Løsningen må være responsiv og stabil, og fri plassering må ikke ødelegge mobiloppsettet.

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
6. Bygge korrigeringslinjer og lik avstand.
7. Bygge desktop- og mobilspesifikke egenskaper.
8. Bygge lagpanel og elementhierarki.
9. Bygge angre/gjør om.
10. Bygge lagring og gjenoppretting.
11. Bygge forhåndsvisning.
12. Bygge publisering.

## 5. Planlagte branches

Branches opprettes først når den aktuelle delen faktisk skal bygges:

- `feature/element-model`
- `feature/element-selection`
- `feature/drag-resize`
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
- nøyaktig liste over tillatte skrifttyper
- hvilke fontstørrelser som skal finnes i listen
- hvilken tekst eller hvilket element en fontendring gjelder
- om fontvekt, kursiv, linjehøyde og tekstjustering skal være med
- hvordan desktopverdier arves eller overstyres på mobil
- standardstørrelse på et nytt element
- om drahåndtak skal ligge på hjørner, sider eller begge deler
- minimums- og maksimumsstørrelse for elementer
- om et element kan beholde fast bredde/høyde-forhold
- om høyden kan følge innholdet automatisk
- hvordan elementer flyttes, overlapper og plasseres i beholdere
- terskel og styrke for sentrering og lik avstand
- datamodell, lagringsformat, backend og publiseringsarkitektur

Disse punktene fylles inn etter hvert som kravene blir avklart.
