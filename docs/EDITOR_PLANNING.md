# Plan for Website-editoren

Dette dokumentet viser implementert grunnlag, aktiv fase og senere leveranser.

## Gjeldende status

```text
aktiv fase: 13 – Logo og header
branch: feature/logo-header
GitHub-sak: #31
prosjektskjema: versjon 8
manuell funksjonstest: godkjent
sluttaudit og dokumentasjon: pågår
PR: ikke opprettet
```

## Implementert editorgrunnlag

- blankt PC- og Telefon-lerret
- toppmeny, venstremeny og høyremeny
- Seksjon, Bilde, Tekst, Knapp og Header
- stabil prosjektmodell med sentral state
- markering, flytting, størrelsesendring og låsing
- kontrollert tekstredigering og eksterne lenker
- sikker sletting
- bundlet SVG-knappbibliotek
- lokal bilde- og logoimport
- transient ressurslager med kontrollert Object URL-livssyklus
- bildeutsnitt, zoom, alternativ tekst og metadata
- side- og elementfarger
- Seksjon- og Header-ramme

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

## Fase 13 – Logo og header

Header er én egen sammensatt elementtype, ikke en gruppe av Seksjon, Bilde og Tekst.

Oppretting:

- navn på nettsted eller firma
- valgfri undertittel
- lokal PNG-, JPEG- eller WebP-logo
- eksisterende bildevalidering og ressurslager gjenbrukes
- Header opprettes først når tekst og fil er gyldige

Oppførsel:

- full synlig sidebredde i PC og Telefon
- horisontal plassering og bredde er faste
- bare vertikal flytting
- høyde 70–100 px, standard 88 px
- markering, låsing og sletting som ett element
- egenskapspanel kan lukkes under transform og åpnes fra objektverktøyet

Utseende:

- bakgrunn
- felles tekstfarge for navn og undertittel
- én font for navn og undertittel
- ramme `Ingen` eller 1–10 px
- rammefarge vises i `Farger` når rammen er aktiv

## Responsiv retning

- Telefon arver desktopgeometri når mobiloverstyring mangler.
- Header følger alltid aktiv lerretsbredde.
- Header y og høyde er foreløpig felles for PC og Telefon.
- Egne mobiloverstyringer bygges først i fase 15.

## Gjenstående før fase 13 kan merges

- avsluttende kodeopprydding
- framtidsrettet audit
- ny full automatisk kontroll
- nye arkitekturrapporter
- filstørrelseskontroll
- oppdatert dokumentasjon
- PR-kontroll
- eksplisitt mergegodkjenning

## Senere faser

```text
fase 14  korrigeringslinjer
fase 15  responsive mobiloverstyringer
fase 16  angre og gjør om
fase 17  lokal automatisk lagring
fase 18  åpne og importere prosjekt
fase 19  forhåndsvisning og publisering
```

Åpne beslutninger for senere faser låses først når den aktuelle fasen starter. De skal ikke bygges inn i fase 13.
