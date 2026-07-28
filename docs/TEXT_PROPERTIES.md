# Tekstegenskaper for vanlige tekstbokser

Dette dokumentet er autoritativ spesifikasjon for fase 8.

Branch:

```text
feature/text-properties
```

Sporet i GitHub-sak #10.

## Fast UX-regel

```text
Venstremeny = opprette og velge struktur
Høyremeny  = egenskaper for markert element
Lerretet   = redigere selve teksten
```

Venstremenyens `Elementer -> Tekst` oppretter en vanlig fri tekstboks og markerer den automatisk. Selve tekstinnholdet redigeres fortsatt bare direkte på lerretet.

Høyremenyen skal aldri få et ekstra stort tekstfelt som redigerer samme innhold.

## Første leveranse

Når et vanlig tekstelement er markert, viser høyremenyen:

```text
Egenskaper
Tekst

Tekstutseende
Font
Størrelse
Fet
Kursiv
Justering
Linjehøyde

Element
Status: Ulåst
```

Formateringen gjelder hele tekstboksen. Markerte enkeltord eller tegn får ikke egne stiler.

Ikke-tekstelementer viser ikke seksjonen `Tekstutseende`.

## Kontrollerte verdier

### Font

Første leveranse bruker åtte nettsikre valg:

```text
System
Arial
Verdana
Tahoma
Trebuchet MS
Georgia
Times New Roman
Courier New
```

Prosjektdata lagrer stabile fonttokens. Rå CSS-fontstacker skal ikke lagres i prosjektmodellen. Visningslaget avleder korrekt fontstack fra tokenet.

### Størrelse

Tillatte størrelser:

```text
12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96 px
```

Kontrollen er en avgrenset liste, ikke et fritt tallfelt.

### Fet og kursiv

- to uavhengige toggle-knapper
- `aria-pressed` beskriver tilstanden
- kontrollene endrer hele tekstboksen

### Justering

Tillatte verdier:

```text
venstre
midtstilt
høyre
```

Justering vises som en kompakt, tastaturtilgjengelig kontrollgruppe.

### Linjehøyde

Tillatte verdier:

```text
1.0
1.2
1.45
1.6
1.8
2.0
```

Linjehøyde lagres som en kontrollert enhetsløs verdi.

### Standardverdier

```text
font: System
størrelse: 16 px
fontvekt: normal
fontstil: normal
justering: venstre
linjehøyde: 1.45
```

Dette bevarer dagens standardutseende.

## Prosjektmodell

Prosjektskjemaet økes fra versjon 2 til versjon 3 fordi en obligatorisk varig egenskap legges til tekstelementet.

Bare `kind: 'text'` får obligatorisk `textStyle`.

Tekststilen skal minst inneholde:

```text
fontFamily
fontSize
fontWeight
fontStyle
textAlign
lineHeight
```

Verdiene skal være eksplisitte unioner eller kontrollerte tallsett. Modellen skal ikke godta vilkårlige CSS-strenger.

Tekststil er foreløpig felles for PC og Telefon. Mobile tekststiloverstyringer er ikke del av denne fasen.

## Reducer og state

Hver kontroll sender en liten stilpatch. Reduceren slår patchen sammen med den nyeste autoritative state.

Reducergrensen skal avvise:

- manglende element
- element på feil side
- annet element enn `kind: 'text'`
- låst tekstelement
- ukjente eller ugyldige stilverdier
- patch som ikke gir en reell endring

`project.updatedAt` endres bare ved en gyldig, faktisk stilendring.

Panelet eier ingen separat kopi av tekststilen. Eventuell hover, fokus og lokal trykkfeedback er transient UI-state.

## Låste elementer

Et låst tekstelement kan markeres og inspiseres.

Tekstkontrollene:

- viser gjeldende verdier
- er deaktivert når elementet er låst
- muterer ikke prosjektet

Opplåsing fortsetter gjennom det eksisterende objektverktøyet. Denne branchen legger ikke til en ny låsekontroll i høyremenyen.

## Samspill med tekstredigering

Klikk på en høyremeny-kontroll under aktiv tekstredigering skal følge eksisterende grense:

1. `textarea` mister fokus
2. eksisterende blur-mekanisme committer tekstinnholdet
3. markeringen beholdes
4. stilkontrollen gjennomfører sin egen reducerhandling
5. både visning og neste redigeringsøkt bruker den nye stilen

Høyremenyen skal ikke duplisere eller omgå tekstens commitmekanisme.

## Rendering

Samme avledede tekststil skal brukes av:

- vanlig tekstvisning
- aktivt `textarea`

Det skal ikke finnes separate hardkodede fontstørrelser eller linjehøyder som gjør at teksten hopper når redigering starter eller avsluttes.

Tom placeholder er bare editor-UI. Den lagres ikke og skal ikke endre prosjektmodellen.

## Arkitektur

Forventet ansvarsdeling:

- `model` — tekststiltyper, standardverdier, kontrollerte valg og validering
- `state` — reducerhjelper og dispatch-hook for tekststilpatcher
- `properties` — liten presentasjonsseksjon for tekstkontrollene
- `canvas` — avledning fra fonttoken til CSS og felles rendering for visning/redigering
- `RightPropertiesPanel` — komposisjon, ikke egen tekststate

Alle nye kildefiler følger aktiv 250-linjersgrense. Uttrekking skjer etter ansvar.

## Ikke del av denne branchen

- tekstfarge eller fargevelger
- prosjektfargemodell
- bredde, høyde eller plassering i høyremenyen
- headerens hovedtekst eller undertittel
- riktekst eller tegnbaserte tekstspenn
- opplasting av fonter eller eksterne webfonter
- sletting eller duplisering
- historikk eller lagring
- mobile tekststiloverstyringer

Falske, tomme eller deaktiverte fremtidsseksjoner skal ikke legges inn.

## Akseptansekriterier

- ny tekstboks får alle standardverdier
- alle kontroller viser prosjektets faktiske verdi
- hver kontroll oppdaterer hele tekstboksen
- visning og `textarea` ser likt ut
- fonttoken avledes til korrekt CSS-fontstack
- låst tekst kan inspiseres, men ikke endres
- andre elementtyper viser ingen tekstkontroller
- tekstinnhold redigeres fortsatt bare på lerretet
- ugyldige og uendrede reduceroverganger avvises
- `updatedAt` endres bare ved reell stilendring
- alle kildefiler følger ansvars- og størrelsesreglene
- `npm run check` består
- arkitekturrapportene regenereres
- PC, Telefon, peker og tastatur kontrolleres
- arbeidsområdet er rent før PR
