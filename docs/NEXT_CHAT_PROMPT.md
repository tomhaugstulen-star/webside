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

Siste bekreftede `main`:

```text
f71b354
```

Dette er mergecommit fra PR #14, som la inn frittstående lenker for hele tekstbokser. Sak #13 er lukket som fullført.

Gjeldende branch:

```text
feature/element-deletion
```

Branch-base:

```text
main ved f71b354
```

Sporing:

```text
GitHub-sak #15 Plan: safe deletion for selected elements
PR: ikke opprettet
```

Viktige commits på branchen:

```text
7269cb1 docs: define safe element deletion
338fecd docs: hand off element deletion phase
bfaf299 docs: set element deletion as current phase
4f59b3e feat: add safe element deletion
4f231f9 docs: record verified element deletion
24189f0 docs: refresh project status for deletion
7ecaa80 docs: align editor plan with deletion phase
6ce52e1 docs: update work plan after deletion verification
```

Denne filens dokumentasjonscommit ligger etter `6ce52e1`.

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

## Gjeldende fase – sikker sletting

Autoritativ spesifikasjon:

```text
docs/ELEMENT_DELETION.md
GitHub-sak #15
```

Produksjonskode er implementert i:

```text
4f59b3e feat: add safe element deletion
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

Knappen:

- har samme bredde som statusboksen
- ligger i vanlig dokumentflyt
- bruker rød tekst og rød ramme
- er deaktivert når elementet er låst
- krever ingen scrolling i dagens panel

### Bekreftelse

Sletting krever alltid dialog fordi angre/gjør om ikke finnes.

```text
Slett tekstboksen?
Dette kan ikke angres.
Avbryt    Slett
```

Dialogen bruker native modal `<dialog>`, fokuserer `Avbryt`, støtter `Escape`, returnerer fokus ved avbrytelse og validerer nyeste elementstate før bekreftelse.

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
- `selectedElementId` settes til `null`
- høyremenyen lukkes gjennom eksisterende selection-avledning

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

Integrasjon:

```text
src/state/editorProjectAction.ts
src/state/editorProjectReducer.ts
src/components/editor/EditorShell.tsx
src/components/properties/RightPropertiesPanel.tsx
src/components/canvas/canvasElementAccessibility.ts
src/App.css
```

`EditorCanvasElement.tsx` er urørt. Alle nye kildefiler er under 250 linjer.

## Verifisert kontroll

Brukeren kjørte `npm run check` etter produksjonscommit `4f59b3e`:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 54 moduler, 120 avhengigheter, ingen brudd
produksjonsbuild: bestått
Vite: 64 moduler transformert
CSS: 20.13 kB, gzip 4.60 kB
JavaScript: 232.13 kB, gzip 71.21 kB
bygget på 168 ms
```

Working tree var clean ved denne kontrollen. Det finnes ingen GitHub Actions-run for commiten.

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

## Kritisk gjenstående arbeid

Arkitekturrapportene er ikke regenerert etter at slettefilene ble lagt til.

Neste handling skal være:

1. Hent siste dokumentasjonscommits på `feature/element-deletion`.
2. Kontroller branch og clean tree.
3. Kjør `npm run architecture:json`.
4. Kjør `npm run architecture:diagram`.
5. Kontroller at bare `architecture.json` og `docs/dependency-graph.mmd` er endret.
6. Ikke kjør ny full `npm run check` bare på grunn av rapport- eller Markdown-endringer.
7. Få rapportfilene inn på branchen gjennom kontrollert repoarbeid.
8. Kontroller endelig diff, filstørrelser og clean tree.
9. Opprett PR mot `main` med `Closes #15`.
10. Kontroller mergebarhet, endrede filer, review-tråder og eventuell CI.
11. Merge bare etter eksplisitt brukergodkjenning.
12. Etter merge: bytt til `main`, pull og bekreft clean tree.

Den parkerte `feature/button-element`-branchen skal ikke røres eller merges. Sak #12 er lukket som `not_planned`.

---
