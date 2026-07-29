# Element- og prosjektmodell

Dette dokumentet beskriver den autoritative prosjektmodellen for Website-editoren.

## 1. Gjeldende status

Grunnmodellen ble utviklet i `feature/element-model` og er senere utvidet kontrollert av feature-branchene som eier nye varige elementdata.

Gjeldende skjemaversjon:

```ts
EDITOR_PROJECT_SCHEMA_VERSION = 4
```

Historiske skjematrinn:

```text
versjon 1  grunnmodell for prosjekt, sider og elementer
versjon 2  varig tekstinnhold fra feature/text-box-editing
versjon 3  varig tekststil fra feature/text-properties
versjon 4  varig elementlenke fra feature/element-links
```

Versjon 2 og 3 er historiske milepæler, ikke gjeldende prosjektstatus.

Det finnes foreløpig ingen prosjektlagring eller import. Migrering mellom skjemaversjoner bygges sammen med `feature/project-open-import`.

## 2. Prosjektstruktur

Et `EditorProject` inneholder:

- skjemaversjon
- stabil prosjekt-ID
- prosjektnavn
- én eller flere sider
- opprettet- og oppdatert-tidspunkt

Et nytt prosjekt starter med én blank side kalt `Forside`.

`EditorProject` er autoritativ kilde for lagring, import, forhåndsvisning, eksport og publisering når disse funksjonene bygges.

## 3. Sider

Hver side inneholder:

- stabil side-ID
- navn
- slug
- liste over elementer

Aktiv side ligger i editorens sentrale state.

Prosjektmodellen er flat:

```text
page.elements: EditorElement[]
```

En Seksjon eier derfor ikke elementer som ligger visuelt over den. Foreldre-/barnemodell er ikke innført.

## 4. Elementunion

`EditorElement` er en diskriminert union basert på `kind`.

Felles felter:

- stabil ID
- responsiv posisjon
- responsiv størrelse
- responsiv synlighet
- låsestatus

Elementtyper:

```ts
type EditorElement =
  | SectionEditorElement
  | ImageEditorElement
  | TextEditorElement
  | ButtonEditorElement
```

Bare tekstobjektet har obligatorisk tekstinnhold, tekststil og lenkedata:

```ts
type TextEditorElement = BaseEditorElement & {
  kind: 'text'
  content: string
  textStyle: TextElementStyle
  link: ElementLink
}
```

Dette hindrer at kode leser eller skriver tekstdata på Seksjon, Bilde eller Knapp uten først å snevre typen til `kind: 'text'`.

Nye tekstbokser starter med:

```ts
content: ''
textStyle: DEFAULT_TEXT_ELEMENT_STYLE
link: { type: 'none' }
```

Tom tekst er gyldig. Editor-placeholder er ikke prosjektdata.

## 5. Tekststil

`textStyle` er varig prosjektdata og inneholder kontrollerte verdier for:

- fontfamilie
- fontstørrelse
- fontvekt
- fontstil
- tekstjustering
- linjehøyde

Tekststilen gjelder hele tekstboksen. Riktekst og tegnbaserte stilspenn er ikke del av modellen.

Tekststil er foreløpig felles for PC og Telefon. Mobile tekststiloverstyringer krever en egen produkt- og modellbeslutning.

Se `docs/TEXT_PROPERTIES.md`.

## 6. Elementlenke

`link` er varig prosjektdata og bruker en diskriminert union:

```text
none
external-url { url, openInNewTab }
```

Gjeldende implementering kobler lenken til hele tekstboksen.

Regler:

- bare absolutte `http://`- og `https://`-adresser godtas
- ugyldig URL muterer ikke prosjektet
- lenken aktiveres ikke i editormodus
- enkeltord og tekstsegmenter har ikke egne lenker
- samme lenkemodell kan senere gjenbrukes av grafiske knapper

Se `docs/ELEMENT_LINKS.md`.

## 7. Responsive verdier

```ts
type ResponsiveValue<T> = {
  desktop: T
  mobile?: T
}
```

Når mobilverdien mangler, arver Telefon-visningen desktopverdien.

Følgende er responsive:

- posisjon
- størrelse
- synlighet

Følgende er foreløpig felles for PC og Telefon:

- låsestatus
- tekstinnhold
- tekststil
- elementlenke

Kontroller for eksplisitte mobiloverstyringer bygges i `feature/mobile-design-controls`.

## 8. Stabile ID-er

ID-er opprettes med nettleserens kryptografiske UUID-funksjon.

- `crypto.randomUUID()` brukes når tilgjengelig.
- `crypto.getRandomValues()` brukes som sikker reserve.
- `Math.random()` brukes ikke til prosjektidentitet.

ID-er beholdes ved framtidig lagring, gjenåpning, import, eksport og publisering.

## 9. Sentral state

`EditorProjectProvider` eier:

- aktiv prosjektmodell
- aktiv side
- transient editor-state som markering

Varige mutasjoner går gjennom uttømmende reducer-actions, blant annet:

- erstatte prosjekt
- bytte aktiv side
- opprette element
- slette element
- endre desktopgeometri
- endre låsestatus
- endre tekstinnhold
- endre tekststil
- endre elementlenke

State-avhengige resultater beregnes fra reducerens nyeste state.

Høyremenyen eier aldri en separat elementmodell. Den leser valgt element fra autoritativ state og sender typede brukerintensjoner tilbake til state-laget.

## 10. Prosjektdata og transient editor-state

Varig prosjektdata:

- sider og elementer
- geometri
- synlighet
- låsestatus
- tekstinnhold
- tekststil
- elementlenke
- tidsstempler

Transient editor-state:

- `selectedElementId`
- aktiv pekerinteraksjon
- layout-preview
- aktiv tekstredigeringsøkt
- lokal tekstdraft
- lenkeskjemaets draft og feedback
- slettedialogens mål og fokusreferanse
- åpne paneler, fokus, hover og lokal UI-feedback

Transient state skal ikke:

- serialiseres som prosjektdata
- utløse autolagring direkte
- inngå direkte i historikk
- eksporteres eller publiseres

## 11. Validerte tekstmutasjoner

Tekstinnhold, tekststil og elementlenke endres gjennom egne reducer-overganger.

Reducergrensene:

- krever aktiv side og eksisterende element
- krever `kind: 'text'`
- avviser låst element
- validerer verdien som tilhører handlingen
- avviser uendret data
- oppdaterer `updatedAt` ved reell endring

Tekstinnhold normaliserer linjeskift til `\n`. Tekststil bruker kontrollerte tokens og verdier. Elementlenken validerer lenketype og URL før prosjektet muteres.

## 12. Videre modellutvidelser

Nye varige egenskaper legges til i branchen som eier funksjonen.

Planlagte eksempler:

- grafisk knappinnhold og tilgjengelig navn i en framtidig knappbibliotekfase
- bildeinnhold i `feature/image-import-and-placement`
- prosjektfarger i `feature/project-colors`
- eksplisitte mobiloverstyringer i `feature/mobile-design-controls`

Den parkerte `feature/button-element`-branchen er ikke gjeldende plan og skal ikke røres eller merges. Sak #12 er lukket som `not_planned`.