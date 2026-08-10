/**
 * Leichte Trivia für das Maskottchen — ausschließlich Fakten aus der
 * Online-Marketing- und Digitalwerbung-Welt, rein zur Auflockerung.
 */
const FUN_FACTS = [
  "Der erste bezahlte Online-Werbebanner ging 1994 live (AT&T auf HotWired) — Klickrate: 44 %. Heute freut man sich über 2 %.",
  "\"Spam\" als Begriff für Massen-Werbemails stammt von einem Monty-Python-Sketch, nicht vom Dosenfleisch direkt.",
  "Der Black Friday hat seinen Namen angeblich von der Verkehrspolizei Philadelphias — wegen des Verkehrschaos, nicht wegen roter Zahlen.",
  "Die erste registrierte Domain der Welt (symbolics.com) wurde 1985 angemeldet — heute ist sie ein Museumsstück.",
  "Cookies heißen so, weil Programmierer in den 90ern Software-Häppchen gern nach Keksen benannten.",
  "Der Begriff \"Klickrate\" (CTR) ist so alt wie die ersten Bannerwerbungen — und war schon 1994 ein Thema.",
  "Singles Day (11.11) ist mittlerweile umsatzstärker als Black Friday und Cyber Monday zusammen.",
  "Die durchschnittliche Aufmerksamkeitsspanne für eine Anzeige liegt bei unter 2 Sekunden — kürzer als ein Wimpernschlag mit Zögern.",
  "\"ROAS\" klingt nach Fachbegriff, ist aber im Kern nur eine simple Division — Umsatz durch Werbekosten.",
  "Der erste Werbespot im deutschen Fernsehen lief 1956 — für ein Waschmittel.",
  "GoTo.com (später Overture) erfand 1998 das Pay-per-Click-Modell für Suchmaschinenwerbung — zwei Jahre vor Google AdWords.",
  "Google AdWords (heute Google Ads) startete im Oktober 2000 in der Beta mit rund 350 Werbetreibenden.",
  "Amazons \"1-Click\"-Bestellbutton war von 1999 bis 2017 patentiert — fast 18 Jahre lang durften Konkurrenten ihn nicht einfach nachbauen.",
  "Die erste massenhaft verschickte Werbe-E-Mail — ein Vorläufer des heutigen Spams — ging schon 1978 übers ARPANET raus, lange vor dem eigentlichen Internet.",
  "Facebook führte seine ersten Werbeanzeigen erst im November 2007 ein — heute kaum vorstellbar, dass es davor keine gab.",
];

function factOfTheDay() {
  const bucketIndex = Math.floor(Date.now() / (8 * 60 * 60 * 1000));
  return FUN_FACTS[bucketIndex % FUN_FACTS.length];
}

function randomFact(excludeText) {
  const pool = FUN_FACTS.filter((f) => f !== excludeText);
  return pool[Math.floor(Math.random() * pool.length)] || FUN_FACTS[0];
}
