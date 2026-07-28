# Element- og prosjektmodell

Dette dokumentet beskriver grunnmodellen i `feature/element-model`.

## 1. Status

Branchen er ferdig utviklet og godkjent 28. juli 2026.

Bekreftet lokalt:

- `npm run check` bestod
- ESLint bestod
- TypeScript-kontroll bestod
- Dependency Cruiser fant ingen regelbrudd
- produksjonsbuild bestod
- arkitekturrapportene ble regenerert
- editoren åpnet automatisk med `npm run dev`
- den blanke siden og eksisterende editorfunksjoner fungerte visuelt

Branchen skal merges til `main` før neste feature-branch opprettes.

## 2. Omfang

Branchen definerer prosjektdata og sentral prosjekt-state. Den oppretter ikke synlige elementer på lerretet og bygger ikke markering, draing, størrelsesendring, tekstredigering eller bildebehandling.

## 3. Prosjektstruktur

Et prosjekt inneholder:

- skjemaversjon
- stabil prosjekt-ID
- prosjektnavn
- én eller flere sider
- opprettet- og oppdatert-tidspunkt

Et nytt prosjekt starter med én blank side kalt `Forside`.

## 4. Sider

Hver side inneholder:

- stabil side-ID
- navn
- slug
- liste over elementer

Aktiv side lagres i editorens sentrale state og er ikke hardkodet i toppmenyen.

## 5. Elementer

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

Elementinnhold og konkrete stilfelt legges til i de avgrensede feature-branchene som eier funksjonaliteten.

## 6. Responsive verdier

```ts
type ResponsiveValue<T> = {
  desktop: T
  mobile?: T
}
```

Når mobilverdien mangler, skal mobil senere arve desktopverdien. Denne branchen lagrer bare modellen. Arv, overstyring og mobilkontroller bygges senere i `feature/mobile-design-controls`.

## 7. Stabile ID-er

ID-er opprettes med nettleserens kryptografiske UUID-funksjon. `Math.random()` brukes ikke. En sikker `getRandomValues`-basert UUID brukes som reserve dersom `randomUUID()` ikke er tilgjengelig.

## 8. Sentral state

`EditorProjectProvider` eier den aktive prosjektmodellen og siden som redigeres. `App.tsx` monterer provideren rundt editorshellet.

Første reducer støtter:

- erstatte hele prosjektet etter fremtidig åpning eller import
- bytte aktiv side

Oppretting, endring og sletting av elementer legges ikke inn før de respektive fasene i arbeidsplanen.

## 9. Neste fase

Neste planlagte branch er:

```text
feature/element-selection
```

Den skal bygges fra oppdatert `main` etter at `feature/element-model` er merget.

Fasen skal bare bygge:

- valgt element-ID i editor-state
- valg av ett eksisterende element
- tydelig valgt tilstand
- klikk utenfor for å fjerne markering
- grunnlag for senere objektverktøy

Elementoppretting skal ikke blandes inn i denne branchen.