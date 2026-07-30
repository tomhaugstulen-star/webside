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
base: main på 9937e4fd785da9cbd171443ea4f1d93041a8b326
prosjektskjema: versjon 8
manuell funksjonstest: godkjent
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
- høyde 70–100 px
- låsing, markering og sikker sletting
- egenskapspanel som kan lukkes under transform og åpnes igjen fra objektverktøyet

## Siste verifiserte kontroll før sluttaudit

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 112 moduler, 320 avhengigheter, ingen brudd
Vite: 121 moduler transformert
CSS: 36.54 kB, gzip 6.80 kB
JavaScript: 275.62 kB, gzip 81.63 kB
produksjonsbuild: bestått på 194 ms
git diff --check: ingen whitespace-feil
arkitekturrapporter: regenerert og committet i 1587d76
```

Disse tallene gjelder før den avsluttende kodeoppryddingen. Ny produksjonsendring krever ny komplett kontroll.

## Gjenstående før PR

- fjerne duplisert ressursopprydding ved sletting
- normalisere Headerens lagrede horisontale geometri
- dele filer som ligger på 250-linjersgrensen etter reelt ansvar
- ferdigstille kodeaudit og dokumentasjon
- regenerere arkitekturrapporter etter oppryddingen
- kjøre ny komplett kontroll
- kontrollere filstørrelser og samlet diff
- opprette og inspisere PR

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
