# ChatGPT clipboard-workflow for Website-editoren

Dette dokumentet beskriver en alternativ AI-retning for Website-editoren der ChatGPT brukes manuelt som meddesigner uten direkte OpenAI API-integrasjon i editoren.

Dokumentet er en produkt- og arkitekturreferanse for senere arbeid. `docs/WORK_PLAN.md` er fortsatt autoritativ for faseorden og aktiv leveranse.

## Formål

Målet er å kunne sende et valgt område fra Website-editoren til ChatGPT med korrekte visuelle proporsjoner og eksakte editor-data, be ChatGPT foreslå en forbedring, og deretter føre resultatet kontrollert tilbake til editoren.

Løsningen skal:

- bruke eksisterende ChatGPT-abonnement manuelt fremfor å kreve API-kall for hver designoppgave
- bevare ekte bredde, høyde og andre begrensninger fra editoren
- gjøre det raskt å bruke ChatGPT på Header, Hero, Seksjon, Tekst, farger, bilder og senere komplette sideområder
- aldri la ChatGPT endre prosjektstate direkte
- validere alt som kommer tilbake før det kan bli prosjektdata
- la brukeren forhåndsvise og eksplisitt godkjenne endringen
- passe inn i eksisterende prosjektmodell, actions, reducere og senere undo/redo

## Grunnidé

Brukeren markerer eller låser et område i editoren, for eksempel Header, Hero, Seksjon eller et annet avgrenset område.

Editoren tilbyr en kommando, for eksempel via høyre museknapp:

```text
Kopier til ChatGPT
```

Denne handlingen lager et kontrollert AI-utklipp som består av:

1. et bilde av det valgte området i samme sideforhold som editorområdet
2. eksakte mål i editorens koordinatsystem
3. elementtype og relevante prosjektverdier
4. begrensninger som ChatGPT skal respektere
5. et standardisert returformat som Website-editoren kan lese senere

Brukeren limer eller drar materialet inn i ChatGPT, skriver ønsket kommando og lar ChatGPT lage et forslag.

Når forslaget er ferdig, kopierer eller drar brukeren resultatet tilbake til Website-editoren.

Editoren validerer resultatet, viser en forhåndsvisning og endrer først prosjektet når brukeren godkjenner.

## Overordnet arbeidsflyt

```text
Website-editor
      |
      | marker område
      v
Kopier til ChatGPT
      |
      | bilde + eksakte data + begrensninger
      v
ChatGPT
      |
      | bruker skriver ønsket kommando
      v
AI-forslag
      |
      | strukturert data eller bilde
      v
Website-editor
      |
      | validering
      v
Forhåndsvis forslag
      |
      | eksplisitt godkjenning
      v
Typede actions / reducere
      |
      v
Prosjektstate
```

## Hvorfor bilde alene ikke er nok

Et skjermbilde viser hvordan området ser ut, men skal ikke være eneste sannhetskilde for størrelse eller prosjektdata.

Website-editoren kjenner de faktiske verdiene og skal derfor alltid legge dem ved eksplisitt.

Eksempel:

```text
Type: Header
Viewport: PC
Width: 1200 px
Height: 88 px
X: 0 px
Y: 0 px
Background: #F6EFE6
TextColor: #1F1F1F
```

Dermed trenger ikke ChatGPT å gjette størrelsen fra et skjermbilde.

## AI-utklipp

Første versjon bør bygge et enkelt standardisert utklipp.

Eksempel:

```text
WEBSITE_EDITOR_CLIP v1

Type: header
Viewport: desktop
Width: 1200
Height: 88
LockedFrame: true

Constraints:
- behold nøyaktig bredde 1200 px
- behold nøyaktig høyde 88 px
- innhold skal holde seg innenfor rammen
- bruk bare verdier som Website-editoren støtter
- ikke returner tilfeldig HTML eller CSS

CurrentDesign:
- backgroundColor: #F6EFE6
- textColor: #1F1F1F
- logoPosition: left
- navigationPosition: right
```

Utklippet kan senere utvides med:

- side-ID
- element-ID
- prosjektfarger
- fonttokens
- spacing-regler
- responsive verdier
- navigasjonsstruktur
- lenker
- tilgjengelige knappdesign
- støttede asset-ID-er
- Hero- og seksjonsmetadata

## Visuelt bilde i utklippet

Editoren bør kunne lage et PNG-bilde av det valgte området.

Krav:

- bildet bruker samme sideforhold som editorområdet
- området eksporteres uten unødvendig editor-UI rundt
- selection-outline, resizegrep og andre editor-hjelpemidler kan skjules i eksportbildet
- bildet brukes som visuell kontekst, ikke som autoritativ prosjektstate
- faktiske mål sendes alltid separat

Eksempel:

```text
Header-ramme i editor:
1200 x 88

Eksportbilde:
samme proporsjon 1200:88

Metadata:
width = 1200
height = 88
```

## Aktivering i editoren

Aktuelle innganger:

- høyreklikk på markert element -> `Kopier til ChatGPT`
- høyreklikk på markert område -> `Kopier område til ChatGPT`
- senere tastatursnarvei
- senere egen AI-handling i høyrepanelet

Første versjon bør velge én enkel inngang og unngå flere parallelle måter å gjøre samme handling på.

## Eksempel: Header

Brukeren markerer Header og velger `Kopier til ChatGPT`.

Editoren kopierer bilde og metadata.

Brukeren skriver i ChatGPT:

```text
Gjør denne Header-en mer moderne og rolig.
Behold nøyaktig størrelse.
Designet skal passe til resten av siden.
```

ChatGPT skal få nok informasjon til å vite:

- Headerens eksakte størrelse
- tilgjengelige farger
- gjeldende logo
- eksisterende navigasjon
- støttede fontverdier
- hvilke deler editorens modell faktisk kan lagre

## Eksempel: Hero

Brukeren markerer Hero-området og sender det til ChatGPT.

Mulige kommandoer:

```text
Gjør denne Hero-en mer profesjonell uten å endre størrelsen.
```

```text
Lag et nytt bakgrunnsbilde som passer til denne Hero-en og behold samme format.
```

```text
Forbedre teksthierarkiet og plasseringen, men behold eksisterende fargepalett.
```

Hero-utklippet kan inneholde:

- bredde og høyde
- bakgrunnsfarge eller bildeinformasjon
- hovedoverskrift
- undertittel
- knapper
- tekstjustering
- maksimal tekstbredde
- prosjektfarger
- relevante responsive regler

## Eksempel: Seksjon

Brukeren kan markere en Seksjon og be:

```text
Denne seksjonen ser tom ut. Lag et bedre oppsett som passer til Header og Hero.
```

ChatGPT får både skjermbildet av Seksjonen og et strukturert sammendrag av tilgjengelige elementer.

Målet er at forslaget skal kunne oversettes tilbake til editorens egne elementer i stedet for å returnere en tilfeldig nettsideimplementasjon.

## To returtyper

Løsningen bør skille mellom strukturelle designendringer og bildefiler.

### 1. Strukturert designretur

Brukes for:

- Header
- Hero-oppsett
- Seksjoner
- tekst
- farger
- typografi
- navigasjon
- plassering og størrelse
- senere komplette sideutkast

ChatGPT returnerer data i et avtalt format.

Eksempel:

```json
{
  "format": "website-editor-ai-v1",
  "type": "header",
  "width": 1200,
  "height": 88,
  "backgroundColor": "#F6EFE6",
  "textColor": "#1F1F1F",
  "logoPosition": "left",
  "navigationAlignment": "right"
}
```

Website-editoren skal aldri stole direkte på JSON-en.

Den skal:

1. parse formatet
2. kontrollere formatversjon
3. kontrollere elementtype
4. kontrollere bredde og høyde mot valgt ramme
5. validere alle verdier med eksisterende modellvalidatorer
6. avvise ukjente felter eller ustøttede verdier der det er nødvendig
7. lage transient forhåndsvisning
8. kreve eksplisitt godkjenning
9. sende godkjente verdier gjennom typede actions/reducere

### 2. Bilderetur

Brukes for:

- Hero-bakgrunner
- illustrasjoner
- seksjonsbilder
- andre visuelle assets

Arbeidsflyt:

```text
Editor -> bilde til ChatGPT -> generert/endret bilde -> tilbake til editor
```

Bildet behandles gjennom editorens eksisterende fil- og assetgrense.

Det skal ikke oppstå en separat AI-spesialvei som omgår vanlig filvalidering.

## Lim inn AI-forslag

Editoren kan senere få en handling:

```text
Lim inn AI-forslag
```

Denne skal bare akseptere kjent Website-editor-format.

Hvis utklippstavlen inneholder vanlig tekst, tilfeldig JSON, HTML eller ukjent struktur, skal editoren ikke mutere prosjektet.

Feilmelding skal være tydelig, for eksempel:

```text
Dette er ikke et gyldig Website-editor-forslag.
```

## Forhåndsvisning før godkjenning

AI-resultater skal være transient state frem til brukeren godkjenner.

Eksempel:

```text
AI-forslag til Header

[Forhåndsvisning]

Avbryt    Bruk forslag
```

`Avbryt`:

- endrer ikke prosjektet
- endrer ikke `updatedAt`
- rydder transient AI-state

`Bruk forslag`:

- kjører endringen gjennom vanlig validert stateflyt
- oppdaterer bare tillatte prosjektverdier
- skal senere registreres som én undo/redo-handling

## Viktig sikkerhetsgrense

ChatGPT skal aldri få direkte kontroll over prosjektstate.

Følgende er ikke tillatt:

```text
ChatGPT -> direkte mutation av EditorProject
```

Riktig modell:

```text
ChatGPT
  -> forslag
  -> lokal parsing
  -> validering
  -> forhåndsvisning
  -> bruker godkjenner
  -> typede actions
  -> reducer
```

Dette følger eksisterende prosjektregel om at reducere er siste mutasjonsgrense.

## Ingen tilfeldig HTML/CSS som hovedformat

Website-editoren bør ikke bygge AI-integrasjonen rundt kopiering av ferdig HTML og CSS.

Årsaker:

- editoren har sin egen serialiserbare prosjektmodell
- rå HTML/CSS kan inneholde verdier editoren ikke støtter
- det blir vanskeligere å validere
- det kan skape parallelle sannhetskilder
- responsive regler kan bli inkonsistente
- undo/redo og prosjektimport blir vanskeligere

ChatGPT skal derfor primært arbeide mot et dokumentert Website-editor-format.

## Kopier hele områder

På sikt bør løsningen kunne eksportere mer enn ett element.

Eksempler:

- Header alene
- Hero alene
- én Seksjon
- Header + Hero
- flere valgte elementer innenfor et rektangulært område
- senere en hel side

Et områdeutklipp må inneholde en tydelig koordinatramme.

Eksempel:

```json
{
  "frame": {
    "width": 1200,
    "height": 640
  },
  "elements": [
    {
      "kind": "text",
      "x": 80,
      "y": 100,
      "width": 520,
      "height": 120
    },
    {
      "kind": "button",
      "x": 80,
      "y": 260,
      "width": 180,
      "height": 48
    }
  ]
}
```

ChatGPT kan da foreslå ny plassering uten å miste den faktiske rammen området skal passe inn i.

## Låst ramme

Brukeren foreslo at et område kan låses før det sendes til ChatGPT.

Dette er nyttig og bør vurderes eksplisitt.

`Låst AI-ramme` betyr:

- yttergrensen kan ikke endres av AI-forslaget
- bredde og høyde er absolutte begrensninger
- AI kan bare endre innholdet innenfor rammen
- editoren avviser retur som forsøker å endre rammens størrelse dersom rammen er låst

Dette er særlig relevant for:

- Header
- Hero
- ferdige Seksjoner
- områder som allerede passer inn i et større sideoppsett

## Designkontekst

For at ChatGPT skal lage noe som faktisk passer inn, bør utklippet kunne inkludere et begrenset sammendrag av resten av designet.

Eksempel:

```text
ProjectDesignContext:
- pageBackground: #FFFFFF
- primaryColor: #E25A1C
- secondaryColor: #1F1F1F
- panelTone: #F6EFE6
- headingFont: System
- bodyFont: System
- headerHeight: 88
```

Senere kan editoren også legge ved:

- skjermbilde av området før/etter valgt element
- Header-sammendrag
- Hero-sammendrag
- prosjektets fargegrupper
- tilgjengelige knappdesign
- sidenavigasjon

Mengden kontekst skal holdes kontrollert og relevant.

## Personvern og datakontroll

Før `Kopier til ChatGPT` bør editoren vite nøyaktig hva som eksporteres.

Interne notater eller andre editor-only data skal ikke sendes automatisk.

Prinsipp:

```text
Bare data som er nødvendig for det valgte AI-arbeidet eksporteres.
```

Eventuelle framtidige interne notater skal være eksplisitt ekskludert som standard.

## Kostnadsmodell

Denne arbeidsflyten er bevisst laget slik at Website-editoren ikke trenger å sende automatiske API-kall for hver designendring.

ChatGPT brukes manuelt utenfor editorens runtime.

Fordeler:

- ingen API-nøkkel i Website-editoren
- ingen separat backend nødvendig for første AI-versjon
- ingen egen API-bruksmåling i editoren
- ingen risiko for at editoren automatisk sender mange kostbare forespørsler
- brukeren beholder full kontroll mellom hvert steg

Dette utelukker ikke senere OpenAI API-integrasjon.

Formatet og valideringsgrensene bør tvert imot bygges slik at samme mekanisme senere kan brukes av en API-basert integrasjon dersom det blir ønskelig.

## Forholdet til tidligere fase 29

Den gamle AI-planen beskrev OpenAI som kontrollert meddesigner med blant annet:

- tekst og omskriving
- fargepaletter og designinspirasjon
- bildegenerering
- Hero- og seksjonsgenerator
- side- og navigasjonsforslag
- komplette sideutkast
- konsistenskontroll

Denne clipboard-workflowen endrer først og fremst transportlaget.

Tidligere tenkt modell:

```text
Website-editor -> egen backend -> OpenAI API -> forslag -> editor
```

Ny mulig første modell:

```text
Website-editor -> kontrollert utklipp -> ChatGPT -> kontrollert retur -> editor
```

De samme sikkerhetsprinsippene beholdes:

```text
Forslag
  -> validering
  -> forhåndsvisning
  -> eksplisitt godkjenning
  -> typede actions/reducere
  -> én historikkhandling
```

## Senere API-oppgradering

Hvis direkte OpenAI-integrasjon senere blir ønsket, skal editorens AI-format kunne gjenbrukes.

Da kan arkitekturen bli:

```text
Website-editor
  -> AI request builder
  -> sikker backend
  -> OpenAI API
  -> samme Website-editor-returformat
  -> samme validator
  -> samme forhåndsvisning
  -> samme godkjenningsflyt
```

Dermed unngår vi å bygge AI-funksjonen to ganger.

Clipboard-versjonen kan fungere som første produktversjon og samtidig definere kontrakten for en senere API-versjon.

## Foreslått implementeringsrekkefølge

Denne planen skal ikke implementeres før de prosjektmodellene den avhenger av er stabile.

Når AI-arbeidet senere starter, anbefales følgende rekkefølge:

### Trinn 1 – AI-utklipp for ett element

- støtt Header eller Seksjon først
- lag eksportbilde
- legg ved eksakte mål
- legg ved relevant designkontekst
- kopier en standardisert tekstpakke

### Trinn 2 – standard returformat

- definer `website-editor-ai-v1`
- implementer runtime-validator
- avvis ukjente eller ugyldige forslag
- ingen prosjektmutasjon ennå

### Trinn 3 – forhåndsvisning

- parse et gyldig forslag
- vis transient preview
- Avbryt / Bruk forslag

### Trinn 4 – godkjent import

- send godkjente felt gjennom typede actions/reducere
- ingen direkte `EditorProject`-erstatning

### Trinn 5 – bilde-workflow

- eksport av valgt visuelt område
- retur av generert bilde
- vanlig bildevalidering og assetregistrering

### Trinn 6 – områdepakker

- flere elementer
- låst ytre ramme
- koordinater relativt til området
- Hero og komplette Seksjoner

### Trinn 7 – senere hele sider

- sideutklipp
- sideforslag
- navigasjon
- komplette sideutkast

### Trinn 8 – vurder API

Først når den manuelle arbeidsflyten er stabil vurderes om direkte API-integrasjon faktisk gir nok verdi til å forsvare mer kompleksitet og kostnad.

## Akseptansekriterier for første versjon

Første reelle versjon bør minst tilfredsstille:

- ett valgt element kan eksporteres med visuelt bilde og eksakte mål
- eksporterte mål samsvarer med prosjektmodellen, ikke DOM-gjetting
- eksporten inneholder tydelig elementtype og formatversjon
- ChatGPT kan få en eksplisitt låst ramme
- returformatet er dokumentert og runtime-validert
- ugyldig retur kan aldri mutere prosjektet
- et gyldig forslag vises som transient preview
- Avbryt endrer ikke prosjektet eller `updatedAt`
- Bruk forslag går gjennom eksisterende typede stategrenser
- AI-forslag kan aldri omgå låsing eller modellvalidatorer
- editor-only data eksporteres ikke automatisk
- ingen API-nøkkel ligger i Vite- eller browserkode
- eksisterende PC- og Telefon-funksjonalitet fungerer som før

## Ikke del av første versjon

- direkte automatiske OpenAI API-kall
- AI som endrer prosjektet uten godkjenning
- rå HTML/CSS som permanent prosjektformat
- automatisk opplasting av hele prosjektet til ChatGPT
- automatisk deling av interne notater
- bakgrunnsagent som kontinuerlig analyserer prosjektet
- auto-genererte endringer uten preview
- skjult kostnadsbruk

## Produktbeslutning som skal huskes

Website-editorens første AI-retning skal vurderes som en manuell, kontrollert ChatGPT-workflow før direkte API-integrasjon.

Kjerneideen er:

```text
Marker eller lås et område
-> kopier området med ekte mål og relevant prosjektdata
-> bruk ChatGPT som meddesigner
-> kopier eller dra resultatet tilbake
-> valider lokalt
-> forhåndsvis
-> godkjenn eksplisitt
-> bruk eksisterende prosjektmodell
```

Dette skal gjøre ChatGPT nyttig som designverktøy uten at Website-editoren trenger å gi AI direkte kontroll eller betale for automatiske API-kall fra første versjon.
