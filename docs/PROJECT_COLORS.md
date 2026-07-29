# Fase 12 – prosjektfarger og Seksjon-rammer

Dette dokumentet beskriver det implementerte omfanget og de tekniske grensene for fase 12.

## Leveransestatus

```text
fase: 12 – prosjektfarger og Seksjon-rammer
branch: feature/project-colors
GitHub-sak: #28
prosjektskjema: versjon 7
implementering: ferdig
manuell PC- og Telefon-test: godkjent
automatiske kontroller etter siste 10 px-endring: gjenstår
arkitekturrapporter etter siste produksjonsendring: gjenstår
PR: ikke opprettet
merge: ikke godkjent eller utført
```

## Funksjonelt omfang

`Farger` viser faktiske fargeegenskaper på aktiv side:

- sidebakgrunn
- Seksjon-bakgrunn
- Seksjon-rammefarge når rammetykkelsen er større enn `0`
- tekstfarge for Tekst-elementer

Hver kontroll muterer bare den konkrete siden, det konkrete elementet og den konkrete egenskapen. Like fargeverdier oppretter ingen kobling mellom elementer.

Knapper beholder ferdig SVG-fargedesign og inngår ikke i fargeredigeringen. Bilder har ingen prosjektfarge og vises ikke i `Farger`.

## Ramme

Seksjon har en serialiserbar ramme:

```ts
type SectionFrame = {
  width: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  color: EditorColor
}
```

- `0` vises som `Ingen`
- `1–10` vises som pikselbredde
- rammen ligger innenfor elementets lagrede størrelse gjennom `box-sizing: border-box`
- rammefargen beholdes når bredden settes til `0`
- rammefargen skjules fra `Farger` mens bredden er `0`
- høyremenyen og `Farger` skriver til samme prosjektverdi

## Prosjektmodell versjon 7

Versjon 7 legger til:

- `EditorPage.appearance.backgroundColor`
- `SectionEditorElement.appearance.backgroundColor`
- `SectionEditorElement.appearance.frame`
- `TextElementStyle.color`

`EditorColor` er en kanonisk, ugjennomsiktig seks-sifret heksfarge. Verdier normaliseres til formatet `#RRGGBB`. Gradienter og alpha inngår ikke.

Det finnes foreløpig ingen prosjektimport eller migreringsmotor. Framtidig import må validere skjemaversjon 7 og hele prosjektobjektet før `replace-project`.

## State- og reducergrenser

Varige fargeendringer bruker typede actions. Reduceren avviser:

- ugyldig eller ikke-kanonisk farge
- rammebredde utenfor `0–10`
- manglende aktiv side eller element
- feil elementtype
- låst Seksjon eller Tekst
- uendret verdi

Ved avvisning returneres samme state, og `updatedAt` endres ikke.

Fargegruppene i venstremenyen er avledet fra aktiv side og elementrekkefølge. De lagres ikke som en separat palett eller kopi av prosjektdata.

## Rendering og editorgrenser

- sidebakgrunn rendres fra sideutseendet
- Seksjon-bakgrunn og ramme rendres fra Seksjon-utseendet
- tekstfarge rendres fra eksisterende tekststil
- selection-outline og tekstens editorgrense er ikke publiserbare rammer
- fargeendringer påvirker ikke geometri, crop, lagrekkefølge eller ressursstate
- PC og Telefon deler farger i fase 12

Responsive fargeoverstyringer tilhører en senere fase og må bruke eksplisitte viewport-spesifikke handlinger.

## Tilgjengelighet

- fargekontrollen bruker native `input type="color"`
- kontrollen har tilgjengelig navn med nåværende farge
- fokusmarkering er synlig
- låste kontroller er deaktivert
- gruppen viser `Låst`
- panelet forblir åpent etter endring

## Sluttaudit

Auditen bekrefter:

- ingen separat lagret fargeliste
- én modellkilde for rammebredder
- dynamiske rammeetiketter fra samme verdiliste
- delt fargekontroll i høyre- og venstremeny
- `RightPropertiesPanel.tsx` forblir komposisjon
- canvas får bare rene beregnede stiler
- sentral reducer delegerer fargeansvar
- knappeassetenes farger overstyres ikke med CSS
- bilderessurslageret berøres ikke
- alle nye og berørte produksjonsfiler er under 250 linjer

## Manuell godkjenning

Godkjent på PC og Telefon:

- blank side og sidebakgrunn
- uavhengige Seksjon-farger
- ramme av/på
- rammebredde til og med 10 px
- synkron rammefarge mellom høyremeny og `Farger`
- tekstfarge
- låste kontroller
- oppretting og sletting
- utelatelse av Knapp og Bilde
- uendret bilde-, tekst-, knapp-, flytte- og resizefunksjonalitet

## Gjenstående før PR

1. trekk siste branch lokalt
2. kjør `npm run check` etter 10 px-endringen
3. regenerer `architecture.json` og `docs/dependency-graph.mmd`
4. kontroller `git diff --check`, rapportdiff og clean tree
5. oppdater kontrolltallene i dokumentasjonen dersom de endres
6. opprett og kontroller PR
7. merge bare etter eksplisitt godkjenning
