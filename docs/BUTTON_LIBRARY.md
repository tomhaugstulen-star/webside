# Knappbibliotek

Dette dokumentet er autoritativ spesifikasjon og verifikasjonslogg for den første bundlede SVG-knappbibliotekfasen.

```text
branch: feature/button-library
GitHub-sak: #20 Build first bundled SVG button library
base main: 06307a2
PR #21: merget
mergecommit: 5e548ad
prosjektskjema: versjon 5
```

## Status

Fasen er implementert, framtidsauditert, automatisk kontrollert, manuelt godkjent og merget til `main`. Sak #20 er lukket som fullført.

Produksjons- og kontrollcommits:

```text
a8017d4  feat: add button element model
7fe89f2  feat: add bundled button assets
1b80890  feat: add button design library
ec30b9a  feat: add button property controls
f6bcede  refactor: extract element creation reducer
6fe9ef6  chore: refresh architecture reports after reducer refactor
```

## Leveranse

Brukeren kan:

1. åpne `Elementer`
2. velge `Knapp`
3. se fire ferdige SVG-design
4. opprette valgt knapp på lerretet
5. flytte og endre størrelse på knappen
6. endre knappetekst i høyremenyen
7. bytte design i høyremenyen
8. legge til eller fjerne ekstern lenke
9. låse, låse opp og slette knappen

Lenken aktiveres aldri i editormodus.

## Fast ansvarsdeling

```text
Venstremeny = velge design og opprette knapp
Høyremeny  = endre knappetekst, design og lenke
Lerretet   = markere, flytte og endre størrelse
```

## Asset-katalog

```text
button.primary-rounded.v1
button.secondary-rounded.v1
button.outline-rounded.v1
button.dark-rounded.v1
```

Assetene ligger under `src/assets/buttons/` og bundles statisk av Vite. Prosjektdata lagrer stabil `assetId`, aldri filsti, import-URL eller rå SVG.

Katalogen oversetter `assetId` til bundlet SVG-kilde, visningsnavn, tekstfarge og skaleringsmetadata. Alle fire assetene bruker fri bredde- og høydeskalering.

## Prosjektmodell

```ts
export type ButtonEditorElement = BaseEditorElement & {
  kind: 'button'
  assetId: ButtonAssetId
  label: string
  link: ElementLink
}
```

Standard:

```text
assetId: button.primary-rounded.v1
label: Les mer
link: none
```

`assetId`, `label` og `link` er foreløpig felles for PC og Telefon.

## Oppretting

Opprettingsintensjonen er diskriminert. Bare knappeforespørsler kan inneholde `assetId`.

Klikk på `Knapp` åpner biblioteket uten å opprette et element. Først valg av konkret design oppretter og markerer knappen og lukker venstrepanelet.

Ukjent `assetId` avvises ved brukergrensen og i state-/reducergrensen. Opprettingsansvaret ligger i `addElementToActivePage.ts`, trukket ut for å holde den sentrale reduceren under aktiv filgrense.

## Knappetekst

Knappeteksten er ekte HTML-tekst over dekorativ SVG. Den brukes som synlig etikett og tilgjengelig navn.

- teksten redigeres i høyremenyen
- ledende og avsluttende whitespace fjernes
- tom eller whitespace-only tekst avvises
- uendret tekst muterer ikke prosjektet
- låst knapp kan inspiseres, men ikke endres

## Designbytte og fallback

Reducergrensen avviser manglende element, feil elementtype, låst knapp, ukjent katalog-ID og uendret design.

Et lagret ukjent `assetId` krasjer ikke editoren. Lerretet viser kontrollert fallback, og høyremenyen viser varsel og lar brukeren velge et gyldig design.

## Lenke

Tekstbokser og knapper bruker samme `ElementLink`:

```text
none
external-url { url, openInNewTab }
```

Bare absolutte `http://`- og `https://`-adresser godtas. Ugyldige eller uendrede lenkehandlinger muterer ikke prosjektet eller `updatedAt`.

## SVG-krav

- gyldig `viewBox`
- ingen innebygd tekst
- ingen script eller `foreignObject`
- ingen eksterne URL-er eller filer
- ingen rasterbilder
- transparent bakgrunn
- stabil rendering ved fri skalering

## State og arkitektur

Varige endringer går gjennom typede actions:

```text
add-element-to-active-page
set-button-label
set-button-asset
set-element-link
```

Transient bibliotekvisning, drafts, validering, feedback, fokus og hover serialiseres ikke.

## Utenfor omfanget

- PNG og egne opplastede knappfiler
- dynamisk katalog
- Canva- eller Figma-integrasjon
- tekst i SVG
- prosjektfarger eller SVG-fargeredigering
- riktekst
- hover-, pressed- og disabled-varianter
- intern sidenavigasjon
- forhåndsvisning eller publisering
- historikk eller autolagring
- egne mobiloverstyringer
- separat venstremenypunkt kalt `Knapper`

## Verifisering

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 69 moduler, 161 avhengigheter, ingen brudd
Vite: 78 moduler transformert
CSS: 24.43 kB, gzip 5.12 kB
JavaScript: 239.41 kB, gzip 72.88 kB
produksjonsbuild: bestått
arkitekturrapport: 0 brudd, 0 feil, 0 advarsler
```

Manuell akseptansetest er godkjent for alle fire design, oppretting, markering, flytting, resizing, knappetekst, tomtekstvalidering, designbytte, lenke, låsing, sletting, PC, Telefon, peker og tastatur.
