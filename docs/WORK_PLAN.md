# Arbeidsplan for Website-editoren

Dette dokumentet fastsetter utviklingsrekkefølge og kontrollkrav. Det utvikles aldri direkte på `main`.

## 1. Fast arbeidsflyt

For hver avgrensede del:

1. Kontroller riktig branch og rent arbeidsområde.
2. Oppdater og kontroller `main`.
3. Opprett én avgrenset feature- eller docs-branch.
4. Definer omfang, brukerhandlinger, varig state og transient state.
5. Lås produkt- og designvalg før produksjonskode.
6. Implementer bare avtalt omfang.
7. Trekk ut ansvar før en kildefil passerer 250 linjer.
8. Gjennomfør framtidsrettet audit.
9. Kjør automatiske kontroller etter siste produksjonsendring.
10. Regenerer arkitekturrapporter ved strukturendringer.
11. Test PC, Telefon, peker og tastatur der det er relevant.
12. Oppdater relevant dokumentasjon.
13. Kontroller synkronisert branch og clean tree.
14. Opprett PR og kontroller diff, mergebarhet, review-tråder og eventuell CI.
15. Merge bare etter eksplisitt brukergodkjenning.
16. Oppdater lokal `main` og kontroller clean tree før neste fase.

Produksjonsbrancher bruker normalt:

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
git diff --check
```

## 2. Gjeldende status

```text
main: 5e548ad
fase 10: første bundlede SVG-knappbibliotek – fullført
GitHub-sak #20: lukket som fullført
PR #21: merget
prosjektskjema: versjon 5
neste produksjonsfase: ikke valgt
```

Sluttverifisering:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 69 moduler, 161 avhengigheter, ingen brudd
Vite: 78 moduler transformert
produksjonsbuild: bestått
arkitekturrapport: 0 brudd, 0 feil, 0 advarsler
PC- og Telefon-test: godkjent
```

## 3. Fase 10 – ferdig og merget

Leveransen omfatter:

- skjemaversjon 5
- stabil `assetId`, `label` og `link` for knapper
- fire statisk bundlede SVG-design
- `Elementer -> Knapp` som internt designbibliotek
- knappetekst, design og ekstern lenke i høyremenyen
- kontrollert fallback for ukjent lagret asset-ID
- låste knapper kan inspiseres, men ikke endres
- opprettingsansvar trukket ut av sentral reducer før merge
- oppdaterte arkitekturrapporter og dokumentasjon

Se `docs/BUTTON_LIBRARY.md`.

## 4. Ferdig og merget til `main`

- fase 0: stabilt editorgrunnlag
- fase 1: prosjekt- og elementmodell
- fase 2: markering
- fase 3: elementoppretting
- fase 4: flytting og resizing – PR #4
- fase 5: objektlåsing – PR #5
- fase 6: ren tekstredigering – PR #7
- menynavn og rekkefølge – PR #8
- fase 7: høyremenyens grunnstruktur – PR #9
- fase 8: tekstegenskaper – PR #11
- elementlenker – PR #14
- fase 9: sikker sletting – PR #16
- dokumentasjonsaudit – PR #19
- fase 10: SVG-knappbibliotek – PR #21, mergecommit `5e548ad`

## 5. Senere faser

### Fase 11 – Bilder

Branch: `feature/image-import-and-placement`

- bildevelger
- lokale bildefiler
- selvstendig bildeobjekt
- fri plassering og størrelse

### Fase 12 – Farger

Branch: `feature/project-colors`

- register over faktiske prosjektfarger
- global endring
- tekstfarge og senere knappfarger kobles hit

### Fase 13 – Logo og header

Branch: `feature/logo-header`

- logo
- hovedtekst og undertittel
- redigerbar headerstruktur

### Fase 14 – Korrigeringslinjer

Branch: `feature/alignment-guides`

- horisontal midtstilling
- samme linje og lik avstand
- bare under flytting eller resizing

### Fase 15 – Responsiv redigering

Branch: `feature/mobile-design-controls`

- desktop er grunnlaget
- mobil arver desktop som standard
- eksplisitte mobiloverstyringer

### Fase 16 – Angre og gjør om

Branch: `feature/history-system`

### Fase 17 – Lokal automatisk lagring

Branch: `feature/local-project-autosave`

### Fase 18 – Åpne og importere prosjekt

Branch: `feature/project-open-import`

### Fase 19 – Forhåndsvisning og publisering

```text
feature/preview-mode
feature/publishing
```

## 6. Faste tekniske grenser

- 250 linjer er aktiv terskel for ansvarstrekk i kildefiler.
- 300 linjer er hard unntaksgrense.
- Canvas-komponenten skal ikke samle nye funksjonsansvar.
- Varige prosjektdata endres bare gjennom validerte reducerhandlinger.
- Ugyldige og uendrede handlinger skal returnere samme state.
- Transient markering, drafts, dialogstate, fokus, hover og feedback serialiseres ikke.
- Ingen branch merges uten eksplisitt brukergodkjenning.
