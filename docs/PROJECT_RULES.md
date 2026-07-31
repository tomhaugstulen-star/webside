# Prosjektregler

Dette dokumentet fastsetter varige arbeids-, produkt-, modell- og arkitekturgrenser.

## Branch og merge

- Det utvikles aldri direkte på `main`.
- Hver avgrenset leveranse bruker egen feature- eller docs-branch.
- Faktisk branch, `origin/main`, PR-head og clean tree leses fra Git eller GitHub.
- Ingen funksjon for en senere fase legges inn skjult.
- Ingen branch merges uten eksplisitt brukergodkjenning.
- Lokal kontrollstatus påstås bare når terminaloutput er vist.
- Låst roadmap i `docs/WORK_PLAN.md` endres bare gjennom eksplisitt produktbeslutning.

## Produktgrense

- Website-editoren er en lokal arbeidsportal på brukerens egen PC.
- Offentlig publisering, hosting, domeneoppsett og produksjonsdeployment er ikke del av produktet.
- Lokal forhåndsvisning, prosjektlagring, sikkerhetskopi, import og gjenoppretting er del av produktretningen.
- En framtidig `Publiser`-handling skal ikke innføres; lokal visning bruker `Forhåndsvis` eller tilsvarende.
- Produktet skal kunne håndtere flere lokale nettsideprosjekter kontrollert.

## To navigasjonssystemer

Arbeidsportalens navigasjon og nettsidens navigasjon er forskjellige ansvar.

Arbeidsportalens navigasjon:

- åpner prosjekter, sider, elementer, paneler, verktøy og innstillinger
- er editor-UI
- serialiseres ikke som nettsideinnhold

Nettsidens navigasjon:

- vises i nettstedets Header
- peker til stabile side-ID-er, seksjons-ID-er eller eksterne URL-er
- er varig prosjektdata
- valideres gjennom modell og reducer

Ingen UI-komponent skal bruke portalmenyen som kilde for nettstedets meny eller motsatt.

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
- Genererte arkitekturrapporter omfattes ikke av produksjonsfilgrensen.
- Filstørrelsesgrensene håndheves automatisk av `npm run file-size:check` som del av `npm run check`.
- Grensereglene testes av `npm run file-size:test` før repositorykontrollen.
- Ordinære produksjonsfiler skal være 0–249 linjer; eventuelle unntak må være eksplisitte og begrunnede.
- Ingen produksjonsfil kan være 300 linjer eller mer.

## Autoritativ prosjektmodell

- Gjeldende prosjektskjema er versjon 9.
- `EditorProject` eier alle varige, serialiserbare prosjektdata.
- DOM og CSS er rendering, ikke permanent lagring.
- `File`, Blob, Object URL og lokal filsti er ikke prosjektdata.
- ID-er er stabile og kryptografisk generert.
- Alle varige endringer går gjennom typede reducerhandlinger.
- Reduceren er siste valideringsgrense.
- Ugyldige, låste og uendrede handlinger returnerer samme state.
- `updatedAt` endres bare ved gyldig reell mutasjon.
- Låseendringer beregnes fra reducerens nyeste state.
- Header opprettes med `locked: false`, eksponerer ingen låsekontroll og avvises av låsereduceren.
- Framtidig prosjektimport må validere eller migrere hele prosjektet før `replace-project`.
- Side- og seksjonslenker skal bruke stabile ID-er, ikke bare visningsnavn eller ukontrollerte tekst-URL-er.

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
9  Header-fontstørrelse
```

## Varig og transient state

Varig:

- prosjekt, sider og elementer
- posisjon, størrelse og synlighet
- låsestatus for Seksjon, Bilde, Tekst og Knapp
- Headerens kompatibilitetsfelt `locked`, alltid `false` i dagens flyt
- side- og elementutseende
- tekst, lenker og asset-ID-er
- bilde- og logometadata
- Header-fontfamilie og fontstørrelse
- framtidige side-, seksjons- og navigasjonsmål
- tidsstempler

Transient:

- markering og åpne paneler
- pekerøkter og layoutpreview
- alignment-mål og aktive guider
- fryste lerretsmål under pekerøkt
- lokale drafts og valideringsfeedback
- portalens åpne meny, kommandofelt og fokus
- kompakt Header-meny åpen/lukket
- filvelger
- `File`, Object URL og ressurskart
- dialoger, fokus, hover og animasjon
- AI-forslag som ikke er godkjent

Transient state serialiseres ikke og inngår ikke direkte i historikk eller autolagring.

## Element- og layoutregler

- Seksjon, Bilde, Tekst og Knapp bruker fri todimensjonal geometri.
- Header opprettes, lagres og rendres ved `x = 0, y = 0`.
- Header følger hele den synlige sidebredden.
- Header kan ikke flyttes med peker eller tastatur.
- Headerhøyde valideres til 70–100 px.
- Headerens serialiserte bredde er kanonisk og ikke brukerredigerbar.
- Header er ikke låsbar og viser ikke låsestatus.
- Hero skal senere bygges som en egen sammensatt elementtype, ikke skjult som en uformell gruppe løse elementer.
- Elementer kan overlappe; andre elementer flyttes ikke automatisk.
- Lerretshøyde er avledet visning og lagres ikke.
- Pekerpreview er transient; normalt pekerslipp gir én varig commit.
- Pekertransformer bruker pointer capture gjennom hele den aktive pekerøkten.
- Preview-delta inkluderer endringer i lerretets scrollposisjon.
- Auto-scroll kan flytte scrollcontaineren, men skriver ikke prosjektstate før transformen committes.
- `pointercancel` og tapt pointer capture forkaster preview.

## Korrigeringslinjer og snapping

- Snapping gjelder bare pekerflytting i fase 14.
- Resize og tastatur bruker ikke snapping.
- Aktivt element kan bruke start-, center- og end-anker på begge akser.
- Mål er andre synlige elementer og lerretsmidt.
- Låste elementer kan være mål.
- Skjulte elementer og aktivt element er ikke mål.
- Header kan være mål, men ikke aktivt flytteelement.
- Snapgrensen er 6 px i lerretskoordinater.
- X og Y velges uavhengig.
- Nærmeste treff vinner; midtanker har prioritet ved lik avstand.
- Snapmål og lerretsmål fryses ved pekerstart.
- Guider finnes bare mens et snap er aktivt.
- Ingen alignment-verdi lagres i prosjektmodellen.

## Portaldesign

- Portalens visuelle områder skal bruke semantiske designtokens.
- Dempede farger skal skille toppmeny, venstremeny, venstrepanel, høyrepanel, arbeidsområde og lerret.
- Portaltema endrer ikke nettsideprosjektets egne farger.
- Valgt, aktiv, hover, fokus, disabled, advarsel og sletting skal ha tydelige tilstander.
- Tilgjengelig kontrast og synlig fokus prioriteres foran dekorativ likhet.

## Farger og rammer

- `EditorColor` er kanonisk `#RRGGBB`.
- Rammebredde er `0–10`, der `0` betyr `Ingen`.
- Rammefarge beholdes når rammen slås av.
- `Farger` avledes fra aktiv side og lagres ikke som egen palett.
- Seksjon og Header kan ha bakgrunn og ramme.
- Tekst og Header har tekstfarge.
- Headerens navn og undertittel deler fontfamilie og tekstfarge.
- Header-fontstørrelse er en validert verdi fra 12 til 96 px.
- Knapper beholder ferdig SVG-fargedesign.
- Bilder har ingen prosjektfarge.
- Tekstboksbakgrunn finnes ikke som varig modellverdi i versjon 9; gapet spores i sak #35.

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
- Etter vellykket Header-oppretting overføres eierskapet til logoressursen før lokal UI-opprydding.
- Sletting fjerner en ressurs bare når ingen andre elementer refererer til asset-ID-en.
- Deling kontrolleres på tvers av Bilde og Header.
- Provider-unmount tilbakekaller alle gjenværende Object URL-er.
- Ressursopprydding skal ha ett ansvarssted; UI-skallet skal ikke duplisere den.
- Framtidige AI-genererte bilder skal valideres, lagres lokalt og få stabil asset-ID før prosjektet kan referere til dem.

## Menyansvar

```text
Venstremeny = opprette elementer, velge fil/design og vise prosjektoversikt
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere innhold og transformere elementer
Ressurslag = eie transient fil og Object URL
Prosjekt   = eie serialiserbare verdier
```

Framtidig portalnavigator og `Ctrl + K` skal lese eksisterende state og actions, ikke opprette parallelle kopier av prosjektet.

## Responsiv grense

- Telefon arver desktopverdier når mobiloverstyring mangler.
- Dagens UI oppretter ikke mobiloverstyringer.
- Header følger aktiv sidebredde og fast topposisjon i begge visninger.
- Headerens høyde er foreløpig felles for PC og Telefon.
- Senere mobilendringer må bruke eksplisitte viewport-spesifikke actions.
- Mobilendringer skal ikke skrives inn i desktopfeltet ved en feil.
- Nettstedets meny skal senere ha eksplisitt automatisk, horisontal eller kompakt modus.

## Lokal lagring og prosjektfiler

- Autolagring reagerer bare på gyldige prosjektmutasjoner.
- Transient preview, åpne menyer og ikke-godkjente AI-forslag lagres ikke.
- Prosjektfiler må valideres og eventuelt migreres før aktivt prosjekt byttes.
- Ugyldig import skal ikke mutere aktivt prosjekt.
- Lokal maskinsti lagres ikke i prosjektdata eller sikkerhetskopi.
- Offentlig publiseringsformat er ikke et produktkrav.

## OpenAI-grense

- OpenAI bygges først i den låste siste hovedfasen.
- API-nøkkel skal aldri ligge i browser-, Vite- eller annen klientkode.
- En lokal server-side prosess på samme PC håndterer API-kall.
- Nøkkel lastes fra miljøvariabel eller tilsvarende sikker lokal konfigurasjon.
- Gjeldende offisielle OpenAI API og SDK vurderes på nytt når fasen starter.
- AI-respons behandles som et forslag, ikke som prosjektstate.
- Forslag valideres mot egne typer og eksisterende modellgrenser.
- Brukeren ser og godkjenner endringen før reducerhandlinger sendes.
- Et godkjent AI-forslag skal kunne angres som én samlet historikkhandling.
- Mislykket eller avvist AI-forslag skal ikke mutere prosjekt eller ressurser.
- AI skal ikke generere og injisere ukontrollert React-, CSS- eller prosjektkode.

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
