# Produksjonsklarhet for jobbbruk

Dette dokumentet styrer den korte stabiliseringsperioden før Website-editoren tas i faktisk arbeid.

## Mål

Målet er ikke å ferdigstille hele roadmapen før jobbstart. Målet er å fryse dagens funksjonssett, kontrollere at det virker, og unngå regresjoner mens programmet brukes.

## Én obligatorisk kontroll

```powershell
npm run verify
```

Kommandoen kjører:

1. ni tester av filstørrelsespolicyen
2. kontroll av alle produksjonsfiler
3. ESLint
4. TypeScript for produksjon og tester
5. Dependency Cruiser
6. alle enhetstester
7. produksjonsbuild
8. kritisk Chromium-regresjon

GitHub Actions-workflowen `Quality` kjører samme kommando.

## Krav før merge av PR #50

- `npm run verify` består på siste branch-head
- GitHub `Quality` består på samme head
- `git diff --check` er ren
- arkitekturrapportene er regenerert fordi fase 17 la til produksjonsmoduler og imports
- prosjektskjema og autoritativ dokumentasjon viser versjon 10
- brukerens manuelle PC- og Telefon-test er bestått
- PR-en er mergebar og uten uløste reviewtråder
- merge skjer bare etter eksplisitt `godkjent`

## Manuell røyketest

Kjør denne testen én gang etter at siste branch-head er hentet:

1. Start med `npm run dev`.
2. Opprett Tekst.
3. Skriv tekst og avslutt redigering.
4. Endre `Bakgrunn` og `Tekstfarge` i `Farger`.
5. Lås Tekst og bekreft at fargefeltene er deaktiverte.
6. Lås opp, flytt og endre størrelse.
7. Opprett Seksjon og endre bakgrunn/ramme.
8. Opprett Knapp og kontroller tekst/lenke.
9. Importer Bilde og kontroller utsnitt/zoom.
10. Opprett Header og kontroller logo, tekst, farge og høyde.
11. Bytt mellom PC og Telefon og se etter skjulte eller ødelagte kontroller.
12. Slett ett ulåst element og avbryt én sletting.

Et avvik betyr at PR #50 forblir draft til feilen er rettet.

## Kjent jobbrelatert risiko

Programmet har foreløpig ikke:

- lokal prosjektlagring
- autolagring
- krasjgjenoppretting
- prosjektfil/import
- angre/gjør om

Nettleseroppfriskning, lukking eller krasj kan derfor miste prosjektstate. Dette er den største risikoen ved faktisk jobbbruk og kan ikke skjules av testresultater.

Inntil lokal lagring er implementert:

- ikke oppdater nettleseren under arbeid
- ikke lukk fanen før arbeidet er ferdig eller manuelt dokumentert utenfor programmet
- unngå å bruke programmet som eneste varige lagringssted for kundearbeid

## Stabiliseringsregel

Etter at PR #50 og røyketesten er grønne:

- ingen nye visuelle eller funksjonelle tillegg før jobbøkten
- bare dokumenterte feil med direkte jobbkonsekvens kan endres
- hver feilretting må etterfølges av `npm run verify`
- siste grønne commit beholdes som kjent gjenopprettingspunkt
