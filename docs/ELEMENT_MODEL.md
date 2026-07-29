# Element- og prosjektmodell

Dette dokumentet beskriver den autoritative prosjektmodellen for Website-editoren.

## 1. Gjeldende status

Grunnmodellen ble utviklet i `feature/element-model` og er senere utvidet kontrollert av feature-branchene som eier nye varige elementdata.

Gjeldende skjemaversjon på `main`:

```ts
EDITOR_PROJECT_SCHEMA_VERSION = 5
```

Historiske skjematrinn:

```text
versjon 1  grunnmodell for prosjekt, sider og elementer
versjon 2  varig tekstinnhold
versjon 3  varig tekststil
versjon 4  varig elementlenke
versjon 5  stabilt knappasset, knappetekst og knappelenke
```

Det finnes foreløpig ingen prosjektlagring eller import. Migrering mellom skjemaversjoner bygges sammen med `feature/project-open-import`.

## 2. Prosjektstruktur

Et `EditorProject` inneholder:

- skjemaversjon
- stabil prosjekt-ID
- prosjektnavn
- én eller flere sider
- opprettet- og oppdatert-tidspunkt

Et nytt prosjekt starter med én blank side kalt `Forside`.

`EditorProject` er framtidig autoritativ kilde for lagring, import, forhåndsvisning, eksport og publisering.

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

```ts
type EditorElement =
  | SectionEditorElement
  | ImageEditorElement
  | TextEditorElement
  | ButtonEditorElement
```

### Seksjon

```ts
type SectionEditorElement = BaseEditorElement & {
  kind: 'section'
}
```

### Bilde

```ts
type ImageEditorElement = BaseEditorElement & {
  kind: 'image'
}
```

Bildeelementet har foreløpig bare felles elementdata og geometri. Bildekilde, ressurs-ID, filmetadata, alt-tekst og skaleringsmodell er ikke implementert ennå og skal avklares i fase 11 – Bilder.

### Tekstelement

```ts
type TextEditorElement = BaseEditorElement & {
  kind: 'text'
  content: string
  textStyle: TextElementStyle
  link: ElementLink
}
```

Nye tekstbokser starter med:

```text
content: ''
textStyle: DEFAULT_TEXT_ELEMENT_STYLE
link: none
```

Tom tekst er gyldig. Editor-placeholder er ikke prosjektdata.

### Knappelement

```ts
type ButtonEditorElement = BaseEditorElement & {
  kind: 'button'
  assetId: ButtonAssetId
  label: string
  link: ElementLink
}
```

Nye knapper starter med:

```text
assetId: button.primary-rounded.v1
label: Les mer
link: none
```

`assetId`, `label` og `link` er obligatorisk varig prosjektdata for knappen.

## 5. Stabil knappasset-ID

`ButtonAssetId` er en brandet, validert streng.

Regler:

- ID-en er stabil prosjektidentitet
- ID-en er ikke filsti eller import-URL
- ID-en er ikke `keyof` den nåværende katalogen
- modellaget importerer ikke SVG-filer
- publiserte ID-er endres eller slettes ikke uten migrering eller kompatibilitetsmapping
- vesentlig visuell eller skaleringsmessig endring får ny versjonert ID

Første ID-er:

```text
button.primary-rounded.v1
button.secondary-rounded.v1
button.outline-rounded.v1
button.dark-rounded.v1
```

En ukjent lagret ID skal ikke krasje editoren. Rendering bruker kontrollert fallback, og høyremenyen viser reparasjonsvalg.

## 6. Knappetekst

`label` er ekte HTML-tekst, ikke tekst i SVG-filen.

Regler:

- brukes som synlig knappetekst
- brukes som tilgjengelig navn
- trimmes før lagring
- tom eller whitespace-only tekst avvises
- uendret tekst gir ingen prosjektmutasjon
- låst knapp kan inspiseres, men ikke endres

## 7. Tekststil

`textStyle` er varig prosjektdata bare for tekstelementer og inneholder kontrollerte verdier for:

- fontfamilie
- fontstørrelse
- fontvekt
- fontstil
- tekstjustering
- linjehøyde

Tekststilen gjelder hele tekstboksen. Riktekst og tegnbaserte stilspenn er ikke del av modellen.

## 8. Elementlenke

`link` er varig prosjektdata og bruker en diskriminert union:

```text
none
external-url { url, openInNewTab }
```

På `main` støttes lenken av:

- tekstbokser
- knapper

Regler:

- bare absolutte `http://`- og `https://`-adresser godtas
- ugyldig URL muterer ikke prosjektet
- uendret lenke muterer ikke prosjektet
- lenken aktiveres ikke i editormodus
- teksten eller knappen får lenken som helhet
- enkeltord og tekstsegmenter har ikke egne lenker

## 9. Responsive verdier

```ts
type ResponsiveValue<T> = {
  desktop: T
  mobile?: T
}
```

Når mobilverdien mangler, arver Telefon-visningen desktopverdien.

Responsive verdier:

- posisjon
- størrelse
- synlighet

Foreløpig felles for PC og Telefon:

- låsestatus
- tekstinnhold
- tekststil
- elementlenke
- knappens `assetId`
- knappens `label`

Eksplisitte mobiloverstyringer bygges i `feature/mobile-design-controls`.

## 10. Stabile ID-er

Element-, side- og prosjekt-ID-er opprettes med nettleserens kryptografiske UUID-funksjon.

- `crypto.randomUUID()` brukes når tilgjengelig
- `crypto.getRandomValues()` brukes som sikker reserve
- `Math.random()` brukes ikke til prosjektidentitet

## 11. Sentral state

`EditorProjectProvider` eier:

- aktiv prosjektmodell
- aktiv side
- transient editor-state som markering

Varige mutasjoner går gjennom uttømmende reducer-actions, blant annet:

- erstatte prosjekt
- bytte aktiv side
- opprette og slette element
- endre desktopgeometri
- endre låsestatus
- endre tekstinnhold og tekststil
- endre elementlenke
- endre knappetekst
- endre knappdesign

Høyremenyen eier aldri en separat elementmodell. Den leser valgt element fra autoritativ state og sender typede brukerintensjoner tilbake til state-laget.

## 12. Validerte reducergrenser

Reducergrensene krever:

- aktiv side
- eksisterende element på aktiv side
- riktig elementtype
- ulåst element ved mutasjon
- gyldig verdi
- faktisk endring

Knappespesifikke krav:

- oppretting med knapp krever kjent katalog-ID
- designbytte krever kjent katalog-ID
- knappetekst må være ikke-tom etter trimming

Lenkekrav:

- bare `none` eller gyldig `external-url`
- URL må normaliseres og valideres

Ugyldige eller uendrede actions returnerer samme state og endrer ikke `updatedAt`.

## 13. Prosjektdata og transient editor-state

Varig prosjektdata:

- sider og elementer
- geometri og synlighet
- låsestatus
- tekstinnhold og tekststil
- elementlenke
- knappens asset-ID og label
- tidsstempler

Transient editor-state:

- `selectedElementId`
- pekerinteraksjon og layout-preview
- aktiv tekstredigeringsøkt
- tekst-, knappetekst- og lenkedrafts
- katalogvisning
- validering og feedback
- slettedialogens mål og fokusreferanse
- åpne paneler, fokus og hover

Transient state skal ikke serialiseres, eksporteres eller publiseres.

## 14. Videre modellutvidelser

Planlagte eksempler:

- bildeinnhold i `feature/image-import-and-placement`
- prosjektfarger i `feature/project-colors`
- eksplisitte mobiloverstyringer i `feature/mobile-design-controls`
- historikk i `feature/history-system`
- lagring og migrering i senere lagringsfaser

Ingen av disse utvidelsene er aktiv produksjonsfase før omfanget er eksplisitt valgt og godkjent.

Se også `docs/BUTTON_LIBRARY.md` og `docs/ELEMENT_LINKS.md`.
