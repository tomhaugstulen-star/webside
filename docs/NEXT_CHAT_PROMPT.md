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

Det utvikles aldri direkte på `main`. Ikke merge uten eksplisitt godkjenning. Ikke påstå at lokale tester eller clean tree er godkjent uten faktisk terminaloutput.

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
10. øvrige fasedokumenter

## Gjeldende repo- og arbeidsstatus

```text
main: 5e548ad
PR #21: Build first bundled SVG button library – merget
GitHub-sak #20: lukket som fullført
prosjektskjema: versjon 5
neste produksjonsfase: ikke valgt
```

Sluttverifisering for knappfasen:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 69 moduler, 161 avhengigheter, ingen brudd
Vite: 78 moduler transformert
CSS: 24.43 kB, gzip 5.12 kB
JavaScript: 239.41 kB, gzip 72.88 kB
produksjonsbuild: bestått
arkitekturrapport: 0 brudd, 0 feil, 0 advarsler
PC og Telefon: godkjent
peker og tastatur: godkjent
```

Start alltid med faktisk lokal status:

```powershell
cd C:\Users\tomha\Desktop\website
git fetch origin
git switch main
git pull --ff-only origin main
git status
git log -6 --oneline
```

Forventet øverste mergecommit:

```text
5e548ad Merge pull request #21 from tomhaugstulen-star/feature/button-library
```

Working tree skal være clean før planlegging eller ny branch.

## Ferdig funksjonalitet

- blankt PC- og Telefon-lerret
- kontrollert topp- og venstremeny
- Seksjon, Bilde, Tekst og Knapp
- prosjektmodell og sentral state
- markering, flytting, resizing og låsing
- kontrollert flerlinjet tekstredigering
- høyremenyens grunnstruktur
- tekstegenskaper
- eksterne lenker
- sikker sletting
- første bundlede SVG-knappbibliotek

## Knappbiblioteket som nå ligger på `main`

Brukerflyt:

```text
Elementer -> Knapp -> velg ett av fire design
```

Stabile asset-ID-er:

```text
button.primary-rounded.v1
button.secondary-rounded.v1
button.outline-rounded.v1
button.dark-rounded.v1
```

Assets ligger under `src/assets/buttons/`, bundles statisk av Vite og inneholder ikke tekst, script, `foreignObject`, eksterne URL-er eller rasterbilder.

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

`ButtonAssetId` er en validert og brandet stabil streng. Modellaget importerer ikke SVG-filer eller Vite-genererte adresser.

## State- og valideringsgrenser

Alle varige endringer går gjennom typede reducer-actions.

Reducergrensene avviser:

- manglende aktiv side
- manglende element
- feil elementtype
- låst element
- ugyldig verdi
- ukjent asset-ID
- uendret data

Ugyldige eller uendrede handlinger muterer ikke prosjektet eller `updatedAt`.

Opprettingsansvaret ligger i `src/state/addElementToActivePage.ts`. Den sentrale reduceren er 217 linjer etter framtidsrettet refaktor.

## Høyremeny for knapp

Markert knapp viser knappetekst, design, lenke, status og sletting.

- knappetekst trimmes
- tom tekst avvises
- ukjent lagret `assetId` gir fallback og synlig varsel
- ukjent design kan repareres ved å velge gyldig design
- låst knapp kan inspiseres, men ikke endres
- lenken åpnes aldri i editormodus

## Faste fil- og arkitekturgrenser

- 250 linjer er aktiv terskel for ansvarstrekk i kildefiler.
- 300 linjer er hard unntaksgrense.
- `EditorCanvasElement.tsx` skal ikke få flere nye funksjonsansvar.
- `RightPropertiesPanel.tsx` skal være komposisjon.
- modell, asset-katalog, state, venstrepanel, høyremeny og rendering skal ha tydelige ansvar.
- ingen tilfeldig generell `features`-samlemappe.

## Neste arbeid

Ingen ny produksjonsfase er valgt. Neste chat skal:

1. bekrefte lokal `main` og clean tree
2. lese autoritative dokumenter
3. velge én avgrenset neste fase sammen med brukeren
4. opprette ny GitHub-sak og feature-branch først etter at omfanget er låst
5. ikke blande inn funksjoner fra senere faser

Aktuelle senere faser står i `docs/WORK_PLAN.md`. Ikke start en av dem automatisk.

---
