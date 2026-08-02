/**
 * Wiederkehrende Marketing-Termine. Feste Daten sind exakt; Termine mit
 * `approx: true` variieren jährlich leicht (z. B. Prime Day) — Datum ist
 * eine Orientierung, kein exaktes Datum.
 */
const CALENDAR_EVENTS = [
  { name: "Neujahrs-Budgets", month: 1, day: 1, note: "Jahresstart: neue Kampagnen-Budgets freigeben", relevantFor: "alle Branchen" },
  { name: "Valentinstag", month: 2, day: 14, relevantFor: "Blumen/Floristik, Schmuck, Beauty, Gastronomie, Süßwaren, Reisen", presentationId: "valentines-day-2026" },
  { name: "Muttertag", rule: "nth-sunday", month: 5, n: 2, relevantFor: "Blumen/Floristik, Schmuck, Beauty, Mode, Gastronomie" },
  { name: "Amazon Prime Day", month: 7, day: 12, approx: true, note: "Termin wird jährlich neu angekündigt", relevantFor: "E-Commerce/Retail allgemein, Elektronik, Haushalt" },
  { name: "Back-to-School", month: 8, day: 25, approx: true, relevantFor: "Mode, Elektronik (Laptops/Tablets), Bürobedarf, Möbel, Buchhandel" },
  { name: "Halloween", month: 10, day: 31, relevantFor: "Kostüme/Mode, Süßwaren, Deko, Spielwaren" },
  { name: "Singles Day", month: 11, day: 11, relevantFor: "E-Commerce/Retail allgemein, Elektronik, Mode, Beauty" },
  { name: "Black Friday", rule: "nth-friday-before-dec1", month: 11, relevantFor: "praktisch alle Konsumgüter-Branchen, besonders Elektronik, Mode, Möbel", presentationId: "winning-holiday-moments" },
  { name: "Cyber Monday", rule: "black-friday-plus-3", relevantFor: "vor allem Elektronik/Tech", presentationId: "winning-holiday-moments" },
  { name: "Weihnachtsgeschäft", month: 12, day: 24, relevantFor: "praktisch alle Branchen, besonders Spielwaren, Mode, Beauty, Elektronik", presentationId: "winning-holiday-moments" },
];

function nthSunday(year, month, n) {
  const d = new Date(year, month - 1, 1);
  let count = 0;
  while (d.getMonth() === month - 1) {
    if (d.getDay() === 0) {
      count++;
      if (count === n) return new Date(d);
    }
    d.setDate(d.getDate() + 1);
  }
  return null;
}

function blackFriday(year) {
  // Vierter Freitag im November (US-Thanksgiving-Konvention)
  const d = new Date(year, 10, 1);
  let count = 0;
  while (d.getMonth() === 10) {
    if (d.getDay() === 5) {
      count++;
      if (count === 4) return new Date(d);
    }
    d.setDate(d.getDate() + 1);
  }
  return null;
}

function resolveDate(ev, year) {
  if (ev.rule === "nth-sunday") return nthSunday(year, ev.month, ev.n);
  if (ev.rule === "nth-friday-before-dec1") return blackFriday(year);
  if (ev.rule === "black-friday-plus-3") {
    const bf = blackFriday(year);
    if (!bf) return null;
    const d = new Date(bf);
    d.setDate(d.getDate() + 3);
    return d;
  }
  return new Date(year, ev.month - 1, ev.day);
}

function upcomingEvents(from = new Date(), count = 3) {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const withDates = CALENDAR_EVENTS.map((ev) => {
    let date = resolveDate(ev, today.getFullYear());
    if (!date || date < today) date = resolveDate(ev, today.getFullYear() + 1);
    const days = Math.round((date - today) / 86400000);
    return { ...ev, date, days };
  });
  withDates.sort((a, b) => a.date - b.date);
  return withDates.slice(0, count);
}
