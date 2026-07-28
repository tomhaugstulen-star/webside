# Plan for Website-editoren

Dette dokumentet samler bekreftede krav og åpne planleggingsområder. Det skal oppdateres før nye funksjoner implementeres.

## 1. Bekreftede hovedkrav

### Blank startside

- En ny side skal åpnes helt blank.
- Editorens eget grensesnitt kan være synlig, men nettsiden skal ikke inneholde ferdige seksjoner, tekst, bilder eller farger.

### Desktop og mobil

- Editorens designverktøy skal støtte både desktop- og mobilvisning.
- Brukeren skal kunne lage et mobiluttrykk som avviker fra desktopversjonen.
- Elementer som finnes på desktop skal kunne skjules eller fjernes fra mobilvisningen uten at desktopversjonen slettes.
- Det må defineres tydelig om endringer gjelder:
  - begge visninger
  - bare desktop
  - bare mobil
- Mobilvisningen skal være en faktisk redigeringsmodus, ikke bare en smal forhåndsvisning.

### Korrigerings- og hjelpesystem

Editoren skal ha visuelle korrigeringshjelpemidler under flytting og plassering.

Bekreftede behov:

- Varsle når et element er sentrert horisontalt på siden eller i aktuell beholder.
- Varsle når et element er sentrert vertikalt der dette er relevant.
- Vise når bokser eller elementer ligger på samme linje.
- Vise når avstanden mellom bokser er lik.
- Hjelpelinjene skal bare vises under relevant flytting eller størrelsesendring.
- Systemet skal ikke flytte elementer uten at brukeren ser og forstår korreksjonen.

Arbeidsnavn for denne delen: `alignment-guides`.

## 2. Editorområder som må planlegges

### Verktøymeny

For hver verktøydel må følgende defineres:

- navn og ikon
- panelinnhold
- hva hvert valg oppretter eller endrer
- om panelet lukkes etter valg
- hvordan valgt verktøy vises
- hvilken oppførsel som gjelder på desktop og mobil

Nåværende panelinnhold er ikke endelig spesifikasjon.

### Elementmodell

Det må bestemmes hvilke grunnleggende elementtyper editoren støtter. Mulige kategorier som skal vurderes senere:

- side
- seksjon
- beholder
- tekst
- bilde
- knapp
- skjema
- navigasjon
- dekorative elementer

For hver type må vi definere:

- tillatte foreldre og barn
- størrelse og plassering
- responsive egenskaper
- redigerbare stiler
- duplisering og sletting
- låsing
- lagrekkefølge

### Markering og manipulering

Det må planlegges hvordan brukeren:

- markerer ett element
- markerer flere elementer
- flytter elementer
- endrer størrelse
- dupliserer
- låser
- sletter
- flytter elementet i lagrekkefølgen
- avbryter en handling

### Layoutsystem

Før dra-og-slipp bygges må vi velge layoutmodell. Mulige mekanismer:

- normal dokumentflyt
- flex-baserte beholdere
- grid-baserte beholdere
- begrenset absolutt plassering

Målet er at siden skal være responsiv og stabil. Fri plassering må ikke føre til ødelagte mobiloppsett.

### Responsiv redigering

Det må avklares hvilke egenskaper som kan være forskjellige per visning:

- synlighet
- rekkefølge
- bredde og høyde
- margin og padding
- justering
- tekststørrelse
- bakgrunn og bildebruk
- posisjonering

Det må også bestemmes hvordan brukeren ser at en verdi er arvet fra desktop eller overstyrt på mobil.

### Historikk og lagring

Det må defineres:

- hvilke handlinger som registreres i angre/gjør om
- automatisk lagringsfrekvens
- lokal midlertidig lagring
- serverlagring
- gjenoppretting etter feil eller lukket nettleser
- versjonshistorikk
- konfliktbehandling

### Forhåndsvisning og publisering

Det må planlegges separat:

- forhåndsvisning uten editorgrensesnitt
- forhåndsvisning per skjermstørrelse
- kladd kontra publisert versjon
- publiseringsstatus
- domene og URL-struktur
- SEO og metadata
- publiseringsfeil og tilbakerulling

## 3. Foreslått funksjonsrekkefølge

Denne rekkefølgen er foreløpig og skal godkjennes før bygging:

1. Fullføre og fryse editorens hovedlayout.
2. Definere element- og sidemodellen.
3. Bygge markering av elementer.
4. Bygge innsetting av ett enkelt element.
5. Bygge flytting og størrelsesendring.
6. Bygge korrigeringslinjer og lik avstand.
7. Bygge desktop- og mobilspesifikke egenskaper.
8. Bygge lagpanel og elementhierarki.
9. Bygge angre/gjør om.
10. Bygge lagring og gjenoppretting.
11. Bygge forhåndsvisning.
12. Bygge publisering.

## 4. Brancher for større deler

Foreslåtte branches når delene er ferdig planlagt:

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

Ingen av disse skal opprettes før den aktuelle delen faktisk skal startes.

## 5. Åpne beslutninger

Følgende er bevisst ikke bestemt ennå:

- nøyaktig innhold i hver verktøydel
- komplett liste over elementtyper
- layoutmotor
- datamodell og lagringsformat
- backend og publiseringsarkitektur
- hvor mange responsive brytepunkter som støttes
- om skjuling på mobil betyr `display: none` eller en egen mobilstruktur
- terskel og styrke for snapping
- hvordan like avstander beregnes

Disse punktene skal fylles inn etter hvert som kravene blir beskrevet.
