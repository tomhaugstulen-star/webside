# Kodeaudit og tekniske grenser

Dette dokumentet samler den historiske grunnlagsauditen og den gjeldende framtidsrettede kontrollen for videre featurearbeid.

## 1. Historisk grunnlagsaudit

Editorgrunnlaget ble ryddet i:

```text
branch: chore/editor-foundation-audit
```

Auditen fjernet ubrukt kode, delte store CSS-filer, strammet Dependency Cruiser-reglene og fastsatte arkitekturretningen som senere faser følger.

Viktige historiske rettelser:

- ubrukt `InspectorRail.tsx` ble fjernet
- ubrukt `InspectorTool` ble fjernet
- Dependency Cruiser fikk `no-unreachable-from-main`
- intern terminologi ble standardisert til `Elementer`
- editoren åpner med et blankt lerret
- `npm run dev` bruker `vite --open`
- venstremeny, ikoner og panelinnhold fikk separate ansvar

Historiske modul- og avhengighetstall fra grunnlagsfasen er ikke gjeldende etter senere funksjonsutvidelser.

## 2. Bekreftet arkitekturretning

- `App.tsx` setter sammen applikasjonen
- `EditorShell` eier skalltilstand og komposisjon
- sentral prosjekt-state eier varig prosjektdata
- reduceren er autoritativ valideringsgrense
- verktøymeny, panelinnhold og ikoner er separert
- høyremenyen eier ingen separat elementmodell
- lerretet skal ikke få tilfeldig egenskaps- eller kataloglogikk
- responsive prosjektverdier lagres i prosjektmodellen, ikke i DOM-en
- automatisk lagring bygges etter prosjektmodell og historikkmodell

## 3. Faste filgrenser

- 250 linjer er aktiv terskel for ansvarstrekk i kildefiler
- 300 linjer er hard unntaksgrense
- en fil deles tidligere når den får flere tydelige ansvar
- `EditorCanvasElement.tsx` skal ikke få flere nye funksjonsansvar
- `RightPropertiesPanel.tsx` skal være komposisjon, ikke samle alle kontroller
- tilfeldig generell `features`-samlemappe skal ikke innføres

## 4. State- og reducergrenser

Varige prosjektendringer går gjennom typede actions.

Reducerhandlinger skal avvise:

- manglende aktiv side
- manglende element
- element på feil side
- feil elementtype
- låst element
- ugyldig verdi
- uendret data

Ved avvisning:

- samme state-objekt returneres
- prosjektet muteres ikke
- `updatedAt` endres ikke

Transient state serialiseres ikke:

- markering
- aktive pekerinteraksjoner
- layout-preview
- åpne paneler
- tekst- og skjemadrafts
- validering og feedback
- fokus og hover
- dialogmål og fokusreferanser

## 5. Gjeldende audit: knappbibliotek

Aktiv branch:

```text
feature/button-library
GitHub-sak #20
base main 06307a2
prosjektskjema 5
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
  oppretting
  setButtonLabel
  setButtonAsset
  setElementLink

sidebar
  ElementsPanel
  ButtonLibraryPanel

properties
  ButtonPropertiesSection
  ElementLinkPropertiesSection

canvas
  ButtonElementContent
```

## 6. Knappasset-audit

Kontrollpunkter:

- prosjektet lagrer stabil `assetId`
- prosjektet lagrer ikke filsti, import-URL eller rå SVG
- modellaget importerer ikke SVG-filer
- asset-katalogen eier mapping fra ID til bundlet fil og metadata
- publiserte ID-er er versjonerte
- ukjent lagret ID gir fallback, ikke krasj
- ukjent ny ID avvises ved brukerendring

SVG-kontroll:

- gyldig `viewBox`
- ingen tekst
- ingen script
- ingen `foreignObject`
- ingen eksterne URL-er eller filer
- ingen rasterbilder
- transparent bakgrunn
- fri bredde- og høydeskalering

## 7. Knappetekst-audit

- label er ekte HTML-tekst
- SVG-en er dekorativ
- label brukes som tilgjengelig navn
- inputdraft er transient
- teksten trimmes før lagring
- tom eller whitespace-only tekst avvises
- uendret tekst gir ingen mutasjon
- låst knapp kan ikke endres

## 8. Designbytte-audit

- designvelger bruker den statiske katalogen
- valgt ID valideres i reduceren
- ukjent ID avvises
- uendret design gir ingen mutasjon
- ukjent lagret design kan repareres fra høyremenyen
- canvas-rendering bruker kontrollert fallback

## 9. Lenkeaudit

- tekst og knapp bruker samme `ElementLink`
- state-API-et er generalisert uten duplisert skjema
- bare `http://` og `https://` godtas
- ugyldig URL lagres ikke
- uendret lenke gir ingen mutasjon
- låst element kan ikke endre lenke
- lenker aktiveres aldri i editormodus

## 10. Høyremenyaudit

- `RightPropertiesPanel` komponerer etter `element.kind`
- tekstkontroller og knappkontroller ligger i separate komponenter
- skjult panelinnhold rendres ikke uten valgt element
- kontrollene bruker labels og tastaturnative HTML-kontroller
- feil bruker `role="alert"`
- lagringsfeedback bruker `role="status"`
- låste elementer viser data, men muterende kontroller er deaktivert
- reduceren er fortsatt autoritativ dersom UI omgås

## 11. Automatiske kontroller

Etter siste produksjonscommit `ec30b9a`:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 68 moduler, 158 avhengigheter, ingen brudd
Vite: 77 moduler transformert
CSS: 24.43 kB, gzip 5.12 kB
JavaScript: 239.40 kB, gzip 72.88 kB
produksjonsbuild: bestått
```

Arkitekturrapportene skal regenereres etter siste strukturendring før PR.

## 12. Manuell kontroll

Godkjent:

- alle fire designvarianter
- oppretting og markering
- flytting og resizing
- knappetekst og tomtekstvalidering
- designbytte
- ekstern lenke og fjerning av lenke
- ingen lenkeaktivering i editormodus
- låsing og opplåsing
- sletting
- PC- og Telefon-visning
- peker- og tastaturflyt

## 13. Gjenstår før PR

- regenerere `architecture.json`
- regenerere `docs/dependency-graph.mmd`
- kontrollere genererte rapporter
- kontrollere alle kildefilers linjetall
- kontrollere full diff mot `main`
- kjøre `git diff --check`
- bekrefte clean og synkronisert branch
- opprette og gjennomgå PR
- merge bare etter eksplisitt godkjenning
