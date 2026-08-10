---
target: News-Seite (renderNews, app.js)
total_score: 25.5
max_score: 36
na_heuristics: 10
p0_count: 2
p1_count: 3
timestamp: 2026-08-10T13-04-22Z
slug: news-seite-rendernews-app-js
---
# Design-Kritik: News-Seite (renderNews, app.js)

## Design Health Score
9 Heuristiken bewertet (10=n/a, internes Tool für geschultes Personal): 25.5/36 ≈ 71% (Good).
Schwächster Wert: Ästhetik/Minimalismus (1.5/4) — P0-Ausreißer.

## Design-Spezifität
Marke unverwechselbar (Magenta/Petrol/Gelb diszipliniert, echte Kanal-Taxonomie), aber Ton
passt nicht zum eigenen Operate-Mode-Anspruch (CLAUDE.md: "schnell finden, nicht unterhalten").

## Priority Issues
- P0: Null Artikel oberhalb des Falzes, Desktop (1440x900) und Mobile (390x844).
- P0/P1: Schwebendes Maskottchen blockiert beim Scrollen echte Taps auf Artikelkarten (pointer-events aktiv).
- P1: Bewertungs-Buttons auf allen 8 Karten dauerhaft aktiv, 16 zusätzliche Tap-Ziele.
- P1/P2: Ton-Mismatch, Marketing-Vokabular auf Operate-Tool.
- P2: row__rate-status wird nie befüllt, kein Screenreader-Feedback bei Bewertung.

## Nutzer-Entscheidung
Hero verkleinern: ja. Maskottchen beim Scrollen einklappen: ja. Rate-Buttons nur bei Hover/Fokus: ja.
