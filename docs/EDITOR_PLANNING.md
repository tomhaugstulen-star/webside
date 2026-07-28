# Plan for Website-editoren

Dette dokumentet samler bekreftede produktkrav, implementert grunnlag og åpne beslutninger.

## 1. Implementeringsstatus

### Ferdig og merget til `main`

- blankt, hvitt desktop- og mobillerret
- toppmeny og venstremeny
- kontrollert paneloppførsel
- Elementer-panel med Seksjon, Bilde, Tekst og Knapp
- prosjekt- og elementmodell
- stabile kryptografiske ID-er
- responsive posisjons-, størrelses- og synlighetsverdier
- sentral prosjekt-state og aktiv side
- transient elementmarkering
- oppretting av alle fire elementtypene
- kontrollerte startstørrelser og første ledige startplass
- automatisk markering av nytt element
- avledet lerretshøyde
- flytting og resizing med peker og tastatur
- minimumsmål, clamping, edge-scroll og transient preview
- Dependency Cruiser og samlet `npm run check`

### Implementert i `feature/object-locking`

- egen objektverktøylinje over valgt element
- åpen og lukket hengelås
- varig `locked`-mutasjon gjennom reduceren
- låseverdi beregnes fra reducerens nyeste state
- låst element beholder markeringen
- stiplet markering for låst element
- resize-håndtak skjules når låst
- peker- og tastaturtransform blokkeres
- låseknappen er tastaturtilgjengelig
- pointer-propagation fra verktøylinjen stoppes
- låsestatus er felles for PC og Telefon

Visuelt godkjent på PC og Telefon før siste kodeaudit. Siste tastaturretting må gjennom ny lokal sluttkontroll før PR.

### Neste fase etter merge

```text
feature/text-box-editing
```

Denne fasen skal bygge direkte tekstredigering og et tydelig skille mellom objektmarkering og innholdsredigering. Bilder, knappehandlinger, historikk, lagring og mobiloverstyringer skal ikke blandes inn.

## 2. Bekreftede hovedkrav

### Blank startside

- En ny side åpner helt blank.
- Ingen ferdige seksjoner, tekst, bilder eller farger opprettes automatisk.
- Elementoppretting skjer bare etter en eksplisitt brukerhandling.
- Omlasting gir foreløpig blank side fordi lagring ikke er implementert.

### Autoritativ prosjektmodell

- `EditorProject` er autoritativ kilde for varige prosjektdata.
- DOM-en er bare rendering, ikke permanent lagring.
- Elementer, geometri, innhold og låsestatus endres gjennom prosjekt-state/reduceren.
- State-avhengige prosjektberegninger bruker reducerens nyeste state.
- ID og klokkeslett genereres før dispatch slik at reduceren er deterministisk.
- `updatedAt` endres bare ved gyldig prosjektmutasjon.

### Transient state

Følgende skal ikke serialiseres, publiseres eller lagres:

- `selectedElementId`
- aktiv pointer-interaksjon
- layout-preview under draing eller resizing
- fokus, hover og synlighet for objektverktøylinjen
- framtidig redigeringsmodus dersom den bare er UI-state

Når historikk og autolagring bygges, skal én ferdig brukerhandling behandles som én eksplisitt prosjektendring.

### Desktop og mobil

- Prosjektmodellen bruker desktopverdi med valgfri mobilverdi.
- Mobilvisning bruker mobilverdi når den finnes og ellers desktopverdi.
- Nye elementer har foreløpig bare desktopgeometri.
- I dagens UI redigerer PC og Telefon den delte desktopgeometrien.
- Egne mobiloverstyringer bygges eksplisitt i `feature/mobile-design-controls`.
- En mobilendring skal senere aldri endre desktopverdien utilsiktet.
- Låsestatus er felles for PC og Telefon.

## 3. Elementer

### Startstørrelser

- Seksjon: 320 × 180 px
- Bilde: 240 × 160 px
- Tekst: 240 × 96 px
- Knapp: 160 × 48 px

### Minimumsstørrelser

- Seksjon: 160 × 90 px
- Bilde: 120 × 80 px
- Tekst: 120 × 48 px
- Knapp: 80 × 36 px

### Opprettingsplassering

- start ved x 24 px
- første ledige vertikale gap
- minst 16 px avstand ved oppretting
- eksisterende elementer flyttes aldri automatisk
- regelen gjelder bare elementets fødested

Se `docs/ELEMENT_CREATION.md`.

### Flytting og resizing

- elementer kan overlappe
- ingen automatisk kollisjonsunngåelse
- elementet holdes innenfor venstre, høyre og øvre lerretskant
- det finnes ingen fast nedre grense
- lerretet forlenges automatisk nedover
- ett resize-håndtak vises på valgt og ulåst element
- synlig håndtak er 16 × 16 px
- treffflaten er 32 × 32 px
- innhold utenfor elementgrensen klippes

Pekerregler:

- pointer capture brukes under interaksjonen
- scrollforskyvning inngår i deltaet
- preview er transient
- normalt slipp committer én gang
- cancel eller tapt capture committer ikke

Tastaturregler:

- piltaster flytter 1 px
- `Shift` + piltast flytter 10 px
- `Ctrl`/`Cmd` + piltast endrer størrelse 1 px
- `Ctrl`/`Cmd` + `Shift` + piltast endrer størrelse 10 px

Se `docs/DRAG_RESIZE.md`.

### Låsing

Implementert:

- valgt element får en separat objektverktøylinje
- åpen hengelås låser elementet
- lukket hengelås låser opp elementet
- låst element beholder markeringen
- låst element får stiplet markeringsramme
- resize-håndtaket skjules
- peker- og tastaturtransform blokkeres
- låseknappen starter ikke flytting eller fjerner markering
- piltaster på låst element utløser ikke utilsiktet scrolling

Arkitekturregler:

- `locked` er varig elementdata
- neste låseverdi beregnes i reduceren fra nyeste state
- ukjent element-ID ignoreres
- gyldig endring oppdaterer `updatedAt`
- reduceren forblir autoritativ for transformblokkering
- objektverktøylinjens fokus og synlighet er transient UI-state

Se `docs/OBJECT_LOCKING.md`.

### Tekst

- `Tekst` er foreløpig en nøytral plassholder.
- Direkte tekstredigering bygges i egen modus.
- Objektmarkering og innholdsredigering må skilles tydelig.
- Innhold utenfor elementboksen klippes.
- Låst tekstboks skal ikke gå inn i redigeringsmodus.
- Tastaturkommandoer for objektet må deaktiveres mens tekstinnhold redigeres.

Før implementering må dette fastsettes:

- hvordan redigeringsmodus startes og avsluttes
- Enter-regel
- første fontliste og fontstørrelsesliste
- om formatering gjelder hele boksen eller markert tekst
- commit-grense for tekstendringer
- hvordan tom tekst behandles

### Bilder

- `Bilde` er foreløpig en nøytral plassholder.
- Ekte bildeinnhold og bildevelger er ikke implementert.
- Bildet skal være et selvstendig objekt med egen geometri og låsestatus.

### Knapper

- `Knapp` er foreløpig en nøytral representasjon uten handling.
- Senere skal tekst, farger, ramme og handling kunne redigeres.
- Faktisk knapphandling skal ikke aktiveres i vanlig editormodus.

## 4. Korrigerings- og hjelpesystem

Senere krav:

- horisontal midtstilling
- elementer på samme linje
- lik avstand mellom tre eller flere elementer
- vises bare under flytting eller resizing
- ingen usynlig automatisk flytting
- ingen generell kollisjonsunngåelse

Planlagt branch: `feature/alignment-guides`.

## 5. Farger, logo/header og fonts

### Farger

- panelet skal vise faktiske prosjektfarger
- ingen ferdig fargepalett
- global endring skal oppdatere alle elementer som bruker fargen

### Logo/header

- laste opp logo
- opprette header
- hovedtekst og undertittel
- redigerbar struktur

### Fonts

- omtrent 7–8 nettsikre fonter
- fontstørrelse fra kontrollert liste
- fontfarge registreres senere i fargesystemet
- fet og kursiv vurderes i første tekstversjon

## 6. Lokal automatisk lagring

- prosjektet lagres i egen mappe på brukerens PC
- prosjektdata og bilder lagres lokalt
- automatisk lagring uten manuell lagreknapp per endring
- statusene `Lagrer`, `Lagret` og `Lagringsfeil`
- sikker skriving og gjenoppretting
- samme prosjektendringsgrense som historikksystemet
- transient markering, pointer-preview og verktøylinjefokus skal ikke lagres

## 7. Arkitektur og arbeidsmåte

- én avgrenset funksjon per branch
- `main` holdes stabil
- 250 linjer er aktiv terskel for ansvarstrekk
- `App.tsx` komponerer bare hovedstrukturen
- prosjektmodell, transient state, hendelseslogikk og visning holdes separat
- reducer-actions håndteres uttømmende
- ugyldige og uendrede state-overganger avvises
- pointer-transform, edge-scroll og objektverktøylinje er separate ansvar
- Dependency Cruiser kontrollerer modulgrensene
- arkitekturrapporter regenereres etter strukturendringer

## 8. Planlagte branches

- `feature/object-locking` — gjeldende, auditendring må sluttkontrolleres
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

- start og avslutning av tekstredigeringsmodus
- Enter-regel og tom tekst
- formatering av hele tekstboksen kontra markert tekst
- sletting og bekreftelsesregel
- endelig mobilbrytepunkt
- hvilke egenskaper som kan overstyres på mobil
- sammenslåing av gjentatte tastatur- og tekstendringer i historikk
- endelig fontliste og fontstørrelser
- tekstjustering og linjehøyde
- knappens handlinger og lenketyper
- prosjektfilformat og lagringsintervall
- sikker skriving og gjenoppretting
- publiseringsarkitektur
