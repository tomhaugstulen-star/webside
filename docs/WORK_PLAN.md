# Arbeidsplan for Website-editoren

Dette dokumentet fastsetter hvordan editoren bygges steg for steg uten å utvikle direkte på `main`.

## 1. Rolle for `main`

- `main` er den stabile integrasjonsbranchen.
- Ingen funksjon skal utvikles direkte på `main`.
- Godkjent og testet arbeid merges inn i `main`.
- Nye feature-branches skal normalt opprettes fra oppdatert `main`.
- Dokumentasjon utvikles i egen docs-branch og merges når den er gjennomgått.

## 2. Grunnlag som må være på plass

Før nye editorfunksjoner bygges må følgende være bekreftet og testet:

1. Prosjektet starter lokalt med `npm run dev`.
2. Editorens hovedskall vises korrekt.
3. Lerretet åpnes blankt uten midlertidige objektkontroller.
4. Venstremenyen kan åpnes og lukkes kontrollert.
5. Desktop- og mobilvisning finnes som redigeringsmoduser.
6. TypeScript, lint og produksjonsbuild fungerer uten kjente feil.
7. Dependency Cruiser finner sirkulære, uløselige og ubrukte kildekodemoduler.
8. Filstrukturen følger prosjektreglene og unngår samlefiler.

Gjeldende grunnbranches:

- `tooling/dependency-cruiser`
- `chore/editor-foundation-audit`

Editorgrunnlaget skal godkjennes før det merges til `main`.

## 3. Fast arbeidsflyt for hver funksjon

For hver del brukes denne rekkefølgen:

1. Oppdater lokal `main`.
2. Opprett en egen branch fra `main`.
3. Beskriv funksjonens ansvar og berørte filer.
4. Bygg bare den avgrensede funksjonen.
5. Kontroller filstørrelse og ansvarsdeling underveis.
6. Kjør `npm run check`.
7. Regenerer arkitekturrapporter ved strukturendringer.
8. Test funksjonen visuelt på desktop.
9. Test mobiloppførsel der det er relevant.
10. Oppdater dokumentasjonen.
11. Gjennomgå endringene før merge.
12. Merge til `main` først når delen er godkjent.
13. Opprett neste feature-branch fra nyeste `main`.

## 4. Planlagt teknisk rekkefølge

### Fase 0 – Stabilt editorgrunnlag

Branch: `chore/editor-foundation-audit`

Mål:

- ferdigstille og teste hovedlayout
- blankt lerret
- toppmeny
- venstremeny
- desktop/mobil-knapper
- grunnleggende paneloppførsel
- ryddige interne navn for Elementer
- ingen ubrukt kildekode
- CSS og komponenter delt etter ansvar

Resultat: Godkjent grunnlag merges til `main`.

### Fase 1 – Prosjekt- og objektmodell

Branch: `feature/element-model`

Opprett først:

- typer for prosjektet
- typer for objekter
- stabile objekt-ID-er
- desktop- og mobilverdier
- posisjon, størrelse, synlighet og låsestatus
- sentral prosjekt-state med tydelig ansvar

Ingen draing, tekstredigering eller bildelogikk bygges før modellen er definert.

### Fase 2 – Markering av objekter

Branch: `feature/element-selection`

Bygg:

- valg av ett objekt
- tydelig valgt tilstand
- klikk utenfor for å avslutte redigering
- grunnlag for objektverktøy

### Fase 3 – Opprette elementbokser

Branch: `feature/element-creation`

Bygg:

- `Legg til element`
- standardstørrelse som er enkel å gripe
- rammevalg
- rammefarge
- plassering på lerretet

Elementer-menyen skal beholde valgene Seksjon, Bilde, Tekst og Knapp. Faktisk knappobjekt bygges separat når grunnmodellen er stabil.

### Fase 4 – Flytting og størrelsesendring

Branch: `feature/drag-resize`

Bygg:

- flytting av elementer
- firkantet drahåndtak nederst til høyre
- fri reduksjon og økning av størrelse
- minimumsstørrelse
- klipping av innhold utenfor elementet

### Fase 5 – Låsing

Branch: `feature/object-locking`

Bygg:

- lås valgt objekt
- lås opp valgt objekt
- blokkering av flytting og størrelsesendring mens objektet er låst

### Fase 6 – Tekst og fonts

Branch: `feature/text-box-editing`

Bygg:

- `Legg til tekst`
- tekstboks som kan vokse med innholdet
- markering, redigering og sletting
- 7–8 nettsikre fonter
- fontstørrelser fra liste
- fontfarge
- fet og kursiv

### Fase 7 – Knapper

Branch: `feature/button-element`

Bygg:

- opprette knappobjekt fra Elementer-menyen
- redigerbar knappetekst
- bakgrunn, tekstfarge og ramme
- størrelse og plassering
- kobling eller handling bestemmes før implementering

### Fase 8 – Bilder

Branch: `feature/image-import-and-placement`

Bygg:

- åpne bildevelger på PC
- importere bildet til prosjektmappen
- opprette et selvstendig bildeobjekt
- flytte og endre størrelse
- fri plassering over eller inni elementer uten fast kobling

### Fase 9 – Farger

Branch: `feature/project-colors`

Bygg:

- registrering av alle farger som brukes i prosjektet
- oversikt i Farger-panelet
- endring av global prosjektfarge
- oppdatering av alle objekter som bruker fargen

### Fase 10 – Logo og header

Branch: `feature/logo-header`

Bygg:

- importere logo
- automatisk opprette header
- hovedtekst
- undertittel
- redigerbar headerstruktur

### Fase 11 – Korrigeringslinjer

Branch: `feature/alignment-guides`

Bygg:

- horisontal midtstilling
- samme linje
- lik avstand mellom tre eller flere objekter
- kun visuell veiledning under flytting og størrelsesendring

### Fase 12 – Responsiv redigering

Branch: `feature/mobile-design-controls`

Bygg etter `docs/RESPONSIVE_DESIGN.md`:

- arv fra desktop til mobil
- mobiloverstyringer
- skjul på mobil
- egne verdier der dette er godkjent
- generering av media queries fra prosjektmodellen

### Fase 13 – Angre og gjør om

Branch: `feature/history-system`

Bygg:

- én definert endringsmodell
- angre
- gjør om
- støtte for oppretting, sletting, flytting, størrelse, tekst, farge og låsing

### Fase 14 – Lokal automatisk lagring

Branch: `feature/local-project-autosave`

Bygg:

- velge eller opprette prosjektmappe
- lagre prosjektdata direkte på PC
- kopiere nødvendige bilder til prosjektmappen
- statusene `Lagrer`, `Lagret` og `Lagringsfeil`
- sikker skriving uten ødelagte prosjektfiler
- gjenoppretting etter uventet lukking

### Fase 15 – Åpne og importere prosjekt

Branch: `feature/project-open-import`

Bygg:

- åpne eksisterende prosjektmappe
- validere prosjektfil
- laste prosjektdata og bilder
- håndtere manglende eller ugyldige filer

### Fase 16 – Forhåndsvisning og publisering

Separate branches:

- `feature/preview-mode`
- `feature/publishing`

Disse bygges først etter at editor, responsiv modell og lagring er stabile.

## 5. Kontrollpunkter før hver merge

Før en branch merges til `main` skal dette være bekreftet:

- funksjonen gjør bare det branchen er laget for
- ingen uvedkommende design- eller strukturendringer er blandet inn
- ingen fil har fått for mange ansvarsområder
- filer over omtrent 250 linjer er vurdert for deling
- filer ved eller over 300 linjer er gjennomgått eksplisitt
- `npm run check` er bestått
- `architecture.json` og diagrammet er oppdatert ved strukturendringer
- desktop er testet
- mobil er testet der det er relevant
- automatisk lagring og historikk er vurdert når funksjonen endrer prosjektdata
- dokumentasjonen er oppdatert

## 6. Viktig avgrensning

`main` inneholder den godkjente hovedkoden, men hovedkoden skal ikke skrives direkte der. All utvikling skjer i avgrensede branches. `main` oppdateres bare gjennom kontrollerte merges av testede deler.
