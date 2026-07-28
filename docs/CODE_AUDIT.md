# Kodegjennomgang av editorgrunnlaget

Denne gjennomgangen gjelder editorgrunnlaget før videre funksjonsutvikling.

## 1. Omfang

Følgende ble kontrollert:

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

Kodeoppryddingen ligger i:

```text
chore/editor-foundation-audit
```

## 2. Funn som er rettet

### Ubrukt kode

`InspectorRail.tsx` var ikke koblet inn i applikasjonen. Filen importerte en type og ble derfor ikke fanget av den opprinnelige orphan-regelen.

Utført:

- ubrukt `InspectorRail.tsx` er fjernet
- ubrukt `InspectorTool` er fjernet
- Dependency Cruiser har fått regelen `no-unreachable-from-main`
- en kildekodemodul som ikke kan nås fra `src/main.tsx` skal nå stoppe arkitektursjekken

### Bokser og Elementer

Den synlige menyen het Elementer, mens interne typer og ID-er fortsatt brukte `boxes`.

Utført:

- intern verktøy-ID er endret til `elements`
- ikonnavn er endret til `elements`
- CSS-navn er endret fra `box-grid` og `box-card` til `element-grid` og `element-card`

Dette reduserer risikoen for parallelle begreper i datamodellen senere.

### Blank startside

Det blanke lerretet inneholdt en flytende objektmeny, fire markeringshåndtak og en låseknapp selv om ingen objekter fantes.

Utført:

- objektmenyen er fjernet fra den blanke siden
- de fire håndtakene er fjernet
- den midlertidige låseknappen på selve siden er fjernet
- lerretet vises som en ren, hvit side med en nøytral kant

Objektverktøy, låsing og drahåndtak bygges senere sammen med den faktiske objektmodellen.

### For stor CSS-fil

`src/styles/editor.css` hadde 669 linjer og ansvar for hele editoren.

Utført oppdeling:

- `editor-base.css`
- `toolbar.css`
- `sidebar.css`
- `canvas.css`

Den separate `sidebar-panel.css` er slått sammen med `sidebar.css`. Alle de nye CSS-filene er under 300 linjer.

### Venstremenyens ansvar

`LeftSidebar.tsx` inneholdt både navigasjon, alle SVG-ikoner og alle panelene.

Utført oppdeling:

- `LeftSidebar.tsx` håndterer bare navigasjon og panelbeholder
- `SidebarIcon.tsx` håndterer ikonene
- `SidebarPanels.tsx` håndterer panelinnholdet

### Hovedmeny

Hovedmenyen kunne åpnes, men lukket ikke forutsigbart ved klikk utenfor.

Utført:

- menyen lukkes ved klikk utenfor
- menyen lukkes med Escape
- event listeners fjernes når menyen lukkes eller komponenten demonteres

## 3. Bekreftet arkitekturretning

- `App.tsx` setter bare sammen applikasjonen.
- `EditorShell` eier foreløpig bare skalltilstand som aktivt verktøy og valgt visning.
- Verktøymeny, panelinnhold og ikoner er separert.
- Lerretet inneholder ikke objektlogikk før objektmodellen er definert.
- Responsive prosjektverdier skal ikke lagres direkte i DOM-en.
- Automatisk lagring bygges etter at prosjektmodell og historikkmodell er definert.

## 4. Midlertidige kontroller

Flere knapper i toppmenyen og panelene er fortsatt visuelle skallkontroller uten ferdig funksjon. Dette gjelder blant annet forhåndsvisning, lagring, publisering og flere panelvalg.

De skal ikke få tilfeldig logikk i editorgrunnlaget. Hver kontroll kobles til reell funksjonalitet i sin planlagte feature-branch.

## 5. Kontroll som må kjøres lokalt

Før branchen vurderes for merge:

```powershell
npm install
npm run check
npm run architecture:json
npm run architecture:diagram
npm run dev
```

Kontroller visuelt:

- siden åpnes helt blank
- Elementer-menyen åpnes og inneholder Seksjon, Bilde, Tekst og Knapp
- samme verktøy lukker panelet ved nytt klikk
- Escape lukker venstrepanelet
- hovedmenyen lukkes med Escape og klikk utenfor
- desktop- og mobilknappen endrer bredden på lerretet

## 6. Godkjenningsstatus

Kodegjennomgangen er utført og klare strukturproblemer er rettet i repoet. Build, lint, typekontroll og ny arkitekturrapport må fortsatt bekreftes lokalt etter disse endringene.
