# Elementoppretting

Dette dokumentet beskriver implementasjonen og de varige grensene for `feature/element-creation`.

## Status

Implementert og visuelt kontrollert på desktop og mobil:

- opprette Seksjon, Bilde, Tekst og Knapp fra Elementer-panelet
- legge elementet til aktiv side i prosjektmodellen
- stabil kryptografisk element-ID
- automatisk markering av det nye elementet
- kontrollert startstørrelse og startposisjon
- lukking av Elementer-panelet etter oppretting
- automatisk utvidelse av lerretshøyden
- blank side før brukeren oppretter noe

De siste audit-refaktoreringene må gjennom `npm run check` og nye arkitekturrapporter før branchen kan godkjennes for merge.

## Brukerflyt

1. Brukeren åpner `Elementer`.
2. Brukeren velger Seksjon, Bilde, Tekst eller Knapp.
3. UI-hooken genererer en sikker ID og et ISO-tidspunkt.
4. Reduceren mottar opprettingsintensjonen.
5. Reduceren leser den nyeste aktive siden fra state.
6. Elementfabrikken beregner størrelse og første ledige startposisjon.
7. Elementet legges til aktiv sides `elements`-liste.
8. Prosjektets `updatedAt` oppdateres.
9. Det nye elementet markeres.
10. Sidepanelet lukkes.

## Kritisk state-grense

State-avhengig oppretting skjer inne i reducerens state-overgang.

Hooken skal ikke beregne plassering fra et React-snapshot. Flere raske eller batchede opprettinger må alltid bruke den nyeste elementlisten når hver action behandles.

Hooken har bare ansvar for:

- brukerintensjon
- sikker element-ID
- tidspunkt for prosjektendringen
- dispatch

Reduceren har ansvar for:

- validere aktiv side
- avvise duplikat-ID
- opprette elementet fra nyeste state
- oppdatere prosjektdata
- markere det nye elementet

## Standardstørrelser

Første versjon bruker:

- Seksjon: 320 × 180 px
- Bilde: 240 × 160 px
- Tekst: 240 × 96 px
- Knapp: 160 × 48 px

Størrelsene er startverdier, ikke endelige designbegrensninger. Minimumsstørrelser fastsettes i `feature/drag-resize`.

## Startplassering

Nye elementer opprettes i en mobiltrygg venstrekolonne:

- startpunkt: x 24 px, y 24 px
- minimum 16 px avstand ved oppretting
- første ledige vertikale gap brukes
- eksisterende elementer flyttes aldri automatisk
- lerretet utvides dersom elementet trenger mer høyde

Dette er bare en regel for fødestedet til nye elementer. Det er ikke et generelt kollisjons- eller layoutsystem.

Når draing bygges, skal brukeren fortsatt kunne:

- flytte elementer fritt
- overlappe elementer
- plassere elementer uten automatisk korrigering

`findElementCreationPosition` skal ikke gjenbrukes til å blokkere eller korrigere draing.

## Responsiv regel

Oppretting er foreløpig desktop-autoritativ:

- nytt element får desktopverdi for posisjon, størrelse og synlighet
- mobil arver desktopverdien når mobilverdi mangler
- standardbreddene passer innenfor 390 px mobilvisning med startpunkt x 24 px

Når full mobilredigering bygges, må dette vurderes på nytt:

- oppretting i aktiv viewport
- eksisterende mobiloverstyringer
- elementer som er skjult i aktiv visning
- elementer som bare er synlige på mobil

Viewport-unionen har én autoritativ type i prosjektmodellen. UI-typen er bare et alias, slik at desktop- og mobiltypene ikke kan drive fra hverandre.

## Lerretshøyde

Lerretet beholder sin tidligere minimumshøyde, men vokser etter nederste synlige element i aktiv viewport.

Beregningen:

- bruker mobilverdi når den finnes
- faller ellers tilbake til desktopverdi
- ignorerer elementer som er skjult i aktiv viewport
- legger til 48 px luft under nederste element

Høyden er avledet visning og skal ikke lagres som prosjektdata.

## ID og prosjektdata

- element-ID genereres med `crypto.randomUUID()` eller sikker kryptografisk fallback
- duplikat-ID avvises på tvers av hele prosjektet
- elementet lagres i `EditorProject.pages[].elements`
- `updatedAt` endres ved vellykket oppretting
- `selectedElementId` er fortsatt transient editor-state

Markering skal ikke lagres, eksporteres, publiseres eller inngå i prosjektets historikk.

## Ansvarsdeling

- `createStableId.ts`: sikker ID-generering
- `createEditorElement.ts`: standardverdier og ren elementfabrikk
- `findElementCreationPosition.ts`: startplassering
- `editorProjectReducer.ts`: autoritativ prosjektmutasjon
- `useElementCreation.ts`: brukerintensjon og dispatch
- `SidebarPanels.tsx`: menyhandlinger
- `EditorCanvasElement.tsx`: nøytral editorrepresentasjon
- `getCanvasContentHeight.ts`: avledet lerretshøyde
- `resolveResponsiveValue.ts`: delt responsiv verdioppløsning

Ingen berørt kildefil er nær 250-linjersgrensen. `sidebar.css` ble delt etter ansvar før videre utvikling.

## Ikke implementert i denne branchen

- draing
- størrelsesendring
- sletting
- låsing og opplåsing
- direkte tekstredigering
- bildevelger eller ekte bildeinnhold
- knapphandling eller lenke
- farger
- historikk
- lagring mellom omlastinger

## Framtidsregler

- Drag og resize skal oppdatere prosjektmodellen gjennom reducer-actions.
- Opprettingsplassering må ikke bli et automatisk kollisjonssystem.
- Nye state-avhengige beregninger skal bruke reducerens nyeste state, ikke et gammelt UI-snapshot.
- Nye `EditorTool`-verdier skal håndteres uttømmende; TypeScript skal stoppe bygget dersom et panel mangler.
- Responsiv oppretting må avklares før mobile overstyringer innføres.
- Når historikk bygges, skal oppretting være én prosjektendring, mens markering forblir transient.
- Når lagring bygges, skal elementet og `updatedAt` lagres, men ikke `selectedElementId`.
