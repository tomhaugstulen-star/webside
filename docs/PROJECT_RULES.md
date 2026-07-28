# Prosjektregler

Dette dokumentet fastsetter arbeidsmåten for Website-editoren.

## 1. Branch-strategi

- Hver funksjon eller avgrenset del bygges i egen branch.
- `main` skal alltid være stabil.
- Ingen ny funksjon utvikles direkte på `main`.
- Feilretting og teknisk opprydding gjøres i egne branches.
- En branch skal bare inneholde arbeidet den er opprettet for.
- En godkjent branch merges før neste feature-branch opprettes fra oppdatert `main`.

Eksempler:

- `feature/element-creation`
- `feature/drag-resize`
- `feature/object-locking`
- `feature/mobile-design-controls`
- `fix/sidebar-panel-behavior`
- `tooling/dependency-cruiser`

## 2. Filstørrelser og moduldeling

- 250 linjer er aktiv terskel for å begynne å trekke ut ansvar fra en kildefil.
- En fil deles tidligere dersom den får flere tydelige ansvarsområder.
- 300 linjer er en eksplisitt kontrollgrense og skal være et unntak.
- Uttrekking skjer etter ansvar, ikke ved tilfeldig oppdeling.
- Visning, varig state, transient state, hendelseslogikk og rene hjelpefunksjoner skilles når det gir naturlige grenser.
- `App.tsx` skal bare sette sammen hovedstrukturen.
- Store CSS-filer deles etter editorområde.
- Ingen fil skal bli en generell samlefil.

## 3. Datagrenser

### Prosjektdata

- `EditorProject` er autoritativ kilde for varige prosjektdata.
- DOM-en skal ikke brukes som permanent prosjektlagring.
- Elementer og geometri endres gjennom prosjekt-state/reduceren.
- Prosjektidentitet bruker stabile kryptografiske ID-er.
- State-avhengige prosjektberegninger bruker reducerens nyeste state.
- UI-hooks sender brukerintensjon og ikke-deterministisk metadata, men skal ikke beregne varig resultat fra et mulig gammelt React-snapshot.
- Reduceren skal være deterministisk for samme state og action.

### Transient editor-state

Transient state skal holdes utenfor `EditorProject`, blant annet:

- `selectedElementId`
- aktiv pekerinteraksjon
- layout-preview under draing eller resizing
- åpne paneler og aktivt verktøy

Transient state skal ikke:

- serialiseres i prosjektfilen
- utløse autolagring direkte
- inngå direkte i angre-/gjør om-historikk
- eksporteres
- publiseres

Når historikk og lagring bygges, skal ferdige prosjektmutasjoner være den eksplisitte grensen.

## 4. Layout- og transformregler

- Opprettingsplassering gjelder bare elementets fødested.
- Startplassering skal ikke bli et automatisk kollisjonssystem.
- Elementer kan overlappe.
- Andre elementer flyttes aldri automatisk.
- Flytting og resizing beregnes av rene modellfunksjoner.
- Pekerbevegelse bruker transient preview.
- Normalt pekerslipp committer én ferdig geometriendring.
- `pointercancel` og tapt pointer capture skal rydde preview uten commit.
- Låste elementer kan markeres, men kan ikke transformeres.
- Reduceren skal også avvise layoutmutasjon av låste elementer.
- Lerretshøyde er avledet visning og skal ikke lagres i prosjektfilen.

## 5. Responsiv grense

- `ResponsiveViewport` har én autoritativ definisjon i prosjektmodellen.
- UI-typer skal være alias til modelltypen, ikke en separat union.
- Mobil arver desktopverdier når mobiloverstyring mangler.
- Egne mobiloverstyringer bygges eksplisitt i `feature/mobile-design-controls`.
- En mobilendring skal ikke utilsiktet skrive desktopgeometri når mobiloverstyringer senere finnes.
- Layout-actions og transform-API må gjøres viewport-bevisste i den fasen.

## 6. Arbeidsrekkefølge

Før hver ny del avklares:

1. Hva funksjonen skal gjøre.
2. Hvilke brukerhandlinger som finnes.
3. Hvilken state som trengs.
4. Om state er varig eller transient.
5. Hvordan desktop og mobil påvirkes.
6. Hvordan funksjonen påvirker historikk og lagring.
7. Hvilke filer og ansvarsgrenser som berøres.
8. Hvordan funksjonen testes med peker og tastatur.
9. Hvordan test-fixtures fjernes.

## 7. Endringskontroll

- Ikke bygg videre før oppførselen er definert.
- Ikke legg inn midlertidige funksjoner som kan oppfattes som ferdige uten dokumentasjon.
- Ikke bland designendringer, datamodell og interaksjonslogikk unødvendig.
- Små, kontrollerbare leveranser foretrekkes.
- Før større endringer beskrives berørte filer og forventet effekt.
- Arkitekturrapporter regenereres etter strukturendringer.
- Nøyaktige PowerShell-kommandoer følger hver repoendring.
- Ikke oppgi at lint, typekontroll, arkitektursjekk eller build er bestått før brukeren eller verifisert CI har bekreftet det.
- Ikke merge uten eksplisitt godkjenning.

## 8. Kvalitetskrav

- TypeScript brukes konsekvent.
- Reducer-actions og union-baserte UI-switcher håndteres uttømmende.
- Ugyldige state-overganger ignoreres eller avvises kontrollert.
- Uendrede prosjektmutasjoner skal ikke oppdatere state eller `updatedAt`.
- Komponenter skal ha tydelige props og avgrenset ansvar.
- Interaksjoner skal ha tastaturalternativ der draing ellers er eneste handling.
- Fokusrekkefølgen skal være forutsigbar.
- Brukerhandlinger skal ha tydelig tilbakemelding.
- Desktop og mobil testes separat.
- Layoutsystemet skal unngå skjulte koblinger.
- Ingen ubrukt kildekodemodul skal passere arkitektursjekken.

Før en branch kan godkjennes kjøres normalt:

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
npm run dev
```

## 9. Tilgjengelighet og editorinteraksjon

- Enter og mellomrom markerer et fokusert element.
- Piltaster flytter et fokusert element.
- `Ctrl`/`Cmd` + piltaster endrer størrelse.
- `Shift` bruker større steg.
- Resize-håndtakets treffflate skal være større enn den synlige firkanten.
- Tilgjengelige navn skal bli mer spesifikke når elementmodellen får navn eller innhold.
- Tekstredigering må skille objektmarkering fra innholdsredigering.
- Faktiske knappehandlinger eller lenker aktiveres ikke i vanlig editormodus.
- Låste elementer skal fortsatt kunne fokuseres og markeres.

## 10. Gjeldende status

- Editorgrunnlag, prosjektmodell, markering og elementoppretting er merget til `main`.
- `feature/drag-resize` er implementert og visuelt godkjent på desktop og mobil før siste audit.
- Auditendringene må sluttkontrolleres lokalt før PR.
- Neste branch etter godkjent merge er `feature/object-locking`.
