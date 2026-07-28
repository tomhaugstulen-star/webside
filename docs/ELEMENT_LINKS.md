# Frittstående lenker for elementer

Dette dokumentet er autoritativ spesifikasjon for den isolerte lenkefasen.

Branch:

```text
feature/element-links
```

Sporing:

```text
GitHub-sak #13
```

## Mål

Bygg én liten og gjenbrukbar lenkemodell som først kobles til hele tekstbokser og senere kan gjenbrukes av ferdigdesignede knappfiler.

Denne fasen skal ikke bygge knappbibliotek, knappdesign, prosjektfarger eller riktekst.

## Fast UX-regel

```text
Lerretet   = markere elementet
Høyremeny  = legge til, endre eller fjerne lenken
Forhåndsvisning/publisering = aktivere lenken
```

Vanlig klikk i editoren skal fortsatt markere elementet. Lenken skal aldri åpnes mens brukeren arbeider i editormodus.

## Første leveranse

Første leveranse gjelder bare vanlige tekstbokser.

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

Første versjon godtar bare absolutte adresser med:

```text
http://
https://
```

Følgende bygges ikke nå:

- interne sidelenker
- e-postlenker
- telefonlenker
- filnedlasting
- fragmentlenker
- relative adresser

URL-en skal valideres som data før prosjektet muteres. Ugyldig URL skal ikke lagres.

## Lenkemodell

Lenken er varig prosjektdata og representeres som en discriminated union:

```text
none
external-url { url, openInNewTab }
```

Modellen skal:

- lagre semantiske data, ikke rå DOM- eller ankerattributter
- være gjenbrukbar for senere knappfiler
- ha runtime-validering som tåler `unknown`, `null`, arrays og ukjente nøkler
- være uttømmende ved framtidige modellutvidelser

Transient inputdraft og valideringsmeldinger skal ikke lagres i prosjektet.

## Prosjektmodell

Prosjektskjemaet økes fra versjon 3 til versjon 4.

Første leveranse:

- bare `kind: 'text'` får obligatorisk `link`
- nye tekstbokser får standarden `none`
- eksisterende tekststil og tekstinnhold beholdes uendret
- lenken er felles for PC og Telefon

Når knappbiblioteket senere bygges, kan knappens elementmodell bruke den samme lenketypen uten å endre tekstlenkemodellen.

## Reducer og state

Hver gyldig lenkeendring skal gå gjennom en avgrenset reducerhandling.

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

Høyremenyen eier ingen separat permanent kopi av lenken. Eventuell inputdraft og valideringsfeedback er transient lokal UI-state.

## Låste elementer

En låst tekstboks kan markeres og inspiseres.

Lenkekontrollene:

- viser gjeldende lenkedata
- er deaktivert når elementet er låst
- muterer ikke prosjektet

Opplåsing fortsetter gjennom eksisterende objektverktøy.

## Samspill med tekstredigering

Tekstinnhold redigeres fortsatt bare på lerretet.

Klikk i høyremenyen under aktiv tekstredigering skal bruke eksisterende blur/commit-grense før lenkeendringen gjennomføres.

Lenkefasen skal ikke:

- endre `textarea`-modellen
- gjøre teksten til riktekst
- legge et ekstra tekstinnholdsfelt i høyremenyen
- aktivere navigasjon i editoren

## Rendering

Editormodus skal ikke rendre et aktivt navigerbart anker rundt elementet.

Det kan vises en diskret, ikke-interaktiv indikator på at elementet har lenke, men denne er ikke nødvendig i første leveranse dersom den skaper nytt visuelt ansvar.

Forhåndsvisning og publisering skal senere tolke lenkedata og opprette faktisk navigasjon.

## Arkitektur

Forventet ansvarsdeling:

- `model` — lenketyper, standardverdi, equality og runtime-validering
- `state` — reducerhjelper og dispatch-hook
- `properties` — liten, kontrollert lenkeseksjon
- `RightPropertiesPanel` — komposisjon basert på elementtype
- canvas — ingen aktiv lenkehandling i editormodus

Ingen ny lenkelogikk skal legges inn i `EditorCanvasElement.tsx` med mindre den er nødvendig for ren presentasjon. Filen ligger allerede nær aktiv størrelsesgrense.

Alle nye kildefiler skal være under 250 linjer og ha ett tydelig ansvar.

## Senere knappbibliotek

Ferdigdesignede knapper lages i Canva eller Figma og eksporteres som SVG eller PNG.

En senere separat branch skal håndtere:

- lokal `buttons`-mappe
- oversikt over tilgjengelige knappfiler
- innsetting av valgt knapp på lerretet
- tilgjengelig navn for grafiske knapper
- kobling til den samme lenkemodellen

Dette skal ikke implementeres i `feature/element-links`.

## Ikke del av denne branchen

- knappbibliotek eller filimport
- knappdesign eller redigerbar knappetikett
- farger, rammer, skygger eller typografi
- riktekst eller lenker på markerte enkeltord
- forhåndsvisning eller publisering
- intern sidenavigasjon
- sletting eller duplisering
- historikk eller lagring
- mobile lenkeoverstyringer

## Akseptansekriterier

- ny tekstboks får `link: none`
- hele tekstboksen kan få en gyldig ekstern lenke
- lenken kan endres og fjernes
- `openInNewTab` lagres som eksplisitt boolean
- ugyldig URL muterer ikke prosjektet
- låst tekst kan inspiseres, men ikke endres
- lenken åpnes aldri i editormodus
- eksisterende tekstredigering og tekststil fungerer som før
- runtime-validatoren avviser ødelagte og utypede lenkedata
- `updatedAt` endres bare ved reell endring
- alle kildefiler følger ansvars- og størrelsesreglene
- `npm run check` består
- arkitekturrapportene regenereres
- PC, Telefon, peker og tastatur kontrolleres
- working tree er clean før PR

## Verifisert status 2026-07-28

Manuell funksjonstest er godkjent:

- gyldig `https://`-adresse lagres på hele tekstboksen
- adressen vises igjen når tekstboksen velges på nytt
- lagreknappen gir grønn bekreftelse og teksten `Lenke lagret`
- lenken åpnes ikke i editormodus

Automatisk kontroll er godkjent med:

```text
npm run check
```

Resultat:

- ESLint bestått
- TypeScript bestått
- Dependency Cruiser: 48 moduler, 109 avhengigheter, ingen brudd
- Vite-produksjonsbygg bestått med 58 transformerte moduler

Gjenstår før PR:

- regenerere `architecture.json`
- regenerere `docs/dependency-graph.mmd`
- bekrefte PC, Telefon og tastaturkontroll
- bekrefte clean working tree