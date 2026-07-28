# Responsiv design: desktop og mobil

Dette dokumentet beskriver teknisk retning for forskjeller mellom desktop- og mobilvisning.

## 1. Hovedprinsipp

- Ferdige nettsider skal bruke CSS media queries.
- Mobilvisningen skal kunne skjule elementer som fortsatt finnes på desktop.
- Desktop og mobil skal kunne ha egne verdier for utvalgte egenskaper.
- Nøyaktig hvilke egenskaper som kan overstyres bestemmes før mobilkontrollene implementeres.
- Et foreløpig brytepunkt kan være 768 px, men skal testes før det låses.

## 2. Prosjektdata er hovedkilden

```ts
type ResponsiveViewport = 'desktop' | 'mobile'

type ResponsiveValue<T> = {
  desktop: T
  mobile?: T
}
```

`EditorProject` er autoritativ kilde. DOM-en er bare rendering av prosjektdataene.

`ResponsiveViewport` har én autoritativ definisjon i prosjektmodellen. `ViewportMode` er et UI-alias til samme type.

## 3. Implementert grunnlag

Merget til `main`:

- responsive modellfelter for posisjon, størrelse og synlighet
- desktopverdi med valgfri mobilverdi
- mobil fallback til desktop
- skjulte elementer renderer ikke i aktiv viewport
- delt `resolveResponsiveValue`
- avledet lerretshøyde basert på synlige elementer
- nye elementer opprettes med desktopverdier
- mobil arver nye elementers desktopgeometri

Implementert i `feature/drag-resize`:

- PC- og Telefon-visningen kan brukes til å flytte og resize dagens elementer
- clamping bruker den synlige lerretsbredden
- transient preview påvirker avledet lerretshøyde under transform
- varig layout-commit går foreløpig til desktopgeometrien
- ingen mobiloverstyring opprettes skjult

## 4. Midlertidig regel før mobilkontroller

Dagens UI kan ikke opprette mobiloverstyringer. Derfor gjelder:

- nye elementer har bare desktopposisjon og desktopstørrelse
- mobilvisningen arver samme geometri
- transform i PC- og Telefon-visning endrer den delte desktopgeometrien
- låsestatus er felles, ikke viewport-spesifikk

Dette er en kontrollert midlertidig regel, ikke endelig responsiv redigering.

Når mobiloverstyringer bygges, må transform-API og reducer-actions bli viewport-bevisste. En mobiltransform skal da ikke utilsiktet overskrive desktopgeometrien.

## 5. Krav til `feature/mobile-design-controls`

Fasen må avklare og bygge:

- hvilke egenskaper som kan overstyres på mobil
- tydelig visning av arv kontra overstyring
- opprette eller fjerne mobiloverstyring
- reset til desktopverdi
- skjul på mobil
- viewport-bevisst flytting og resizing
- viewport-bevisst elementoppretting
- markering av element som er skjult i aktiv visning
- hvordan historikk og lagring representerer en mobilendring

Layout-actionen kan ikke fortsette å hete eller oppføre seg som en ren desktop-action når mobilverdier blir redigerbare.

## 6. Lerretshøyde

Lerretshøyden er avledet visning og skal ikke lagres i prosjektfilen.

Den beregnes fra:

- elementer som er synlige i aktiv viewport
- mobilverdi når den finnes
- ellers desktopverdi
- transient preview for elementet som akkurat flyttes eller resizes
- fast luft under nederste element

Ved avbrutt interaksjon fjernes preview uten prosjektmutasjon.

## 7. Oppretting

Elementoppretting er foreløpig desktop-autoritativ:

- plassering beregnes fra eksisterende desktopverdier
- størrelse lagres som desktopverdi
- synlighet lagres som `desktop: true`
- mobil arver verdiene

Når responsiv redigering bygges, må dette avklares på nytt:

- oppretting i aktiv viewport
- bare-mobil-elementer
- skjulte elementers påvirkning på første ledige plass
- eksplisitt mobiloverstyring kontra fortsatt arv

Startplassering skal aldri utvikles til generell kollisjonskontroll. Fri overlapping skal fortsatt være mulig.

## 8. Skjule på mobil

Senere skal brukeren kunne velge at et objekt:

- vises på desktop og mobil
- bare vises på desktop
- eventuelt bare vises på mobil dersom dette godkjennes

Før funksjonen bygges må det avklares:

- om skjuling fjerner markering i aktiv viewport
- hvordan objektverktøy fungerer når valgt element ikke renderer
- om bare-mobil-visning støttes i første versjon
- hvordan skjulte elementer påvirker opprettingsplassering

## 9. CSS-generering

Editoren skal generere ett kontrollert prosjektstilark fremfor mange tilfeldige `<style>`-elementer.

Stilgeneratoren skal:

1. lese prosjektmodellen
2. generere desktopregler
3. generere mobilregler i én samlet media query
4. bruke stabile element-ID-er eller genererte klassenavn
5. gi samme resultat i editor, forhåndsvisning og eksport

`!important` skal ikke brukes som standard.

## 10. Stabile ID-er

ID-er skal beholdes ved:

- automatisk lagring
- lukking og gjenåpning
- import
- forhåndsvisning
- eksport
- publisering

`Math.random()` skal ikke brukes som prosjektidentitet.

## 11. Arkitektur

Responsiv funksjonalitet deles i egne ansvar:

- responsive typer og datamodell
- verdioppløsning og arv
- viewport-bevisste layout-actions
- mobilkontroller
- viewport-bevisst oppretting
- CSS-generator
- forhåndsvisning
- eksport

Dette skal ikke samles i én stor komponent.

## 12. Planlagt branch

```text
feature/mobile-design-controls
```

Den bygges etter grunnleggende objektredigering og låsing.

## 13. Åpne beslutninger

- endelig mobilbrytepunkt
- egenskaper som kan overstyres
- støtte for bare-mobil-visning
- visuell markering av arv og overstyring
- fri eller delvis arvet mobilplassering
- markering av skjult element
- viewport-bevisst opprettingsregel
- organisering av eksportert HTML og CSS
