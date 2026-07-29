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
Venstremeny = opprette elementer og velge fil eller design
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

Seksjon -> Element
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

## 4. Bildekontroller

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

### Interaksjonshjelp

```text
vanlig dra      flytter motivet
Shift + dra     flytter hele rammen
Alt + piltast   flytter motivet 4 px
Shift+Alt+pil   flytter motivet 20 px
```

`Alt + piltast` virker også etter bruk av zoomkontrollen. Snarveien blokkeres i tekstfelt og dialoger.

### Rammeresize

Rammeresize skjer på lerretet, ikke i høyremenyen.

- åtte grep ligger innenfor bilderammen
- aktiv kant flyttes
- motsatt kant står fast
- motivets størrelse og absolutte plassering beholdes
- ramme og korrigert transform lagres atomisk

### Filmetadata og ressursstatus

Panelet viser:

- filnavn
- original pikselstørrelse
- filstørrelse
- varsel ved manglende ressurs

Autoritative importgrenser:

```text
PNG, JPEG eller WebP
maks 10 MB
maks 40 megapiksler
maks 16 384 px per side
```

Manglende ressurs bruker `role="alert"` og kontrollert fallback på lerretet.

## 5. Tekstegenskaper

Markert tekstboks viser tekstutseende:

- font
- størrelse
- stil
- justering
- linjehøyde

Tekstinnhold redigeres på lerretet. Høyremenyen endrer egenskaper for hele tekstboksen. Låste tekstbokser kan inspiseres, men ikke endres.

## 6. Lenkeegenskaper

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

## 7. Knappkontroller

Markert knapp viser:

- knappetekst
- lagring av tekst
- designvalg
- valgt eller ukjent design
- lenke

Knappetekst trimmes. Tom tekst avvises. Design valideres mot statisk asset-katalog. Låste knapper kan inspiseres, men ikke endres.

## 8. Selection og drafts

```text
selectedElementId -> selectedElement -> RightPropertiesPanel
```

- panelet leser alltid siste element fra sentral state
- bilde- og knappeseksjoner nøkkelsettes med element-ID
- lokale drafts er transient state
- ny markering gir korrekt draft for nytt element

## 9. Samspill med lerretet

Ved klikk i høyremenyen under tekstredigering:

1. tekstfeltet mister fokus
2. blur-mekanismen committer draften
3. tekstøkten avsluttes
4. elementmarkeringen beholdes
5. panelet leser oppdatert element fra sentral state

Bilderamme og motiv redigeres på lerretet. Høyremenyen dupliserer ikke live-preview eller pekerstate.

## 10. Implementert arkitektur

```text
RightPropertiesPanel.tsx
  komposisjon etter elementtype

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

Bildehandlinger går gjennom:

```text
reduceImageProjectAction.ts
setImageAltText.ts
setImageMode.ts
setImageTransform.ts
setImageDesktopFrame.ts
```

## 11. Tilgjengelighet

- paneloverskrift brukes med `aria-labelledby`
- skjult innhold rendres ikke uten markert element
- felt har labels
- fieldset og legend grupperer bildevisning
- feil bruker `role="alert"`
- lagringsfeedback bruker `role="status"`
- zoom har label og synlig verdi
- hjelpetekst beskriver tastatur og peker
- låste kontroller er deaktivert
- redusert bevegelse respekteres

## 12. Fil- og framtidsgrenser

- `RightPropertiesPanel.tsx` forblir komposisjon
- elementspesifikke kontroller ligger i egne filer
- 250 linjer er aktiv terskel
- høyremenyen skal ikke eie prosjektimport, ressursbuffer eller historikk
- senere prosjektbytte må avstemme ressursbufferen uten at panelet får ansvar for dette
- viewport-spesifikke mobilverdier skal håndteres i state-laget, ikke som lokale panelkopier

## 13. Verifisering

Manuelt godkjent:

- alt-tekst
- `Hele bildet` og `Juster utsnitt`
- zoom og reset
- motivdrag og tastaturstyring
- rammeresize fra alle kanter og hjørner
- grep innenfor rammen
- stasjonært motiv ved crop-resize
- låsing, sletting og fallback
- PC og Telefon

Siste automatiske kontroll:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 91 moduler, 237 avhengigheter, ingen brudd
Vite: 100 moduler transformert
produksjonsbuild: bestått på 185 ms
```
