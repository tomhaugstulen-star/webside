# Plan for Website-editoren

Dette dokumentet samler bekreftede produktkrav, implementert grunnlag og åpne beslutninger.

## 1. Implementeringsstatus

### Ferdig og merget til `main`

- blankt, hvitt lerret
- toppmeny
- venstremeny med kontrollert åpning og lukking
- desktop- og mobilvisning
- Elementer-panel med Seksjon, Bilde, Tekst og Knapp
- delt CSS- og komponentstruktur
- Dependency Cruiser
- samlet `npm run check`
- automatisk nettleseråpning
- prosjekt- og elementmodell
- skjemaversjon og kryptografiske stabile ID-er
- sider, elementtyper og responsive modellverdier
- sentral prosjekt-state og aktiv side
- nytt prosjekt starter blankt med `Forside`

### Implementert i `feature/element-selection`

- valgt element-ID i transient editor-state
- valg av ett eksisterende element på aktiv side
- tydelig valgt, hover- og fokusert tilstand
- klikk på tomt lerretsområde fjerner markeringen
- tastaturvalg med Tab, Enter og mellomrom
- valgt element tilgjengelig gjennom `useElementSelection`
- markering fjernes ved prosjekt- og sidebytte
- markering fjernes dersom elementet ikke finnes etter en prosjektendring
- ugyldig markerings-ID ignoreres
- overflødige state-oppdateringer unngås
- existing elementbokser renderer fra prosjektmodellen
- responsive synlighets-, posisjons- og størrelsesverdier brukes

Visuelt godkjent på desktop og mobil. Den midlertidige test-fixturen er fjernet, og startsiden er igjen blank.

Siste reducer-herding og dokumentendringer må gjennom sluttkontroll før merge.

### Neste fase etter merge

```text
feature/element-creation
```

Denne fasen skal opprette faktiske elementer fra Elementer-panelet. Draing, størrelsesendring, låsing og innholdsredigering skal ikke blandes inn.

## 2. Bekreftede hovedkrav

### Blank startside

- En ny side åpner helt blank.
- Editorgrensesnittet kan være synlig, men nettsiden skal ikke inneholde ferdige seksjoner, tekst, bilder eller farger.
- Objektverktøy, låseknapp og drahåndtak vises først når et faktisk objekt finnes og er markert.
- Elementoppretting skal bare skje etter en eksplisitt brukerhandling.

### Autoritativ prosjektmodell

- `EditorProject` er autoritativ kilde for prosjektdata.
- DOM-en skal ikke brukes som permanent lagring.
- Nye elementer skal opprettes gjennom prosjekt-state/reducer og legges til aktiv side.
- Element-ID-er skal være kryptografiske og stabile.
- Midlertidig markeringsstate skal holdes utenfor prosjektfilen.

### Markeringsstate

`selectedElementId` er transient editor-state og skal ikke:

- lagres i prosjektfilen
- utløse autolagring
- inngå i angre-/gjør om-historikk
- eksporteres
- publiseres

Markeringsregler:

- bare element på aktiv side kan markeres
- ugyldig element-ID ignoreres
- side- og prosjektbytte fjerner markering
- sletting eller annen prosjektendring som fjerner valgt element skal rydde markeringen
- klikk på objektverktøy må senere kunne beholde markeringen
- tekstredigeringsmodus må skille mellom markering av objekt og redigering av innhold

### Desktop og mobil

- Desktop og mobil er redigeringsmoduser.
- Elementer på desktop skal kunne skjules på mobil uten å slettes på desktop.
- Prosjektmodellen har `ResponsiveValue<T>` med desktopverdi og valgfri mobilverdi.
- Lerretsrenderingen bruker mobilverdi når den finnes og ellers desktopverdien.
- Brukergrensesnitt for arv, overstyring og skjuling er ikke implementert ennå.
- Ferdig forhåndsvisning og eksport skal bruke kontrollerte media queries.
- Når mobilskjuling bygges, må det avklares om et skjult element skal miste markeringen i aktiv visning.

### Korrigerings- og hjelpesystem

- varsle ved horisontal midtstilling
- vise når elementer ligger på samme linje
- vise lik avstand mellom tre eller flere elementer
- hjelpelinjer vises bare under flytting eller størrelsesendring
- ingen egen vertikal sentreringsfunksjon
- ingen reaksjon bare fordi elementer nærmer seg hverandre
- elementer kan overlappe
- ingen usynlig automatisk flytting eller kollisjonsunngåelse

Planlagt branch: `feature/alignment-guides`.

## 3. Menystruktur

### Nåværende editorrail

1. Design
2. Bilder og logo
3. Elementer
4. Filer
5. Innstillinger

`Elementer` brukes konsekvent som synlig navn, intern verktøy-ID og CSS-begrep.

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

Endelig plassering er ikke fastsatt.

## 4. Elementer og innhold

### Elementboks

Et element er en boks som senere kan inneholde tekst, bilde eller begge deler.

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

### Elementoppretting

Neste branch skal definere og bygge:

- hvilken menyhandling som oppretter elementet
- standardstørrelse per elementtype eller felles standard
- kontrollert startposisjon
- reducer-action for å legge element til aktiv side
- stabil ID
- automatisk markering av nyopprettet element
- tastaturtilgjengelig oppretting

Skal ikke bygges samtidig:

- draing
- størrelsesendring
- direkte tekstredigering
- bildevelger
- knapphandling

### Tekst

- `Tekst` oppretter senere en tekstboks.
- Tekstboksen kan vokse med innholdet, men elementboksen vokser ikke automatisk.
- Brukeren skal kunne skrive, markere, rette og slette tekst.
- Markert tekst skal kunne endre font, størrelse, farge, fet og kursiv.
- Innhold utenfor elementboksen skjules.
- Tekstredigering må ha en egen modus slik at Enter og mellomrom ikke alltid tolkes som elementmarkering.

### Bilder

- åpne bildevelger på PC
- legge bildet inn på lerretet
- bildet er et selvstendig objekt
- flytte og endre størrelse separat
- bildet festes ikke automatisk til elementet det ligger over
- bildet kan låses

### Knapper

- Elementer-panelet inneholder `Knapp`.
- Knappen skal kunne ha redigerbar tekst, størrelse, plassering, bakgrunn, tekstfarge og ramme.
- Handling eller lenketype fastsettes før implementering.
- En knapphandling skal ikke aktiveres mens brukeren bare markerer knappen i editoren.

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
- samme prosjektendringsmodell som angre/gjør om
- markeringsstate og annen transient UI-state skal ikke lagres
- serverlagring er ikke nødvendig i første lokale versjon

## 7. Arkitektur og arbeidsmåte

- hver funksjon bygges i egen branch
- `main` holdes stabil
- kildefiler bør være under 300 linjer og deles tidligere ved flere ansvar
- `App.tsx` setter bare sammen hovedstrukturen
- prosjektmodell, transient editor-state og visuelle komponenter skal ikke blandes
- Dependency Cruiser stopper sirkulære, uløselige og utilgjengelige moduler
- arkitekturrapporter regenereres etter strukturendringer
- PowerShell-kommandoer følger hver repoendring

## 8. Planlagte branches

- `feature/element-selection` — gjeldende, klar for sluttkontroll
- `feature/element-creation` — neste etter merge
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

- standard- og minimumsstørrelse for hvert element
- startposisjon og eventuell forskyvning mellom nye elementer
- plassering av Nytt prosjekt og Importer prosjekt
- plassering av Farger, Logo/header og Fonts
- endelig fontliste og fontstørrelser
- scope for fontendringer
- tekstjustering og linjehøyde
- mobile overstyringer i første versjon
- endelig mobilbrytepunkt
- markering av element som er skjult i aktiv mobilvisning
- fri eller proporsjonal størrelsesendring
- låsefunksjonens plassering og utforming
- måling og terskler for lik avstand og sentrering
- knappens handlinger og lenketyper
- prosjektfilformat og lagringsintervall
- sikker skriving og gjenoppretting
- publiseringsarkitektur og eventuell senere backend
