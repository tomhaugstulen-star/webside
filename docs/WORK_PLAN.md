# Arbeidsplan

Dette dokumentet beskriver gjeldende leveranse og den faste kontrollrekkefÃ¸lgen.

## Fast arbeidsflyt

1. Kontroller branch, `origin/main` og clean tree.
2. LÃ¥s produkt- og modellomfang fÃ¸r produksjonskode.
3. Implementer bare avtalt omfang pÃ¥ egen branch.
4. Hold kildefiler under aktiv terskel pÃ¥ 250 linjer.
5. GjennomfÃ¸r framtidsrettet kodeaudit.
6. KjÃ¸r full automatisk kontroll etter siste produksjonsendring.
7. Test relevant funksjonalitet manuelt pÃ¥ PC og Telefon.
8. Regenerer arkitekturrapporter ved struktur- eller avhengighetsendringer.
9. Oppdater autoritativ dokumentasjon og fjern foreldet parallell dokumentasjon.
10. Kontroller diff, branch-synk, PR, reviews, trÃ¥der og CI.
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
fase: 13 â€“ Logo og header
branch: feature/logo-header
GitHub-sak: #31 â€“ Implement logo and header element
base: main pÃ¥ 9937e4fd785da9cbd171443ea4f1d93041a8b326
prosjektskjema: versjon 8
manuell funksjonstest: gjenstÃ¥r
kodeaudit og opprydding: gjennomfÃ¸rt
PR: ikke opprettet
merge: ikke godkjent
```

Implementert omfang:

- egen `HeaderEditorElement`
- lokal logoimport via eksisterende bildevalidering og ressurslager
- navn og valgfri undertittel
- felles Header-bakgrunn, tekstfarge, font og ramme
- full synlig sidebredde i PC- og Telefon-visning
- bare vertikal flytting
- hÃ¸yde 70â€“100 px
- lÃ¥sing, markering og sikker sletting
- egenskapspanel som kan lukkes under transform og Ã¥pnes igjen fra objektverktÃ¸yet

## Siste verifiserte automatiske kontroll

```text
ESLint: bestÃ¥tt
TypeScript: bestÃ¥tt
Dependency Cruiser: 113 moduler, 324 avhengigheter, ingen brudd
Vite: 122 moduler transformert
CSS: 36.54 kB, gzip 6.80 kB
JavaScript: 275.77 kB, gzip 81.66 kB
produksjonsbuild: bestÃ¥tt pÃ¥ 192 ms
git diff --check: ingen whitespace-feil
arkitekturrapporter: regenerert etter siste produksjonsendring
```

Tallene er bekreftet av brukerens terminaloutput etter siste produksjonsendring.

## GjennomfÃ¸rt avsluttende opprydding

- duplisert ressursopprydding er fjernet fra `EditorShell`
- `useElementDeletion` eier opprydding for bÃ¥de Bilde og Header
- elementoppretting kontrollerer aktiv side og ID-kollisjon fÃ¸r suksess rapporteres
- Header opprettes og lagres med normalisert horisontal geometri
- pekerberegninger er trukket ut av React-hooken
- Headerens pointer-preview normaliserer horisontalt delta til `x = 0`
- canvas-stiler er delt etter grunnlayout og interaksjon
- alle kjente berÃ¸rte produksjonsfiler er under 250 linjer
- tre fullt foreldede fasefiler er slettet
- issue #31 er synkronisert med faktisk omfang

## GjenstÃ¥ende fÃ¸r PR

- kontroller foreldede dokumentreferanser og foreldede breddekontrakter
- gjennomfÃ¸r full manuell regresjonstest pÃ¥ PC og Telefon
- kontroller berÃ¸rte produksjonsfilstÃ¸rrelser og samlet diff mot `main`
- stage, commit og push kode, dokumentasjon og arkitekturrapporter
- opprett og inspiser PR

## Senere faser

```text
fase 14  korrigeringslinjer
fase 15  responsive mobiloverstyringer
fase 16  angre og gjÃ¸r om
fase 17  lokal automatisk lagring
fase 18  Ã¥pne og importere prosjekt
fase 19  forhÃ¥ndsvisning og publisering
```

Ingen senere fase startes automatisk.
