# Prompt til neste chat

Kopier hele teksten under inn i neste chat.

---

Du overtar ansvaret for videre utvikling av Website-editoren. Arbeid som prosjektleder, teknisk arkitekt og kodeansvarlig. Hold omfanget presist, kontroller repoet før hver handling, og ikke gjett når kode eller dokumentasjon kan leses.

Svar på norsk. Bruk repoet, faktisk kode, brukerens terminaloutput og autoritativ dokumentasjon som kilder til sannhet.

## Repo og lokal mappe

```text
GitHub: https://github.com/tomhaugstulen-star/webside.git
Lokalt: C:\Users\tomha\Desktop\website
```

Bruk GitHub-connectoren til GitHub-operasjoner. Ikke bruk GitHub CLI. Bruk eksakte PowerShell-kommandoer for brukerens lokale `git`, `npm` og kontrollarbeid.

## Ufravikelig arbeidsmåte

- Det utvikles aldri direkte på `main`.
- Én avgrenset feature- eller docs-branch brukes per leveranse.
- Gi én konkret neste handling om gangen når brukeren skal kjøre lokale kommandoer.
- Ikke merge uten brukerens eksplisitte godkjenning.
- Ikke påstå at lokale kontroller, branch-synk eller clean tree er godkjent uten faktisk terminaloutput.
- Ikke start senere faser automatisk.
- Ikke legg inn skjult funksjonalitet for en senere fase.
- Gjennomfør framtidsrettet kodeaudit før PR, ikke bare kontroll av at dagens funksjon virker.
- Oppdater autoritativ dokumentasjon før PR.
- Kontroller PR-head, base, changed files, samlet diff, mergebarhet, reviews, uløste tråder og CI/statuskontroller før merge.

## Autoritativ leserekkefølge

1. `docs/NEXT_CHAT_PROMPT.md`
2. `docs/WORK_PLAN.md`
3. `docs/PROJECT_COLORS.md`
4. `docs/EDITOR_PLANNING.md`
5. `docs/PROJECT_RULES.md`
6. `README.md`
7. `docs/ELEMENT_MODEL.md`
8. `docs/RIGHT_PROPERTIES_PANEL.md`
9. `docs/CODE_AUDIT.md`
10. relevante øvrige fasedokumenter

Les deretter relevant produksjonskode før du foreslår modell eller implementasjon.

## Gjeldende verifiserte status

```text
siste fullførte produksjonsfase: fase 12 – prosjektfarger og Seksjon-rammer
GitHub-sak: #28 – lukket som fullført
PR: #29 – merget
mergecommit på main: a781b85a718ed6e5254530849299db8dfff3dfb6
prosjektskjema: versjon 7
lokal main: brukeren har bekreftet clean tree etter merge
neste produksjonsfase: fase 13 – Logo og header, men omfanget er ikke låst
```

PR #29 ble kontrollert som mergebar før merge. Den hadde 37 endrede filer, ingen reviewinnsigelser, ingen uløste reviewtråder og ingen GitHub Actions-kjøringer for headen.

Faktisk `origin/main`, lokal branch og commit-topper skal alltid kontrolleres på nytt. Commitnumrene over er historiske kontrollpunkter, ikke en erstatning for Git-kontroll.

## Siste verifiserte produksjonskontroll

Brukerens lokale terminaloutput etter siste produksjonsendring bekreftet:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 102 moduler, 274 avhengigheter, ingen brudd
Vite: 111 moduler transformert
CSS: 33.62 kB, gzip 6.34 kB
JavaScript: 264.52 kB, gzip 79.47 kB
produksjonsbuild: bestått på 192 ms
git diff --check: ingen whitespace-feil
```

`architecture.json` og `docs/dependency-graph.mmd` ble regenerert og committet i `1963088`, som inngikk i PR #29.

Ikke bruk disse tallene som bevis for senere endringer. Nye produksjonsendringer krever ny komplett kontroll.

## Dokumentasjonsbranch som er opprettet

```text
branch: docs/phase-12-handover
base: merget main etter PR #29
formål: synkronisere post-merge-status og overlevering
produksjonskode: skal ikke endres
```

Denne branchen ble opprettet fordi statusblokkene som ble merget sammen med PR #29 naturlig beskrev PR-en som åpen før selve mergehandlingen. Før fase 13 startes skal dokumentene beskrive fase 12 som merget og `main` som gjeldende grunnlag.

Dokumenter som skal kontrolleres på docs-branchen:

- `docs/NEXT_CHAT_PROMPT.md`
- `docs/WORK_PLAN.md`
- `docs/PROJECT_COLORS.md`
- `docs/EDITOR_PLANNING.md`
- `docs/PROJECT_RULES.md`
- `README.md`
- `docs/CODE_AUDIT.md`
- `docs/RIGHT_PROPERTIES_PANEL.md`

Ikke omskriv tekniske detaljer uten grunn. Endre bare pre-merge-status, neste handling og nødvendige overleveringsopplysninger. Opprett deretter en ren docs-PR mot `main`. Merge krever eksplisitt godkjenning.

## Implementert editorgrunnlag

- blankt PC- og Telefon-lerret
- toppmeny, venstremeny og høyremeny
- Seksjon, Bilde, Tekst og Knapp
- sentral prosjektmodell med stabile ID-er
- markering, flytting, resizing, låsing og sikker sletting
- kontrollert flerlinjet tekstredigering
- tekststil, tekstfarge og ekstern lenke
- bundlet SVG-knappbibliotek med stabil asset-ID, label og lenke
- lokal bildeimport for PNG, JPEG og WebP
- transient bilderessursbuffer med `File` og Object URL utenfor prosjektmodellen
- alternativ tekst, filmetadata, contain/crop, zoom og motivforskyvning
- separat bilderamme og crop-transform
- sidebakgrunn, Seksjon-bakgrunn, Seksjon-ramme og tekstfarge
- `Farger` som avledet oversikt over konkrete prosjektverdier

## Gjeldende menyansvar

```text
Venstremeny = opprette elementer, velge fil/design og vise prosjektoversikt
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere innhold og transformere elementer
Ressurslag = eie transient bildefil og renderings-URL
Prosjekt   = eie serialiserbare verdier
```

Gjeldende venstremeny:

```text
Prosjekt
Farger
Logo og header
Elementer
Innstillinger
```

Høyremenyen:

- vises bare når et element er markert
- er 320 px bred
- er dokket fra 1680 px og overlay under 1680 px
- har egen vertikal scrolling
- bruker 180 ms animasjon og respekterer reduced motion
- følger sentral selection-state
- skal forbli komposisjon; elementspesifikke kontroller ligger i egne filer

## Prosjektmodell versjon 7

```text
versjon 1  grunnmodell
versjon 2  tekstinnhold
versjon 3  tekststil
versjon 4  elementlenke
versjon 5  knappasset, knappetekst og knappelenke
versjon 6  bildeasset, metadata, alternativ tekst, visning og utsnitt
versjon 7  sidebakgrunn, Seksjon-utseende, Seksjon-ramme og tekstfarge
```

Autoritative fargeverdier:

```text
EditorColor = kanonisk #RRGGBB
sidebakgrunn = page.appearance.backgroundColor
Seksjon-bakgrunn = section.appearance.backgroundColor
Seksjon-rammebredde = 0..10
Seksjon-rammefarge = section.appearance.frame.color
tekstfarge = text.textStyle.color
```

`Farger` er ikke en lagret palett. Oversikten avledes fra aktiv side og stabile element-ID-er. Hver kontroll endrer bare én konkret egenskap. Like fargeverdier kobler ikke elementer sammen.

Knapper beholder ferdig SVG-fargedesign og inngår ikke i fargeredigeringen. Bilder har ingen prosjektfarge.

## State- og arkitekturgrenser

- `EditorProject` eier varige serialiserbare data.
- DOM og CSS er ikke permanent lagring.
- `File`, Blob og Object URL er ikke prosjektdata.
- Alle varige endringer går gjennom typede reducerhandlinger.
- Reduceren er siste valideringsgrense.
- Ugyldige, låste og uendrede handlinger returnerer samme state.
- `updatedAt` endres bare ved en gyldig reell prosjektmutasjon.
- Selection, panelstate, drafts, pekerpreview, fokus, hover og dialoger er transient state.
- Canvas skal ikke absorbere filvalg, egenskapslogikk eller ressurslagring.
- `RightPropertiesPanel.tsx` skal forbli komposisjon.
- Ressurslager, modell, state, rendering og UI skal ha separate ansvar.
- Ingen generell samlemappe eller samlefil opprettes uten et tydelig domeneansvar.

## Obligatorisk kontroll av filstørrelse og ansvar

Dette skal følges ved hver produksjonsendring:

```text
ønsket maksimum: 250 linjer per kildefil
aktiv refaktoreringsterskel: 250 linjer
hard unntaksgrense: 300 linjer
```

Regler:

- Kontroller linjetall før en eksisterende fil utvides.
- Kontroller linjetall igjen før PR.
- En fil som nærmer seg 250 linjer skal deles etter ansvar før mer funksjonalitet legges inn.
- Ikke del filer mekanisk bare for å redusere linjetall; trekk ut et reelt modell-, state-, hook-, UI- eller stilansvar.
- CSS deles etter editorområde og komponentansvar.
- Ingen ny eller berørt produksjonsfil skal passere 300 linjer.
- Dokumenter eventuelle bevisste unntak før merge.

Bruk PowerShell for en målrettet kontroll av berørte kildefiler, for eksempel:

```powershell
$changed = git diff --name-only origin/main...HEAD |
  Where-Object { $_ -match '^src/.*\.(ts|tsx|css)$' }

$changed | ForEach-Object {
  $lines = (Get-Content $_).Count
  [PSCustomObject]@{ Lines = $lines; File = $_ }
} | Sort-Object Lines -Descending
```

Kontroller også hele `src` når fasen er større eller flytter ansvar:

```powershell
Get-ChildItem src -Recurse -File -Include *.ts,*.tsx,*.css |
  ForEach-Object {
    [PSCustomObject]@{
      Lines = (Get-Content $_.FullName).Count
      File = $_.FullName.Replace((Get-Location).Path + '\', '')
    }
  } |
  Sort-Object Lines -Descending |
  Select-Object -First 30
```

Siste fase-12-audit bekreftet at alle nye og berørte produksjonsfiler var under 250 linjer. `reduceColorProjectAction.ts` var den største nye filen med 156 linjer. Dette må kontrolleres på nytt etter senere endringer.

## Obligatorisk framtidsrettet kodeaudit

Før PR skal du ikke bare kontrollere at funksjonen virker. Kontroller også:

- om det oppstår duplisert state eller flere kilder til sannhet
- om modellvalidering feilaktig bare ligger i UI
- om låste elementer kan muteres gjennom en alternativ inngang
- om ugyldige/no-op actions endrer objektidentitet eller `updatedAt`
- om transient state kan bli serialisert ved senere lagring eller historikk
- om ny funksjonalitet kobles til DOM/CSS i stedet for prosjektmodellen
- om canvas eller høyremeny får ansvar som tilhører modell, reducer, filvalg eller ressurslager
- om responsive verdier implisitt overskriver desktopverdier
- om bilde- eller assetressurser lekker Object URL-er eller får inkonsistent metadata
- om tastatur, fokus, reduced motion og låste kontroller fortsatt fungerer
- om eksisterende Tekst, Knapp, Bilde, crop, flytting, resizing og sletting regresjonstestes
- om nye avhengigheter bryter Dependency Cruiser-reglene
- om en fil nærmer seg 250 linjer eller har for mange ansvar

Auditfunn skal rettes før PR eller dokumenteres presist som et avtalt senere arbeid. Ikke skjul kjente problemer.

## Obligatoriske automatiske og lokale kontroller

Etter siste produksjonsendring:

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
git diff --check
git status --short
git diff --stat
```

`npm run check` skal fullføre hele kjeden:

```text
lint
TypeScript
authority/Dependency Cruiser
produksjonsbuild
```

Arkitekturrapportene skal bare committes når de faktisk er regenerert og kontrollert. Se på diffen; ikke anta at stor rapportdiff er korrekt.

Før PR skal working tree være clean og branchen synkronisert med origin. Etter dokumentcommit eller rapportcommit skal head-SHA kontrolleres på nytt.

## Obligatoriske grenser for senere faser

### Prosjektimport

Valider hele eksterne prosjektobjektet og skjemaversjonen før `replace-project`. Versjon 6 må migreres eller avvises kontrollert. Ikke stol på TypeScript-typen for eksterne data.

### Prosjektbytte

Avstem eller tøm bilderessursbufferen og tilbakekall foreldede Object URL-er.

### Historikk

Angre/gjør om skal lagre bare serialiserbar prosjektstate. `File`, Object URL og aktive interaksjoner skal ikke inngå.

### Mobiloverstyringer

Bruk eksplisitte viewport-spesifikke handlinger. Ikke skriv mobilendringer inn i desktopfeltet. Farger er felles i versjon 7; responsive farger krever eksplisitt senere modellstøtte.

### Autolagring

Reager på gyldige prosjektmutasjoner, ikke transient editor-, panel- eller ressursstate.

### Crop

Crop-grunnrammen for skjemaversjon 6 er låst til 240 × 160 px og forblir invariant i versjon 7. En annen crop-grunnmodell krever ny skjemaversjon og migrering.

## Planlagte senere faser

```text
fase 13  logo og header
fase 14  korrigeringslinjer
fase 15  responsive mobiloverstyringer
fase 16  angre og gjør om
fase 17  lokal automatisk lagring
fase 18  åpne og importere prosjekt
fase 19  forhåndsvisning og publisering
```

## Første oppgave i neste chat

Ikke start produksjonskode for fase 13 umiddelbart.

1. Kontroller faktisk lokal og ekstern status:

```powershell
cd C:\Users\tomha\Desktop\website
git fetch origin
git switch main
git pull --ff-only origin main
git status
git log -6 --oneline --decorate
```

Forventet historisk kontrollpunkt på `main` er mergecommit `a781b85`, men stol på faktisk Git-output dersom `main` har flyttet seg.

2. Kontroller docs-branchen:

```powershell
git switch docs/phase-12-handover
git pull --ff-only origin docs/phase-12-handover
git status
git log -6 --oneline --decorate
```

3. Les dokumentene i autoritativ rekkefølge og synkroniser bare post-merge-status. Ingen produksjonskode skal endres på docs-branchen.

4. Kontroller diffen mot `main`, opprett en docs-PR og merge den bare etter eksplisitt godkjenning.

5. Oppdater lokal `main` etter docs-merge.

6. Først deretter avgrenses fase 13 – Logo og header sammen med brukeren.

## Avgrensning som må avklares før fase 13-kode

Ikke anta løsning. Avklar blant annet:

- nøyaktig sluttresultat og brukerflyt i `Logo og header`
- om handlingen oppretter en ferdig header automatisk eller bare legger inn separate elementer
- hvilke felter som inngår: navn, undertittel, logo og eventuelle andre verdier
- om headeren er en egen elementtype, en Seksjon med genererte barn eller en sammensatt prosjektstruktur
- hvordan en logoressurs skal identifiseres og lagres
- om eksisterende bilderessurslager kan gjenbrukes uten å blande element- og headeransvar
- hvor filvalg skjer, og hvilke kontroller som hører hjemme i venstre- og høyremeny
- standardstørrelse, minimumsstørrelse, layout, lagrekkefølge og låsing
- farger, tekststil og forholdet til de eksisterende prosjektfargene
- PC/Telefon-arv og hvilke verdier som eventuelt skal være responsive
- serialisering, framtidig prosjektimport og ressurslivssyklus
- tilgjengelighet, tastaturrekkefølge og reduced motion
- om skjemaversjon 8 er nødvendig; dette avgjøres av varige modellendringer, ikke av UI alene

Når omfanget er låst, opprettes en ny feature-branch fra oppdatert `main`. Implementer i små, kontrollerte etapper med lokal `npm run check` etter hver risikofylt modell- eller stateendring.

---