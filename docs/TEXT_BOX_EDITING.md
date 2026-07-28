# Ren tekstredigering

Dette dokumentet beskriver første stabile tekstredigering i Website-editoren.

## Status

Branch:

```text
feature/text-box-editing
```

Merget som PR #7 med merge-commit:

```text
c729d33
```

Fasen er ferdig, kodeauditert, kontrollert på PC og Telefon og ligger på `main`.

## Omfang

Fasen bygger bare ren flerlinjet tekst i tekstbokser. Den bygger ikke fontvelger, fontstørrelse, farge, fet, kursiv, markert tekstformatering, høyremeny, historikk, lagring eller mobile overstyringer.

## Prosjektmodell

Prosjektskjemaet er økt fra versjon 1 til versjon 2 fordi den serialiserbare elementformen er endret.

`EditorElement` er en diskriminert union. Bare tekstobjekter har:

```ts
kind: 'text'
content: string
```

Nye tekstbokser opprettes med tomt innhold:

```ts
content: ''
```

Tom tekst er gyldig prosjektdata. Teksten **Dobbeltklikk for å skrive** er bare en editor-placeholder og lagres aldri som innhold.

Det finnes foreløpig ingen lagring eller import. Skjemamigrering bygges derfor først sammen med prosjektåpning og import.

## Objektmarkering og redigeringsmodus

- ett klikk markerer tekstboksen
- dobbeltklikk går direkte inn i redigeringsmodus når boksen er ulåst
- `Enter` på en allerede markert tekstboks går inn i redigeringsmodus
- `Enter` på en umarkert tekstboks markerer den først
- låst tekstboks kan markeres, men ikke redigeres

Redigeringsmodus er transient editor-state og inngår ikke i prosjektfilen.

## Tekstfelt

Redigeringen bruker et kontrollert `textarea` med lokal draft.

Det brukes ikke:

- `contentEditable`
- `innerHTML`
- DOM-en som lagringskilde
- direkte riktekstformatering

Vanlig `Enter` lager en ny linje. Linjeskift normaliseres til `\n` ved prosjektcommit.

## Avslutning av en redigeringsøkt

- klikk eller fokus utenfor tekstfeltet committer gjennom blur
- `Ctrl`/`Cmd` + `Enter` committer eksplisitt
- `Escape` forkaster alle endringer fra den aktive økten
- en økt kan bare avsluttes én gang
- IME-komposisjon avbrytes ikke av snarveiene

Etter eksplisitt commit eller avbryt går fokus tilbake til tekstobjektet. Etter blur beholdes fokuset på kontrollen brukeren klikket på.

Denne blurregelen skal gjenbrukes av høyremenyen: klikk i panelet committer aktiv tekstdraft uten å opprette en separat draft eller miste markeringen.

## Prosjektcommit

UI-hooken sender bare:

- element-ID
- ferdig tekst
- tidspunkt

Reducergrensen:

- finner elementet på aktiv side
- krever `kind: 'text'`
- avviser låst element
- normaliserer CRLF/CR til LF
- avviser uendret innhold
- oppdaterer `updatedAt` bare ved reell endring

En avsluttet redigeringsøkt skal senere være én historikk- og autolagringsendring. Tastetrykkene i den lokale draften skal ikke lagres enkeltvis.

## Transformgrenser

Mens tekst redigeres:

- objektets `role="button"` er deaktivert
- objektets flytte- og resize-snarveier er deaktivert
- pointer-transformhendelser er fjernet
- resize-håndtaket er skjult
- objektverktøylinjen er skjult
- piltaster brukes av tekstfeltet
- vanlig `Enter` lager ny linje

Teksten klippes av tekstboksens eksisterende elementgrense. Boksen vokser ikke automatisk med innholdet i denne fasen.

## PC og Telefon

Tekstinnhold er felles elementdata for PC og Telefon. Det er ikke en responsiv verdi.

Begge visninger viser samme tekst. Geometrien følger fortsatt den midlertidige desktop-arven som er dokumentert i `docs/MOBILE_DESIGN_CONTROLS.md`.

## Arkitektur

Ansvar er delt slik:

- `src/model/editorProject.ts` — diskriminert elementunion og skjema versjon 2
- `src/model/createEditorElement.ts` — tomt standardinnhold for nye tekstbokser
- `src/state/setTextElementContent.ts` — ren validert state-overgang
- `src/state/useTextElementContent.ts` — UI-API og tidspunkt
- `src/state/editorProjectReducer.ts` — uttømmende action-håndtering
- `src/components/canvas/TextElementEditor.tsx` — lokal draft og kontrollert avslutning
- `src/components/canvas/EditorCanvas.tsx` — transient redigeringsøkt
- `src/components/canvas/EditorCanvasElement.tsx` — kobling mellom objekt- og tekstmodus
- `src/components/canvas/canvasElementAccessibility.ts` — tilgjengelige navn og snarveier
- `src/styles/canvas.css` — ren tekstvisning og editorstil

Alle berørte TypeScript- og TSX-filer er under den aktive 250-linjersgrensen.

## Bekreftet test

Brukeren har bekreftet:

- `npm run check` bestått
- flerlinjet tekst beholdes etter blur og ny redigeringsøkt
- `Ctrl`/`Cmd` + `Enter` committer
- `Escape` forkaster
- tom tekst fungerer
- transform og objektverktøy er deaktivert under redigering
- låst tekstboks kan ikke redigeres
- PC og Telefon fungerer
- øvrige elementtyper har ingen regresjon
- arbeidsområdet var rent og synkronisert før PR

Arkitekturrapportene ble regenerert og inkludert før PR #7 ble merget.

## Neste fase

Gjeldende fase er høyremenyens grunnstruktur:

```text
feature/right-properties-panel
```

Denne branchen skal bare bygge et stabilt inspeksjonspanel basert på valgt element. Font- og riktekstkontroller bygges deretter i en egen branch.

Se `docs/RIGHT_PROPERTIES_PANEL.md`.
