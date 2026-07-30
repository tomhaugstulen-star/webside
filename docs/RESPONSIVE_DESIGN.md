# Responsiv design

Dette dokumentet beskriver gjeldende arv og grensene for senere mobiloverstyringer.

## Hovedmodell

```ts
type ResponsiveViewport = 'desktop' | 'mobile'

type ResponsiveValue<T> = {
  desktop: T
  mobile?: T
}
```

`EditorProject` er autoritativ. DOM og CSS er rendering.

- Manglende `mobile` betyr arv fra desktop.
- Reset til desktop skal senere fjerne mobilverdien, ikke kopiere desktop inn i `mobile`.
- Dagens UI oppretter ikke mobiloverstyringer.
- Transform i PC- og Telefon-visning endrer derfor den delte desktopgeometrien.

Dette er en kontrollert midlertidig regel fram til en egen mobilfase.

## Gjeldende responsive verdier

- posisjon
- størrelse
- synlighet

Foreløpig felles for PC og Telefon:

- innhold og tekststil
- lenker
- låsestatus
- farger og rammer
- bildeasset, metadata og utsnitt
- Header-logo, tekst, fontfamilie, fontstørrelse og utseende

## Header

Header har en deterministisk responsiv visningsregel:

- rendres alltid ved `x = 0, y = 0`
- bruker hele bredden til aktivt PC- eller Telefon-lerret
- lagrer ikke DOM-målt bredde som prosjektdata
- kan ikke flyttes
- høyde er 70–100 px
- høyden er foreløpig felles for PC og Telefon
- fontstørrelse er foreløpig felles for PC og Telefon

Når lerretsbredden endres, oppdateres Headerens renderingsbredde via `ResizeObserver`. Dette er transient visning og muterer ikke prosjektet.

En framtidig mobiloverstyring for Header kan gjelde høyde og eventuelt synlighet. Fri `x`, `y` eller bredde inngår ikke uten en ny eksplisitt produktendring.

## Korrigeringslinjer i aktiv viewport

Alignment-mål bygges fra aktiv viewport:

- synlighet løses for aktiv viewport
- elementposisjon og størrelse bruker mobilverdi når den finnes, ellers desktop
- Header normaliseres til fast topp og aktiv lerretsbredde
- horisontal og vertikal lerretsmidt bruker aktivt lerretsmål
- mål fryses ved pekerstart
- guider og preview er transient

Fase 14 oppretter ingen mobiloverstyring og endrer ikke arvemodellen.

## Lerretshøyde

Lerretshøyden er avledet og lagres ikke. Den beregnes fra:

- synlige elementer i aktiv viewport
- mobilverdi når den finnes
- ellers desktopverdi
- transient preview under transform
- fast luft under nederste element

Header behandles ved `y = 0` uavhengig av eventuelle eldre lagrede verdier. Avbrutt transform fjerner preview uten prosjektmutasjon.

## Senere mobiloverstyringer

Før implementering må følgende låses:

- hvilke egenskaper som kan overstyres
- tydelig arv kontra eget mobiloppsett
- opprette og fjerne mobiloverstyring
- skjul på mobil
- viewport-bevisst flytting og størrelsesendring
- oppretting i aktiv viewport
- historikk og autolagring for mobilendringer

Minimum for frie elementer:

- egen mobilposisjon
- egen mobilbredde og -høyde der elementtypen tillater det
- egen mobilsynlighet
- `Bruk PC-oppsett` som fjerner mobiloverstyringen

Header må fortsatt være fast øverst og full bredde. Første mobilversjon bør derfor bare vurdere høyde og synlighet for Header.

## Viewport-bevisste actions

Senere layoutactions må angi viewport:

- desktop-action endrer bare desktop
- mobile-action endrer bare mobile
- reset-action fjerner mobile
- låst, ugyldig og uendret layout ignoreres
- preview forblir transient
- Header-invarianten håndheves uavhengig av viewport

Mobilendringer skal aldri skrives inn i desktopfeltet implisitt.

## Publisering

Ferdige nettsider skal bruke kontrollert generert CSS:

1. les prosjektmodellen
2. generer desktopregler
3. generer mobilregler i én samlet media query
4. bruk stabile element-ID-er eller genererte klassenavn
5. gi samme resultat i editor, forhåndsvisning og eksport

`!important` skal ikke brukes som standard.

## Åpne beslutninger

- endelig brytepunkt
- støtte for bare-mobil-elementer
- visuell status for arv og overstyring
- markering av skjulte elementer
- hvilke stilverdier som eventuelt blir responsive

Disse beslutningene tas først når mobilfasen velges eksplisitt.
