# Høyremenyens grunnstruktur

Dette dokumentet fastsetter omfanget for neste fase etter ren tekstredigering.

Planlagt branch:

```text
feature/right-properties-panel
```

## Mål

Bygg én stabil inspeksjons- og egenskapskolonne på høyre side av editoren før konkrete egenskapskontroller legges inn.

Panelet skal bli den autoritative UI-plassen for senere tekst-, knapp-, bilde-, farge- og layoutkontroller. Det skal ikke eie en separat kopi av prosjektdata.

## Første leveranse

Skal bygge:

- høyre panel som egen komponent og eget layoutområde i `EditorShell`
- lesing av valgt element gjennom sentral editor-state
- tydelig overskrift med valgt elementtype
- tydelig tom tilstand når ingenting er valgt
- kontrollert visning når valgt element er låst
- stabil seksjonsstruktur for senere egenskaper
- forutsigbar fokusrekkefølge
- ingen direkte DOM-søk etter valgt element
- ingen direkte prosjektmutasjon fra visningskomponenten
- PC- og Telefon-kontroll

## Ikke del av grunnstrukturen

Følgende bygges ikke i denne branchen:

- fontfamilie
- fontstørrelse
- tekstfarge
- fet, kursiv eller markert tekstformatering
- bildevelger eller bildeegenskaper
- knapphandlinger eller lenker
- fargevelgere
- sletting eller duplisering
- lagpanel
- historikk eller lagring
- mobiloverstyringer

Tom seksjoner med falske kontroller skal ikke legges inn. Panelet skal bare vise struktur som faktisk er definert og forståelig.

## State-grenser

Autoritativt grunnlag:

- `selectedElementId` identifiserer valgt element
- aktiv side inneholder elementdataene
- prosjektmodellen er eneste varige datakilde

Transient panelstate kan senere omfatte:

- åpne og lukkede seksjoner
- fokus
- hover
- lokal UI-feedback

Transient panelstate skal ikke serialiseres, publiseres eller inngå direkte i historikk/autolagring.

## Tekstredigering

Panelet må ikke utilsiktet avslutte, miste eller overskrive en aktiv tekstdraft.

Før implementering må det fastsettes hvordan panelet oppfører seg når en tekstboks er i redigeringsmodus:

- om panelet er synlig men passivt
- om klikk i panelet committer tekst via normal blur
- hvordan fokus flyttes tilbake til lerretet

Det skal ikke opprettes en ny, separat tekstdraft i panelet.

## Låste elementer

Et låst element kan fortsatt være valgt og vises i panelet.

Grunnpanelet skal tydelig kunne vise at elementet er låst. Senere egenskapskontroller må respektere reducerens autoritative låsegrenser.

## Layout og design

Før kode må dette godkjennes:

- endelig panelbredde
- om panelet alltid er synlig eller kollapser når ingenting er valgt
- hvordan editoren håndterer smal nettleserbredde
- om panelet får egen scrolling
- visuell seksjonsstruktur

Ingen av disse beslutningene skal løses med tilfeldig CSS under implementeringen.

## Arkitekturkrav

Anbefalt ansvar:

- `RightPropertiesPanel.tsx` — panelkomposisjon
- egen selector/hook for valgt element
- små seksjonskomponenter etter hvert som faktiske egenskaper bygges
- egne CSS-regler for høyre panel, ikke videre vekst i en generell samlefil

`EditorShell` skal bare sette sammen venstremeny, lerret og høyremeny.

## Akseptansekriterier

- panelet følger valgt element uten stale data
- valg av ny elementtype oppdaterer panelet umiddelbart
- klikk på tomt lerret gir korrekt tom/skjult tilstand
- låst element kan fortsatt inspiseres
- tekstredigering mister ikke draft utilsiktet
- panelet inneholder ingen falske egenskapskontroller
- alle nye kildefiler følger 250-linjersregelen
- `npm run check` består
- arkitekturrapporter er oppdatert
- PC og Telefon er kontrollert
- arbeidsområdet er rent før PR
