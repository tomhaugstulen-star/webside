# Plan for Website-editoren

Dette dokumentet samler bekreftede krav, implementert grunnlag og åpne beslutninger.

## 1. Nåværende implementeringsstatus

### Godkjent på `main`

- blankt, hvitt lerret
- toppmeny
- venstremeny med kontrollert åpning og lukking
- desktop- og mobilvisning
- Elementer-panel med Seksjon, Bilde, Tekst og Knapp
- delt CSS- og komponentstruktur
- Dependency Cruiser
- samlet `npm run check`
- automatisk åpning av nettleseren med `npm run dev`

### Godkjent i `feature/element-model`

- skjemaversjon for prosjektdata
- stabil prosjekt-ID og side-ID
- prosjekt med navn, sider og tidsstempler
- sider med navn, slug og elementliste
- elementtypene seksjon, bilde, tekst og knapp
- responsive verdier for posisjon, størrelse og synlighet
- låsestatus
- kryptografiske stabile UUID-er
- sentral prosjekt-state med provider og reducer
- aktiv side fra prosjektmodellen
- nytt prosjekt starter blankt med siden `Forside`

Branchen skal merges til `main` før neste feature-branch opprettes.

### Neste fase

```text
feature/element-selection
```

Skal bare bygge markering av eksisterende elementer og valgt element-ID. Elementoppretting kommer etterpå i `feature/element-creation`.

## 2. Bekreftede hovedkrav

### Blank startside

- En ny side skal åpnes helt blank.
- Editorens grensesnitt kan være synlig, men nettsiden skal ikke inneholde ferdige seksjoner, tekst, bilder eller farger.
- Objektverktøy, låseknapp og drahåndtak skal ikke vises før et faktisk objekt finnes og er markert.

### Desktop og mobil

- Desktop og mobil er redigeringsmoduser.
- Elementer på desktop skal kunne skjules på mobil uten å slettes på desktop.
- Ferdig forhåndsvisning og eksport skal bruke media queries.
- Prosjektmodellen har nå `ResponsiveValue<T>` med desktopverdi og valgfri mobilverdi.
- Arv, overstyring og mobilkontroller er ikke implementert ennå.
- Teknisk retning ligger i `docs/RESPONSIVE_DESIGN.md`.

### Korrigerings- og hjelpesystem

- Varsle ved horisontal midtstilling.
- Vise når elementer ligger på samme linje.
- Vise lik avstand mellom tre eller flere elementer.
- Hjelpelinjer vises bare under flytting eller størrelsesendring.
- Vertikal midtstilling skal ikke være en egen funksjon.
- Systemet skal ikke reagere bare fordi elementer nærmer seg hverandre.
- Elementer kan overlappe.
- Ingen usynlig automatisk flytting eller kollisjonsunngåelse.

Planlagt branch: `feature/alignment-guides`.

## 3. Menystruktur

### Nåværende editorrail

1. Design
2. Bilder og logo
3. Elementer
4. Filer
5. Innstillinger

`Elementer` bruker samme begrep i synlig tekst, intern verktøy-ID og CSS.

Elementer-panelet beholder:

- Seksjon
- Bilde
- Tekst
- Knapp

### Planlagte prosjektfunksjoner

- Nytt prosjekt
- Importer prosjekt
- Farger
- Logo/header
- Fonts

Endelig plassering i rail eller hovedmeny er ikke fastsatt.

## 4. Elementer og innhold

### Elementboks

Et element er en boks som kan inneholde tekst, bilde eller begge deler.

Bekreftede regler:

- nytt element skal være stort nok til at håndtaket er lett å bruke
- ett tydelig, firkantet håndtak nederst til høyre
- elementets høyde øker ikke automatisk på grunn av tekst
- innhold utenfor elementets grenser klippes
- klikk utenfor avslutter redigering og beholder størrelse/plassering
- rammetykkelse: ingen, 1 px, 2 px, 3 px og 4 px
- rammefarge registreres i Farger-systemet
- elementer kan overlappe
- valgt element eller bilde kan låses og låses opp

### Markering

Neste branch skal definere:

- valgt element-ID
- valg av ett element
- tydelig valgt tilstand
- klikk utenfor for å fjerne markering
- sikker opprydding dersom valgt element slettes eller ikke finnes

Markering skal ikke blandes med oppretting, draing eller størrelsesendring.

### Tekst

- `Tekst` oppretter senere en tekstboks som kan plasseres i et element.
- Tekstboksen kan vokse med innholdet, men elementboksen vokser ikke automatisk.
- Brukeren skal kunne skrive, markere, rette og slette tekst.
- Markert tekst skal kunne endre font, størrelse, farge, fet og kursiv.
- Innhold utenfor elementboksen skjules.

### Bilder

- åpne bildevelger på PC
- legge bildet inn på lerretet
- bildet er et selvstendig objekt
- flytte og endre størrelse separat
- bildet festes ikke automatisk til elementet det ligger over
- bildet kan låses

### Knapper

Elementer-panelet inneholder `Knapp`.

Før implementering må dette fastsettes:

- redigerbar knappetekst
- størrelse og plassering
- bakgrunn, tekstfarge og ramme
- handling eller lenketype
- responsive egenskaper

Planlagt branch: `feature/button-element`.

## 5. Farger, logo/header og fonts

### Farger

- panelet viser alle faktiske prosjektfarger
- ingen ferdig fargepalett
- global prosjektfarge kan endres fra ett sted
- endringen oppdaterer alle elementer som bruker fargen

### Logo/header

- laste opp logo
- opprette header
- logo, hovedtekst og undertittel
- redigerbar struktur

### Fonts

- omtrent 7–8 nettsikre fonter
- fontstørrelse fra fast liste
- fontfarge registreres i Farger-systemet
- fet og kursiv i første versjon
- scope for fontendring avklares senere

## 6. Lokal automatisk lagring

- prosjektet lagres i egen mappe på brukerens PC
- brukeren velger eller oppretter mappen
- prosjektdata og bilder lagres lokalt
- automatisk lagring uten manuell lagring for hver endring
- statusene `Lagrer`, `Lagret` og `Lagringsfeil`
- sikker skriving og gjenoppretting
- samme endringsmodell som angre/gjør om
- serverlagring er ikke nødvendig i første lokale versjon

## 7. Arkitektur og arbeidsmåte

- hver funksjon i egen branch
- `main` holdes stabil
- kildefiler bør være under 300 linjer og deles tidligere ved flere ansvar
- `App.tsx` setter bare sammen hovedstrukturen
- prosjektmodellen er autoritativ datakilde
- DOM-en skal ikke brukes som permanent prosjektlagring
- Dependency Cruiser stopper sirkulære, uløselige og utilgjengelige moduler
- PowerShell-kommandoer skal alltid følge repoendringer

## 8. Planlagte branches

- `feature/element-selection` — neste
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

## 9. Åpne beslutninger

- plassering av Nytt prosjekt og Importer prosjekt
- plassering av Farger, Logo/header og Fonts
- endelig fontliste og fontstørrelser
- scope for fontendringer
- tekstjustering og linjehøyde
- mobile overstyringer i første versjon
- endelig mobilbrytepunkt
- standard- og minimumsstørrelse for element
- fri eller proporsjonal størrelsesendring
- låsefunksjonens plassering og utforming
- måling og terskler for lik avstand og sentrering
- knappens handlinger og lenketyper
- prosjektfilformat og lagringsintervall
- sikker skriving og gjenoppretting
- publiseringsarkitektur og eventuell senere backend