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
base main: 7e4c71fed4a26dfb829cc19ae81df95215c42a64
prosjektskjema i leveransen: versjon 6
implementering: ferdig
framtidsrettet kodeaudit: ferdig
automatiske kontroller: bestått
PC- og Telefon-test: godkjent
arkitekturrapporter: regenerert og commitet
dokumentasjon: oppdatert på feature-branchen
PR: ikke opprettet
merge: ikke godkjent eller utført
```

Faktisk branch- og `main`-HEAD skal alltid kontrolleres fra GitHub/Git. Ikke bruk et hardkodet commitnummer som permanent forventet topp-commit.

Historiske kontrollpunkter:

```text
main-base for fase 11A: 7e4c71f
siste kodefix før rapporter: 964e011
arkitekturrapporter etter audit: 4b3d0cb
```

Dokumentoppdateringene kommer etter `4b3d0cb`, så faktisk feature-head er nyere og må leses fra Git.

## Siste verifiserte kvalitetskontroll

Brukerens lokale terminaloutput bekreftet:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 89 moduler, 228 avhengigheter, ingen brudd
Vite: 98 moduler transformert
CSS: 31.07 kB, gzip 6.07 kB
JavaScript: 255.44 kB, gzip 77.18 kB
produksjonsbuild: bestått
```

Manuell kontroll er godkjent for PC og Telefon, inkludert import, ramme, utsnitt, zoom, motivflytting, låsing, sletting og fallback.

Arkitekturrapportene ble regenerert etter siste produksjonsendring. Dokumentene etterpå er Markdown-endringer og krever ikke ny `npm run check` med mindre kode, konfigurasjon eller rapporter endres på nytt.

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
- åtte bilderammegrep
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

Interaksjon:

```text
vanlig dra      flytter motivet
Shift + dra     flytter hele rammen
Alt + piltast   flytter motivet med tastaturet
piltast         flytter elementet
Ctrl/Cmd + pil  endrer størrelse fra nedre høyre hjørne
```

Bilderammen kan endres fra topp, bunn, venstre, høyre og alle hjørner. Motsatt kant står fast.

## Viktige auditrettelser

- elementenes standard- og minimumsstørrelser har én modellkilde
- opprettingsvalidering deles av hook og reducer
- crop-invarianter håndheves i modell og reducer, ikke bare i UI
- ugyldige transformobjekter avvises kontrollert
- transform muteres ikke skjult i `contain`
- bildeimport bruker `try/catch/finally` og rydder delvis registrert ressurs
- ressurslageret krysskontrollerer filnavn, MIME-type og størrelse
- tastaturlogikk er trukket ut av `EditorCanvasElement.tsx`
- `EditorCanvasElement.tsx` er 189 linjer
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

Fase 11A skal ikke implementeres på nytt. Ikke start fase 12.

Trekk og kontroller den ferdige feature-branchen:

```powershell
cd C:\Users\tomha\Desktop\website
git fetch origin
git switch feature/image-import-and-placement
git pull --ff-only origin feature/image-import-and-placement
git status
git log -6 --oneline --decorate
git diff --check
git diff --stat origin/main...HEAD
```

Godkjent tilstand:

- aktiv branch er `feature/image-import-and-placement`
- lokal branch følger remote feature-branch
- working tree er clean
- `git diff --check` har ingen reelle feil
- branchen er ikke bak `main`
- diffen inneholder bare fase 11A, kodeaudit, arkitekturrapporter og nødvendig dokumentasjon

Deretter:

1. kontroller samlet GitHub-diff mot `main`
2. kontroller filstørrelser og at ingen foreldede `ImageFit`-/`set-image-fit`-referanser finnes
3. opprett PR fra `feature/image-import-and-placement` til `main`
4. PR-tittel skal beskrive bildeimport, rammeresize og utsnittsredigering
5. PR-body skal oppsummere modell, ressurslager, UI, audit og kontroller
6. inkluder `Closes #25`
7. kontroller at PR-en ikke er draft og er mergebar
8. kontroller changed files, review-tråder og eventuell CI
9. presenter PR-nummer, base/head, commitantall og diffstatistikk
10. ikke merge før brukeren eksplisitt skriver `godkjent`

Etter eventuell godkjent merge:

```powershell
git switch main
git pull --ff-only origin main
git status
git log -6 --oneline --decorate
```

Velg først deretter neste produksjonsfase sammen med brukeren.

---
