# Høyremenyens struktur og egenskaper

Dette dokumentet beskriver høyremenyens autoritative produktoppførsel, arkitektur og nåværende elementkontroller.

## Historisk grunnfase

Høyremenyens grunnstruktur ble implementert i:

```text
branch: feature/right-properties-panel
PR: #9 – merget
mergecommit: 8de5f2e
```

Panelet er senere utvidet i egne faser med tekstegenskaper, elementlenker, sikker sletting og knappkontroller.

## Låst produktoppførsel

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
- markering av et annet element oppdaterer samme panel umiddelbart
- låst element kan markeres og inspiseres
- panelet har egen vertikal scrolling
- åpning og lukking bruker 180 ms transform-animasjon
- animasjonen deaktiveres ved `prefers-reduced-motion`

## Fast ansvarsdeling

```text
Venstremeny = opprette elementer og velge ferdig design
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere tekst og transformere elementer
```

Panelet:

- oppretter ikke elementer
- eier ikke en separat elementkopi
- søker ikke etter elementdata i DOM-en
- muterer ikke prosjektdata direkte
- serialiseres ikke

Varige endringer sendes som typede brukerintensjoner til state-laget.

## Gjeldende panelstruktur

Felles topp:

```text
Egenskaper
elementtype
```

Betinget innhold:

```text
Seksjon -> Element
Bilde   -> Element
Tekst   -> Tekstutseende -> Lenke -> Element
Knapp   -> Knapp -> Lenke -> Element
```

Felles elementseksjon:

```text
Element
Status: Låst / Ulåst
Slett <elementtype>
```

## Tekstegenskaper

Markert tekstboks viser:

```text
Tekstutseende
Font
Størrelse
Stil
Justering
Linjehøyde
```

Tekstinnhold redigeres fortsatt på lerretet. Høyremenyen endrer bare egenskaper som gjelder hele tekstboksen.

Låst tekstboks viser verdiene, men kontrollene er deaktivert.

## Lenkeegenskaper

Tekstbokser og knapper viser samme lenkeseksjon:

```text
Lenke
Type
Ingen
Ekstern lenke
Nettadresse
Åpne i ny fane
```

Skjemaet bruker lokal transient draft og valideringsfeedback. Gyldig lagring går gjennom den generelle `set-element-link`-handlingen.

Bare absolutte `http://`- og `https://`-adresser godtas. Lenken aktiveres aldri i editormodus.

## Knappkontroller på feature-branchen

`feature/button-library` legger til en egen `ButtonPropertiesSection`.

Markert knapp viser:

```text
Knapp
Tekst
Lagre tekst
Design
Valgt design / ukjent design-varsel
```

Regler for knappetekst:

- inputfeltet bruker lokal draft
- teksten trimmes ved lagring
- tom eller whitespace-only tekst avvises
- uendret tekst muterer ikke prosjektet
- vellykket lagring gir lokal statusmelding

Regler for design:

- design velges fra den statiske asset-katalogen
- designbytte går gjennom en typet reducerhandling
- ukjent ny asset-ID avvises
- uendret design muterer ikke prosjektet
- ukjent lagret asset-ID viser et tydelig varsel
- brukeren kan reparere knappen ved å velge et gyldig design

Låst knapp:

- kan inspiseres
- tekstfelt og lagreknapp er deaktivert
- designvelger er deaktivert
- lenkekontroller er deaktivert
- sletting er deaktivert gjennom eksisterende slettemodell

## Selection og oppdatering

Panelet mottar autoritativt valgt element som prop.

```text
selectedElementId -> selectedElement -> RightPropertiesPanel
```

Ved ny markering oppdateres panelet uten stale elementdata.

Knappeseksjonen resetter lokal knappetekstdraft når et annet knappelement velges. Lenkeskjemaet nøkkelsettes av element-ID og lagret lenkedata for å unngå stale drafts.

## Samspill med tekstredigering

Når brukeren klikker i høyremenyen under aktiv tekstredigering:

1. tekstfeltet mister fokus
2. eksisterende blur-mekanisme committer draften
3. tekstøkten avsluttes
4. elementmarkeringen beholdes
5. panelet fortsetter å lese elementet fra sentral state

Høyremenyen omgår eller dupliserer ikke tekstens commitgrense.

## Implementert arkitektur

```text
src/components/properties/RightPropertiesPanel.tsx
  - komposisjon basert på elementtype

src/components/properties/TextPropertiesSection.tsx
  - tekstutseende

src/components/properties/ButtonPropertiesSection.tsx
  - knappetekst og design

src/components/properties/ElementLinkPropertiesSection.tsx
  - lenke for tekst og knapp

src/components/properties/DeleteElementSection.tsx
  - sletting

src/state/*
  - validerte reducerhandlinger og hooks
```

CSS-ansvar:

```text
right-properties-panel.css  paneloverflate, scrolling og breakpoint
text-properties.css         tekstkontroller
button-properties.css       knappetekst og design
 element-link-properties.css lenkeskjema
 element-deletion.css        sletting og dialog
```

## Tilgjengelighet

- paneloverskrift brukes med `aria-labelledby`
- skjult panelinnhold rendres ikke uten valgt element
- formularfelter har eksplisitte labels
- feil bruker `role="alert"`
- lagringsfeedback bruker `role="status"`
- designvelger er et vanlig tastaturbetjent `select`
- SVG-en er dekorativ; knappens HTML-label er tilgjengelig navn
- `prefers-reduced-motion` respekteres

## Filgrenser

- `RightPropertiesPanel.tsx` skal forbli en komposisjonskomponent
- elementspesifikke kontroller trekkes ut i egne filer
- 250 linjer er aktiv terskel for ansvarstrekk
- 300 linjer er hard unntaksgrense
- `EditorCanvasElement.tsx` skal ikke få høyremenyansvar

## Verifisering

Historisk grunnfase bekreftet:

- ingen valgt element gir ingen synlig eller reservert høyremeny
- valgt element åpner panelet
- klikk på tomt lerret lukker panelet
- overlay under 1680 px
- dokket panel fra 1680 px
- egen scrolling
- redusert bevegelse respekteres

Knappbibliotekets manuelle test bekreftet:

- knappetekst lagres og rendres
- tom tekst avvises
- alle fire design kan velges
- designbytte oppdaterer lerretet
- ekstern lenke kan legges til og fjernes
- lenken åpnes ikke i editormodus
- låst knapp kan inspiseres, men ikke endres
- PC-, Telefon-, peker- og tastaturflyt fungerer

Se `docs/BUTTON_LIBRARY.md`.
