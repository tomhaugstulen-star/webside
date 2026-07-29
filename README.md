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

`npm run check` kjører:

- ESLint
- TypeScript-kontroll
- Dependency Cruiser
- produksjonsbuild

Arkitekturrapportene skrives til:

```text
architecture.json
docs/dependency-graph.mmd
```

## Branch-regel

Det utvikles aldri direkte på `main`.

```text
main
  -> avgrenset feature-branch
  -> låst omfang og design
  -> implementering
  -> kodeaudit
  -> npm run check
  -> arkitekturrapporter
  -> manuell kontroll
  -> dokumentasjon
  -> PR-kontroll
  -> eksplisitt mergegodkjenning
```

## Gjeldende status

Siste bekreftede `main`:

```text
f71b354  PR #14 – frittstående lenker for tekstbokser
```

Gjeldende branch:

```text
feature/element-deletion
```

Sporing:

```text
GitHub-sak #15
produksjonscommit 4f59b3e
PR ikke opprettet
```

Slettefunksjonen er implementert, bygget og manuelt godkjent. Arkitekturrapportene må regenereres før PR.

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

`Logo og header` skal senere eie strukturelle headerdeler som logo, hovedtekst, undertittel og header-oppsett.

## Frittstående tekstlenker

Tekstelementer bruker prosjektskjema versjon 4 og har obligatorisk lenkedata:

```text
none
eller
external-url { url, openInNewTab }
```

Regler:

- hele tekstboksen får lenken
- bare absolutte `http://`- og `https://`-adresser godtas
- ugyldig URL muterer ikke prosjektet
- låste tekstbokser kan inspiseres, men ikke endres
- lenken åpnes aldri i editormodus
- enkeltord får ikke egne lenker

Se `docs/ELEMENT_LINKS.md`.

## Sikker sletting

Gjeldende branch legger til sletting av ett markert element:

```text
Slett seksjon
Slett bilde
Slett tekstboks
Slett knapp
```

Sletteknappen ligger rett under statusboksen i høyremenyen.

Regler:

- låst element kan ikke slettes
- sletting krever alltid bekreftelsesdialog
- `Escape` og `Avbryt` lukker uten mutasjon
- `Delete` åpner samme dialog
- Delete under tekstredigering påvirker bare teksten
- bekreftet sletting fjerner bare målelementet
- markeringen nullstilles og høyremenyen lukkes
- sletting av Seksjon fjerner ikke visuelt overlappende elementer
- prosjektskjemaet forblir versjon 4

Se `docs/ELEMENT_DELETION.md`.

## Verifisert status for slettingsfasen

Brukeren har kjørt:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 54 moduler, 120 avhengigheter, ingen brudd
produksjonsbuild: bestått
Vite: 64 moduler transformert
```

Manuelt godkjent:

- alle fire etiketter
- plassering og disabled-tilstand
- avbrytelse og Escape
- sletting via knapp og Delete
- tekstredigeringsgrensen
- låsegrensen
- flat Seksjon-modell

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
- aktiv pekerinteraksjon
- layout-preview
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

## Dokumentasjon

Les i denne rekkefølgen:

1. `docs/NEXT_CHAT_PROMPT.md`
2. `docs/WORK_PLAN.md`
3. `docs/ELEMENT_DELETION.md`
4. `docs/ELEMENT_LINKS.md`
5. `docs/TEXT_PROPERTIES.md`
6. `docs/RIGHT_PROPERTIES_PANEL.md`
7. `docs/EDITOR_PLANNING.md`
8. `docs/PROJECT_RULES.md`
9. `docs/ELEMENT_MODEL.md`
10. `docs/TEXT_BOX_EDITING.md`
11. `docs/OBJECT_LOCKING.md`
12. `docs/DRAG_RESIZE.md`
13. `docs/ELEMENT_SELECTION.md`
14. `docs/ELEMENT_CREATION.md`
15. `docs/MOBILE_DESIGN_CONTROLS.md`
16. `docs/CODE_AUDIT.md`
