# Plan for Website-editoren

Dette dokumentet viser implementert grunnlag, aktiv produksjonsfase og senere leveransekandidater.

## Gjeldende status

```text
siste fullførte produksjonsfase på main: 13 – Logo og header
aktiv produksjonsfase: 14 – korrigeringslinjer og snapping
aktiv branch: feature/alignment-guides
base origin/main: ff39d8df7d59843c796616ad7d56cf00a41236f8
GitHub-sak: #34 – åpen
pull request: ikke opprettet
prosjektskjema: versjon 9
fase-14-implementasjon: til stede
manuell kontroll: delvis godkjent
framtidsrettet audit: gjennomført, ett Header-layoutavvik rettet
automatisk sluttkontroll etter audit: gjenstår
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

## Menystruktur

```text
Prosjekt
Farger
Logo og header
Elementer
Innstillinger
```

```text
Venstremeny = opprette elementer, velge fil/design og vise prosjektoversikt
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere innhold og transformere elementer
Ressurslag = eie transient fil og Object URL
Prosjekt   = eie serialiserbare verdier
```

## Header

Header er én egen sammensatt elementtype, ikke en gruppe av Seksjon, Bilde og Tekst.

Oppretting:

- navn på nettsted eller firma
- valgfri undertittel
- lokal PNG-, JPEG- eller WebP-logo
- eksisterende bildevalidering og ressurslager gjenbrukes
- Header opprettes først når tekst og fil er gyldige
- vellykket oppretting overfører eierskap til logoressursen før lokal UI-opprydding

Oppførsel:

- full synlig sidebredde i PC og Telefon
- fast posisjon `x = 0, y = 0`
- ingen peker- eller tastaturflytting
- høyde 70–100 px, standard 88 px
- markering og sikker sletting som ett element
- ingen låseknapp eller låsestatus
- låsereduceren avviser Header

Utseende:

- bakgrunn
- felles tekstfarge for navn og undertittel
- én fontfamilie for navn og undertittel
- fontstørrelse 12–96 px, standard 24 px
- undertittelen beholder et mindre typografisk hierarki
- ramme `Ingen` eller 1–10 px
- rammefarge vises i `Farger` når rammen er aktiv

## Fase 14 – korrigeringslinjer og snapping

Omfang:

- bare pekerflytting; resize og tastatur snapping er utsatt
- Seksjon, Bilde, Tekst og Knapp kan flyttes og snappe på begge akser
- Header kan ikke flyttes, men kan brukes som snapmål
- andre synlige elementer gir venstre/midt/høyre og topp/midt/bunn
- lerretet gir horisontal og vertikal midtlinje
- snapgrense er 6 px i lerretskoordinater
- nærmeste treff velges separat per akse
- midtanker vinner ved lik avstand
- guider vises bare mens snap er aktiv
- låste elementer kan være mål
- skjulte elementer og aktivt element er ikke mål
- mål fryses ved pekerstart
- auto-scroll, pointer capture, commit og cancel følger eksisterende transformmodell
- ingen prosjektdata eller innstilling lagres for guider

Manuelt godkjent:

- justering mot elementkanter og midtpunkter
- horisontal og vertikal lerretsmidt
- samtidig snapping på begge akser

Gjenstående før PR:

- komplett mål- og elementtyperegresjon
- cancel/lost capture og auto-scroll
- bekrefte uendret resize- og tastaturoppførsel
- clamp ved grensene
- filstørrelseskontroll
- full automatisk kontroll etter siste auditrettelse
- oppdatert diff- og PR-kontroll

## Responsiv retning

- Telefon arver desktopgeometri når mobiloverstyring mangler.
- Header følger alltid aktiv lerretsbredde og fast topposisjon.
- Headerens høyde er foreløpig felles for PC og Telefon.
- Egne mobiloverstyringer bygges først i en senere, eksplisitt valgt fase.
- Alignment-mål beregnes fra aktiv viewport og fryses ved pekerstart.

## Senere fasekandidater

```text
fase 15  responsive mobiloverstyringer
fase 16  angre og gjør om
fase 17  lokal automatisk lagring
fase 18  åpne og importere prosjekt
fase 19  forhåndsvisning og publisering
```

Roadmapet gjennomgås etter kontroll av fase 14. Hero er ikke registrert som egen leveranse i dagens plan og skal vurderes eksplisitt i den gjennomgangen, ikke legges inn som en skjult del av en annen fase.
