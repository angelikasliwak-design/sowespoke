---
target: gesamte Website (sowespoke.pages.dev)
total_score: 25
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
timestamp: 2026-08-02T14-53-14Z
slug: gesamte-website-sowespoke-pages-dev
---
Method: dual-agent (A: general-purpose design-review agent · B: general-purpose detector/browser-evidence agent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Distinct local/network/server error states with conditional retry; "Kopiert" confirmation; no skeleton loaders but state is always legible. |
| 2 | Match System / Real World | 3 | Correct German du/ihr handling, real MS Advertising terminology; English-only Anfragen page is deliberate and explained. |
| 3 | User Control and Freedom | 3 | Back-links and hash-navigation work; mascot dismissible. No persistence of Anfragen checklist/account-number input across navigation. |
| 4 | Consistency and Standards | 3 | The typed 3px border rule (side-card=magenta, info-box=petrol, mailgen=yellow) held with 100% fidelity across ~10 pages checked — undercut by the mascot's own black-bordered speech bubble, a 4th border color not covered by the rule, floating on top of the other three. |
| 5 | Error Prevention | 4 | Copy button hard-blocked via regex while any `{Placeholder}` remains unfilled — a real, product-specific safeguard against sending a client email with template junk. |
| 6 | Recognition Rather Than Recall | 3 | Category-color thumbnails, "Zuletzt angesehen" card, calendar widget with linked presentation. |
| 7 | Flexibility and Efficiency of Use | 1 | No shortcuts, no bulk/select-all on 45+10-item checklists, no persisted account numbers for an account manager who re-requests the same client accounts daily. |
| 8 | Aesthetic and Minimalist Design | 1 | Restrained token palette on paper, but Assessment B's automated collision check confirmed the mascot visually overlaps real content/controls in 8 of 14 tested route×viewport combinations, including the page's own primary CTA button — decoration actively sitting on top of task content is the opposite of minimalist in practice. |
| 9 | Error Recovery | 3 | News-feed errors are specific and actionable in plain German; no client-side validation feedback for malformed account numbers in Anfragen textareas. |
| 10 | Help and Documentation | 1 | No help affordance anywhere in the 5-icon rail; the only proactive channel (the mascot) dispenses trivia, not task guidance. |
| **Total** | | **25/40** | **Acceptable band (20–27)** |

(Heuristic 8 lowered from Assessment A's initial 2 to 1 after weighing Assessment B's quantified collision evidence — 8/14 combinations, including direct CTA overlap — which is more severe than "two confirmed screenshots.")

## Design Specificity Verdict

**LLM assessment (Assessment A):** Split verdict. The information architecture and copy are genuinely specific to this product — du/ihr register-switching logic, a 45-item real Microsoft beta-program catalog, channel-tagged news, a placeholder copy-guard tied directly to this tool's actual failure mode. No template-cloned SaaS product has this content model. The visual/illustration language is not equally specific, however: the comic pop-art skin (speech-bubble mascot, sparkle bursts, hand-drawn corner illustrations, thick colored borders) could be dropped onto an unrelated product with zero adaptation — nothing about the motifs (megaphone, sparkles, dots) is derived from marketing/advertising or B2B knowledge work as a domain. DESIGN.md is candid that this direction came from browsing generic comic-book vector-asset sites, which is honest, but it means specificity lives entirely in the IA/copy layer, not the visual layer.

**Deterministic scan (Assessment B):** `detect.mjs` project-wide scan: exit code 2, 2 warning-severity findings (`overused-font` on Inter, `bounce-easing` on the row-thumbnail hover transform) and 4 advisory findings (undocumented colors `#7a4a00`/`#fff3d6` used twice each in the mailgen warning banner). Both warnings are **false positives** given this project's own documented choices (Inter is DESIGN.md's deliberate body font; the bounce easing is a previously-approved deliberate exception for row-hover playfulness). The color advisories are **not** false positives — those two hex values aren't in DESIGN.md's palette and represent small, genuine token drift (low severity, easy fix). URL-mode Puppeteer scanning was unavailable in that agent's environment (missing full `puppeteer` package) — flagged as a gap, not silently skipped.

**Visual overlays:** No live in-browser overlay was injected (both agents used direct Puppeteer screenshot/measurement scripts rather than the detector's injection flow, which needs a local dev server this project's Cloudflare Functions don't support). Evidence instead comes from real screenshots and DOM measurements against the live `sowespoke.pages.dev` deployment, which both agents cite with exact file/line/pixel/ratio numbers throughout.

## Overall Impression

The content and interaction logic are unusually mature for an internal tool — the du/ihr handling, the placeholder copy-guard, and the differentiated error states show real product thinking. The visual system's discipline (three border colors, each tied to exactly one component type, held with zero drift across ten-plus pages) is a genuine craft achievement given how easy that rule would be to erode over many small edits. The single biggest opportunity: the mascot, added for personality, is now measurably fighting the product's own primary task in the two places that matter most — the mail-generator CTA and the Anfragen forms — and needs a structural fix (not a further style tweak) before more decoration is added anywhere else.

## What's Working

1. **Error-state writing.** `renderNews` distinguishes local/network/server failure modes with distinct plain-German copy and a conditional retry button only where retrying makes sense — most internal tools show one generic failure message.
2. **The typed-border rule's execution discipline.** Verified by Assessment A across every screenshot: side-card always magenta, info-box always petrol, mailgen always yellow, zero instances of the "mixed randomly per card" pattern the project explicitly guards against.
3. **Technical stability.** Assessment B found zero console errors, zero failed requests, zero broken images, and a fully working live `/api/news` endpoint across all 14 route×viewport combinations tested — the recent deployment and KV work paid off cleanly.
4. **Keyboard focus visibility.** A strong, consistent 3px solid magenta focus ring on every interactive element across all 14 combinations tested — no invisible or default-outline focus anywhere.

## Priority Issues

**[P0] Mobile horizontal-overflow silently clips page content on `/#/vorlagen/onboarding`.**
Why it matters: confirmed independently by both agents via live `scrollWidth` measurement (819px content in a 390px viewport) — a mobile user sees text mid-word-truncated on the right edge with zero scrollbar or visual cue that content is missing, because `overflow-x:hidden` is set globally.
Fix: change the mobile `.detail__body` grid override from `1fr` to `minmax(0, 1fr)` (matching the desktop rule two lines above), and add `overflow-wrap: anywhere` to `.pre-line`/`.info-box__preview`/mailgen textareas so a future long URL can't repeat this.
Suggested command: `/impeccable adapt`

**[P0] The mascot bubble visually overlaps real content and controls on 8 of 14 tested route×viewport combinations — including the page's own primary CTA.**
Why it matters: Assessment B's automated collision check plus manual screenshots confirm the bubble sits directly on top of the "In Zwischenablage kopieren" button on the presentation-detail page (desktop), the SAP-ID download card (mobile+desktop Anfragen), the calendar's "Singles Day" info (mobile home), and two of the new rating buttons (mobile home). Because the bubble has `pointer-events: auto` and sits at `z-index: 40`, a click in the overlapped region hits the bubble, not the control underneath — this can functionally block the primary task, not just look messy.
Fix: reposition the mascot away from the bottom-right on any route that renders a `.mailgen` or `.msreq` (e.g. dock it to an empty rail area instead), or cap its bubble width/position so it structurally cannot reach the card region.
Suggested command: `/impeccable layout`

**[P1] News rating buttons (`.row__rate-btn`) measure 30×30px, below the 44×44px minimum touch target.**
Why it matters: confirmed via live `getBoundingClientRect` at both 1280px and 390px (non-responsive, same size both places). Below ~46% of the required tap area, this is a real mis-tap risk on the exact feature just shipped this session.
Fix: increase to at least 44×44px, or extend the invisible hit-area via padding while keeping the visual size smaller.
Suggested command: `/impeccable audit`

**[P1] Teal link text fails WCAG AA contrast.**
Why it matters: `.msreq__example summary` ("Beispiel-Report ansehen") renders `var(--teal)` (#2f8f8a) at 0.9rem on white/paper — computed 3.88:1 / 3.56:1, both below the 4.5:1 normal-text threshold. This sits inside the Anfragen checklist, a component central to daily use.
Fix: darken teal specifically for text usage (keep the lighter value for borders/icons, where only 3:1 applies), e.g. `#26706c`.
Suggested command: `/impeccable audit`

**[P2] The 31-item ungrouped beta-program catalog and 10-item bulk-team list violate the project's own chunking guideline, with no working-memory aid.**
Why it matters: `MS_BETA_PROGRAMS` has 45 entries — 14 grouped, 31 in a single flat bucket; `MS_BULK_TEAM_TASKS` has 10 with no grouping at all (55 checkboxes total confirmed live on the page). Both scroll inside a `max-height: 22rem` box with no running "X ausgewählt" counter and no filter — this defers the overload rather than resolving it, on the exact page flagged in advance as the stress case.
Fix: sub-group the 31-item catalog by function, add a live selection counter, consider a type-ahead filter given the volume.
Suggested command: `/impeccable layout`

**[P2] No persistence of Anfragen form state (account numbers, checklist selections) across navigation.**
Why it matters: an account manager working the same 5–10 client accounts daily must retype account numbers every single visit — this is exactly the repeat-task pattern the tool otherwise optimizes for (see the "Zuletzt angesehen" and news-vote localStorage patterns already in place elsewhere).
Fix: persist the account-number textarea(s) and possibly last-used checklist selections per section in localStorage, same pattern already used for news votes.
Suggested command: `/impeccable harden`

## Persona Red Flags

**Alex (Power User, daily use):** No persisted account numbers across sessions — must retype into the Anfragen textareas every time. Zero keyboard shortcuts or bulk/select-all on the 45+10-item checklists. The mascot reappearing on every full page load and sitting over the mailgen area becomes a recurring tax specifically for the person who opens detail pages most often.

**Sam (Accessibility-Dependent):** The mascot carries `role="status"` and its text changes automatically every 15 seconds for as long as it's open — for a screen-reader user this means unsolicited, periodic announcements interrupting whatever they're doing, with no pause control short of closing it entirely. The confirmed overlap bug (P0 above) is also a genuine low-vision/WCAG 2.4.11 concern, not just cosmetic. The teal link contrast failure (P1) directly affects this persona reading "Beispiel-Report ansehen."

**Riley (Stress-Tester):** The mobile clipping bug (P0) is exactly what a stress-tester finds first — invisible in casual desktop review, zero console error, `overflow-x:hidden` actively hiding the evidence, only surfaces via DOM inspection or a real narrow device. The 55-checkbox unchunked list is a textbook "what happens at real data volume" failure a 3-item mockup would never reveal.

## Minor Observations

- The row-hover micro-interaction (thumbnail scale+rotate on hover) is a well-judged, restrained bit of personality that doesn't fight list scanability — more of this, less of the mascot, would serve the "comic energy without chaos" goal better.
- `MS_CONTACT_NAME = "Anne-Celine"` is hardcoded in one place — low risk, but worth knowing it's a single source of truth if that contact ever changes.
- Disabled buttons (`.btn:disabled { opacity: 0.5 }`) become nearly illegible in their composited colors (~1.62:1 effective text contrast) — WCAG exempts disabled controls from the requirement, but it's a real legibility rough edge worth a look during the next polish pass.
- Two undocumented colors (`#7a4a00`, `#fff3d6`, the mailgen warning-banner palette) aren't in DESIGN.md — minor token-drift, cheap to fix by adding them to the documented palette or swapping to existing tokens.
- Minor tab-order anomaly on `/#/microsoft-learn`: one Tab press lands with `document.activeElement === document.body` between the mascot buttons and the rail logo — worth a quick look, not urgent.
- No dedicated "page not found" state for an invalid hash route (silently falls back to the news homepage), inconsistent with the good "Präsentation nicht gefunden" handling that does exist for invalid presentation IDs.

## Questions to Consider

1. The mascot's own speech bubble carries a fourth border color (black) on top of the three governed by the Bunte-Rahmen-Regel — is that intentional, or did the rule just never get extended to cover it?
2. If the daily fact is meant to build affinity, should it ever appear on a page mid-task (mailgen open, Anfragen form in progress) at all, or only on list/browsing pages where nothing is at stake?
3. The project's own guidelines call for ≤4 items per chunk and ≤4 simultaneous choices — was the 55-item checklist volume ever weighed against that, or did "scrollable" get treated as equivalent to "chunked"?
