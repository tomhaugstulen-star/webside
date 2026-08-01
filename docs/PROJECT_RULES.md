# Prosjektregler

Dette dokumentet fastsetter varige arbeids-, produkt-, modell- og arkitekturgrenser.

## Sannhetskilder

Prioritet:

1. faktisk GitHub-state og verifisert terminaloutput
2. `docs/WORK_PLAN.md`
3. `docs/PROJECT_RULES.md`
4. øvrige autoritative dokumenter
5. historiske commits og lukkede PR-er

Autoritative dokumenter skal oppdateres samlet. En lukket eller merget PR skal aldri stå som aktiv leveranse.

## Branch, PR og merge

- Det utvikles aldri direkte på `main`.
- Hver leveranse bruker egen avgrenset branch.
- Ingen senere fase legges skjult inn i aktiv branch.
- PR forblir draft til avtalte kontroller er bestått.
- Ingen merge uten at brukeren eksplisitt skriver `godkjent`.
- Lokal kontrollstatus påstås bare når terminaloutput er vist.
- GitHub `Quality` må være grønn på nøyaktig endelig PR-head.
- Workflows skal være read-only for kildekode og dokumentasjon. Midlertidige workflows som henter hardkodede artifacts, overskriver filer eller pusher til egen PR-branch er ikke tillatt.

## Remote og lokalt ansvar

AI bruker GitHub-connectoren til remote-operasjoner den har tilgang til. Brukeren utfører bare handlinger som krever lokal PC:

- sikker lokal synk
- starte programmet
- nødvendige lokale kommandoer
- manuell PC-/Telefon-regresjon
- dele terminaloutput som bevis

## Produktgrense

- Website-editoren er en lokal arbeidsportal.
- Hosting, domeneoppsett, offentlig server og produksjonsdeployment er fjernet.
- Lokal forhåndsvisning, prosjektlagring, backup, import og gjenoppretting er del av produktretningen.
- En aktiv `Publiser`-handling skal ikke finnes.
- Uimplementerte handlinger skal være skjult eller tydelig deaktivert.

## Filstørrelse og ansvar

```text
ordinær grense: 0–249 linjer
unntaksområde: 250–299 linjer, krever konkret dokumentert begrunnelse
hard grense: 300+ linjer, alltid blokkert
```

- Filer deles etter reelt modell-, state-, hook-, UI-, adapter- eller stilansvar.
- `App.tsx` setter bare sammen hovedgrensene.
- Canvas eier ikke varig fil- eller prosjektlagring.
- Persistence-adapteren eier IndexedDB-operasjoner, ikke UI-komponentene.
- Genererte arkitekturrapporter omfattes ikke av produksjonsfilgrensen.

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
- Alle eksisterende responsive desktop- og mobile verdier skal valideres; manglende `mobile` betyr arv fra desktop.

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

## Lokal lagringsgrense

- IndexedDB brukes for prosjekt og importerte mediefiler.
- Storage-envelope har egen versjon, separat fra prosjektskjemaet.
- Prosjekt og nødvendige assets valideres før editoren blir interaktiv.
- Et standardprosjekt skal aldri autosaves over en gyldig lagret leveranse under startup.
- Bare gyldig gjeldende prosjektskjema autosaves.
- Object URL-er lagres aldri; de opprettes og tilbakekalles i ressurslageret.
- Ugyldige eller ustøttede data injiseres aldri i reducer-state.
- Ugyldige data beholdes frem til eksplisitt reset.
- Reset må fungere også når databaseskjemaet er inkompatibelt eller mangler forventede stores.
- Orphan-assets slettes bare etter vellykket prosjektlagring.
- UI skal aldri vise `Lagret` etter en mislykket skrivning.
- Adapterens read, write, clear og feilveier skal testes deterministisk.

## Navigasjon og publisering

Arbeidsportalens navigasjon og nettstedets navigasjon er separate ansvar. Portalmenyen er editor-UI og serialiseres ikke som nettsideinnhold.

Offentlig publisering bygges ikke. Lokal visning skal bruke `Forhåndsvisning` når fase 27 er implementert.

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

- branch og mergebase
- changed files og omfang
- filstørrelser
- arkitekturbrudd
- reviews og uløste tråder
- CI på endelig head
- manuell PC-/Telefon-regresjon
- autoritativ dokumentkonsistens
