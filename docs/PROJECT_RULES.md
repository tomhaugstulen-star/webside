# Prosjektregler

Dette dokumentet fastsetter arbeidsmåten for Website-editoren.

## 1. Branch-strategi

- Hver funksjon eller avgrenset del bygges i egen branch.
- `main` skal alltid være stabil.
- Ingen ny funksjon skal utvikles direkte på `main`.
- Feilretting gjøres i egen branch når rettingen kan påvirke mer enn én isolert linje eller komponent.
- Branch-navn skal beskrive arbeidet tydelig, for eksempel:
  - `feature/mobile-design-controls`
  - `feature/alignment-guides`
  - `feature/box-layout-system`
  - `fix/sidebar-panel-behavior`
  - `docs/project-planning`
- En branch skal bare inneholde arbeidet den er opprettet for.
- Funksjoner skal testes før de vurderes for sammenslåing.

## 2. Filstørrelser og moduldeling

- Maksimal anbefalt størrelse for en kildefil er 300 linjer.
- 300 linjer er en øvre grense, ikke et mål.
- Filer skal deles tidligere dersom de får for mange ansvarsområder.
- Store komponenter skal deles etter ansvar, ikke tilfeldig etter linjetall.
- `App.tsx` skal bare sette sammen hovedstrukturen og skal ikke inneholde editorlogikk.
- Visuell komponent, tilstand, datamodell, hjelpefunksjoner og hendelseslogikk skal holdes separat når det er naturlig.
- Store CSS-filer skal deles etter område, for eksempel:
  - toppmeny
  - venstremeny
  - lerret
  - mobilredigering
  - markerings- og hjelpelinjer
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
- Ikke legg inn midlertidige funksjoner som kan oppfattes som ferdige uten at de er merket som plassholdere.
- Ikke bland designendringer, datamodell og interaksjonslogikk i samme steg uten at det er nødvendig.
- Små, kontrollerbare leveranser foretrekkes fremfor store samleendringer.
- Før større endringer skal berørte filer og forventet effekt beskrives.

## 5. Kvalitetskrav

- TypeScript skal brukes konsekvent.
- Komponenter skal ha tydelige props og avgrenset ansvar.
- Interaksjoner skal fungere med tastatur der det er relevant.
- Brukerhandlinger må ha forutsigbar tilbakemelding.
- Desktop- og mobilresultat skal testes separat.
- Layoutsystemet skal unngå skjulte avhengigheter mellom komponenter.
- Ingen automatisk generert design skal overskrive brukerens eksplisitte valg uten tydelig varsel.
- Automatisk lagring skal være en grunnfunksjon i editoren.

## 6. Gjeldende status

- Editorgrunnlaget ligger på `feature/editor-foundation`.
- Videre funksjoner skal bygges i nye branches.
- Denne dokumentasjonen ligger på `docs/project-planning`.
- Ingen ny editorfunksjon er implementert som del av denne dokumentasjonsendringen.
