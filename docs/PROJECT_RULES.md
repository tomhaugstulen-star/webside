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
- Hosting, domeneoppsett, offentlig server og produksjonsdeployment er fjernet fra produktplanen.
- Lokal forhåndsvisning, prosjektlagring, sikkerhetskopi, import og gjenoppretting er del av roadmapen.
- En aktiv `Publiser`-handling skal ikke finnes.
- Uimplementerte handlinger skal være skjult eller tydelig deaktivert.

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

- Gjeldende prosjektskjema er 10.
- `EditorProject` eier alle varige serialiserbare prosjektdata.
- Varige prosjektendringer går gjennom typede reducerhandlinger.
- Reduceren er siste mutasjonsgrense.
- Ugyldige, låste og uendrede handlinger returnerer samme state.
- `updatedAt` endres bare ved reell gyldig mutasjon.
- DOM, CSS, `File`, Blob, Object URL og lokal filsti er ikke prosjektdata.
- ID-er er stabile og kryptografisk generert.
- Header lagres ved `x = 0`, `y = 0` og kanonisk bredde.
- Manglende `mobile` betyr arv fra desktop.

## Varig og transient state

Varig:

- prosjekt, sider og elementer
- posisjon, størrelse, synlighet og låsestatus
- utseende, tekst, lenker og asset-ID-er
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
- Backup, eksport, import og migrering bygges separat i fase 26.

## Navigasjonsgrenser

Arbeidsportalens navigasjon og nettstedets navigasjon er separate ansvar.

- portalnavigasjon er editor-UI og serialiseres ikke som nettsideinnhold
- nettstedets navigasjon er prosjektdata og bygges i fase 19–20
- navigator og hurtigsøk skal lese eksisterende state, ikke opprette en parallell prosjektkopi

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
