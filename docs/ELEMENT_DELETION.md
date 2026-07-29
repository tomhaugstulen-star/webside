# Sikker sletting av elementer

Dette dokumentet er autoritativ spesifikasjon og verifikasjonslogg for den avgrensede slettefasen.

```text
branch: feature/element-deletion
base main: f71b354
GitHub-sak: #15
produksjonscommit: 4f59b3e feat: add safe element deletion
PR: ikke opprettet
```

## Status

Slettefunksjonen er implementert, statisk auditert, kompilert og manuelt godkjent.

Gjenstår før PR:

1. regenerere `architecture.json`
2. regenerere `docs/dependency-graph.mmd`
3. kontrollere den endelige branch-diffen
4. bekrefte clean working tree
5. opprette og kontrollere PR

Det skal ikke merges uten eksplisitt brukergodkjenning.

## Omfang

Første leveranse gjelder ett markert element av typen:

- Seksjon
- Bilde
- Tekst
- Knapp

Følgende er ikke del av fasen:

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

Prosjektskjemaet forblir versjon 4.

## Plassering i høyremenyen

Slettehandlingen ligger i høyremenyens eksisterende `Element`-seksjon, rett under statusboksen.

```text
Element

Status: Ulåst

Slett seksjon
```

Etiketten følger elementtypen:

```text
Slett seksjon
Slett bilde
Slett tekstboks
Slett knapp
```

Knappen:

- ligger i vanlig dokumentflyt
- er ikke festet nederst i panelet
- har samme bredde som statusboksen
- krever ingen scrolling i dagens panel
- bruker rød tekst og rød ramme
- har hover-, focus-visible- og disabled-tilstand
- er deaktivert når elementet er låst
- viser en forklaring om at elementet må låses opp

## Bekreftelsesdialog

Sletting krever alltid eksplisitt bekreftelse fordi angre/gjør om ikke finnes ennå.

```text
Slett tekstboksen?

Dette kan ikke angres.

Avbryt    Slett
```

Dialogen:

- bruker riktig elementnavn
- bruker native modal `<dialog>`
- fokuserer `Avbryt` først
- støtter `Escape`
- lukker ved klikk på bakgrunnen
- returnerer fokus til utløseren ved avbrytelse når den fortsatt finnes
- muterer ikke prosjektet ved avbrytelse
- kontrollerer nyeste state før bekreftelse
- deaktiverer `Slett` dersom elementet er blitt låst eller fjernet
- lukker etter godkjent sletting

## Tastatur

`Delete` åpner den samme bekreftelsesdialogen for markert, ulåst element.

Global tastatursletting blokkeres når fokus er i eller på:

- `input`
- `textarea`
- `select`
- `button`
- aktiv lenke
- `dialog`
- `role="dialog"`
- `contenteditable`
- områder merket med `data-prevent-element-deletion-shortcut`

Ytterligere grenser:

- gjentatte keydown-hendelser ignoreres
- IME-komposisjon ignoreres
- modifikatortaster sammen med `Delete` ignoreres
- `Backspace` brukes ikke som global slettehandling
- Delete under tekstredigering sletter tekst, ikke elementet

## Elementmodell og Seksjon

Prosjektmodellen er flat:

```text
page.elements: EditorElement[]
```

En Seksjon eier derfor ikke elementer som ligger visuelt over den.

Sletting av Seksjon:

- fjerner bare seksjonselementet
- lar tekst, bilde, knapp og andre elementer bli stående
- bruker ikke geometrisk trefftesting
- innfører ikke foreldre-/barnemodell

## State og reducer

Prosjekthandlingen er:

```text
delete-element-from-active-page {
  elementId
  updatedAt
}
```

Reducergrensen avviser:

- manglende aktiv side
- manglende element
- element utenfor aktiv side
- låst element
- ugyldig eller utdatert mål
- no-op-overgang

Ved gyldig sletting:

- bare målelementet fjernes fra aktiv sides `elements`
- øvrige sider og elementer bevares
- `project.updatedAt` settes fra handlingen
- `selectedElementId` settes til `null` når målet var markert
- høyremenyen lukkes gjennom eksisterende selection-avledning

Dialogstate, mål-ID og fokusreferanse er transient editor-state og lagres ikke i prosjektet.

## Implementert arkitektur

Nye avgrensede ansvar:

```text
src/state/deleteElementFromActivePage.ts
src/state/useElementDeletion.ts
src/components/properties/DeleteElementSection.tsx
src/components/dialogs/ConfirmElementDeletionDialog.tsx
src/components/editor/isElementDeletionShortcutTarget.ts
src/components/editor/useElementDeletionShortcut.ts
src/styles/element-deletion.css
```

Integrasjon:

```text
src/state/editorProjectAction.ts
src/state/editorProjectReducer.ts
src/components/editor/EditorShell.tsx
src/components/properties/RightPropertiesPanel.tsx
src/components/canvas/canvasElementAccessibility.ts
src/App.css
```

`EditorCanvasElement.tsx` er urørt av sletteimplementasjonen.

Alle nye kildefiler er under aktiv 250-linjersgrense. Den største nye TSX-filen er 113 linjer.

## Verifisert kvalitetskontroll

Brukeren kjørte `npm run check` etter produksjonscommit `4f59b3e`.

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 54 moduler, 120 avhengigheter, ingen brudd
produksjonsbuild: bestått
Vite: 64 moduler transformert
CSS: 20.13 kB, gzip 4.60 kB
JavaScript: 232.13 kB, gzip 71.21 kB
bygget på 168 ms
```

Ingen GitHub Actions-run var knyttet til commiten. Den brukerbekreftede lokale kontrollen er derfor verifikasjonsgrunnlaget.

## Manuelt godkjent

Brukeren har godkjent:

- riktig sletteetikett for alle fire elementtyper
- riktig plassering rett under statusboksen
- avbrytelse uten mutasjon
- `Escape` uten mutasjon
- bekreftet sletting via høyremenyen
- høyremenyen lukkes etter sletting
- ingen andre elementer slettes
- `Delete` åpner samme dialog
- låst element viser deaktivert knapp
- `Delete` gjør ingenting på låst element
- `Delete` under tekstredigering påvirker bare teksten
- sletting av Seksjon lar visuelt overlappende elementer bli stående

## Akseptansestatus

Alle funksjonelle akseptansekriterier er oppfylt.

Følgende prosesskriterier gjenstår:

- arkitekturrapportene regenereres
- dokumentasjonsendringene hentes lokalt
- working tree bekreftes clean etter rapportene
- PR opprettes og kontrolleres
- merge skjer bare etter eksplisitt godkjenning
