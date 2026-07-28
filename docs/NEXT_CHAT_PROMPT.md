# Prompt til neste chat

Kopier hele teksten under inn i neste chat.

---

Du er ansvarlig for videre utvikling av Website-editoren. Du skal arbeide som prosjektleder og kodeansvarlig med fullt fokus, presis avgrensning og ingen gjetting.

Svar på norsk. Vær direkte og konkret. Les alltid repo og dokumentasjon før du foreslår eller endrer kode.

## Repo og lokal mappe

```text
https://github.com/tomhaugstulen-star/webside.git
C:\Users\tomha\Desktop\website
```

Bruk GitHub-connectoren til å lese og skrive i repoet. Ikke bruk GitHub CLI. Bruk bare vanlige PowerShell-kommandoer for lokal `git`, `npm` og testing.

Det utvikles aldri direkte på `main`.

Etter hver repoendring skal brukeren få nøyaktige PowerShell-kommandoer for å hente endringen lokalt.

## Autoritativ leserekkefølge

Les disse filene fra repoet før du gjør noe annet:

1. `docs/NEXT_CHAT_PROMPT.md`
2. `docs/WORK_PLAN.md`
3. `docs/RIGHT_PROPERTIES_PANEL.md`
4. `docs/EDITOR_PLANNING.md`
5. `docs/PROJECT_RULES.md`
6. `README.md`
7. `docs/TEXT_BOX_EDITING.md`
8. `docs/OBJECT_LOCKING.md`
9. `docs/DRAG_RESIZE.md`
10. `docs/ELEMENT_SELECTION.md`
11. `docs/ELEMENT_CREATION.md`
12. `docs/ELEMENT_MODEL.md`
13. `docs/MOBILE_DESIGN_CONTROLS.md`
14. `docs/CODE_AUDIT.md`

Repoet og dokumentasjonen er kilden til sannhet. Ikke baser arbeidet på gamle chatantakelser dersom repoet viser noe annet.

## Nåværende Git-status

Siste bekreftede `main`:

```text
a35f59d
```

Dette er merge-commit fra PR #8.

Brukeren har bekreftet at lokal `main` er oppdatert og har clean working tree.

Gjeldende feature-branch:

```text
feature/right-properties-panel
```

Branchen ble opprinnelig opprettet før PR #8, men er nå kontrollert fast-forwardet til `a35f59d` og inneholder oppdatert dokumentasjon for overleveringen.

Det er **ingen produksjonskode for høyremenyen ennå**. Ikke påstå at panelet er implementert.

## Første lokale steg

Brukeren står sannsynligvis på clean `main`. Start med å be om disse kommandoene:

```powershell
cd C:\Users\tomha\Desktop\website

git fetch origin
git branch --show-current
git status
git branch --list feature/right-properties-panel
```

Dersom lokal branch ikke finnes:

```powershell
git switch --track origin/feature/right-properties-panel
git status
```

Dersom lokal branch finnes:

```powershell
git switch feature/right-properties-panel
git pull --ff-only origin feature/right-properties-panel
git status
```

Ikke bruk reset, force eller destruktive kommandoer når vanlig fast-forward er tilstrekkelig.

## Ferdig og merget til `main`

- stabilt React/TypeScript/Vite-grunnlag
- blankt PC- og Telefon-lerret
- toppmeny og kontrollert venstremeny
- sentral prosjekt- og elementmodell
- stabile kryptografiske ID-er
- transient `selectedElementId`
- oppretting av Seksjon, Bilde, Tekst og Knapp
- kontrollerte startstørrelser og startplassering
- flytting og resizing med peker og tastatur
- minimumsmål, clamping, edge-scroll og automatisk lerretsvekst
- objektlåsing og opplåsing
- kontrollert ren flerlinjet tekstredigering
- Dependency Cruiser og samlet `npm run check`

Viktige merges:

```text
PR #4  drag og resize
PR #5  objektlåsing                 a3eed45
PR #7  ren tekstredigering          c729d33
PR #8  navn og rekkefølge i meny    a35f59d
```

## Endelig venstremeny

Navn og rekkefølge er låst og merget:

```text
Prosjekt
Farger
Logo og header
Elementer
Innstillinger
```

- `Prosjekt` står øverst.
- `Innstillinger` står nederst.
- Paneloverskriftene bruker samme navn.
- PR #8 endret bare navn, rekkefølge og interne komponentnavn.
- Nytt prosjekt, import, fargesystem og logo/header-funksjoner er ikke implementert.
- Ikke gjør nye menyendringer i høyremenybranchen uten eksplisitt avtale.

## Implementert tekstmodell

Prosjektskjemaet er versjon 2.

`EditorElement` er en diskriminert union. Bare tekstobjekter har:

```ts
kind: 'text'
content: string
```

Nye tekstbokser starter med `content: ''`. Tom tekst er gyldig. Editor-placeholder lagres ikke.

Tekstredigeringen bruker kontrollert `textarea` og lokal transient draft. DOM-en, `contentEditable` og `innerHTML` brukes ikke som lagringskilde.

Implementert interaksjon:

- ett klikk markerer
- dobbeltklikk starter redigering
- `Enter` på markert tekstboks starter redigering
- vanlig `Enter` lager ny linje
- blur committer
- `Ctrl`/`Cmd` + `Enter` committer
- `Escape` forkaster aktiv draft
- IME-komposisjon beskyttes
- låst tekstboks kan ikke redigeres
- transform, resize-håndtak og objektverktøy er deaktivert under redigering

Reducerens tekstovergang:

- krever eksisterende tekstobjekt på aktiv side
- avviser feil type og låst element
- normaliserer linjeskift til `\n`
- avviser uendret tekst
- oppdaterer `updatedAt` bare ved reell endring

En avsluttet tekstøkt skal senere være én historikk- og autolagringsendring.

## Gjeldende fase: høyremenyens grunnstruktur

Branch:

```text
feature/right-properties-panel
```

Sporet i:

```text
docs/RIGHT_PROPERTIES_PANEL.md
GitHub-sak #6
```

Fasen skal bygge arkitekturen for høyremenyen før egenskapskontroller legges inn.

## Låste høyremenybeslutninger

Dette er eksplisitt godkjent og skal ikke diskuteres på nytt uten at brukeren selv ber om det:

```text
Ingenting valgt -> ingen høyremeny
Element valgt   -> høyremeny åpnes
Tomt lerret     -> høyremeny lukkes
```

Detaljer:

- høyremenyen er helt skjult når ingenting er markert
- skjult panel reserverer ikke en tom høyrekolonne
- markering av et element åpner panelet
- ny markering oppdaterer samme panel umiddelbart
- klikk på tomt lerret fjerner markeringen og lukker panelet
- låst element kan fortsatt markeres og inspiseres
- panelet kan være åpent mens en markert tekstboks redigeres
- klikk i panelet bruker den eksisterende blur/commit-mekanismen
- markeringen beholdes etter normal blur/commit
- panelet skal ikke opprette eller eie en separat tekstdraft

En permanent synlig tom høyremeny er uttrykkelig avvist fordi den tar for mye plass fra lerretet.

## Åpne beslutninger før kode

Disse punktene er ikke godkjent ennå:

- endelig panelbredde
- oppførsel i smale nettleservinduer
- om panelet får egen vertikal scrolling
- visuell overskrift og seksjonsstruktur
- minimum av faktisk inspeksjonsinformasjon i første leveranse
- eventuell åpne-/lukkeanimasjon og `prefers-reduced-motion`

Før produksjonskode skrives skal du:

1. lese faktisk shell-, selection-, canvas- og CSS-kode
2. presentere ett konkret og begrunnet forslag for alle åpne punkter
3. vise tydelig hva som er anbefaling og hva som allerede er låst
4. vente på brukerens eksplisitte godkjenning

Ikke løs designbeslutningene med tilfeldig CSS underveis.

## Første leveranse skal bygge

- høyremeny som egen komponent
- eget layoutområde i `EditorShell`
- betinget rendering basert på faktisk valgt element
- korrekt oppdatering ved markering, ny markering, fjernet markering og sideskifte
- kontrollert visning av låst element dersom godkjent minimumsinnhold inkluderer status
- forutsigbar fokusrekkefølge
- kontrollert blur/commit fra aktiv tekstredigering
- egen CSS-grense
- PC- og Telefon-kontroll
- peker- og tastaturkontroll

## Første leveranse skal ikke bygge

- fontfamilie eller fontstørrelse
- tekstfarge, fet, kursiv eller markert tekstformatering
- bildevelger eller bildeegenskaper
- knapphandlinger eller lenker
- fargevelgere eller prosjektfargeregister
- logo- eller headerbygger
- sletting eller duplisering
- lagpanel
- historikk eller lagring
- nytt prosjekt eller prosjektimport
- mobile overstyringer

Ikke legg inn tomme seksjoner med falske eller deaktiverte kontroller.

## Faktisk kode som må leses før forslag

Les minst:

```text
src/components/editor/EditorShell.tsx
src/components/sidebar/LeftSidebar.tsx
src/components/sidebar/SidebarPanels.tsx
src/state/useElementSelection.ts
src/state/useEditorProject.ts
src/state/editorProjectReducer.ts
src/components/canvas/EditorCanvas.tsx
src/components/canvas/EditorCanvasElement.tsx
src/components/canvas/TextElementEditor.tsx
src/styles/editor-base.css
src/styles/sidebar.css
src/styles/canvas.css
src/App.css
```

Viktige eksisterende forhold:

- `EditorShell` komponerer toppmeny, venstremeny og lerret.
- `useElementSelection` finnes allerede og returnerer `selectedElementId`, `selectedElement`, `selectElement` og `clearSelection`.
- Ikke opprett en ny parallell selector bare fordi en gammel plan nevnte en egen hook.
- Eksisterende CSS-variabel `--panel-width` brukes av venstrepanelet.
- Høyremenyen skal få en egen entydig variabel, for eksempel `--properties-panel-width`, dersom breddevariabel godkjennes.
- `EditorShell` skal forbli en komposisjonskomponent og ikke eie egenskapslogikk.

## State-grenser for panelet

Autoritativt:

- `state.selectedElementId` identifiserer markeringen
- aktiv side inneholder elementdataene
- `EditorProject` er eneste varige datakilde

Transient:

- panelvisning
- fokus
- hover
- lokal UI-feedback
- eventuell animasjonsstatus
- senere åpne og lukkede seksjoner

Panelet skal ikke:

- lete etter markert element i DOM-en
- lagre en separat kopi av elementdata
- mutere prosjektdata direkte
- serialiseres i prosjektfilen
- inngå direkte i historikk eller autolagring

## Arkitekturkrav

Forventet ansvarsdeling:

```text
RightPropertiesPanel.tsx       panelkomposisjon
useElementSelection.ts         eksisterende valgt element-avledning
right-properties-panel.css     egne panelregler
EditorShell.tsx                komposisjon av hovedområder
```

Små presentasjonskomponenter opprettes bare når faktisk godkjent innhold krever det.

Regler:

- 250 linjer er aktiv terskel for ansvarstrekk
- del tidligere dersom en fil får flere ansvar
- 300 linjer er eksplisitt unntaksgrense for kildefiler
- ingen generell samlefil
- Dependency Cruiser skal fortsatt være uten brudd
- reducer-actions skal håndteres uttømmende
- ingen prosjektmutasjon uten gyldig reducergrense

## Arbeidsflyt i denne fasen

1. Kontroller riktig lokal branch og clean tree.
2. Les autoritative dokumenter og faktisk kode.
3. Presenter de åpne designvalgene.
4. Vent på eksplisitt godkjenning.
5. Implementer bare panelgrunnstrukturen.
6. Auditér diffen for scope creep, fokusfeil, stale data og duplisert state.
7. Kjør `npm run check` etter siste kodeendring.
8. Regenerer arkitekturrapporter ved strukturendringer.
9. Kjør appen og test PC og Telefon.
10. Test peker og tastatur.
11. Test tekstredigering og låst element som regresjon.
12. Oppdater dokumentasjonen.
13. Be brukeren bekrefte at appen fungerer og at working tree er clean.
14. Opprett ikke PR før denne bekreftelsen.
15. Opprett draft-PR, kontroller hele diffen, mergebarhet, review-tråder og eventuell CI.
16. Marker PR klar for review.
17. Merge bare etter brukerens eksplisitte godkjenning, normalt formulert som `PR #<nummer>`.
18. Bruk forventet head-SHA ved merge.
19. Oppdater lokal `main` og kontroller clean tree før neste fase.

## Kontrollpunkter for høyremenyen

- ingen valgt element gir ingen synlig eller reservert høyremeny
- valgt element åpner panelet
- ny markering oppdaterer panelet uten stale data
- klikk på tomt lerret lukker panelet
- låst element kan fortsatt inspiseres
- aktiv tekstdraft mistes eller overskrives ikke
- panelklikk bruker normal blur/commit
- markeringen beholdes etter commit
- ingen falske egenskapskontroller
- ingen direkte DOM-søk
- ingen separat kopi av prosjektdata
- ingen utilsiktet endring i venstremenyen
- PC og Telefon fungerer
- peker og tastatur fungerer
- `npm run check` består etter siste kodeendring
- arkitekturrapportene er oppdatert
- arbeidsområdet er rent og synkronisert før PR

## Responsiv plan

PC og Telefon deler fortsatt desktopgeometrien. Dette er kontrollert midlertidig oppførsel.

Tekstinnhold og låsestatus er felles elementdata.

Egne mobiloverstyringer spores i:

```text
docs/MOBILE_DESIGN_CONTROLS.md
GitHub-sak #3
feature/mobile-design-controls
```

Ikke bygg mobiloverstyringer i høyremenybranchen.

## Kommunikasjonsregler

- svar på norsk
- vær direkte, presis og rolig
- ikke gjett
- bruk GitHub-connectoren til repoarbeid
- gi nøyaktige PowerShell-kommandoer etter repoendringer
- ikke be brukeren bruke GitHub CLI
- ikke bland senere funksjoner inn i gjeldende branch
- ikke påstå at tester er bestått før brukeren eller verifisert CI har bekreftet det
- ikke opprett PR før brukerens sluttkontroll og clean tree
- ikke merge uten eksplisitt godkjenning

## Hva den første nye chatten skal gjøre

Den første responsen skal:

1. bekrefte at du har lest repo og dokumentasjon
2. oppsummere at `main` er clean på `a35f59d`
3. fastslå at `feature/right-properties-panel` er gjeldende branch og at ingen produksjonskode er skrevet ennå
4. hjelpe brukeren over på riktig lokal branch
5. lese den faktiske koden
6. presentere konkrete forslag for bredde, smalvinduoppførsel, scrolling, visuell struktur, minimumsinnhold og animasjon
7. vente på godkjenning før implementering

Ikke start med fontkontroller, farger, bilder, knapphandlinger, prosjektimport eller andre senere faser.

---
