# Element- og prosjektmodell

Dette dokumentet beskriver den autoritative prosjektmodellen for Website-editoren.

## 1. Status

Grunnmodellen ble utviklet i `feature/element-model` og er senere utvidet kontrollert av feature-branchene som eier nye varige elementdata.

Gjeldende skjemaversjon:

```ts
EDITOR_PROJECT_SCHEMA_VERSION = 2
```

Versjon 2 ble innført i `feature/text-box-editing` fordi tekstobjekter fikk varig tekstinnhold.

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

Bare tekstobjektet har tekstinnhold:

```ts
type TextEditorElement = BaseEditorElement & {
  kind: 'text'
  content: string
}
```

Dette hindrer at kode leser eller skriver tekstinnhold på Seksjon, Bilde eller Knapp uten først å snevre typen til `kind: 'text'`.

Nye tekstbokser starter med:

```ts
content: ''
```

Tom tekst er gyldig. Editor-placeholder er ikke prosjektdata.

## 5. Responsive verdier

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

Kontroller for eksplisitte mobiloverstyringer bygges i `feature/mobile-design-controls`.

## 6. Stabile ID-er

ID-er opprettes med nettleserens kryptografiske UUID-funksjon.

- `crypto.randomUUID()` brukes når tilgjengelig.
- `crypto.getRandomValues()` brukes som sikker reserve.
- `Math.random()` brukes ikke til prosjektidentitet.

ID-er beholdes ved framtidig lagring, gjenåpning, import, eksport og publisering.

## 7. Sentral state

`EditorProjectProvider` eier:

- aktiv prosjektmodell
- aktiv side
- transient editor-state som markering

Varige mutasjoner går gjennom uttømmende reducer-actions, blant annet:

- erstatte prosjekt
- bytte aktiv side
- opprette element
- endre desktopgeometri
- endre låsestatus
- endre tekstinnhold

State-avhengige resultater beregnes fra reducerens nyeste state.

## 8. Prosjektdata og transient editor-state

Varig prosjektdata:

- sider og elementer
- geometri
- synlighet
- låsestatus
- tekstinnhold
- tidsstempler

Transient editor-state:

- `selectedElementId`
- aktiv pekerinteraksjon
- layout-preview
- aktiv tekstredigeringsøkt
- lokal tekstdraft
- åpne paneler og fokus

Transient state skal ikke:

- serialiseres som prosjektdata
- utløse autolagring direkte
- inngå direkte i historikk
- eksporteres eller publiseres

## 9. Tekstcommit

Tekstinnhold endres gjennom en egen reducer-overgang.

Den:

- krever aktiv side og eksisterende element
- krever `kind: 'text'`
- avviser låst element
- normaliserer linjeskift til `\n`
- avviser uendret tekst
- oppdaterer `updatedAt` ved reell endring

Se `docs/TEXT_BOX_EDITING.md`.

## 10. Videre modellutvidelser

Nye varige egenskaper legges til i branchen som eier funksjonen.

Planlagte eksempler:

- teksttypografi i `feature/text-properties`
- knappinnhold og handling i `feature/button-element`
- bildeinnhold i `feature/image-import-and-placement`
- prosjektfarger i `feature/project-colors`
- mobiloverstyringer i `feature/mobile-design-controls`

Høyremenyen skal ikke eie en separat elementmodell. Den skal lese valgt element fra autoritativ state og sende typed brukerintensjoner tilbake til state-laget.
