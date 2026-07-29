# Arbeidsplan for Website-editoren

Dette dokumentet fastsetter utviklingsrekkefølge og kontrollkrav. Det utvikles aldri direkte på `main`.

## 1. Fast arbeidsflyt

For hver avgrensede del:

1. Kontroller riktig branch og rent arbeidsområde.
2. Oppdater og kontroller `main`.
3. Opprett eller bruk én avgrenset feature- eller docs-branch.
4. Definer omfang, brukerhandlinger, varig state og transient state.
5. Lås produkt- og designvalg før produksjonskode.
6. Implementer bare avtalt omfang.
7. Trekk ut ansvar før en kildefil passerer 250 linjer.
8. Gjennomfør framtidsrettet audit.
9. Kjør relevante automatiske kontroller etter siste produksjonsendring.
10. Regenerer arkitekturrapporter ved strukturendringer.
11. Test PC, Telefon, peker og tastatur der det er relevant.
12. Oppdater all relevant dokumentasjon.
13. Kontroller synkronisert branch og clean tree.
14. Opprett PR og kontroller hele diffen, mergebarhet og review-tråder.
15. Merge bare etter eksplisitt brukergodkjenning.
16. Oppdater lokal `main` og kontroller clean tree før neste fase.

Produksjonsbrancher bruker normalt:

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
git diff --check
```

## 2. Gjeldende produksjonsfase

```text
fase: 10 – første bundlede SVG-knappbibliotek
GitHub-sak: #20 Build first bundled SVG button library
branch: feature/button-library
base main: 06307a2
prosjektskjema på branchen: versjon 5
PR: ikke opprettet ennå
```

Produksjonscommits:

```text
a8017d4  feat: add button element model
7fe89f2  feat: add bundled button assets
1b80890  feat: add button design library
ec30b9a  feat: add button property controls
```

Dokumentasjon:

```text
829b961  docs: document button library phase
```

Status:

- modell og skjemaversjon 5 er implementert
- fire SVG-assets er bundlet og katalogført
- `Elementer -> Knapp` åpner et internt bibliotek
- valgt design oppretter og markerer knappen
- høyremenyen redigerer knappetekst, design og ekstern lenke
- låst knapp kan inspiseres, men ikke endres
- ukjent asset-ID gir kontrollert fallback og varsel
- automatiske produksjonskontroller er godkjent
- manuell akseptansetest er godkjent på PC og Telefon

Gjenstår før PR:

- regenerere `architecture.json`
- regenerere `docs/dependency-graph.mmd`
- kontrollere hele branchdiffen og filgrensene
- kjøre `git diff --check`
- bekrefte clean og synkronisert branch
- opprette PR mot `main`

## 3. Knappbibliotekets låste omfang

Brukerflyt:

```text
Elementer -> Knapp -> velg design -> knapp opprettes og markeres
```

Fast ansvarsdeling:

```text
Venstremeny = velge design og opprette knapp
Høyremeny  = endre knappetekst, design og lenke
Lerretet   = markere, flytte og endre størrelse
```

Første asset-ID-er:

```text
button.primary-rounded.v1
button.secondary-rounded.v1
button.outline-rounded.v1
button.dark-rounded.v1
```

Krav:

- bare SVG i første leveranse
- statisk bundling gjennom Vite
- stabil `assetId` i prosjektdata
- ingen filsti, import-URL eller rå SVG i prosjektet
- dekorativ SVG uten innebygd tekst
- ekte HTML-tekst som synlig etikett og tilgjengelig navn
- fri bredde- og høydeskalering
- ekstern lenke aktiveres aldri i editormodus
- tom eller whitespace-only knappetekst avvises
- ukjent asset-ID avvises ved nye brukerendringer
- ugyldige og uendrede actions endrer ikke `updatedAt`

Utenfor omfanget:

- PNG
- opplasting eller import av egne knappfiler
- dynamisk eller skrivbar katalog
- Canva- eller Figma-integrasjon
- prosjektfarger eller SVG-fargeredigering
- riktekst
- hover-, pressed- og disabled-varianter
- intern sidenavigasjon
- forhåndsvisning eller publisering
- historikk og autolagring
- egne mobiloverstyringer
- separat venstremenypunkt kalt `Knapper`

Se `docs/BUTTON_LIBRARY.md`.

## 4. Ferdig og merget til `main`

### Fase 0 – Stabilt editorgrunnlag

- blankt PC- og Telefon-lerret
- toppmeny og kontrollert venstremeny
- Dependency Cruiser og samlet `npm run check`
- automatisk nettleseråpning

### Fase 1 – Prosjekt- og elementmodell

- prosjekt, sider og elementer
- skjemaversjon, stabile ID-er og tidsstempler
- responsive verdier for posisjon, størrelse og synlighet
- sentral prosjekt-state og aktiv side

### Fase 2 – Markering

- transient `selectedElementId`
- peker- og tastaturmarkering
- klikk på tomt lerret fjerner markering

### Fase 3 – Opprette elementer

- Seksjon, Bilde, Tekst og grunnleggende Knapp
- sikre ID-er og `updatedAt`
- kontrollerte standardstørrelser og startplassering
- automatisk markering

### Fase 4 – Flytting og størrelsesendring

Status: merget som PR #4.

### Fase 5 – Objektlåsing

Status: merget som PR #5 med mergecommit `a3eed45`.

### Fase 6 – Ren tekstredigering

Status: merget som PR #7 med mergecommit `c729d33`.

### Menynavn og rekkefølge

Status: merget som PR #8 med mergecommit `a35f59d`.

Gjeldende venstremeny:

```text
Prosjekt
Farger
Logo og header
Elementer
Innstillinger
```

### Fase 7 – Høyremenyens grunnstruktur

Status: merget som PR #9 med mergecommit `8de5f2e`.

### Fase 8 – Tekstegenskaper

Status: merget som PR #11 med mergecommit `452b491`.

### Mellomfase – Frittstående elementlenker

Status: merget som PR #14 med mergecommit `f71b354`.

### Fase 9 – Sikker sletting av elementer

Status: merget som PR #16 med mergecommit `b428cac`.

### Dokumentasjonsaudit

Status: merget som PR #19 med mergecommit `06307a2`.

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

- én historikkpost per avsluttet brukerhandling
- transient state holdes utenfor

### Fase 17 – Lokal automatisk lagring

Branch: `feature/local-project-autosave`

### Fase 18 – Åpne og importere prosjekt

Branch: `feature/project-open-import`

### Fase 19 – Forhåndsvisning og publisering

```text
feature/preview-mode
feature/publishing
```

- tolke semantiske lenkedata som aktive ankere
- holde navigasjon deaktivert i editormodus
- publisere gyldig og tilgjengelig nettside

## 6. Faste tekniske grenser

- 250 linjer er aktiv terskel for ansvarstrekk i kildefiler.
- 300 linjer er hard unntaksgrense.
- Canvas-komponenten skal ikke samle nye funksjonsansvar.
- Varige prosjektdata endres bare gjennom validerte reducerhandlinger.
- Ugyldige og uendrede handlinger skal returnere samme state.
- Transient markering, drafts, dialogstate, fokus, hover og feedback serialiseres ikke.
- Ingen branch merges uten eksplisitt brukergodkjenning.
