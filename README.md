# Website-editor

Lokal webside-editor bygget med React, TypeScript og Vite.

Editoren åpner med et blankt, hvitt lerret. Brukeren kan opprette, markere, flytte, endre størrelse, låse og slette grunnleggende elementer. Tekstbokser støtter kontrollert flerlinjet redigering, tekstegenskaper og en ekstern lenke for hele tekstboksen.

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

`npm run check` kjører ESLint, TypeScript-kontroll, Dependency Cruiser og produksjonsbuild.

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
  -> implementering eller dokumentendring
  -> framtidsrettet audit
  -> relevante kontroller
  -> dokumentasjon
  -> PR-kontroll
  -> eksplisitt mergegodkjenning
```

Produksjonsbrancher følger normalt `npm run check` og oppdaterte arkitekturrapporter. Rene Markdown-brancher bruker normalt dokumentkontroll, `git diff --check` og bekreftet clean tree når ingen kode, konfigurasjon eller arkitekturrapporter er endret.

## Gjeldende status

```text
base main for dokumentasjonsaudit: 56e2af7
GitHub-sak: #18 Audit and synchronize project documentation
branch: docs/project-documentation-audit
siste funksjonelle merge: b428cac, PR #16
prosjektskjema: versjon 4
produksjonskode i auditfasen: uendret
ny produksjonsfase: ikke valgt
```

Dokumentasjonsauditen skal fullføres og merges før en ny produksjonsfase velges.

## Ferdig og merget til `main`

- stabilt React/TypeScript/Vite-grunnlag
- blankt PC- og Telefon-lerret
- toppmeny og kontrollert venstremeny
- Seksjon, Bilde, Tekst og Knapp
- prosjekt- og elementmodell med stabile ID-er
- sentral prosjekt-state og aktiv side
- transient elementmarkering
- oppretting av alle fire elementtyper
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

Alternative navn som `Filer`, `Alle farger`, `Fonts` og separat `Knapper` er ikke implementert eller vedtatt. De kan bare behandles som åpne framtidige produktbeslutninger.

## Fast ansvarsdeling

```text
Venstremeny = opprette og velge struktur
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere tekst og transformere elementer
```

`Elementer -> Tekst` oppretter en vanlig fri tekstboks. Tekstinnhold redigeres på lerretet. Font, størrelse, lenke og sletting ligger i høyremenyen.

`Logo og header` skal senere eie strukturelle headerdeler som logo, hovedtekst, undertittel og header-oppsett.

## Høyremeny

Gjeldende oppførsel:

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

Panelet leser valgt element fra autoritativ selection-state. Det eier ingen separat elementkopi og muterer ikke prosjektet direkte.

## Prosjektmodell

Gjeldende prosjektskjema er versjon 4.

Historiske skjematrinn:

```text
versjon 2  tekstinnhold
versjon 3  tekststil
versjon 4  elementlenke, gjeldende
```

Tekstelementer har obligatorisk:

```text
content
textStyle
link
```

Lenken er enten:

```text
none
external-url { url, openInNewTab }
```

Regler:

- hele tekstboksen får lenken
- bare absolutte `http://`- og `https://`-adresser godtas
- ugyldig URL muterer ikke prosjektet
- låste tekstbokser kan inspiseres, men ikke endres
- lenken åpnes aldri i editormodus
- enkeltord får ikke egne lenker

Se `docs/ELEMENT_MODEL.md`, `docs/TEXT_PROPERTIES.md` og `docs/ELEMENT_LINKS.md`.

## Sikker sletting

PR #16 la til sletting av ett markert element:

```text
Slett seksjon
Slett bilde
Slett tekstboks
Slett knapp
```

Regler:

- sletteknappen ligger rett under statusboksen i høyremenyen
- låst element kan ikke slettes
- sletting krever alltid bekreftelsesdialog
- `Escape` og `Avbryt` lukker uten mutasjon
- `Delete` åpner samme dialog
- Delete under tekstredigering påvirker bare teksten
- bekreftet sletting fjerner bare målelementet
- markeringen nullstilles bare når det slettede elementet var markert
- sletting av Seksjon fjerner ikke visuelt overlappende elementer
- dialogens `Escape` påvirker ikke et åpent verktøypanel

Se `docs/ELEMENT_DELETION.md`.

## State-grenser

Varig prosjektdata:

- elementgeometri
- synlighet
- låsestatus
- tekstinnhold
- tekststil
- elementlenke
- prosjektets `updatedAt`

Transient editor-state:

- `selectedElementId`
- aktiv pekerinteraksjon og layout-preview
- aktiv tekstredigering og draft
- lenkeskjemaets draft og status
- slettedialogens mål og fokusreferanse
- aktive verktøy og paneler
- fokus, hover og lokal UI-feedback

Transient state serialiseres ikke.

## Filstørrelse og ansvar

- 250 linjer er aktiv terskel for ansvarstrekk i kildefiler.
- 300 linjer er hard unntaksgrense.
- En fil deles tidligere når den får flere tydelige ansvar.
- `EditorCanvasElement.tsx` skal ikke få flere nye funksjonsansvar.

## Autoritativ dokumentrekkefølge

1. `docs/NEXT_CHAT_PROMPT.md`
2. `docs/WORK_PLAN.md`
3. `docs/EDITOR_PLANNING.md`
4. `docs/PROJECT_RULES.md`
5. `README.md`
6. `docs/ELEMENT_DELETION.md`
7. `docs/ELEMENT_LINKS.md`
8. `docs/TEXT_PROPERTIES.md`
9. `docs/RIGHT_PROPERTIES_PANEL.md`
10. `docs/ELEMENT_MODEL.md`
11. `docs/TEXT_BOX_EDITING.md`
12. `docs/OBJECT_LOCKING.md`
13. `docs/DRAG_RESIZE.md`
14. `docs/ELEMENT_SELECTION.md`
15. `docs/ELEMENT_CREATION.md`
16. `docs/MOBILE_DESIGN_CONTROLS.md`
17. `docs/CODE_AUDIT.md`

Hoveddokumentene er autoritative for gjeldende prosjektstatus. Fasedokumentene er autoritative for den historiske implementeringsgrensen og de tekniske beslutningene i sin fase.