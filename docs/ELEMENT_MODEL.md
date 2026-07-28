# Element- og prosjektmodell

Dette dokumentet beskriver grunnmodellen som ble utviklet i `feature/element-model` og senere merget til `main`.

## 1. Status

Prosjekt- og elementmodellen er ferdig, lokalt kontrollert, visuelt godkjent og merget til `main` 28. juli 2026.

Bekreftet ved godkjenning:

- `npm run check` bestod
- ESLint bestod
- TypeScript-kontroll bestod
- Dependency Cruiser fant ingen regelbrudd
- produksjonsbuild bestod
- arkitekturrapportene ble regenerert
- editoren åpnet automatisk med `npm run dev`
- blank side og eksisterende editorfunksjoner fungerte visuelt

## 2. Omfang

Modellen definerer prosjektdata og grunnlaget for sentral editor-state.

Den oppretter ikke automatisk synlige elementer. Et nytt prosjekt starter blankt, og faktiske elementer skal først opprettes etter en eksplisitt brukerhandling.

## 3. Prosjektstruktur

Et `EditorProject` inneholder:

- skjemaversjon
- stabil prosjekt-ID
- prosjektnavn
- én eller flere sider
- opprettet- og oppdatert-tidspunkt

Et nytt prosjekt starter med én blank side kalt `Forside`.

`EditorProject` er den autoritative kilden for prosjektdata og skal være grunnlaget for lagring, import, forhåndsvisning, eksport og publisering.

## 4. Sider

Hver side inneholder:

- stabil side-ID
- navn
- slug
- liste over elementer

Aktiv side lagres i editorens sentrale state og er ikke hardkodet i toppmenyen.

## 5. Elementer

Første modell støtter:

- seksjon
- bilde
- tekst
- knapp

Hvert element har:

- stabil ID
- elementtype
- responsiv posisjon
- responsiv størrelse
- responsiv synlighet
- låsestatus

Elementinnhold og konkrete stilfelt legges til i feature-branchen som eier funksjonaliteten.

## 6. Responsive verdier

```ts
type ResponsiveValue<T> = {
  desktop: T
  mobile?: T
}
```

Når mobilverdien mangler, kan mobilvisningen arve desktopverdien.

`feature/element-selection` bruker denne regelen ved lerretsrendering. Kontroller for å opprette og administrere mobile overstyringer bygges senere i `feature/mobile-design-controls`.

## 7. Stabile ID-er

ID-er opprettes med nettleserens kryptografiske UUID-funksjon.

- `crypto.randomUUID()` brukes når tilgjengelig.
- En `crypto.getRandomValues()`-basert UUID brukes som sikker reserve.
- `Math.random()` brukes ikke til prosjektidentitet.

ID-er skal beholdes ved lagring, gjenåpning, import, forhåndsvisning, eksport og publisering.

## 8. Sentral state

`EditorProjectProvider` eier:

- aktiv prosjektmodell
- aktiv side
- transient editor-state som markering

`App.tsx` monterer provideren rundt editorshellet.

Reducerens opprinnelige prosjekt-actions:

- erstatte hele prosjektet etter framtidig åpning eller import
- bytte aktiv side

Markeringsbranchen har senere lagt til valgt element-ID og markeringshandlinger.

## 9. Grense mellom prosjektdata og editor-state

`EditorProject` inneholder varige prosjektdata.

`EditorProjectState` kan i tillegg inneholde transient editor-state, for eksempel:

```ts
selectedElementId: string | null
```

Transient editor-state skal ikke:

- serialiseres som prosjektdata
- utløse autolagring
- inngå i prosjektets angre-/gjør om-historikk
- eksporteres eller publiseres

Denne grensen må bevares når lagring og historikk bygges.

## 10. Gjeldende og neste fase

Gjeldende branch:

```text
feature/element-selection
```

Den bygger markering av eksisterende elementer uten elementoppretting.

Neste branch etter kontrollert merge:

```text
feature/element-creation
```

Den skal opprette faktiske elementer gjennom prosjekt-state/reduceren og legge dem til aktiv side. Den skal ikke opprette tilfeldige DOM-objekter eller blande inn draing, størrelsesendring og innholdsredigering.
