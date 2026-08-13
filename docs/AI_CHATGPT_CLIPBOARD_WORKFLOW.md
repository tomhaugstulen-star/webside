# ChatGPT clipboard-workflow for Website-editoren

Dette dokumentet beskriver den låste AI-retningen for Website-editoren.

`docs/WORK_PLAN.md` er autoritativ for faseorden og aktiv leveranse. Dette dokumentet er produkt- og arkitekturreferansen for fase 29.

## Låst produktbeslutning

Website-editoren er et lokalt énbrukerverktøy, og AI-funksjonen skal bruke brukerens eksisterende ChatGPT Plus-abonnement manuelt utenfor editorens runtime.

Den planlagte modellen er:

```text
Website-editor
  -> kontrollert utklipp
  -> ChatGPT
  -> kontrollert retur
  -> lokal validering
  -> forhåndsvisning
  -> eksplisitt godkjenning
  -> typede actions/reducere
  -> prosjektstate
```

Følgende er eksplisitt ikke del av prosjektplanen:

- direkte OpenAI API-integrasjon
- egen AI-backend
- API-nøkler i editoren
- automatiske AI-kall fra Website-editoren
- egen API-bruksmåling eller API-kostnadslogikk

Dette er ikke en midlertidig førsteversjonsbegrensning. Det er den valgte produktretningen. Den endres bare ved en ny, uttrykkelig beslutning fra brukeren, og en slik endring skal dokumenteres i `docs/WORK_PLAN.md` før kodearbeid starter.

## Formål

Målet er å kunne sende et valgt område fra Website-editoren til ChatGPT med korrekte visuelle proporsjoner og eksakte editor-data, be ChatGPT foreslå en forbedring, og deretter føre resultatet kontrollert tilbake til editoren.

Løsningen skal:

- bruke ChatGPT manuelt som meddesigner
- bevare ekte bredde, høyde og andre begrensninger fra editoren
- gjøre det raskt å bruke ChatGPT på Header, Hero, Seksjon, Tekst, farger, bilder og senere komplette sideområder
- aldri la ChatGPT endre prosjektstate direkte
- validere alt som kommer tilbake før det kan bli prosjektdata
- la brukeren forhåndsvise og eksplisitt godkjenne endringen
- passe inn i eksisterende prosjektmodell, actions, reducere og undo/redo

## Grunnidé

Brukeren markerer eller låser et område i editoren, for eksempel Header, Hero, Seksjon eller et annet avgrenset område.

Editoren tilbyr én tydelig handling i første versjon:

```text
Kopier til ChatGPT
```

Handlingen lager et kontrollert AI-utklipp som består av:

1. et bilde av det valgte området i samme sideforhold som editorområdet
2. eksakte mål i editorens koordinatsystem
3. elementtype og relevante prosjektverdier
4. begrensninger som ChatGPT skal respektere
5. relevant designkontekst
6. et standardisert returformat som Website-editoren kan lese
7. en ferdig instruks som gjør at brukeren slipper å gjenta tekniske krav manuelt

Brukeren limer eller drar materialet inn i ChatGPT og skriver selve designønsket, for eksempel:

```text
Gjør denne seksjonen mer moderne og rolig.
```

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
      | bilde + eksakte data + begrensninger + ferdig instruks
      v
ChatGPT
      |
      | bruker beskriver ønsket endring
      v
AI-forslag
      |
      | strukturert data eller bilde
      v
Website-editor
      |
      | parsing og validering
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

Website-editoren kjenner de faktiske verdiene og skal alltid legge dem ved eksplisitt.

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

ChatGPT skal dermed ikke måtte gjette tekniske mål fra et skjermbilde.

## AI-utklipp

Første versjon skal bygge et enkelt standardisert utklipp.

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

Editoren skal kunne lage et PNG-bilde av det valgte området.

Krav:

- bildet bruker samme sideforhold som editorområdet
- området eksporteres uten unødvendig editor-UI rundt
- selection-outline, resizegrep og andre editor-hjelpemidler skjules i eksportbildet når det er praktisk
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

Første versjon skal ha én primær inngang for å unngå parallelle arbeidsmåter.

Foretrukket inngang:

```text
Kopier til ChatGPT
```

Den kan ligge i kontekstmeny eller et annet naturlig sted når fase 29 spesifiseres, men funksjonen skal være den samme.

Senere kan en tastatursnarvei eller sekundær inngang legges til dersom det faktisk gir verdi.

## Eksempel: Header

Brukeren markerer Header og velger `Kopier til ChatGPT`.

Editoren lager bilde, metadata, begrensninger og ferdig teknisk instruks.

Brukeren trenger da bare å skrive for eksempel:

```text
Gjør denne Header-en mer moderne og rolig.
Designet skal passe til resten av siden.
```

ChatGPT skal allerede ha nok informasjon til å vite:

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

Løsningen skal skille mellom strukturelle designendringer og bildefiler.

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

Website-editoren skal aldri stole direkte på returdataene.

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

Editoren kan få en handling:

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
- registreres som én undo/redo-handling når historikkfunksjonen finnes

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

Dette følger prosjektregelen om at reducere er siste mutasjonsgrense.

## Ingen tilfeldig HTML/CSS som hovedformat

Website-editoren skal ikke bygge AI-workflowen rundt kopiering av ferdig HTML og CSS.

Årsaker:

- editoren har sin egen serialiserbare prosjektmodell
- rå HTML/CSS kan inneholde verdier editoren ikke støtter
- det blir vanskeligere å validere
- det kan skape parallelle sannhetskilder
- responsive regler kan bli inkonsistente
- undo/redo og prosjektimport blir vanskeligere

ChatGPT skal derfor primært arbeide mot et dokumentert Website-editor-format.

## Kopier hele områder

På sikt skal løsningen kunne eksportere mer enn ett element.

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

## Låst AI-ramme

Et område kan sendes med låst ytre ramme.

`LockedFrame: true` betyr:

- yttergrensen kan ikke endres av AI-forslaget
- bredde og høyde er absolutte begrensninger
- AI kan bare endre innholdet innenfor rammen
- editoren avviser retur som forsøker å endre rammens størrelse

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

- skjermbilde av området før eller etter valgt element
- Header-sammendrag
- Hero-sammendrag
- prosjektets fargegrupper
- tilgjengelige knappdesign
- sidenavigasjon

Mengden kontekst skal holdes kontrollert og relevant.

## Personvern og datakontroll

Før `Kopier til ChatGPT` skal editoren vite nøyaktig hva som eksporteres.

Interne notater eller andre editor-only data skal ikke sendes automatisk.

Prinsipp:

```text
Bare data som er nødvendig for det valgte AI-arbeidet eksporteres.
```

Eventuelle interne notater skal være eksplisitt ekskludert som standard.

## Lokal og enkel arkitektur

AI-workflowen skal ikke innføre nettverksarkitektur i Website-editoren.

Det betyr:

- ingen AI-server
- ingen autentisering mot en AI-tjeneste
- ingen hemmeligheter eller tokens i Vite/browserkode
- ingen nettverkskø for AI-jobber
- ingen bakgrunnsagent
- ingen automatisk opplasting av prosjektdata

Website-editorens ansvar stopper ved å lage et kontrollert utklipp og motta et kontrollert resultat tilbake fra brukeren.

## Foreslått implementeringsrekkefølge

AI-arbeidet starter først når de prosjektmodellene det avhenger av er stabile og fase 29 er aktiv.

### Trinn 1 – AI-utklipp for ett element

- støtt Header eller Seksjon først
- lag eksportbilde
- legg ved eksakte mål
- legg ved relevant designkontekst
- legg ved ferdig teknisk ChatGPT-instruks
- kopier en standardisert tekstpakke

### Trinn 2 – standard returformat

- definer `website-editor-ai-v1`
- implementer runtime-validator
- avvis ukjente eller ugyldige forslag
- ingen prosjektmutasjon ennå

### Trinn 3 – forhåndsvisning

- parse et gyldig forslag
- vis transient preview
- tilby `Avbryt` og `Bruk forslag`

### Trinn 4 – godkjent import

- send godkjente felt gjennom typede actions/reducere
- ingen direkte `EditorProject`-erstatning

### Trinn 5 – bilde-workflow

- eksport av valgt visuelt område
- retur av generert eller endret bilde
- vanlig bildevalidering og assetregistrering

### Trinn 6 – områdepakker

- flere elementer
- låst ytre ramme
- koordinater relativt til området
- Hero og komplette Seksjoner

### Trinn 7 – hele sider

- sideutklipp
- sideforslag
- navigasjon
- komplette sideutkast

## Akseptansekriterier for første versjon

Første reelle versjon skal minst tilfredsstille:

- ett valgt element kan eksporteres med visuelt bilde og eksakte mål
- eksporterte mål samsvarer med prosjektmodellen, ikke DOM-gjetting
- eksporten inneholder tydelig elementtype og formatversjon
- eksporten inneholder ferdig teknisk instruks til ChatGPT
- ChatGPT kan få en eksplisitt låst ramme
- returformatet er dokumentert og runtime-validert
- ugyldig retur kan aldri mutere prosjektet
- et gyldig forslag vises som transient preview
- `Avbryt` endrer ikke prosjektet eller `updatedAt`
- `Bruk forslag` går gjennom eksisterende typede stategrenser
- AI-forslag kan aldri omgå låsing eller modellvalidatorer
- editor-only data eksporteres ikke automatisk
- ingen AI-backend, API-nøkkel eller direkte API-integrasjon finnes i løsningen
- eksisterende PC- og Telefon-funksjonalitet fungerer som før

## Ikke del av AI-løsningen

- direkte automatiske AI-kall fra editoren
- OpenAI API-integrasjon
- AI-backend
- API-nøkler
- AI som endrer prosjektet uten godkjenning
- rå HTML/CSS som permanent prosjektformat
- automatisk opplasting av hele prosjektet til ChatGPT
- automatisk deling av interne notater
- bakgrunnsagent som kontinuerlig analyserer prosjektet
- auto-genererte endringer uten preview

## Låst kjerneflyt

```text
Marker eller lås et område
-> Kopier til ChatGPT
-> editoren lager bilde + ekte mål + prosjektdata + ferdig teknisk instruks
-> bruk ChatGPT som meddesigner
-> kopier eller dra resultatet tilbake
-> valider lokalt
-> forhåndsvis
-> godkjenn eksplisitt
-> bruk eksisterende prosjektmodell og stategrenser
```

Denne arbeidsflyten er fase 29-retningen for Website-editoren. Den skal ikke utvides med API-, backend- eller agentarkitektur uten en ny, uttrykkelig produktbeslutning og en dokumentert roadmap-endring først.
