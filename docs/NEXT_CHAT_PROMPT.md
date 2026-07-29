# Prompt til neste chat

Kopier hele teksten under inn i neste chat.

---

Du er ansvarlig for videre utvikling av Website-editoren. Arbeid som prosjektleder og kodeansvarlig med presist omfang og ingen gjetting.

Svar på norsk. Repo og dokumentasjon er kilden til sannhet.

## Repo og lokal mappe

```text
https://github.com/tomhaugstulen-star/webside.git
C:\Users\tomha\Desktop\website
```

Bruk GitHub-connectoren til repoarbeid. Ikke bruk GitHub CLI. Bruk vanlige PowerShell-kommandoer for lokal `git`, `npm` og testing.

Det utvikles aldri direkte på `main`. Etter repoendringer skal brukeren få nøyaktige PowerShell-kommandoer. Ikke merge uten eksplisitt godkjenning. Ikke påstå at tester består uten verifisert output.

## Autoritativ leserekkefølge

1. `docs/NEXT_CHAT_PROMPT.md`
2. `docs/WORK_PLAN.md`
3. `docs/ELEMENT_DELETION.md`
4. `docs/ELEMENT_LINKS.md`
5. `docs/TEXT_PROPERTIES.md`
6. `docs/RIGHT_PROPERTIES_PANEL.md`
7. `docs/EDITOR_PLANNING.md`
8. `docs/PROJECT_RULES.md`
9. `README.md`
10. `docs/ELEMENT_MODEL.md`
11. `docs/TEXT_BOX_EDITING.md`
12. `docs/OBJECT_LOCKING.md`
13. `docs/DRAG_RESIZE.md`
14. `docs/ELEMENT_SELECTION.md`
15. `docs/ELEMENT_CREATION.md`
16. `docs/MOBILE_DESIGN_CONTROLS.md`
17. `docs/CODE_AUDIT.md`

## Git-status

```text
main: f71b354
branch: feature/element-deletion
base: main ved f71b354
GitHub-sak: #15 Plan: safe deletion for selected elements
PR: #16 Add safe deletion for selected elements
produksjonscommit: 4f59b3e
framtidsrettede rettelser: a8c6d62 og 4611de1
arkitekturrapporter: fbd8091
```

PR #16 er åpen og mergebar. Den skal ikke merges uten eksplisitt brukergodkjenning.

Lokal branch var clean ved `fbd8091` før de avsluttende Markdown-statusoppdateringene ble lagt inn via GitHub-connectoren. Neste lokale handling er å pull siste branch og bekrefte clean tree.

## Ferdig og merget til `main`

- stabilt React/TypeScript/Vite-grunnlag
- blankt PC- og Telefon-lerret
- kontrollert topp- og venstremeny
- sentral prosjekt- og elementmodell
- stabile kryptografiske ID-er
- transient `selectedElementId`
- oppretting av Seksjon, Bilde, Tekst og Knapp
- flytting og resizing med peker og tastatur
- minimumsmål, clamping, edge-scroll og automatisk lerretsvekst
- objektlåsing og opplåsing
- kontrollert flerlinjet tekstredigering
- høyremenyens grunnstruktur
- tekstegenskaper for hele tekstboksen
- frittstående eksterne lenker for hele tekstboksen
- Dependency Cruiser og samlet `npm run check`

Viktige merges:

```text
PR #4   drag og resize
PR #5   objektlåsing                 a3eed45
PR #7   ren tekstredigering          c729d33
PR #8   navn og rekkefølge i meny    a35f59d
PR #9   høyremenyens grunnstruktur   8de5f2e
PR #11  tekstegenskaper              452b491
PR #14  elementlenker                f71b354
```

## Fast UX-regel

```text
Venstremeny = opprette og velge struktur
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere tekst og transformere elementer
```

Lenker aktiveres ikke i editormodus. `EditorCanvasElement.tsx` ligger nær aktiv filgrense og skal ikke få flere nye funksjonsansvar.

## PR #16 – sikker sletting

Autoritativ spesifikasjon:

```text
docs/ELEMENT_DELETION.md
GitHub-sak #15
```

Første leveranse gjelder ett markert element:

- Seksjon
- Bilde
- Tekst
- Knapp

### Plassering

Sletteknappen ligger i høyremenyens `Element`-seksjon rett under statusboksen.

```text
Element
Status: Ulåst
Slett seksjon / Slett bilde / Slett tekstboks / Slett knapp
```

Knappen har samme bredde som statusboksen, ligger i vanlig dokumentflyt, bruker rød tekst og ramme og er deaktivert når elementet er låst.

### Bekreftelse

Sletting krever alltid dialog fordi angre/gjør om ikke finnes.

```text
Slett tekstboksen?
Dette kan ikke angres.
Avbryt    Slett
```

Dialogen bruker native modal `<dialog>`, fokuserer `Avbryt`, støtter `Escape`, returnerer fokus ved avbrytelse og validerer nyeste elementstate før bekreftelse.

Dialogens `Escape` er isolert og lukker ikke samtidig et åpent verktøypanel.

### Tastatur

`Delete` åpner samme dialog for markert, ulåst element.

Global sletting blokkeres i tekstredigering, input, textarea, select, button, aktiv lenke, dialog, contenteditable og eksplisitt blokkerte områder. `Backspace` brukes ikke globalt.

### Modell og reducer

Prosjektskjemaet forblir versjon 4.

```text
delete-element-from-active-page { elementId, updatedAt }
```

Reducergrensen avviser manglende aktiv side, manglende element, feil side, låst element, utdatert mål og no-op.

Ved gyldig sletting:

- bare målelementet fjernes
- `project.updatedAt` oppdateres
- `selectedElementId` nullstilles bare når målet var markert
- en urelatert markering bevares
- høyremenyen lukkes når det markerte elementet slettes

Elementmodellen er flat. Sletting av Seksjon fjerner bare selve seksjonen; visuelt overlappende elementer blir stående.

### Implementert arkitektur

```text
src/state/deleteElementFromActivePage.ts
src/state/useElementDeletion.ts
src/components/properties/DeleteElementSection.tsx
src/components/dialogs/ConfirmElementDeletionDialog.tsx
src/components/editor/isElementDeletionShortcutTarget.ts
src/components/editor/useElementDeletionShortcut.ts
src/styles/element-deletion.css
```

`EditorCanvasElement.tsx` er urørt. Alle nye kildefiler er under 250 linjer.

## Verifisert kontroll

Brukeren kjørte `npm run check` etter de siste produksjonsrettelsene:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 54 moduler, 120 avhengigheter, ingen brudd
produksjonsbuild: bestått
Vite: 64 moduler transformert
CSS: 20.13 kB, gzip 4.60 kB
JavaScript: 232.19 kB, gzip 71.23 kB
bygget på 225 ms
```

Arkitekturrapportene er regenerert. Det finnes ingen GitHub Actions-run for head.

## Manuelt godkjent

Brukeren har godkjent:

- alle fire sletteetiketter
- plassering rett under statusboksen
- deaktivert knapp og ingen Delete-dialog for låst element
- avbrytelse uten mutasjon
- `Escape` uten mutasjon
- bekreftet sletting via høyremenyen
- bekreftet sletting via `Delete`
- høyremenyen lukkes etter sletting
- ingen andre elementer slettes
- Delete under tekstredigering sletter bare tekst
- sletting av Seksjon lar visuelt overlappende elementer bli stående

## Ikke del av slettingsfasen

- angre/gjør om
- papirkurv eller gjenoppretting
- multisletting
- dra til papirkurv
- sletting av side eller prosjekt
- automatisk sletting av visuelt overlappende elementer
- foreldre-/barnemodell for Seksjon
- duplisering
- historikk eller lagring
- bildeimport
- knappbibliotek
- farger
- forhåndsvisning eller publisering

## Neste handling

1. Kjør `git pull --ff-only origin feature/element-deletion`.
2. Bekreft `working tree clean`.
3. Kontroller PR #16 på siste head: mergebarhet, filoversikt, review-tråder og eventuell CI.
4. Ikke kjør `npm run check` på nytt for rene Markdown-endringer.
5. Merge bare etter eksplisitt brukergodkjenning.
6. Etter merge: bytt til `main`, pull og bekreft clean tree.

Den parkerte `feature/button-element`-branchen skal ikke røres eller merges. Sak #12 er lukket som `not_planned`.

---
