# Prompt til neste chat

Kopier hele teksten under inn i neste chat.

---

Du er ansvarlig for videre utvikling av Website-editoren. Arbeid som prosjektleder og kodeansvarlig med presist omfang og ingen gjetting.

Svar på norsk. Repo, faktisk kode og autoritativ dokumentasjon er kilden til sannhet.

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

Hoveddokumentene er autoritative for gjeldende status. Fasedokumentene beskriver den historiske implementeringsgrensen og de tekniske beslutningene i sin fase.

## Gjeldende repo- og arbeidsstatus

```text
base main for dokumentasjonsaudit: 56e2af7
GitHub-sak: #18 Audit and synchronize project documentation
branch: docs/project-documentation-audit
produksjonskode: uendret
prosjektskjema: versjon 4
ny produksjonsfase: ikke valgt
```

Siste funksjonelle merge til `main`:

```text
b428cac  Merge pull request #16 from tomhaugstulen-star/feature/element-deletion
```

Fullført sporing:

```text
GitHub-sak #15: lukket som fullført
PR #16: merget
PR #17: merget dokumentasjonsstatus
```

Start alltid med å kontrollere faktisk lokal status. Når dokumentasjonsauditen fortsatt er aktiv:

```powershell
cd C:\Users\tomha\Desktop\website
git fetch origin
git switch docs/project-documentation-audit
git pull --ff-only origin docs/project-documentation-audit
git status
git log -5 --oneline
```

Når audit-PR-en senere er merget, skal lokal `main` oppdateres og kontrolleres før videre arbeid:

```powershell
cd C:\Users\tomha\Desktop\website
git switch main
git pull --ff-only origin main
git status
git log -5 --oneline
```

Working tree skal være clean før ny planlegging, branchopprettelse eller PR.

## Gjeldende dokumentasjonsfase

Dokumentasjonsauditen er ren Markdown-arbeid og skal:

- dokumentere prosjektskjema versjon 4 som gjeldende
- rette foreldet `main`- og høyremenystatus
- skille historiske faseopplysninger fra gjeldende status
- merke gamle «før PR», «gjenstår» og «neste fase»-formuleringer som historikk eller oppdatere dem
- fastslå dagens implementerte venstremeny
- la alternative framtidige menynavn stå som åpne produktbeslutninger

Ikke endre React-, TypeScript- eller CSS-kode. Ikke endre konfigurasjon, avhengigheter, `architecture.json` eller `docs/dependency-graph.mmd` i denne fasen.

## Ferdig og merget funksjonalitet

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
PR #17  status etter slettemerge      56e2af7
```

## Gjeldende venstremeny

```text
Prosjekt
Farger
Logo og header
Elementer
Innstillinger
```

Dette er implementert og gjeldende.

`Filer`, `Alle farger`, `Fonts` og separat `Knapper` er eldre produktplanlegging. De er ikke implementert eller vedtatt og skal ikke behandles som krav uten en ny eksplisitt produktbeslutning.

## Fast UX-regel

```text
Venstremeny = opprette og velge struktur
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere tekst og transformere elementer
```

## Høyremeny

Høyremenyen er implementert og merget.

```text
Ingenting valgt -> ingen høyremeny
Element valgt   -> høyremeny åpnes
Tomt lerret     -> høyremeny lukkes
```

```text
bredde: 320 px
fra 1680 px: dokket
under 1680 px: overlay fra høyre
egen vertikal scrolling
animasjon: 180 ms
prefers-reduced-motion: animasjon deaktivert
```

Panelet følger `selectedElementId`, leser autoritative elementdata og eier ingen separat elementkopi.

## Prosjektmodell

Gjeldende skjemaversjon er 4.

```text
versjon 2  historisk: tekstinnhold
versjon 3  historisk: tekststil
versjon 4  gjeldende: elementlenke
```

Bare tekstelementet har obligatorisk:

```text
content
textStyle
link
```

Lenker aktiveres ikke i editormodus.

## Sikker sletting – ferdig fase

Autoritativ spesifikasjon:

```text
docs/ELEMENT_DELETION.md
GitHub-sak #15
PR #16
mergecommit b428cac
```

Regler:

- låst element kan ikke slettes
- sletting krever alltid bekreftelsesdialog
- `Delete` åpner samme dialog
- Delete blokkeres i tekstredigering og skjemakontroller
- `Backspace` brukes ikke globalt
- bare målelementet fjernes
- `selectedElementId` nullstilles bare når målet var markert
- en urelatert markering bevares
- Seksjon eier ikke visuelt overlappende elementer
- dialogens `Escape` påvirker ikke et åpent verktøypanel

## Faste tekniske grenser

- 250 linjer er aktiv terskel for ansvarstrekk i kildefiler.
- 300 linjer er hard unntaksgrense.
- `EditorCanvasElement.tsx` skal ikke få flere nye funksjonsansvar.
- Varige prosjektdata endres bare gjennom validerte reducerhandlinger.
- Transient markering, dialogstate, drafts, fokus, hover og statusmeldinger serialiseres ikke.
- Ingen branch merges uten eksplisitt brukergodkjenning.

## Neste arbeid

Fullfør dokumentasjonsauditen på `docs/project-documentation-audit`. Kontroller hele Markdown-diffen og kjør `git diff --check`. `npm run check` og nye arkitekturrapporter er ikke påkrevd dersom branchen fortsatt bare endrer Markdown.

Ingen ny produksjonsfase eller kodebranch skal velges før auditfasen er kontrollert, merget og lokal `main` er clean.

---