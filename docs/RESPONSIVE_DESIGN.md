# Responsiv design: desktop og mobil

Dette dokumentet beskriver teknisk retning for forskjeller mellom desktop- og mobilvisning.

## 1. Hovedprinsipp

- Ferdige nettsider skal bruke CSS media queries.
- Mobilvisningen skal kunne skjule elementer som fortsatt finnes på desktop.
- Desktop og mobil skal kunne ha egne verdier for utvalgte egenskaper.
- Nøyaktig hvilke egenskaper som kan overstyres bestemmes før mobilkontrollene implementeres.

Et foreløpig brytepunkt kan være 768 px, men dette skal testes før det låses.

## 2. Prosjektdata er hovedkilden

Editoren skal ikke bruke DOM-strukturen som permanent prosjektlagring.

`feature/element-model` har implementert dette grunnprinsippet:

```ts
type ResponsiveValue<T> = {
  desktop: T
  mobile?: T
}

type EditorElement = {
  id: string
  kind: 'section' | 'image' | 'text' | 'button'
  visibility: ResponsiveValue<boolean>
  position: ResponsiveValue<{ x: number; y: number }>
  size: ResponsiveValue<{ width: number; height: number }>
  locked: boolean
}
```

Når en mobilverdi mangler, skal mobil senere arve desktopverdien.

## 3. Implementert nå

Godkjent i `feature/element-model`:

- stabile prosjekt-, side- og element-ID-er
- responsive modellfelter for posisjon, størrelse og synlighet
- desktopverdi med valgfri mobilverdi
- sentral prosjekt-state
- prosjektmodellen som autoritativ datakilde

Ikke implementert ennå:

- beregning av arvet verdi
- mobiloverstyringer i brukergrensesnittet
- skjul på mobil
- egen mobilposisjonering
- CSS-generator
- eksporterte media queries

Desktop- og mobilknappen i toppmenyen endrer foreløpig bare bredden på editorens blanke lerret.

## 4. Skjule på mobil

Brukeren skal senere kunne velge at et objekt:

- vises på desktop og mobil
- bare vises på desktop
- bare vises på mobil dersom dette godkjennes

Prosjektdataene skal være autoritativ kilde. Preview og eksport genererer media query fra modellen.

## 5. Forskjellige verdier

Det er teknisk mulig å bruke ulike:

- skrifttyper
- fontstørrelser
- synlighetsvalg
- posisjoner
- bredder og høyder

Før dette bygges må vi fastsette hvilke egenskaper som kan overstyres i første versjon.

## 6. CSS-generering

Editoren skal generere ett kontrollert prosjektstilark fremfor mange tilfeldige `<style>`-elementer.

Stilgeneratoren skal:

1. lese prosjektmodellen
2. generere desktopregler
3. generere mobilregler i én samlet media query
4. bruke stabile objekt-ID-er eller genererte klassenavn
5. produsere samme resultat for editor, forhåndsvisning og eksport

`!important` skal ikke brukes som standard.

## 7. Stabile ID-er

ID-er skal beholdes ved:

- automatisk lagring
- lukking og gjenåpning
- import
- forhåndsvisning
- eksport
- publisering

`Math.random()` skal ikke brukes som prosjektidentitet. Elementmodellen bruker kryptografiske UUID-er.

## 8. Editoropplevelse

Når mobilmodus senere er aktiv, skal editoren tydelig vise:

- om en verdi er arvet fra desktop
- om verdien er overstyrt for mobil
- om objektet er skjult i aktuell visning

En mobilendring skal ikke utilsiktet endre desktopverdien.

## 9. Arkitektur

Responsiv funksjonalitet deles i egne ansvarsområder:

- responsive typer og datamodell
- arv og overstyring
- mobilkontroller
- CSS-generator
- forhåndsvisning
- eksport

Dette skal ikke samles i én stor komponent.

## 10. Planlagt branch

```text
feature/mobile-design-controls
```

Den bygges først etter elementmodell, markering, oppretting og grunnleggende objektredigering.

CSS-generatoren kan få en egen branch dersom ansvaret blir stort nok.

## 11. Åpne beslutninger

- endelig mobilbrytepunkt
- egenskaper som kan overstyres i første versjon
- støtte for bare-mobil-visning
- visuell markering av arv og overstyring
- fri eller delvis arvet mobilplassering
- organisering av eksportert HTML og CSS