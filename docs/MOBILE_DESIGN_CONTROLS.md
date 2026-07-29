# Mobiltilpasset design og viewport-overstyringer

Dette dokumentet fastsetter retningen for responsiv redigering i Website-editoren. Det er en planlagt fase og endrer ikke dagens midlertidige responsive oppførsel som allerede er merget til `main`.

## 1. Formål

Brukeren skal kunne lage ett desktop-oppsett og deretter tilpasse utvalgte egenskaper for Telefon uten å ødelegge desktop-oppsettet.

Målet er ikke to uavhengige nettsider. Mobil skal arve desktop som standard og bare lagre eksplisitte forskjeller.

Planlagt branch:

```text
feature/mobile-design-controls
```

Branchen er ikke aktiv før fasen er eksplisitt valgt og godkjent.

## 2. Dagens midlertidige oppførsel på `main`

Før denne fasen er implementert:

- PC og Telefon renderer samme desktopgeometri når ingen mobilverdi finnes
- flytting og resizing i Telefon-visning committer til desktopgeometrien
- en endring i Telefon påvirker derfor også PC
- ingen mobiloverstyring opprettes skjult

Denne oppførselen stammer fra drag/resize-leveransen som ble merget gjennom PR #4. `feature/drag-resize` er en historisk branchreferanse, ikke aktiv arbeidsstatus.

Dette er kontrollert og godkjent som midlertidig oppførsel. Det skal ikke videreføres som endelig responsiv redigering.

## 3. Anbefalt arvemodell

Desktop er grunnlaget.

For hver responsiv egenskap gjelder:

- manglende `mobile`-verdi betyr **Arver fra PC**
- eksplisitt `mobile`-verdi betyr **Eget mobiloppsett**
- første relevant redigering i Telefon oppretter en mobiloverstyring
- senere desktopendringer påvirker bare mobilverdier som fortsatt arves
- eksplisitte mobiloverstyringer beholdes når desktop endres
- handlingen **Bruk PC-oppsett** fjerner mobiloverstyringen og gjenoppretter arv

Eksisterende modell støtter dette:

```ts
type ResponsiveValue<T> = {
  desktop: T
  mobile?: T
}
```

## 4. Første versjon av mobiloverstyringer

Første versjon bør støtte:

- posisjon
- bredde og høyde
- synlighet på mobil

Disse egenskapene vurderes senere og skal ikke blandes inn uten egen beslutning:

- typografi
- fontstørrelse
- avstander og padding
- ramme og hjørner
- bildebeskjæring
- innholdsrekkefølge

## 5. Brukergrensesnitt

Telefon-visningen skal tydelig vise om valgt element:

- arver oppsett fra PC
- har eget mobiloppsett
- er skjult på mobil

Nødvendige handlinger:

- **Lag eget mobiloppsett** eller automatisk oppretting ved første mobilendring
- **Bruk PC-oppsett** for å fjerne posisjons- og størrelsesoverstyringen
- **Skjul på mobil**
- **Vis på mobil** eller reset til arvet synlighet

Det skal ikke være uklart om en endring påvirker PC, Telefon eller begge.

## 6. Viewport-bevisste prosjektmutasjoner

Dagens action `set-element-desktop-layout` er midlertidig og må erstattes eller suppleres av en viewport-bevisst action.

En framtidig layoutmutasjon må eksplisitt angi:

- element-ID
- viewport
- ferdig posisjon
- ferdig størrelse
- tidspunkt

Reducerregler:

- desktop-action endrer bare `position.desktop` og `size.desktop`
- mobile-action endrer bare `position.mobile` og `size.mobile`
- reset-action fjerner mobilverdiene i stedet for å kopiere desktopverdien
- ukjent, låst, ugyldig eller uendret layout ignoreres
- transient pointer-preview forblir utenfor `EditorProject`

## 7. Oppretting av nye elementer

Før implementering må én regel velges og dokumenteres:

1. Nye elementer opprettes alltid på desktop og arves til mobil.
2. Oppretting i Telefon lager både desktopgrunnlag og en eksplisitt mobiloverstyring.

Første alternativ er enklest og mest forutsigbart. Andre alternativ krever en tydelig regel for hvor elementet skal ligge på desktop.

Det skal ikke opprettes bare-mobil-elementer uten en egen produktbeslutning.

## 8. Skjuling

Mobilskjuling skal bruke den responsive synlighetsverdien, ikke slette elementet.

Før funksjonen bygges må dette avklares:

- om et skjult valgt element mister markeringen straks
- hvordan brukeren finner og viser et skjult element igjen
- om et framtidig lagpanel kan markere skjulte elementer
- om bare-mobil-synlighet støttes i første versjon

## 9. Historikk og lagring

Når historikk og autolagring finnes:

- én ferdig mobiltransform er én prosjektendring
- oppretting av en mobiloverstyring er en varig prosjektmutasjon
- reset til PC-oppsett er en varig prosjektmutasjon
- transient preview inngår ikke i historikk eller lagring
- eksport og import må bevare både arv og eksplisitte mobilverdier

## 10. Forhåndsvisning og publisering

Editor, forhåndsvisning og publisert side skal tolke samme prosjektmodell likt.

Publisering skal generere:

- desktopregler som grunnlag
- én kontrollert media query for mobiloverstyringer
- ingen tilfeldige inline-stiler eller mange separate `<style>`-blokker
- ingen standardbruk av `!important`

## 11. Akseptansekriterier

Fasen er ikke ferdig før dette er bekreftet:

- et element uten mobiloverstyring følger desktopendringer
- første mobilendring kan opprette eget mobiloppsett
- mobil flytting og resizing endrer ikke desktop
- desktopendring overskriver ikke et eksplisitt mobiloppsett
- **Bruk PC-oppsett** fjerner mobiloverstyringen
- mobilskjuling sletter ikke elementet
- status for arv, overstyring og skjuling er tydelig
- peker og tastatur bruker samme viewport-bevisste layoutregler
- desktop og mobil har samme clamping- og minimumsmålregler der de gjelder
- historikk og lagring kan senere behandle én ferdig transform som én endring
- `npm run check` og separate desktop-/mobiltester er bestått

## 12. Ikke del av fasen uten ny beslutning

- flere selvstendige mobilbrytepunkter
- nettbrett som egen redigeringsmodus
- automatisk omplassering av elementer
- automatisk kollisjonsunngåelse
- AI-generert mobiloppsett
- bare-mobil-elementer
- generell CSS-editor

## 13. Avhengigheter

Fasen bygges først etter ny eksplisitt godkjenning. Den må lese og bevare grensene i:

- `docs/RESPONSIVE_DESIGN.md`
- `docs/DRAG_RESIZE.md`
- `docs/ELEMENT_MODEL.md`
- `docs/PROJECT_RULES.md`
