# Responsiv design: desktop og mobil

Dette dokumentet beskriver den planlagte tekniske retningen for forskjeller mellom desktop- og mobilvisning.

## 1. Hovedprinsipp

- Ferdige nettsider skal bruke CSS media queries for responsive regler.
- Mobilvisningen skal kunne skjule elementer som fortsatt finnes på desktop.
- Desktop og mobil skal kunne ha egne verdier for utvalgte egenskaper.
- Nøyaktig hvilke egenskaper som kan overstyres per visning bestemmes før implementering.

Et foreløpig brytepunkt kan være 768 px, men dette skal testes før det låses.

## 2. Prosjektdata er hovedkilden

Editoren skal ikke bruke den gjeldende DOM-strukturen som permanent prosjektlagring.

Hvert redigerbart objekt får:

- en stabil og unik ID
- felles standardverdier
- eventuelle mobiloverstyringer
- synlighet per visning

Eksempel på prinsipp:

```ts
type ResponsiveValue<T> = {
  desktop: T
  mobile?: T
}

type EditorObject = {
  id: string
  visibility: ResponsiveValue<boolean>
  fontFamily?: ResponsiveValue<string>
  fontSize?: ResponsiveValue<number>
  position: ResponsiveValue<{ x: number; y: number }>
  size: ResponsiveValue<{ width: number; height: number }>
}
```

Når en mobilverdi mangler, arver mobil desktopverdien.

## 3. Skjule på mobil

Brukeren skal kunne velge at et objekt:

- vises på desktop og mobil
- bare vises på desktop
- bare vises på mobil, dersom dette senere godkjennes

Ved eksport eller forhåndsvisning genererer editoren en media query som skjuler objektet i riktig visning.

Editoren kan generere en CSS-klasse for dette, men prosjektdataene skal være den autoritative kilden.

## 4. Forskjellige fonter og størrelser

Det er teknisk mulig å bruke ulike:

- skrifttyper
- fontstørrelser
- synlighetsvalg
- posisjoner
- bredder og høyder

på desktop og mobil.

Før dette bygges må vi fastsette hvilke av disse egenskapene som faktisk skal kunne overstyres i første versjon.

## 5. CSS-generering

Editoren skal generere ett kontrollert prosjektstilark fremfor mange tilfeldige `<style>`-elementer.

Stilgeneratoren skal:

1. lese prosjektmodellen
2. generere desktopregler
3. generere mobilregler i en samlet media query
4. bruke stabile objekt-ID-er eller genererte klassenavn
5. produsere samme resultat for editor, forhåndsvisning og eksport

`!important` skal ikke brukes som standard. Riktig rekkefølge og CSS-spesifisitet skal løse overstyringer.

## 6. Stabile ID-er

Objekter skal få en stabil ID når de opprettes.

ID-en skal beholdes ved:

- automatisk lagring
- lukking og gjenåpning
- import av prosjekt
- forhåndsvisning
- eksport og publisering

Tilfeldige DOM-ID-er som opprettes på nytt ved hver visning skal ikke brukes som prosjektidentitet.

## 7. Editoropplevelse

Når mobilmodus er aktiv, skal editoren tydelig vise:

- om en verdi er arvet fra desktop
- om verdien er overstyrt for mobil
- om objektet er skjult i den aktuelle visningen

En mobilendring skal ikke utilsiktet endre desktopverdien.

## 8. Arkitektur

Responsiv funksjonalitet skal deles i egne ansvarsområder:

- responsive typer og datamodell
- arving og overstyring av verdier
- mobilkontroller i brukergrensesnittet
- CSS-generator
- forhåndsvisning
- eksport

Dette skal ikke samles i én stor komponent.

## 9. Planlagt branch

Implementeringen bygges senere i egen branch:

```text
feature/mobile-design-controls
```

CSS-generatoren kan få en egen branch dersom arbeidet blir stort nok til å være en selvstendig funksjonsdel.

## 10. Åpne beslutninger

- Endelig brytepunkt for mobil.
- Hvilke egenskaper som kan overstyres på mobil i første versjon.
- Om bare-mobil-visning skal støttes.
- Hvordan arvede og overstyrte verdier markeres visuelt.
- Om mobilplassering skal være helt fri eller delvis arve desktopoppsettet.
- Hvordan eksportert HTML og CSS organiseres i prosjektmappen.
