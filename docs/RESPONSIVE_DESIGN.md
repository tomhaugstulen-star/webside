# Responsiv design: desktop og mobil

Dette dokumentet beskriver teknisk retning for forskjeller mellom desktop- og mobilvisning.

## 1. Hovedprinsipp

- Ferdige nettsider skal bruke CSS media queries.
- Mobilvisningen skal kunne skjule elementer som fortsatt finnes på desktop.
- Desktop og mobil skal kunne ha egne verdier for utvalgte egenskaper.
- Nøyaktig hvilke egenskaper som kan overstyres bestemmes før mobilkontrollene implementeres.
- Et foreløpig brytepunkt kan være 768 px, men skal testes før det låses.

## 2. Prosjektdata er hovedkilden

Editoren skal ikke bruke DOM-strukturen som permanent prosjektlagring.

Prosjektmodellen inneholder:

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

`EditorProject` er autoritativ kilde. DOM-en er bare en rendering av prosjektdataene.

## 3. Implementert nå

Merget til `main` gjennom prosjekt- og elementmodellen:

- stabile prosjekt-, side- og element-ID-er
- responsive modellfelter for posisjon, størrelse og synlighet
- desktopverdi med valgfri mobilverdi
- sentral prosjekt-state
- prosjektmodellen som autoritativ datakilde

Implementert i `feature/element-selection`:

- eksisterende elementer renderer på lerretet fra prosjektmodellen
- desktopvisning bruker desktopverdien
- mobilvisning bruker mobilverdien når den finnes
- mobilvisning faller tilbake til desktopverdien når mobilverdien mangler
- elementer med `visibility: false` for aktiv visning renderer ikke
- markering og fokus følger den renderte elementgrensen

Dette er bare renderingsgrunnlaget. Brukergrensesnitt for å opprette mobile overstyringer er ikke implementert.

## 4. Ikke implementert ennå

- kontroller for arv og overstyring
- synlig indikasjon på arvet verdi
- skjul på mobil i brukergrensesnittet
- egen mobilposisjonering fra UI
- valg av hvilke egenskaper som kan overstyres i første versjon
- CSS-generator
- eksporterte media queries

Desktop- og mobilknappen endrer fortsatt lerretsbredden. Elementrendererens verdier følger valgt visning når elementer finnes.

## 5. Skjule på mobil

Brukeren skal senere kunne velge at et objekt:

- vises på desktop og mobil
- bare vises på desktop
- bare vises på mobil dersom dette godkjennes

Prosjektdataene skal være autoritativ kilde. Preview og eksport genererer media query fra modellen.

Før funksjonen bygges må dette avklares:

- om et element som blir skjult i aktiv visning automatisk skal miste markeringen
- hvordan objektverktøy oppfører seg dersom valgt element ikke renderer
- om bare-mobil-visning skal støttes i første versjon

## 6. Forskjellige verdier

Det er teknisk mulig å bruke ulike:

- skrifttyper
- fontstørrelser
- synlighetsvalg
- posisjoner
- bredder og høyder

Før mobilkontrollene bygges må det fastsettes hvilke egenskaper som kan overstyres i første versjon.

## 7. CSS-generering

Editoren skal generere ett kontrollert prosjektstilark fremfor mange tilfeldige `<style>`-elementer.

Stilgeneratoren skal:

1. lese prosjektmodellen
2. generere desktopregler
3. generere mobilregler i én samlet media query
4. bruke stabile objekt-ID-er eller genererte klassenavn
5. produsere samme resultat for editor, forhåndsvisning og eksport

`!important` skal ikke brukes som standard.

## 8. Stabile ID-er

ID-er skal beholdes ved:

- automatisk lagring
- lukking og gjenåpning
- import
- forhåndsvisning
- eksport
- publisering

`Math.random()` skal ikke brukes som prosjektidentitet. Elementmodellen bruker kryptografiske UUID-er.

## 9. Editoropplevelse

Når mobilmodus senere er aktiv, skal editoren tydelig vise:

- om en verdi er arvet fra desktop
- om verdien er overstyrt for mobil
- om objektet er skjult i aktuell visning

En mobilendring skal ikke utilsiktet endre desktopverdien.

Markeringsstate er transient og skal ikke lagres som en responsiv prosjektverdi.

## 10. Arkitektur

Responsiv funksjonalitet deles i egne ansvarsområder:

- responsive typer og datamodell
- verdioppløsning og arv
- mobilkontroller
- CSS-generator
- forhåndsvisning
- eksport

Dette skal ikke samles i én stor komponent.

Dagens verdioppløsning ligger ved lerretsrenderingen. Dersom flere editorområder trenger samme logikk, skal den trekkes ut til én delt, testbar funksjon i den fasen som eier responsiv redigering. Logikken skal ikke kopieres ukontrollert.

## 11. Planlagt branch

```text
feature/mobile-design-controls
```

Den bygges først etter elementmodell, markering, oppretting og grunnleggende objektredigering.

CSS-generatoren kan få en egen branch dersom ansvaret blir stort nok.

## 12. Åpne beslutninger

- endelig mobilbrytepunkt
- egenskaper som kan overstyres i første versjon
- støtte for bare-mobil-visning
- visuell markering av arv og overstyring
- fri eller delvis arvet mobilplassering
- markering av element som er skjult i aktiv visning
- organisering av eksportert HTML og CSS
