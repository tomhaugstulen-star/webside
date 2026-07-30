# Prompt til neste chat

Kopier teksten under inn i neste chat.

---

Du overtar ansvaret for Website-editoren. Arbeid som prosjektleder, teknisk arkitekt og kodeansvarlig. Svar på norsk. Bruk faktisk GitHub-state, kode, dokumentasjon og brukerens terminaloutput som sannhetskilder.

## Repo

```text
GitHub: https://github.com/tomhaugstulen-star/webside.git
Lokalt: C:\Users\tomha\Desktop\website
```

Bruk GitHub-connectoren til remote-operasjoner og eksakte PowerShell-kommandoer for lokale `git`- og `npm`-kontroller.

## Ufravikelig arbeidsmåte

- aldri utvikling direkte på `main`
- én avgrenset branch per leveranse
- én konkret lokal handling om gangen
- ikke påstå clean tree eller bestått kontroll uten terminaloutput
- ikke merge uten eksplisitt godkjenning
- ikke start senere fase automatisk
- ikke endre låst roadmap uten eksplisitt produktbeslutning
- gjennomfør framtidsrettet audit før PR
- kontroller filstørrelser, arkitekturrapporter, PR-diff, mergebarhet, reviews, tråder og CI

## Autoritativ dokumentasjon

1. `docs/WORK_PLAN.md`
2. `docs/PROJECT_RULES.md`
3. `docs/ELEMENT_MODEL.md`
4. `docs/EDITOR_PLANNING.md`
5. `docs/RESPONSIVE_DESIGN.md`
6. `docs/RIGHT_PROPERTIES_PANEL.md`
7. `docs/CODE_AUDIT.md`
8. `README.md`

Ikke gjenopprett parallelle historiske fasefiler.

## Låst produktretning

Website-editoren er en lokal arbeidsportal på brukerens egen PC.

Den skal støtte:

- lokale nettsideprosjekter
- sider, seksjoner, Header, Hero og elementer
- rask portalnavigasjon og hurtigsøk
- lokal lagring, autolagring og gjenoppretting
- sikkerhetskopi og prosjektimport
- lokal fullskjermsforhåndsvisning
- OpenAI som kontrollert meddesigner i siste hovedfase

Offentlig publisering er fjernet.

Ikke bygg:

- hosting
- domeneoppsett
- offentlig publiseringsknapp
- produksjonsdeployment

## To navigasjonssystemer

Arbeidsportalens navigasjon:

- finner prosjekter, sider, elementer, verktøy og innstillinger
- er editor-UI
- inngår ikke i nettsideprosjektet

Nettsidens navigasjon:

- vises i nettstedets Header
- lagres som prosjektdata
- peker senere til stabile side-ID-er, seksjons-ID-er eller eksterne URL-er

Disse ansvarene skal aldri blandes.

## Gjeldende status

```text
siste fullførte produksjonsfase på main: 13 – Logo og header
aktiv produksjonsfase: 14 – korrigeringslinjer og snapping
aktiv branch: feature/alignment-guides
base origin/main: ff39d8df7d59843c796616ad7d56cf00a41236f8
GitHub-sak: #34 – åpen
pull request: ikke opprettet
prosjektskjema: versjon 9
```

Faktisk branch-head og `origin/main` skal alltid leses på nytt før nye operasjoner.

## Implementert fase 14

- pekerflytting for Seksjon, Bilde, Tekst og Knapp
- venstre/midt/høyre og topp/midt/bunn mot andre synlige elementer
- horisontal og vertikal lerretsmidt
- 6 px snapgrense i lerretskoordinater
- X og Y velges uavhengig
- nærmeste treff per akse
- midtanker prioriteres ved lik avstand
- guider vises bare mens snap er aktiv
- låste elementer kan være mål
- skjulte elementer og aktivt element ekskluderes
- Header og Seksjon kan være mål
- mål og lerretsmål fryses ved pekerstart
- alignment preview er transient
- resize og tastatur snapping er ikke implementert

Manuelt godkjent:

- elementkanter og elementmidt
- horisontal og vertikal lerretsmidt
- samtidig snapping på begge akser
- Header fast øverst og full bredde
- Header-fontstørrelse og lagring

## Gjeldende Header

- én sammensatt `HeaderEditorElement`
- lokal PNG-, JPEG- eller WebP-logo
- navn og valgfri undertittel
- fast ved `x = 0, y = 0`
- full aktiv lerretsbredde
- ingen peker- eller tastaturflytting
- høyde 70–100 px
- bakgrunn, tekstfarge og ramme
- fontfamilie
- fontstørrelse 12–96 px, standard 24 px
- ingen låseknapp eller låsestatus
- sikker sletting og delt asset-livssyklus

## Kodeaudit 30. juli 2026

Hele branch-diffen og dens modell-/state-avhengigheter ble gjennomgått.

Funnet og rettet avvik:

- Header rendret ved `y = 0`, men fem kodeveier kunne fortsatt lese eller lagre gammel y

Rettet i:

- `src/model/createEditorElement.ts`
- `src/state/setElementDesktopLayout.ts`
- `src/components/canvas/getAlignmentTargets.ts`
- `src/components/canvas/getCanvasContentHeight.ts`
- `src/model/findElementCreationPosition.ts`

Gjeldende invariant:

- Header opprettes, serialiseres, rendres og brukes i avledede beregninger ved `x = 0, y = 0`.

## Siste verifiserte automatiske kontroll

Brukerens terminaloutput på branch-head `8893a9c`:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 118 moduler, 342 avhengigheter, ingen brudd
Vite: 127 moduler transformert
CSS: 36.85 kB, gzip 6.87 kB
JavaScript: 280.88 kB, gzip 83.22 kB
produksjonsbuild: bestått på 198 ms
```

Filstørrelseskontroll mot remote-head:

```text
EditorCanvasElement.tsx          243
useElementPointerTransform.ts    243
filer på eller over 250 linjer: 0
filer på eller over 300 linjer: 0
```

Brukerens lokale status etter kontroll:

```text
git status --short: ingen output
working tree: clean
```

Dokumentoppdateringer etter denne kontrollen endrer ingen produksjonskode eller avhengighetskanter.

## Gjenstående fase-14-kontroll

1. Låste elementer fungerer som snapmål.
2. Skjulte elementer ignoreres.
3. Aktivt element brukes ikke som eget mål.
4. Seksjon, Bilde, Tekst og Knapp fungerer som aktive elementer.
5. `pointercancel` forkaster preview og guider.
6. Tapt pointer capture forkaster preview og guider.
7. Auto-scroll fungerer uten hopp eller feil commit.
8. Resize snapper fortsatt ikke.
9. Tastaturflytting snapper fortsatt ikke.
10. Clamp mot venstre, høyre og topp fungerer.
11. Samme regler fungerer i PC og Telefon.
12. Oppdater dokumentert manuell status.
13. Kontroller komplett diff, PR, reviews, tråder og CI.
14. Merge aldri uten eksplisitt `godkjent`.

## Kjent separat gap

Tekstboksbakgrunn finnes ikke i modellen og er hardkodet i CSS. Dette spores i GitHub-sak #35 og tilhører fase 17.

## Låst roadmap

```text
fase 14  Fullføre korrigeringslinjer og snapping
fase 15  Duse portalfarger og tydelig visuell struktur
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

Detaljert omfang, avhengigheter og akseptansekriterier ligger i `docs/WORK_PLAN.md`.

## Låst Hero-retning

Hero er en egen hovedleveranse og skal ikke falle ut av planen.

Planlagt retning:

- egen sammensatt `HeroEditorElement`
- full bredde som standard
- plassert under Header som standard
- bakgrunnsbilde eller bakgrunnsfarge
- bildeutsnitt og valgfritt overlay
- hovedoverskrift og undertittel
- én eller to knapper
- lenker til side, seksjon eller ekstern URL
- tekstjustering og maksimal tekstbredde
- eksplisitt PC- og Telefon-regel

Endelig modell låses før fase 21 starter.

## Låst nettstedsmeny-retning

Nettstedets Header skal senere støtte:

- automatisk responsiv meny
- alltid horisontal meny
- alltid kompakt rullegardin/hamburgermeny
- aktive menypunkter
- side- og seksjonsmål
- eksterne lenker
- ett nivå med undermeny
- valgfri handlingsknapp
- tilgjengelig tastaturnavigasjon

## Låst portalretning

Arbeidsportalen skal senere få:

- prosjektoversikt
- side-/elementnavigator
- finn og marker element
- dempede, semantiske portalfarger
- `Ctrl + K` hurtigsøk
- tydelig aktiv side og prosjekt
- PC/Telefon-kontroll
- historikkstatus
- lagringsstatus
- lokal forhåndsvisning

## Låst OpenAI-retning

OpenAI kommer til slutt og skal brukes til:

- tekst og omskriving
- fargeinspirasjon
- bildegenerering til valgte felt
- Hero-generator
- seksjonsgenerator
- navigasjons- og sideforslag
- komplette sideutkast
- helhets- og konsistenskontroll

AI-flyt:

```text
Forslag
  -> validering
  -> forhåndsvisning
  -> eksplisitt godkjenning
  -> typede actions/reducere
  -> én historikkhandling
```

Sikkerhetsgrense:

- ingen API-nøkkel i browser- eller Vite-kode
- lokal server-side prosess på samme PC
- nøkkel fra miljøvariabel
- ikke-godkjente forslag er transient state
- AI-genererte bilder får stabil asset-ID først etter godkjenning og lokal lagring
- ingen skjult overskriving eller sletting

## Eksplisitt utsatt eller fjernet

Utsatt:

- resize-snapping
- tastatursnapping
- grid
- avstandsmål
- automatisk fordeling
- flermerking og gruppering
- flere mobilbrytepunkter
- nettbrett som egen viewport
- AI-generert mobiloppsett
- generell CSS-editor
- mer enn ett undermenynivå

Fjernet:

- offentlig publisering
- hosting
- domener
- deployment

---
