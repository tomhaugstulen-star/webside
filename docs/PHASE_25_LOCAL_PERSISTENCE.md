# Fase 25 – lokal prosjektlagring, autolagring og gjenoppretting

## Status

Aktiv jobbberedskapsfase på `feature/phase-25-local-persistence`.

GitHub-sak: #51.

Fasen gjennomføres eksplisitt før fase 18 fordi tap av prosjektstate ved oppfriskning, lukking eller krasj er prosjektets høyeste gjenværende jobbrelaterte risiko. De opprinnelige fasenumrene beholdes; bare utførelsesrekkefølgen endres.

## Låst omfang

- lokal IndexedDB-database
- varig lagring av gjeldende `EditorProject`
- varig lagring av importerte bilde- og logofiler
- gjenoppretting før editoren blir interaktiv
- debounced autolagring etter reelle prosjektmutasjoner
- synlig status for lasting, lagring, lagret og feil
- eksplisitt, bekreftet nullstilling av lokal prosjektstate
- kontrollert opprydding av ikke-refererte medier
- runtime-validering av lagret envelope, prosjekt og assetmetadata
- automatisk og manuell refresh-/krasjregresjon

## Tekniske beslutninger

### IndexedDB fremfor localStorage

`localStorage` er synkront, har lav lagringskapasitet og kan ikke lagre `File`/`Blob` på en egnet måte. IndexedDB brukes slik at prosjektdata og lokale medier kan lagres i samme lokale database.

### To versjonsgrenser

- `EDITOR_PROJECT_SCHEMA_VERSION` beskriver prosjektmodellen.
- en separat storage-envelope-versjon beskriver den lokale databasekontrakten.

Ingen eldre prosjektskjema migreres i denne fasen. Ustøttet eller ugyldig data skal ikke injiseres i reducer-state.

### Startup-port

Editoren skal ikke rendres med et nytt standardprosjekt og deretter overskrive en gyldig lagret leveranse. Prosjekt og nødvendige assets leses og valideres før normal editorinteraksjon og autolagring aktiveres.

### Mediegrense

Prosjektmodellen lagrer bare `ImageAssetId` og serialiserbar metadata. Selve `File`-objektet lagres i IndexedDB. Object URLs forblir transient runtime-state og opprettes/revokeres gjennom asset-store-grensen.

### Feilsikkerhet

- lagringsfeil skal være synlige
- UI skal aldri vise `Lagret` etter mislykket skrivning
- korrupt eller ustøttet data beholdes til eksplisitt nullstilling
- reset skal kreve bekreftelse
- orphan-opprydding skjer først etter vellykket prosjektlagring

## Ikke del av fasen

- fase 18 navigator og hurtigsøk
- sider, nettstedsnavigasjon, Header-meny eller Hero
- angre/gjør om
- backupfil, eksport, import eller prosjektarkiv
- migreringsmotor for eldre prosjektskjema
- sky- eller serverlagring
- hosting, domene eller offentlig publisering
- OpenAI

## Akseptansekriterier

- tekst, layout, farger og øvrig prosjektstate overlever refresh
- importerte bilder og logoer overlever refresh
- startup kan ikke overskrive en gyldig lagret leveranse med standardprosjektet
- prosjekt og refererte assets er tilgjengelige før editoren åpnes
- invalid eller ustøttet data når aldri reducer-state
- lagringsfeil er synlige og handlingsrettede
- reset er eksplisitt og bekreftet
- slettede eller ikke-refererte assets fjernes kontrollert fra IndexedDB
- Object URLs forblir transient og revokeres korrekt
- filstørrelsespolicy, TypeScript, lint, arkitekturkontroll, enhetstester, build og Chromium-regresjon består
- manuell PC- og Telefon-regresjon består
- ingen merge uten eksplisitt `godkjent`
