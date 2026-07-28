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

Dette er mergecommit fra PR #14, som la inn frittstående lenker for hele tekstbokser.

PR #14 er merget. GitHub-sak #13 er lukket som fullført.

Gjeldende branch:

```text
feature/element-deletion
```

Branch er opprettet fra `main` ved `f71b354`.

GitHub-sak:

```text
#15 Plan: safe deletion for selected elements
```

Plancommit:

```text
7269cb1 docs: define safe element deletion
```

PR er ikke opprettet. Produksjonskode for sletting er ikke implementert ennå.

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
Lerretet   = redigere selve teksten og transformere elementer
```

Lenker aktiveres ikke i editormodus. `EditorCanvasElement.tsx` ligger nær aktiv filgrense og skal ikke få flere nye funksjonsansvar.

## Merget lenkefase

Prosjektskjemaet er versjon 4.

Tekstelementer har obligatorisk:

```text
link: none
eller
link: external-url { url, openInNewTab }
```

Bare absolutte `http://`- og `https://`-adresser godtas. URL-en lagres i prosjektdata og vises igjen i høyremenyen. Editorens DOM har ikke aktivt `href` på tekstboksen.

Siste verifiserte kontroll for lenkefasen:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 48 moduler, 109 avhengigheter, ingen brudd
produksjonsbuild: bestått
Vite: 58 moduler transformert
```

## Gjeldende fase – sikker sletting

Autoritativ spesifikasjon:

```text
docs/ELEMENT_DELETION.md
GitHub-sak #15
```

Første leveranse gjelder:

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

- samme bredde som statusboksen
- vanlig dokumentflyt, ikke festet nederst
- rød tekst og rød ramme
- deaktivert når elementet er låst
- krever ingen scrolling i dagens panel

### Bekreftelse

Sletting krever alltid dialog fordi angre/gjør om ikke finnes.

```text
Slett tekstboksen?

Dette kan ikke angres.

Avbryt    Slett
```

Dialogen skal bruke nyeste state. Et element som er blitt låst, fjernet eller flyttet ut av aktiv side mens dialogen er åpen, skal ikke slettes.

### Tastatur

`Delete` åpner samme dialog for markert element.

Global sletting skal ikke aktiveres i tekstredigering, input, textarea, select, button, contenteditable eller dialogkontroller. `Backspace` brukes ikke globalt.

### Modell og reducer

Prosjektskjemaet forblir versjon 4.

Forventet handling:

```text
delete-element-from-active-page { elementId, updatedAt }
```

Reducergrensen avviser manglende aktiv side, manglende element, feil side, låst element og no-op.

Ved gyldig sletting:

- bare målelementet fjernes
- `project.updatedAt` oppdateres
- `selectedElementId` settes til `null`
- høyremenyen lukkes gjennom eksisterende selection-avledning

Elementmodellen er flat. Sletting av Seksjon fjerner bare selve seksjonen; andre elementer blir stående.

### Arkitektur

Forventede separate ansvar:

```text
state reducerhjelper
state dispatch-hook
properties sletteseksjon
bekreftelsesdialog
global Delete-grense
```

Ikke legg sletting i `EditorCanvasElement.tsx`.

Alle nye kildefiler skal være under 250 linjer.

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

1. Hent `feature/element-deletion` lokalt.
2. Kontroller branch og clean tree.
3. Les `docs/ELEMENT_DELETION.md`.
4. Auditér eksisterende selection-, keyboard-, panel- og dialogstruktur før produksjonskode.
5. Implementer bare låst omfang.
6. Kjør `npm run check` etter siste produksjonskodeendring.
7. Regenerer arkitekturrapporter.
8. Oppdater all relevant dokumentasjon.
9. Opprett PR først etter manuell kontroll og clean tree.
10. Merge bare etter eksplisitt brukergodkjenning.

---
