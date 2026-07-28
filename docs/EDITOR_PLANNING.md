# Plan for Website-editoren

Dette dokumentet samler bekreftede produktkrav, implementert grunnlag og planlagte utvidelser.

## Implementeringsstatus

Siste `main`:

```text
8de5f2e  PR #9 – høyremenyens grunnstruktur
```

Gjeldende branch:

```text
feature/text-properties
base main: 8de5f2e
rapportcommit: a267ca3
GitHub-sak: #10
```

Tekstegenskapsfasen er implementert, auditert, kontrollert og visuelt godkjent. Dokumentasjonen ferdigstilles før PR.

Ferdig på `main`:

- blankt PC- og Telefon-lerret
- kontrollert topp- og venstremeny
- Seksjon, Bilde, Tekst og Knapp
- prosjektmodell, stabile ID-er og sentral state
- markering, flytting, resizing og låsing
- kontrollert flerlinjet tekstredigering
- høyremenyens grunnstruktur
- Dependency Cruiser og samlet `npm run check`

Viktige merges:

```text
PR #4  drag og resize
PR #5  objektlåsing                 a3eed45
PR #7  ren tekstredigering          c729d33
PR #8  navn og rekkefølge i meny    a35f59d
PR #9  høyremenyens grunnstruktur    8de5f2e
```

## Fast ansvarsdeling

```text
Venstremeny = opprette og velge struktur
Høyremeny  = egenskaper for markert element
Lerretet   = redigere selve teksten
```

`Elementer -> Tekst` oppretter en vanlig fri tekstboks. Font, størrelse og andre egenskaper ligger i høyremenyen. `Logo og header` skal senere eie strukturelle headerdeler som ikke er vanlige frie tekstbokser.

## Autoritativ state

Varig prosjektdata:

- geometri
- synlighet
- låsestatus
- tekstinnhold
- tekststil
- `updatedAt`

Transient state:

- `selectedElementId`
- pekerinteraksjon og layout-preview
- aktiv tekstredigering og lokal draft
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

Flytting og resizing bruker transient preview og én commit ved normalt slipp. Låste elementer kan markeres, men ikke transformeres eller redigeres.

Tekstinnhold redigeres med kontrollert `textarea`. Blur og `Ctrl`/`Cmd` + `Enter` committer, mens `Escape` forkaster draften.

## Høyremenyens grunnstruktur

```text
Ingenting valgt -> ingen høyremeny
Element valgt   -> høyremeny åpnes
Tomt lerret     -> høyremeny lukkes
```

- bredde 320 px
- dokket fra 1680 px
- overlay under 1680 px
- ingen reservert plass når panelet er skjult
- egen vertikal scrolling
- 180 ms transform-animasjon
- `prefers-reduced-motion` respekteres
- eksisterende `useElementSelection` er autoritativ avledning
- ingen separat elementkopi eller direkte prosjektmutasjon

Se `docs/RIGHT_PROPERTIES_PANEL.md`.

## Implementerte tekstegenskaper

For en markert vanlig tekstboks:

```text
Egenskaper
Tekst

Tekstutseende
Font
Størrelse
Fet
Kursiv
Justering
Linjehøyde

Element
Status: Ulåst
```

Produktregler:

- formateringen gjelder hele tekstboksen
- åtte nettsikre fontvalg
- størrelser fra 12 til 96 px
- fet og kursiv som uavhengige toggles
- venstre, midtstilt og høyre justering
- linjehøyde 1.0, 1.2, 1.45, 1.6, 1.8 eller 2.0
- standard: System, 16 px, normal, venstre, 1.45
- låste tekstelementer viser verdiene, men kontrollene er deaktivert
- tekstinnhold redigeres fortsatt bare på lerretet
- tekstfarge bygges senere sammen med prosjektfargene
- andre elementtyper viser ingen tekstkontroller

Modell og reducer:

- prosjektskjema versjon 3
- obligatorisk `textStyle` bare for tekstelementer
- stabile fonttokens i prosjektdata
- CSS-fontstacker avledes i visningslaget
- én validert stilegenskap per handling
- utypede, ugyldige, låste og uendrede overganger avvises
- validatorregisteret er uttømmende ved framtidige felt
- visning og `textarea` arver samme stil

Godkjent fokusoppførsel:

- blå markeringsramme kan forsvinne når fokus flyttes til høyremenyen
- elementet forblir valgt i state
- høyremenyen fortsetter å virke
- ingen retting gjøres i denne branchen

Se `docs/TEXT_PROPERTIES.md`.

## Audit og kontroll

Rettede auditfunn:

```text
95dae75  fix: harden text style runtime validation
3d01336  refactor: make text style validation exhaustive
```

Sluttkontroll:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 44 moduler, 97 avhengigheter, ingen brudd
produksjonsbuild: bestått
Vite: 54 moduler transformert, bygget på 164 ms
arkitekturrapporter: a267ca3
working tree: clean
```

`EditorCanvasElement.tsx` er 244 linjer og skal ikke få flere nye ansvarsområder.

## Senere faser

```text
feature/button-element
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

Tekstfarge kobles til prosjektfargemodellen. Headertekst bygges som headerstruktur, ikke som vanlig fritt tekstelement.

## Åpne beslutninger

- sletting og bekreftelsesregel
- endelig mobilbrytepunkt
- mobile tekststiloverstyringer
- knappens handlinger og lenketyper
- prosjektfilformat, migrering og lagringsintervall
- publiseringsarkitektur
