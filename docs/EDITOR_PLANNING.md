# Plan for Website-editoren

Dette dokumentet viser implementert grunnlag, aktiv fase og senere leveranser.

## Gjeldende status

```text
aktiv fase: 13 â€“ Logo og header
branch: feature/logo-header
GitHub-sak: #31
prosjektskjema: versjon 8
manuell funksjonstest: gjenstÃ¥r
kodeaudit og dokumentasjonsopprydding: gjennomfÃ¸rt
automatisk sluttkontroll: bestÃ¥tt etter Header pointer-preview-rettelse
PR: ikke opprettet
```

## Implementert editorgrunnlag

- blankt PC- og Telefon-lerret
- toppmeny, venstremeny og hÃ¸yremeny
- Seksjon, Bilde, Tekst, Knapp og Header
- stabil prosjektmodell med sentral state
- markering, flytting, stÃ¸rrelsesendring og lÃ¥sing
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
HÃ¸yremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere innhold og transformere elementer
Ressurslag = eie transient fil og Object URL
Prosjekt   = eie serialiserbare verdier
```

## Fase 13 â€“ Logo og header

Header er Ã©n egen sammensatt elementtype, ikke en gruppe av Seksjon, Bilde og Tekst.

Oppretting:

- navn pÃ¥ nettsted eller firma
- valgfri undertittel
- lokal PNG-, JPEG- eller WebP-logo
- eksisterende bildevalidering og ressurslager gjenbrukes
- Header opprettes fÃ¸rst nÃ¥r tekst og fil er gyldige

OppfÃ¸rsel:

- full synlig sidebredde i PC og Telefon
- horisontal plassering og bredde er faste
- bare vertikal flytting
- pointer-preview holder Header ved `x = 0` under hele dragoperasjonen
- hÃ¸yde 70â€“100 px, standard 88 px
- markering, lÃ¥sing og sletting som ett element
- egenskapspanel kan lukkes under transform og Ã¥pnes fra objektverktÃ¸yet

Utseende:

- bakgrunn
- felles tekstfarge for navn og undertittel
- Ã©n font for navn og undertittel
- ramme `Ingen` eller 1â€“10 px
- rammefarge vises i `Farger` nÃ¥r rammen er aktiv

## Responsiv retning

- Telefon arver desktopgeometri nÃ¥r mobiloverstyring mangler.
- Header fÃ¸lger alltid aktiv lerretsbredde.
- Header y og hÃ¸yde er forelÃ¸pig felles for PC og Telefon.
- Egne mobiloverstyringer bygges fÃ¸rst i fase 15.

## GjenstÃ¥ende fÃ¸r fase 13 kan merges

- kontroller foreldede dokumentreferanser og foreldede breddekontrakter
- gjennomfÃ¸r full manuell regresjonstest
- kontroller filstÃ¸rrelser og samlet diff
- opprett og inspiser PR
- innhent eksplisitt mergegodkjenning

## Senere faser

```text
fase 14  korrigeringslinjer
fase 15  responsive mobiloverstyringer
fase 16  angre og gjÃ¸r om
fase 17  lokal automatisk lagring
fase 18  Ã¥pne og importere prosjekt
fase 19  forhÃ¥ndsvisning og publisering
```

Ã…pne beslutninger for senere faser lÃ¥ses fÃ¸rst nÃ¥r den aktuelle fasen starter. De skal ikke bygges inn i fase 13.
