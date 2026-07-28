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
- markering av eksisterende elementer
- transient valgt element-ID
- klikk på tomt lerret fjerner markering
- tastaturmarkering med Tab, Enter og mellomrom

### Implementert i `feature/element-creation`

- opprette Seksjon, Bilde, Tekst og Knapp fra Elementer-panelet
- legge elementet til aktiv side gjennom reduceren
- sikker element-ID og oppdatering av `updatedAt`
- automatisk markering av det nye elementet
- kontrollerte standardstørrelser
- første ledige startplass med 16 px avstand
- ingen direkte overlapping ved oppretting
- automatisk utvidelse av lerretshøyden
- blank side før første eksplisitte oppretting
- desktopverdi med mobil arv
- nøytral editorrepresentasjon for alle fire elementtypene
- sidebar-CSS delt etter ansvar

Visuelt godkjent på desktop og mobil. Siste kodeaudit og dokumentoppdateringer må gjennom sluttkontroll før PR.

### Neste fase etter merge

```text
feature/drag-resize
```

Denne fasen skal bare bygge flytting og størrelsesendring av eksisterende elementer. Låsing, direkte tekstredigering, bilder, historikk og lagring skal ikke blandes inn.

## 2. Bekreftede hovedkrav

### Blank startside

- En ny side åpner helt blank.
- Editorgrensesnittet kan være synlig, men nettsiden skal ikke inneholde ferdige seksjoner, tekst, bilder eller farger.
- Objektverktøy, låseknapp og drahåndtak vises først når et faktisk objekt finnes og er markert.
- Elementoppretting skjer bare etter en eksplisitt brukerhandling.
- Omlasting gir foreløpig blank side fordi lagring ikke er implementert.

### Autoritativ prosjektmodell

- `EditorProject` er autoritativ kilde for prosjektdata.
- DOM-en skal ikke brukes som permanent lagring.
- Nye elementer opprettes gjennom prosjekt-state/reducer og legges til aktiv side.
- Element-ID-er er kryptografiske og stabile.
- State-avhengige prosjektberegninger bruker reducerens nyeste state.
- UI-hooks sender intensjon, sikker ID og tidspunkt, men beregner ikke varig resultat fra et mulig utdatert React-snapshot.

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
- Prosjektmodellen har `ResponsiveValue<T>` med desktopverdi og valgfri mobilverdi.
- Lerretsrenderingen bruker mobilverdi når den finnes og ellers desktopverdien.
- Viewport-unionen har én autoritativ definisjon i prosjektmodellen.
- Nye elementer er foreløpig desktop-autoritative og mobil arver samme verdier.
- Standardstørrelsene passer innenfor 390 px mobilvisning ved startpunkt x 24 px.
- Brukergrensesnitt for arv, overstyring og skjuling er ikke implementert ennå.
- Ferdig forhåndsvisning og eksport skal bruke kontrollerte media queries.
- Når mobilskjuling bygges, må det avklares om et skjult element skal miste markeringen i aktiv visning.
- Viewport-bevisst oppretting vurderes i `feature/mobile-design-controls`.

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

Elementer-panelet inneholder:

- Seksjon
- Bilde
- Tekst
- Knapp

Valg av et elementkort oppretter elementet og lukker panelet.

### Planlagte prosjektfunksjoner

- Nytt prosjekt
- Importer prosjekt
- Farger
- Logo/header
- Fonts

Endelig plassering er ikke fastsatt.

## 4. Elementer og innhold

### Elementboks

Et element er et selvstendig objekt i prosjektmodellen.

Bekreftede regler:

- nytt element skal være stort nok til at framtidig håndtak er lett å bruke
- ett tydelig, firkantet håndtak nederst til høyre
- elementets høyde øker ikke automatisk på grunn av tekst
- innhold utenfor elementets grenser klippes
- klikk utenfor avslutter redigering og beholder størrelse/plassering
- rammetykkelse: ingen, 1 px, 2 px, 3 px og 4 px
- rammefarge registreres i Farger-systemet
- elementer kan overlappe
- valgt element eller bilde kan låses og låses opp

### Elementoppretting

Implementerte startstørrelser:

- Seksjon: 320 × 180 px
- Bilde: 240 × 160 px
- Tekst: 240 × 96 px
- Knapp: 160 × 48 px

Implementert startplassering:

- x 24 px og første ledige vertikale gap
- minimum 16 px avstand ved oppretting
- eksisterende elementer flyttes aldri automatisk
- lerretet utvides ved behov

Plasseringsregelen gjelder bare når elementet opprettes. Den skal ikke brukes som kollisjonskontroll under draing.

Se `docs/ELEMENT_CREATION.md`.

### Flytting og størrelsesendring

Neste branch skal bygge:

- flytting av valgt element
- ett firkantet håndtak nederst til høyre
- minimumsstørrelse per elementtype
- størrelsesendring gjennom prosjekt-state/reducer
- klipping av innhold
- scrolling under interaksjonen dersom nødvendig

Skal ikke bygges samtidig:

- kollisjonsunngåelse
- korrigeringslinjer
- låsing
- tekstredigering
- historikk
- lagring

### Tekst

- `Tekst` oppretter nå en nøytral tekstplassholder.
- Direkte tekstinnhold er ikke implementert.
- Tekstboksen kan senere vokse med innholdet, men elementboksen vokser ikke automatisk.
- Brukeren skal kunne skrive, markere, rette og slette tekst.
- Markert tekst skal kunne endre font, størrelse, farge, fet og kursiv.
- Innhold utenfor elementboksen skjules.
- Tekstredigering må ha en egen modus slik at Enter og mellomrom ikke alltid tolkes som elementmarkering.

### Bilder

- `Bilde` oppretter nå en nøytral bildeplassholder.
- Ekte bildeinnhold og bildevelger er ikke implementert.
- bildet skal senere være et selvstendig objekt
- flytte og endre størrelse separat
- bildet festes ikke automatisk til elementet det ligger over
- bildet kan låses

### Knapper

- `Knapp` oppretter nå en nøytral knapprepresentasjon uten handling.
- Knappen skal senere kunne ha redigerbar tekst, størrelse, plassering, bakgrunn, tekstfarge og ramme.
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
- 250 linjer er aktiv terskel for uttrekking av ansvar fra kildefiler
- `App.tsx` setter bare sammen hovedstrukturen
- prosjektmodell, transient editor-state og visuelle komponenter skal ikke blandes
- state-avhengige mutasjoner bruker nyeste reducer-state
- union-baserte switcher håndteres uttømmende
- responsive viewport-typer har én autoritativ definisjon
- Dependency Cruiser stopper sirkulære, uløselige og utilgjengelige moduler
- arkitekturrapporter regenereres etter strukturendringer
- PowerShell-kommandoer følger hver repoendring

## 8. Planlagte branches

- `feature/element-creation` — gjeldende, klar for siste kontroll etter audit
- `feature/drag-resize` — neste etter godkjent merge
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

- minimumsstørrelse per elementtype
- om elementer kan flyttes delvis utenfor lerretet
- pekerfangst og scrolling under draing
- mobiloppførsel for drag/resize før egne mobiloverstyringer finnes
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
