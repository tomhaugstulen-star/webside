# Prosjektregler

Dette dokumentet fastsetter arbeidsmåten for Website-editoren.

## 1. Branch-strategi

- Hver funksjon bygges i egen avgrenset branch.
- `main` skal alltid være stabil.
- Ingen ny funksjon utvikles direkte på `main`.
- En godkjent branch merges før neste feature-branch opprettes fra oppdatert `main`.
- En branch skal ikke inneholde skjult arbeid for senere faser.

Eksempler:

- `feature/drag-resize`
- `feature/object-locking`
- `feature/text-box-editing`
- `feature/right-properties-panel`
- `feature/mobile-design-controls`

## 2. Filstørrelser og moduldeling

- 250 linjer er aktiv terskel for å trekke ut ansvar.
- En fil deles tidligere dersom den får flere tydelige ansvarsområder.
- 300 linjer er en eksplisitt unntaksgrense.
- Uttrekking skjer etter ansvar, ikke ved tilfeldig oppdeling.
- Visning, varig state, transient state, hendelseslogikk og rene hjelpefunksjoner skilles når det gir naturlige grenser.
- `App.tsx` skal bare sette sammen hovedstrukturen.
- Store CSS-filer deles etter editorområde.
- Ingen fil skal bli en generell samlefil.

## 3. Datagrenser

### Prosjektdata

- `EditorProject` er autoritativ kilde for varige prosjektdata.
- DOM-en skal ikke brukes som permanent prosjektlagring.
- Geometri, låsestatus, tekstinnhold og senere egenskaper endres gjennom prosjekt-state/reduceren.
- Prosjektidentitet bruker stabile kryptografiske ID-er.
- State-avhengige beregninger bruker reducerens nyeste state.
- UI-hooks sender brukerintensjon og ikke-deterministisk metadata, men beregner ikke varig resultat fra et mulig gammelt React-snapshot.
- Reduceren skal være deterministisk for samme state og action.
- `updatedAt` endres bare ved en reell, gyldig prosjektmutasjon.

### Transient editor-state

Transient state holdes utenfor `EditorProject`, blant annet:

- `selectedElementId`
- aktiv pekerinteraksjon
- layout-preview
- åpne paneler og aktivt verktøy
- aktiv tekstredigeringsøkt
- lokal tekstdraft
- fokus, hover og synlighet for objektverktøy og egenskapspanel

Transient state skal ikke:

- serialiseres i prosjektfilen
- utløse autolagring direkte
- inngå direkte i angre-/gjør om-historikk
- eksporteres
- publiseres

Ferdige prosjektmutasjoner er den eksplisitte grensen for senere historikk og lagring.

## 4. Layout og transform

- Opprettingsplassering gjelder bare elementets fødested.
- Startplassering er ikke et automatisk kollisjonssystem.
- Elementer kan overlappe.
- Andre elementer flyttes aldri automatisk.
- Flytting og resizing beregnes av rene modellfunksjoner.
- Pekerbevegelse bruker transient preview.
- Normalt pekerslipp committer én geometriendring.
- `pointercancel` og tapt pointer capture rydder preview uten commit.
- Låste elementer kan markeres, men ikke transformeres.
- Reduceren avviser layoutmutasjon av låste elementer.
- Lerretshøyde er avledet visning og lagres ikke i prosjektfilen.

## 5. Objektlåsing

- `locked` er varig elementdata og felles for PC og Telefon.
- Låsestatus endres gjennom reduceren.
- Neste låseverdi beregnes fra nyeste state.
- Ukjent element-ID gir ingen prosjektendring.
- En gyldig låseendring oppdaterer `updatedAt`.
- Låst element kan fokuseres, markeres og låses opp.
- Peker- og tastaturtransform blokkeres i både UI og reducer.
- Piltaster på låst element skal ikke utløse scrolling.
- Objektverktøylinjen er separat fra elementets `role="button"`.
- Klikk på objektverktøy starter ikke flytting eller fjerner markering.
- En låseendring skal senere være én historikk-/autolagringsendring.

Se `docs/OBJECT_LOCKING.md`.

## 6. Ren tekstredigering

- Prosjektskjemaet er versjon 2 etter innføring av tekstinnhold.
- `EditorElement` er en diskriminert union.
- Bare `kind: 'text'` har obligatorisk `content: string`.
- Nye tekstbokser starter med `content: ''`.
- Tom tekst er gyldig prosjektdata.
- Editor-placeholder lagres aldri som innhold.
- Redigering bruker kontrollert `textarea`, ikke `contentEditable` eller `innerHTML`.
- Ett klikk markerer tekstboksen.
- Dobbeltklikk eller `Enter` på markert, ulåst tekstboks starter redigering.
- Vanlig `Enter` lager ny linje.
- Blur og `Ctrl`/`Cmd` + `Enter` committer.
- `Escape` forkaster aktiv draft.
- IME-komposisjon skal ikke avbrytes av snarveier.
- Linjeskift normaliseres til `\n` ved commit.
- Reduceren avviser feil type, låst element og uendret tekst.
- Aktiv redigeringsøkt og lokal draft er transient state.
- Under redigering deaktiveres objektets transformhendelser, snarveier, resize-håndtak og objektverktøylinje.
- En avsluttet redigeringsøkt skal senere være én historikk-/autolagringsendring.
- En tekstboks vokser ikke automatisk med innholdet i denne fasen.

Se `docs/TEXT_BOX_EDITING.md`.

## 7. Høyremeny og egenskaper

- Høyremenyens grunnstruktur bygges før egenskapskontrollene.
- Panelet skal følge `selectedElementId`, ikke lete i DOM-en.
- Ingen valgt element gir en eksplisitt tom eller skjult tilstand.
- Panelet skal aldri eie en separat kopi av autoritative elementdata.
- Egenskapsendringer skal senere gå gjennom typed state-API og reducer-actions.
- Den første panelbranchen bygger ikke font-, farge-, bilde- eller knappfunksjoner.
- Panelstate som åpne seksjoner, fokus og hover er transient.
- Panelkontroller må fungere uten å stjele eller ødelegge aktiv tekstredigering utilsiktet.

## 8. Responsiv grense

- `ResponsiveViewport` har én autoritativ definisjon i prosjektmodellen.
- Mobil arver desktopverdier når mobiloverstyring mangler.
- Egne mobiloverstyringer bygges i `feature/mobile-design-controls`.
- En mobilendring skal senere ikke skrive desktopgeometri utilsiktet.
- Layout-actions og transform-API gjøres viewport-bevisste i den fasen.
- Låsestatus og tekstinnhold er ikke responsive verdier uten en ny eksplisitt produktbeslutning.

## 9. Arbeidsrekkefølge

Før hver ny del avklares:

1. Hva funksjonen skal gjøre.
2. Hvilke brukerhandlinger som finnes.
3. Hvilken state som trengs.
4. Om state er varig eller transient.
5. Hvordan PC og Telefon påvirkes.
6. Hvordan funksjonen påvirker historikk og lagring.
7. Hvilke filer og ansvarsgrenser som berøres.
8. Hvordan funksjonen testes med peker og tastatur.
9. Hvordan test-fixtures fjernes.

## 10. Endringskontroll

- Ikke bygg videre før oppførselen er definert.
- Ikke legg inn midlertidige funksjoner som kan oppfattes som ferdige.
- Ikke bland designendringer, datamodell og interaksjonslogikk unødvendig.
- Små, kontrollerbare leveranser foretrekkes.
- Arkitekturrapporter regenereres etter strukturendringer.
- Nøyaktige PowerShell-kommandoer følger hver repoendring.
- Ikke påstå at kontrollene er bestått før brukeren eller verifisert CI har bekreftet det.
- Ikke merge uten eksplisitt godkjenning.

## 11. Kvalitetskrav

- TypeScript brukes konsekvent.
- Reducer-actions og union-baserte switcher håndteres uttømmende.
- Ugyldige og uendrede state-overganger avvises kontrollert.
- Komponenter har tydelige props og avgrenset ansvar.
- Fokusrekkefølgen er forutsigbar.
- Interaksjoner har tastaturalternativ der draing ellers er eneste handling.
- PC og Telefon testes separat.
- Ingen ubrukt kildekodemodul skal passere arkitektursjekken.

Før en branch kan godkjennes kjøres normalt:

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
npm run dev
```

## 12. Tilgjengelighet og editorinteraksjon

- Enter og mellomrom markerer et fokusert objekt.
- Piltaster flytter et ulåst, fokusert objekt.
- `Ctrl`/`Cmd` + piltaster endrer størrelse.
- `Shift` bruker større steg.
- Låste elementer kan fortsatt fokuseres og markeres.
- Tekstredigering skiller objektmarkering fra innholdsredigering.
- Under tekstredigering brukes piltaster og Enter av tekstfeltet.
- Tilgjengelige navn skal bli mer spesifikke når elementet får innhold.
- Faktiske knappehandlinger og lenker aktiveres ikke i vanlig editormodus.

## 13. Gjeldende status

- Editorgrunnlag, modell, markering, oppretting, drag/resize og objektlåsing er merget til `main`.
- `feature/text-box-editing` er implementert, kodeauditert, kontrollert og visuelt godkjent.
- Dokumentasjon er oppdatert.
- Arkitekturrapportene må regenereres og committes før PR.
- Neste branch etter kontrollert merge er `feature/right-properties-panel`.
