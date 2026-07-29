# Arbeidsplan for Website-editoren

Dette dokumentet fastsetter utviklingsrekkefølge og kontrollkrav. Det utvikles aldri direkte på `main`.

## 1. Fast arbeidsflyt

For hver avgrensede del:

1. Kontroller riktig branch og rent arbeidsområde.
2. Oppdater og kontroller `main`.
3. Opprett en avgrenset feature-branch.
4. Definer omfang, brukerhandlinger, state og grenser mot senere funksjoner.
5. Lås produkt- og designvalg før produksjonskode.
6. Implementer bare avtalt omfang.
7. Trekk ut ansvar før en kildefil passerer 250 linjer.
8. Gjennomfør framtidsrettet kodeaudit.
9. Kjør `npm run check` etter siste produksjonskodeendring.
10. Regenerer arkitekturrapporter ved strukturendringer.
11. Test PC, Telefon, peker og tastatur der det er relevant.
12. Oppdater all relevant dokumentasjon.
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
- kontrollerte standardstørrelser og startplassering
- automatisk markering
- avledet lerretshøyde

### Fase 4 – Flytting og størrelsesendring

Branch: `feature/drag-resize`

Status: merget som PR #4.

### Fase 5 – Objektlåsing

Branch: `feature/object-locking`

Status: merget som PR #5 med mergecommit `a3eed45`.

### Fase 6 – Ren tekstredigering

Branch: `feature/text-box-editing`

Status: merget som PR #7 med mergecommit `c729d33`.

- prosjektskjema versjon 2
- `content` bare for tekstobjekter
- kontrollert flerlinjet `textarea`
- blur, submit og cancel med eksplisitte grenser
- låst tekst kan ikke redigeres

### Menynavn og rekkefølge

Branch: `feature/left-menu-labels`

Status: merget som PR #8 med mergecommit `a35f59d`.

### Fase 7 – Høyremenyens grunnstruktur

Branch: `feature/right-properties-panel`

Status: merget som PR #9 med mergecommit `8de5f2e`.

- valgt element åpner panelet
- 320 px dokket panel fra 1680 px
- overlay under 1680 px
- egen vertikal scrolling
- 180 ms transform-animasjon
- `prefers-reduced-motion` respekteres

Se `docs/RIGHT_PROPERTIES_PANEL.md`.

### Fase 8 – Tekstegenskaper

Branch: `feature/text-properties`

Status: merget som PR #11 med mergecommit `452b491`.

- prosjektskjema versjon 3
- obligatorisk `textStyle` bare for tekstelementer
- font, størrelse, fet, kursiv, justering og linjehøyde
- formatering gjelder hele tekstboksen
- låste tekstbokser kan inspiseres, men ikke endres

Se `docs/TEXT_PROPERTIES.md`.

### Mellomfase – Frittstående elementlenker

Branch: `feature/element-links`

Status: merget som PR #14 med mergecommit `f71b354`.

- prosjektskjema versjon 4
- hele tekstboksen kan få ekstern `http://`- eller `https://`-lenke
- `openInNewTab` lagres eksplisitt
- ugyldig URL muterer ikke prosjektet
- låste tekstbokser kan inspiseres, men ikke endres
- lenken aktiveres aldri i editormodus
- markerte enkeltord får ikke egne lenker
- gjenbrukbar lenkemodell for senere grafiske knapper

Verifisert før merge:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 48 moduler, 109 avhengigheter, ingen brudd
produksjonsbuild: bestått
Vite: 58 moduler transformert
```

Se `docs/ELEMENT_LINKS.md`.

### Fase 9 – Sikker sletting av elementer

Branch: `feature/element-deletion`

Status: merget som PR #16 med mergecommit `b428cac`. Sak #15 er lukket som fullført.

```text
produksjonscommit: 4f59b3e
framtidsrettede rettelser: a8c6d62 og 4611de1
arkitekturrapporter: fbd8091
```

Omfang:

- sletting av ett markert Seksjon-, Bilde-, Tekst- eller Knapp-element
- sletteknapp rett under statusboksen i høyremenyen
- alltid bekreftelsesdialog
- `Delete` åpner samme dialog
- låste elementer kan ikke slettes
- Delete blokkeres i tekst- og skjemaredigering
- bare målelementet fjernes
- urelatert markering bevares
- Seksjonssletting fjerner ikke visuelt overlappende elementer
- dialogens `Escape` påvirker ikke venstremenyens aktive panel
- prosjektskjemaet forblir versjon 4

Verifisert før merge:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 54 moduler, 120 avhengigheter, ingen brudd
produksjonsbuild: bestått
Vite: 64 moduler transformert
CSS: 20.13 kB, gzip 4.60 kB
JavaScript: 232.19 kB, gzip 71.23 kB
bygget på 225 ms
```

Alle manuelle akseptansetester ble godkjent. Se `docs/ELEMENT_DELETION.md`.

## 3. Gjeldende produksjonsstatus

Ingen ny produksjonsfase er valgt.

Før neste branch opprettes skal brukeren velge og godkjenne én avgrenset fase. Det skal ikke blandes inn funksjoner fra senere faser.

## 4. Senere faser

### Fase 10 – Knappbibliotek

Foreløpig branch: `feature/button-library`

- ferdigdesignede knapper lages i Canva eller Figma
- eksport som SVG eller PNG
- `Elementer -> Knapp` åpner internt bibliotek
- samme lenkemodell gjenbrukes
- grafiske knapper får tilgjengelig navn

Den parkerte `feature/button-element`-branchen skal ikke merges. Sak #12 er lukket som `not_planned`.

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
- tekstfarge kobles hit

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

## 5. Faste tekniske grenser

- 250 linjer er aktiv terskel for ansvarstrekk i kildefiler.
- 300 linjer er hard unntaksgrense.
- Canvas-komponenten skal ikke samle nye funksjonsansvar.
- Varige prosjektdata endres bare gjennom validerte reducerhandlinger.
- Transient markering, dialogstate, drafts, fokus, hover og statusmeldinger serialiseres ikke.
- Ingen feature-branch merges uten eksplisitt brukergodkjenning.
