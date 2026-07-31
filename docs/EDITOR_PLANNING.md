# Plan for Website-editoren

Dette dokumentet oppsummerer produktretningen, implementert grunnlag, gjeldende leveransestatus og den låste videre rekkefølgen. Detaljert faseomfang og akseptansekriterier ligger i `docs/WORK_PLAN.md`.

## Produktdefinisjon

Website-editoren skal være en komplett lokal arbeidsportal på brukerens egen PC.

Portalen skal brukes til å:

- opprette og vedlikeholde nettsideprosjekter
- administrere sider, seksjoner, Header, Hero og elementer
- navigere raskt mellom prosjektinnhold og verktøy
- lagre og sikkerhetskopiere prosjekter lokalt
- gjenopprette etter feil eller krasj
- forhåndsvise nettsiden lokalt
- bruke OpenAI som kontrollert meddesigner i siste hovedfase

Offentlig publisering, hosting, domener og produksjonsdeployment er fjernet fra produktplanen.

## Gjeldende status

```text
siste fullførte produksjonsfase på main: 16 – automatisert testgrunnlag
gjeldende main: ecb443d384a1e0999ef14767419e1bea93c4a12c
aktiv produksjonsfase: 17 – tekstboksbakgrunn
aktiv branch: feature/phase-17-text-background
aktiv draft-PR: #50
aktiv sak: #35
prosjektskjema på branchen: versjon 10
samlet kontroll: npm run verify
automatisk kodekontroll: bestått på verifisert kode-head
manuell PC-/Telefon-regresjon: gjenstår
arkitekturrapporter etter nye moduler: synkronisert
```

Fase 15 og 16 er ferdige på `main`. Fase 17 er avgrenset til tekstboksbakgrunn og forblir draft til siste automatiske og manuelle kontroll er dokumentert.

## Implementert editorgrunnlag

- blankt PC- og Telefon-lerret
- toppmeny, venstremeny, venstrepanel og høyrepanel
- Seksjon, Bilde, Tekst, Knapp og Header
- stabil prosjektmodell med sentral state
- markering, flytting og størrelsesendring
- tastaturflytting og tastaturresize der elementtypen tillater det
- låsing for Seksjon, Bilde, Tekst og Knapp
- kontrollert tekstredigering og eksterne lenker
- sikker sletting
- bundlet SVG-knappbibliotek med stabile asset-ID-er
- lokal bilde- og logoimport
- transient ressurslager med kontrollert Object URL-livssyklus
- bildeutsnitt, zoom, alternativ tekst og metadata
- side- og elementfarger, inkludert varig tekstboksbakgrunn
- Seksjon- og Header-ramme
- korrigeringslinjer og snapping ved pekerflytting
- semantisk portaltema med tydelige interaksjonstilstander

## Gjeldende portalstruktur

```text
Prosjekt
Farger
Logo og header
Elementer
Innstillinger
```

Ansvarsdeling:

```text
Venstremeny = opprette elementer, velge fil/design og vise prosjektoversikt
Høyremeny  = egenskaper og handlinger for markert element
Lerretet   = redigere innhold og transformere elementer
Ressurslag = eie transient fil og Object URL
Prosjekt   = eie serialiserbare verdier
```

Portalstrukturen utvides i fase 18 med oversikt, sider/navigasjon, Hero/seksjoner, filer/bilder, navigator og hurtigsøk.

## Fase 15 – visuell portalstruktur

### Låst palett

```text
portal/header        #F6EFE6
panel                #FAF6F1
aktiv bakgrunn       #FFE8DA
kant                 #E6DED2
aktiv oransje        #E25A1C
mørk tekst           #1F1F1F
sekundær tekst       #6B6F76
blå ikon             #2F6DB6
grønn ikon           #2E7D32
lilla ikon           #7E3FA8
oransje ikon         #E07A24
```

Den røde topplinjen i brukerens referanseskjermbilde tilhører nettleserens dev-miljø og er ikke en del av editorens design.

### Visuell betydning

- Prosjekt bruker blått ikon.
- Farger bruker grønt ikon.
- Logo og header bruker lilla ikon.
- Elementer bruker oransje ikon.
- Innstillinger bruker nøytral mørk ikonfarge.
- Seksjon bruker blått ikon.
- Bilde bruker grønt ikon.
- Tekst bruker lilla ikon.
- Knapp bruker oransje ikon.
- valgt verktøy bruker aktiv oransje med lys oransje bakgrunn
- hover er synlig, men dempet
- fokus er tydelig for tastaturnavigasjon
- disabled er lesbart uten å se aktivt ut
- fare, advarsel og suksess har egne semantiske roller

### Teknisk retning

Portaltemaet eies av semantiske CSS-tokens i `editor-base.css`. Kontrollstiler bruker tokenroller fremfor dupliserte tilfeldige fargeverdier.

Kompatibilitetsaliasene `--text`, `--muted`, `--accent`, `--border` og `--border-strong` beholdes foreløpig fordi eldre stilfiler fortsatt bruker dem. Nye portalstiler skal bruke de eksplisitte `--portal-*`-rollene. Aliasene skal ikke fjernes før restbruken er kartlagt og migrert kontrollert.

Ikonfarger er bundet til eksplisitte variantklasser, ikke DOM-rekkefølge:

```text
rail-button--files
rail-button--design
rail-button--media
rail-button--elements
rail-button--settings

element-card--section
element-card--image
element-card--text
element-card--button
```

Dette gjør menyen og elementbiblioteket robuste når nye punkter senere legges til eller rekkefølgen endres.

### Bevarte grenser

- ingen prosjektmodellendring
- ingen skjemaversjonsendring
- ingen reducer- eller stateendring
- ingen endring i elementoppretting eller eventflyt
- ingen importgrafendring
- høyrepanelet er fortsatt 320 px
- høyrepanelet er overlay under 1680 px
- høyrepanelet reserverer plass ved 1680 px og bredere
- venstrepanelets åpne-/lukkelogikk er uendret
- `prefers-reduced-motion` er bevart
- nettsideprosjektets egne farger er uendret

### Verifisert kontroll på `7ea58a5`

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 118 moduler, 341 avhengigheter, 0 brudd
Vite: 127 moduler transformert
CSS: 45.36 kB, gzip 7.34 kB
JavaScript: 280.72 kB, gzip 83.19 kB
produksjonsbuild: bestått på 197 ms
git diff --check: ingen feil
git status --short: clean
produksjonsfiler >= 250 linjer: 0
```

Arkitekturrapportene er ikke regenerert fordi ingen import eller modulgrense er endret.

## To separate navigasjonssystemer

### Arbeidsportalens navigasjon

Brukes for å finne prosjekter, sider, elementer, paneler, verktøy og innstillinger. Denne navigasjonen er editor-UI og inngår ikke i nettsideprosjektets innhold.

### Nettsidens navigasjon

Vises i nettstedets Header og lagres som prosjektdata. Den skal senere støtte interne sider, seksjoner, eksterne lenker, aktivt menypunkt, handlingsknapp, ett nivå undermeny og automatisk responsiv meny.

## Header

Header er én egen sammensatt elementtype.

Gjeldende oppførsel:

- navn på nettsted eller firma
- valgfri undertittel
- lokal PNG-, JPEG- eller WebP-logo
- full synlig sidebredde
- fast posisjon `x = 0, y = 0`
- ingen peker- eller tastaturflytting
- høyde 70–100 px, standard 88 px
- markering og sikker sletting som ett element
- ingen låsing eller låsestatus
- bakgrunn, tekstfarge, fontfamilie, fontstørrelse og ramme

Senere Header-leveranser bygger nettstedets menynavigasjon, automatisk/horizontal/kompakt meny, redigering etter oppretting og nettstednivå kontra sidenivå.

## Hero

Hero er låst som en egen senere hovedleveranse.

Første planlagte retning:

- egen sammensatt `HeroEditorElement`
- full bredde som standard
- plassert under Header som standard
- bakgrunnsbilde eller bakgrunnsfarge
- kontrollert bildeutsnitt og valgfritt fargeoverlegg
- hovedoverskrift og undertittel
- én eller to knapper
- interne og eksterne lenker
- tekstjustering og maksimal tekstbredde
- dokumentert PC- og Telefon-oppførsel

Endelig Hero-modell låses før fase 21 starter.

## Lokal drift og data

Planen beholder flere lokale prosjekter, prosjektoversikt, autolagring, manuell lagring, snapshots, krasjgjenoppretting, sikkerhetskopi, prosjektimport og lokal fullskjermsforhåndsvisning.

Planen inneholder ikke offentlig publisering.

## OpenAI

OpenAI bygges etter at prosjektmodell, navigasjon, Hero, historikk, lagring, import og forhåndsvisning er stabile.

Planlagt bruk:

- tekst og omskriving
- fargepaletter og designinspirasjon
- bildegenerering til valgte felt
- Hero- og seksjonsgenerator
- side- og navigasjonsforslag
- komplette sideutkast
- konsistenskontroll

AI-endringer skal alltid følge:

```text
Forslag
  -> validering
  -> forhåndsvisning
  -> eksplisitt godkjenning
  -> typede actions/reducere
  -> én historikkhandling
```

API-nøkkel skal aldri ligge i Vite- eller browserkode.

## Låst videre rekkefølge

```text
fase 14  Korrigeringslinjer og snapping – fullført
fase 15  Duse portalfarger og tydelig visuell struktur – fullført
fase 16  Automatisert testgrunnlag – fullført
fase 17  Tekstboksbakgrunn – pågår
fase 18  Arbeidsportalnavigasjon, navigator og hurtigsøk
fase 19  Sider, seksjons-ID-er og navigasjonsmodell
fase 20  Nettstedets Header og menynavigasjon
fase 21  Hero
fase 22  Header-redigering og nettstedstruktur
fase 23  Responsive mobiloverstyringer
fase 24  Angre og gjør om
fase 25  Lokal prosjektlagring, autolagring og gjenoppretting
fase 26  Sikkerhetskopi, prosjektformat, import og migrering
fase 27  Lokal forhåndsvisning
fase 28  Malbibliotek og gjenbrukbare seksjoner
fase 29  OpenAI-integrasjon
```

Rekkefølgen endres ikke uten eksplisitt produktbeslutning og synkronisert dokumentasjon.

## Eksplisitt utsatt eller fjernet

Utsatt uten egen fase:

- snapping ved resizing
- snapping ved tastatur
- grid
- avstandsmål
- automatisk fordeling
- flermerking og gruppering
- flere mobile brytepunkter
- nettbrett som egen viewport
- automatisk kollisjonsunngåelse
- AI-generert mobiloppsett
- generell CSS-editor
- mer enn ett undermenynivå

Fjernet fra produktplanen:

- offentlig publisering
- hosting
- domener
- deployment
