# Knappelement – etikett og trygg lenkehandling

Dette dokumentet er autoritativ spesifikasjon for fase 9.

Branch:

```text
feature/button-element
```

Sporet i GitHub-sak #12.

## Fast UX-regel

```text
Venstremeny = opprette knappen
Lerretet   = redigere knappeteksten
Høyremeny  = velge knappens handling
```

Knappeteksten redigeres direkte på lerretet. Høyremenyen skal ikke få et ekstra tekstfelt for samme etikett.

## Første leveranse

En ny knapp:

- får etiketten `Knapp`
- bruker dagens startstørrelse 160 × 48 px
- markeres automatisk etter oppretting
- kan flyttes og endres i størrelse med eksisterende canvasverktøy
- er visuelt en knapp, ikke en generisk plassholder

### Redigere etiketten

- dobbeltklikk eller `Enter` på en markert, ulåst knapp starter redigering
- en enkeltlinjet `input` brukes, ikke `textarea` eller `contentEditable`
- blur eller vanlig `Enter` committer
- `Escape` forkaster lokal draft
- IME-komposisjon skal ikke avbrytes av snarveier
- etiketten begrenses til 80 tegn
- linjeskift tillates ikke
- tom eller bare blank etikett committer ikke
- leading og trailing whitespace trimmes ved commit
- etiketten er varig prosjektdata
- lokal draft er transient editor-state

Låste knapper kan markeres og inspiseres, men redigering skal ikke starte.

## Høyremeny

Når en vanlig knapp er markert, viser høyremenyen:

```text
Egenskaper
Knapp

Handling
Ingen
Ekstern lenke

Nettadresse
Åpne i ny fane

Element
Status: Ulåst
```

`Nettadresse` og `Åpne i ny fane` vises bare når handlingen er `Ekstern lenke`.

Høyremenyen eier bare transient inputdraft og eventuell lokal valideringsmelding. Autoritativ handling ligger i prosjektmodellen.

## Handlingsmodell

Første leveranse støtter:

```text
none
external-url
```

Modellen er en discriminated union:

```text
{ type: 'none' }
{ type: 'external-url', url, openInNewTab }
```

### Ekstern lenke

- bare absolutte `http://`- og `https://`-adresser godtas
- URL normaliseres gjennom nettleserens URL-parser før lagring
- brukernavn/passord i URL godtas ikke
- ugyldig URL muterer ikke prosjektet
- `openInNewTab` er bare gyldig for `external-url`
- tom URL kan eksistere som transient draft, men ikke som lagret ekstern handling

Intern sidelinking, `mailto:`, `tel:`, filnedlasting og ankerlenker utsettes til de tilhørende strukturene finnes.

## Editormodus

Knappens handling skal aldri utføres i vanlig editormodus.

- pekerklikk markerer eller flytter elementet
- `Enter` starter etikettredigering når knappen allerede er markert og ulåst
- ingen `<a>`-navigasjon eller `window.open` brukes i editorens canvas
- lagret handling blir først aktiv i en senere forhåndsvisnings-/publiseringsfase

## Prosjektmodell

Prosjektskjemaet økes fra versjon 3 til versjon 4 fordi obligatorisk varig knappdata legges til.

Bare `kind: 'button'` får:

```text
label
action
```

Tekstelementets `content` og `textStyle` påvirkes ikke.

Nye knapper får:

```text
label: Knapp
action: none
```

## Validering og reducer

Reducergrensen skal avvise:

- manglende element
- element på feil side
- annet element enn `kind: 'button'`
- låst knapp
- etikett som er tom etter trimming
- etikett over 80 tegn
- etikett med linjeskift
- ugyldig eller ikke tillatt URL
- ekstern URL med brukernavn eller passord
- actionobjekt med ukjente nøkler
- uendret etikett eller handling

`project.updatedAt` endres bare ved en gyldig, faktisk prosjektendring.

Runtime-validatorene:

- tar imot `unknown`
- avviser `null`, arrays og ukjente nøkler
- bruker et uttømmende register eller uttømmende unionhåndtering
- skal tvinge framtidige handlingsvarianter gjennom eksplisitt validering

## Arkitektur

Forventet ansvarsdeling:

- `model` — knappetikett, handlingsunion, normalisering og runtime-validering
- `state` — egne reducerhjelpere og dispatch-hooks for etikett og handling
- `canvas` — egen enkeltlinjet knappeditor og separat knappinnhold
- `properties` — egen `ButtonPropertiesSection`
- `RightPropertiesPanel` — komposisjon uten lokal prosjektkopi

`EditorCanvasElement.tsx` er allerede nær aktiv 250-linjersgrense. Knappens rendering og redigering skal trekkes ut; filen skal ikke få nytt samlet ansvar.

Alle nye kildefiler følger aktiv 250-linjersgrense og deles etter ansvar.

## Ikke del av denne branchen

- knappfarger eller prosjektfargemodell
- borderfarge, skygge eller fargevarianter
- knappetekstens fontkontroller
- bredde, høyde eller posisjon i høyremenyen
- intern sidelinking
- e-post-, telefon- eller filhandling
- ikonknapper eller bildeknapper
- hover-/active-design for publisert side
- faktisk navigasjon i editoren
- preview eller publisering
- sletting eller duplisering
- historikk eller lagring
- mobile knappestiloverstyringer

Falske eller deaktiverte fremtidskontroller skal ikke legges inn.

## Akseptansekriterier

- ny knapp viser `Knapp`
- knappen er ikke lenger en generisk placeholder
- etiketten redigeres direkte på lerretet
- peker og tastatur støttes
- `Escape` forkaster draft
- låst knapp kan inspiseres, men ikke endres
- høyremenyen viser faktisk handlingsstate
- bare gyldig `http`/`https` lagres
- ugyldig URL muterer ikke prosjektet
- actionkontroller er deaktivert for låst knapp
- knappen navigerer aldri i editormodus
- `updatedAt` endres bare ved reell endring
- alle kildefiler følger ansvars- og størrelsesreglene
- `npm run check` består
- arkitekturrapportene regenereres
- PC, Telefon, peker og tastatur kontrolleres
- arbeidsområdet er rent før PR
