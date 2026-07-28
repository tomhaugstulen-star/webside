# Høyremenyens grunnstruktur

Dette dokumentet er autoritativ spesifikasjon for fase 7.

Branch:

```text
feature/right-properties-panel
```

Utgangspunkt:

```text
main: a35f59d
PR #7: kontrollert tekstredigering
PR #8: endelige navn og rekkefølge i venstremenyen
```

Det er foreløpig ikke lagt inn produksjonskode for høyremenyen.

## Mål

Bygg ett stabilt inspeksjons- og egenskapspanel på høyre side av editoren før konkrete egenskapskontroller legges inn.

Panelet skal senere være den autoritative UI-plassen for tekst-, knapp-, bilde- og layoutegenskaper. Det skal lese fra sentral editor-state og skal aldri eie en separat kopi av prosjektdata.

## Låste produktbeslutninger

Følgende er eksplisitt godkjent:

- høyremenyen er helt skjult når ingenting er markert
- skjult panel skal ikke reservere en tom høyrekolonne
- markering av et element åpner høyremenyen
- markering av et annet element oppdaterer samme panel umiddelbart
- klikk på tomt lerret fjerner markeringen og lukker høyremenyen
- et låst element kan fortsatt markeres og inspiseres
- høyremenyen kan være åpen mens en markert tekstboks redigeres
- klikk i høyremenyen avslutter tekstredigeringen gjennom eksisterende blur/commit
- markeringen skal beholdes etter normal blur/commit
- høyremenyen skal ikke opprette eller eie en separat tekstdraft

Kort regel:

```text
Ingenting valgt -> ingen høyremeny
Element valgt   -> høyremeny åpnes
Tomt lerret     -> høyremeny lukkes
```

En permanent synlig tom høyremeny er uttrykkelig avvist fordi den tar unødvendig plass fra lerretet.

## Beslutninger som fortsatt er åpne

Disse må presenteres konkret og godkjennes før produksjonskode skrives:

- endelig panelbredde
- oppførsel i smale nettleservinduer
- om panelet får egen vertikal scrolling
- visuell overskrift og seksjonsstruktur
- hvilket minimum av faktisk inspeksjonsinformasjon som skal vises i første leveranse
- eventuell åpne-/lukkeanimasjon og hensyn til `prefers-reduced-motion`

Ikke løs disse punktene med tilfeldig CSS under implementeringen.

## Første leveranse

Skal bygge:

- høyremeny som egen komponent og eget layoutområde i `EditorShell`
- betinget rendering basert på faktisk valgt element
- lesing av valgt element gjennom sentral editor-state
- korrekt oppdatering ved ny markering, fjernet markering og sideskifte
- kontrollert visning av låst status dersom dette godkjennes som minimumsinnhold
- forutsigbar fokusrekkefølge
- egen CSS-grense
- PC- og Telefon-kontroll
- peker- og tastaturkontroll

Panelet skal ikke bruke direkte DOM-søk for å finne valgt element og skal ikke mutere prosjektdata direkte.

## Ikke del av denne branchen

Følgende bygges ikke:

- fontfamilie
- fontstørrelse
- tekstfarge
- fet, kursiv eller markert tekstformatering
- bildevelger eller bildeegenskaper
- knapphandlinger eller lenker
- fargevelgere eller prosjektfargeregister
- logo- eller headerbygger
- sletting eller duplisering
- lagpanel
- historikk eller lagring
- mobiloverstyringer
- nytt prosjekt eller prosjektimport

Tomme seksjoner med falske eller deaktiverte kontroller skal ikke legges inn.

## State-grenser

Autoritativt grunnlag:

- `state.selectedElementId` identifiserer markeringen
- aktiv side inneholder elementdataene
- prosjektmodellen er eneste varige datakilde
- `useElementSelection` finnes allerede og returnerer både `selectedElementId` og `selectedElement`

Eksisterende hook skal vurderes og normalt gjenbrukes. Ikke opprett en parallell selector eller ny kopi av samme avledning uten et dokumentert behov.

Transient panelstate kan omfatte:

- fokus
- hover
- lokal UI-feedback
- eventuell animasjonsstatus
- senere åpne og lukkede seksjoner

Transient panelstate skal ikke serialiseres, publiseres eller inngå direkte i historikk eller autolagring.

## Tekstredigering

Eksisterende tekstredigering bruker kontrollert `textarea` og lokal transient draft.

Når brukeren klikker i høyremenyen under tekstredigering:

1. tekstfeltet mister fokus
2. eksisterende blur-mekanisme committer draften
3. fokus fortsetter til kontrollen brukeren klikket på
4. elementmarkeringen beholdes
5. panelet leser oppdatert elementdata fra sentral state

Høyremenyen skal ikke omgå eller duplisere denne commitgrensen.

## Låste elementer

Et låst element kan fortsatt være valgt og vises i panelet. Høyremenyen kan senere tilby egenskapskontroller, men reducerens autoritative låsegrenser skal fortsatt håndheves.

Denne grunnfasen skal ikke introdusere nye prosjektmutasjoner bare for å vise låst status.

## Arkitekturkrav

Forventet ansvarsdeling:

- `RightPropertiesPanel.tsx` — panelkomposisjon
- eksisterende `useElementSelection` — valgt element og markering
- små presentasjonskomponenter bare dersom faktisk godkjent innhold krever det
- `right-properties-panel.css` — egne panelregler
- `EditorShell.tsx` — bare komposisjon av venstremeny, lerret og høyremeny

Eksisterende CSS-variabel `--panel-width` brukes av venstrepanelet. En høyremenybredde skal få et eget entydig navn, for eksempel `--properties-panel-width`. Ikke bruk samme variabel til to forskjellige paneler.

Alle nye kildefiler skal følge 250-linjersregelen.

## Første kodegjennomgang i neste chat

Les minst:

```text
src/components/editor/EditorShell.tsx
src/components/sidebar/LeftSidebar.tsx
src/state/useElementSelection.ts
src/state/useEditorProject.ts
src/components/canvas/EditorCanvas.tsx
src/components/canvas/EditorCanvasElement.tsx
src/components/canvas/TextElementEditor.tsx
src/styles/editor-base.css
src/styles/sidebar.css
src/styles/canvas.css
```

Før implementering skal neste chat presentere ett konkret forslag for de åpne designbeslutningene og få eksplisitt godkjenning.

## Akseptansekriterier

- ingen valgt element gir ingen synlig eller reservert høyremeny
- valgt element åpner panelet
- ny markering oppdaterer panelet uten stale data
- klikk på tomt lerret lukker panelet
- låst element kan fortsatt inspiseres
- aktiv tekstdraft mistes eller overskrives ikke
- panelklikk bruker normal blur/commit
- markeringen beholdes etter commit
- panelet inneholder ingen falske egenskapskontroller
- ingen direkte DOM-søk eller direkte prosjektmutasjon
- alle nye kildefiler følger 250-linjersregelen
- `npm run check` består etter siste kodeendring
- arkitekturrapportene er oppdatert ved strukturendringer
- PC og Telefon er kontrollert
- peker og tastatur er kontrollert
- arbeidsområdet er rent og synkronisert før PR
