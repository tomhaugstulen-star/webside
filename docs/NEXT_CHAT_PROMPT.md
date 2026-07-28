# Prompt til neste chat

Kopier hele teksten under inn i neste chat.

---

Du er ansvarlig for videre utvikling av Website-editoren. Arbeid som prosjektleder og kodeansvarlig med presist omfang og ingen gjetting.

Svar på norsk. Vær direkte og konkret. Repo og dokumentasjon er kilden til sannhet.

## Repo og lokal mappe

```text
https://github.com/tomhaugstulen-star/webside.git
C:\Users\tomha\Desktop\website
```

Bruk GitHub-connectoren til repoarbeid. Ikke bruk GitHub CLI. Bruk vanlige PowerShell-kommandoer for lokal `git`, `npm` og testing.

Det utvikles aldri direkte på `main`. Etter hver repoendring skal brukeren få nøyaktige PowerShell-kommandoer for å hente endringen lokalt.

Ikke merge uten eksplisitt brukergodkjenning. Ikke påstå at tester består uten verifisert output fra brukeren eller CI.

## Autoritativ leserekkefølge

1. `docs/NEXT_CHAT_PROMPT.md`
2. `docs/WORK_PLAN.md`
3. `docs/ELEMENT_LINKS.md`
4. `docs/TEXT_PROPERTIES.md`
5. `docs/RIGHT_PROPERTIES_PANEL.md`
6. `docs/EDITOR_PLANNING.md`
7. `docs/PROJECT_RULES.md`
8. `README.md`
9. `docs/ELEMENT_MODEL.md`
10. `docs/TEXT_BOX_EDITING.md`
11. `docs/OBJECT_LOCKING.md`
12. `docs/DRAG_RESIZE.md`
13. `docs/ELEMENT_SELECTION.md`
14. `docs/ELEMENT_CREATION.md`
15. `docs/MOBILE_DESIGN_CONTROLS.md`
16. `docs/CODE_AUDIT.md`

## Git-status

Siste bekreftede `main`:

```text
452b491
```

Dette er merge-commit fra PR #11, som la inn tekstegenskaper.

Gjeldende branch:

```text
feature/element-links
```

Åpen PR:

```text
PR #14 Add standalone links for text elements
```

GitHub-sak:

```text
#13 Plan: standalone links for text boxes and button assets
```

PR #14 er åpen, ikke draft og mergebar. Den er ikke merget. Sak #13 lukkes automatisk ved merge.

## Ferdig og merget til `main`

- stabilt React/TypeScript/Vite-grunnlag
- blankt PC- og Telefon-lerret
- kontrollert topp- og venstremeny
- sentral prosjekt- og elementmodell
- stabile kryptografiske ID-er
- transient `selectedElementId`
- oppretting av Seksjon, Bilde, Tekst og Knapp
- flytting og resizing med peker og tastatur
- minimumsmål, clamping, edge-scroll og automatisk lerretsvekst
- objektlåsing og opplåsing
- kontrollert flerlinjet tekstredigering
- høyremenyens grunnstruktur
- tekstegenskaper for hele tekstboksen
- Dependency Cruiser og samlet `npm run check`

Viktige merges:

```text
PR #4   drag og resize
PR #5   objektlåsing                 a3eed45
PR #7   ren tekstredigering          c729d33
PR #8   navn og rekkefølge i meny    a35f59d
PR #9   høyremenyens grunnstruktur   8de5f2e
PR #11  tekstegenskaper              452b491
```

## Fast UX-regel

```text
Venstremeny = opprette og velge struktur
Høyremeny  = egenskaper for markert element
Lerretet   = redigere selve teksten
```

Konsekvenser:

- `Elementer -> Tekst` oppretter en vanlig fri tekstboks.
- Selve tekstinnholdet redigeres bare på lerretet.
- Font, størrelse, lenke og andre egenskaper ligger i høyremenyen.
- `Logo og header` skal senere eie strukturelle headerdeler.
- Lenker aktiveres ikke i vanlig editormodus.

## Implementert tekstgrunnlag

Tekstegenskaper er merget til `main` i PR #11.

For en markert tekstboks viser høyremenyen:

```text
Tekstutseende
Font
Størrelse
Fet
Kursiv
Justering
Linjehøyde
```

Formateringen gjelder hele tekstboksen. Det bygges ikke riktekst eller formatering av markerte ord og tegn.

`EditorCanvasElement.tsx` er nær aktiv filgrense og skal ikke få flere nye ansvarsområder. Senere canvaslogikk må trekkes ut.

## Gjeldende fase – frittstående elementlenker

Fasen er isolert fra knappbibliotek, knappdesign, riktekst, forhåndsvisning og publisering.

Første leveranse gjelder hele vanlige tekstbokser:

```text
Marker tekstboksen
-> Høyremeny
-> Lenke
-> Ekstern lenke
-> skriv http:// eller https://
-> velg eventuelt Åpne i ny fane
-> Lag lenke / Lagre lenke
```

Høyremenyen viser:

```text
Lenke
Type: Ingen / Ekstern lenke
Nettadresse
Åpne i ny fane
Lag lenke / Lagre lenke / Fjern lenke
```

Fast funksjonsregel:

- hele tekstboksen får lenken
- bare absolutte `http://`- og `https://`-adresser godtas
- ugyldig URL muterer ikke prosjektet
- `openInNewTab` lagres eksplisitt
- låste tekstbokser kan inspiseres, men kontrollene er deaktivert
- lagring gir grønn knapp og teksten `Lenke lagret`
- panelet viser også `Lenken er lagret på tekstboksen.`
- lenken åpnes aldri i editormodus
- enkeltord eller tegn får ikke egne lenker

## Lenkemodell

Prosjektskjemaet er versjon 4 på `feature/element-links`.

Modell:

```text
none
external-url { url, openInNewTab }
```

Regler:

- bare `kind: 'text'` får obligatorisk `link` i første leveranse
- nye tekstbokser starter med `link: none`
- semantiske data lagres, ikke rå DOM- eller ankerattributter
- runtime-validatoren tåler `unknown`, `null`, arrays og ukjente nøkler
- validatorregisteret er uttømmende ved framtidige lenketyper
- reduceren avviser manglende, feiltypede, låste, ugyldige og uendrede overganger
- `updatedAt` endres bare ved reell prosjektendring
- inputdraft, feil- og lagringsmelding er transient UI-state

Editorens DOM inneholder ikke `href` på tekstboksen. URL-en kan derfor ikke bekreftes i vanlig Elements-visning. Den autoritative kontrollen er at adressen vises igjen i høyremenyen når tekstboksen velges på nytt.

## Arkitektur

Nye filer:

```text
src/model/elementLink.ts
src/state/setTextElementLink.ts
src/state/useTextElementLink.ts
src/components/properties/ElementLinkPropertiesSection.tsx
src/styles/element-link-properties.css
```

Eksisterende integrasjon:

```text
src/model/editorProject.ts
src/model/createEditorElement.ts
src/state/editorProjectAction.ts
src/state/editorProjectReducer.ts
src/components/properties/RightPropertiesPanel.tsx
src/App.css
```

`EditorCanvasElement.tsx` er urørt av lenkeimplementasjonen.

Alle nye kildefiler er under aktiv 250-linjersgrense.

## Audit og verifisert kontroll

Brukeren har manuelt bekreftet:

```text
gyldig lenke lagres
URL-en vises igjen etter at elementet velges på nytt
lagreknappen blir grønn og viser bekreftelse
ugyldig adresse avvises
lenken åpnes ikke i editoren
låste lenkekontroller er deaktivert
```

Siste verifiserte `npm run check` etter siste produksjonskodeendring:

```text
ESLint: bestått
TypeScript: bestått
Dependency Cruiser: 48 moduler, 109 avhengigheter, ingen brudd
produksjonsbuild: bestått
Vite: 58 moduler transformert
```

Arkitekturrapportene er regenerert:

```text
architecture.json
docs/dependency-graph.mmd
```

Arbeidstreet var clean før den avsluttende dokumentasjonsrevisjonen. Dokumentasjonscommitene må hentes lokalt og clean tree må bekreftes igjen før merge.

## Dokumentasjonsstatus

Oppdatert på `feature/element-links`:

```text
docs/ELEMENT_LINKS.md
architecture.json
docs/dependency-graph.mmd
README.md
docs/WORK_PLAN.md
docs/EDITOR_PLANNING.md
docs/NEXT_CHAT_PROMPT.md
```

`docs/ELEMENT_LINKS.md` er autoritativ spesifikasjon for PR #14.

## Ikke del av PR #14

- knappbibliotek eller lokal `buttons`-mappe
- Canva/Figma-import
- knappdesign, farger, rammer eller typografi
- riktekst eller lenker på markerte enkeltord
- forhåndsvisning eller publisering
- aktive ankere i editormodus
- interne sidelenker
- e-post-, telefon- eller nedlastingslenker
- sletting, duplisering, historikk eller autolagring

## Senere knappbibliotek

Bekreftet produktretning:

```text
Canva eller Figma
-> eksporter knapp som SVG eller PNG
-> lagre i separat knappbibliotek
-> Elementer -> Knapp åpner biblioteket
-> velg knapp og sett den inn på lerretet
-> koble knappen til den samme lenkemodellen
```

Foreløpig branch:

```text
feature/button-library
```

Den gamle `feature/button-element`-branchen er parkert og skal ikke merges. Den inneholder bare tidligere planmateriale. GitHub-sak #12 er lukket som `not_planned`.

Før knappbiblioteket implementeres må følgende avklares:

- statisk lesing eller skrivbar lokal mappe
- lagringsplass i prosjektet
- SVG kontra PNG
- metadata og tilgjengelig navn

## Neste handling

1. Hent siste dokumentasjonscommits på `feature/element-links`.
2. Kontroller at working tree er clean.
3. Kontroller PR #14 etter dokumentasjonsoppdateringene.
4. Ikke kjør en ny full `npm run check` bare på grunn av Markdown-endringer med mindre kode eller konfigurasjon er endret.
5. Merge PR #14 bare etter eksplisitt brukergodkjenning.
6. Etter merge: bytt til `main`, pull, kontroller merge-commit og clean tree.
7. Ikke start knappbiblioteket før brukeren eksplisitt ber om det og omfanget er låst.

---
