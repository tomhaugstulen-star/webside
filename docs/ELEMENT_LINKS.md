# Frittstående lenker for elementer

Dette dokumentet beskriver den autoritative lenkemodellen og dens nåværende bruk i editoren.

## Historikk og gjeldende status

Lenkemodellen ble innført i:

```text
branch: feature/element-links
GitHub-sak: #13
PR: #14 – merget
mergecommit: f71b354
skjemaversjon innført i fasen: 4
```

Den historiske fasen koblet lenken til tekstbokser. `feature/button-library` gjenbruker nå samme modell og samme høyremenyskjema for knapper og øker prosjektskjemaet til versjon 5.

## Fast UX-regel

```text
Lerretet   = markere elementet
Høyremeny  = legge til, endre eller fjerne lenken
Forhåndsvisning/publisering = aktivere lenken
```

Vanlig klikk i editoren markerer elementet. Lenken åpnes aldri i editormodus.

## Støttede elementtyper

På `main` før knappbiblioteket:

- tekstboks

På `feature/button-library`:

- tekstboks
- knapp

Seksjon og Bilde har ikke lenkedata i gjeldende modell.

## Høyremeny

Når et lenkbart element er markert, viser høyremenyen:

```text
Lenke
Type
Ingen
Ekstern lenke
Nettadresse
Åpne i ny fane
```

`Nettadresse` og `Åpne i ny fane` vises bare når lenketypen er `Ekstern lenke`.

Skjemaet tilpasses elementtypen i feedback og låsemelding:

```text
tekstboksen
knappen
```

## Tillatte lenker

Gjeldende versjon godtar bare absolutte adresser med:

```text
http://
https://
```

Ikke støttet:

- interne sidelenker
- e-postlenker
- telefonlenker
- filnedlasting
- fragmentlenker
- relative adresser

URL-en trimmes, normaliseres og valideres som data før prosjektet muteres. Ugyldig URL lagres ikke.

## Lenkemodell

Lenken er varig prosjektdata og representeres som en diskriminert union:

```ts
type ElementLink =
  | { type: 'none' }
  | {
      type: 'external-url'
      url: string
      openInNewTab: boolean
    }
```

Modellen:

- lagrer semantiske data, ikke DOM- eller ankerattributter
- brukes av tekstbokser og knapper
- har runtime-validering for ukjent input
- krever eksakt nøkkelsett
- er uttømmende ved framtidige utvidelser

Transient inputdraft, valideringsmeldinger og lagringsfeedback lagres ikke i prosjektet.

## Prosjektmodell

Tekstelement:

```ts
type TextEditorElement = BaseEditorElement & {
  kind: 'text'
  content: string
  textStyle: TextElementStyle
  link: ElementLink
}
```

Knappelement:

```ts
type ButtonEditorElement = BaseEditorElement & {
  kind: 'button'
  assetId: ButtonAssetId
  label: string
  link: ElementLink
}
```

Lenken er felles for PC og Telefon.

## Reducer og state

Den tidligere tekstspesifikke handlingen er generalisert til:

```text
set-element-link
```

State-hooken er tilsvarende generalisert til lenkbare elementer.

Reducergrensen avviser:

- manglende aktiv side
- manglende element
- element på feil side
- Seksjon eller Bilde
- låst element
- ugyldig lenketype
- ugyldig URL
- uendret lenke

`project.updatedAt` endres bare ved en reell prosjektendring.

Høyremenyen eier ingen permanent kopi av lenken. Inputdraft og valideringsfeedback er transient lokal UI-state.

## Låste elementer

En låst tekstboks eller knapp kan markeres og inspiseres.

Lenkekontrollene:

- viser gjeldende lenkedata
- er deaktivert når elementet er låst
- muterer ikke prosjektet

Reducerens låsegrense er autoritativ selv om UI-kontrollen omgås.

## Samspill med tekstredigering

Tekstinnhold redigeres fortsatt bare på lerretet.

Klikk i høyremenyen under aktiv tekstredigering bruker eksisterende blur/commit-grense før lenkeendringen gjennomføres. Markeringen beholdes.

Lenkeskjemaet:

- oppretter ikke riktekst
- legger ikke tekstinnhold i høyremenyen
- endrer ikke tekstens redigeringsmodell

Knappetekst redigeres separat i knappeseksjonen i høyremenyen.

## Rendering

Editormodus renderer ikke et aktivt navigerbart anker rundt tekstboksen eller knappen.

Forhåndsvisning og publisering skal senere tolke lenkedata og opprette faktisk navigasjon med korrekt tilgjengelig navn.

## Arkitektur

Ansvarsdeling:

- `model` — lenketyper, standardverdi, equality og runtime-validering
- `state` — generell reducerhjelper og dispatch-hook
- `properties` — kontrollert lenkeseksjon
- `RightPropertiesPanel` — komposisjon basert på elementtype
- canvas — ingen aktiv lenkehandling i editormodus

Ingen lenkelogikk skal legges inn i `EditorCanvasElement.tsx`.

## Verifisering

Historisk tekstlenketest før PR #14:

- gyldig `https://`-adresse lagres
- adressen vises igjen ved ny markering
- lagreknappen gir feedback
- lenken åpnes ikke i editormodus

Knappbibliotekets manuelle test bekreftet i tillegg:

- ekstern lenke kan legges til og fjernes på knapp
- `openInNewTab` lagres
- lenken åpnes ikke i editormodus
- låst knapp kan ikke endre lenke
- samme skjema fungerer på PC og Telefon

Se `docs/BUTTON_LIBRARY.md`.
