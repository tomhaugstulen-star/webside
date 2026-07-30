# Prosjektregler

Dette dokumentet fastsetter varige arbeids-, modell- og arkitekturgrenser.

## Branch og merge

- Det utvikles aldri direkte på `main`.
- Hver avgrenset leveranse bruker egen feature- eller docs-branch.
- Faktisk branch, `origin/main`, PR-head og clean tree leses fra Git eller GitHub.
- Ingen funksjon for en senere fase legges inn skjult.
- Ingen branch merges uten eksplisitt brukergodkjenning.
- Lokal kontrollstatus påstås bare når terminaloutput er vist.

## Filstørrelse og ansvar

```text
aktiv terskel: 250 linjer
hard unntaksgrense: 300 linjer
```

- Filer deles etter reelt modell-, state-, hook-, UI- eller stilansvar.
- `App.tsx` setter bare sammen providers og hovedskall.
- `EditorShell` koordinerer skalltilstand og komposisjon.
- `RightPropertiesPanel.tsx` forblir komposisjon.
- Canvas eier ikke filvalg eller ressurslagring.
- CSS deles etter editorområde og komponentansvar.
- Ingen tilfeldig samlemappe eller samlefil opprettes.

## Autoritativ prosjektmodell

- Gjeldende prosjektskjema er versjon 8.
- `EditorProject` eier alle varige, serialiserbare prosjektdata.
- DOM og CSS er rendering, ikke permanent lagring.
- `File`, Blob, Object URL og lokal filsti er ikke prosjektdata.
- ID-er er stabile og kryptografisk generert.
- Alle varige endringer går gjennom typede reducerhandlinger.
- Reduceren er siste valideringsgrense.
- Ugyldige, låste og uendrede handlinger returnerer samme state.
- `updatedAt` endres bare ved gyldig reell mutasjon.

Skjemahistorikk:

```text
1  grunnmodell
2  tekstinnhold
3  tekststil
4  elementlenke
5  knappasset, knappetekst og knappelenke
6  bildeasset, metadata, alternativ tekst, visning og utsnitt
7  sidebakgrunn, Seksjon-utseende, Seksjon-ramme og tekstfarge
8  Header med logo, tekst, utseende og ramme
```

## Varig og transient state

Varig:

- prosjekt, sider og elementer
- posisjon, størrelse, synlighet og låsestatus
- side- og elementutseende
- tekst, lenker og asset-ID-er
- bilde- og logometadata
- tidsstempler

Transient:

- markering og åpne paneler
- pekerøkter og preview
- lokale drafts og valideringsfeedback
- filvelger
- `File`, Object URL og ressurskart
- dialoger, fokus, hover og animasjon

Transient state serialiseres ikke og inngår ikke direkte i historikk eller autolagring.

## Element- og layoutregler

- Seksjon, Bilde, Tekst og Knapp bruker fri todimensjonal geometri.
- Header rendres alltid fra `x = 0` til hele den synlige sidebredden.
- Header kan bare flyttes vertikalt.
- Headerhøyde valideres til 70–100 px.
- Headerens lagrede horisontale felt normaliseres deterministisk og er ikke brukerredigerbare.
- Elementer kan overlappe; andre elementer flyttes ikke automatisk.
- Lerretshøyde er avledet visning og lagres ikke.
- Pekerpreview er transient; normalt pekerslipp gir én varig commit.
- `pointercancel` og tapt pointer capture forkaster preview.

## Farger og rammer

- `EditorColor` er kanonisk `#RRGGBB`.
- Rammebredde er `0–10`, der `0` betyr `Ingen`.
- Rammefarge beholdes når rammen slås av.
- `Farger` avledes fra aktiv side og lagres ikke som egen palett.
- Seksjon og Header kan ha bakgrunn og ramme.
- Tekst og Header har tekstfarge.
- Headerens navn og undertittel deler font og tekstfarge.
- Knapper beholder ferdig SVG-fargedesign.
- Bilder har ingen prosjektfarge.

## Bilde- og logoressurser

Støttede filer:

```text
PNG
JPEG
WebP
maks 10 MB
maks 40 megapiksler
maks 16 384 px per side
```

- Fil og metadata valideres før elementoppretting.
- Ressurslageret kontrollerer faktisk fil mot metadata.
- Mislykket oppretting rydder registrert ressurs.
- Sletting fjerner en ressurs bare når ingen andre elementer refererer til asset-ID-en.
- Deling kontrolleres på tvers av Bilde og Header.
- Provider-unmount tilbakekaller alle gjenværende Object URL-er.
- Ressursopprydding skal ha ett ansvarssted; UI-skallet skal ikke duplisere den.

## Menyansvar

```text
Venstremeny = opprette elementer, velge fil/design og vise prosjektoversikt
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere innhold og transformere elementer
Ressurslag = eie transient fil og Object URL
Prosjekt   = eie serialiserbare verdier
```

## Responsiv grense

- Telefon arver desktopverdier når mobiloverstyring mangler.
- Dagens UI oppretter ikke mobiloverstyringer.
- Header følger aktiv sidebredde i begge visninger og deler y/høyde foreløpig.
- Senere mobilendringer må bruke eksplisitte viewport-spesifikke actions.
- Mobilendringer skal ikke skrives inn i desktopfeltet ved en feil.

## Kvalitetskontroll

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
git diff --check
git status --short
git diff --stat
```

Før PR kontrolleres også filstørrelser, framtidige import-/historikkgrenser, ressurslivssyklus, tilgjengelighet, regresjoner, PR-diff, mergebarhet, reviews, uløste tråder og CI.
