# Plan for Website-editoren

Dette dokumentet samler bekreftede produktkrav, implementert grunnlag og planlagte utvidelser.

## Gjeldende arbeidsstatus

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
b428cac  PR #16 – sikker sletting av elementer
```

Dokumentasjonsauditen skal fullføres og merges før en ny produksjonsfase velges.

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

Dette er dagens implementerte og gjeldende struktur.

`Filer`, `Alle farger`, `Fonts` og separat `Knapper` er ikke implementert eller vedtatt. Slike navn kan bare behandles som åpne framtidige produktbeslutninger.

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

## Prosjektmodell

Gjeldende prosjektskjema er versjon 4.

Historiske skjematrinn:

```text
versjon 2  tekstinnhold
versjon 3  tekststil
versjon 4  elementlenke, gjeldende
```

Bare tekstelementet har obligatorisk:

```text
content
textStyle
link
```

Historiske fasedokumenter kan beskrive versjon 2 eller 3 som versjonen som ble innført i den aktuelle fasen. Det skal ikke leses som gjeldende prosjektstatus.

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

Høyremenyens grunnstruktur er implementert og merget som PR #9. Den er senere utvidet med tekstegenskaper, elementlenke og sikker sletting.

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

Fasen er merget til `main` i PR #16 med mergecommit `b428cac`.

Leveransen gjelder sletting av ett markert element av typen Seksjon, Bilde, Tekst eller Knapp.

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
- markeringen nullstilles bare når målet var markert
- en urelatert markering bevares
- Seksjon eier ikke visuelt overlappende elementer
- dialogens `Escape` påvirker ikke et åpent verktøypanel

Se `docs/ELEMENT_DELETION.md`.

## Verifisert kontroll for PR #16

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

Arkitekturrapportene ble regenerert. Det fantes ingen GitHub Actions-run for head. Den brukerbekreftede lokale kontrollen er verifikasjonsgrunnlaget.

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

- hvilken produksjonsfase som skal startes etter dokumentasjonsauditen
- knappbibliotekets lagringsplass og filformat
- statisk lesing kontra skrivbar lokal mappe
- SVG kontra PNG som anbefalt knappformat
- endelig mobilbrytepunkt
- mobile tekststiloverstyringer
- flere lenketyper utover ekstern URL
- prosjektfilformat, migrering og lagringsintervall
- publiseringsarkitektur