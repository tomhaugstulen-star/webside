# Element- og prosjektmodell

Dette dokumentet beskriver grunnmodellen som bygges i `feature/element-model`.

## Omfang

Denne branchen definerer prosjektdata og sentral prosjekt-state. Den oppretter ikke synlige elementer på lerretet og bygger ikke draing, størrelsesendring, tekstredigering eller bildebehandling.

## Prosjektstruktur

Et prosjekt inneholder:

- skjemaversjon
- stabil prosjekt-ID
- prosjektnavn
- én eller flere sider
- opprettet- og oppdatert-tidspunkt

Et nytt prosjekt starter med én blank side kalt `Forside`.

## Sider

Hver side inneholder:

- stabil side-ID
- navn
- slug
- liste over elementer

Aktiv side lagres i editorens sentrale state og er ikke hardkodet i toppmenyen.

## Elementer

Første modell støtter disse elementtypene:

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

Elementinnhold og konkrete stilfelter legges til i de avgrensede feature-branchene som eier den funksjonaliteten.

## Responsive verdier

Responsive verdier lagres slik:

```ts
type ResponsiveValue<T> = {
  desktop: T
  mobile?: T
}
```

Når mobilverdien mangler, skal mobil senere arve desktopverdien. Denne branchen lagrer bare modellen; arv og redigeringskontroller bygges senere.

## Stabile ID-er

ID-er opprettes med nettleserens kryptografiske UUID-funksjon. `Math.random()` brukes ikke. En sikker `getRandomValues`-basert UUID brukes som reserve dersom `randomUUID()` ikke er tilgjengelig.

## Sentral state

`EditorProjectProvider` eier den aktive prosjektmodellen og siden som redigeres. `App.tsx` monterer provideren rundt editorshellet.

Første reducer støtter:

- erstatte hele prosjektet etter fremtidig åpning eller import
- bytte aktiv side

Oppretting, endring og sletting av elementer legges ikke inn før de respektive fasene i arbeidsplanen.

## Kontrollkrav

Før branchen godkjennes skal følgende kjøres:

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
npm run dev
```

Visuelt skal editoren fortsatt åpne med blank side, og toppmenyen skal vise navnet på aktiv side fra prosjektmodellen.
