# Arbeidsplan

Dette dokumentet beskriver gjeldende leveranse og den faste kontrollrekkefølgen.

## Fast arbeidsflyt

1. Kontroller branch, `origin/main` og clean tree.
2. Lås produkt- og modellomfang før produksjonskode.
3. Implementer bare avtalt omfang på egen branch.
4. Hold kildefiler under aktiv terskel på 250 linjer.
5. Gjennomfør framtidsrettet kodeaudit.
6. Kjør full automatisk kontroll etter siste produksjonsendring.
7. Test relevant funksjonalitet manuelt på PC og Telefon.
8. Regenerer arkitekturrapporter ved struktur- eller avhengighetsendringer.
9. Oppdater autoritativ dokumentasjon og fjern foreldet parallell dokumentasjon.
10. Kontroller diff, branch-synk, PR, reviews, tråder og CI.
11. Merge bare etter eksplisitt brukergodkjenning.

Standardkontroll:

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
git diff --check
git status --short
git diff --stat
```

## Gjeldende leveranse

```text
fase: 13 – Logo og header
branch: feature/logo-header
GitHub-sak: #31 – Implement logo and header element
pull request: #32 – åpen, ikke draft
base: main på 9937e4fd785da9cbd171443ea4f1d93041a8b326
prosjektskjema: versjon 8
manuell funksjonstest: godkjent
automatisk kontroll etter siste produksjonsendring: bestått
kodeaudit og opprydding: gjennomført
merge: ikke godkjent
```

Implementert omfang:

- egen `HeaderEditorElement`
- lokal logoimport via eksisterende bildevalidering og ressurslager
- navn og valgfri undertittel
- felles Header-bakgrunn, tekstfarge, font og ramme
- full synlig sidebredde i PC- og Telefon-visning
- bare vertikal flytting
- høyde 70–100 px
- markering og sikker sletting
- ingen Header-låseknapp eller låsestatus
- reduceren avviser forsøk på å låse Header
- egenskapspanel som kan lukkes under transform og åpnes igjen fra objektverktøyet

## Siste verifiserte automatiske kontroll

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 113 moduler, 324 avhengigheter, ingen brudd
Vite: 122 moduler transformert
CSS: 36.54 kB, gzip 6.80 kB
JavaScript: 275.80 kB, gzip 81.65 kB
produksjonsbuild: bestått på 206 ms
working tree før kontroll: clean
```

Tallene er bekreftet av brukerens terminaloutput etter siste produksjonsendring på commit `8c7c7a0`.

Berørte filer i siste opprydding:

```text
HeaderCreationControl.tsx       224
EditorCanvasElement.tsx         223
RightPropertiesPanel.tsx        105
SidebarPanels.tsx                95
ElementSelectionToolbar.tsx      83
toggleElementLock.ts             40
```

Alle er under aktiv terskel på 250 linjer.

## Gjennomført avsluttende opprydding

- duplisert ressursopprydding er fjernet fra `EditorShell`
- `useElementDeletion` eier opprydding for både Bilde og Header
- elementoppretting kontrollerer aktiv side og ID-kollisjon før suksess rapporteres
- Header opprettes og lagres med normalisert horisontal geometri
- pekerberegninger er trukket ut av React-hooken
- Headerens pointer-preview normaliserer horisontalt delta til `x = 0`
- canvas-stiler er delt etter grunnlayout og interaksjon
- Header-låseknappen og låsestatusen er fjernet
- låsereduceren avviser Header
- eksisterende låsing for Seksjon, Bilde, Tekst og Knapp er bevart
- dobbelt panellukking etter Header-oppretting er fjernet
- logoressursen markeres som overført før lokal UI-opprydding
- alle kjente berørte produksjonsfiler er under 250 linjer
- tre fullt foreldede fasefiler er slettet
- issue #31 og PR #32 samsvarer med faktisk omfang

## Manuell regresjon

Brukeren har godkjent:

- Header i full bredde på PC og Telefon
- bare vertikal flytting og stabil pointer-preview
- høydegrensene 70 og 100 px
- panelåpning og panellukking under transform
- font, bakgrunn, tekstfarge og ramme
- logooppretting og ressursbevaring
- ingen låseknapp eller låsestatus for Header
- sikker sletting og delt asset-kontroll
- fortsatt fungerende låsing for andre elementtyper
- regresjon av Seksjon, Bilde, Tekst og Knapp

## Gjenstående før merge

- inspiser samlet PR-diff mot `main`
- kontroller mergebarhet, reviews, uløste tråder og CI
- merge bare etter eksplisitt brukergodkjenning

## Senere faser

```text
fase 14  korrigeringslinjer
fase 15  responsive mobiloverstyringer
fase 16  angre og gjør om
fase 17  lokal automatisk lagring
fase 18  åpne og importere prosjekt
fase 19  forhåndsvisning og publisering
```

Ingen senere fase startes automatisk.
