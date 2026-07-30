# Kodeaudit og tekniske grenser

Dette dokumentet beskriver den framtidsrettede auditen av fase 13.

## Leveransestatus

```text
fase: 13 – Logo og header
branch: feature/logo-header
GitHub-sak: #31
prosjektskjema: versjon 8
funksjonell manuell test: godkjent
dokumentasjon: oppdatert og konsolidert
kodeopprydding: gjennomført
automatisk sluttkontroll etter opprydding: gjenstår
PR: ikke opprettet
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
- den nye rene hjelpefilen er 96 linjer

### 5. Canvas-stilarket lå på filstørrelsesgrensen

`canvas.css` var 248 linjer og blandet grunnlayout med interaksjonsstiler.

Tiltak:

- `canvas.css` inneholder nå grunnlayout og elementbasis, 129 linjer
- `canvas-interaction.css` inneholder resizegrep, objektverktøy, markering og transformtilstander, 120 linjer

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
- låst Header kan ikke muteres
- ugyldige og uendrede handlinger returnerer samme state

## Ressurslivssyklus

Auditen bekrefter:

- fil og metadata kontrolleres ved registrering
- mislykket oppretting rydder registrert ressurs
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

Største berørte produksjonsfiler etter opprydding:

```text
HeaderCreationControl.tsx       228
EditorCanvasElement.tsx         224
useElementPointerTransform.ts   204
canvas.css                      129
canvas-interaction.css          120
elementPointerTransform.ts       96
```

Alle er under aktiv terskel på 250 linjer.

## Gjenstående kontroll

Etter at de siste kildefilene er trukket lokalt skal følgende kjøres:

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
git diff --check
git status --short
git diff --stat
```

Deretter skal Header, Seksjon, Bilde, Tekst og Knapp regresjonstestes. Arkitekturrapportene og kontrolltallene oppdateres først etter faktisk terminaloutput.

## Konklusjon

Ingen kjent statisk blokkerer står igjen etter kodeauditen. Merge er fortsatt blokkert til ny automatisk kontroll, regenererte arkitekturrapporter, PR-inspeksjon og eksplisitt brukergodkjenning er fullført.
