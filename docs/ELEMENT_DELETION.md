# Sikker sletting av elementer

Dette dokumentet er autoritativ spesifikasjon for den avgrensede slettefasen.

Branch:

```text
feature/element-deletion
```

Sporing:

```text
GitHub-sak #15
```

Base:

```text
main ved mergecommit f71b354
```

## Mål

Gjør det mulig å slette ett markert element på en kontrollert måte uten å blande inn angre/gjør om, papirkurv, multisletting eller andre editorfunksjoner.

Første leveranse gjelder alle eksisterende elementtyper:

- Seksjon
- Bilde
- Tekst
- Knapp

## Fast plassering i høyremenyen

Slettehandlingen ligger i høyremenyens eksisterende `Element`-seksjon, rett under statusboksen.

```text
Element

Status: Ulåst

Slett seksjon
```

Etikettnavn følger elementtypen:

```text
Slett seksjon
Slett bilde
Slett tekstboks
Slett knapp
```

Knappen skal:

- ligge i vanlig dokumentflyt
- ikke være festet nederst i panelet
- ha samme bredde som statusboksen
- kreve ingen scrolling i dagens panel
- bruke rød tekst og rød ramme
- ikke bruke helrød bakgrunn i normaltilstand
- ha tydelig hover-, focus-visible- og disabled-tilstand
- være deaktivert når elementet er låst

## Bekreftelsesdialog

Sletting skal alltid kreve eksplisitt bekreftelse fordi angre/gjør om ikke finnes ennå.

Eksempel:

```text
Slett tekstboksen?

Dette kan ikke angres.

Avbryt    Slett
```

Dialogen skal:

- bruke riktig elementnavn
- ha tydelig tittel og konsekvensmelding
- ha `Avbryt` som trygg handling
- ha `Slett` som destruktiv handling
- støtte `Escape` for avbrytelse
- holde tastaturfokus innenfor dialogen mens den er åpen
- returnere fokus til utløseren ved avbrytelse når den fortsatt finnes
- lukke etter vellykket sletting
- ikke mutere prosjektet ved avbrytelse
- kontrollere nyeste state ved bekreftelse

Dersom elementet er blitt låst, fjernet eller ikke lenger ligger på aktiv side mens dialogen er åpen, skal bekreftelsen avvises uten prosjektmutasjon.

## Tastatur

`Delete` skal åpne den samme bekreftelsesdialogen for markert element.

Global tastatursletting skal ikke aktiveres når fokus er i eller på:

- `input`
- `textarea`
- `select`
- `button`
- dialogkontroller
- innhold med `contenteditable`
- aktiv tekstredigering på lerretet
- andre interaktive skjemaelementer

`Backspace` skal ikke være en global slettehandling i første leveranse.

Når dialogen er åpen, håndterer dialogen tastaturet. En ny global `Delete` skal ikke åpne flere dialoger.

## Elementmodell og Seksjon

Prosjektmodellen er foreløpig flat:

```text
page.elements: EditorElement[]
```

En `Seksjon` eier derfor ikke tekst, bilde eller andre elementer som ligger visuelt over den.

Konsekvens:

- sletting av Seksjon fjerner bare seksjonselementet
- andre elementer blir stående
- ingen geometrisk trefftesting brukes for å finne «innhold i seksjonen»
- foreldre-/barnemodell bygges ikke i denne fasen

## State og reducer

Legg til én eksplisitt prosjekt-handling for sletting av element fra aktiv side.

Forventet handlingsdata:

```text
type: delete-element-from-active-page
elementId
updatedAt
```

Reducergrensen skal avvise:

- manglende aktiv side
- manglende element
- element som ikke ligger på aktiv side
- låst element
- ugyldig eller utdatert handling
- no-op-overgang

Ved gyldig sletting:

- bare målelementet fjernes fra aktiv sides `elements`
- andre sider og elementer bevares referensielt der det er mulig
- `project.updatedAt` settes til handlingens tidsstempel
- `selectedElementId` settes til `null` når det slettede elementet var markert
- høyremenyen lukkes gjennom eksisterende selection-avledning

Sletting skal ikke endre prosjektskjemaet. Skjemaversjon 4 beholdes.

## UI-state

Følgende er transient editor-state og skal ikke lagres i prosjektet:

- om dialogen er åpen
- hvilket element som venter på bekreftelse
- utløserens fokusreferanse
- dialogens feil- eller statusmelding

Prosjektet muteres først når brukeren bekrefter og reduceren godtar nyeste state.

## Arkitektur

Forventet ansvarsdeling:

- `state` — egen reducerhjelper for sletting
- `state` — egen dispatch-hook
- `properties` — liten sletteseksjon under elementstatus
- `dialog` — avgrenset bekreftelsesdialog
- `keyboard` — global Delete-grense uten å forstyrre redigering
- `RightPropertiesPanel` — komposisjon, ikke sletteregler

`EditorCanvasElement.tsx` skal ikke få sletteansvaret. Filen ligger nær aktiv størrelsesgrense og skal ikke få flere nye ansvarsområder.

Alle nye kildefiler skal være under aktiv 250-linjersgrense og ha ett tydelig ansvar.

## Tilgjengelighet

- sletteknappen skal være en ekte `button`
- disabled-tilstand skal være semantisk og visuelt tydelig
- dialogen skal ha tilgjengelig navn og beskrivelse
- focus-visible skal være tydelig
- `Escape` avbryter
- tastaturrekkefølgen skal være forutsigbar
- destruktiv handling skal ikke være eneste eller første ufrivillige fokusmål
- skjermleser skal få riktig elementnavn i dialogen

## Ikke del av denne branchen

- angre/gjør om
- papirkurv eller gjenoppretting
- multisletting
- dra til papirkurv
- sletting av side eller prosjekt
- automatisk sletting av visuelt overlappende elementer
- foreldre-/barnemodell for Seksjon
- duplisering
- historikksystem
- lokal lagring eller autosave
- bildeimport
- knappbibliotek
- fargesystem
- forhåndsvisning eller publisering

## Akseptansekriterier

- markert ulåst Seksjon, Bilde, Tekst eller Knapp viser korrekt sletteknapp
- knappen ligger rett under statusboksen
- låst element kan inspiseres, men sletteknappen er deaktivert
- klikk åpner riktig bekreftelsesdialog
- `Delete` åpner samme dialog
- `Delete` forstyrrer ikke tekst- eller skjemaredigering
- `Backspace` gjør ingenting globalt
- `Avbryt` muterer ikke prosjektet
- bekreftet sletting fjerner bare målelementet
- Seksjonssletting fjerner ikke andre elementer
- markering nullstilles når valgt element slettes
- høyremenyen lukkes etter sletting
- låste, manglende og utdaterte mål avvises i reduceren
- `updatedAt` endres bare ved faktisk sletting
- prosjektskjemaet forblir versjon 4
- eksisterende oppretting, flytting, resizing, låsing, tekst, stil og lenker fungerer som før
- alle nye kildefiler følger ansvars- og størrelsesreglene
- `npm run check` består
- arkitekturrapportene regenereres
- PC, Telefon, peker og tastatur kontrolleres
- working tree er clean før PR
