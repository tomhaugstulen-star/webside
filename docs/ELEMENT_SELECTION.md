# Elementmarkering

Dette dokumentet beskriver den historiske markeringsfasen i `feature/element-selection` og grensene som senere funksjoner skal bevare.

## Status

Fasen er utviklet, gjennomgått, kontrollert og ligger på `main`.

Tidligere formuleringer om at `npm run check` måtte kjøres på nytt før merge og at elementoppretting var «neste fase», beskrev branchens tilstand 28. juli 2026. De er ikke gjeldende prosjektstatus.

Bekreftet i fasen:

- ett element kan markeres
- markeringen flyttes når et annet element velges
- klikk på tomt lerretsområde fjerner markeringen
- Tab kan flytte fokus til elementer
- Enter og mellomrom kan markere fokusert element
- oppførselen fungerer i desktop- og mobilvisning
- den midlertidige test-fixturen ble fjernet
- et nytt prosjekt åpner helt blankt
- ESLint, TypeScript, Dependency Cruiser og produksjonsbuild ble kontrollert før fasen ble avsluttet

## Implementert omfang

Branchen bygde markering av elementer som allerede finnes i prosjektmodellen:

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

Branchen opprettet ingen elementer og la ikke inn produksjonsinnhold. Elementoppretting ble senere implementert i en separat fase.

## State-regler

`selectedElementId` er transient editor-state. Den er ikke en del av `EditorProject` og skal derfor ikke:

- lagres i prosjektfilen
- utløse automatisk lagring
- inngå i prosjektets angre-/gjør om-historikk
- eksporteres eller publiseres

`EditorProject` er den autoritative kilden for sider og elementer.

Reducer-invarianter:

- bare elementer på aktiv side kan markeres
- en ugyldig forespørsel om markering ignoreres
- samme valgte ID gir ingen unødvendig state-endring
- bytte til en annen side fjerner markeringen
- prosjektbytte fjerner markeringen
- dersom en prosjektendring fjerner valgt element, nullstilles markeringen automatisk
- nye reducer-actions håndteres eksplisitt av TypeScript

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

## Ikke del av den historiske branchen

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

Flere av disse funksjonene ble senere implementert i separate, avgrensede faser. Listen beskriver bare omfangsgrensen for `feature/element-selection`.

## Regler som senere funksjoner skal bevare

1. Elementoppretting bruker prosjektmodellen og oppretter ikke tilfeldige DOM-objekter.
2. Sletting og prosjektmutasjoner går gjennom reduceren slik at ugyldig markering ryddes automatisk.
3. Objektverktøy leser valgt element fra `useElementSelection`.
4. Klikk på objektverktøy utenfor lerretet skal ikke utilsiktet fjerne markeringen.
5. Tekstredigeringsmodus skiller mellom å markere elementet og å redigere innholdet.
6. Et knapp-element aktiveres ikke som lenke eller handling i vanlig editormodus.
7. Når mobilskjuling bygges, må det avklares om et skjult valgt element også skal miste markeringen.
8. Tilgjengelig navn skal bli mer spesifikt når modellen får navn eller innhold.

## Historisk videreføring

Elementoppretting var den neste planlagte fasen etter markering og ble senere implementert. Drag/resize, objektlåsing, tekstredigering, høyremeny og sikker sletting er også senere fullført og ligger på `main`.