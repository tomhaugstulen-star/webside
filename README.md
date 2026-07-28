# Website-editor

Lokal webside-editor bygget med React, TypeScript og Vite.

Editoren åpner med et blankt, hvitt lerret. Brukeren kan opprette, markere, flytte, endre størrelse og låse grunnleggende elementer. Tekstbokser støtter kontrollert flerlinjet redigering, tekstegenskaper i høyremenyen og en frittstående ekstern lenke for hele tekstboksen.

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
  -> avgrenset feature-branch
  -> godkjent omfang og design
  -> implementering
  -> framtidsrettet kodeaudit
  -> npm run check
  -> arkitekturrapporter
  -> PC-, Telefon-, peker- og tastaturkontroll
  -> dokumentasjon
  -> kontrollert PR
  -> eksplisitt mergegodkjenning
```

## Gjeldende `main`

```text
452b491
```

Dette er merge-commit fra PR #11, som la inn tekstegenskaper i høyremenyen.

Viktige merges:

```text
PR #4   drag og resize
PR #5   objektlåsing                 a3eed45
PR #7   ren tekstredigering          c729d33
PR #8   navn og rekkefølge i meny    a35f59d
PR #9   høyremenyens grunnstruktur   8de5f2e
PR #11  tekstegenskaper              452b491
```

## Ferdig og merget til `main`

- stabilt React/TypeScript/Vite-grunnlag
- blankt PC- og Telefon-lerret
- toppmeny og kontrollert venstremeny
- Elementer-panel med Seksjon, Bilde, Tekst og Knapp
- prosjekt- og elementmodell med stabile ID-er og responsive verdier
- sentral prosjekt-state og aktiv side
- transient elementmarkering
- oppretting av alle fire elementtyper
- flytting og størrelsesendring med peker og tastatur
- clamping, minimumsmål, edge-scroll og automatisk lerretsvekst
- objektlåsing
- kontrollert flerlinjet tekstredigering
- høyremenyens grunnstruktur
- tekstegenskaper for hele tekstboksen
- Dependency Cruiser og samlet `npm run check`

## Fast ansvarsdeling

```text
Venstremeny = opprette og velge struktur
Høyremeny  = egenskaper for markert element
Lerretet   = redigere selve teksten
```

`Elementer -> Tekst` oppretter en vanlig fri tekstboks. Font, størrelse, lenke og andre egenskaper ligger i høyremenyen. Selve tekstinnholdet redigeres på lerretet.

`Logo og header` skal senere eie strukturelle headerdeler som logo, hovedtekst, undertittel og header-oppsett.

## Gjeldende branch og PR

```text
branch: feature/element-links
base: main 452b491
PR: #14 Add standalone links for text elements
sporing: docs/ELEMENT_LINKS.md og GitHub-sak #13
```

PR #14 er åpen og mergebar, men skal ikke merges uten eksplisitt godkjenning.

## Frittstående lenker for tekstbokser

Første lenkeversjon gjelder hele den valgte tekstboksen:

```text
Marker tekstboksen
-> Høyremeny
-> Lenke
-> Ekstern lenke
-> skriv http:// eller https://
-> velg eventuelt Åpne i ny fane
-> Lag lenke / Lagre lenke
```

Regler:

- bare absolutte `http://`- og `https://`-adresser godtas
- ugyldig URL muterer ikke prosjektet
- `openInNewTab` lagres eksplisitt
- låste tekstbokser kan inspiseres, men ikke endres
- lagring gir grønn og tekstlig bekreftelse
- lenken åpnes aldri i editormodus
- hele tekstboksen får lenken; enkeltord får ikke egne lenker
- prosjektskjemaet er versjon 4 på branchen

Lenken lagres som semantisk prosjektdata, ikke som et aktivt `<a>`-element i editorens DOM. Forhåndsvisning og publisering skal senere tolke lenkedata og aktivere navigasjon.

Se `docs/ELEMENT_LINKS.md`.

## Verifisert status for PR #14

Brukeren har kontrollert at:

- gyldig lenke lagres
- adressen vises igjen når tekstboksen velges på nytt
- lagreknappen blir grønn og viser bekreftelse
- ugyldig adresse avvises
- vanlig klikk i editoren ikke åpner lenken
- låste elementer har deaktiverte lenkekontroller

Siste verifiserte `npm run check`:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 48 moduler, 109 avhengigheter, ingen brudd
produksjonsbuild: bestått
Vite: 58 moduler transformert
```

Arkitekturrapportene er regenerert og branchen var clean før dokumentasjonsrevisjonen.

## Senere knappbibliotek

Full knappdesigner bygges ikke nå.

Planlagt retning:

```text
Canva eller Figma
-> eksporter ferdigdesignet knapp som SVG eller PNG
-> lagre i et separat knappbibliotek
-> Elementer -> Knapp åpner biblioteket
-> valgt knapp settes inn på lerretet
-> samme lenkemodell brukes på knappen
```

Dette skal bygges i en separat branch, foreløpig kalt:

```text
feature/button-library
```

Den parkerte `feature/button-element`-branchen og sak #12 skal ikke merges eller brukes som produksjonsgrunnlag.

## State-grenser

Varig prosjektdata:

- elementgeometri
- låsestatus
- tekstinnhold
- tekststil
- elementlenke for støttede elementtyper
- prosjektets `updatedAt`

Transient editor-state:

- `selectedElementId`
- aktiv pekerinteraksjon
- layout-preview
- aktiv tekstredigeringsøkt og lokal draft
- lenkeskjemaets lokale inputdraft og statusmelding
- aktive verktøy og paneler
- fokus, hover og lokal UI-feedback

Transient state skal ikke serialiseres, eksporteres, publiseres eller inngå direkte i historikk eller autolagring.

## Filstørrelse og ansvar

- 250 linjer er aktiv terskel for ansvarstrekk i kildefiler.
- En fil deles tidligere når den får flere tydelige ansvar.
- 300 linjer er en eksplisitt unntaksgrense for kildefiler.
- `EditorCanvasElement.tsx` skal ikke få flere nye ansvarsområder.

## Dokumentasjon

Les i denne rekkefølgen:

1. `docs/NEXT_CHAT_PROMPT.md`
2. `docs/WORK_PLAN.md`
3. `docs/ELEMENT_LINKS.md`
4. `docs/TEXT_PROPERTIES.md`
5. `docs/RIGHT_PROPERTIES_PANEL.md`
6. `docs/EDITOR_PLANNING.md`
7. `docs/PROJECT_RULES.md`
8. `docs/ELEMENT_MODEL.md`
9. `docs/TEXT_BOX_EDITING.md`
10. `docs/OBJECT_LOCKING.md`
11. `docs/DRAG_RESIZE.md`
12. `docs/ELEMENT_SELECTION.md`
13. `docs/ELEMENT_CREATION.md`
14. `docs/MOBILE_DESIGN_CONTROLS.md`
15. `docs/CODE_AUDIT.md`
