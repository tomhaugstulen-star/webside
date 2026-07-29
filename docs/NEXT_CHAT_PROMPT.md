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
3. `docs/EDITOR_PLANNING.md`
4. `docs/PROJECT_RULES.md`
5. `README.md`
6. `docs/ELEMENT_DELETION.md`
7. `docs/ELEMENT_LINKS.md`
8. `docs/TEXT_PROPERTIES.md`
9. `docs/RIGHT_PROPERTIES_PANEL.md`
10. `docs/ELEMENT_MODEL.md`
11. `docs/TEXT_BOX_EDITING.md`
12. `docs/OBJECT_LOCKING.md`
13. `docs/DRAG_RESIZE.md`
14. `docs/ELEMENT_SELECTION.md`
15. `docs/ELEMENT_CREATION.md`
16. `docs/MOBILE_DESIGN_CONTROLS.md`
17. `docs/CODE_AUDIT.md`

## Gjeldende repo-status

Siste funksjonelle merge til `main`:

```text
b428cac  Merge pull request #16 from tomhaugstulen-star/feature/element-deletion
```

Fullført sporing:

```text
GitHub-sak #15: lukket som fullført
PR #16: merget
prosjektskjema: versjon 4
ingen ny produksjonsfase er valgt
```

Start alltid med:

```powershell
cd C:\Users\tomha\Desktop\website
git switch main
git pull --ff-only origin main
git status
```

Working tree skal være clean før ny planlegging eller branchopprettelse.

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
- sikker sletting via høyremeny og `Delete`
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
PR #16  sikker elementsletting       b428cac
```

## Fast UX-regel

```text
Venstremeny = opprette og velge struktur
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere tekst og transformere elementer
```

Lenker aktiveres ikke i editormodus. `EditorCanvasElement.tsx` ligger nær aktiv filgrense og skal ikke få flere nye funksjonsansvar.

## Sikker sletting – ferdig fase

Autoritativ spesifikasjon:

```text
docs/ELEMENT_DELETION.md
GitHub-sak #15
PR #16
mergecommit b428cac
```

Leveransen gjelder ett markert element:

- Seksjon
- Bilde
- Tekst
- Knapp

Sletteknappen ligger i høyremenyens `Element`-seksjon rett under statusboksen.

```text
Element
Status: Ulåst
Slett seksjon / Slett bilde / Slett tekstboks / Slett knapp
```

Regler:

- låst element kan ikke slettes
- sletting krever alltid bekreftelsesdialog
- `Delete` åpner samme dialog
- Delete blokkeres i tekstredigering og skjemakontroller
- `Backspace` brukes ikke globalt
- dialogen validerer nyeste elementstate før bekreftelse
- bare målelementet fjernes
- `selectedElementId` nullstilles bare når målet var markert
- en urelatert markering bevares
- Seksjon eier ikke visuelt overlappende elementer
- dialogens `Escape` påvirker ikke et åpent verktøypanel
- prosjektskjemaet forblir versjon 4

Implementert arkitektur:

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

## Verifisert kontroll for PR #16

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

Arkitekturrapportene ble regenerert i `fbd8091`. Det fantes ingen GitHub Actions-run for head.

Manuelt godkjent:

- alle fire sletteetiketter
- plassering rett under statusboksen
- deaktivert knapp og ingen Delete-dialog for låst element
- avbrytelse uten mutasjon
- `Escape` uten mutasjon
- sletting via høyremeny og `Delete`
- høyremenyen lukkes etter sletting
- ingen andre elementer slettes
- Delete under tekstredigering sletter bare tekst
- sletting av Seksjon lar visuelt overlappende elementer bli stående

## Neste produksjonsfase

Ingen ny produksjonsfase er valgt. Ikke opprett kodebranch før brukeren har valgt og godkjent neste avgrensede fase.

Planlagte senere faser finnes i `docs/WORK_PLAN.md`. Den parkerte `feature/button-element`-branchen skal ikke røres eller merges. Sak #12 er lukket som `not_planned`.

## Faste tekniske grenser

- 250 linjer er aktiv terskel for ansvarstrekk i kildefiler.
- 300 linjer er hard unntaksgrense.
- Varige prosjektdata endres bare gjennom validerte reducerhandlinger.
- Transient markering, dialogstate, drafts, fokus, hover og statusmeldinger serialiseres ikke.
- Ingen feature-branch merges uten eksplisitt brukergodkjenning.

---
