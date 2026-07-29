# Plan for Website-editoren

Dette dokumentet samler bekreftede produktkrav, implementert grunnlag og planlagte utvidelser.

## Gjeldende arbeidsstatus

Faktisk `main`-HEAD skal alltid kontrolleres mot `origin/main`. Et commitnummer lagres bare som historisk milepæl eller eksplisitt branch-base, aldri som permanent «gjeldende HEAD».

Stabile referanser:

```text
base main før dokumentasjonssynkronisering i PR #24: a77a9a9
PR #21: SVG-knappbibliotek – merget
PR #22: dokumentasjonsstatus etter knappbiblioteket – merget
knappbibliotekets mergecommit: 5e548ad
GitHub-sak #20: lukket som fullført
prosjektskjema: versjon 5
neste produksjonsfase: ikke valgt
```

Siste verifiserte produksjonskontroll gjelder knappbibliotekfasen:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 69 moduler, 161 avhengigheter, ingen brudd
Vite: 78 moduler transformert
produksjonsbuild: bestått
arkitekturrapport: 0 brudd, 0 feil, 0 advarsler
PC og Telefon: godkjent
```

## Ferdig på `main`

- blankt PC- og Telefon-lerret
- kontrollert topp- og venstremeny
- Seksjon, Bilde, Tekst og Knapp
- prosjektmodell, stabile ID-er og sentral state
- markering, flytting, resizing og låsing
- kontrollert flerlinjet tekstredigering
- høyremenyens grunnstruktur
- tekstegenskaper for hele tekstboksen
- eksterne lenker for tekstbokser og knapper
- sikker sletting via høyremeny og `Delete`
- første bundlede SVG-knappbibliotek
- kontrollert fallback for ukjent knappasset
- Dependency Cruiser og samlet `npm run check`

Viktige historiske merges:

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
PR #21  SVG-knappbibliotek           5e548ad
PR #22  dokumentasjonsstatus         a77a9a9
```

Disse commitnumrene beskriver historiske leveranser og skal ikke brukes som forventet topp-commit etter senere merges.

## Gjeldende venstremeny

```text
Prosjekt
Farger
Logo og header
Elementer
Innstillinger
```

`Elementer` inneholder Seksjon, Bilde, Tekst og Knapp. `Knapp` åpner et internt designbibliotek. Det finnes ikke et separat venstremenypunkt kalt `Knapper`.

## Fast ansvarsdeling

```text
Venstremeny = opprette elementer og velge ferdig design
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere tekst og transformere elementer
```

For knapper:

```text
Venstremeny = velge SVG-design og opprette knapp
Høyremeny  = endre label, design og lenke
Lerretet   = markere, flytte og endre størrelse
```

## Autoritativ state

Varig prosjektdata:

- sider og elementer
- geometri og synlighet
- låsestatus
- tekstinnhold og tekststil
- lenke for tekstbokser og knapper
- knappens `assetId` og `label`
- `updatedAt`

Transient editor-state:

- `selectedElementId`
- pekerinteraksjon og layout-preview
- tekst-, knappetekst- og lenkedrafts
- validering og lagringsfeedback
- intern bibliotekvisning
- slettedialogens mål og fokusreferanse
- panel-, fokus-, hover- og trykkstate

DOM-en er rendering, ikke permanent lagring. Gyldige prosjektendringer går gjennom reduceren.

## Prosjektmodell

Gjeldende skjemaversjon er 5.

```text
versjon 1  grunnmodell
versjon 2  tekstinnhold
versjon 3  tekststil
versjon 4  elementlenke
versjon 5  knappasset, knappetekst og knappelenke
```

```ts
type ButtonEditorElement = BaseEditorElement & {
  kind: 'button'
  assetId: ButtonAssetId
  label: string
  link: ElementLink
}
```

`assetId`, `label` og `link` er foreløpig felles for PC og Telefon.

Bildeelementet har foreløpig bare felles elementdata og geometri. Bildekilde, ressursreferanse, filmetadata, alt-tekst og skaleringsmodell er ikke implementert.

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
Tekst   -> tekstutseende + lenke + elementhandlinger
Knapp   -> knappetekst + design + lenke + elementhandlinger
Bilde   -> elementstatus og sletting
Seksjon -> elementstatus og sletting
```

## Første knappbibliotek

```text
button.primary-rounded.v1
button.secondary-rounded.v1
button.outline-rounded.v1
button.dark-rounded.v1
```

- assets bundles statisk av Vite
- prosjektdata lagrer stabil ID, ikke filsti eller rå SVG
- SVG-en er dekorativ og inneholder ikke tekst
- `label` er ekte HTML-tekst og tilgjengelig navn
- tom knappetekst avvises
- designbytte valideres mot katalogen
- ukjent lagret ID gir fallback og varsel
- lenken aktiveres aldri i editormodus

Se `docs/BUTTON_LIBRARY.md`.

## Planlagte senere faser

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

Neste fase skal velges og avgrenses eksplisitt. Ingen produksjonssak eller produksjonsbranch startes automatisk.
