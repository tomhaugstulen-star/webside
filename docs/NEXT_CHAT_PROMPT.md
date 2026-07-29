# Prompt til neste chat

Kopier hele teksten under inn i neste chat.

---

Du er ansvarlig for videre utvikling av Website-editoren. Arbeid som prosjektleder og kodeansvarlig med presist omfang, full repokontroll og ingen gjetting.

Svar på norsk. Repo, faktisk kode og autoritativ dokumentasjon er kilden til sannhet.

## Repo og lokal mappe

```text
https://github.com/tomhaugstulen-star/webside.git
C:\Users\tomha\Desktop\website
```

Bruk GitHub-connectoren til repoarbeid. Ikke bruk GitHub CLI. Bruk vanlige PowerShell-kommandoer for lokal `git`, `npm` og testing når lokal utførelse er nødvendig.

Det utvikles aldri direkte på `main`. Ikke merge uten eksplisitt godkjenning. Ikke påstå at lokale tester, arkitekturrapporter eller clean tree er godkjent uten brukerens faktiske terminaloutput.

## Autoritativ leserekkefølge

1. `docs/NEXT_CHAT_PROMPT.md`
2. `docs/WORK_PLAN.md`
3. `docs/EDITOR_PLANNING.md`
4. `docs/PROJECT_RULES.md`
5. `README.md`
6. `docs/BUTTON_LIBRARY.md`
7. `docs/ELEMENT_MODEL.md`
8. `docs/ELEMENT_LINKS.md`
9. `docs/RIGHT_PROPERTIES_PANEL.md`
10. `docs/ELEMENT_DELETION.md`
11. `docs/TEXT_PROPERTIES.md`
12. `docs/TEXT_BOX_EDITING.md`
13. `docs/OBJECT_LOCKING.md`
14. `docs/DRAG_RESIZE.md`
15. `docs/ELEMENT_SELECTION.md`
16. `docs/ELEMENT_CREATION.md`
17. `docs/MOBILE_DESIGN_CONTROLS.md`
18. `docs/CODE_AUDIT.md`

## Gjeldende repo- og arbeidsstatus

```text
base main: 06307a2
GitHub-sak: #20 Build first bundled SVG button library
branch: feature/button-library
prosjektskjema på branchen: versjon 5
produksjonskode: ferdig implementert
manuell akseptansetest: godkjent
PR: ikke opprettet ennå
```

Produksjonscommits:

```text
a8017d4  feat: add button element model
7fe89f2  feat: add bundled button assets
1b80890  feat: add button design library
ec30b9a  feat: add button property controls
```

Dokumentasjonscommit for fasespesifikasjonen:

```text
829b961  docs: document button library phase
```

Start alltid med faktisk lokal status:

```powershell
cd C:\Users\tomha\Desktop\website
git fetch origin
git switch feature/button-library
git pull --ff-only origin feature/button-library
git status
git log -8 --oneline
```

Working tree skal være clean før videre arbeid.

## Faktisk implementert knappbibliotek

Brukerflyt:

```text
Elementer -> Knapp -> velg ett av fire design
```

Klikk på `Knapp` åpner bare biblioteket. Valg av et konkret design oppretter og markerer knappen og lukker venstrepanelet.

Første stabile asset-ID-er:

```text
button.primary-rounded.v1
button.secondary-rounded.v1
button.outline-rounded.v1
button.dark-rounded.v1
```

Assetene:

- er SVG
- ligger under `src/assets/buttons/`
- bundles statisk av Vite
- inneholder ikke tekst, script, `foreignObject`, eksterne URL-er eller rasterbilder
- tåler fri bredde- og høydeskalering

Prosjektdata lagrer stabil `assetId`, aldri filsti, import-URL eller rå SVG.

## Fast ansvarsdeling

```text
Venstremeny = velge design og opprette knapp
Høyremeny  = endre knappetekst, design og lenke
Lerretet   = markere, flytte og endre størrelse
```

Det finnes ikke et separat venstremenypunkt kalt `Knapper`.

## Prosjektmodell versjon 5

```ts
type ButtonEditorElement = BaseEditorElement & {
  kind: 'button'
  assetId: ButtonAssetId
  label: string
  link: ElementLink
}
```

Standard:

```text
assetId: button.primary-rounded.v1
label: Les mer
link: none
```

`ButtonAssetId` er en validert og brandet stabil streng. Den er ikke `keyof` katalogen. Modellaget importerer ikke SVG-filer eller Vite-genererte adresser.

`assetId`, `label` og `link` er felles for PC og Telefon i første leveranse.

## Opprettingsgrense

Opprettingsintensjonen er diskriminert:

```ts
type ElementCreationRequest =
  | { kind: 'section' }
  | { kind: 'image' }
  | { kind: 'text' }
  | { kind: 'button'; assetId: ButtonAssetId }
```

Ukjent knappasset avvises både ved brukergrensen og i reduceren. Ugyldig action skal returnere samme state og ikke endre `updatedAt`.

## Høyremeny for knapp

Markert knapp viser:

```text
Knapp
Tekst
Lagre tekst
Design
Lenke
Element
Status
Slett knapp
```

Regler:

- knappetekst trimmes
- tom eller whitespace-only tekst avvises
- uendret tekst muterer ikke prosjektet
- design velges fra den statiske katalogen
- ukjent lagret `assetId` gir kontrollert fallback og synlig varsel
- bruker kan reparere ukjent design ved å velge et gyldig design
- låst knapp kan inspiseres, men tekst, design og lenke er deaktivert
- slettefunksjonen følger eksisterende bekreftelsesdialog

## Elementlenke

Tekstbokser og knapper bruker samme modell og samme høyremenyskjema:

```text
none
external-url { url, openInNewTab }
```

Bare absolutte `http://`- og `https://`-adresser godtas. Ugyldig eller uendret lenke muterer ikke prosjektet. Lenken åpnes aldri i editormodus.

State-API-et er generalisert fra tekstspesifikk lenke til støttede lenkbare elementer.

## State- og valideringskrav

Alle varige endringer går gjennom typede reducer-actions:

```text
add-element-to-active-page
set-button-label
set-button-asset
set-element-link
```

Reducergrensene avviser:

- manglende aktiv side
- manglende element
- feil elementtype
- låst element
- ugyldig verdi
- ukjent asset-ID
- uendret data

Ugyldige eller uendrede handlinger muterer ikke prosjektet eller `updatedAt`.

Transient state serialiseres ikke:

- intern bibliotekvisning
- knappetekstdraft
- lenkedraft
- validering og lagringsfeedback
- fokus og hover

## Fil- og arkitekturgrenser

- 250 linjer er aktiv terskel for ansvarstrekk i kildefiler.
- 300 linjer er hard unntaksgrense.
- `EditorCanvasElement.tsx` skal ikke få flere nye funksjonsansvar.
- modell, asset-katalog, state, venstrepanel, høyremeny og rendering skal ha tydelige ansvar.
- ingen tilfeldig generell `features`-samlemappe.

## Verifisert

Automatisk kontroll etter siste produksjonscommit:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 68 moduler, 158 avhengigheter, ingen brudd
Vite: 77 moduler transformert
CSS: 24.43 kB, gzip 5.12 kB
JavaScript: 239.40 kB, gzip 72.88 kB
produksjonsbuild: bestått
```

Manuell kontroll er godkjent for:

- alle fire designvarianter
- oppretting og markering
- flytting og resizing
- knappetekst og tomtekstvalidering
- designbytte
- legge til og fjerne ekstern lenke
- ingen lenkeaktivering i editormodus
- låsing og opplåsing
- sletting
- PC- og Telefon-visning
- peker- og tastaturflyt

## Gjenstår nå

Arkitekturrapportene kan ikke genereres gjennom GitHub-connectoren. Brukeren må kjøre lokalt:

```powershell
cd C:\Users\tomha\Desktop\website
git pull --ff-only origin feature/button-library
npm run architecture:json
npm run architecture:diagram
git diff --check
git status
git diff --stat
```

Deretter:

1. kontroller at bare `architecture.json` og `docs/dependency-graph.mmd` er endret
2. kontroller rapportinnhold og modul-/avhengighetstall
3. commit og push arkitekturrapportene på samme branch
4. kontroller full branchdiff mot `main`
5. utfør framtidsrettet kodeaudit
6. opprett PR mot `main`
7. kontroller mergebarhet, review-tråder og eventuell CI
8. merge bare etter eksplisitt brukergodkjenning

## Utenfor knappfasens omfang

- PNG
- egne opplastede knappfiler
- dynamisk katalog
- Canva- eller Figma-integrasjon
- tekst bakt inn i SVG
- prosjektfarger eller SVG-fargeredigering
- riktekst
- hover-, pressed- eller disabled-designvarianter
- intern sidenavigasjon
- forhåndsvisning og publisering
- historikk og autolagring
- egne mobiloverstyringer
- separat venstremenypunkt kalt `Knapper`

## Etter merge

Når PR-en er eksplisitt godkjent og merget:

```powershell
cd C:\Users\tomha\Desktop\website
git switch main
git pull --ff-only origin main
git status
git log -6 --oneline
```

Deretter skal sak #20 lukkes som fullført, dokumentstatus oppdateres og neste fase velges eksplisitt. Ikke start neste produksjonsfase automatisk.

---
