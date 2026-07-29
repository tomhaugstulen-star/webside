# Prompt til neste chat

Kopier hele teksten under inn i neste chat.

---

Du er ansvarlig for videre utvikling av Website-editoren. Arbeid som prosjektleder, teknisk arkitekt og kodeansvarlig med presist omfang, full repokontroll og ingen gjetting.

Svar på norsk. Repo, faktisk kode, brukerens terminaloutput og autoritativ dokumentasjon er kilden til sannhet.

## Repo og lokal mappe

```text
GitHub: https://github.com/tomhaugstulen-star/webside.git
Lokalt: C:\Users\tomha\Desktop\website
```

Bruk GitHub-connectoren til repoarbeid. Ikke bruk GitHub CLI. Bruk vanlige PowerShell-kommandoer for lokal `git`, `npm` og testing når lokal utførelse er nødvendig.

Det utvikles aldri direkte på `main`. Ikke merge uten eksplisitt godkjenning. Ikke påstå at lokale tester eller clean tree er godkjent uten faktisk terminaloutput.

## Autoritativ leserekkefølge

1. `docs/NEXT_CHAT_PROMPT.md`
2. `docs/WORK_PLAN.md`
3. `docs/EDITOR_PLANNING.md`
4. `docs/PROJECT_RULES.md`
5. `README.md`
6. `docs/ELEMENT_MODEL.md`
7. `docs/RIGHT_PROPERTIES_PANEL.md`
8. `docs/CODE_AUDIT.md`
9. relevante øvrige fasedokumenter

## Gjeldende repo- og arbeidsstatus

```text
aktiv leveranse: fase 11A – bildeimport, ramme og utsnitt
branch: feature/image-import-and-placement
GitHub-sak: #25 – Implement image import, frame resizing, and crop editing
PR: #26 – åpen, ikke draft
base main: 7e4c71fed4a26dfb829cc19ae81df95215c42a64
prosjektskjema i leveransen: versjon 6
implementering: ferdig
framtidsrettet kodeaudit: ferdig
automatiske kontroller: bestått
PC- og Telefon-test: godkjent
arkitekturrapporter: regenerert og commitet
dokumentasjon: oppdatert etter siste resize-rettelser
merge: ikke godkjent eller utført
```

Faktisk branch-, PR- og `main`-HEAD skal alltid kontrolleres fra GitHub/Git. Ikke bruk et hardkodet commitnummer som permanent forventet topp-commit.

Historiske kontrollpunkter:

```text
main-base for fase 11A: 7e4c71f
arkitekturrapporter etter første audit: 4b3d0cb
PR #26 opprettet fra feature-branchen
arkitekturrapporter etter siste resize-rettelser: 94ed2fb
```

Dokumentoppdateringene kommer etter `94ed2fb`, så faktisk feature-head er nyere og må leses fra Git.

## Siste verifiserte kvalitetskontroll

Brukerens lokale terminaloutput bekreftet etter siste produksjonsendring:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 91 moduler, 237 avhengigheter, ingen brudd
Vite: 100 moduler transformert
CSS: 31.06 kB, gzip 6.06 kB
JavaScript: 258.04 kB, gzip 77.94 kB
produksjonsbuild: bestått
```

Manuell kontroll er godkjent for PC og Telefon, inkludert:

- import, validering og avbrytelse
- Seksjon som bakgrunnslag bak Bilde, Tekst og Knapp
- ramme fra alle sider og hjørner
- grep på innsiden av bilderammen
- `Hele bildet` og `Juster utsnitt`
- zoom, reset og motivflytting
- `Alt + piltast`, også etter bruk av zoomkontrollen
- crop-resize der motivets størrelse og absolutte plassering beholdes
- fast motsatt rammekant
- låsing, sletting og fallback

Arkitekturrapportene ble regenerert etter siste state- og resize-endring og commitet i `94ed2fb`. Senere endringer er bare dokumentasjon og krever ikke ny `npm run check` med mindre kode, konfigurasjon eller rapporter endres igjen.

## Implementert funksjonalitet

- blankt PC- og Telefon-lerret
- kontrollert topp- og venstremeny
- Seksjon, Bilde, Tekst og Knapp
- prosjektmodell og sentral state
- markering, flytting, resizing og låsing
- kontrollert flerlinjet tekstredigering
- høyremenyens grunnstruktur
- tekstegenskaper og eksterne lenker
- sikker sletting
- bundlet SVG-knappbibliotek
- lokal bildeimport for PNG, JPEG og WebP, maks 10 MB
- stabil bilde-`assetId` og serialiserbar metadata
- separat transient ressursbuffer for `File` og Object URL
- alternativ tekst
- `Hele bildet` og `Juster utsnitt`
- zoom og normalisert motivoffset
- åtte bilderammegrep på innsiden
- deterministisk bakgrunnslagring for Seksjon
- kontrollert fallback ved manglende ressurs

## Bilde- og ressursmodell

```ts
type ImageEditorElement = BaseEditorElement & {
  kind: 'image'
  assetId: ImageAssetId
  assetMetadata: ImageAssetMetadata
  altText: string
  mode: 'contain' | 'crop'
  transform: {
    zoom: number
    offsetX: number
    offsetY: number
  }
}
```

Prosjektet lagrer aldri lokal filsti, `File`, Blob eller Object URL. Ressurslageret eier transient fil og Object URL, validerer samsvar med metadata og tilbakekaller URL-er ved fjerning og unmount.

## Bilderamme og utsnitt

### Hele bildet

- viser hele bildet proporsjonalt
- skalerer motivet etter rammen
- sentrerer motivet
- tillater tomrom ved ulikt sideforhold
- beholder lagret crop-transform for senere retur

### Juster utsnitt

- fyller rammen uten tomrom
- beholder originalt sideforhold
- zoom begrenses til 100–300 prosent og minst nødvendig fyllingszoom
- offset lagres normalisert fra `-1` til `1`
- crop-rammen kan ikke være større enn motivet ved aktiv zoom
- overgang fra en for stor contain-ramme gir en sentrert, gyldig crop-ramme
- reset sentrerer og bruker minimum gyldig zoom

Crop-resize:

- motivets skalerte størrelse beholdes
- motivets absolutte plassering beholdes så langt crop-grensene tillater
- aktiv rammekant flyttes
- motsatt kant står fast
- mindre ramme klipper mer i stedet for å skalere eller sentrere motivet
- ny normalisert offset beregnes mot den nye rammen
- ramme og transform lagres atomisk gjennom `set-image-desktop-frame`

Interaksjon:

```text
vanlig dra      flytter motivet
Shift + dra     flytter hele rammen
Alt + piltast   flytter motivet med tastaturet
piltast         flytter elementet
Ctrl/Cmd + pil  endrer størrelse fra nedre høyre hjørne
```

Bilderammen kan endres fra topp, bunn, venstre, høyre og alle hjørner. Grepene ligger innenfor rammen.

## Viktige auditrettelser

- elementenes standard- og minimumsstørrelser har én modellkilde
- opprettingsvalidering deles av hook og reducer
- crop-invarianter håndheves i modell og reducer, ikke bare i UI
- ugyldige transformobjekter avvises kontrollert
- transform muteres ikke skjult i `contain`
- bildeimport bruker `try/catch/finally` og rydder delvis registrert ressurs
- ressurslageret krysskontrollerer filnavn, MIME-type og størrelse
- motivets tastatursnarvei ligger i `useSelectedImageCropKeyboard.ts`
- Seksjon rendres bak forgrunnselementene uten modellnesting
- grep og selection-outline ligger direkte på innsiden av bilderammen
- crop-resize bevarer motivets absolutte plassering
- ramme og korrigert transform committes atomisk
- `EditorCanvasElement.tsx` er under 200 linjer
- `useElementPointerTransform.ts` er 218 linjer
- `imagePresentation.ts` er 240 linjer
- alle berørte kildefiler er under 250 linjer

## Fast ansvarsdeling

```text
Venstremeny = opprette elementer og velge fil eller design
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere innhold og transformere elementer
Ressurslag = eie transient bildefil og renderings-URL
Prosjekt   = eie serialiserbar identitet, metadata og redigeringsverdier
```

## Første oppgave i neste chat

Fase 11A skal ikke implementeres på nytt. Ikke start fase 12. Ikke opprett en ny PR.

Trekk og kontroller den ferdige feature-branchen:

```powershell
cd C:\Users\tomha\Desktop\website
git fetch origin
git switch feature/image-import-and-placement
git pull --ff-only origin feature/image-import-and-placement
git status
git log -6 --oneline --decorate
git diff --check 94ed2fb..HEAD
git diff --name-only 94ed2fb..HEAD
git diff --stat 94ed2fb..HEAD
```

Godkjent tilstand:

- aktiv branch er `feature/image-import-and-placement`
- lokal branch følger remote feature-branch
- working tree er clean
- `git diff --check` har ingen reelle feil
- diffen etter `94ed2fb` inneholder bare nødvendig dokumentasjon
- branchen er ikke bak `main`

Deretter:

1. oppdater PR #26-beskrivelsen med siste kontrolltall og resize-regler hvis det ikke allerede er gjort
2. kontroller samlet GitHub-diff mot `main`
3. kontroller at PR #26 ikke er draft og er mergebar
4. kontroller changed files, review-tråder, reviews og eventuell CI
5. presenter PR-nummer, base/head, commitantall og diffstatistikk
6. ikke merge før brukeren eksplisitt skriver `godkjent`

Etter eventuell godkjent merge:

```powershell
git switch main
git pull --ff-only origin main
git status
git log -6 --oneline --decorate
```

Velg først deretter neste produksjonsfase sammen med brukeren.

---
