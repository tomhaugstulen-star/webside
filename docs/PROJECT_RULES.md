# Prosjektregler

Dette dokumentet fastsetter gjeldende arbeidsmåte, arkitekturgrenser og produktansvar for Website-editoren.

## 1. Repo- og branchkontroll

Faktisk branch- og `main`-HEAD skal alltid leses fra Git. Dokumentasjonen skal ikke hardkode et commitnummer som permanent forventet topp-commit.

```powershell
git fetch origin
git status
git log -6 --oneline --decorate
```

Regler:

- Det utvikles aldri direkte på `main`.
- Hver funksjon eller dokumentasjonsfase bygges i en avgrenset branch.
- `main` skal være stabil.
- En branch som ligger bak `main`, synkroniseres kontrollert.
- En branch skal ikke inneholde skjult arbeid for senere faser.
- Merge krever eksplisitt brukergodkjenning.
- Ingen ny produksjonsbranch starter før forrige leveranse er merget og lokal `main` er oppdatert.

Gjeldende leveranse:

```text
fase: 11A – bildeimport, ramme og utsnitt
branch: feature/image-import-and-placement
GitHub-sak: #25
base main: 7e4c71f
prosjektskjema i leveransen: versjon 6
status: implementert, auditert og testet; PR ikke opprettet
```

## 2. Filstørrelser og moduldeling

- 250 linjer er aktiv terskel for ansvarstrekk.
- En fil deles tidligere dersom den får flere tydelige ansvarsområder.
- 300 linjer er en hard unntaksgrense for kildefiler, ikke et mål.
- Uttrekking skjer etter ansvar, ikke ved tilfeldig oppdeling.
- Visning, varig state, transient state, hendelseslogikk og rene hjelpefunksjoner skilles når det gir naturlige grenser.
- `App.tsx` skal bare sette sammen hovedstrukturen.
- `EditorShell` skal komponere hovedområder og koordinere skalltilstand.
- `RightPropertiesPanel.tsx` skal forbli komposisjon.
- Store CSS-filer deles etter editorområde.
- Ingen fil skal bli en generell samlefil.
- Det innføres ikke en tilfeldig generell `features`-samlemappe.

Etter fase-11A-auditen:

```text
EditorCanvasElement.tsx: 189 linjer
alle berørte kildefiler: under 250 linjer
```

## 3. Autoritativ prosjektmodell

- `EditorProject` er autoritativ kilde for varige prosjektdata.
- Prosjektskjemaet i fase-11A-leveransen er versjon 6.
- DOM-en brukes ikke som permanent prosjektlagring.
- Prosjektidentitet bruker stabile kryptografiske ID-er.
- State-avhengige beregninger bruker reducerens nyeste state.
- Reduceren skal være deterministisk for samme state og action.
- `updatedAt` endres bare ved en reell, gyldig prosjektmutasjon.

Skjemahistorikk:

```text
versjon 1  grunnmodell
versjon 2  varig tekstinnhold
versjon 3  varig tekststil
versjon 4  varig elementlenke
versjon 5  stabilt knappasset, knappetekst og knappelenke
versjon 6  bildeasset, metadata, alternativ tekst, visningsmodus og utsnitt
```

Gjeldende varige prosjektdata omfatter blant annet:

- sider og elementer
- responsiv geometri og synlighet
- låsestatus
- tekstinnhold og tekststil
- elementlenke
- knappens stabile `assetId` og `label`
- bildets stabile `assetId`
- bildets serialiserbare filmetadata
- bildets `altText`, `mode` og `transform`
- tidsstempler

## 4. Transient editor- og ressursstate

Transient state holdes utenfor `EditorProject`, blant annet:

- `selectedElementId`
- aktiv pekerinteraksjon og layout-preview
- åpne paneler og aktivt verktøy
- aktiv tekstredigeringsøkt og lokale drafts
- filvelger, valideringsmeldinger og feedback
- `File`, Object URL og ressurskart for bilder
- intern knappkatalogvisning
- slettedialogens mål-ID og fokusreferanse
- fokus, hover og animasjon

Transient state skal ikke:

- serialiseres i prosjektfilen
- utløse autolagring direkte
- inngå direkte i angre-/gjør om-historikk
- eksporteres
- publiseres

Object URL-er opprettes og tilbakekalles av ressurslageret. Prosjektmodellen lagrer aldri lokal filsti, binærfil eller Object URL.

## 5. State- og reducergrenser

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
- ugyldig bilde-asset-ID eller metadata
- ugyldig bildevisning eller transform
- crop-ramme som ikke kan fylles ved lagret zoom
- uendret data

Ved ugyldig eller uendret handling:

- samme state-objekt returneres
- prosjektet muteres ikke
- `updatedAt` endres ikke

Opprettingsvalideringen har én delt stategrense. Elementspesifikke mutasjoner ligger i egne statefiler. Bildehandlinger rutes gjennom en avgrenset bildereducer.

## 6. Elementstørrelser og layout

Standard- og minimumsstørrelser har én autoritativ kilde i modellaget.

```text
Standard:
Seksjon  320 × 180 px
Bilde    240 × 160 px
Tekst    240 × 96 px
Knapp    160 × 48 px

Minimum:
Seksjon  160 × 90 px
Bilde    120 × 80 px
Tekst    120 × 48 px
Knapp    80 × 36 px
```

- Opprettingsplassering gjelder bare elementets fødested.
- Elementer kan overlappe.
- Andre elementer flyttes aldri automatisk.
- Flytting og resizing beregnes av rene modellfunksjoner.
- Pekerbevegelse bruker transient preview.
- Normalt pekerslipp committer én geometriendring.
- `pointercancel` og tapt pointer capture rydder preview uten commit.
- Låste elementer kan markeres, men ikke transformeres.
- Reduceren avviser layoutmutasjon av låste elementer.
- Lerretshøyde er avledet visning og lagres ikke i prosjektfilen.

## 7. Bildeimport og ressurslivssyklus

Støttede filer:

```text
PNG
JPEG
WebP
maks 10 MB
```

Regler:

- filtype, størrelse, filnavn og dekoding valideres før oppretting
- tom eller ugyldig fil avvises med synlig melding
- avbrutt filvalg muterer ikke prosjektet eller `updatedAt`
- en stabil bilde-`assetId` opprettes etter vellykket validering
- ressurslageret kontrollerer at `File` og metadata samsvarer
- mislykket elementoppretting fjerner den midlertidig registrerte ressursen
- importflyten avslutter alltid opptatt-status, også ved framtidige feil
- sletting tilbakekaller Object URL når ressursen ikke deles av andre elementer
- manglende ressurs gir fallback, ikke krasj

## 8. Bilderamme og utsnitt

Bilderammen og motivet er separate konsepter.

### Hele bildet

- hele bildet vises proporsjonalt
- bildet sentreres
- tomrom er tillatt ved ulikt sideforhold
- lagret crop-transform beholdes for senere retur

### Juster utsnitt

- motivet fyller alltid rammen uten tomrom
- originalt sideforhold bevares
- zoom er begrenset til 1–3 og minst nødvendig fyllingszoom
- offset er normalisert fra `-1` til `1`
- modellen begrenser offset slik at tomrom ikke blir synlig
- crop-rammen kan ikke være større enn motivet ved gjeldende zoom
- overgang fra stor contain-ramme gir en sentrert, gyldig crop-ramme
- reset bruker minimum gyldig zoom og sentrert motiv

Bilderammen har åtte pekergrep. Ved kanthåndtering står motsatt kant fast.

## 9. Interaksjon og tilgjengelighet

```text
Enter / mellomrom  markerer fokusert element
piltast             flytter ulåst element
Shift + piltast     bruker 10 px steg
Ctrl/Cmd + piltast  endrer størrelse fra nedre høyre hjørne
Alt + piltast       flytter motivet i crop-modus
vanlig dra på crop  flytter motivet
Shift + dra på crop flytter hele rammen
Delete              åpner sikker slettebekreftelse
```

- Låste elementer kan fokuseres og markeres.
- Låste elementer kan ikke redigeres, transformeres eller slettes.
- Tekstredigering skiller objektmarkering fra innholdsredigering.
- Tilgjengelige navn beskriver elementinnhold og relevante snarveier.
- Høyremenyens kontroller har labels, status- og feilmeldinger.
- `prefers-reduced-motion` respekteres.

## 10. Venstremeny og høyremeny

Gjeldende venstremeny:

```text
Prosjekt
Farger
Logo og header
Elementer
Innstillinger
```

- `Elementer` inneholder Seksjon, Bilde, Tekst og Knapp.
- `Knapp` åpner internt designbibliotek.
- `Bilde` åpner lokal filvelger.
- Det finnes ikke et separat hovedmenypunkt kalt `Knapper`.

Fast ansvarsdeling:

```text
Venstremeny = opprette elementer og velge fil eller design
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere og transformere
Ressurslag = eie transient bildefil og renderings-URL
```

Høyremenyen følger `selectedElementId`, eier ingen separat elementkopi og muterer ikke prosjektdata direkte.

## 11. Responsiv grense

- `ResponsiveViewport` har én autoritativ definisjon i prosjektmodellen.
- Telefon arver desktopverdier når mobiloverstyring mangler.
- Dagens UI oppretter ikke mobiloverstyringer.
- Låsestatus, tekstinnhold, tekststil, elementlenke, knappdata og bildets innhold/utsnitt er felles for PC og Telefon.
- Egne mobiloverstyringer bygges først i en senere godkjent fase.

## 12. Kvalitetskrav

Før en produksjonsbranch kan godkjennes kjøres normalt:

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
npm run dev
git diff --check
```

Siste fase-11A-kontroll:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 89 moduler, 228 avhengigheter, ingen brudd
Vite: 98 moduler transformert
produksjonsbuild: bestått
PC og Telefon: godkjent
```

Ikke påstå at kontroller er bestått uten brukerens terminaloutput eller verifisert CI. Ikke opprett PR før branchen er synkronisert og lokal tree er clean. Ikke merge uten eksplisitt godkjenning.

## 13. Neste produksjonshandling

Fase 11A skal gjennom dokumentkontroll og PR-kontroll. Ingen ny produksjonsfase er valgt eller startet.
