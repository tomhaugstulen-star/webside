# Tekstegenskaper for vanlige tekstbokser

Dette dokumentet er autoritativ spesifikasjon og implementasjonsstatus for fase 8.

```text
branch: feature/text-properties
base main: 8de5f2e
GitHub-sak: #10
```

## Fast UX-regel

```text
Venstremeny = opprette og velge struktur
Høyremeny  = egenskaper for markert element
Lerretet   = redigere selve teksten
```

`Elementer -> Tekst` oppretter en vanlig fri tekstboks og markerer den automatisk. Selve tekstinnholdet redigeres bare direkte på lerretet. Høyremenyen har ikke et ekstra tekstfelt.

## Implementert høyremeny

Når et vanlig tekstelement er markert, vises:

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

Formateringen gjelder hele tekstboksen. Det finnes ikke riktekst eller tegnbasert formatering. Andre elementtyper åpner fortsatt høyremenyen, men viser ikke `Tekstutseende`.

## Kontrollerte verdier

### Font

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

Prosjektdata lagrer stabile fonttokens. CSS-fontstacker avledes i visningslaget.

### Størrelse

```text
12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96 px
```

### Stil og justering

- fet og kursiv er uavhengige toggle-knapper med `aria-pressed`
- justering er venstre, midtstilt eller høyre
- kontrollene gjelder hele tekstboksen

### Linjehøyde

```text
1.0, 1.2, 1.45, 1.6, 1.8, 2.0
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

## Prosjektmodell

Prosjektskjemaet er økt fra versjon 2 til versjon 3.

Bare `kind: 'text'` har obligatorisk `textStyle`:

```text
fontFamily
fontSize
fontWeight
fontStyle
textAlign
lineHeight
```

Tekststil er varig prosjektdata og er foreløpig felles for PC og Telefon. Nye tekstbokser får en egen kopi av standardstilen.

## Reducer og validering

Hver brukerhandling sender én avgrenset stilpatch. Reduceren bruker nyeste autoritative state og avviser:

- manglende element
- element på feil side
- andre elementtyper enn `text`
- låst tekstelement
- ugyldige eller ukjente stilverdier
- patch med null, array, ukjent nøkkel eller flere egenskaper
- patch som ikke gir en reell endring

`project.updatedAt` endres bare ved en gyldig, faktisk stilendring.

Runtime-validatoren er trygg mot utypede data og bruker et uttømmende validatorregister. TypeScript krever derfor at framtidige felt i `TextElementStyle` også får validering.

## Låste elementer

Et låst tekstelement kan markeres og inspiseres. Tekstkontrollene viser gjeldende verdier, men er deaktivert. Reduceren håndhever låsen uavhengig av UI-et.

Opplåsing skjer fortsatt gjennom det eksisterende objektverktøyet.

## Tekstredigering og rendering

Klikk på en kontroll under aktiv tekstredigering bruker eksisterende blur/commit før stilendringen. Høyremenyen har ingen separat tekstdraft eller tekststilkopi.

Samme avledede stil legges på tekstelementets overordnede DOM-element og arves av:

- vanlig tekstvisning
- aktivt `textarea`

Det finnes ikke separate hardkodede fontstørrelser eller linjehøyder som gir hopp mellom visning og redigering. Placeholder er editor-UI og lagres ikke.

## Godkjent fokusoppførsel

Når fokus flyttes fra lerretet til høyremenyen:

- elementet forblir valgt i autoritativ editor-state
- høyremenyen fortsetter å vise og endre samme element
- den blå markeringsrammen på lerretet kan forsvinne visuelt

Denne oppførselen er eksplisitt godkjent og skal ikke rettes i denne branchen.

## Arkitektur

Ansvarsdelingen er implementert slik:

- `src/model/textElementStyle.ts` — tokens, typer, standardverdier og runtime-validering
- `src/state/setTextElementStyle.ts` — validert prosjektmutasjon
- `src/state/useTextElementStyle.ts` — liten dispatch-hook
- `src/state/editorProjectAction.ts` — uttømmende action-union uten å blåse opp reducerfilen
- `src/components/properties/TextPropertiesSection.tsx` — presentasjonskontroller
- `src/components/canvas/getTextElementCssStyle.ts` — fonttoken og stil til CSS
- `RightPropertiesPanel` — komposisjon, ikke egen tekststate

Alle nye kildefiler er under 250 linjer. `EditorCanvasElement.tsx` er 244 linjer og skal ikke få flere nye ansvarsområder; senere canvaslogikk må trekkes ut.

## Framtidsrettet kodeaudit

Auditen kontrollerte:

- delt eller muterbar standardstil
- stale state og parallell stilstate
- ugyldige, uendrede og låste reduceroverganger
- utypede eller ødelagte framtidige importdata
- uttømmende validering ved senere modellutvidelser
- identisk rendering i visning og `textarea`
- fonttoken kontra rå CSS i prosjektdata
- samspill med blur/commit
- tilgjengelige labels, toggles, disabled-state og fokusstil
- filstørrelser, modulgrenser og CSS-importrekkefølge

Rettede auditfunn:

```text
95dae75  fix: harden text style runtime validation
3d01336  refactor: make text style validation exhaustive
```

## Sluttkontroll

Brukeren kjørte sluttkontroll etter siste produksjonskodeendring:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 44 moduler, 97 avhengigheter, ingen brudd
produksjonsbuild: bestått
Vite: 54 moduler transformert, bygget på 164 ms
```

Arkitekturrapportene ble regenerert og committet i:

```text
a267ca3  chore: refresh architecture reports for text properties
```

`git diff --check` viste bare LF/CRLF-varsler, ikke whitespace-feil. Lokal branch er synkronisert med `origin/feature/text-properties`, og working tree er clean.

## Ikke del av branchen

- tekstfarge eller prosjektfargemodell
- bredde, høyde eller plassering i høyremenyen
- headerens hovedtekst eller undertittel
- riktekst eller tegnbaserte tekstspenn
- egendefinerte fontfiler eller eksterne webfonter
- sletting eller duplisering
- historikk eller lagring
- mobile tekststiloverstyringer

## Status før PR

Implementasjon, audit, sluttkontroll, arkitekturrapporter og visuell godkjenning er ferdig. Dokumentasjonen oppdateres nå. PR skal først opprettes etter at dokumentasjonscommitene er hentet lokalt og clean tree er bekreftet på nytt.
