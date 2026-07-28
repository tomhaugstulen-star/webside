# Arbeidsplan for Website-editoren

Dette dokumentet fastsetter utviklingsrekkefølge og kontrollkrav. Det utvikles aldri direkte på `main`.

## 1. Fast arbeidsflyt

For hver avgrensede del:

1. Kontroller riktig branch og rent arbeidsområde.
2. Oppdater og kontroller `main`.
3. Opprett eller fast-forward en avgrenset feature-branch.
4. Definer omfang, brukerhandlinger, state og grenser mot senere funksjoner.
5. Lås åpne produkt- og designvalg før produksjonskode.
6. Implementer bare avtalt omfang.
7. Trekk ut ansvar før en kildefil passerer 250 linjer.
8. Gjennomfør framtidsrettet kodeaudit.
9. Kjør `npm run check` etter siste produksjonskodeendring.
10. Regenerer arkitekturrapporter ved strukturendringer.
11. Test PC, Telefon, peker og tastatur der det er relevant.
12. Oppdater all relevant dokumentasjon, ikke bare funksjonsspesifikasjonen.
13. Kontroller synkronisert branch og clean tree.
14. Opprett PR og kontroller hele diffen, mergebarhet, review-tråder og eventuell CI.
15. Merge bare etter eksplisitt brukergodkjenning.
16. Oppdater lokal `main` og kontroller clean tree før neste fase.

## 2. Ferdig og merget til `main`

### Fase 0 – Stabilt editorgrunnlag

- blankt PC- og Telefon-lerret
- toppmeny og kontrollert venstremeny
- Dependency Cruiser og samlet `npm run check`
- automatisk nettleseråpning

### Fase 1 – Prosjekt- og elementmodell

Branch: `feature/element-model`

- prosjekt, sider og elementer
- skjemaversjon, stabile ID-er og tidsstempler
- responsive verdier for posisjon, størrelse og synlighet
- låsestatus
- sentral prosjekt-state og aktiv side

### Fase 2 – Markering

Branch: `feature/element-selection`

- transient `selectedElementId`
- peker- og tastaturmarkering
- klikk på tomt lerret fjerner markering

### Fase 3 – Opprette elementer

Branch: `feature/element-creation`

- Seksjon, Bilde, Tekst og Knapp
- sikre ID-er og `updatedAt`
- kontrollerte standardstørrelser og første ledige startplass
- automatisk markering
- avledet lerretshøyde

### Fase 4 – Flytting og størrelsesendring

Branch: `feature/drag-resize`

Status: merget som PR #4.

### Fase 5 – Objektlåsing

Branch: `feature/object-locking`

Status: merget som PR #5 med merge-commit `a3eed45`.

### Fase 6 – Ren tekstredigering

Branch: `feature/text-box-editing`

Status: merget som PR #7 med merge-commit `c729d33`.

- prosjektskjema versjon 2
- `content` bare for tekstobjekter
- kontrollert flerlinjet `textarea`
- blur, submit og cancel med eksplisitte grenser
- låst tekst kan ikke redigeres

### Menynavn og rekkefølge

Branch: `feature/left-menu-labels`

Status: merget som PR #8 med merge-commit `a35f59d`.

### Fase 7 – Høyremenyens grunnstruktur

Branch: `feature/right-properties-panel`

Status: merget som PR #9 med merge-commit `8de5f2e`.

- valgt element åpner panelet
- 320 px dokket panel fra 1680 px
- overlay under 1680 px
- egen vertikal scrolling
- 180 ms transform-animasjon
- `prefers-reduced-motion` respekteres

Se `docs/RIGHT_PROPERTIES_PANEL.md`.

### Fase 8 – Tekstegenskaper

Branch: `feature/text-properties`

Status: merget som PR #11 med merge-commit `452b491`.

- prosjektskjema versjon 3
- obligatorisk `textStyle` bare for tekstelementer
- font, størrelse, fet, kursiv, justering og linjehøyde
- formatering gjelder hele tekstboksen
- låste tekstbokser kan inspiseres, men ikke endres
- tekstinnhold redigeres fortsatt bare på lerretet

Se `docs/TEXT_PROPERTIES.md`.

## 3. Gjeldende mellomfase – frittstående elementlenker

```text
branch: feature/element-links
base main: 452b491
PR: #14 Add standalone links for text elements
sporing: docs/ELEMENT_LINKS.md og GitHub-sak #13
```

Denne fasen er bevisst frittstående. Den bygger en gjenbrukbar lenkemodell uten å blande inn knappbibliotek, knappdesign, riktekst, forhåndsvisning eller publisering.

### Implementert

For en markert vanlig tekstboks viser høyremenyen:

```text
Lenke
Type: Ingen / Ekstern lenke
Nettadresse
Åpne i ny fane
Lag lenke / Lagre lenke / Fjern lenke
```

Regler:

- hele tekstboksen får lenken
- bare absolutte `http://`- og `https://`-adresser godtas
- ugyldig URL muterer ikke prosjektet
- `openInNewTab` lagres eksplisitt
- låste tekstbokser kan inspiseres, men kontrollene er deaktivert
- lagring gir grønn og tekstlig bekreftelse
- lenken åpnes aldri i editormodus
- markerte enkeltord får ikke egne lenker

### Modell og state

- prosjektskjema versjon 4 på branchen
- bare `kind: 'text'` får obligatorisk `link` i første leveranse
- lenkemodell: `none` eller `external-url { url, openInNewTab }`
- runtime-validatoren tåler utypede data og ukjente nøkler
- validatorregisteret er uttømmende ved framtidige lenketyper
- reduceren avviser manglende, låste, ugyldige og uendrede overganger
- `updatedAt` endres bare ved reell prosjektendring
- inputdraft, feil- og lagringsmelding er transient UI-state
- editorens DOM inneholder ikke et aktivt anker

### Arkitektur

Nye ansvar er isolert i:

```text
src/model/elementLink.ts
src/state/setTextElementLink.ts
src/state/useTextElementLink.ts
src/components/properties/ElementLinkPropertiesSection.tsx
src/styles/element-link-properties.css
```

`EditorCanvasElement.tsx` er ikke endret i denne fasen og skal fortsatt ikke få flere nye ansvarsområder.

### Verifisert kontroll

Brukeren har bekreftet:

```text
gyldig lenke lagres
gjeldende URL vises igjen etter nytt valg
lagreknappen gir grønn bekreftelse
ugyldig URL avvises
lenken åpnes ikke i editoren
låste elementer har deaktiverte lenkekontroller
```

Siste verifiserte kontroll etter produksjonskoden:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 48 moduler, 109 avhengigheter, ingen brudd
produksjonsbuild: bestått
Vite: 58 moduler transformert
arkitekturrapporter: regenerert
working tree: clean før dokumentasjonsrevisjonen
```

PR #14 er åpen og mergebar. Den skal ikke merges uten eksplisitt godkjenning.

## 4. Senere faser

### Fase 9 – Knappbibliotek

Foreløpig branch: `feature/button-library`

Produktretning:

- ferdigdesignede knapper lages i Canva eller Figma
- eksport som SVG eller PNG
- `Elementer -> Knapp` åpner et internt knappbibliotek
- brukeren kan legge til flere knappfiler etter behov
- valgt knapp settes inn på lerretet
- samme lenkemodell gjenbrukes på knappen
- grafiske knapper får et tilgjengelig navn
- ingen aktiv navigasjon i editormodus

Avklar før implementering:

- hvor knappfilene skal ligge i prosjektet
- om første versjon bare leser statiske filer eller skal kunne skrive til lokal mappe
- SVG kontra PNG som anbefalt format
- minimumsmetadata for hver knapp

Den parkerte `feature/button-element`-branchen skal ikke merges. GitHub-sak #12 er lukket som `not_planned`.

### Fase 10 – Bilder

Branch: `feature/image-import-and-placement`

- bildevelger
- lokale bildefiler
- selvstendig bildeobjekt
- fri plassering og størrelse

### Fase 11 – Farger

Branch: `feature/project-colors`

- register over faktiske prosjektfarger
- global endring
- oppdatering av alle brukere av en farge
- tekstfarge kobles hit

### Fase 12 – Logo og header

Branch: `feature/logo-header`

- logo
- header
- hovedtekst og undertittel
- redigerbar struktur
- headertekst er ikke en vanlig fri tekstboks

### Fase 13 – Korrigeringslinjer

Branch: `feature/alignment-guides`

- horisontal midtstilling
- samme linje og lik avstand
- bare under flytting eller resizing

### Fase 14 – Responsiv redigering

Branch: `feature/mobile-design-controls`

- desktop er grunnlaget
- mobil arver desktop som standard
- eksplisitte mobiloverstyringer for posisjon, størrelse og synlighet
- **Bruk PC-oppsett** fjerner mobiloverstyringen

### Fase 15 – Angre og gjør om

Branch: `feature/history-system`

- én historikkpost per avsluttet brukerhandling
- transient markering, draft, panelstate og preview holdes utenfor

### Fase 16 – Lokal automatisk lagring

Branch: `feature/local-project-autosave`

- prosjektmappe og lokale bilder
- sikker automatisk lagring og gjenoppretting

### Fase 17 – Åpne og importere prosjekt

Branch: `feature/project-open-import`

- validere prosjektfil
- migrere eldre skjemaversjoner
- laste prosjektdata og bilder
- håndtere feil

### Fase 18 – Forhåndsvisning og publisering

Branches:

```text
feature/preview-mode
feature/publishing
```

- tolke semantiske lenkedata som aktive ankere
- holde navigasjon deaktivert i editormodus
- publisere gyldig og tilgjengelig nettside

## 5. Faste tekniske grenser

- 250 linjer er aktiv terskel for ansvarstrekk i kildefiler.
- 300 linjer er hard unntaksgrense.
- Canvas-komponenten skal ikke samle nye funksjonsansvar.
- Varige prosjektdata endres bare gjennom validerte reducerhandlinger.
- Transient markering, drafts, fokus, hover og statusmeldinger serialiseres ikke.
- Ingen feature-branch merges uten eksplisitt brukergodkjenning.
