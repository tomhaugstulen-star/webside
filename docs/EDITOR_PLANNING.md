# Plan for Website-editoren

Dette dokumentet samler bekreftede produktkrav, implementert grunnlag og planlagte utvidelser.

## Implementeringsstatus

Siste bekreftede `main`:

```text
f71b354  PR #14 – frittstående tekstlenker
```

Gjeldende fase:

```text
branch: feature/element-deletion
base main: f71b354
GitHub-sak: #15
produksjonscommit: 4f59b3e
PR: ikke opprettet
```

Slettefunksjonen er implementert, auditert, kompilert og manuelt godkjent. Arkitekturrapportene må regenereres før PR.

## Ferdig på `main`

- blankt PC- og Telefon-lerret
- kontrollert topp- og venstremeny
- Seksjon, Bilde, Tekst og Knapp
- prosjektmodell, stabile ID-er og sentral state
- markering, flytting, resizing og låsing
- kontrollert flerlinjet tekstredigering
- høyremenyens grunnstruktur
- tekstegenskaper for hele tekstboksen
- ekstern lenke for hele tekstboksen
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

## Fast ansvarsdeling

```text
Venstremeny = opprette og velge struktur
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere tekst og transformere elementer
```

`Elementer -> Tekst` oppretter en vanlig fri tekstboks. Tekstinnhold redigeres på lerretet. Font, størrelse, lenke og sletting ligger i høyremenyen.

`Logo og header` skal senere eie strukturelle headerdeler som ikke er vanlige frie tekstbokser.

## Autoritativ state

Varig prosjektdata:

- geometri
- synlighet
- låsestatus
- tekstinnhold
- tekststil
- elementlenke for støttede elementtyper
- `updatedAt`

Transient editor-state:

- `selectedElementId`
- pekerinteraksjon og layout-preview
- aktiv tekstredigering og lokal draft
- lenkeskjemaets draft og feedback
- slettedialogens mål-ID og fokusreferanse
- panel-, fokus-, hover- og trykkstate

DOM-en er rendering, ikke permanent lagring. Gyldige prosjektendringer går gjennom reduceren.

## Elementregler

Startstørrelser:

```text
Seksjon  320 × 180 px
Bilde    240 × 160 px
Tekst    240 × 96 px
Knapp    160 × 48 px
```

Minimumsstørrelser:

```text
Seksjon  160 × 90 px
Bilde    120 × 80 px
Tekst    120 × 48 px
Knapp    80 × 36 px
```

Flytting og resizing bruker transient preview og én commit ved normalt slipp. Låste elementer kan markeres, men ikke transformeres, redigeres eller slettes.

Tekstinnhold redigeres med kontrollert `textarea`. Blur og `Ctrl`/`Cmd` + `Enter` committer, mens `Escape` forkaster draften.

## Høyremeny

```text
Ingenting valgt -> ingen høyremeny
Element valgt   -> høyremeny åpnes
Tomt lerret     -> høyremeny lukkes
```

- bredde 320 px
- dokket fra 1680 px
- overlay under 1680 px
- egen vertikal scrolling
- 180 ms transform-animasjon
- `prefers-reduced-motion` respekteres
- selection-state er autoritativ
- ingen separat elementkopi eller direkte prosjektmutasjon

Se `docs/RIGHT_PROPERTIES_PANEL.md`.

## Tekstegenskaper

For markert vanlig tekstboks:

```text
Tekstutseende
Font
Størrelse
Fet
Kursiv
Justering
Linjehøyde
```

Regler:

- formateringen gjelder hele tekstboksen
- åtte nettsikre fontvalg
- størrelse 12–96 px
- fet og kursiv er uavhengige
- venstre, midtstilt og høyre justering
- standard: System, 16 px, normal, venstre, 1.45
- låst tekst kan inspiseres, men ikke endres
- tekstfarge bygges senere sammen med prosjektfargene

Se `docs/TEXT_PROPERTIES.md`.

## Frittstående tekstlenker

Prosjektskjemaet er versjon 4.

```text
none
external-url { url, openInNewTab }
```

Regler:

- hele tekstboksen får lenken
- bare `http://` og `https://` godtas
- ugyldig URL lagres ikke
- låst tekst viser verdiene, men kontrollene er deaktivert
- lenken aktiveres aldri i editormodus
- enkeltord og tekstsegmenter får ikke egne lenker
- forhåndsvisning og publisering bygges senere

Se `docs/ELEMENT_LINKS.md`.

## Sikker elementsletting

Gjeldende branch legger til sletting av ett markert element av typen Seksjon, Bilde, Tekst eller Knapp.

Plassering:

```text
Element
Status: Ulåst
Slett seksjon / Slett bilde / Slett tekstboks / Slett knapp
```

Regler:

- sletteknappen ligger rett under statusboksen
- låst element viser deaktivert sletteknapp
- sletting krever alltid bekreftelsesdialog
- `Avbryt`, bakgrunnsklikk og `Escape` lukker uten mutasjon
- `Delete` åpner samme dialog
- Delete blokkeres i tekst- og skjemaredigering
- reduceren validerer nyeste elementstate
- bekreftet sletting fjerner bare målelementet
- markeringen nullstilles og høyremenyen lukkes
- Seksjon eier ikke visuelt overlappende elementer
- prosjektskjemaet forblir versjon 4

Arkitektur:

```text
state       -> deleteElementFromActivePage.ts, useElementDeletion.ts
properties  -> DeleteElementSection.tsx
dialog      -> ConfirmElementDeletionDialog.tsx
keyboard    -> useElementDeletionShortcut.ts
composition -> EditorShell.tsx, RightPropertiesPanel.tsx
canvas      -> EditorCanvasElement.tsx urørt
```

Se `docs/ELEMENT_DELETION.md`.

## Verifisert kontroll

Etter produksjonscommit `4f59b3e`:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 54 moduler, 120 avhengigheter, ingen brudd
produksjonsbuild: bestått
Vite: 64 moduler transformert
```

Manuelt godkjent:

- alle sletteetiketter
- plassering og disabled-tilstand
- avbrytelse og Escape
- sletting via knapp og Delete
- tekstredigeringsgrensen
- låsegrensen
- flat Seksjon-modell

Arkitekturrapportene er ikke regenerert etter sletteimplementasjonen ennå.

## Senere knappbibliotek

Bekreftet retning:

- knapper designes i Canva eller Figma
- eksporteres som SVG eller PNG
- `Elementer -> Knapp` åpner et internt bibliotek
- valgt knapp settes inn på lerretet
- samme lenkemodell gjenbrukes
- grafiske knapper får tilgjengelig navn
- lenken aktiveres ikke i editormodus

Foreløpig branch:

```text
feature/button-library
```

Den parkerte `feature/button-element`-branchen skal ikke merges. Sak #12 er lukket som `not_planned`.

## Senere faser

```text
feature/button-library
feature/image-import-and-placement
feature/project-colors
feature/logo-header
feature/alignment-guides
feature/mobile-design-controls
feature/history-system
feature/local-project-autosave
feature/project-open-import
feature/preview-mode
feature/publishing
```

Tekstfarge kobles til prosjektfargemodellen. Headertekst bygges som headerstruktur. Forhåndsvisning og publisering skal tolke semantiske lenkedata og rendre aktive, tilgjengelige ankere.

## Åpne beslutninger

- knappbibliotekets lagringsplass og filformat
- statisk lesing kontra skrivbar lokal mappe
- SVG kontra PNG som anbefalt knappformat
- endelig mobilbrytepunkt
- mobile tekststiloverstyringer
- flere lenketyper utover ekstern URL
- prosjektfilformat, migrering og lagringsintervall
- publiseringsarkitektur
