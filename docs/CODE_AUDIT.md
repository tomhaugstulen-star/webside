# Kodeaudit og tekniske grenser

Dette dokumentet samler den historiske grunnlagsauditen og den framtidsrettede kontrollen som ble gjennomført før PR #21.

## Historisk grunnlagsaudit

Editorgrunnlaget ble ryddet i `chore/editor-foundation-audit`.

Viktige rettelser:

- ubrukt kode ble fjernet
- Dependency Cruiser fikk `no-unreachable-from-main`
- intern terminologi ble standardisert til `Elementer`
- editoren åpner med blankt lerret
- `npm run dev` bruker `vite --open`
- venstremeny, ikoner og panelinnhold fikk separate ansvar

Historiske modul- og avhengighetstall fra grunnlagsfasen er ikke gjeldende etter senere funksjonsutvidelser.

## Bekreftet arkitekturretning

- `App.tsx` setter sammen applikasjonen
- `EditorShell` eier skalltilstand og komposisjon
- sentral prosjekt-state eier varig prosjektdata
- reducer-/state-laget er autoritativ valideringsgrense
- høyremenyen eier ingen separat elementmodell
- lerretet skal ikke få tilfeldig egenskaps- eller kataloglogikk
- responsive prosjektverdier lagres i prosjektmodellen, ikke i DOM-en
- automatisk lagring bygges etter prosjektmodell og historikkmodell

## Faste filgrenser

- 250 linjer er aktiv terskel for ansvarstrekk
- 300 linjer er hard unntaksgrense
- en fil deles tidligere når den får flere tydelige ansvar
- `EditorCanvasElement.tsx` er 247 linjer og skal ikke få flere nye funksjonsansvar
- `RightPropertiesPanel.tsx` skal være komposisjon
- tilfeldig generell `features`-samlemappe skal ikke innføres

## State- og reducergrenser

Reducerhandlinger skal avvise:

- manglende aktiv side
- manglende element
- element på feil side
- duplisert element-ID
- feil elementtype
- låst element
- ugyldig verdi
- ukjent knappasset-ID
- uendret data

Ved avvisning returneres samme state, prosjektet muteres ikke og `updatedAt` endres ikke.

Transient markering, pekerinteraksjon, layout-preview, åpne paneler, drafts, validering, feedback, fokus, hover og dialogstate serialiseres ikke.

## Knappbibliotekaudit

```text
GitHub-sak #20: fullført
PR #21: merget
mergecommit: 5e548ad
prosjektskjema: versjon 5
```

Kontrollert ansvarsdeling:

```text
model
  buttonAsset.ts
  editorProject.ts
  elementCreation.ts

assets/buttons
  fire SVG-filer
  buttonAssetCatalog.ts

state
  addElementToActivePage.ts
  setButtonLabel.ts
  setButtonAsset.ts
  setElementLink.ts

sidebar
  ElementsPanel.tsx
  ButtonLibraryPanel.tsx

properties
  ButtonPropertiesSection.tsx
  ElementLinkPropertiesSection.tsx

canvas
  ButtonElementContent.tsx
```

## Asset-audit

- prosjektet lagrer stabil `assetId`
- prosjektet lagrer ikke filsti, import-URL eller rå SVG
- modellaget importerer ikke SVG-filer
- katalogen eier mapping fra ID til bundlet fil og metadata
- publiserte ID-er er versjonerte
- ukjent lagret ID gir fallback, ikke krasj
- ukjent ny ID avvises ved brukerendring og i state-grensen

SVG-kontroll:

- gyldig `viewBox`
- ingen tekst
- ingen script eller `foreignObject`
- ingen eksterne URL-er eller filer
- ingen rasterbilder
- transparent bakgrunn
- fri bredde- og høydeskalering

## Knappetekst- og designaudit

- label er ekte HTML-tekst og tilgjengelig navn
- SVG-en er dekorativ
- inputdraft er transient
- teksten trimmes før lagring
- tom tekst avvises
- uendret tekst gir ingen mutasjon
- låst knapp kan ikke endres
- designvalget valideres mot katalogen
- ukjent lagret design kan repareres fra høyremenyen
- canvas-rendering bruker kontrollert fallback

## Lenke- og høyremenyaudit

- tekst og knapp bruker samme `ElementLink`
- bare `http://` og `https://` godtas
- ugyldig URL lagres ikke
- uendret lenke gir ingen mutasjon
- låst element kan ikke endre lenke
- lenker aktiveres aldri i editormodus
- `RightPropertiesPanel` komponerer etter `element.kind`
- tekst- og knappkontroller ligger i separate komponenter
- feil bruker `role="alert"`
- lagringsfeedback bruker `role="status"`

## Framtidsrettet refaktor før merge

Auditen fant at `editorProjectReducer.ts` hadde nådd 250 linjer. Elementoppretting ble derfor trukket ut til `addElementToActivePage.ts`.

Etter refaktoren:

```text
editorProjectReducer.ts: 217 linjer
addElementToActivePage.ts: 52 linjer
```

Valideringen for aktiv side, unik element-ID og gyldig knappasset ligger fortsatt innenfor state-/reducergrensen.

## Sluttkontroll for knappbibliotekfasen

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 69 moduler, 161 avhengigheter, ingen brudd
Vite: 78 moduler transformert
CSS: 24.43 kB, gzip 5.12 kB
JavaScript: 239.41 kB, gzip 72.88 kB
produksjonsbuild: bestått
arkitekturrapport: 0 brudd, 0 feil, 0 advarsler
```

Manuell kontroll ble godkjent for alle fire designvarianter, oppretting, markering, flytting, resizing, knappetekst, tomtekstvalidering, designbytte, ekstern lenke, låsing, sletting, PC, Telefon, peker og tastatur.

PR #21 var mergebar, hadde ingen review-tråder, ingen endringskrav og ingen ventende GitHub Actions-status. Merge ble utført med låst head-SHA.
