# Elementmarkering

Dette dokumentet beskriver markering av eksisterende elementer i `feature/element-selection`.

## Status

Branchen er utviklet, gjennomgått og visuelt godkjent 28. juli 2026.

Bekreftet av brukeren:

- ett element kan markeres
- markeringen flyttes når et annet element velges
- klikk på tomt lerretsområde fjerner markeringen
- Tab kan flytte fokus til elementer
- Enter og mellomrom kan markere fokusert element
- oppførselen fungerer i desktop- og mobilvisning
- den midlertidige test-fixturen er fjernet
- et nytt prosjekt åpner igjen helt blankt

Bekreftet ved lokal kontroll før den siste reducer-herdingen:

- ESLint bestod
- TypeScript-kontroll bestod
- Dependency Cruiser fant ingen regelbrudd
- produksjonsbuild bestod

Etter den siste reducer-herdingen skal `npm run check` kjøres på nytt før merge.

## Implementert omfang

Branchen bygger bare markering av elementer som allerede finnes i prosjektmodellen:

- `selectedElementId: string | null` i transient editor-state
- valg av ett element på aktiv side
- tydelig valgt outline
- hover- og tastaturfokus
- klikk på tomt lerretsområde for å fjerne markering
- Enter og mellomrom for tastaturvalg
- tilgang til valgt element gjennom `useElementSelection`
- automatisk nullstilling når valgt element ikke lenger finnes
- nullstilling ved prosjektbytte og sidebytte
- rendering av eksisterende elementbokser fra prosjektmodellen
- bruk av desktopverdier og mobile overstyringer ved rendering

Branchen oppretter ingen elementer og legger ikke inn produksjonsinnhold.

## State-regler

`selectedElementId` er editorens midlertidige brukergrensesnitt-state. Den er ikke en del av `EditorProject` og skal derfor ikke:

- lagres i prosjektfilen
- utløse automatisk lagring
- inngå i prosjektets angre-/gjør om-historikk
- eksporteres eller publiseres

`EditorProject` forblir den autoritative kilden for sider og elementer.

Reducer-invarianter:

- bare elementer på aktiv side kan markeres
- en ugyldig forespørsel om markering ignoreres
- samme valgte ID gir ingen unødvendig state-endring
- bytte til en annen side fjerner markeringen
- prosjektbytte fjerner markeringen
- dersom en senere prosjektendring fjerner valgt element, nullstilles markeringen automatisk
- nye reducer-actions må håndteres eksplisitt av TypeScript

## Komponentansvar

### `EditorCanvas`

- leser aktiv side
- renderer aktive sideelementer
- fjerner markering ved pointer-hendelse på tomt arbeidsområde
- eier ikke prosjektdata eller markeringsstate

### `EditorCanvasElement`

- renderer én elementgrense
- løser responsiv synlighet, posisjon og størrelse for aktiv visning
- stopper pointer-hendelsen slik at valg ikke umiddelbart fjernes
- håndterer tastaturvalg
- viser valgt og fokusert tilstand

### `useElementSelection`

- eksponerer valgt ID og valgt element
- eksponerer `selectElement` og `clearSelection`
- skjuler dispatch-detaljer fra visuelle komponenter

### `editorProjectReducer`

- håndhever gyldig markering
- beskytter mot ugyldige og overflødige state-overganger
- rydder opp markering ved side- og prosjektendringer

## Bevisst ikke implementert

- elementoppretting
- sletting av elementer
- draing
- størrelsesendring
- låsing og opplåsing
- direkte tekstredigering
- bildeimport
- knapphandlinger
- objektverktøy
- farger
- historikk
- lagring

## Før senere funksjoner bygges

Følgende regler må bevares:

1. Elementoppretting skal bruke prosjektmodellen og ikke opprette tilfeldige DOM-objekter.
2. Sletting og prosjektmutasjoner skal gå gjennom reduceren slik at ugyldig markering ryddes automatisk.
3. Objektverktøy skal lese valgt element fra `useElementSelection`.
4. Klikk på objektverktøy utenfor lerretet skal ikke utilsiktet fjerne markeringen.
5. Tekstredigeringsmodus må skille mellom å markere elementet og å redigere innholdet.
6. Et faktisk knapp-element skal ikke aktiveres som lenke eller handling mens editoren er i vanlig markeringsmodus.
7. Når mobilskjuling bygges, må det avklares om et element som er skjult i aktiv visning også skal miste markeringen.
8. Tilgjengelig navn må senere bli mer spesifikt enn bare elementtype når modellen får navn eller innhold.

## Neste fase

Etter kontrollert merge til `main` er neste branch:

```text
feature/element-creation
```

Den skal opprette faktiske elementer fra Elementer-panelet. Draing, størrelsesendring og tekstredigering skal fortsatt ligge i senere branches.
