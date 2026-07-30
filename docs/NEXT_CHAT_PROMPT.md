# Prompt til neste chat

Kopier hele teksten mellom `START HANDOVER` og `SLUTT HANDOVER` inn i neste chat.

---

# START HANDOVER

Du overtar ansvaret for Website-editoren. Arbeid som prosjektleder, teknisk arkitekt og kodeansvarlig. Svar på norsk. Bruk faktisk GitHub-state, faktisk kode, autoritativ dokumentasjon og brukerens terminaloutput som sannhetskilder. Ikke gjett, og ikke påstå at noe er clean, testet eller synkronisert uten bevis.

## 1. Repo og lokal mappe

```text
GitHub: https://github.com/tomhaugstulen-star/webside.git
Lokalt: C:\Users\tomha\Desktop\website
Standardbranch: main
```

Bruk GitHub-connectoren til remote-operasjoner, kodeinspeksjon, branches, commits, issues og pull requests. Gi eksakte PowerShell-kommandoer for lokale Git-, Node-, Vite- og manuelle kontroller.

## 2. Siste bekreftede remote-status

```text
main: 1ae0bebabf3eb02104bafa80a029b40d5c06de12
commit: Merge pull request #43 from tomhaugstulen-star/feature/phase-15-portal-colors
PR #43: merget
issue #42: lukket som fullført
fase 15: fullført på main
source branch-head: 7a4e6882cc3be69145de08f1478d385c5503193b
verifisert produksjons-head: 7ea58a500b500efb884544751f0913a1a07cf285
prosjektskjema: versjon 9
neste planlagte fase: 16 – automatisert testgrunnlag
fase 16: ikke startet
```

Dokumentasjonssynk etter merge arbeides på:

```text
branch: docs/record-phase-15-merge
base: 1ae0bebabf3eb02104bafa80a029b40d5c06de12
```

Ikke anta at docs-branchen eller en eventuell docs-PR er merget. Kontroller faktisk GitHub-status først.

Brukerens lokale `main` er ikke bekreftet synkronisert til `1ae0beb` i denne handoveren. Ikke påstå lokal HEAD eller clean tree før terminaloutput er lest.

## 3. Ufravikelig arbeidsmåte

- Aldri utvikling direkte på `main`.
- Én avgrenset feature- eller docs-branch per leveranse.
- Ingen merge uten at brukeren eksplisitt skriver `godkjent`.
- `fungerer` godkjenner en test, ikke en merge.
- Lås omfang før produksjonskode.
- Ikke bland inn senere faser eller separate issues.
- Hold produksjonsfiler under aktiv terskel på 250 linjer; hard grense 300.
- Gjennomfør framtidsrettet kodeaudit før PR.
- Kjør full automatisk kontroll etter siste produksjonsendring.
- Kontroller diff, PR, mergebarhet, CI/status, reviews, kommentarer og åpne tråder.
- Regenerer arkitekturrapporter bare ved faktisk modul- eller importgrafendring.
- Oppdater autoritativ dokumentasjon etter faktisk mergecommit.

## 4. Autoritative dokumenter

Les i denne rekkefølgen:

1. `docs/WORK_PLAN.md`
2. `docs/PROJECT_RULES.md`
3. `docs/ELEMENT_MODEL.md`
4. `docs/EDITOR_PLANNING.md`
5. `docs/RESPONSIVE_DESIGN.md`
6. `docs/RIGHT_PROPERTIES_PANEL.md`
7. `docs/CODE_AUDIT.md`
8. `README.md`
9. `docs/NEXT_CHAT_PROMPT.md`

Regler:

- Faktisk kode og terminaloutput vinner over foreldet dokumenttekst.
- `WORK_PLAN.md` eier låst rekkefølge og faseomfang.
- `PROJECT_RULES.md` eier varige arbeids-, modell- og arkitekturgrenser.
- Historiske fasefiler skal ikke gjenopprettes som parallelle sannhetskilder.

## 5. Første kontroll i neste chat

Kontroller med GitHub-connectoren:

- faktisk remote `main`
- åpne pull requests
- status for `docs/record-phase-15-merge`
- relevante åpne issues
- at PR #43 er merget og issue #42 lukket

Be deretter brukeren kjøre dersom lokal status ikke allerede er vist:

```powershell
Set-Location C:\Users\tomha\Desktop\website

git switch main
git pull --ff-only origin main
git status --short
git log -1 --oneline
```

Ikke opprett fase-16-branch før dokumentasjonssynken etter fase 15 er avsluttet og lokal `main` er bekreftet clean.

## 6. Teknologistack og standardkontroll

```text
React 19
React DOM 19
TypeScript 6
Vite 8
ESLint 10
Dependency Cruiser 17
Windows / PowerShell
```

`npm run check` kjører:

```text
lint
-> typecheck
-> architecture:check
-> production build
```

Standard lokal sluttkontroll:

```powershell
npm run check
git diff --check
git status --short
git diff --stat
```

Ved import- eller modulendringer:

```powershell
npm run architecture:json
npm run architecture:diagram
npm run check
git diff --check
git status --short
git diff --stat
```

Repositoryomfattende filstørrelseskontroll:

```powershell
Get-ChildItem src -Recurse -File -Include *.ts,*.tsx,*.css |
    ForEach-Object {
        [PSCustomObject]@{
            File  = $_.FullName.Replace((Get-Location).Path + '\', '')
            Lines = (Get-Content $_.FullName).Count
        }
    } |
    Where-Object { $_.Lines -ge 250 } |
    Sort-Object Lines -Descending |
    Format-Table -AutoSize
```

## 7. Fase 15 – levert resultat

Fase 15 innførte et semantisk portaltema uten å endre prosjektdata, skjema, reducer eller elementlogikk.

Godkjent palett:

```text
portal/header        #F6EFE6
panel                #FAF6F1
aktiv bakgrunn       #FFE8DA
kant                 #E6DED2
aktiv oransje        #E25A1C
mørk tekst           #1F1F1F
sekundær tekst       #6B6F76
blå ikon             #2F6DB6
grønn ikon           #2E7D32
lilla ikon           #7E3FA8
oransje ikon         #E07A24
```

Den røde topplinjen i referanseskjermbildet tilhører nettleserens dev-miljø og er ikke en del av editoren.

Visuell betydning:

- Prosjekt og Seksjon: blå.
- Farger og Bilde: grønn.
- Logo og header samt Tekst: lilla.
- Elementer og Knapp: oransje.
- Innstillinger: nøytral mørk.
- valgt tilstand: aktiv oransje med lys oransje bakgrunn.

Framtidsrettet auditrettelse:

Første implementasjon brukte `nth-child` for ikonfarger. Dette ble fjernet fordi menyutvidelser eller endret rekkefølge kunne gi feil farge. Fargene er nå bundet til eksplisitte semantiske variantklasser:

```text
rail-button--files
rail-button--design
rail-button--media
rail-button--elements
rail-button--settings

element-card--section
element-card--image
element-card--text
element-card--button
```

Kompatibilitetsaliasene `--text`, `--muted`, `--accent`, `--border`, `--border-strong`, `--panel` og `--app-bg` beholdes foreløpig fordi eldre stilfiler bruker dem. Nye portalstiler skal bruke `--portal-*`-roller. Aliasene skal ikke fjernes uten egen kartlagt opprydding.

Bevarte grenser:

- høyrepanel 320 px
- overlay under 1680 px
- reservert plass ved 1680 px og bredere
- venstrepanelets oppførsel uendret
- `prefers-reduced-motion` bevart
- nettsideprosjektets egne farger uendret
- ingen importgrafendring

## 8. Verifisert fase-15-kontroll

Produksjonskoden ble verifisert på `7ea58a5`:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 118 moduler, 341 avhengigheter, 0 brudd
Vite: 127 moduler transformert
CSS: 45.36 kB, gzip 7.34 kB
JavaScript: 280.72 kB, gzip 83.19 kB
produksjonsbuild: bestått på 197 ms
git diff --check: ingen feil
git status --short: clean
produksjonsfiler >= 250 linjer: 0
visuell regresjon: godkjent
```

Arkitekturrapportene ble ikke regenerert fordi import- og modulgrafen var uendret.

## 9. Gjeldende prosjektmodell

Prosjektskjemaet er versjon 9.

```text
1  grunnmodell
2  tekstinnhold
3  tekststil
4  elementlenke
5  knappasset, knappetekst og knappelenke
6  bildeasset, metadata, alternativ tekst, visning og utsnitt
7  sidebakgrunn, Seksjon-utseende, Seksjon-ramme og tekstfarge
8  Header med logo, tekst, utseende og ramme
9  Header-fontstørrelse
```

Varige data går gjennom typede actions og reducere. `EditorProject` er eneste varige sannhetskilde. DOM, CSS, hover, fokus, dialoger, pointerpreview, guider, `File`, Blob og Object URL er transient.

## 10. Implementert editorgrunnlag

- blankt PC- og Telefon-lerret
- toppmeny, venstremeny, venstrepanel og høyrepanel
- Seksjon, Bilde, Tekst, Knapp og Header
- sentral prosjektstate og typede reducerhandlinger
- markering, flytting og størrelsesendring
- tastaturflytting og tastaturresize der tillatt
- låsing for Seksjon, Bilde, Tekst og Knapp
- tekstredigering og eksterne lenker
- sikker sletting
- SVG-knappbibliotek med stabile asset-ID-er
- lokal bilde- og logoimport
- bildeutsnitt, zoom, alternativ tekst og metadata
- side- og elementfarger
- Seksjon- og Header-ramme
- korrigeringslinjer og 6 px snapping ved pekerflytting
- semantisk portaltema og tydelige interaksjonstilstander

## 11. Separate åpne saker

Disse ble ikke blandet inn i fase 15:

```text
#35 tekstboksbakgrunn som varig prosjektdata
#36 editor-only elementgrense
#37 elementnotat og høyrepanelmodell
#38 like mellomrom og fordelingsguider
#3  senere mobile designkontroller
```

Ikke implementer dem skjult i fase 16.

## 12. Neste planlagte fase: 16 – automatisert testgrunnlag

Formål: redusere regresjonsrisiko før sider, navigasjon, Header-meny, Hero, historikk, lagring og AI gjør modellen større.

Planlagt omfang:

- velge et lite og vedlikeholdbart testverktøy for TypeScript-moduler
- tester for modellvalidatorer
- tester for reducerhandlinger
- tester for snapping, layout og clamping
- tester for ugyldige og uendrede handlinger
- tester for ressurs- og ID-grenser der det er praktisk
- et lite kontrollert sett nettleserbaserte regresjonstester
- én tydelig testkommando i kvalitetskontrollen
- testkommando som kan kjøres lokalt og senere i CI

Ikke del av fase 16:

- full pixeltest av hele editoren
- testing av framtidige funksjoner som ikke finnes
- store mock-rammeverk uten dokumentert behov
- fase 17–29-funksjoner

Akseptansekriterier fra arbeidsplanen:

- testkommando kan kjøres lokalt og i CI
- eksisterende rene modell- og layoutfunksjoner er dekket
- reducerens valideringsgrenser er dekket
- minst én kritisk editorflyt testes i nettleser
- `npm run check` inkluderer eller følges av dokumentert testkontroll

Før kode:

1. Avslutt dokumentasjonssynken etter fase 15.
2. Kontroller faktisk `main`, clean tree og åpne PR-er.
3. Les eksisterende scripts, rene modellfunksjoner og reducerstruktur.
4. Lås testverktøy, testnivåer, filplassering og kommandoer.
5. Opprett issue og egen featurebranch først etter eksplisitt brukergodkjenning.

## 13. Låst videre rekkefølge

```text
fase 15  Duse portalfarger og tydelig visuell struktur – fullført
fase 16  Automatisert testgrunnlag
fase 17  Tekstboksbakgrunn og små eksisterende modellgap
fase 18  Arbeidsportalnavigasjon, navigator og hurtigsøk
fase 19  Sider, seksjons-ID-er og navigasjonsmodell
fase 20  Nettstedets Header og menynavigasjon
fase 21  Hero
fase 22  Header-redigering og nettstedstruktur
fase 23  Responsive mobiloverstyringer
fase 24  Angre og gjør om
fase 25  Lokal prosjektlagring, autolagring og gjenoppretting
fase 26  Sikkerhetskopi, prosjektformat, import og migrering
fase 27  Lokal forhåndsvisning
fase 28  Malbibliotek og gjenbrukbare seksjoner
fase 29  OpenAI-integrasjon
```

Rekkefølgen endres ikke uten eksplisitt produktbeslutning og synkronisert dokumentasjon.

## 14. Eksplisitt utsatt eller fjernet

Utsatt uten egen aktiv leveranse:

- snapping ved resizing
- snapping ved tastatur
- grid og avstandsmål
- automatisk fordeling
- flermerking og gruppering
- nettbrett som egen viewport
- automatisk kollisjonsunngåelse
- generell CSS-editor
- mer enn ett undermenynivå

Fjernet fra produktplanen:

- offentlig publisering
- hosting
- domener
- produksjonsdeployment

# SLUTT HANDOVER
