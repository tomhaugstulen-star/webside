# Prosjektregler

Dette dokumentet fastsetter gjeldende arbeidsmåte, arkitekturgrenser og produktansvar for Website-editoren.

## 1. Branch-strategi

- Hver funksjon eller dokumentasjonsfase bygges i en egen avgrenset branch.
- `main` skal alltid være stabil.
- Det utvikles aldri direkte på `main`.
- En godkjent branch merges før neste produksjonsbranch starter fra oppdatert `main`.
- En eksisterende branch som ligger bak `main`, fast-forwardes kontrollert før nytt arbeid.
- En branch skal ikke inneholde skjult arbeid for senere faser.
- Merge krever eksplisitt brukergodkjenning.

Eksempler:

```text
feature/drag-resize
feature/object-locking
feature/text-box-editing
feature/right-properties-panel
docs/project-documentation-audit
```

## 2. Filstørrelser og moduldeling

- 250 linjer er aktiv terskel for å trekke ut ansvar.
- En fil deles tidligere dersom den får flere tydelige ansvarsområder.
- 300 linjer er en eksplisitt hard unntaksgrense for kildefiler, ikke et mål.
- Uttrekking skjer etter ansvar, ikke ved tilfeldig oppdeling.
- Visning, varig state, transient state, hendelseslogikk og rene hjelpefunksjoner skilles når det gir naturlige grenser.
- `App.tsx` skal bare sette sammen hovedstrukturen.
- `EditorShell` skal bare komponere editorens hovedområder.
- Store CSS-filer deles etter editorområde.
- Ingen fil skal bli en generell samlefil.
- `EditorCanvasElement.tsx` ligger nær aktiv grense og skal ikke få nye funksjonsansvar.

## 3. Autoritativ prosjektmodell

- `EditorProject` er autoritativ kilde for varige prosjektdata.
- Gjeldende prosjektskjema er versjon 4.
- DOM-en brukes ikke som permanent prosjektlagring.
- Prosjektidentitet bruker stabile kryptografiske ID-er.
- State-avhengige beregninger bruker reducerens nyeste state.
- Reduceren skal være deterministisk for samme state og action.
- `updatedAt` endres bare ved en reell, gyldig prosjektmutasjon.

Gjeldende varige prosjektdata omfatter blant annet:

- sider og elementer
- responsiv geometri og synlighet
- låsestatus
- tekstinnhold
- tekststil
- elementlenke
- tidsstempler

Skjemahistorikk:

```text
versjon 2  innførte varig tekstinnhold
versjon 3  innførte varig tekststil
versjon 4  innførte varig elementlenke og er gjeldende
```

Historiske fasebeskrivelser av versjon 2 og 3 skal ikke leses som gjeldende prosjektstatus.

Se `docs/ELEMENT_MODEL.md`.

## 4. Transient editor-state

Transient state holdes utenfor `EditorProject`, blant annet:

- `selectedElementId`
- aktiv pekerinteraksjon
- layout-preview
- åpne paneler og aktivt verktøy
- aktiv tekstredigeringsøkt og lokal tekstdraft
- lenkeskjemaets draft og feedback
- slettedialogens mål-ID og fokusreferanse
- fokus, hover, animasjon og lokal UI-feedback

Transient state skal ikke:

- serialiseres i prosjektfilen
- utløse autolagring direkte
- inngå direkte i angre-/gjør om-historikk
- eksporteres
- publiseres

Ferdige prosjektmutasjoner er den eksplisitte grensen for senere historikk og lagring.

## 5. Layout og transform

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

## 6. Objektlåsing

- `locked` er varig elementdata og felles for PC og Telefon.
- Låsestatus endres gjennom reduceren.
- Neste låseverdi beregnes fra nyeste state.
- Ukjent element-ID gir ingen prosjektendring.
- En gyldig låseendring oppdaterer `updatedAt`.
- Låst element kan fokuseres, markeres og låses opp.
- Peker- og tastaturtransform blokkeres i både UI og reducer.
- Piltaster på låst element skal ikke utløse utilsiktet scrolling.
- Objektverktøylinjen er separat fra elementets `role="button"`.

Status: merget som PR #5 med mergecommit `a3eed45`.

Se `docs/OBJECT_LOCKING.md`.

## 7. Tekstredigering

- Bare `kind: 'text'` har obligatorisk `content`, `textStyle` og `link`.
- Nye tekstbokser starter med tomt innhold, standardstil og ingen lenke.
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
- Under redigering deaktiveres objektets transformhendelser, snarveier, resize-håndtak og objektverktøylinje.

Status: merget som PR #7 med mergecommit `c729d33`.

Se `docs/TEXT_BOX_EDITING.md`.

## 8. Venstremeny

Gjeldende implementerte navn og rekkefølge:

```text
Prosjekt
Farger
Logo og header
Elementer
Innstillinger
```

- `Prosjekt` står øverst.
- `Innstillinger` står nederst.
- Paneloverskriftene følger samme navn.
- Interne tool-ID-er kan beholde eksisterende verdier dersom det ikke gir arkitekturfeil.
- Menynavn skal ikke blandes sammen med senere funksjonsimplementering.

Status: merget som PR #8 med mergecommit `a35f59d`.

Alternative navn som `Filer`, `Alle farger`, `Fonts` og separat `Knapper` er ikke implementert eller vedtatt. De kan bare behandles som åpne framtidige produktbeslutninger.

## 9. Fast ansvarsdeling

```text
Venstremeny = opprette og velge struktur
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere tekst og transformere elementer
```

Denne ansvarsdelingen skal bevares i senere faser.

## 10. Høyremeny og egenskaper

Høyremenyens grunnstruktur er implementert og merget som PR #9 med mergecommit `8de5f2e`.

Gjeldende oppførsel:

- ingen valgt element gir ingen synlig eller reservert høyremeny
- valgt element åpner høyremenyen
- nytt valgt element oppdaterer panelet
- klikk på tomt lerret fjerner markeringen og lukker panelet
- låst element kan fortsatt inspiseres
- panelet kan være åpent under tekstredigering
- klikk i panelet bruker eksisterende blur/commit
- markeringen beholdes etter normal tekstcommit
- panelet oppretter ikke separat tekstdraft eller elementkopi
- panelet følger `selectedElementId` og autoritative elementdata

Layout:

```text
bredde: 320 px
fra 1680 px: dokket på høyre side
under 1680 px: overlay fra høyre
egen vertikal scrolling
animasjon: 180 ms
prefers-reduced-motion: animasjon deaktivert
```

Panelet er senere utvidet med tekstegenskaper, elementlenke og sikker sletting. Alle varige endringer går gjennom typed state-API og reducer-actions.

Se `docs/RIGHT_PROPERTIES_PANEL.md`, `docs/TEXT_PROPERTIES.md`, `docs/ELEMENT_LINKS.md` og `docs/ELEMENT_DELETION.md`.

## 11. Responsiv grense

- `ResponsiveViewport` har én autoritativ definisjon i prosjektmodellen.
- Mobil arver desktopverdier når mobiloverstyring mangler.
- Egne mobiloverstyringer bygges i `feature/mobile-design-controls` etter ny godkjenning.
- En framtidig mobilendring skal ikke skrive desktopgeometri utilsiktet.
- Låsestatus, tekstinnhold, tekststil og elementlenke er ikke responsive uten en ny eksplisitt produktbeslutning.

## 12. Endringskontroll

Før hver ny avgrensede del avklares:

1. Hva funksjonen skal gjøre.
2. Hvilke brukerhandlinger som finnes.
3. Hvilken state som trengs.
4. Om state er varig eller transient.
5. Hvordan PC og Telefon påvirkes.
6. Hvordan funksjonen påvirker historikk og lagring.
7. Hvilke filer og ansvarsgrenser som berøres.
8. Hvordan funksjonen testes med peker og tastatur.
9. Hvordan midlertidige fixtures fjernes.
10. Hvilke produkt- og designvalg som fortsatt krever godkjenning.

Ytterligere regler:

- Ikke bygg videre før oppførselen er definert.
- Ikke legg inn midlertidige funksjoner som kan oppfattes som ferdige.
- Ikke bland designendringer, datamodell og interaksjonslogikk unødvendig.
- Små, kontrollerbare leveranser foretrekkes.
- Arkitekturrapporter regenereres etter strukturendringer.
- Nøyaktige PowerShell-kommandoer følger hver repoendring.
- Ikke påstå at kontrollene er bestått før brukeren eller verifisert CI har bekreftet det.
- Ikke opprett PR før branchen er kontrollert, synkronisert og lokal tree er clean.
- Ikke merge uten eksplisitt godkjenning.

## 13. Kvalitetskrav

- TypeScript brukes konsekvent.
- Reducer-actions og union-baserte switcher håndteres uttømmende.
- Ugyldige og uendrede state-overganger avvises kontrollert.
- Komponenter har tydelige props og avgrenset ansvar.
- Fokusrekkefølgen er forutsigbar.
- Interaksjoner har tastaturalternativ der draing ellers er eneste handling.
- PC og Telefon testes separat når funksjonen berører dem.
- Ingen ubrukt kildekodemodul skal passere arkitektursjekken.

Før en produksjonsbranch kan godkjennes kjøres normalt:

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
npm run dev
```

For en ren Markdown-branch er `git diff --check`, dokumentkontroll og clean tree normalt tilstrekkelig når ingen kode, konfigurasjon eller arkitekturrapporter er endret.

## 14. Tilgjengelighet og editorinteraksjon

- Enter og mellomrom markerer et fokusert objekt.
- Piltaster flytter et ulåst, fokusert objekt.
- `Ctrl`/`Cmd` + piltaster endrer størrelse.
- `Shift` bruker større steg.
- Låste elementer kan fortsatt fokuseres og markeres.
- Tekstredigering skiller objektmarkering fra innholdsredigering.
- Under tekstredigering brukes piltaster og Enter av tekstfeltet.
- Panelklikk under tekstredigering følger normal blur/fokusrekkefølge.
- Tilgjengelige navn skal bli mer spesifikke når elementet får innhold.
- Knappehandlinger og lenker aktiveres ikke i vanlig editormodus.

## 15. Gjeldende status

```text
base main for dokumentasjonsaudit: 56e2af7
GitHub-sak: #18 Audit and synchronize project documentation
branch: docs/project-documentation-audit
produksjonskode: uendret
prosjektskjema: versjon 4
ny produksjonsfase: ikke valgt
```

Ferdig og merget funksjonalitet omfatter editorgrunnlag, prosjektmodell, markering, elementoppretting, drag/resize, objektlåsing, tekstredigering, gjeldende venstremeny, høyremeny, tekstegenskaper, tekstlenker og sikker elementsletting.

Ingen ny produksjonsbranch skal opprettes før dokumentasjonsauditen er fullført, merget og lokal `main` igjen er bekreftet synkronisert og clean.