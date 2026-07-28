# Prosjektregler

Dette dokumentet fastsetter arbeidsmåten for Website-editoren.

## 1. Branch-strategi

- Hver funksjon eller avgrenset del bygges i egen branch.
- `main` skal alltid være stabil.
- Ingen ny funksjon utvikles direkte på `main`.
- Feilretting og teknisk opprydding gjøres i egne branches.
- En branch skal bare inneholde arbeidet den er opprettet for.
- En godkjent branch merges til `main` før neste feature-branch opprettes fra oppdatert `main`.

Eksempler:

- `feature/element-selection`
- `feature/element-creation`
- `feature/mobile-design-controls`
- `feature/alignment-guides`
- `fix/sidebar-panel-behavior`
- `chore/editor-foundation-audit`
- `tooling/dependency-cruiser`

## 2. Filstørrelser og moduldeling

- 250 linjer er den aktive terskelen for å begynne å trekke ut ansvar fra en kildefil.
- En kildefil skal normalt ikke vokse videre forbi 250 linjer uten at ansvar først er trukket ut, eller at en konkret teknisk begrunnelse er dokumentert.
- En fil deles tidligere enn 250 linjer dersom den får flere tydelige ansvarsområder.
- 300 linjer er en absolutt kontrollgrense som krever eksplisitt gjennomgang og dokumentert begrunnelse; det er ikke et akseptabelt normalmål.
- Uttrekking skal skje etter ansvar, ikke ved tilfeldig oppdeling for å redusere linjetallet.
- Store komponenter deles i visning, state, hendelseslogikk og hjelpefunksjoner der dette gir naturlige modulgrenser.
- `App.tsx` skal bare sette sammen hovedstrukturen og ikke inneholde editorlogikk.
- Visuell komponent, transient state, prosjektmodell, hjelpefunksjoner og hendelseslogikk holdes separat når det er naturlig.
- Store CSS-filer deles etter editorområde før de blir generelle samlefiler.
- Ingen fil skal bli en generell samlefil for all funksjonalitet.

## 3. Datagrenser

### Prosjektdata

- `EditorProject` er autoritativ kilde for varige prosjektdata.
- DOM-en skal ikke brukes som permanent prosjektlagring.
- Elementer skal opprettes, endres og slettes gjennom prosjekt-state/reduceren.
- Prosjektidentitet skal bruke stabile kryptografiske ID-er.

### Transient editor-state

Midlertidig brukergrensesnitt-state, som `selectedElementId`, skal holdes utenfor `EditorProject`.

Transient editor-state skal ikke:

- serialiseres i prosjektfilen
- utløse autolagring
- inngå i prosjektets angre-/gjør om-historikk
- eksporteres
- publiseres

Når historikk og lagring bygges, må kodegrensen mellom prosjektmutasjoner og UI-state være eksplisitt.

## 4. Arbeidsrekkefølge

Før implementering av hver ny del skal dette avklares:

1. Hva funksjonen skal gjøre.
2. Hvilke brukerhandlinger som finnes.
3. Hvilken tilstand som må lagres.
4. Om tilstanden er varig prosjektdata eller transient editor-state.
5. Hvordan funksjonen virker på desktop.
6. Hvordan funksjonen virker på mobil.
7. Hvordan funksjonen påvirker angre/gjør om og lagring.
8. Hvilke filer og komponenter som opprettes eller endres.
9. Hvordan funksjonen skal fordeles før noen berørt fil nærmer seg 250 linjer.
10. Hvordan funksjonen testes.
11. Hvordan midlertidige test-fixtures fjernes før godkjenning.

## 5. Endringskontroll

- Ikke bygg videre på en funksjon før oppførselen er definert.
- Ikke legg inn midlertidige funksjoner som kan oppfattes som ferdige uten tydelig dokumentasjon.
- Midlertidige fixtures skal være isolert og fjernes før merge med mindre brukeren eksplisitt godkjenner noe annet.
- Ikke bland designendringer, datamodell og interaksjonslogikk uten at det er nødvendig.
- Små, kontrollerbare leveranser foretrekkes fremfor store samleendringer.
- Før større endringer beskrives berørte filer og forventet effekt.
- Rapportfiler fra arkitektursjekken regenereres etter strukturendringer.
- PowerShell-kommandoene brukeren skal kjøre lokalt følger hver repoendring.
- Ikke oppgi at lint, typekontroll, arkitektursjekk eller build er bestått før brukeren har kjørt kommandoene lokalt eller verifisert CI finnes.

## 6. Kvalitetskrav

- TypeScript brukes konsekvent.
- Reducer-actions skal håndteres eksplisitt og uttømmende.
- Ugyldige state-overganger skal ignoreres eller avvises kontrollert.
- Overflødige state-oppdateringer skal unngås når det er enkelt og tydelig.
- Komponenter skal ha tydelige props og avgrenset ansvar.
- Interaksjoner skal fungere med tastatur der det er relevant.
- Brukerhandlinger må ha forutsigbar tilbakemelding.
- Desktop- og mobilresultat testes separat.
- Layoutsystemet skal unngå skjulte avhengigheter mellom komponenter.
- Ingen automatisk generert design skal overskrive brukerens eksplisitte valg uten tydelig varsel.
- Automatisk lagring skal senere være en grunnfunksjon i editoren.
- Ingen kildekodemodul skal ligge ubrukt uten å bli oppdaget av arkitektursjekken.

Før en branch kan godkjennes kjøres normalt:

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
npm run dev
```

## 7. Tilgjengelighet og editorinteraksjon

- Fokusrekkefølgen skal være forutsigbar.
- Enter og mellomrom kan brukes for kontrollaktivering der semantikken tilsvarer en knapp.
- Tilgjengelige navn må bli mer spesifikke når elementmodellen får navn eller innhold.
- Tekstredigering må skille mellom objektmarkering og innholdsredigering.
- Faktiske knappehandlinger eller lenker skal ikke aktiveres i vanlig editor-markeringsmodus.
- Klikk på framtidige objektverktøy skal kunne beholde valgt element.

## 8. Gjeldende status

- Editorgrunnlaget er godkjent og merget til `main`.
- Prosjekt- og elementmodellen er godkjent og merget til `main`.
- Dependency Cruiser og `npm run check` er konfigurert.
- `npm run dev` åpner nettleseren automatisk.
- `feature/element-selection` er implementert og visuelt godkjent.
- Test-fixturen for markering er fjernet.
- Siste reducer-herding og dokumentoppdateringer må sluttkontrolleres før merge.
- Neste branch etter merge er `feature/element-creation`.
