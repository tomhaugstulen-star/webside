# Høyremenyens struktur

Dette dokumentet beskriver høyremenyens produktoppførsel og ansvar.

## Oppførsel

```text
Ingenting valgt -> ingen høyremeny
Element valgt   -> panelet kan åpnes
Tomt lerret     -> markering og panel lukkes
Transform       -> panelet lukkes for å frigjøre lerretet
Egenskaper      -> objektverktøyet åpner panelet igjen
```

- bredde 320 px
- dokket ved minst 1680 px
- overlay fra høyre under 1680 px
- egen vertikal scrolling
- 180 ms animasjon
- `prefers-reduced-motion` respekteres
- låsbare elementer kan inspiseres når de er låst, men ikke muteres
- Header er ikke låsbar og viser ikke låsestatus

Markering og panelåpen tilstand er separate transiente UI-verdier. Panelet eier ingen kopi av elementet.

## Ansvar

```text
Venstremeny = opprette elementer og velge fil/design
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere og transformere
Ressurslag = eie fil og Object URL
Prosjekt   = eie serialiserbare verdier
```

Panelet:

- oppretter ikke elementer
- leser ikke prosjektdata fra DOM
- muterer ikke prosjektdata direkte
- eier ikke `File`, Blob eller Object URL
- serialiseres ikke

Varige endringer sendes gjennom typede hooks og reducerhandlinger.

## Panelstruktur

```text
Seksjon -> Ramme -> Element
Bilde   -> Bilde -> Element
Tekst   -> Tekstutseende -> Lenke -> Element
Knapp   -> Knapp -> Lenke -> Element
Header  -> Font -> Ramme -> Element
```

Felles `Element`-seksjon viser sikker sletting. Låsestatus vises bare for Seksjon, Bilde, Tekst og Knapp.

## Seksjon og Header-ramme

- tykkelse `Ingen` eller 1–10 px
- rammefarge beholdes når tykkelsen settes til `Ingen`
- kontrollen er deaktivert for låst Seksjon
- Header-kontrollen er aktiv fordi Header ikke kan låses
- reduceren avviser ugyldige og uendrede handlinger
- Seksjon og Header bruker samme generelle rammeverdier og validering

Bakgrunn og tekstfarge endres i `Farger`, ikke som parallelle verdier i høyremenyen.

## Header

Markert Header viser:

- font for navn og undertittel
- rammetykkelse og rammefarge
- sikker sletting

Header viser ikke låseknapp eller `Låst/Ulåst`. Headerens innhold, logo, bakgrunn og tekstfarge redigeres ikke fra en separat lokal panelkopi. Fase 13 har ikke en funksjon for å bytte logo eller tekst etter oppretting.

## Bilde

Markert Bilde viser:

- alternativ tekst
- `Hele bildet` eller `Juster utsnitt`
- zoom og reset ved crop
- filmetadata og ressursstatus
- sikker sletting

Bilderamme og motiv redigeres på lerretet. Panelet eier ikke pekerpreview.

## Tekst og Knapp

Tekst viser font, størrelse, stil, justering, linjehøyde og lenke. Tekstinnhold redigeres på lerretet.

Knapp viser knappetekst, design og lenke. Asset-ID valideres mot det bundlete biblioteket.

## Tilgjengelighet

- paneloverskrift kobles med `aria-labelledby`
- felt har labels og synlig fokus
- feil bruker `role="alert"`
- status bruker `role="status"`
- låste kontroller er deaktivert for låsbare elementer
- redusert bevegelse respekteres

## Arkitekturgrense

- `RightPropertiesPanel.tsx` forblir komposisjon
- elementspesifikke kontroller ligger i egne filer
- panelet skal ikke eie import, ressurslager, historikk eller autolagring
- viewport-spesifikke mobilverdier skal senere håndteres i state-laget
