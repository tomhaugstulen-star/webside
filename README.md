# Website-editor

Lokal webside-editor bygget med React, TypeScript og Vite.

Editoren åpner med et blankt, hvitt lerret. Brukeren kan nå opprette og markere grunnleggende elementtyper. Draing, størrelsesendring og innholdsredigering bygges i senere, avgrensede branches.

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
  → kontrollert PR og merge til main
```

Etter hver repoendring skal brukeren få de nøyaktige PowerShell-kommandoene som skal kjøres lokalt.

## Ferdig og merget til `main`

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
- markering av eksisterende elementer
- klikk på tomt lerret fjerner markering
- tastaturmarkering med Tab, Enter og mellomrom
- transient `selectedElementId` med validerte state-overganger

## Gjeldende branch

```text
feature/element-creation
```

Implementert og visuelt godkjent på desktop og mobil:

- opprette Seksjon, Bilde, Tekst og Knapp fra Elementer-panelet
- legge nye elementer til aktiv side i prosjektmodellen
- sikker kryptografisk element-ID
- automatisk markering av nytt element
- kontrollerte standardstørrelser
- første ledige startposisjon med 16 px avstand
- ingen direkte overlapping ved oppretting
- automatisk utvidelse av lerretshøyden
- blank startside før brukeren oppretter noe
- mobil arver desktopverdier
- sidebar-CSS delt etter ansvar før 250-linjersgrensen

Siste kodeaudit har i tillegg sikret at:

- state-avhengig oppretting beregnes fra reducerens nyeste state
- raske eller batchede opprettinger ikke bruker et gammelt React-snapshot
- plasseringsalgoritmen skalerer uten kvadratisk kandidatsøk
- viewport-typen har én autoritativ definisjon
- nye menyverktøy må håndteres uttømmende av TypeScript

De siste audit-endringene må gjennom ny `npm run check`, nye arkitekturrapporter og en kort visuell regresjonskontroll før PR.

## Viktige state-grenser

`EditorProject` er autoritativ kilde for varige sider og elementer.

`selectedElementId` er transient editor-state og skal ikke:

- lagres i prosjektfilen
- utløse autolagring
- inngå i prosjektets angre-/gjør om-historikk
- eksporteres
- publiseres

Elementoppretting er en prosjektmutasjon. Oppretting skjer i reduceren fra den nyeste state-versjonen.

## Filstørrelse og ansvar

- 250 linjer er aktiv terskel for å begynne å trekke ut ansvar.
- En fil deles tidligere dersom den får flere tydelige ansvarsområder.
- 300 linjer er en eksplisitt unntaksgrense, ikke et normalmål.
- Deling skjer etter ansvar, ikke tilfeldig linjetall.

## Dokumentasjon

Les i denne rekkefølgen ved ny chat eller overlevering:

1. `docs/NEXT_CHAT_PROMPT.md`
2. `docs/WORK_PLAN.md`
3. `docs/EDITOR_PLANNING.md`
4. `docs/PROJECT_RULES.md`
5. `docs/ELEMENT_MODEL.md`
6. `docs/ELEMENT_SELECTION.md`
7. `docs/ELEMENT_CREATION.md`
8. `docs/RESPONSIVE_DESIGN.md`
9. `docs/CODE_AUDIT.md`

## Ikke implementert ennå

- flytting og størrelsesendring
- sletting
- låsing og opplåsing
- direkte tekstredigering
- bildeimport
- knapphandling og lenker
- fargesystem
- logo/header
- angre/gjør om
- automatisk lokal prosjektlagring
- åpning/import av prosjekt
- forhåndsvisning og publisering
