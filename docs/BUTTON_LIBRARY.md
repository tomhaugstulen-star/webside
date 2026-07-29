# Knappbibliotek

Dette dokumentet er autoritativ spesifikasjon og verifikasjonslogg for den første avgrensede knappbibliotekfasen.

```text
branch: feature/button-library
GitHub-sak: #20 Build first bundled SVG button library
base main: 06307a2
produksjonscommits:
  a8017d4  feat: add button element model
  7fe89f2  feat: add bundled button assets
  1b80890  feat: add button design library
  ec30b9a  feat: add button property controls
PR: ikke opprettet ennå
```

## Status

Implementeringen og den manuelle akseptansetesten er godkjent på branchen. Arkitekturrapportene skal regenereres og hele branchdiffen kontrolleres før PR opprettes.

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

## Første asset-katalog

```text
button.primary-rounded.v1
button.secondary-rounded.v1
button.outline-rounded.v1
button.dark-rounded.v1
```

Assetene ligger under `src/assets/buttons/` og bundles statisk av Vite. Prosjektdata lagrer stabil `assetId`, aldri filsti, import-URL eller rå SVG.

Katalogen oversetter `assetId` til:

- bundlet SVG-kilde
- visningsnavn
- tekstfarge
- skaleringsmetadata

Alle fire assetene bruker fri bredde- og høydeskalering.

## Prosjektmodell

Fasen øker prosjektskjemaet fra versjon 4 til versjon 5.

```ts
export type ButtonEditorElement = BaseEditorElement & {
  kind: 'button'
  assetId: ButtonAssetId
  label: string
  link: ElementLink
}
```

Standard for nye knapper:

```text
assetId: button.primary-rounded.v1
label: Les mer
link: none
```

`assetId`, `label` og `link` er foreløpig felles for PC og Telefon.

## Oppretting

Opprettingsintensjonen er en diskriminert union. Bare knappeforespørsler kan inneholde `assetId`.

Klikk på `Knapp` åpner biblioteket uten å opprette et element. Først valg av et konkret design oppretter og markerer knappen og lukker venstrepanelet.

Ukjent `assetId` avvises både ved brukergrensen og i reduceren.

## Knappetekst

Knappeteksten er ekte HTML-tekst over dekorativ SVG. Den brukes som synlig etikett og tilgjengelig navn.

Regler:

- teksten redigeres i høyremenyen
- ledende og avsluttende whitespace fjernes
- tom eller whitespace-only tekst avvises
- uendret tekst muterer ikke prosjektet
- låst knapp kan inspiseres, men ikke endres

## Designbytte og fallback

Designbytte går gjennom en typet reducerhandling.

Reducergrensen avviser:

- manglende aktiv side
- manglende eller feil elementtype
- låst knapp
- ukjent katalog-ID
- uendret design

Et lagret ukjent `assetId` krasjer ikke editoren. Lerretet bruker kontrollert fallback, og høyremenyen viser et varsel og lar brukeren velge et gyldig design.

## Lenke

Tekstbokser og knapper bruker samme `ElementLink`-modell og samme høyremenyformular:

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

Varige endringer går gjennom typed reducer-actions:

```text
add-element-to-active-page
set-button-label
set-button-asset
set-element-link
```

Transient state serialiseres ikke:

- bibliotekvisning
- inputdraft
- valideringsmeldinger
- lagringsfeedback
- fokus og hover

Ansvar er fordelt mellom modell, asset-katalog, state, venstrepanel, høyremeny og rendering. `EditorCanvasElement.tsx` fikk ikke et nytt stort knappansvar.

## Utenfor omfanget

- PNG
- opplasting eller import av egne knappfiler
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

Automatisk kontroll etter siste produksjonscommit:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 68 moduler, 158 avhengigheter, ingen brudd
Vite: 77 moduler transformert
CSS: 24.43 kB, gzip 5.12 kB
JavaScript: 239.40 kB, gzip 72.88 kB
produksjonsbuild: bestått
```

Manuell akseptansetest er godkjent for:

- alle fire designvarianter
- oppretting og markering
- flytting og resizing
- knappetekst og tomtekstvalidering
- designbytte
- legge til og fjerne ekstern lenke
- ingen lenkeaktivering i editormodus
- låsing og opplåsing
- sletting
- PC- og Telefon-visning
- peker- og tastaturflyt

## Gjenstår før PR

- regenerer `architecture.json`
- regenerer `docs/dependency-graph.mmd`
- kontroller hele diffen og filgrensene
- kjør `git diff --check`
- bekreft clean og synkronisert branch
- opprett PR mot `main`
- merge bare etter eksplisitt brukergodkjenning
