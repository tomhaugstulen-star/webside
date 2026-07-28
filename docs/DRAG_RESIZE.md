# Flytting og størrelsesendring

Dette dokumentet beskriver implementasjonen i `feature/drag-resize` og grensene som senere funksjoner må bevare.

## Omfang

Branchen bygger:

- flytting av elementer med peker
- størrelsesendring fra ett firkantet håndtak nederst til høyre
- automatisk scrolling nær kantene av editorområdet
- minimumsstørrelser per elementtype
- clamping mot venstre, høyre og øvre lerretskant
- automatisk vekst av lerretet nedover
- tastaturalternativ for flytting og størrelsesendring
- varig geometri gjennom prosjekt-reduceren

Branchen bygger ikke:

- automatisk kollisjonsunngåelse
- automatisk flytting av andre elementer
- korrigeringslinjer
- låseknapp eller låsegrensesnitt
- direkte tekstredigering
- bildebeskjæring
- historikk
- autolagring
- egne mobiloverstyringer

## Geometri

Varig geometri består av:

```ts
type ElementLayout = {
  position: { x: number; y: number }
  size: { width: number; height: number }
}
```

Minimumsmål:

- Seksjon: 160 × 90 px
- Bilde: 120 × 80 px
- Tekst: 120 × 48 px
- Knapp: 80 × 36 px

Regler:

- `x` kan ikke være negativ.
- `y` kan ikke være negativ.
- høyre elementkant holdes innenfor lerretsbredden
- det finnes ingen fast nedre grense
- lerretshøyden avledes fra nederste synlige element
- elementer kan overlappe
- andre elementer flyttes aldri automatisk

`src/model/elementLayout.ts` eier minimumsmål, clamping, flytteberegning, resizeberegning, likhetskontroll og grunnleggende validering.

## State-grense

Pekerbevegelse skal ikke skrive hundrevis av mellomtilstander til `EditorProject`.

Under aktiv pekerinteraksjon:

- geometri ligger som lokal transient draft i `useElementPointerTransform`
- aktiv preview løftes bare nok til at lerretshøyden kan beregnes korrekt
- preview skal ikke serialiseres, lagres, eksporteres eller inngå i historikk

Ved normal `pointerup`:

- sluttgeometrien committes én gang gjennom `set-element-desktop-layout`
- `updatedAt` oppdateres bare dersom geometrien faktisk er endret

Ved `pointercancel` eller uventet tap av pointer capture:

- preview ryddes
- ingen prosjektmutasjon committes

Når historikk og autolagring bygges, skal én ferdig pekertransform behandles som én prosjektendring.

## Reducer-regler

`set-element-desktop-layout` ignoreres når:

- aktiv side mangler
- elementet ikke finnes på aktiv side
- elementet er låst
- geometrien inneholder ikke-endelige tall
- posisjon er negativ
- størrelse er under minimum
- geometrien er identisk med eksisterende geometri

Reduceren er autoritativ for varige prosjektmutasjoner. DOM-en og transient preview er ikke prosjektlagring.

## Pointer capture og scrolling

Pekeren fanges av elementet eller resize-håndtaket under interaksjonen.

Delta beregnes fra:

- pekerens bevegelse siden start
- endring i scrollposisjon siden start

Dette gjør at elementet følger riktig koordinat selv når editorområdet auto-scroller.

Auto-scroll ligger i `autoScrollCanvas.ts`, separat fra transform-hooken.

## Låste elementer

Låsegrensesnitt er ikke bygget ennå, men modellen har allerede `locked`.

Varig regel:

- et låst element skal fortsatt kunne markeres
- det skal ikke kunne flyttes eller endre størrelse
- resize-håndtaket skal ikke vises
- reduceren skal avvise layoutmutasjon av et låst element

Dette gjør det mulig å bygge opplåsing senere uten å måtte endre markeringsgrunnlaget.

## Tastatur

Et fokusert element støtter:

- piltaster: flytt 1 px
- `Shift` + piltast: flytt 10 px
- `Ctrl`/`Cmd` + piltast: endre størrelse 1 px
- `Ctrl`/`Cmd` + `Shift` + piltast: endre størrelse 10 px
- Enter eller mellomrom: marker elementet

Tastatur bruker samme minimumsmål, clamping og reducer-commit som pekerinteraksjonen.

Når historikk bygges, må det vurderes om gjentatte tastetrykk skal slås sammen til én historikkpost.

## Resize-håndtak

- håndtaket vises bare på valgt og ulåst element
- synlig firkant er 16 × 16 px
- faktisk treffflate er 32 × 32 px
- håndtaket ligger innenfor elementgrensen
- pekerhendelsen stoppes slik at resize ikke starter flytting

## Desktop og mobil

Prosjektmodellen støtter mobiloverstyringer, men ingen kan opprettes fra dagens UI.

I denne fasen:

- nye elementer har bare desktopgeometri
- mobil arver desktopgeometrien
- både PC- og Telefon-visningen kan brukes til å flytte og endre den delte geometrien
- varig commit går til desktopverdien

Når `feature/mobile-design-controls` bygges, må layout-action og transform-API gjøres viewport-bevisste. Mobiloverstyringer skal ikke introduseres skjult eller tilfeldig.

## Filansvar

- `elementLayout.ts`: ren geometrilogikk
- `useElementLayout.ts`: state-API for layout-commit
- `useElementPointerTransform.ts`: én aktiv pekersesjon og transient preview
- `autoScrollCanvas.ts`: edge-scroll
- `canvasLayoutPreview.ts`: delt transient preview-type
- `EditorCanvasElement.tsx`: rendering, tilgjengelighet og hendelseskobling
- `EditorCanvas.tsx`: refs og preview for avledet lerretshøyde
- `editorProjectReducer.ts`: validert varig prosjektmutasjon

Ingen av de nye kildefilene skal bli en generell samlefil når snapping, låsing, historikk eller mobilkontroller bygges senere.
