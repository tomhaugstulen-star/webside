# Prosjektregler

Dette dokumentet fastsetter arbeidsmåten for Website-editoren.

## 1. Branch-strategi

- Hver funksjon eller avgrenset del bygges i egen branch.
- `main` skal alltid være stabil.
- Ingen ny funksjon skal utvikles direkte på `main`.
- Feilretting og teknisk opprydding gjøres i egne branches.
- Dokumentasjon kan utvikles i `docs/project-planning`.
- Branch-navn skal beskrive arbeidet tydelig, for eksempel:
  - `feature/element-selection`
  - `feature/mobile-design-controls`
  - `feature/alignment-guides`
  - `fix/sidebar-panel-behavior`
  - `chore/editor-foundation-audit`
  - `tooling/dependency-cruiser`
- En branch skal bare inneholde arbeidet den er opprettet for.
- En godkjent branch merges til `main` før neste feature-branch opprettes fra oppdatert `main`.

## 2. Filstørrelser og moduldeling

- Maksimal anbefalt størrelse for en kildefil er 300 linjer.
- 300 linjer er en øvre kontrollgrense, ikke et mål.
- Filer skal vurderes for deling fra omtrent 200–250 linjer.
- En fil skal deles tidligere dersom den får flere tydelige ansvarsområder.
- Store komponenter skal deles etter ansvar, ikke tilfeldig etter linjetall.
- `App.tsx` skal bare sette sammen hovedstrukturen og skal ikke inneholde editorlogikk.
- Visuell komponent, tilstand, datamodell, hjelpefunksjoner og hendelseslogikk skal holdes separat når det er naturlig.
- Store CSS-filer skal deles etter område, blant annet toppmeny, venstremeny, lerret, mobilredigering og hjelpelinjer.
- Ingen fil skal bli en generell samlefil for all funksjonalitet.
- En feil eller endring i én del skal i minst mulig grad stoppe arbeid i andre deler.

## 3. Arbeidsrekkefølge

For hver ny del skal følgende avklares før implementering:

1. Hva funksjonen skal gjøre.
2. Hvilke brukerhandlinger som finnes.
3. Hvilken tilstand som må lagres.
4. Hvordan funksjonen virker på desktop.
5. Hvordan funksjonen virker på mobil.
6. Hvordan den påvirker angre/gjør om og lagring.
7. Hvilke filer og komponenter som skal opprettes eller endres.
8. Hvordan funksjonen skal testes.

## 4. Endringskontroll

- Ikke bygg videre på en funksjon før oppførselen er definert.
- Ikke legg inn midlertidige funksjoner som kan oppfattes som ferdige uten at de er dokumentert som plassholdere.
- Ikke bland designendringer, datamodell og interaksjonslogikk i samme steg uten at det er nødvendig.
- Små, kontrollerbare leveranser foretrekkes fremfor store samleendringer.
- Før større endringer skal berørte filer og forventet effekt beskrives.
- Rapportfiler fra arkitektursjekken skal regenereres etter strukturendringer.
- PowerShell-kommandoene brukeren skal kjøre lokalt skal alltid legges ved etter repoendringer.
- Ikke oppgi at lint, typekontroll, arkitektursjekk eller build er bestått før brukeren har kjørt kommandoene lokalt eller et verifisert CI-resultat finnes.

## 5. Kvalitetskrav

- TypeScript skal brukes konsekvent.
- Komponenter skal ha tydelige props og avgrenset ansvar.
- Interaksjoner skal fungere med tastatur der det er relevant.
- Brukerhandlinger må ha forutsigbar tilbakemelding.
- Desktop- og mobilresultat skal testes separat.
- Layoutsystemet skal unngå skjulte avhengigheter mellom komponenter.
- Ingen automatisk generert design skal overskrive brukerens eksplisitte valg uten tydelig varsel.
- Automatisk lagring skal være en grunnfunksjon i editoren.
- Ingen kildekodemodul skal ligge ubrukt uten å bli oppdaget av arkitektursjekken.
- Prosjektmodellen er autoritativ kilde for prosjektdata. DOM-en skal ikke brukes som permanent lagring.

Før en branch kan godkjennes skal dette normalt kjøres:

```powershell
npm run check
npm run architecture:json
npm run architecture:diagram
npm run dev
```

## 6. Gjeldende status

- Editorgrunnlaget er godkjent og ligger på `main`.
- Dependency Cruiser og `npm run check` er konfigurert.
- `npm run dev` åpner nettleseren automatisk.
- `feature/element-model` er ferdig og godkjent lokalt og visuelt.
- Prosjektmodellen har skjemaversjon, stabile ID-er, sider, elementtyper, responsive verdier og sentral prosjekt-state.
- `feature/element-model` skal merges til `main` før neste fase.
- Neste fase er `feature/element-selection`.
- Dokumentasjon og overleveringsprompt ligger på `docs/project-planning`.