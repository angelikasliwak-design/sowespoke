/**
 * Leichte Marketing-Trivia für das Maskottchen — bewusst nicht als
 * Fachaussage gemeint, rein zur Auflockerung.
 */
const FUN_FACTS = [
  "Der erste bezahlte Online-Werbebanner ging 1994 live — Klickrate: 44 %. Heute freut man sich über 2 %.",
  "\"Spam\" als Begriff für Massen-Werbemails stammt von einem Monty-Python-Sketch, nicht vom Dosenfleisch direkt.",
  "Der Black Friday hat seinen Namen angeblich von der Verkehrspolizei Philadelphias — wegen des Verkehrschaos, nicht wegen roter Zahlen.",
  "Die erste registrierte Domain der Welt (symbolics.com) wurde 1985 angemeldet — heute ist sie ein Museumsstück.",
  "Cookies heißen so, weil Programmierer in den 90ern Software-Häppchen gern nach Keksen benannten.",
  "Der Begriff \"Klickrate\" (CTR) ist so alt wie die ersten Bannerwerbungen — und war schon 1994 ein Thema.",
  "Singles Day (11.11) ist mittlerweile umsatzstärker als Black Friday und Cyber Monday zusammen.",
  "Die durchschnittliche Aufmerksamkeitsspanne für eine Anzeige liegt bei unter 2 Sekunden — kürzer als ein Wimpernschlag mit Zögern.",
  "\"ROAS\" klingt nach Fachbegriff, ist aber im Kern nur eine simple Division — Umsatz durch Werbekosten.",
  "Der erste Werbespot im deutschen Fernsehen lief 1956 — für ein Waschmittel.",
];

function factOfTheDay() {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return FUN_FACTS[dayIndex % FUN_FACTS.length];
}

function randomFact(excludeText) {
  const pool = FUN_FACTS.filter((f) => f !== excludeText);
  return pool[Math.floor(Math.random() * pool.length)] || FUN_FACTS[0];
}
