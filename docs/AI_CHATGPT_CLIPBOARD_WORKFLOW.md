# ChatGPT-flyt i Website-editoren

Dette dokumentet beskriver den låste AI-retningen for fase 29.

`docs/WORK_PLAN.md` er autoritativ for faseorden og status. Denne filen beskriver produkt- og arkitekturvalget for AI-funksjonen.

## Låst produktbeslutning

AI brukes bare i **Rediger bilde / Paint-light**.

Det skal ikke ligge AI-funksjoner i selve side-editoren, på Header, Hero, Seksjon, Tekst eller andre sideelementer.

Website-editoren skal heller ikke ha direkte OpenAI-integrasjon, AI-backend eller API-nøkler.

Den valgte arbeidsflyten er manuell og enkel:

```text
Rediger bilde
-> åpne AI-dialog
-> skriv kommentar
-> kopier snapshot
-> lim inn i ChatGPT
-> arbeid videre i ChatGPT
```

## Formål

AI-funksjonen skal gjøre det raskt å sende en visuell komposisjon fra bildeeditoren til ChatGPT uten å måtte bytte frem og tilbake for å huske detaljer eller skrive tekniske metadata manuelt.

Typiske bruksområder:

- slå sammen to eller flere bilder
- be om visuelle endringer
- få et nytt bilde basert på komposisjonen på lerretet
- bruke tekst som allerede er lagt inn visuelt i bildet
- forklare ønsket endring med en kort kommentar

## Brukerflyt

I `Rediger bilde` finnes en tydelig **AI**-knapp i topplinjen.

Når brukeren trykker den:

1. en stor AI-dialog åpnes
2. dialogen viser en forhåndsvisning av hele bildearbeidsflaten
3. brukeren skriver ønsket instruksjon i kommentarfeltet
4. brukeren trykker `Kopier til ChatGPT`
5. editoren lager ett PNG-bilde
6. PNG-bildet inneholder hele bildearbeidsflaten i original oppløsning
7. instruksjonen rendres inn som et eget felt under bildet
8. brukeren limer bildet inn i ChatGPT med vanlig `Ctrl+V`

Dette gir én robust clipboard-enhet i stedet for å være avhengig av at nettleseren limer inn både `image/png` og `text/plain` samtidig.

## Snapshot-format

Snapshotet består av:

```text
[ hele bildearbeidsflaten i original størrelse ]

--------------------------------
INSTRUKSJON
<brukerens kommentar>
```

Krav:

- selve bildearbeidsflaten beholdes i full lerretsoppløsning
- preview-størrelsen i AI-dialogen påvirker ikke snapshot-kvaliteten
- instruksjonsfeltet legges under bildet og endrer ikke selve arbeidsflaten
- snapshotet kopieres som ett `image/png`
- hvis kommentaren er tom, kopieres bare bildearbeidsflaten
- editor-UI, verktøy, markeringer og dialogen skal ikke inngå i snapshotet

## AI-dialog

Dialogen skal være stor nok til at brukeren kan kontrollere detaljer uten å ta over hele skjermen på mindre skjermer.

Retning:

- maks omtrent 1400 px bredde
- maks omtrent 850 px høyde
- responsiv mot tilgjengelig viewport
- stor preview
- stort kommentarfelt
- `Kopier til ChatGPT`
- `Avbryt` / `Lukk`

Previewen er kun visuell. Snapshotet genereres alltid fra det faktiske canvas-elementet.

## Ingen AI i side-editoren

Følgende er uttrykkelig fjernet og skal ikke gjeninnføres uten en ny produktbeslutning:

- høyreklikk-AI på sideelementer
- `Kopier til ChatGPT` på Header, Hero, Seksjon, Tekst eller Knapp
- strukturert Header-returformat
- `Lim inn AI-forslag`
- AI-preview som muterer sideelementer etter godkjenning
- AI-spesifikke reducer-actions for sideelementer
- generell AI-metadataflyt i canvas-editoren

Vanlig sidearbeid skal forbli manuelt og forutsigbart. AI brukes der det gir mest verdi: bildearbeid.

## Ingen direkte AI-integrasjon

Følgende er ikke del av produktet:

- OpenAI API
- API-nøkler i editoren
- AI-backend
- automatiske AI-kall
- bakgrunnsagent
- automatisk opplasting av bilder eller prosjektdata
- egen AI-bruksmåling
- direkte mutasjon av prosjektstate fra AI

Brukeren bestemmer selv når snapshotet kopieres og når det limes inn i ChatGPT.

## Personvern og datakontroll

Bare det brukeren eksplisitt har på bildearbeidsflaten og kommentaren brukeren skriver, skal inngå i snapshotet.

Ingen prosjektmetadata, editor-only data, andre sider eller skjulte elementer skal følge med automatisk.

## Implementeringsgrense

AI-funksjonen skal ligge i Paint-light-domenet.

Relevant kode skal være samlet rundt:

- `PaintAiDialog`
- snapshot-generering
- clipboard-kopiering
- Paint-light UI og tester

Det skal ikke finnes et parallelt `src/ai`-domene for side-editoren når denne produktretningen er aktiv.

## Akseptansekriterier

Fase 29 er godkjent når:

- AI-knappen finnes i `Rediger bilde`
- AI-dialogen viser preview av aktuell bildearbeidsflate
- kommentarfeltet er stort nok til praktisk bruk
- `Kopier til ChatGPT` lager ett PNG
- PNG-en inneholder hele lerretet
- instruksjonen er lesbar nederst i samme PNG
- én vanlig innliming i ChatGPT gir både bildet og instruksjonen
- lerretsoppløsningen beholdes
- ingen AI-funksjon finnes på sideelementenes høyreklikk
- ingen gammel Header/Hero AI-returkode ligger igjen
- ingen API-, backend- eller nøkkelarkitektur introduseres
- eksisterende Paint-light-funksjoner fungerer som før

## Låst kjerneflyt

```text
Rediger bilde
-> AI
-> se preview
-> skriv kommentar
-> Kopier til ChatGPT
-> ett PNG med bilde + instruksjon
-> lim inn manuelt i ChatGPT
```

Dette er fase 29-retningen. En eventuell framtidig AI-integrasjon i side-editoren krever en ny, uttrykkelig produktbeslutning og en oppdatert roadmap før kodearbeid starter.
