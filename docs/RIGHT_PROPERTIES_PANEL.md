# Høyremenyens struktur og egenskaper

Dette dokumentet beskriver høyremenyens autoritative produktoppførsel, arkitektur og elementkontroller.

## 1. Låst produktoppførsel

```text
Ingenting valgt -> ingen høyremeny
Element valgt   -> høyremeny åpnes
Tomt lerret     -> høyremeny lukkes
```

- bredde 320 px
- dokket ved minst 1680 px
- overlay fra høyre under 1680 px
- overlay reduserer ikke lerretsbredden
- skjult panel reserverer ingen plass
- egen vertikal scrolling
- 180 ms transform-animasjon
- animasjon deaktiveres ved `prefers-reduced-motion`
- låst element kan markeres og inspiseres

## 2. Fast ansvarsdeling

```text
Venstremeny = opprette elementer, velge fil/design og vise prosjektoversikt
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere innhold og transformere elementer
Ressurslag = eie transient bildefil og Object URL
Prosjekt   = eie serialiserbare verdier
```

Panelet:

- oppretter ikke elementer
- eier ingen separat elementkopi
- leser ikke prosjektdata fra DOM-en
- muterer ikke prosjektdata direkte
- eier ikke `File`, Blob eller Object URL
- serialiseres ikke

Varige endringer sendes som typede intensjoner til state-laget.

## 3. Panelstruktur

```text
Egenskaper
<elementtype>

Seksjon -> Ramme -> Element
Bilde   -> Bilde -> Element
Tekst   -> Tekstutseende -> Lenke -> Element
Knapp   -> Knapp -> Lenke -> Element
```

Felles elementseksjon:

```text
Element
Status: Låst / Ulåst
Slett <elementtype>
```

## 4. Seksjon og ramme

Markert Seksjon viser:

```text
Ramme
Tykkelse
  Ingen
  1 px
  2 px
  ...
  10 px
Farge
  fargefirkant
  #RRGGBB
Element
Status
Slett seksjon
```

Regler:

- rammebredden valideres til `0–10`
- `0` vises som `Ingen`
- etikettene `1–10 px` genereres fra samme modellverdier som validatoren
- rammen ligger innenfor Seksjonens lagrede størrelse
- rammefargen beholdes når bredden settes til `0`
- høyremenyens fargekontroll og `Farger` skriver til samme prosjektverdi
- låst Seksjon kan inspiseres, men kontrollene er deaktivert
- reduceren avviser ugyldige, låste og uendrede handlinger

Seksjon-bakgrunn endres fra `Farger`, ikke fra en separat høyremenyverdi.

## 5. Bildekontroller

Markert bilde viser:

```text
Bilde
Alternativ tekst
Lagre tekst
Visning
  Hele bildet
  Juster utsnitt
Zoom
Tilbakestill utsnitt
Filmetadata
Ressursstatus
Elementstatus
Slett bilde
```

### Alternativ tekst

- bruker lokal transient draft
- trimmes ved lagring
- tom tekst er gyldig for dekorative bilder
- uendret tekst muterer ikke prosjektet
- vellykket lagring bruker `role="status"`
- låst bilde viser verdien, men kan ikke endres

### Visning

```text
Hele bildet    -> proporsjonal sentrering; tomrom tillatt
Juster utsnitt -> motivet fyller rammen uten tomrom
```

Visningsbytte går gjennom en typet reducerhandling. Overgang til crop normaliserer transform og tilpasser en for stor ramme til gyldig geometri.

### Zoom og reset

- vises bare i `Juster utsnitt`
- zoom er 100–300 prosent
- minimum zoom økes når rammen krever mer fylling
- zoomendring går gjennom validert statehandling
- reset sentrerer motivet og bruker minimum gyldig zoom
- låst bilde kan ikke endre zoom eller resettes

### Interaksjon

```text
vanlig dra      flytter motivet
Shift + dra     flytter hele rammen
Alt + piltast   flytter motivet 4 px
Shift+Alt+pil   flytter motivet 20 px
```

Rammeresize skjer på lerretet med åtte grep innenfor bilderammen. Aktiv kant flyttes, motsatt kant står fast, motivets størrelse og absolutte plassering beholdes, og ramme og transform lagres atomisk.

## 6. Tekstegenskaper

Markert tekstboks viser:

- font
- størrelse
- fet/kursiv
- justering
- linjehøyde
- lenke

Tekstinnhold redigeres på lerretet. Tekstfarge endres fra `Farger` og lagres i samme `TextElementStyle` som øvrig tekstutseende. Låste tekstbokser kan inspiseres, men ikke endres.

## 7. Lenkeegenskaper

Tekst og knapp bruker samme lenkeseksjon:

```text
Lenke
Type
Ingen
Ekstern lenke
Nettadresse
Åpne i ny fane
```

Bare absolutte `http://`- og `https://`-adresser godtas. Lenker aktiveres aldri i editormodus.

## 8. Knappkontroller

Markert knapp viser:

- knappetekst
- lagring av tekst
- designvalg
- valgt eller ukjent design
- lenke

Knappetekst trimmes. Tom tekst avvises. Design valideres mot statisk asset-katalog. Låste knapper kan inspiseres, men ikke endres.

Knappens farger følger ferdig SVG-design. Fase 12 legger ikke til fargeoverstyringer i høyremenyen.

## 9. Selection og drafts

```text
selectedElementId -> selectedElement -> RightPropertiesPanel
```

- panelet leser alltid siste element fra sentral state
- bilde- og knappeseksjoner nøkkelsettes med element-ID
- lokale drafts er transient state
- ny markering gir korrekt draft for nytt element

Ved klikk i høyremenyen under tekstredigering committer blur-mekanismen tekstdraften, avslutter tekstøkten og beholder elementmarkeringen.

Bilderamme og motiv redigeres på lerretet. Høyremenyen dupliserer ikke live-preview eller pekerstate.

## 10. Implementert arkitektur

```text
RightPropertiesPanel.tsx
  komposisjon etter elementtype

FramePropertiesSection.tsx
  Seksjon-rammebredde og rammefarge

ImagePropertiesSection.tsx
  alt-tekst, visning, zoom, reset og metadata

TextPropertiesSection.tsx
  tekstutseende

ButtonPropertiesSection.tsx
  knappetekst og design

ElementLinkPropertiesSection.tsx
  lenke for tekst og knapp

DeleteElementSection.tsx
  sletting
```

Fargekontrollen deles med `Farger`. Seksjon-handlinger går gjennom `useSectionAppearance` og den validerte fargereduceren.

## 11. Tilgjengelighet

- paneloverskrift brukes med `aria-labelledby`
- skjult innhold rendres ikke uten markert element
- felt har labels
- native fargekontroll har tilgjengelig navn og nåværende farge
- fokusmarkering er synlig
- fieldset og legend grupperer bildevisning
- feil bruker `role="alert"`
- lagringsfeedback bruker `role="status"`
- zoom har label og synlig verdi
- låste kontroller er deaktivert
- redusert bevegelse respekteres

## 12. Fil- og framtidsgrenser

- `RightPropertiesPanel.tsx` forblir komposisjon
- elementspesifikke kontroller ligger i egne filer
- 250 linjer er aktiv terskel
- høyremenyen skal ikke eie prosjektimport, ressursbuffer eller historikk
- senere prosjektbytte må avstemme ressursbufferen uten at panelet får ansvar for dette
- viewport-spesifikke mobilverdier skal håndteres i state-laget, ikke som lokale panelkopier
- responsive farger krever eksplisitt senere modell- og actionstøtte

## 13. Verifisering

Manuelt godkjent på PC og Telefon:

- Seksjon-ramme `Ingen` og `1–10 px`
- rammefarge synkronisert med `Farger`
- rammen endrer ikke elementets ytre størrelse
- låsing
- tekst-, knapp- og bildeegenskaper
- crop, zoom, sletting og fallback

Siste verifiserte automatiske kontroll:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 102 moduler, 274 avhengigheter, ingen brudd
Vite: 111 moduler transformert
CSS: 33.62 kB, gzip 6.34 kB
JavaScript: 264.52 kB, gzip 79.47 kB
produksjonsbuild: bestått på 192 ms
git diff --check: ingen whitespace-feil
```

Arkitekturrapportene ble regenerert og committet i `1963088`. Implementeringen ligger i PR #29 og merges bare etter eksplisitt godkjenning.
