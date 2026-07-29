# Plan for Website-editoren

Dette dokumentet samler bekreftede produktkrav, implementert grunnlag og planlagte utvidelser.

## Gjeldende arbeidsstatus

```text
base main: 06307a2
GitHub-sak: #20 Build first bundled SVG button library
branch: feature/button-library
prosjektskjema på branchen: versjon 5
produksjonskode: ferdig implementert
manuell test: godkjent på PC og Telefon
PR: ikke opprettet ennå
```

Produksjonscommits:

```text
a8017d4  knappemodell
7fe89f2  bundlede SVG-assets
1b80890  designbibliotek i venstremenyen
ec30b9a  knappetekst, design og lenke i høyremenyen
```

Gjenstår før PR:

- regenerere arkitekturrapporter
- kontrollere hele diffen og filgrensene
- kjøre `git diff --check`
- bekrefte clean og synkronisert branch

## Ferdig på `main`

- blankt PC- og Telefon-lerret
- kontrollert topp- og venstremeny
- Seksjon, Bilde, Tekst og grunnleggende Knapp
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
PR #19  dokumentasjonsaudit          06307a2
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

`Elementer` inneholder:

```text
Seksjon
Bilde
Tekst
Knapp
```

`Knapp` åpner et internt designbibliotek. Det finnes ikke et separat venstremenypunkt kalt `Knapper`.

## Fast ansvarsdeling

```text
Venstremeny = opprette elementer og velge ferdig design
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere tekst og transformere elementer
```

For knappelementet:

```text
Venstremeny = velge SVG-design og opprette knapp
Høyremeny  = endre label, design og lenke
Lerretet   = markere, flytte og endre størrelse
```

## Autoritativ state

Varig prosjektdata:

- geometri og synlighet
- låsestatus
- tekstinnhold og tekststil
- lenke for støttede elementtyper
- knappens `assetId` og `label`
- `updatedAt`

Transient editor-state:

- `selectedElementId`
- pekerinteraksjon og layout-preview
- aktiv tekstredigering og lokal draft
- knappetekstdraft og lagringsfeedback
- lenkeskjemaets draft og validering
- intern bibliotekvisning
- slettedialogens mål-ID og fokusreferanse
- panel-, fokus-, hover- og trykkstate

DOM-en er rendering, ikke permanent lagring. Gyldige prosjektendringer går gjennom reduceren.

## Prosjektmodell

Gjeldende skjemaversjon på feature-branchen er versjon 5.

```text
versjon 1  grunnmodell
versjon 2  tekstinnhold
versjon 3  tekststil
versjon 4  elementlenke
versjon 5  knappasset, knappetekst og knappelenke
```

Tekstelement:

```ts
type TextEditorElement = BaseEditorElement & {
  kind: 'text'
  content: string
  textStyle: TextElementStyle
  link: ElementLink
}
```

Knappelement:

```ts
type ButtonEditorElement = BaseEditorElement & {
  kind: 'button'
  assetId: ButtonAssetId
  label: string
  link: ElementLink
}
```

`assetId`, `label` og `link` er foreløpig felles for PC og Telefon.

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

Betinget innhold:

```text
Tekst  -> tekstutseende + lenke + elementhandlinger
Knapp  -> knappetekst + design + lenke + elementhandlinger
Bilde  -> elementstatus og sletting
Seksjon -> elementstatus og sletting
```

## Tekstegenskaper

For markert tekstboks:

- font
- størrelse
- fet
- kursiv
- justering
- linjehøyde
- ekstern lenke

Tekstinnhold redigeres fortsatt på lerretet.

## Første knappbibliotek

Første stabile asset-ID-er:

```text
button.primary-rounded.v1
button.secondary-rounded.v1
button.outline-rounded.v1
button.dark-rounded.v1
```

Regler:

- assetene bundles statisk av Vite
- prosjektdata lagrer stabil ID, ikke filsti eller rå SVG
- SVG-en er dekorativ og inneholder ikke tekst
- `label` er ekte HTML-tekst og tilgjengelig navn
- tom knappetekst avvises
- designbytte valideres mot katalogen
- ukjent lagret ID gir fallback og varsel
- knappen bruker samme `ElementLink` som tekstboksen
- lenken aktiveres aldri i editormodus

Se `docs/BUTTON_LIBRARY.md`.

## Elementlenker

```text
none
external-url { url, openInNewTab }
```

Regler:

- støttes av tekstbokser og knapper på feature-branchen
- bare `http://` og `https://` godtas
- ugyldig URL lagres ikke
- låste elementer viser verdiene, men kontrollene er deaktivert
- lenken aktiveres aldri i editormodus
- forhåndsvisning og publisering bygges senere

## Senere faser

```text
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

Tekstfarge og eventuelle redigerbare knappfarger kobles senere til prosjektfargemodellen. Forhåndsvisning og publisering skal tolke semantiske lenkedata og rendre aktive, tilgjengelige ankere.

## Åpne beslutninger

- bildeimportens lagringsmodell
- endelig mobilbrytepunkt
- mobile tekst- og designtilpasninger
- flere lenketyper enn ekstern URL
- prosjektfilformat og migrering
- historikk- og autolagringsgrenser
- publiseringsarkitektur
