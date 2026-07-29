# Høyremenyens struktur og egenskaper

Dette dokumentet beskriver høyremenyens autoritative produktoppførsel, arkitektur og elementkontroller.

## 1. Låst produktoppførsel

```text
Ingenting valgt -> ingen høyremeny
Element valgt   -> høyremeny åpnes
Tomt lerret     -> høyremeny lukkes
```

Detaljer:

- panelet er 320 px bredt
- ved minst 1680 px er panelet dokket på høyre side
- under 1680 px er panelet overlay fra høyre
- overlay reduserer ikke lerretsbredden
- skjult panel reserverer ingen plass
- markering av et annet element oppdaterer panelet umiddelbart
- låst element kan markeres og inspiseres
- panelet har egen vertikal scrolling
- åpning og lukking bruker 180 ms transform-animasjon
- animasjonen deaktiveres ved `prefers-reduced-motion`

## 2. Fast ansvarsdeling

```text
Venstremeny = opprette elementer og velge fil eller ferdig design
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere innhold og transformere elementer
Ressurslag = eie transient bildefil og renderings-URL
```

Panelet:

- oppretter ikke elementer
- eier ikke en separat elementkopi
- søker ikke etter elementdata i DOM-en
- muterer ikke prosjektdata direkte
- eier ikke bildefiler eller Object URL-er
- serialiseres ikke

Varige endringer sendes som typede brukerintensjoner til state-laget.

## 3. Gjeldende panelstruktur

Felles topp:

```text
Egenskaper
elementtype
```

Betinget innhold:

```text
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

- feltet bruker lokal transient draft
- teksten trimmes ved lagring
- tom tekst er gyldig for dekorative bilder
- uendret tekst muterer ikke prosjektet
- vellykket lagring gir `role="status"`
- låst bilde viser verdien, men felt og knapp er deaktivert

### Visning

```text
Hele bildet    -> proporsjonal sentrering; tomrom tillatt
Juster utsnitt -> motivet fyller rammen uten tomrom
```

Visningsbytte går gjennom en typet reducerhandling. Overgang til utsnittsmodus normaliserer zoom og tilpasser en eventuell for stor ramme til et gyldig, sentrert utsnitt.

### Zoom og reset

- zoomkontrollen vises bare i `Juster utsnitt`
- zoom er begrenset til 100–300 prosent
- minimumsverdien økes når rammen krever mer zoom for å unngå tomrom
- zoomendring går gjennom validert statehandling
- `Tilbakestill utsnitt` sentrerer motivet og bruker minimum gyldig zoom
- låst bilde kan ikke endre zoom eller resettes

### Hjelpetekst

Panelet beskriver både peker- og tastaturkontroll:

```text
vanlig dra      flytter motivet
Shift + dra     flytter hele rammen
Alt + piltast   flytter motivet med tastaturet
```

### Filmetadata og ressursstatus

Panelet viser:

- filnavn
- original pikselstørrelse
- filstørrelse
- varsel når bildefilen mangler i aktiv ressursbuffer

Manglende ressurs bruker `role="alert"` og kontrollert fallback på lerretet.

## 5. Tekstegenskaper

Markert tekstboks viser:

```text
Tekstutseende
Font
Størrelse
Stil
Justering
Linjehøyde
```

Tekstinnhold redigeres på lerretet. Høyremenyen endrer egenskaper som gjelder hele tekstboksen. Låst tekstboks viser verdiene, men kontrollene er deaktivert.

## 6. Lenkeegenskaper

Tekstbokser og knapper viser samme lenkeseksjon:

```text
Lenke
Type
Ingen
Ekstern lenke
Nettadresse
Åpne i ny fane
```

Skjemaet bruker lokal transient draft og valideringsfeedback. Bare absolutte `http://`- og `https://`-adresser godtas. Lenken aktiveres aldri i editormodus.

## 7. Knappkontroller

Markert knapp viser:

```text
Knapp
Tekst
Lagre tekst
Design
Valgt design / ukjent design-varsel
```

Regler:

- knappetekst trimmes før lagring
- tom eller whitespace-only tekst avvises
- uendret tekst muterer ikke prosjektet
- design valideres mot statisk asset-katalog
- ukjent lagret design viser varsel og reparasjonsvalg
- låst knapp kan inspiseres, men ikke endres

## 8. Selection og oppdatering

Panelet mottar autoritativt valgt element som prop:

```text
selectedElementId -> selectedElement -> RightPropertiesPanel
```

Ved ny markering oppdateres panelet uten stale elementdata.

- bilde- og knappeseksjoner nøkkelsettes med element-ID for å starte med korrekt draft
- lenkeskjemaet nøkkelsettes av element-ID og lagret lenke
- panelet leser alltid siste element fra sentral state

## 9. Samspill med lerretet

Ved klikk i høyremenyen under aktiv tekstredigering:

1. tekstfeltet mister fokus
2. eksisterende blur-mekanisme committer draften
3. tekstøkten avsluttes
4. elementmarkeringen beholdes
5. panelet fortsetter å lese elementet fra sentral state

Bilderamme og motivutsnitt redigeres på lerretet. Høyremenyen dupliserer ikke pekerstate eller live-preview.

## 10. Implementert arkitektur

```text
src/components/properties/RightPropertiesPanel.tsx
  komposisjon basert på elementtype

src/components/properties/ImagePropertiesSection.tsx
  alternativ tekst, visning, zoom, reset og metadata

src/components/properties/TextPropertiesSection.tsx
  tekstutseende

src/components/properties/ButtonPropertiesSection.tsx
  knappetekst og design

src/components/properties/ElementLinkPropertiesSection.tsx
  lenke for tekst og knapp

src/components/properties/DeleteElementSection.tsx
  sletting

src/state/reduceImageProjectAction.ts
src/state/setImageAltText.ts
src/state/setImageMode.ts
src/state/setImageTransform.ts
  validerte bildehandlinger
```

CSS-ansvar:

```text
right-properties-panel.css   paneloverflate, scrolling og breakpoint
image-properties.css         alt-tekst, metadata og felles bildeegenskaper
image-crop-properties.css    visning, zoom og utsnittskontroller
text-properties.css          tekstkontroller
button-properties.css        knappetekst og design
element-link-properties.css  lenkeskjema
element-deletion.css         sletting og dialog
```

## 11. Tilgjengelighet

- paneloverskrift brukes med `aria-labelledby`
- skjult panelinnhold rendres ikke uten valgt element
- formularfelter har eksplisitte labels
- fieldset og legend grupperer bildevisning
- feil og manglende ressurs bruker `role="alert"`
- lagringsfeedback bruker `role="status"`
- zoom har tilgjengelig label og synlig prosentverdi
- hjelpetekst beskriver peker- og tastaturalternativer
- låste kontroller er deaktivert
- `prefers-reduced-motion` respekteres

## 12. Filgrenser

- `RightPropertiesPanel.tsx` skal forbli en komposisjonskomponent
- elementspesifikke kontroller trekkes ut i egne filer
- 250 linjer er aktiv terskel for ansvarstrekk
- 300 linjer er hard unntaksgrense
- `EditorCanvasElement.tsx` skal ikke få høyremenyansvar

## 13. Verifisering

Fase 11A er manuelt godkjent for:

- alternativ tekst
- `Hele bildet`
- `Juster utsnitt`
- zoom og reset
- motivdrag
- `Shift + dra` for rammeflytting
- resizing fra alle kanter og hjørner
- låsing og sletting
- manglende ressursfallback
- PC og Telefon

Automatisk kontroll etter kodeaudit:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 89 moduler, 228 avhengigheter, ingen brudd
Vite-produksjonsbuild: bestått
```
