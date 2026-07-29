# Tekstegenskaper for vanlige tekstbokser

Dette dokumentet er autoritativ spesifikasjon og historisk verifikasjonslogg for fase 8.

```text
branch: feature/text-properties
base main: 8de5f2e
GitHub-sak: #10
PR: #11 – merget
mergecommit: 452b491
skjemaversjon innført i fasen: 3
```

## Status

Fasen er implementert, auditert, kontrollert og merget til `main` gjennom PR #11.

Skjemaversjon 3 er en historisk milepæl fra denne fasen. Gjeldende prosjektskjema er versjon 4.

Tidligere «Status før PR»-formuleringer beskrev branchens tilstand før PR #11 og er ikke gjeldende prosjektstatus.

## Fast UX-regel

```text
Venstremeny = opprette og velge struktur
Høyremeny  = egenskaper for markert element
Lerretet   = redigere selve teksten
```

`Elementer -> Tekst` oppretter en vanlig fri tekstboks og markerer den automatisk. Tekstinnholdet redigeres bare direkte på lerretet. Høyremenyen har ikke et ekstra tekstfelt.

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

Formateringen gjelder hele tekstboksen. Det finnes ikke riktekst eller tegnbasert formatering. Andre elementtyper åpner høyremenyen uten `Tekstutseende`.

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

Denne fasen økte prosjektskjemaet fra versjon 2 til versjon 3.

Bare `kind: 'text'` fikk obligatorisk `textStyle`:

```text
fontFamily
fontSize
fontWeight
fontStyle
textAlign
lineHeight
```

Tekststil er varig prosjektdata og er foreløpig felles for PC og Telefon. Nye tekstbokser får en egen kopi av standardstilen.

Prosjektskjemaet ble senere økt til gjeldende versjon 4 i lenkefasen.

## Reducer og validering

Hver brukerhandling sender én avgrenset stilpatch. Reduceren bruker nyeste autoritative state og avviser:

- manglende element
- element på feil side
- andre elementtyper enn `text`
- låst tekstelement
- ugyldige eller ukjente stilverdier
- patch med `null`, array, ukjent nøkkel eller flere egenskaper
- patch som ikke gir en reell endring

`project.updatedAt` endres bare ved en gyldig, faktisk stilendring.

Runtime-validatoren er trygg mot utypede data og bruker et uttømmende validatorregister.

## Låste elementer

Et låst tekstelement kan markeres og inspiseres. Tekstkontrollene viser gjeldende verdier, men er deaktivert. Reduceren håndhever låsen uavhengig av UI-et.

## Tekstredigering og rendering

Klikk på en kontroll under aktiv tekstredigering bruker eksisterende blur/commit før stilendringen. Høyremenyen har ingen separat tekstdraft eller tekststilkopi.

Samme avledede stil legges på tekstelementets overordnede DOM-element og arves av vanlig tekstvisning og aktivt `textarea`.

Placeholder er editor-UI og lagres ikke.

## Godkjent fokusoppførsel

Når fokus flyttes fra lerretet til høyremenyen:

- elementet forblir valgt i autoritativ editor-state
- høyremenyen fortsetter å vise og endre samme element
- den blå markeringsrammen på lerretet kan forsvinne visuelt

Denne oppførselen er eksplisitt godkjent.

## Arkitektur

Implementert ansvarsdeling:

- `src/model/textElementStyle.ts` — tokens, typer, standardverdier og runtime-validering
- `src/state/setTextElementStyle.ts` — validert prosjektmutasjon
- `src/state/useTextElementStyle.ts` — liten dispatch-hook
- `src/state/editorProjectAction.ts` — uttømmende action-union
- `src/components/properties/TextPropertiesSection.tsx` — presentasjonskontroller
- `src/components/canvas/getTextElementCssStyle.ts` — fonttoken og stil til CSS
- `RightPropertiesPanel` — komposisjon, ikke egen tekststate

Alle nye kildefiler var under 250 linjer. `EditorCanvasElement.tsx` var 244 linjer og skal ikke få nye funksjonsansvar.

## Framtidsrettet kodeaudit

Auditen kontrollerte blant annet delt standardstil, stale state, ugyldige reduceroverganger, runtime-validering, identisk rendering, blur/commit, tilgjengelighet, filstørrelser og CSS-importrekkefølge.

Rettede auditfunn:

```text
95dae75  fix: harden text style runtime validation
3d01336  refactor: make text style validation exhaustive
```

## Verifisert før merge

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 44 moduler, 97 avhengigheter, ingen brudd
produksjonsbuild: bestått
Vite: 54 moduler transformert, bygget på 164 ms
```

Arkitekturrapportene ble regenerert i:

```text
a267ca3  chore: refresh architecture reports for text properties
```

Lokal branch var synkronisert og clean før PR #11 ble merget.

## Ikke del av den historiske branchen

- tekstfarge eller prosjektfargemodell
- bredde, høyde eller plassering i høyremenyen
- headerens hovedtekst eller undertittel
- riktekst eller tegnbaserte tekstspenn
- egendefinerte fontfiler eller eksterne webfonter
- sletting eller duplisering
- historikk eller lagring
- mobile tekststiloverstyringer