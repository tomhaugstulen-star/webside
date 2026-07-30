# Plan for Website-editoren

Dette dokumentet viser implementert grunnlag, aktiv fase og senere leveranser.

## Gjeldende status

```text
aktiv fase: 13 – Logo og header
branch: feature/logo-header
GitHub-sak: #31
pull request: #32 – åpen, ikke draft
prosjektskjema: versjon 8
manuell funksjonstest: godkjent
kodeaudit og dokumentasjonsopprydding: gjennomført
automatisk sluttkontroll: bestått etter siste produksjonsendring
merge: ikke godkjent
```

## Implementert editorgrunnlag

- blankt PC- og Telefon-lerret
- toppmeny, venstremeny og høyremeny
- Seksjon, Bilde, Tekst, Knapp og Header
- stabil prosjektmodell med sentral state
- markering, flytting og størrelsesendring
- låsing for Seksjon, Bilde, Tekst og Knapp
- kontrollert tekstredigering og eksterne lenker
- sikker sletting
- bundlet SVG-knappbibliotek
- lokal bilde- og logoimport
- transient ressurslager med kontrollert Object URL-livssyklus
- bildeutsnitt, zoom, alternativ tekst og metadata
- side- og elementfarger
- Seksjon- og Header-ramme

## Menystruktur

```text
Prosjekt
Farger
Logo og header
Elementer
Innstillinger
```

```text
Venstremeny = opprette elementer, velge fil/design og vise prosjektoversikt
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere innhold og transformere elementer
Ressurslag = eie transient fil og Object URL
Prosjekt   = eie serialiserbare verdier
```

## Fase 13 – Logo og header

Header er én egen sammensatt elementtype, ikke en gruppe av Seksjon, Bilde og Tekst.

Oppretting:

- navn på nettsted eller firma
- valgfri undertittel
- lokal PNG-, JPEG- eller WebP-logo
- eksisterende bildevalidering og ressurslager gjenbrukes
- Header opprettes først når tekst og fil er gyldige
- vellykket oppretting overfører eierskap til logoressursen før lokal UI-opprydding
- venstrepanelet lukkes gjennom den felles opprettingsflyten, ikke en ekstra Header-callback

Oppførsel:

- full synlig sidebredde i PC og Telefon
- horisontal plassering og bredde er faste
- bare vertikal flytting
- pointer-preview holder Header ved `x = 0` under hele dragoperasjonen
- høyde 70–100 px, standard 88 px
- markering og sikker sletting som ett element
- ingen låseknapp eller låsestatus
- låsereduceren avviser Header
- egenskapspanel kan lukkes under transform og åpnes fra objektverktøyet

Utseende:

- bakgrunn
- felles tekstfarge for navn og undertittel
- én font for navn og undertittel
- ramme `Ingen` eller 1–10 px
- rammefarge vises i `Farger` når rammen er aktiv

## Responsiv retning

- Telefon arver desktopgeometri når mobiloverstyring mangler.
- Header følger alltid aktiv lerretsbredde.
- Header y og høyde er foreløpig felles for PC og Telefon.
- Egne mobiloverstyringer bygges først i fase 15.

## Verifisert fase-13-kontroll

Automatisk:

- ESLint bestått
- TypeScript bestått
- Dependency Cruiser: 113 moduler, 324 avhengigheter, ingen brudd
- Vite: 122 moduler transformert
- produksjonsbuild bestått på 206 ms
- alle seks filer i siste opprydding er under 250 linjer

Manuelt:

- Header og logooppretting godkjent
- PC- og Telefon-visning godkjent
- pointer- og tastaturregler godkjent
- font, farger og ramme godkjent
- sikker sletting og delt asset-livssyklus godkjent
- Header uten låsing godkjent
- låsing for øvrige elementtyper godkjent
- Seksjon, Bilde, Tekst og Knapp regresjonstestet

## Gjenstående før fase 13 kan merges

- inspiser full PR-diff mot `main` og issue #31
- kontroller mergebarhet, reviews, uløste tråder og CI
- innhent eksplisitt mergegodkjenning

## Senere faser

```text
fase 14  korrigeringslinjer
fase 15  responsive mobiloverstyringer
fase 16  angre og gjør om
fase 17  lokal automatisk lagring
fase 18  åpne og importere prosjekt
fase 19  forhåndsvisning og publisering
```

Åpne beslutninger for senere faser låses først når den aktuelle fasen starter. De skal ikke bygges inn i fase 13.
