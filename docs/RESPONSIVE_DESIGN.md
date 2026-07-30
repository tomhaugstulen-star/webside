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

Dette er en kontrollert midlertidig regel fram til fase 15.

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
- Header-logo, tekst og utseende

## Header

Header har en egen responsiv visningsregel:

- rendres alltid ved `x = 0`
- bruker hele bredden til aktivt PC- eller Telefon-lerret
- lagrer ikke DOM-målt bredde som prosjektdata
- kan bare flyttes vertikalt
- høyde er 70–100 px
- Telefon arver desktop y/høyde inntil egne mobiloverstyringer bygges

Når lerretsbredden endres, oppdateres Headerens renderingsbredde via `ResizeObserver`. Dette er transient visning og muterer ikke prosjektet.

## Lerretshøyde

Lerretshøyden er avledet og lagres ikke. Den beregnes fra:

- synlige elementer i aktiv viewport
- mobilverdi når den finnes
- ellers desktopverdi
- transient preview under transform
- fast luft under nederste element

Avbrutt transform fjerner preview uten prosjektmutasjon.

## Fase 15 – mobiloverstyringer

Før implementering må følgende låses:

- hvilke egenskaper som kan overstyres
- tydelig arv kontra eget mobiloppsett
- opprette og fjerne mobiloverstyring
- skjul på mobil
- viewport-bevisst flytting og størrelsesendring
- oppretting i aktiv viewport
- historikk og autolagring for mobilendringer

Minimum:

- egen mobilposisjon
- egen mobilbredde og -høyde der elementtypen tillater det
- egen mobilsynlighet
- `Bruk PC-oppsett` som fjerner mobiloverstyringen

Header må fortsatt være full bredde i aktiv viewport. En framtidig mobiloverstyring for Header gjelder derfor y, høyde og eventuelt synlighet, ikke fri x/bredde, med mindre produktmodellen endres eksplisitt.

## Viewport-bevisste actions

Senere layoutactions må angi viewport:

- desktop-action endrer bare desktop
- mobile-action endrer bare mobile
- reset-action fjerner mobile
- låst, ugyldig og uendret layout ignoreres
- preview forblir transient

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

Disse beslutningene tilhører fase 15 og bygges ikke inn i fase 13.
