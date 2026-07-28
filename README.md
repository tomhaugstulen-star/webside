# Website-editor

Lokal webside-editor bygget med React, TypeScript og Vite.

Editoren åpner med et blankt, hvitt lerret og skal gi kontroll over elementer, tekst, bilder, knapper, farger, header, desktop/mobil og lokal prosjektlagring.

## Lokal mappe

```text
C:\Users\tomha\Desktop\website
```

## Starte prosjektet

```powershell
cd C:\Users\tomha\Desktop\website
npm install
npm run dev
```

`npm run dev` bruker `vite --open` og åpner editoren automatisk i standardnettleseren.

## Kvalitetskontroll

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
```

`npm run check` kjører ESLint, TypeScript-kontroll, Dependency Cruiser og produksjonsbuild.

Arkitekturrapportene skrives til:

```text
architecture.json
docs/dependency-graph.mmd
```

## Branch-regel

Det utvikles aldri direkte på `main`.

```text
main
  → egen avgrenset branch
  → implementering
  → npm run check
  → arkitekturrapporter ved strukturendringer
  → visuell kontroll
  → dokumentasjon
  → kontrollert merge til main
```

Etter hver repoendring skal brukeren få de nøyaktige PowerShell-kommandoene som skal kjøres lokalt.

## Gjeldende status

Ferdig og merget til `main`:

- stabilt editorgrunnlag
- blankt desktop- og mobillerret
- toppmeny og venstremeny
- kontrollert paneloppførsel
- Elementer-panel med Seksjon, Bilde, Tekst og Knapp
- Dependency Cruiser og samlet `npm run check`
- automatisk nettleseråpning
- prosjekt- og elementmodell
- skjemaversjon, sikre ID-er, sider og responsive elementverdier
- sentral prosjekt-state og aktiv side

Gjeldende branch:

```text
feature/element-selection
```

Ferdig og visuelt godkjent på branchen:

- valgt element-ID i transient editor-state
- valg av ett eksisterende element
- tydelig valgt og fokusert tilstand
- klikk på tomt lerret fjerner markeringen
- Enter og mellomrom markerer fokusert element
- ugyldige markeringsforespørsler ignoreres
- markering ryddes ved side-/prosjektbytte og når elementet ikke finnes
- ingen testelementer eller produksjonsinnhold ligger igjen
- et nytt prosjekt åpner fortsatt helt blankt

Den siste reducer-herdingen og dokumentendringene må gjennom `npm run check` før merge.

Neste planlagte branch etter merge:

```text
feature/element-creation
```

Den skal bare opprette faktiske elementer fra Elementer-panelet. Draing, størrelsesendring, låsing og innholdsredigering kommer senere.

## Viktig state-grense

`selectedElementId` er transient editor-state. Den skal ikke lagres i prosjektfilen, eksporteres, publiseres eller inngå i prosjektets historikk/autolagring.

`EditorProject` er fortsatt den autoritative kilden for sider og elementer.

## Dokumentasjon

Les i denne rekkefølgen ved ny chat eller overlevering:

1. `docs/NEXT_CHAT_PROMPT.md`
2. `docs/WORK_PLAN.md`
3. `docs/EDITOR_PLANNING.md`
4. `docs/PROJECT_RULES.md`
5. `docs/ELEMENT_MODEL.md`
6. `docs/ELEMENT_SELECTION.md`
7. `docs/RESPONSIVE_DESIGN.md`
8. `docs/CODE_AUDIT.md`

## Ikke implementert ennå

- elementoppretting
- flytting og størrelsesendring
- låsing og opplåsing
- tekstredigering
- bildeimport
- knappfunksjonalitet
- fargesystem
- logo/header
- angre/gjør om
- automatisk lokal prosjektlagring
- åpning/import av prosjekt
- forhåndsvisning og publisering
