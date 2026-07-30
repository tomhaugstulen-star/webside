# Mobiltilpasset design og viewport-overstyringer

Dette dokumentet fastsetter retningen for responsiv redigering i Website-editoren. Det er planlagt som fase 23 og endrer ikke dagens midlertidige responsive oppførsel.

## 1. Formål

Brukeren skal kunne lage ett desktop-oppsett og deretter tilpasse utvalgte egenskaper for Telefon uten å ødelegge desktop-oppsettet.

Målet er ikke to uavhengige nettsider. Mobil skal arve desktop som standard og bare lagre eksplisitte forskjeller.

Planlagt branch opprettes først når fase 23 velges eksplisitt.

## 2. Avhengigheter før fase 23

Mobilfasen starter først etter at disse leveransene er stabile:

- portalens visuelle struktur
- automatisert testgrunnlag
- tekstboksbakgrunn og kjente modellgap
- arbeidsportalnavigator og hurtigsøk
- sider, seksjons-ID-er og navigasjonsmodell
- nettstedets Header og menynavigasjon
- Hero
- Header-redigering og nettstedstruktur

Mobilfasen skal utvide ferdige elementmodeller. Den skal ikke brukes til å improvisere manglende Header-, Hero- eller navigasjonsarkitektur.

## 3. Dagens midlertidige oppførsel

Før denne leveransen er implementert:

- PC og Telefon renderer samme desktopgeometri når ingen mobilverdi finnes
- flytting og resizing i Telefon-visning committer til desktopgeometrien
- en endring i Telefon påvirker derfor også PC
- ingen mobiloverstyring opprettes skjult
- Header følger full aktiv lerretsbredde og fast topposisjon
- Headerens høyde og typografi er foreløpig felles for PC og Telefon

Denne oppførselen er kontrollert som midlertidig grunnlag. Den skal ikke videreføres som endelig responsiv redigering.

## 4. Anbefalt arvemodell

Desktop er grunnlaget.

For hver responsiv egenskap gjelder:

- manglende `mobile`-verdi betyr **Arver fra PC**
- eksplisitt `mobile`-verdi betyr **Eget mobiloppsett**
- første relevante redigering i Telefon oppretter en mobiloverstyring
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

## 5. Første versjon av mobiloverstyringer

Første versjon for frie elementer skal støtte:

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

## 6. Header og nettstedmeny

Header har låste grunnregler:

- `x = 0` og `y = 0` er faste i alle viewporter
- synlig bredde avledes fra aktiv viewport
- første mobilversjon kan vurdere egen høyde og synlighet
- fri posisjon eller bredde krever en ny produktmodell

Nettstedets meny skal allerede støtte:

- automatisk responsiv modus
- alltid horisontal modus
- alltid kompakt modus

Mobilfasen skal:

- bevare valgt menymodus
- bruke dokumentert brytepunkt i automatisk modus
- sikre tastatur- og fokusoppførsel i kompakt meny
- ikke opprette en separat meny med parallelle data

## 7. Hero

Hero-modellen bygges før mobilfasen.

Mobilfasen kan bare overstyre egenskaper som Hero-modellen eksplisitt tillater, for eksempel:

- høyde
- synlighet
- tekstjustering
- eventuelt bildeutsnitt dersom dette låses som del av mobilomfanget

Hero skal beholde sine grunninvarianter, som full bredde eller fast plassering under Header, dersom disse er låst i fase 21.

## 8. Brukergrensesnitt

Telefon-visningen skal tydelig vise om valgt element:

- arver oppsett fra PC
- har eget mobiloppsett
- er skjult på mobil

Nødvendige handlinger:

- **Lag eget mobiloppsett** eller automatisk oppretting ved første mobilendring
- **Bruk PC-oppsett** for å fjerne overstyringen
- **Skjul på mobil**
- **Vis på mobil** eller reset til arvet synlighet

Det skal ikke være uklart om en endring påvirker PC, Telefon eller begge.

Portalens side-/elementnavigator skal vise skjult mobilstatus og gi en kontrollert vei tilbake til skjulte elementer.

## 9. Viewport-bevisste prosjektmutasjoner

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
- Headerens fast-topp- og fullbreddeinvariant håndheves uavhengig av viewport
- Hero-invarianten håndheves uavhengig av viewport

## 10. Oppretting av nye elementer

Før implementering må én regel velges og dokumenteres:

1. Nye elementer opprettes alltid på desktop og arves til mobil.
2. Oppretting i Telefon lager både desktopgrunnlag og en eksplisitt mobiloverstyring.

Første alternativ er enklest og mest forutsigbart. Andre alternativ krever en tydelig regel for hvor elementet skal ligge på desktop.

Det skal ikke opprettes bare-mobil-elementer uten en egen produktbeslutning.

Header opprettes alltid med fast `x = 0, y = 0` og kan ikke få en mobilposisjon.

Hero opprettes gjennom sin egen modell og får bare mobilverdier som er tillatt av den modellen.

## 11. Skjuling

Mobilskjuling skal bruke den responsive synlighetsverdien, ikke slette elementet.

Før funksjonen bygges må dette avklares:

- om et skjult valgt element mister markeringen straks
- hvordan brukeren finner og viser et skjult element igjen
- hvordan navigatoren markerer skjulte elementer
- om bare-mobil-synlighet støttes i første versjon

## 12. Historikk og lagring

Når fase 24 og 25 finnes:

- én ferdig mobiltransform er én prosjektendring
- oppretting av en mobiloverstyring er en varig prosjektmutasjon
- reset til PC-oppsett er en varig prosjektmutasjon
- transient preview og alignment-guider inngår ikke i historikk eller lagring
- prosjektformat og sikkerhetskopi bevarer både arv og eksplisitte mobilverdier

## 13. Lokal forhåndsvisning

Produktet skal ikke publisere nettsiden offentlig.

Editor og lokal forhåndsvisning skal tolke samme prosjektmodell likt.

Lokal forhåndsvisning skal bruke:

- desktopregler som grunnlag
- én kontrollert media query eller tilsvarende samlet mobilregel
- samme Header-menylogikk som editoren
- samme Hero-regler som editoren
- ingen tilfeldige inline-stiler eller mange separate `<style>`-blokker
- ingen standardbruk av `!important`

## 14. Akseptansekriterier

Leveransen er ikke ferdig før dette er bekreftet:

- et element uten mobiloverstyring følger desktopendringer
- første mobilendring kan opprette eget mobiloppsett
- mobil flytting og resizing endrer ikke desktop
- desktopendring overskriver ikke et eksplisitt mobiloppsett
- **Bruk PC-oppsett** fjerner mobiloverstyringen
- mobilskjuling sletter ikke elementet
- status for arv, overstyring og skjuling er tydelig
- peker og tastatur bruker samme viewport-bevisste layoutregler
- desktop og mobil har samme clamping- og minimumsmålregler der de gjelder
- Header forblir fast øverst og full bredde
- automatisk eller kompakt Header-meny fungerer korrekt
- Hero beholder sine låste invarianter
- historikk og lagring behandler én ferdig transform som én endring
- lokal forhåndsvisning viser samme responsive resultat
- `npm run check` og separate desktop-/mobiltester er bestått

## 15. Ikke del av leveransen uten ny beslutning

- flere selvstendige mobilbrytepunkter
- nettbrett som egen redigeringsmodus
- automatisk omplassering av elementer
- automatisk kollisjonsunngåelse
- AI-generert mobiloppsett
- bare-mobil-elementer
- generell CSS-editor
- fri mobilposisjon eller bredde for Header
- en egen parallell mobilmenymodell

## 16. Avhengigheter

Fasen bygges først etter ny eksplisitt godkjenning. Den må lese og bevare grensene i:

- `docs/WORK_PLAN.md`
- `docs/RESPONSIVE_DESIGN.md`
- `docs/ELEMENT_MODEL.md`
- `docs/PROJECT_RULES.md`
- `docs/CODE_AUDIT.md`
