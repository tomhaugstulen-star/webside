# Plan for Website-editoren

Dette dokumentet oppsummerer produktretningen, implementert grunnlag, leveransestatus og den låste videre rekkefølgen.

Detaljert faseomfang og akseptansekriterier ligger i `docs/WORK_PLAN.md`.

## Produktdefinisjon

Website-editoren skal være en komplett lokal arbeidsportal på brukerens egen PC.

Portalen skal brukes til å:

- opprette og vedlikeholde nettsideprosjekter
- administrere sider, seksjoner, Header, Hero og elementer
- navigere raskt mellom prosjektinnhold og verktøy
- lagre og sikkerhetskopiere prosjekter lokalt
- forhåndsvise nettsiden lokalt
- bruke OpenAI som kontrollert meddesigner i siste hovedfase

Offentlig publisering, hosting, domener og produksjonsdeployment er fjernet fra produktplanen.

## Gjeldende status

```text
siste fullførte produksjonsfase på main: 14 – korrigeringslinjer og snapping
main mergecommit: 0122605b60808689cdda7cb1601eb3342680f88c
source branch-head: 28da295d938d4384c8f3cfa2f3b8a72d4a2e1bb4
GitHub-sak #34: lukket som fullført
pull request #39: merget
prosjektskjema: versjon 9
framtidsrettet kodeaudit: fullført
automatisk sluttkontroll: bestått
filstørrelseskontroll: bestått
manuell fase-14-regresjon: fullført og godkjent
lokal main: synkronisert og clean på 0122605
aktiv produksjonsfase: ingen
neste planlagte fase: 15 – duse portalfarger og tydelig visuell struktur
fase 15: ikke startet
```

## Implementert editorgrunnlag

- blankt PC- og Telefon-lerret
- toppmeny, venstremeny og høyremeny
- Seksjon, Bilde, Tekst, Knapp og Header
- stabil prosjektmodell med sentral state
- markering, flytting og størrelsesendring
- låsing for Seksjon, Bilde, Tekst og Knapp
- kontrollert tekstredigering og eksterne lenker
- sikker sletting
- bundlet SVG-knappbibliotek
- lokal bilde- og logoimport
- transient ressurslager med kontrollert Object URL-livssyklus
- bildeutsnitt, zoom, alternativ tekst og metadata
- side- og elementfarger
- Seksjon- og Header-ramme
- korrigeringslinjer og snapping ved pekerflytting

## Gjeldende portalstruktur

```text
Prosjekt
Farger
Logo og header
Elementer
Innstillinger
```

Gjeldende ansvarsdeling:

```text
Venstremeny = opprette elementer, velge fil/design og vise prosjektoversikt
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere innhold og transformere elementer
Ressurslag = eie transient fil og Object URL
Prosjekt   = eie serialiserbare verdier
```

Portalstrukturen skal utvides i fase 18 med oversikt, sider/navigasjon, Hero/seksjoner, filer/bilder, navigator og hurtigsøk.

## To separate navigasjonssystemer

### Arbeidsportalens navigasjon

Brukes for å finne:

- prosjekter
- sider
- elementer
- paneler
- verktøy
- innstillinger
- senere AI-assistent

Denne navigasjonen er editor-UI og inngår ikke i nettsideprosjektets innhold.

### Nettsidens navigasjon

Vises i nettstedets Header og lagres som prosjektdata.

Den skal senere støtte:

- interne sider
- seksjoner
- eksterne lenker
- aktivt menypunkt
- handlingsknapp
- ett nivå med undermeny
- horisontal meny
- kompakt rullegardin/hamburgermeny
- automatisk responsiv meny

## Header

Header er én egen sammensatt elementtype.

Gjeldende oppførsel:

- navn på nettsted eller firma
- valgfri undertittel
- lokal PNG-, JPEG- eller WebP-logo
- full synlig sidebredde
- fast posisjon `x = 0, y = 0`
- ingen peker- eller tastaturflytting
- høyde 70–100 px, standard 88 px
- markering og sikker sletting som ett element
- ingen låsing eller låsestatus
- bakgrunn, tekstfarge, fontfamilie, fontstørrelse og ramme

Senere Header-leveranser bygger:

- nettstedets menynavigasjon
- automatisk, horisontal eller kompakt meny
- redigering av logo, navn og undertittel etter oppretting
- nettstednivå kontra sidenivå

## Fase 14 – korrigeringslinjer og snapping

Fase 14 er fullført og merget til `main`.

Levert:

- bare pekerflytting bruker snapping; resize- og tastatursnapping er utsatt
- Seksjon, Bilde, Tekst og Knapp kan flyttes og snappe på begge akser
- Header kan ikke flyttes, men kan brukes som snapmål
- andre synlige elementer gir venstre/midt/høyre og topp/midt/bunn
- lerretet gir horisontal og vertikal midtlinje
- snapgrensen er 6 px i lerretskoordinater
- nærmeste treff velges separat per akse
- midtanker vinner ved lik avstand
- guider vises bare mens snap er aktivt
- låste synlige elementer kan være mål
- skjulte elementer og aktivt element er ikke mål
- mål og lerretsmål fryses ved pekerstart
- alignmentdata lagres ikke i prosjektet
- auto-scroll, clamping, pointercancel og tapt pointer capture er kontrollert
- Header er fast ved `x = 0, y = 0`
- Header-fontstørrelse er varig og validert fra 12 til 96 px

Slutt-auditen fjernet overflødig Header- og previewlogikk, normaliserte Header-layout før validering og reduserte importgrafen med én avhengighet.

Verifisert automatisk kontroll på `28da295`:

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

Manuell regresjon ble fullført og godkjent i PC- og Telefon-visning, inkludert alle flyttbare elementtyper, låste mål, Header, lerretsmidt, auto-scroll, clamping, resize og tastatur uten snapping samt målrettet Header-regresjon etter slutt-auditen.

Leveransereferanser:

```text
GitHub-sak: #34 – lukket
pull request: #39 – merget
mergecommit: 0122605b60808689cdda7cb1601eb3342680f88c
```

## Hero

Hero er nå låst som en egen senere hovedleveranse og skal ikke falle ut av planen igjen.

Første planlagte retning:

- egen sammensatt `HeroEditorElement`
- full bredde som standard
- plassert under Header som standard
- bakgrunnsbilde eller bakgrunnsfarge
- kontrollert bildeutsnitt
- valgfritt fargeoverlegg
- hovedoverskrift og undertittel
- én eller to knapper
- interne og eksterne lenker
- tekstjustering og maksimal tekstbredde
- dokumentert PC- og Telefon-oppførsel

Endelig Hero-modell låses før fase 21 starter.

## Visuell portalretning

Portalen skal få dempede, harmoniske farger som skiller:

- toppmeny
- venstremeny
- åpent venstrepanel
- høyrepanel
- arbeidsområde
- nettsidelerret
- aktive og valgte tilstander

Dette er editorutseende og skal ikke endre nettsideprosjektets egne farger.

## Lokal drift og data

Planen beholder:

- flere lokale prosjekter
- prosjektoversikt
- autolagring
- manuell lagring
- snapshots
- krasjgjenoppretting
- sikkerhetskopi til prosjektfil
- kontrollert import og migrering
- lokal fullskjermsforhåndsvisning

Planen inneholder ikke offentlig publisering.

## OpenAI

OpenAI bygges etter at prosjektmodell, navigasjon, Hero, historikk, lagring, import og forhåndsvisning er stabile.

Planlagt bruk:

- tekst og omskriving
- fargepaletter og designinspirasjon
- bildegenerering til valgte felt
- Hero-generator
- seksjonsgenerator
- side- og navigasjonsforslag
- komplette sideutkast
- konsistenskontroll

AI-flyt:

```text
Forslag
  -> validering
  -> forhåndsvisning
  -> eksplisitt godkjenning
  -> typede actions/reducere
  -> én historikkhandling
```

API-nøkkel skal ikke ligge i Vite- eller browserkode. En lokal sikker server-side grense brukes når fasen starter.

## Låst videre rekkefølge

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

Rekkefølgen endres ikke uten eksplisitt produktbeslutning og synkronisert dokumentasjon.

## Eksplisitt utsatt eller fjernet

Utsatt uten egen fase:

- snapping ved resizing
- snapping ved tastatur
- grid
- avstandsmål
- automatisk fordeling
- flermerking og gruppering
- flere mobile brytepunkter
- nettbrett som egen viewport
- automatisk kollisjonsunngåelse
- AI-generert mobiloppsett
- generell CSS-editor
- mer enn ett undermenynivå

Fjernet fra produktplanen:

- offentlig publisering
- hosting
- domener
- deployment
