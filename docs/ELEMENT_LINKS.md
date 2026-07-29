# Frittstående lenker for elementer

Dette dokumentet er autoritativ spesifikasjon og historisk verifikasjonslogg for den isolerte lenkefasen.

```text
branch: feature/element-links
GitHub-sak: #13
PR: #14 – merget
mergecommit: f71b354
skjemaversjon innført i fasen: 4
```

## Status

Fasen er implementert, kontrollert og merget til `main` gjennom PR #14.

Tidligere formuleringer om arbeid som «gjenstår før PR» beskrev branchens tilstand før PR #14. De er ikke gjeldende prosjektstatus.

## Mål og avgrensning

Fasen bygde én liten og gjenbrukbar lenkemodell som først ble koblet til hele tekstbokser og senere kan gjenbrukes av ferdigdesignede knappfiler.

Fasen bygde ikke knappbibliotek, knappdesign, prosjektfarger eller riktekst.

## Fast UX-regel

```text
Lerretet   = markere elementet
Høyremeny  = legge til, endre eller fjerne lenken
Forhåndsvisning/publisering = aktivere lenken
```

Vanlig klikk i editoren markerer fortsatt elementet. Lenken åpnes aldri mens brukeren arbeider i editormodus.

## Implementert leveranse

Leveransen gjelder vanlige tekstbokser.

Når en tekstboks er markert, viser høyremenyen:

```text
Lenke
Ingen
Ekstern lenke

Nettadresse
Åpne i ny fane
```

`Nettadresse` og `Åpne i ny fane` vises bare når lenketypen er `Ekstern lenke`.

Hele tekstboksen får lenken. Markerte enkeltord, tegn eller tekstsegmenter får ikke egne lenker.

## Tillatte lenker

Gjeldende versjon godtar bare absolutte adresser med:

```text
http://
https://
```

Ikke støttet i denne fasen:

- interne sidelenker
- e-postlenker
- telefonlenker
- filnedlasting
- fragmentlenker
- relative adresser

URL-en valideres som data før prosjektet muteres. Ugyldig URL lagres ikke.

## Lenkemodell

Lenken er varig prosjektdata og representeres som en diskriminert union:

```text
none
external-url { url, openInNewTab }
```

Modellen:

- lagrer semantiske data, ikke rå DOM- eller ankerattributter
- er gjenbrukbar for senere knappfiler
- har runtime-validering som tåler `unknown`, `null`, arrays og ukjente nøkler
- er uttømmende ved framtidige modellutvidelser

Transient inputdraft og valideringsmeldinger lagres ikke i prosjektet.

## Prosjektmodell

Fasen økte prosjektskjemaet fra versjon 3 til gjeldende versjon 4.

- bare `kind: 'text'` fikk obligatorisk `link`
- nye tekstbokser fikk standarden `none`
- eksisterende tekststil og tekstinnhold ble beholdt
- lenken er felles for PC og Telefon

Når knappbiblioteket senere bygges, kan knappens elementmodell bruke samme lenketype uten å endre tekstlenkemodellen.

## Reducer og state

Hver gyldig lenkeendring går gjennom en avgrenset reducerhandling.

Reducergrensen avviser:

- manglende aktiv side
- manglende element
- element på feil side
- feil elementtype
- låst element
- ugyldig lenketype
- ugyldig URL
- uendret lenke

`project.updatedAt` endres bare ved en reell prosjektendring.

Høyremenyen eier ingen separat permanent kopi av lenken. Inputdraft og valideringsfeedback er transient lokal UI-state.

## Låste elementer

En låst tekstboks kan markeres og inspiseres.

Lenkekontrollene:

- viser gjeldende lenkedata
- er deaktivert når elementet er låst
- muterer ikke prosjektet

## Samspill med tekstredigering

Tekstinnhold redigeres fortsatt bare på lerretet.

Klikk i høyremenyen under aktiv tekstredigering bruker eksisterende blur/commit-grense før lenkeendringen gjennomføres.

Lenkefasen endret ikke `textarea`-modellen, opprettet ikke riktekst og la ikke inn et ekstra tekstinnholdsfelt i høyremenyen.

## Rendering

Editormodus renderer ikke et aktivt navigerbart anker rundt elementet.

Forhåndsvisning og publisering skal senere tolke lenkedata og opprette faktisk navigasjon.

## Arkitektur

Implementert ansvarsdeling:

- `model` — lenketyper, standardverdi, equality og runtime-validering
- `state` — reducerhjelper og dispatch-hook
- `properties` — kontrollert lenkeseksjon
- `RightPropertiesPanel` — komposisjon basert på elementtype
- canvas — ingen aktiv lenkehandling i editormodus

Ingen ny lenkelogikk ble lagt inn i `EditorCanvasElement.tsx`. Filen ligger nær aktiv størrelsesgrense og skal ikke få nye funksjonsansvar.

## Ikke del av den historiske branchen

- knappbibliotek eller filimport
- knappdesign eller redigerbar knappetikett
- farger, rammer, skygger eller typografi
- riktekst eller lenker på markerte enkeltord
- forhåndsvisning eller publisering
- intern sidenavigasjon
- sletting eller duplisering
- historikk eller lagring
- mobile lenkeoverstyringer

## Verifisert før merge

Manuell funksjonstest ble godkjent:

- gyldig `https://`-adresse lagres på hele tekstboksen
- adressen vises igjen når tekstboksen velges på nytt
- lagreknappen gir bekreftelse og teksten `Lenke lagret`
- lenken åpnes ikke i editormodus

Automatisk kontroll ble godkjent med `npm run check`:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 48 moduler, 109 avhengigheter, ingen brudd
Vite-produksjonsbuild: bestått med 58 transformerte moduler
```

Arkitekturrapportene, PC-, Telefon- og tastaturkontroll samt clean tree ble fullført før PR #14 ble merget.