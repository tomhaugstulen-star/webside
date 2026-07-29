# Sikker sletting av elementer

Dette dokumentet er autoritativ spesifikasjon og verifikasjonslogg for den avgrensede slettefasen.

```text
branch: feature/element-deletion
base main: f71b354
GitHub-sak: #15 – lukket som fullført
PR: #16 Add safe deletion for selected elements – merget
mergecommit: b428cac
produksjonscommit: 4f59b3e
framtidsrettede rettelser: a8c6d62 og 4611de1
arkitekturrapporter: fbd8091
```

## Status

Slettefunksjonen er implementert, framtidsauditert, kompilert, manuelt godkjent og merget til `main` gjennom PR #16.

Fasen endret ikke prosjektmodellen. Skjemaversjonen var 4 på fasens base og etter sletteleveransen. Gjeldende prosjektskjema er senere økt til versjon 5 av knappbibliotekfasen.

## Omfang

Leveransen gjelder ett markert element av typen:

- Seksjon
- Bilde
- Tekst
- Knapp

Følgende var ikke del av slettefasen:

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

Flere av disse funksjonene kan være implementert senere eller stå som planlagte faser. Listen beskriver bare den historiske slettebranchens omfang.

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
- bruker rød tekst og rød ramme
- har hover-, focus-visible- og disabled-tilstand
- er deaktivert når elementet er låst
- forklarer at låste elementer må låses opp

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
- isolerer `Escape` slik at et åpent verktøypanel ikke lukkes samtidig

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
- `Delete` under tekstredigering sletter tekst, ikke elementet

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
- `selectedElementId` settes til `null` bare når målet var markert
- en eventuell markering av et annet element bevares
- høyremenyen lukkes gjennom eksisterende selection-avledning når det markerte elementet slettes

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

`EditorCanvasElement.tsx` er urørt av sletteimplementasjonen. Alle nye kildefiler var under aktiv 250-linjersgrense.

## Framtidsrettet kodeaudit

Den avsluttende gjennomgangen fant og rettet to problemer før PR:

1. Sletting av et annet element enn det markerte nullstilte tidligere markeringen. Reduceren bevarer nå en urelatert markering.
2. `Escape` i dialogen kunne tidligere også lukke venstremenyens aktive verktøypanel. Dialog og panel har nå isolert Escape-håndtering.

Etter rettelsene ble hele `npm run check` kjørt på nytt, og arkitekturrapportene ble regenerert.

## Verifisert kvalitetskontroll

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

Arkitekturrapportene ble regenerert og committed i `fbd8091`. Ingen GitHub Actions-run var knyttet til head; brukerbekreftet lokal kontroll var verifikasjonsgrunnlaget.

## Manuelt godkjent

Brukeren godkjente:

- riktig sletteetikett for alle fire elementtyper
- riktig plassering rett under statusboksen
- avbrytelse og `Escape` uten mutasjon
- bekreftet sletting via høyremenyen
- høyremenyen lukkes etter sletting
- ingen andre elementer slettes
- `Delete` åpner samme dialog
- låst element kan ikke slettes
- `Delete` under tekstredigering påvirker bare teksten
- sletting av Seksjon lar visuelt overlappende elementer bli stående

## Akseptansestatus

Fasen er fullført og merget til `main` i mergecommit `b428cac`. Det finnes ingen åpne kriterier eller kjente blokkerende kodefunn knyttet til slettefasen.
