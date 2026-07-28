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
- lagring gir grønn og tekstlig bekreftelse
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

## 3. Gjeldende fase – Sikker sletting av elementer

```text
branch: feature/element-deletion
base main: f71b354
GitHub-sak: #15
sporing: docs/ELEMENT_DELETION.md
```

Plancommit:

```text
7269cb1 docs: define safe element deletion
```

Produksjonskode er ikke implementert ennå. PR er ikke opprettet.

### Mål

Gjør det mulig å slette ett markert element på en sikker måte:

- Seksjon
- Bilde
- Tekst
- Knapp

### Fast plassering

Sletteknappen ligger i høyremenyens `Element`-seksjon rett under statusboksen.

```text
Element

Status: Ulåst

Slett seksjon / Slett bilde / Slett tekstboks / Slett knapp
```

Regler:

- samme bredde som statusboksen
- vanlig dokumentflyt, ikke festet nederst
- rød tekst og rød ramme
- deaktivert når elementet er låst
- krever ingen scrolling i dagens panel

### Bekreftelse

Sletting krever alltid dialog fordi angre/gjør om ikke finnes ennå.

```text
Slett tekstboksen?

Dette kan ikke angres.

Avbryt    Slett
```

Dialogen skal støtte tastatur, `Escape`, kontrollert fokus og ny validering mot siste state ved bekreftelse.

### Tastatur

`Delete` åpner samme dialog for markert element.

Global sletting skal ikke utløses under:

- tekstredigering
- input, textarea eller select
- button eller dialogkontroller
- contenteditable
- andre interaktive skjemaelementer

`Backspace` brukes ikke globalt i første leveranse.

### Modell og state

Prosjektskjemaet forblir versjon 4.

Forventet handling:

```text
delete-element-from-active-page { elementId, updatedAt }
```

Reducergrensen avviser:

- manglende aktiv side
- manglende element
- element på feil side
- låst element
- utdatert eller no-op handling

Ved gyldig sletting:

- bare målelementet fjernes
- `project.updatedAt` oppdateres
- `selectedElementId` settes til `null`
- høyremenyen lukkes gjennom eksisterende selection-avledning

Elementmodellen er flat. Sletting av Seksjon fjerner bare selve seksjonen; andre elementer blir stående.

### Arkitektur

Forventet ansvarsdeling:

```text
state       -> egen reducerhjelper
state       -> egen dispatch-hook
properties  -> liten sletteseksjon
 dialog      -> avgrenset bekreftelsesdialog
keyboard    -> global Delete-grense
```

`EditorCanvasElement.tsx` skal ikke få sletteansvaret.

Alle nye kildefiler skal være under 250 linjer.

### Ikke del av fasen

- angre/gjør om
- papirkurv eller gjenoppretting
- multisletting
- dra til papirkurv
- sletting av side eller prosjekt
- automatisk sletting av visuelt overlappende elementer
- foreldre-/barnemodell for Seksjon
- duplisering
- historikk eller lagring
- bildeimport
- knappbibliotek
- farger
- forhåndsvisning eller publisering

### Kontroll før PR

- alle fire elementtyper viser riktig knapp
- låst element kan ikke slettes
- klikk og `Delete` åpner samme dialog
- tekst- og skjemaredigering forstyrres ikke
- avbrytelse muterer ikke prosjektet
- bekreftet sletting fjerner bare målelementet
- markering nullstilles og høyremenyen lukkes
- ugyldige handlinger avvises i reduceren
- `updatedAt` endres bare ved faktisk sletting
- eksisterende funksjoner fungerer som før
- `npm run check` består
- arkitekturrapportene regenereres
- PC, Telefon, peker og tastatur kontrolleres
- all relevant dokumentasjon oppdateres
- working tree er clean

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
