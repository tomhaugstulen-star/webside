# Arbeidsplan

Dette dokumentet er den autoritative, låste arbeidsrekkefølgen for Website-editoren.

Planen beskriver gjeldende leveranse, varige produktbeslutninger, avhengigheter, akseptansekriterier og eksplisitt utsatt arbeid. Ingen senere fase startes eller blandes inn i en aktiv branch uten en ny eksplisitt beslutning.

## Fast arbeidsflyt

1. Kontroller faktisk `main`, lokal branch og clean working tree.
2. Lås produkt-, modell- og UI-omfang før produksjonskode.
3. Implementer bare avtalt omfang på egen branch.
4. Hold produksjonsfiler under aktiv terskel på 250 linjer.
5. Gjennomfør framtidsrettet kodeaudit.
6. Kjør full automatisk kontroll etter siste produksjonsendring.
7. Test relevant funksjonalitet manuelt i PC- og Telefon-visning.
8. Regenerer arkitekturrapporter bare ved modul- eller importgrafendringer.
9. Oppdater autoritativ dokumentasjon.
10. Kontroller PR-diff, mergebarhet, CI/status, reviews, kommentarer og åpne tråder.
11. Merge bare etter eksplisitt brukergodkjenning.

Standard lokal kontroll:

```powershell
npm run check
git diff --check origin/main...HEAD
git status --short
git diff --stat origin/main...HEAD
```

Ved import- eller modulendringer:

```powershell
npm run architecture:json
npm run architecture:diagram
npm run check
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

## Låst produktretning

Website-editoren skal være en komplett lokal arbeidsportal på brukerens egen PC.

Den skal brukes til å:

- opprette og redigere nettsideprosjekter
- administrere sider, seksjoner, Header, Hero og øvrige elementer
- finne innhold raskt gjennom portalnavigasjon og søk
- lagre prosjekter lokalt
- lage sikkerhetskopier og åpne prosjektfiler
- gjenopprette etter feil eller krasj
- forhåndsvise resultatet lokalt
- bruke OpenAI som kontrollert meddesigner i siste hovedfase

Offentlig publisering er fjernet. Prosjektet skal ikke bygge hosting, domeneoppsett, opplasting til offentlig server, produksjonsdeployment eller publiseringshistorikk. En eksisterende eller planlagt `Publiser`-handling skal senere erstattes med lokal `Forhåndsvis` eller tilsvarende.

## To separate navigasjonssystemer

Arbeidsportalens navigasjon og nettsidens navigasjon er forskjellige ansvar.

Arbeidsportalens navigasjon:

- åpner prosjekter, sider, elementer, paneler, verktøy og innstillinger
- eies av editorens UI
- lagres ikke som nettsideinnhold

Nettsidens navigasjon:

- vises i nettstedets Header
- peker til stabile side-ID-er, seksjons-ID-er eller eksterne URL-er
- er varig prosjektdata

Disse systemene skal ikke blandes.

## Visuell portalretning

Arbeidsportalens områder skal skilles med dempede, harmoniske farger. Målet er tydelig struktur, ikke dekorativt sterke flater.

Fase 15 låser følgende sentrale retning:

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

Fargene defineres gjennom semantiske tokens. Portaltemaet skal ikke endre nettsideprosjektets egne bakgrunner, tekstfarger, Seksjon-farger, Header-farger eller knappdesign.

## Gjeldende leveransestatus

```text
siste fullførte produksjonsfase på main: 14 – korrigeringslinjer og snapping
main ved branchstart: 20b14af77365c4df912d0b3584a1a503cf0cec59
prosjektskjema: versjon 9
aktiv produksjonsfase: 15 – duse portalfarger og tydelig visuell struktur
aktiv branch: feature/phase-15-portal-colors
verifisert branch-head: 7ea58a500b500efb884544751f0913a1a07cf285
GitHub-sak: #42 – åpen til merge
pull request: #43 – draft etter slutt-audit, ikke merget
visuell regresjon: godkjent
framtidsrettet kodeaudit: fullført
automatisk sluttkontroll: bestått på 7ea58a5
filstørrelseskontroll: bestått
neste fase etter merge: 16 – automatisert testgrunnlag
```

Fase 15 er implementert og verifisert på featurebranchen, men er ikke fullført på `main` før PR #43 er merget og mergecommit er dokumentert.

## Fase 14 – korrigeringslinjer og snapping

Fase 14 er fullført og merget til `main`.

Levert:

- 6 px snapping ved pekerflytting
- elementankere på venstre, midt og høyre samt topp, midt og bunn
- horisontal og vertikal lerretsmidt
- uavhengig valg per akse
- låste synlige elementer som mål
- skjulte elementer og aktivt element ekskludert
- Header som fast, fullbredde snapmål
- transient preview, snapmål og guider
- kontrollert auto-scroll, clamping, cancel og tapt pointer capture
- Header-fontstørrelse 12–96 px
- Header fast ved `x = 0, y = 0`

Leveransereferanser:

```text
GitHub-sak: #34 – lukket
pull request: #39 – merget
mergecommit: 0122605b60808689cdda7cb1601eb3342680f88c
```

## Fase 15 – duse portalfarger og tydelig visuell struktur

### Status

Implementert, manuelt godkjent, auditert og automatisk verifisert på `7ea58a5`. Avventer endelig PR-kontroll og eksplisitt mergegodkjenning.

### Levert

- sentrale semantiske tokens for portalflater og kontrollflater
- egne tokens for tekst, border, fokus, disabled, advarsel, sletting og suksess
- beige portalflater for toppmeny, rail, paneler og arbeidsområde
- tydelig aktiv oransje tilstand
- egne ikonfarger for Prosjekt, Farger, Logo og header og Elementer
- samme fargeskille for Seksjon, Bilde, Tekst og Knapp i elementbiblioteket
- tydelige hover-, fokus- og disabled-tilstander
- konsistente lagret-, advarsel-, feil- og slettetilstander
- uendret høyrepanelbredde på 320 px
- uendret overlay under 1680 px og reservert plass ved 1680 px og bredere
- bevart `prefers-reduced-motion`
- ingen endring i prosjektmodell eller skjemaversjon

### Framtidsrettet auditrettelse

Første implementasjon koblet ikonfarger til `nth-child`. Det ville gjort fargene avhengige av DOM-rekkefølgen og kunne gitt feil farge når menyen eller elementbiblioteket senere utvides.

Dette er erstattet med eksplisitte semantiske variantklasser:

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

TSX-endringene påvirker bare CSS-klassenavn. State, eventflyt, prosjektmodell, validering og elementoppretting er uendret.

### Verifisert kontroll på `7ea58a5`

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
```

Arkitekturrapportene er ikke regenerert fordi ingen import eller modulgrense er endret.

### Ikke del av fasen

- tekstboksbakgrunn i prosjektmodellen
- editor-only elementgrense
- notatmodell i høyrepanelet
- like mellomrom og fordelingsguider
- mørk modus eller brukerdefinerte portaltemaer
- arbeidsportalnavigator eller `Ctrl + K`
- sider, navigasjonsmodell, Header-meny eller Hero
- responsive mobiloverstyringer
- angre/gjør om
- lokal lagring, import eller fullskjermsforhåndsvisning
- OpenAI
- offentlig publisering

## Låst roadmap

```text
fase 14  Korrigeringslinjer og snapping – fullført
fase 15  Duse portalfarger og tydelig visuell struktur – klar for merge
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

Rekkefølgen er låst. Endring krever eksplisitt produktbeslutning og synkronisert dokumentasjon.

## Fase 16 – automatisert testgrunnlag

### Formål

Redusere regresjonsrisiko før sider, navigasjon, Hero, historikk, lagring og AI gjør modellen større.

### Omfang

- testverktøy for TypeScript-moduler
- tester for modellvalidatorer
- tester for reducerhandlinger
- tester for snapping, layout og clamping
- tester for ugyldige og uendrede handlinger
- tester for ressurs- og ID-grenser der det er praktisk
- et lite, kontrollert sett nettleserbaserte regresjonstester
- én tydelig testkommando i prosjektets kvalitetskontroll

### Akseptansekriterier

- testkommando kan kjøres lokalt og i CI
- rene modell- og layoutfunksjoner er dekket
- reducerens valideringsgrenser er dekket
- minst én kritisk editorflyt testes i nettleser

## Fase 17 – tekstboksbakgrunn og små eksisterende modellgap

- implementere issue #35
- varig og validert tekstboksbakgrunn
- standardverdi og skjemakonsekvens
- `Bakgrunn` og `Tekstfarge` for tekstelementer
- reducer- og hookstøtte
- rendering fra prosjektdata i stedet for hardkodet CSS
- kontrollere andre små dokumenterte modellgap separat

## Fase 18 – arbeidsportalnavigasjon, navigator og hurtigsøk

- portaloversikt for aktivt prosjekt
- hierarkisk side-/elementnavigator
- finn og marker element på lerret
- type, navn, synlighet og låsestatus
- filtrering etter type og status
- globalt kommandofelt, anbefalt `Ctrl + K`
- tydelig fokusstyring og tastaturnavigasjon

## Fase 19 – sider, seksjons-ID-er og navigasjonsmodell

- opprette, navngi, duplisere, sortere og slette sider
- validert slug og startside
- stabile side-ID-er
- stabile seksjons-ID-er og valgfrie ankere
- lenkemål for side, seksjon og ekstern URL
- kontrollert håndtering av referanser ved sletting

## Fase 20 – nettstedets Header og menynavigasjon

- automatisk, horisontal og kompakt meny
- menybygger med rekkefølge, synlighet og ett nivå undermeny
- stabile side- og seksjonsmål
- valgfri handlingsknapp og sticky Header
- tilgjengelig tastaturnavigasjon og fokusretur

## Fase 21 – Hero

- egen `HeroEditorElement`
- full bredde som standard
- bakgrunnsbilde eller bakgrunnsfarge
- kontrollert bildeutsnitt og valgfritt overlay
- hovedoverskrift, undertittel og én eller to knapper
- interne og eksterne lenker
- tekstjustering, maksimal tekstbredde og tekstfarge
- dokumentert PC- og Telefon-oppførsel

## Fase 22 – Header-redigering og nettstedstruktur

- bytte logo og redigere navn og undertittel
- kontrollert assetbytte og ressursopprydding
- redigere menydesign etter fase 20
- avklare nettstednivå kontra sidenivå

## Fase 23 – responsive mobiloverstyringer

- egen mobilposisjon og mobilstørrelse der tillatt
- egen mobilsynlighet
- tydelig `Arver fra PC` og `Eget mobiloppsett`
- `Bruk PC-oppsett` fjerner overstyringen
- viewport-bevisste actions og reducere

## Fase 24 – angre og gjør om

- historikk for serialiserbar prosjektstate
- én ferdig transform per historikkoppføring
- transient preview inngår ikke
- ugyldige og uendrede handlinger inngår ikke
- tydelig status i toppmenyen

## Fase 25 – lokal prosjektlagring, autolagring og gjenoppretting

- flere lokale prosjekter
- prosjektoversikt og nylige prosjekter
- autolagring etter gyldige mutasjoner
- manuell lagring, anbefalt `Ctrl + S`
- status `Lagrer`, `Lagret` og `Feil`
- snapshots og krasjgjenoppretting

## Fase 26 – sikkerhetskopi, prosjektformat, import og migrering

- kanonisk prosjektfilformat
- manuell sikkerhetskopi
- åpne og importere prosjektfil
- full modellvalidering før prosjektbytte
- migrering mellom støttede skjemaversjoner
- kontrollert ressursavstemming

## Fase 27 – lokal forhåndsvisning

- fullskjermsforhåndsvisning uten editorverktøy
- PC- og Telefon-visning
- alle sider, Header, Hero, elementer og lenker
- samme responsive modell som editoren
- ingen hosting eller offentlig URL

## Fase 28 – malbibliotek og gjenbrukbare seksjoner

- enkle prosjektmaler
- Header- og Hero-varianter
- standard seksjonstyper
- lagre valgt seksjon som lokal mal
- validert modell og kontrollert assethåndtering

## Fase 29 – OpenAI-integrasjon

- API-nøkkel aldri i Vite- eller browserkode
- lokal sikker server-side grense
- tekst, omskriving og fargeinspirasjon
- bildegenerering til valgte felt
- Hero-, seksjons- og sideforslag
- forhåndsvisning og eksplisitt godkjenning før commit
- alle endringer gjennom typede actions og reducere
- én kontrollerbar historikkhandling

## Eksplisitt utsatt arbeid

Følgende bygges ikke uten ny beslutning:

- snapping under resizing
- snapping ved tastaturflytting
- grid eller faste intervaller
- avstandsmål og automatisk fordeling
- flermerking og gruppering
- avansert lagpanel utover nødvendig navigator
- flere mobile brytepunkter eller nettbrett som egen viewport
- automatisk kollisjonsunngåelse
- AI-generert mobiloppsett
- generell CSS-editor
- mer enn ett undermenynivå
- offentlig publisering

## Roadmapregel

Når en fase er ferdig:

1. status oppdateres med faktisk branch-head og kontrollresultat
2. PR kontrolleres og merges bare etter eksplisitt godkjenning
3. faktisk mergecommit registreres
4. neste fases omfang leses på nytt
5. issue og branch opprettes først etter ny eksplisitt godkjenning
