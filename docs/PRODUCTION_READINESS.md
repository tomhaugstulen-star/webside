# Produksjonsklarhet for jobbbruk

Dette dokumentet er kvalitetsporten før Website-editoren brukes i faktisk arbeid.

## Nåstatus

```text
main: 161125d00a4a7d08b4c376d82933dd1176a0cc44
prosjektskjema: 10
fase 17: fullført
fase 25: aktiv i draft-PR #52
jobbbruk med eneste kopi i editoren: ikke godkjent
```

`main` mangler fortsatt lokal prosjektlagring, autolagring og krasjgjenoppretting. Nettleseroppfriskning, lukking eller krasj kan miste hele arbeidsøkten.

## Full automatisk kontroll

```powershell
npm run verify
npm run architecture:json
npm run architecture:diagram
git diff --check
git status --short
git diff --stat
```

GitHub `Quality` skal kjøre samme `npm run verify` med read-only repository permissions.

## Krav før PR #52 kan gjøres klar

- faktisk siste PR-head er kjent
- branchen er basert på korrekt `main`
- endelig head har grønn GitHub `Quality`
- `npm run verify` består på samme kode
- arkitekturrapportene er regenerert etter siste importendring
- alle autoritative dokumenter viser samme fase og status
- IndexedDB-adapterens read/write/clear-feilveier er deterministisk testet
- recovery-reset fungerer ved inkompatibel databaseversjon og manglende stores
- både desktop- og eventuelle mobile verdier valideres
- bilde og Header-logo overlever refresh
- lagringsfeil vises og kan ikke rapporteres som `Lagret`
- PR er mergebar uten uløste reviewtråder
- manuell PC- og Telefon-regresjon er bestått
- merge skjer bare etter eksplisitt `godkjent`

## Manuell fase-25-regresjon

1. Start med tom lokal database.
2. Opprett og rediger Tekst; endre layout, tekst- og bakgrunnsfarge.
3. Importer Bilde og opprett Header med logo.
4. Vent til status viser `Lagret`.
5. Oppdater siden og bekreft at tekst, layout, farger, bilde og logo gjenopprettes.
6. Bytt mellom PC og Telefon og kontroller konsistent rendering.
7. Slett et bilde, vent på lagring, oppdater og bekreft at element og orphan-asset er borte.
8. Fremprovoser eller simuler lagringsfeil; kontroller at UI viser feil og aldri `Lagret`.
9. Legg inn ugyldig envelope; kontroller at editoren ikke åpnes og data beholdes.
10. Test reset og bekreft at nytt skjema-10-prosjekt åpnes.
11. Test reset ved inkompatibel IndexedDB-versjon eller manglende store.
12. Kontroller markering, flytting, resizing, låsing, paneler og sikker sletting.
13. Kontroller at ingen aktiv offentlig `Publiser`-handling finnes.
14. Gjenta relevant flyt i PC- og Telefon-visning.

Et avvik rettes på samme branch. Etter siste produksjonsretting kjøres hele kontrollen på nytt.

## Stabil jobbbruk etter merge

Før første kritiske arbeidsøkt:

- synkroniser lokal `main`
- kjør `npm ci` og `npm run verify`
- start fra kjent god commit
- lag en ekstern sikkerhetskopi inntil fase 26 er levert
- ikke utvikle nye features i samme arbeidskopi under kritisk arbeid

Fase 25 reduserer risikoen for tap i samme nettleserprofil. Den erstatter ikke backup, eksport eller import fra fase 26.
