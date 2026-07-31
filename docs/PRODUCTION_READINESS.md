# Produksjonsklarhet for jobbbruk

Dette dokumentet er en kvalitetsport før Website-editoren brukes i faktisk arbeid. Det erstatter ikke roadmapen og senker ingen tekniske krav.

## Ansvarsdeling

- AI gjør alle mulige GitHub-endringer, dokumentoppdateringer, commits, PR-kontroller og CI-kontroller direkte i repoet.
- Brukeren gjør bare nødvendig lokal synk, starter programmet og gjennomfører den manuelle regresjonen.
- Ingen lokal kommandorunde brukes til arbeid som AI kan utføre sikkert remote.

## Full automatisk kontroll

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

GitHub Quality kjører samme kommando. Lokal og remote kontroll skal derfor måle samme leveranse.

## Krav før PR #50 kan gjøres klar

- siste remote branch-head er kjent
- `npm run verify` består på samme head
- GitHub Quality består på samme head
- `git diff --check` er ren
- arkitekturrapportene er regenerert og kontrollert
- alle påvirkede autoritative dokumenter viser skjema 10 og korrekt fase-17-status
- kodeaudit er gjennomført mot framtidige fasegrenser
- manuell PC- og Telefon-regresjon er bestått
- PR-en er mergebar og uten uløste reviewtråder
- merge skjer bare etter eksplisitt `godkjent`

## Manuell regresjon

1. Start med `npm run dev`.
2. Opprett Tekst og skriv innhold.
3. Endre font, størrelse, stil, justering, linjehøyde og tekstfarge.
4. Endre Tekst `Bakgrunn` i `Farger`; bekreft at riktig Tekst endres.
5. Lås Tekst; bekreft at Bakgrunn og Tekstfarge kan ses, men ikke endres.
6. Lås opp, flytt og endre størrelse med peker og relevante tastatursnarveier.
7. Opprett Seksjon og kontroller bakgrunn og ramme.
8. Opprett Knapp og kontroller design, tekst og lenke.
9. Importer Bilde og kontroller alternativ tekst, modus, utsnitt og zoom.
10. Opprett Header og kontroller logo, navn, undertittel, farger, font og høyde.
11. Bytt mellom PC og Telefon og kontroller at eksisterende verdier vises konsistent.
12. Kontroller markering, panelåpning/-lukking, låsing og sikker sletting.

Et avvik dokumenteres og rettes på samme branch. Etter en feilretting kjøres hele `npm run verify` på nytt.

## Kjent kritisk begrensning

Programmet mangler fortsatt lokal prosjektlagring, autolagring, krasjgjenoppretting, prosjektimport og angre/gjør om. Nettleseroppfriskning, lukking eller krasj kan derfor miste prosjektstate. Dette er en reell jobbrelatert risiko og skal ikke omtales som løst av tester.

En separat, eksplisitt beslutning må avgjøre om jobbberedskap skal prioriteres foran fase 18. Ingen slik funksjon blandes inn i PR #50.

## Stabilitetsregel

Når en kjent godkjent commit er valgt til jobbbruk:

- nye features utvikles ikke på samme arbeidskopi under kritisk arbeid
- bare dokumenterte feil med direkte konsekvens rettes
- hver rettelse går gjennom branch, `npm run verify`, PR og eksplisitt godkjenning
- kjent god commit og synkronisert `main` beholdes som gjenopprettingspunkt
