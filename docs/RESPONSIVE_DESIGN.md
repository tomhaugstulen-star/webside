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
type ResponsiveViewport = 'desktop' | 'mobile'

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

`ResponsiveViewport` har én autoritativ definisjon i prosjektmodellen. UI-typen `ViewportMode` er et alias til denne typen, slik at modell og grensesnitt ikke kan få ulike viewport-unioner.

## 3. Implementert nå

Merget til `main`:

- stabile prosjekt-, side- og element-ID-er
- responsive modellfelter for posisjon, størrelse og synlighet
- desktopverdi med valgfri mobilverdi
- sentral prosjekt-state
- prosjektmodellen som autoritativ datakilde
- eksisterende elementer renderer fra prosjektmodellen
- desktopvisning bruker desktopverdien
- mobilvisning bruker mobilverdien når den finnes
- mobilvisning faller tilbake til desktopverdien når mobilverdien mangler
- elementer med `visibility: false` for aktiv visning renderer ikke
- markering og fokus følger den renderte elementgrensen

Implementert i `feature/element-creation`:

- nye elementer får desktopverdi for posisjon, størrelse og synlighet
- mobil arver desktopverdien fordi mobiloverstyring ikke opprettes ennå
- standardstørrelsene passer innenfor 390 px mobilvisning ved startpunkt x 24 px
- lerretshøyden beregnes fra nederste synlige element i aktiv viewport
- høydeberegningen bruker mobilverdi når den finnes og ellers desktopverdien
- skjulte elementer påvirker ikke avledet lerretshøyde i aktiv viewport
- responsiv verdioppløsning ligger i én delt modellhjelper

Dette er fortsatt bare renderings- og arvegrunnlaget. Brukergrensesnitt for å opprette mobile overstyringer er ikke implementert.

## 4. Oppretting før full responsiv redigering

Elementoppretting er foreløpig desktop-autoritativ:

- plassering beregnes fra eksisterende desktopverdier
- størrelse lagres som desktopverdi
- synlighet lagres som `desktop: true`
- mobil arver disse verdiene

Denne regelen er kontrollert for dagens fase, men må vurderes på nytt når mobiloverstyringer bygges.

Da må dette avklares:

- om oppretting skal skje i aktiv viewport
- hvordan mobile posisjoner påvirker første ledige plass
- hvordan elementer som er skjult i aktiv visning behandles
- hvordan bare-mobil-elementer behandles
- om nytt element skal få en eksplisitt mobiloverstyring eller fortsatt arve desktop

Startplasseringen skal ikke utvikles til generell kollisjonskontroll. Fri overlapping skal fortsatt være mulig etter at draing er implementert.

## 5. Ikke implementert ennå

- kontroller for arv og overstyring
- synlig indikasjon på arvet verdi
- skjul på mobil i brukergrensesnittet
- egen mobilposisjonering fra UI
- viewport-bevisst elementoppretting
- valg av hvilke egenskaper som kan overstyres i første versjon
- CSS-generator
- eksporterte media queries

Desktop- og mobilknappen endrer lerretsbredden. Elementrendererens verdier og avledede lerretshøyde følger valgt visning.

## 6. Skjule på mobil

Brukeren skal senere kunne velge at et objekt:

- vises på desktop og mobil
- bare vises på desktop
- bare vises på mobil dersom dette godkjennes

Prosjektdataene skal være autoritativ kilde. Preview og eksport genererer media query fra modellen.

Før funksjonen bygges må dette avklares:

- om et element som blir skjult i aktiv visning automatisk skal miste markeringen
- hvordan objektverktøy oppfører seg dersom valgt element ikke renderer
- om bare-mobil-visning skal støttes i første versjon
- om skjulte elementer skal reservere opprettingsplass i en annen viewport

## 7. Forskjellige verdier

Det er teknisk mulig å bruke ulike:

- skrifttyper
- fontstørrelser
- synlighetsvalg
- posisjoner
- bredder og høyder

Før mobilkontrollene bygges må det fastsettes hvilke egenskaper som kan overstyres i første versjon.

## 8. CSS-generering

Editoren skal generere ett kontrollert prosjektstilark fremfor mange tilfeldige `<style>`-elementer.

Stilgeneratoren skal:

1. lese prosjektmodellen
2. generere desktopregler
3. generere mobilregler i én samlet media query
4. bruke stabile objekt-ID-er eller genererte klassenavn
5. produsere samme resultat for editor, forhåndsvisning og eksport

`!important` skal ikke brukes som standard.

## 9. Stabile ID-er

ID-er skal beholdes ved:

- automatisk lagring
- lukking og gjenåpning
- import
- forhåndsvisning
- eksport
- publisering

`Math.random()` skal ikke brukes som prosjektidentitet. Elementmodellen bruker kryptografiske UUID-er.

## 10. Editoropplevelse

Når mobilmodus senere er aktiv, skal editoren tydelig vise:

- om en verdi er arvet fra desktop
- om verdien er overstyrt for mobil
- om objektet er skjult i aktuell visning

En mobilendring skal ikke utilsiktet endre desktopverdien.

Markeringsstate er transient og skal ikke lagres som en responsiv prosjektverdi.

Lerretshøyden er avledet visning. Den beregnes fra responsive elementverdier og skal ikke lagres som prosjektdata.

## 11. Arkitektur

Responsiv funksjonalitet deles i egne ansvarsområder:

- responsive typer og datamodell
- verdioppløsning og arv
- mobilkontroller
- viewport-bevisst oppretting
- CSS-generator
- forhåndsvisning
- eksport

Dette skal ikke samles i én stor komponent.

Dagens verdioppløsning ligger i `src/model/resolveResponsiveValue.ts` og brukes av både elementrendering og lerretshøyde. Nye områder skal gjenbruke denne funksjonen fremfor å kopiere fallback-logikken.

## 12. Planlagt branch

```text
feature/mobile-design-controls
```

Den bygges først etter elementmodell, markering, oppretting og grunnleggende objektredigering.

CSS-generatoren kan få en egen branch dersom ansvaret blir stort nok.

## 13. Åpne beslutninger

- endelig mobilbrytepunkt
- egenskaper som kan overstyres i første versjon
- støtte for bare-mobil-visning
- visuell markering av arv og overstyring
- fri eller delvis arvet mobilplassering
- markering av element som er skjult i aktiv visning
- viewport-bevisst opprettingsregel
- organisering av eksportert HTML og CSS
