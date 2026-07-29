# Website-editor

Lokal webside-editor bygget med React, TypeScript og Vite.

Editoren åpner med et blankt lerret. Brukeren kan opprette, markere, flytte, endre størrelse, låse og slette elementer. Tekstbokser støtter kontrollert flerlinjet redigering, tekstegenskaper og ekstern lenke. Den aktive feature-branchen legger til et ferdig SVG-knappbibliotek med redigerbar knappetekst, design og lenke.

## Repo og lokal mappe

```text
https://github.com/tomhaugstulen-star/webside.git
C:\Users\tomha\Desktop\website
```

## Starte prosjektet

```powershell
cd C:\Users\tomha\Desktop\website
npm install
npm run dev
```

`npm run dev` bruker `vite --open` og åpner editoren automatisk.

## Kvalitetskontroll

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
```

`npm run check` kjører ESLint, TypeScript, Dependency Cruiser og produksjonsbuild.

Arkitekturrapportene skrives til:

```text
architecture.json
docs/dependency-graph.mmd
```

## Branch-regel

Det utvikles aldri direkte på `main`.

```text
main
  -> avgrenset feature- eller docs-branch
  -> låst omfang og design
  -> implementering
  -> framtidsrettet audit
  -> automatiske og manuelle kontroller
  -> dokumentasjon og arkitekturrapporter
  -> PR-kontroll
  -> eksplisitt mergegodkjenning
```

## Gjeldende status

```text
base main: 06307a2
GitHub-sak: #20 Build first bundled SVG button library
branch: feature/button-library
prosjektskjema på branchen: versjon 5
produksjonscommits:
  a8017d4  feat: add button element model
  7fe89f2  feat: add bundled button assets
  1b80890  feat: add button design library
  ec30b9a  feat: add button property controls
manuell akseptansetest: godkjent
PR: ikke opprettet ennå
```

`main` inneholder dokumentasjonsauditen fra PR #19 og har fortsatt siste mergede funksjonelle fase fra PR #16. Knappbiblioteket er ferdig kontrollert på feature-branchen, men er ikke merget.

## Ferdig og merget til `main`

- stabilt React/TypeScript/Vite-grunnlag
- blankt PC- og Telefon-lerret
- toppmeny og kontrollert venstremeny
- Seksjon, Bilde, Tekst og grunnleggende Knapp-element
- prosjekt- og elementmodell med stabile ID-er
- sentral prosjekt-state og aktiv side
- elementmarkering
- flytting og størrelsesendring med peker og tastatur
- clamping, minimumsmål, edge-scroll og automatisk lerretsvekst
- objektlåsing
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

## Aktiv knappbibliotekfase

Brukerflyt:

```text
Elementer -> Knapp -> velg ett av fire SVG-design
```

Valgt design oppretter og markerer en knapp. Høyremenyen kan deretter endre:

- knappetekst
- design
- ekstern lenke
- åpning i ny fane

Knappen kan flyttes, resizes, låses, låses opp og slettes med eksisterende editorfunksjoner. Lenken aktiveres aldri i editormodus.

Første stabile asset-ID-er:

```text
button.primary-rounded.v1
button.secondary-rounded.v1
button.outline-rounded.v1
button.dark-rounded.v1
```

Prosjektdata lagrer stabil `assetId`, ikke filsti, import-URL eller rå SVG.

Se `docs/BUTTON_LIBRARY.md`.

## Gjeldende venstremeny

```text
Prosjekt
Farger
Logo og header
Elementer
Innstillinger
```

Knappbiblioteket ligger internt under `Elementer -> Knapp`. Det finnes ikke et separat venstremenypunkt kalt `Knapper`.

## Fast ansvarsdeling

```text
Venstremeny = opprette elementer og velge ferdig design
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere tekst og transformere elementer
```

For knapper gjelder:

```text
Venstremeny = velge design og opprette
Høyremeny  = endre tekst, design og lenke
Lerretet   = markere, flytte og endre størrelse
```

## Høyremeny

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

Panelet leser autoritative elementdata fra sentral state. Det eier ingen separat elementkopi og muterer ikke prosjektet direkte.

## Prosjektmodell

Gjeldende skjemaversjon på `feature/button-library` er versjon 5.

```text
versjon 1  grunnmodell
versjon 2  tekstinnhold
versjon 3  tekststil
versjon 4  elementlenke
versjon 5  stabilt knappasset, knappetekst og knappelenke
```

Tekstelement:

```text
content
textStyle
link
```

Knappelement:

```text
assetId
label
link
```

Lenken er enten:

```text
none
external-url { url, openInNewTab }
```

Bare absolutte `http://`- og `https://`-adresser godtas. Lenker aktiveres ikke i editormodus.

## State-grenser

Varig prosjektdata:

- elementgeometri og synlighet
- låsestatus
- tekstinnhold og tekststil
- elementlenke
- knappens `assetId` og `label`
- prosjektets `updatedAt`

Transient editor-state:

- `selectedElementId`
- pekerinteraksjon og layout-preview
- tekst-, knappetekst- og lenkedrafts
- katalogvisning og lokal feedback
- slettedialogens mål og fokusreferanse
- aktive verktøy, fokus og hover

Transient state serialiseres ikke.

## Filstørrelse og ansvar

- 250 linjer er aktiv terskel for ansvarstrekk i kildefiler.
- 300 linjer er hard unntaksgrense.
- En fil deles tidligere når den får flere tydelige ansvar.
- `EditorCanvasElement.tsx` skal ikke få flere nye funksjonsansvar.

## Gjenstår før PR

- regenerere `architecture.json`
- regenerere `docs/dependency-graph.mmd`
- kontrollere branchdiff og filgrenser
- kjøre `git diff --check`
- bekrefte clean og synkronisert branch
- opprette PR mot `main`
- merge bare etter eksplisitt godkjenning

## Autoritativ dokumentrekkefølge

1. `docs/NEXT_CHAT_PROMPT.md`
2. `docs/WORK_PLAN.md`
3. `docs/EDITOR_PLANNING.md`
4. `docs/PROJECT_RULES.md`
5. `README.md`
6. `docs/BUTTON_LIBRARY.md`
7. `docs/ELEMENT_MODEL.md`
8. `docs/ELEMENT_LINKS.md`
9. `docs/RIGHT_PROPERTIES_PANEL.md`
10. `docs/ELEMENT_DELETION.md`
11. `docs/TEXT_PROPERTIES.md`
12. `docs/TEXT_BOX_EDITING.md`
13. `docs/OBJECT_LOCKING.md`
14. `docs/DRAG_RESIZE.md`
15. `docs/ELEMENT_SELECTION.md`
16. `docs/ELEMENT_CREATION.md`
17. `docs/MOBILE_DESIGN_CONTROLS.md`
18. `docs/CODE_AUDIT.md`
