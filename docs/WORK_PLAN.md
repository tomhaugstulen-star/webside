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

## Aktiv leveranse

```text
fase: 14 – korrigeringslinjer og snapping
branch: feature/alignment-guides
base origin/main: ff39d8df7d59843c796616ad7d56cf00a41236f8
GitHub-sak: #34 – åpen
pull request: ikke opprettet
prosjektskjema: versjon 9
```

Implementert omfang:

- pekerflytting for Seksjon, Bilde, Tekst og Knapp
- venstre/midt/høyre og topp/midt/bunn mot andre synlige elementer
- horisontal og vertikal lerretsmidt
- 6 px snapgrense i lerretskoordinater
- uavhengig snapping per akse
- nærmeste treff per akse, med midtanker som lik-avstand-prioritet
- guider bare mens snap er aktiv
- låste elementer kan være mål
- skjulte elementer og aktivt element er ikke mål
- Seksjon og Header kan være mål
- mål og lerretsmål fryses ved pekerstart
- auto-scroll og eksisterende commit-/cancel-regler beholdes
- resize og tastatur snapping er ikke del av fasen

Header-regler etter produktavklaring:

- fast øverst ved `x = 0, y = 0`
- full aktiv lerretsbredde
- ingen peker- eller tastaturflytting
- høyde 70–100 px kan fortsatt endres
- fontfamilie og fontstørrelse 12–96 px
- navn og undertittel deler fontfamilie, fontstørrelsen styrer hierarkiet
- ingen låsing eller låsestatus

## Manuell status

Godkjent av brukeren:

- elementkant og elementmidt på begge akser
- horisontal og vertikal lerretsmidt
- samtidig snapping på begge akser
- Header fast øverst og full bredde
- Header-fontstørrelse og lagring

Ikke ferdig kontrollert:

- resterende målregresjon for låste/skjulte elementer
- alle elementtyper som aktive elementer
- pointercancel/tapt capture og auto-scroll
- bekreftelse av at resize og tastatur fortsatt ikke snapper
- clamp ved lerretsgrenser
- full filstørrelseskontroll etter siste auditrettelse
- siste `npm run check` etter auditrettelse og dokumentoppdatering

## Kodeaudit 30. juli 2026

Auditen gjennomgikk alle produksjonsfiler endret fra `main`, state- og modellgrensene de avhenger av, samt alle autoritative dokumenter.

Funnet avvik:

- Header ble rendret ved `y = 0`, men oppretting og enkelte avledede beregninger kunne fortsatt bruke en gammel lagret `y`.

Rettet i:

- `createEditorElement.ts`
- `setElementDesktopLayout.ts`
- `getAlignmentTargets.ts`
- `getCanvasContentHeight.ts`
- `findElementCreationPosition.ts`

Gjeldende invariant er at Header både opprettes, serialiseres, rendres og brukes i avledede beregninger ved `x = 0, y = 0`.

## Siste verifiserte automatiske kontroll

Brukerens siste terminaloutput før de fem auditrettelsene:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 118 moduler, 342 avhengigheter, ingen brudd
Vite: 127 moduler transformert
CSS: 36.85 kB, gzip 6.87 kB
JavaScript: 280.85 kB, gzip 83.22 kB
produksjonsbuild: bestått på 195 ms
```

Disse tallene er ikke sluttstatus for branch-head etter auditrettelsen. Full kontroll må kjøres på nytt.

## Arkitekturrapporter

`architecture.json` og `docs/dependency-graph.mmd` ble regenerert etter at alignment-modulene ble lagt til. Senere Header- og auditrettelser endret ingen modul- eller importkanter. Rapportene er derfor strukturelt aktuelle, men skal fortsatt kontrolleres sammen med siste branch-diff før PR.

## Roadmap etter aktiv leveranse

Eksisterende senere fasekandidater:

```text
fase 15  responsive mobiloverstyringer
fase 16  angre og gjør om
fase 17  lokal automatisk lagring
fase 18  åpne og importere prosjekt
fase 19  forhåndsvisning og publisering
```

Roadmapet gjennomgås på nytt etter at fase 14 er kontrollert. Ingen manglende leveranse, inkludert eventuell egen Hero-funksjon, legges inn eller prioriteres skjult under denne dokumentasjonsoppryddingen.
