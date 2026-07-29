# Website-editor

Lokal webside-editor bygget med React, TypeScript og Vite.

Editoren åpner med et blankt lerret. Brukeren kan opprette, markere, flytte, endre størrelse, låse og slette elementer. Tekstbokser støtter kontrollert flerlinjet redigering, tekstegenskaper og ekstern lenke. Knapper opprettes fra et bundlet SVG-bibliotek og har redigerbar tekst, design og lenke.

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

`npm run dev` bruker `vite --open`.

## Kvalitetskontroll

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
```

Arkitekturrapportene ligger i `architecture.json` og `docs/dependency-graph.mmd`.

## Branch-regel

Det utvikles aldri direkte på `main`.

```text
main
  -> avgrenset feature- eller docs-branch
  -> låst omfang
  -> implementering
  -> framtidsrettet audit
  -> automatiske og manuelle kontroller
  -> dokumentasjon og arkitekturrapporter
  -> PR-kontroll
  -> eksplisitt mergegodkjenning
```

## Gjeldende status

```text
main: 5e548ad
PR #21: Build first bundled SVG button library – merget
GitHub-sak #20: lukket som fullført
prosjektskjema: versjon 5
siste verifisering:
  ESLint: bestått
  TypeScript: bestått
  Dependency Cruiser: 69 moduler, 161 avhengigheter, ingen brudd
  Vite: 78 moduler transformert
  produksjonsbuild: bestått
  arkitekturrapport: 0 brudd, 0 feil, 0 advarsler
  PC- og Telefon-test: godkjent
```

## Ferdig og merget til `main`

- stabilt React/TypeScript/Vite-grunnlag
- blankt PC- og Telefon-lerret
- toppmeny og kontrollert venstremeny
- Seksjon, Bilde, Tekst og Knapp
- prosjektmodell med stabile ID-er og sentral state
- markering, flytting, resizing og låsing
- kontrollert flerlinjet tekstredigering
- høyremenyens grunnstruktur
- tekstegenskaper og eksterne lenker
- sikker sletting via høyremeny og `Delete`
- første bundlede SVG-knappbibliotek
- knappetekst, design og lenke i høyremenyen
- kontrollert fallback for ukjent knappasset
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
PR #21  SVG-knappbibliotek           5e548ad
```

## Gjeldende venstremeny

```text
Prosjekt
Farger
Logo og header
Elementer
Innstillinger
```

`Elementer -> Knapp` åpner det interne designbiblioteket. Det finnes ikke et separat venstremenypunkt kalt `Knapper`.

## Fast ansvarsdeling

```text
Venstremeny = opprette elementer og velge ferdig design
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere tekst og transformere elementer
```

For knapper:

```text
Venstremeny = velge design og opprette
Høyremeny  = endre tekst, design og lenke
Lerretet   = markere, flytte og endre størrelse
```

## Knappbibliotek

Stabile asset-ID-er:

```text
button.primary-rounded.v1
button.secondary-rounded.v1
button.outline-rounded.v1
button.dark-rounded.v1
```

Prosjektdata lagrer stabil `assetId`, ikke filsti, import-URL eller rå SVG. Knappens synlige tekst er ekte HTML-tekst. Lenker aktiveres aldri i editormodus.

Se `docs/BUTTON_LIBRARY.md`.

## Prosjektmodell

Gjeldende skjemaversjon er 5.

```text
versjon 1  grunnmodell
versjon 2  tekstinnhold
versjon 3  tekststil
versjon 4  elementlenke
versjon 5  knappasset, knappetekst og knappelenke
```

Tekstelementer har `content`, `textStyle` og `link`. Knappelementer har `assetId`, `label` og `link`.

## Filstørrelse og ansvar

- 250 linjer er aktiv terskel for ansvarstrekk i kildefiler.
- 300 linjer er hard unntaksgrense.
- `EditorCanvasElement.tsx` skal ikke få flere nye funksjonsansvar.
- Varige prosjektendringer går gjennom validerte reducerhandlinger.
- Ugyldige og uendrede handlinger skal returnere samme state.

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
10. øvrige fasedokumenter
