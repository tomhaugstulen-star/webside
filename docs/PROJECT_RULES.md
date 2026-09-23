# Prosjektregler

Dette dokumentet fastsetter varige arbeids-, produkt-, modell- og arkitekturgrenser.

## Sannhetskilder

Prioritet:

1. faktisk GitHub-state og verifisert kontrolloutput
2. `docs/WORK_PLAN.md`
3. `docs/PROJECT_RULES.md`
4. `docs/ELEMENT_MODEL.md`
5. historiske commits, lukkede saker og lukkede PR-er

`README.md` er inngangspunkt, men skal ikke overstyre dokumentene over.

Det opprettes ikke permanente audit-, readiness-, fase- eller chat-handoverdokumenter. Detaljert faseomfang, testplan, funn og beslutninger ligger i den aktuelle GitHub-saken og PR-en.

## Produktgrense

- Website-editoren er et lokalt énbrukerverktøy.
- Stabilitet og enkel gjenoppretting prioriteres foran funksjonsbredde og kompleksitet.
- Kontoer, roller, samarbeid, flerbrukerstate og skyarkitektur skal ikke bygges uten en ny uttrykkelig produktbeslutning.
- Lokal forhåndsvisning, prosjektlagring, sikkerhetskopi, import og gjenoppretting er del av roadmapen.
- Eksisterende synlige editorhandlinger er produktforpliktelser og skal få reell funksjon i riktig fase; de skal ikke fjernes bare fordi implementasjonen kommer senere.
- `Publiser`, SEO og statisk nettstedseksport er del av produktplanen og spesifiseres i fase 30. Grunnleveransen er en komplett statisk mappe som kan lastes direkte opp til vanlig webhotell/domene uten Node.js eller backend.
- Frem til en synlig handling er implementert, skal den være tydelig deaktivert eller merket som kommende slik at UI-et ikke lover en handling som ennå ikke virker.

## Branch, PR og merge

- Det utvikles aldri direkte på `main`.
- Hver fase eller feilretting bruker egen avgrenset branch.
- Ingen senere fase legges skjult inn i aktiv branch.
- En gammel branch som har blitt forbigått av flere faser merges ikke direkte; relevant kode vurderes på nytt på en fersk branch fra gjeldende `main`.
- PR forblir draft til avtalte kontroller er bestått.
- GitHub `Quality` må være grønn på nøyaktig endelig PR-head.
- Ingen merge uten uttrykkelig brukergodkjenning.
- Workflows skal være read-only for kildekode og dokumentasjon. Workflows som overskriver filer eller pusher til egen PR-branch er ikke tillatt.

## Remote og lokalt ansvar

AI bruker GitHub-connectoren til remote-operasjoner den har tilgang til. Brukeren utfører bare handlinger som faktisk krever lokal PC:

- sikker lokal synk
- starte programmet
- nødvendige lokale kommandoer
- manuell PC-/Telefon-regresjon
- dele terminaloutput som bevis

## Filstørrelse og ansvar

```text
ordinær grense: 0–249 linjer
unntaksområde: 250–299 linjer, krever konkret dokumentert begrunnelse
hard grense: 300+ linjer, alltid blokkert
```

- Filer deles etter reelt modell-, state-, hook-, UI-, adapter- eller stilansvar.
- `App.tsx` setter bare sammen hovedgrensene.
- Canvas eier ikke varig fil- eller prosjektlagring.
- Genererte arkitekturrapporter omfattes ikke av produksjonsfilgrensen.
- Filpolicyen håndheves av repositorykontrollen; et eget permanent dokument er ikke nødvendig.

## Autoritativ prosjektmodell

- Gjeldende prosjektskjema er 15.
- `EditorProject` eier alle varige serialiserbare prosjektdata.
- Bakgrunnsfyll lagres som typet `EditorFill`: helfarge eller lineær gradient med nøyaktig to fargestopp og vinkel 0–360°. Rå CSS-gradientstrenger er ikke prosjektdata.
- Varige prosjektendringer går gjennom typede reducerhandlinger.
- Reduceren er siste mutasjonsgrense.
- Ugyldige, låste og uendrede handlinger returnerer samme state.
- `updatedAt` endres bare ved reell gyldig mutasjon.
- DOM, CSS, `File`, Blob, Object URL og lokal filsti er ikke prosjektdata.
- ID-er er stabile og kryptografisk generert.
- Header lagres ved `x = 0`, `y = 0` og kanonisk bredde.
- Manglende `mobile` betyr arv fra desktop.
- Bakgrunner på side, Seksjon, Tekst, Header og Hero bruker en typet serialiserbar fill-modell: helfarge eller lineær gradient med nøyaktig to `EditorColor`-stopp og vinkel 0–360°. Rå CSS-gradientstrenger er ikke prosjektdata.
- Tekstfarge og rammefarge forblir `EditorColor` og støtter ikke gradient.

## Varig og transient state

Varig:

- prosjekt, sider og elementer
- nettstednavigasjon og offentlige seksjons-ID-er
- posisjon, størrelse, synlighet og låsestatus
- utseende, typede bakgrunnsfyll, tekst, lenker og asset-ID-er
- bilde- og logometadata
- tidsstempler

Transient:

- markering, åpne paneler og fokus
- pekerpreview, snapping og guider
- dialoger og lokale drafts
- `File`, Object URL og ressurskart
- lagringsstatus og aktive skriveoperasjoner
- ikke-godkjente AI-forslag

Transient state serialiseres ikke i `EditorProject`.

## Stabilitet og datatap

- Programmet skal ikke stoppe hele arbeidsøkten ved en håndterbar feil.
- Feil skal være synlige og handlingsrettede.
- UI skal aldri rapportere en mislykket operasjon som vellykket.
- Automatisk lagring bygges i fase 25 og reagerer bare på reelle prosjektmutasjoner.
- Et gyldig lagret prosjekt skal aldri overskrives av et standardprosjekt under oppstart.
- Ugyldige eller ustøttede data skal ikke injiseres i reducer-state.
- #66 leverte manuell prosjektfil og nødvendig import/migrering før fase 20 i PR #70. Prosjektimport migrerer schema 10/11/12/13 kontrollert til gjeldende schema. Øvrig backup/import/migrering følger fase 26; autolagring følger fase 25.

## Navigasjonsgrenser

Arbeidsportalens navigasjon og nettstedets navigasjon er separate ansvar.

- portalnavigasjon er editor-UI og serialiseres ikke som nettsideinnhold
- nettstedets serialiserbare navigasjonsmodell og stabile side-/seksjonsmål ble levert i fase 19
- faktisk Header-meny og navigasjonsrendering ble levert i fase 20
- navigatoren skal lese eksisterende state, ikke opprette en parallell prosjektkopi

## Kvalitetskontroll

```powershell
npm run verify
npm run architecture:json
npm run architecture:diagram
git diff --check
git status --short
git diff --stat
```

Før merge kontrolleres i tillegg:

- branch, base og mergebase
- changed files og faseomfang
- filstørrelser og arkitekturbrudd
- reviews og uløste tråder
- CI på endelig head
- relevant manuell PC-/Telefon-regresjon
- konsistens mellom roadmap, regler og modell
