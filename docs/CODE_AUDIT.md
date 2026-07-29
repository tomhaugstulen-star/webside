# Kodegjennomgang av editorgrunnlaget

Dette dokumentet beskriver den historiske kodegjennomgangen av editorgrunnlaget før videre funksjonsutvikling.

## Status

Kodeoppryddingen ble utført i:

```text
chore/editor-foundation-audit
```

Editorgrunnlaget og den tekniske oppryddingen er ferdig, kontrollert og merget til `main`.

Den tidligere formuleringen om at `feature/element-selection` var «neste planlagte fase» beskrev prosjektets historiske rekkefølge etter grunnlagsauditen. Markering og flere senere faser er nå implementert.

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

Filene ble holdt under prosjektets daværende kontrollgrense. Gjeldende regel er aktiv ansvarstrekk ved 250 linjer og hard unntaksgrense ved 300 linjer.

### Venstremeny

- `LeftSidebar.tsx` håndterer navigasjon og panelbeholder
- `SidebarIcon.tsx` håndterer ikoner
- `SidebarPanels.tsx` håndterer panelinnhold

Dagens implementerte venstremeny er:

```text
Prosjekt
Farger
Logo og header
Elementer
Innstillinger
```

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
- prosjektdata eies av sentral prosjekt-state
- verktøymeny, panelinnhold og ikoner er separert
- lerretet skal ikke få tilfeldig objektlogikk
- responsive prosjektverdier lagres i prosjektmodellen, ikke i DOM-en
- automatisk lagring bygges etter prosjektmodell og historikkmodell

Disse retningene er senere videreført i prosjektmodellen, reduceren, elementmarkering, elementoppretting, transform, låsing, tekstredigering og høyremeny.

## 4. Midlertidige kontroller

Flere knapper er fortsatt visuelle skallkontroller uten ferdig funksjon, blant annet forhåndsvisning, lagring, publisering og flere panelvalg.

Hver kontroll kobles til reell funksjonalitet i sin planlagte feature-branch. Tilfeldig midlertidig logikk skal ikke legges inn.

## 5. Historisk automatisert kontroll

Bekreftet 28. juli 2026:

- `npm install`: ingen kjente sårbarheter
- ESLint: bestått
- TypeScript: bestått
- Dependency Cruiser: ingen regelbrudd
- arkitekturrapport: 11 moduler og 15 avhengigheter
- produksjonsbuild: bestått
- arkitekturrapporter regenerert

Tallene beskriver editorgrunnlaget på kontrolltidspunktet og er ikke gjeldende modul- eller avhengighetstall etter senere funksjonsfaser.

## 6. Historisk visuell kontroll

Godkjent:

- siden åpner helt blank
- Elementer inneholder Seksjon, Bilde, Tekst og Knapp
- samme verktøy åpner og lukker panelet
- Escape lukker venstrepanelet
- hovedmenyen lukkes med Escape og klikk utenfor
- desktop og mobil endrer lerretsbredde
- nettleseren åpnes automatisk ved `npm run dev`

## 7. Videreføring

Prosjekt- og elementmodellen, elementmarkering, elementoppretting, drag/resize, objektlåsing, tekstredigering, høyremeny, tekstegenskaper, elementlenker og sikker sletting er senere implementert og ligger på `main`.

Videre utvikling følger gjeldende status og rekkefølge i `docs/NEXT_CHAT_PROMPT.md`, `docs/WORK_PLAN.md`, `docs/EDITOR_PLANNING.md` og `docs/PROJECT_RULES.md`.