# Plan for Website-editoren

Dette dokumentet samler bekreftede produktkrav, implementert grunnlag og planlagte utvidelser.

## Implementeringsstatus

Siste `main`:

```text
452b491  PR #11 – tekstegenskaper
```

Gjeldende branch og PR:

```text
feature/element-links
base main: 452b491
PR #14: Add standalone links for text elements
GitHub-sak: #13
```

Fasen er implementert, auditert, manuelt testet, bygget og dokumentert. PR #14 er åpen og mergebar, men ikke merget.

Ferdig på `main`:

- blankt PC- og Telefon-lerret
- kontrollert topp- og venstremeny
- Seksjon, Bilde, Tekst og Knapp
- prosjektmodell, stabile ID-er og sentral state
- markering, flytting, resizing og låsing
- kontrollert flerlinjet tekstredigering
- høyremenyens grunnstruktur
- tekstegenskaper for hele tekstboksen
- Dependency Cruiser og samlet `npm run check`

Viktige merges:

```text
PR #4   drag og resize
PR #5   objektlåsing                 a3eed45
PR #7   ren tekstredigering          c729d33
PR #8   navn og rekkefølge i meny    a35f59d
PR #9   høyremenyens grunnstruktur   8de5f2e
PR #11  tekstegenskaper              452b491
```

## Fast ansvarsdeling

```text
Venstremeny = opprette og velge struktur
Høyremeny  = egenskaper for markert element
Lerretet   = redigere selve teksten
```

`Elementer -> Tekst` oppretter en vanlig fri tekstboks. Font, størrelse, lenke og andre egenskaper ligger i høyremenyen. `Logo og header` skal senere eie strukturelle headerdeler som ikke er vanlige frie tekstbokser.

## Autoritativ state

Varig prosjektdata:

- geometri
- synlighet
- låsestatus
- tekstinnhold
- tekststil
- elementlenke for støttede elementtyper
- `updatedAt`

Transient state:

- `selectedElementId`
- pekerinteraksjon og layout-preview
- aktiv tekstredigering og lokal draft
- lenkeskjemaets lokale inputdraft
- validerings- og lagringsmelding
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
Tekstutseende
Font
Størrelse
Fet
Kursiv
Justering
Linjehøyde
```

Produktregler:

- formateringen gjelder hele tekstboksen
- åtte nettsikre fontvalg
- størrelser fra 12 til 96 px
- fet og kursiv som uavhengige toggles
- venstre, midtstilt og høyre justering
- kontrollert linjehøyde
- standard: System, 16 px, normal, venstre, 1.45
- låste tekstelementer viser verdiene, men kontrollene er deaktivert
- tekstinnhold redigeres fortsatt bare på lerretet
- tekstfarge bygges senere sammen med prosjektfargene

Modell:

- prosjektskjema versjon 3 på `main`
- obligatorisk `textStyle` bare for tekstelementer
- stabile fonttokens i prosjektdata
- CSS-fontstacker avledes i visningslaget

Se `docs/TEXT_PROPERTIES.md`.

## Frittstående elementlenker i PR #14

Første leveranse gjelder hele vanlige tekstbokser:

```text
Lenke
Type: Ingen / Ekstern lenke
Nettadresse
Åpne i ny fane
Lag lenke / Lagre lenke / Fjern lenke
```

Produktregler:

- hele tekstboksen får lenken
- bare `http://` og `https://` godtas
- ugyldig URL lagres ikke
- `openInNewTab` er en eksplisitt boolean
- låste tekstelementer viser verdiene, men kontrollene er deaktivert
- lagring gir tydelig grønn og tekstlig bekreftelse
- lenken aktiveres aldri i editormodus
- enkeltord og tekstsegmenter kan ikke få egne lenker
- forhåndsvisning og publisering bygges senere

Modell og reducer:

- prosjektskjema versjon 4 på branchen
- `link` er obligatorisk bare på `kind: 'text'` i første leveranse
- discriminated union: `none` eller `external-url { url, openInNewTab }`
- runtime-validatoren avviser `unknown`, `null`, arrays, ukjente nøkler og ugyldige URL-er
- validatorregisteret er uttømmende
- manglende, feiltypede, låste og uendrede overganger avvises
- `updatedAt` endres bare ved reell endring
- høyremenyens draft og feedback er transient
- editorens DOM rendrer ikke et aktivt navigerbart anker

Arkitektur:

```text
model       -> elementLink.ts
state       -> setTextElementLink.ts og useTextElementLink.ts
properties  -> ElementLinkPropertiesSection.tsx
composition -> RightPropertiesPanel.tsx
canvas      -> urørt av lenkehandlingen
```

Se `docs/ELEMENT_LINKS.md`.

## Audit og kontroll

Verifisert av brukeren etter siste produksjonskodeendring:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 48 moduler, 109 avhengigheter, ingen brudd
produksjonsbuild: bestått
Vite: 58 moduler transformert
```

Manuelt verifisert:

- gyldig lenke lagres og vises igjen
- lagreknappen gir grønn bekreftelse
- ugyldig adresse avvises
- lenken åpnes ikke i editoren
- låste kontroller er deaktivert

Arkitekturrapportene er regenerert. `EditorCanvasElement.tsx` ble ikke endret og skal fortsatt ikke få flere nye ansvarsområder.

## Senere knappbibliotek

Full knappdesigner bygges ikke nå.

Bekreftet retning:

- knapper designes i Canva eller Figma
- eksporteres som SVG eller PNG
- `Elementer -> Knapp` åpner et internt bibliotek
- brukeren legger til flere knappfiler etter behov
- valgt knapp settes inn på lerretet
- samme lenkemodell gjenbrukes
- grafiske knapper får tilgjengelig navn
- lenken aktiveres ikke i editormodus

Foreløpig branch:

```text
feature/button-library
```

Den gamle `feature/button-element`-branchen er parkert og skal ikke merges. Sak #12 er lukket som `not_planned`.

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

Tekstfarge kobles til prosjektfargemodellen. Headertekst bygges som headerstruktur, ikke som vanlig fritt tekstelement. Forhåndsvisning og publisering skal tolke semantiske lenkedata og rendre aktive, tilgjengelige ankere.

## Åpne beslutninger

- knappbibliotekets lagringsplass og filformat
- statisk lesing kontra skrivbar lokal mappe
- SVG kontra PNG som anbefalt knappformat
- sletting og bekreftelsesregel
- endelig mobilbrytepunkt
- mobile tekststiloverstyringer
- flere lenketyper utover ekstern URL
- prosjektfilformat, migrering og lagringsintervall
- publiseringsarkitektur
