# Kodeaudit og tekniske grenser

Dette dokumentet beskriver den framtidsrettede auditen av fase 13.

## Leveransestatus

```text
fase: 13 – Logo og header
branch: feature/logo-header
GitHub-sak: #31
pull request: #32 – åpen, ikke draft
prosjektskjema: versjon 8
funksjonell manuell test: godkjent
dokumentasjon: synkronisert med faktisk kontrollstatus
kodeopprydding: gjennomført
automatisk sluttkontroll etter siste produksjonsendring: bestått
merge: ikke godkjent
```

## Arkitekturretning

- `EditorProject` er eneste varige sannhetskilde.
- Header er én egen sammensatt elementtype.
- Filvalg ligger i venstremenyen.
- Egenskaper ligger i høyremenyen.
- Lerretet rendrer og transformerer.
- Bilderessurslageret eier `File` og Object URL.
- Reduceren er siste valideringsgrense.
- Headerbredde avledes fra aktivt lerret og lagres ikke fra DOM.

## Auditfunn og tiltak

### 1. Duplisert ressursopprydding ved sletting

`EditorShell` og `useElementDeletion` forsøkte begge å rydde bilderessurser. Dette ga to ansvarssteder og kunne senere skape ulik behandling av Bilde og Header.

Tiltak:

- all ressursopprydding ligger nå i `useElementDeletion`
- delte asset-ID-er kontrolleres på tvers av Bilde og Header
- `EditorShell` håndterer bare dialog- og paneltilstand

### 2. Oppretting kunne rapportere suksess før alle reducerforutsetninger var kontrollert

`useElementCreation` returnerte `true` etter dispatch når requesten var gyldig, uten å kontrollere aktiv side eller en ekstrem ID-kollisjon. For filbaserte elementer kunne dette i teorien etterlate en registrert ressurs.

Tiltak:

- aktiv side kontrolleres før dispatch
- generert element-ID kontrolleres mot hele prosjektet
- `false` returneres før ressursen beholdes dersom oppretting ikke kan gjennomføres
- reduceren beholder de samme kontrollene som siste grense

### 3. Headerens lagrede x-verdi var ikke i samsvar med fullbredde-regelen

Header ble rendret ved `x = 0`, men tidligere oppretting kunne lagre standardposisjonen `x = 24`.

Tiltak:

- nye Header-elementer opprettes med `x = 0`
- varige Header-layoutcommits normaliserer `x = 0`
- lagret bredde normaliseres til én kanonisk skjemaverdi
- synlig bredde fortsetter å følge aktivt lerret

### 4. Pekerhooken lå på filstørrelsesgrensen

`useElementPointerTransform.ts` var 247 linjer og blandet React-livssyklus med rene transformberegninger.

Tiltak:

- rene delta-, layout- og cropberegninger er trukket ut i `elementPointerTransform.ts`
- hooken er redusert til 204 linjer
- den nye rene hjelpefilen er 97 linjer

### 5. Canvas-stilarket lå på filstørrelsesgrensen

`canvas.css` var 248 linjer og blandet grunnlayout med interaksjonsstiler.

Tiltak:

- `canvas.css` inneholder nå grunnlayout og elementbasis
- `canvas-interaction.css` inneholder resizegrep, objektverktøy, markering og transformtilstander

### 6. Header kunne gli horisontalt under pointer-preview

Den varige layoutcommiten normaliserte `x = 0`, men pointer-preview sendte tidligere både horisontalt og vertikalt delta til den generelle flyttelogikken. Header kunne derfor gli sideveis under drag og hoppe tilbake ved slipp.

Tiltak:

- pointer-preview normaliserer Header-delta til `{ x: 0, y: delta.y }`
- andre elementtyper beholder fri todimensjonal flytting
- varig Header-layout normaliserer fortsatt `x = 0` som siste modellgrense

### 7. Header-låsing var ikke ønsket produktoppførsel

Header arver `locked` fra versjon-8-basemodellen, men brukeren besluttet at Header ikke skal ha låsing.

Tiltak:

- objektverktøyet viser ikke låseknapp for Header
- høyrepanelet viser ikke `Låst/Ulåst` for Header
- `toggleElementLock` avviser Header som siste stategrense
- Seksjon, Bilde, Tekst og Knapp beholder eksisterende låsing
- nye Header-elementer opprettes fortsatt med `locked: false` for skjemakompatibilitet
- framtidig prosjektimport må avvise eller normalisere Header med `locked: true`

### 8. Header-opprettingen hadde en ekstra avslutningscallback

Den generelle opprettingsflyten lukket allerede venstrepanelet. Header-komponenten kalte i tillegg `onCreated()` etter vellykket oppretting. En senere feil i denne ekstra callbacken kunne utløse catch-blokken etter at prosjektet allerede eide Headeren.

Tiltak:

- den ekstra `onCreated`-callbacken er fjernet
- venstrepanelet lukkes bare av den felles opprettingsflyten
- `registeredAssetId` nullstilles straks prosjektet har overtatt logoressursen
- catch-blokken rydder bare en ressurs som fortsatt eies av den lokale opprettingsøkten

## Headerinvarianter

- skjemaversjon 8
- logoasset og metadata er serialiserbare
- `File`, Blob, Object URL og lokal filsti er transient
- navn er normalisert, obligatorisk og maks 80 tegn
- undertittel er normalisert, valgfri og maks 120 tegn
- full aktiv sidebredde
- horisontal flytting og resizing er blokkert
- høyde 70–100 px
- navn og undertittel deler font og tekstfarge
- Header eksponerer ikke låsing eller låsestatus
- reduceren avviser Header-låsehandlinger
- ugyldige og uendrede handlinger returnerer samme state

## Ressurslivssyklus

Auditen bekrefter:

- fil og metadata kontrolleres ved registrering
- mislykket oppretting rydder registrert ressurs
- vellykket Header-oppretting overfører ressursansvar før lokal UI-opprydding
- sletting rydder bare asset som ikke lenger refereres
- deling mellom Bilde og Header støttes
- provider-unmount tilbakekaller gjenværende Object URL-er
- ingen Object URL lagres i prosjektmodellen

Logo- eller tekstbytte etter oppretting er ikke del av fase 13. Det finnes derfor ingen delvis implementert bytteflyt som kan etterlate foreldede ressurser.

## Responsiv grense

- Headerbredde måles med `ResizeObserver` og er transient rendering.
- Y og høyde lagres foreløpig i desktopverdien.
- Telefon arver disse verdiene.
- Fase 15 må innføre viewport-spesifikke actions før mobilverdier kan redigeres.

## Filstørrelser

Siste Header-låse- og opprettingsopprydding:

```text
HeaderCreationControl.tsx       224
EditorCanvasElement.tsx         223
RightPropertiesPanel.tsx        105
SidebarPanels.tsx                95
ElementSelectionToolbar.tsx      83
toggleElementLock.ts             40
```

Alle er under aktiv terskel på 250 linjer.

## Verifisert kontroll

Brukerens terminaloutput etter siste produksjonsendring på `8c7c7a0` bekrefter:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 113 moduler, 324 avhengigheter, ingen brudd
Vite: 122 moduler transformert
CSS: 36.54 kB, gzip 6.80 kB
JavaScript: 275.80 kB, gzip 81.65 kB
produksjonsbuild: bestått på 206 ms
working tree: clean før og etter kontroll
```

Manuell regresjon av Header, logooppretting, objektverktøy, høyrepanel, font, ramme, farger, sletting, delt asset-livssyklus og eksisterende låsing for andre elementtyper er godkjent av brukeren.

## Konklusjon

Ingen kjent kode- eller funksjonsblokkerer står igjen. PR #32 må fortsatt kontrolleres for samlet diff, mergebarhet, reviews, uløste tråder og CI. Merge er blokkert til brukeren gir eksplisitt godkjenning.
