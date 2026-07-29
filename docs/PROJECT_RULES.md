# Prosjektregler

Dette dokumentet fastsetter gjeldende arbeidsmåte, arkitekturgrenser og produktansvar for Website-editoren.

## 1. Repo-status og historiske referanser

Faktisk `main`-HEAD er dynamisk og skal alltid kontrolleres mot `origin/main`. Dokumentasjonen skal ikke hardkode et commitnummer som permanent «gjeldende HEAD» eller forventet topp-commit.

```powershell
git fetch origin
git switch main
git pull --ff-only origin main
git status
git log -6 --oneline --decorate
```

Stabile historiske referanser:

```text
base main før dokumentasjonssynkronisering i PR #24: a77a9a9
PR #21: første bundlede SVG-knappbibliotek – merget
PR #22: dokumentasjonsstatus etter knappbiblioteket – merget
knappbibliotekets mergecommit: 5e548ad
prosjektskjema: versjon 5
neste produksjonsfase: ikke valgt
```

Historiske mergecommits beskriver leveranser. De skal ikke tolkes som nåværende branch-topp etter senere merges.

## 2. Branch-strategi

- Hver funksjon eller dokumentasjonsfase bygges i en egen avgrenset branch.
- `main` skal alltid være stabil.
- Det utvikles aldri direkte på `main`.
- En godkjent branch merges før neste produksjonsbranch starter fra oppdatert `main`.
- En branch som ligger bak `main`, synkroniseres kontrollert før videre arbeid.
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

## 3. Filstørrelser og moduldeling

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
- `RightPropertiesPanel.tsx` skal forbli en komposisjonskomponent.
- Det skal ikke innføres en tilfeldig generell `features`-samlemappe.

## 4. Autoritativ prosjektmodell

- `EditorProject` er autoritativ kilde for varige prosjektdata.
- Gjeldende prosjektskjema er versjon 5.
- DOM-en brukes ikke som permanent prosjektlagring.
- Prosjektidentitet bruker stabile kryptografiske ID-er.
- State-avhengige beregninger bruker reducerens nyeste state.
- Reduceren skal være deterministisk for samme state og action.
- `updatedAt` endres bare ved en reell, gyldig prosjektmutasjon.

Gjeldende varige prosjektdata omfatter blant annet:

- sider og elementer
- responsiv geometri og synlighet
- låsestatus
- tekstinnhold og tekststil
- elementlenke
- knappens stabile `assetId` og `label`
- tidsstempler

Skjemahistorikk:

```text
versjon 1  grunnmodell
versjon 2  varig tekstinnhold
versjon 3  varig tekststil
versjon 4  varig elementlenke
versjon 5  stabilt knappasset, knappetekst og knappelenke
```

Historiske fasedokumenter kan beskrive eldre skjemaversjoner. De skal samtidig skille historisk faseversjon fra gjeldende prosjektversjon.

Se `docs/ELEMENT_MODEL.md`.

## 5. Transient editor-state

Transient state holdes utenfor `EditorProject`, blant annet:

- `selectedElementId`
- aktiv pekerinteraksjon og layout-preview
- åpne paneler og aktivt verktøy
- aktiv tekstredigeringsøkt og lokal tekstdraft
- knappetekst- og lenkedrafts
- intern katalogvisning
- valideringsmeldinger og lokal feedback
- slettedialogens mål-ID og fokusreferanse
- fokus, hover og animasjon

Transient state skal ikke:

- serialiseres i prosjektfilen
- utløse autolagring direkte
- inngå direkte i angre-/gjør om-historikk
- eksporteres
- publiseres

Ferdige prosjektmutasjoner er grensen for senere historikk og lagring.

## 6. State- og reducergrenser

Alle varige prosjektendringer går gjennom typede reducer-actions.

Reducergrensene skal avvise:

- manglende aktiv side
- manglende element
- element på feil side
- duplisert element-ID
- feil elementtype
- låst element
- ugyldig verdi
- ukjent knappasset-ID
- uendret data

Ved ugyldig eller uendret handling:

- samme state-objekt returneres
- prosjektet muteres ikke
- `updatedAt` endres ikke

Den sentrale reduceren skal ikke samle alle implementasjonsdetaljer. Elementoppretting ligger i `src/state/addElementToActivePage.ts`, og elementspesifikke mutasjoner ligger i egne statefiler.

## 7. Layout og transform

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

## 8. Objektlåsing

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

## 9. Tekstredigering

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

## 10. Venstremeny

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
- `Elementer` inneholder Seksjon, Bilde, Tekst og Knapp.
- `Knapp` åpner et internt designbibliotek.
- Det finnes ikke et separat hovedmenypunkt kalt `Knapper`.

Alternative navn som `Filer`, `Alle farger` og `Fonts` er ikke implementert eller vedtatt. De er åpne framtidige produktbeslutninger.

## 11. Fast ansvarsdeling

```text
Venstremeny = opprette elementer og velge ferdig design
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere tekst og transformere elementer
```

For knapper:

```text
Venstremeny = velge design og opprette knapp
Høyremeny  = endre knappetekst, design og lenke
Lerretet   = markere, flytte og endre størrelse
```

Denne ansvarsdelingen skal bevares i senere faser.

## 12. Høyremeny og egenskaper

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
- panelet oppretter ikke separat draft eller elementkopi
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

Panelet er utvidet med tekstegenskaper, elementlenke, sikker sletting og knappkontroller. Alle varige endringer går gjennom typed state-API og reducer-actions.

Se `docs/RIGHT_PROPERTIES_PANEL.md`, `docs/TEXT_PROPERTIES.md`, `docs/ELEMENT_LINKS.md` og `docs/ELEMENT_DELETION.md`.

## 13. Knappbibliotek

Første bundlede SVG-knappbibliotek er implementert og merget som PR #21 med mergecommit `5e548ad`.

Stabile asset-ID-er:

```text
button.primary-rounded.v1
button.secondary-rounded.v1
button.outline-rounded.v1
button.dark-rounded.v1
```

Regler:

- prosjektdata lagrer stabil `assetId`, ikke filsti, import-URL eller rå SVG
- modellaget importerer ikke SVG-filer
- katalogen oversetter ID til bundlet fil og metadata
- SVG-en er dekorativ og inneholder ikke synlig tekst
- knappens `label` er ekte HTML-tekst og tilgjengelig navn
- tom eller whitespace-only label avvises
- ukjent ny asset-ID avvises
- ukjent lagret asset-ID gir fallback og reparasjonsvalg
- låst knapp kan inspiseres, men ikke endres
- lenken aktiveres aldri i editormodus

Se `docs/BUTTON_LIBRARY.md`.

## 14. Responsiv grense

- `ResponsiveViewport` har én autoritativ definisjon i prosjektmodellen.
- Mobil arver desktopverdier når mobiloverstyring mangler.
- Dagens UI oppretter ikke mobiloverstyringer.
- Egne mobiloverstyringer bygges i `feature/mobile-design-controls` etter ny godkjenning.
- En framtidig mobilendring skal ikke skrive desktopgeometri utilsiktet.
- Låsestatus, tekstinnhold, tekststil, elementlenke, knappasset og knappelabel er ikke responsive uten en ny eksplisitt produktbeslutning.

## 15. Endringskontroll

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

## 16. Kvalitetskrav

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

## 17. Tilgjengelighet og editorinteraksjon

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

## 18. Neste produksjonsfase

Ingen ny produksjonsfase er valgt.

Fase 11 – Bilder står som neste planlagte fase i `docs/WORK_PLAN.md`, men skal ikke startes før brukerflyt, varig ressursmodell, transient filvalg, validering, serialisering, tilgjengelighet og omfang er eksplisitt avklart og godkjent.
