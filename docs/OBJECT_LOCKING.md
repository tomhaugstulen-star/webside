# Objektlåsing

Dette dokumentet beskriver den historiske låsefasen og de varige grensene som fortsatt gjelder.

## Status og omfang

```text
branch: feature/object-locking
PR: #5 – merget
mergecommit: a3eed45
```

Fasen er ferdig, kontrollert og merget til `main`.

Fasen bygde låsing og opplåsing av eksisterende elementer. Den bygde ikke sletting, lagpanel, tekstredigering, bildeimport, historikk, lagring eller egne mobiloverstyringer. Flere av disse funksjonene ble senere levert i egne faser.

## Brukeropplevelse

Når et element markeres, vises en liten objektverktøylinje over elementets øvre høyre kant.

- åpen hengelås betyr **Lås element**
- lukket hengelås betyr **Lås opp element**
- låst element beholder markeringen
- låst element får stiplet markeringsramme
- resize-håndtaket skjules når elementet er låst
- objektverktøylinjen skjules når elementet ikke er markert
- objektverktøylinjen skjules mens en pekertransform pågår

Kontrollen er en ekte knapp og kan brukes med tastatur.

## Varig prosjektdata

`locked` ligger på `EditorElement` og er varig prosjektdata.

En låseendring:

- går gjennom prosjekt-reduceren
- beregnes fra reducerens nyeste state
- oppdaterer prosjektets `updatedAt`
- ignoreres kontrollert dersom elementet ikke finnes på aktiv side
- skal senere inngå som én historikk- og autolagringsendring

UI-hooken sender bare element-ID og tidspunkt. Den beregner ikke neste låseverdi fra et mulig utdatert React-snapshot.

## Transient editor-UI

Følgende er ikke prosjektdata:

- om objektverktøylinjen er synlig
- fokus på låseknappen
- hover- og pressed-tilstand
- valgt element-ID

Disse tilstandene serialiseres, eksporteres eller publiseres ikke og utløser ikke autolagring direkte.

## Transformgrenser

Et låst element:

- kan markeres med peker
- kan fokuseres med Tab
- kan ikke flyttes med peker
- kan ikke resizes med peker
- kan ikke flyttes med piltaster
- kan ikke resizes med `Ctrl`/`Cmd` + piltaster
- kan låses opp fra objektverktøylinjen

Både pekelogikken og reduceren håndhever låsen. Reducergrensen er autoritativ og beskytter også mot framtidige eller feilaktige UI-kall.

Piltaster på et låst, fokusert element stoppes kontrollert slik at nettleseren ikke scroller editorområdet utilsiktet.

## Peker og event-propagation

Objektverktøylinjen er en separat canvas-overlay og ligger ikke inni elementets `role="button"`.

Pointer down på verktøylinjen stopper propagation. Derfor:

- klikk på hengelåsen starter ikke flytting
- klikk på hengelåsen fjerner ikke markeringen
- selve låseknappen kan beholde tastaturfokus

## Tilgjengelighet

- verktøylinjen bruker `role="toolbar"`
- låseknappen har dynamisk tilgjengelig navn: **Lås element** eller **Lås opp element**
- `aria-pressed` viser låsestatus
- låst element får et tilgjengelig navn som opplyser at elementet er låst
- låst element annonserer ikke flytte- eller resize-snarveier
- fokusrekkefølgen er element først, deretter objektverktøy

## Desktop og mobil

Låsestatus er felles for PC og Telefon. Den er en elementegenskap, ikke en responsiv verdi.

Dagens midlertidige deling av desktopgeometri påvirker ikke låsemodellen. Egne mobiloverstyringer bygges senere i `feature/mobile-design-controls` etter ny godkjenning.

## Arkitektur

Ansvar ble delt slik:

- `src/state/toggleElementLock.ts` — ren state-overgang
- `src/state/useElementLocking.ts` — UI-API og tidspunkt før dispatch
- `src/state/editorProjectReducer.ts` — uttømmende action-håndtering
- `src/components/canvas/ElementSelectionToolbar.tsx` — tilgjengelig objektverktøylinje
- `src/components/canvas/EditorCanvasElement.tsx` — elementrendering og kobling til verktøylinjen
- `src/styles/canvas.css` — visuell låsetilstand og verktøylinje

Alle berørte kildefiler ble holdt under den aktive 250-linjersgrensen eller delt etter ansvar.

## Historiske akseptansekriterier

Følgende ble bekreftet før PR #5 ble merget:

- alle fire elementtyper kan låses og låses opp
- låst element beholder markering
- stiplet markeringsramme vises
- resize-håndtaket skjules og kommer tilbake ved opplåsing
- pekerflytting og pointer-resize blokkeres når elementet er låst
- tastaturflytting og tastatur-resize blokkeres når elementet er låst
- piltaster på låst element utløser ikke utilsiktet scrolling
- låseknappen starter ikke flytting eller fjerner markering
- klikk på tomt lerret skjuler verktøylinjen
- PC og Telefon ble testet
- `npm run check` ble bestått etter siste kodeendring
- arkitekturrapporter ble regenerert etter strukturendringene
- arbeidsområdet var rent og synkronisert før PR