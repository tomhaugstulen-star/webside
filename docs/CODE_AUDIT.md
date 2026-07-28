# Kodegjennomgang av editorgrunnlaget

Denne gjennomgangen gjelder editorgrunnlaget før videre funksjonsutvikling.

## 1. Omfang

Kontrollert:

- inngangspunkt og hovedkomponent
- editorens hovedskall
- toppmeny
- venstremeny og paneler
- blankt lerret
- delte typer
- CSS-struktur
- Dependency Cruiser-regler
- ubrukte kildekodemoduler
- risiko for navne- og ansvarsblanding

Kodeoppryddingen ble utført i:

```text
chore/editor-foundation-audit
```

## 2. Funn som ble rettet

### Ubrukt kode

- ubrukt `InspectorRail.tsx` ble fjernet
- ubrukt `InspectorTool` ble fjernet
- Dependency Cruiser fikk regelen `no-unreachable-from-main`
- kildekodemoduler som ikke kan nås fra `src/main.tsx` stopper arkitektursjekken

### Bokser og Elementer

- intern verktøy-ID ble endret fra `boxes` til `elements`
- ikonnavn ble endret til `elements`
- CSS-navn ble endret til `element-grid` og `element-card`

Synlige og interne begreper bruker nå Elementer konsekvent.

### Blank startside

- midlertidig objektmeny ble fjernet
- fire midlertidige håndtak ble fjernet
- midlertidig låseknapp ble fjernet
- lerretet ble en ren, hvit side med nøytral kant

Objektverktøy vises først når faktiske elementer og markering finnes.

### CSS-struktur

Den tidligere samlefilen på 669 linjer ble delt i:

- `editor-base.css`
- `toolbar.css`
- `sidebar.css`
- `canvas.css`

Alle filene er under prosjektets kontrollgrense på 300 linjer.

### Venstremeny

- `LeftSidebar.tsx` håndterer navigasjon og panelbeholder
- `SidebarIcon.tsx` håndterer ikoner
- `SidebarPanels.tsx` håndterer panelinnhold

### Hovedmeny

- lukkes ved klikk utenfor
- lukkes med Escape
- event listeners fjernes ved lukking og demontering

### Lokal utviklingsstart

- `npm run dev` bruker `vite --open`
- editoren åpnes automatisk i standardnettleseren

## 3. Bekreftet arkitekturretning

- `App.tsx` setter bare sammen applikasjonen
- editorshellet eier bare skalltilstand
- prosjektdata skal eies av sentral prosjekt-state
- verktøymeny, panelinnhold og ikoner er separert
- lerretet skal ikke få tilfeldig objektlogikk
- responsive prosjektverdier lagres i prosjektmodellen, ikke i DOM-en
- automatisk lagring bygges etter prosjektmodell og historikkmodell

## 4. Midlertidige kontroller

Flere knapper er fortsatt visuelle skallkontroller uten ferdig funksjon, blant annet forhåndsvisning, lagring, publisering og flere panelvalg.

Hver kontroll kobles til reell funksjonalitet i sin planlagte feature-branch. Tilfeldig midlertidig logikk skal ikke legges inn.

## 5. Automatisert lokal kontroll

Bekreftet 28. juli 2026:

- `npm install`: ingen kjente sårbarheter
- ESLint: bestått
- TypeScript: bestått
- Dependency Cruiser: ingen regelbrudd
- arkitekturrapport: 11 moduler og 15 avhengigheter
- produksjonsbuild: bestått
- arkitekturrapporter regenerert

## 6. Visuell kontroll

Godkjent:

- siden åpner helt blank
- Elementer inneholder Seksjon, Bilde, Tekst og Knapp
- samme verktøy åpner og lukker panelet
- Escape lukker venstrepanelet
- hovedmenyen lukkes med Escape og klikk utenfor
- desktop og mobil endrer lerretsbredde
- nettleseren åpnes automatisk ved `npm run dev`

## 7. Godkjenningsstatus

Editorgrunnlaget og teknisk opprydding er ferdig, lokalt kontrollert, visuelt godkjent og merget til `main`.

Videre utvikling skal følge `docs/WORK_PLAN.md`. Prosjekt- og elementmodellen er ferdig i `feature/element-model`, og neste planlagte fase etter merge er `feature/element-selection`.