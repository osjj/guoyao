# GUOYAO sculptural page backgrounds — V5

final result: passed

## Scope and source truth

The user requested visibly richer page backgrounds after finding V4's microtextures and gradients too plain. This revision introduces recognisable metal-inspired forms while preserving the approved typography, page structure, photo arrangement and case facts.

The V4 page and both CSS modules were backed up in this directory. `source-desktop.png` and `source-mobile.png` were captured from the actual local V4 page before changes. `page.tsx` and its V4 backup have identical SHA-256 hashes; this revision changes two CSS modules and adds four decorative SVG assets.

## Background artwork

All four assets are original code-native SVG decorations, not case photographs or evidence of manufactured products. They have transparent canvases and contain no brands, words or external dependencies. Each asset was rendered with Sharp on an appropriate background and the PNG result was opened for inspection before integration.

- `metal-ribbon.svg`: 900×1000, 4.6KB, a broad S-shaped metal ribbon with champagne/silver surfaces and edge highlights.
- `contour-canopy.svg`: 1400×600, 3.4KB, three layered curved metal planes.
- `folded-silver.svg`: 1600×900, 3.9KB, broad architectural folds with light and shadow.
- `brass-fan.svg`: 1400×800, 14.3KB, radial brass folds with distinct lit faces and seams.

## Visual review

| Before | After | Why |
| --- | --- | --- |
| Hero has a faint grid and local glow | A clearly visible S-shaped ribbon occupies the space between the heading and introduction | Creates a memorable background form while leaving both text blocks clear |
| Project-story background is largely empty paper | Layered curved planes sweep across the upper right and a small lower-edge return | Uses the existing editorial whitespace without moving photographs |
| Applications have uniform pale brushed colour | Broad silver folds add diagonal planes and depth | Gives the section an architectural material character |
| Workshop repeats the hero's grid atmosphere | Darkened structural folds provide a distinct angular backdrop | Separates the making/process section from the flowing hero form |
| Gallery and brief use mild paper/champagne gradients | Cropped brass fan planes frame the gallery; the brief uses a larger fan with a calm translucent list panel | Adds visible shape while keeping the inquiry preparation text readable |
| Microgrid, texture and large outlined numerals compete with new art | Removed the old fine grid/large outline-number emphasis; retained restrained grain and technical labels | Keeps the richer composition coherent |

Backgrounds sit behind content through isolated section stacking contexts; all decorative pseudo-elements ignore pointer events. They do not overlay/recolour the photographs. No continuous animation was added. Phone compositions use their own cropping and placement, retaining a visible fold or edge rather than shrinking the complete desktop composition.

`comparison-desktop.png`, `comparison-mobile.png`, `comparison-applications.png` and `comparison-brief.png` place V4 on the left and V5 on the right. The script rejects mismatched viewport dimensions and combines screenshots without resampling individual images: 1440×900 desktop and 390×844 mobile, deviceScaleFactor 1. Both combined and original images were opened for review. Screenshots wait for font loading, visible image decode, decorative SVG decode and two animation frames after restoring the browser window.

Typography, case images and copy remain. The expanded browser photo audit reported 28 photographs, 28 distinct paths and exactly the same source sequence as the approved V3/V4 arrangement. No source-photo edits, invented project claims or stored case-content changes were introduced.

## Resolved review findings

An independent desktop review confirmed the new forms are clearly visible and the background variety is materially increased. A representative gallery-intro contrast weakness was corrected by deepening the text to `#2d4033`; review recomputed approximately 7.46–7.51:1 against two sampled brass-background points. Application descriptions, workshop supporting text, gallery counts and brief descriptions were also adjusted for the stronger backgrounds. These representative checks are not a full accessibility audit.

## Responsive and interaction evidence

- Desktop hero, stories, applications, gallery, workshop and brief screenshots were inspected. Mobile hero, applications, gallery, brief and supporting responsive captures were inspected.
- Bounds checks at 1280×720, 720×900, 390×844, 375×667 and 320×740 found no horizontal document overflow or tested headings/links/buttons outside the viewport. `responsive-checks.json` records the results.
- At 390px the brief's translucent panel measures x8, width374, right382, retaining an 8px margin on both sides.
- Hero CTA centre hit-testing confirmed the anchor is clickable; clicking it reached the gallery. Decorative background layers did not intercept the action.
- Displays filtering and the portrait lightbox worked despite section clipping/isolation. At 390×844 the native dialog remained inside the viewport, its close control stayed visible, document scrolling locked, the right arrow navigated correctly, and Escape restored photograph-button focus.
- Expanding all photographs retained the approved 28-photo sequence; returning through a category reset the gallery to its default view.
- Runtime/Log checks reported no application exceptions or errors during the inspected fresh-page and interaction passes. No valid inquiry was submitted.

## Validation and local boundary

Both CSS modules parsed successfully with PostCSS. `git diff --check` passed. Final `next build` passed compilation, TypeScript and generation of 27 static pages. Final development-preview restart checks are recorded below.

This is local preview work only: no commit, push, deployment, database-content changes, inquiry submission or real email-delivery verification. No physical-device, full screen-reader or performance benchmark is claimed.

## Final restart verification

- Restarted the development server on `127.0.0.1:3000` and loaded the homepage afresh after the successful build.
- All four decorative SVG resources loaded. The hero decoration computes `pointer-events: none`; gallery intro computes `rgb(45, 64, 51)` as intended.
- Initial render retains 24 positions / 24 distinct case photographs; the expanded sequence was verified separately above. No production analytics script was present.
- Final Runtime/Log check recorded no errors. `final-verification.json` contains the receipt.
- Updated desktop section screenshots and captured `20-final-hero.png` at 1440×1100 to show the complete hero background. Final individual and matched-viewport comparison images were opened and inspected.

No remaining P0/P1/P2 issue was found in the inspected states. The local server remains running; the preview is left at the top in desktop layout.

## Gold reading-progress addition

Added a decorative 3px gold progress line below the public-site navigation. It follows page scroll directly, recalculates on viewport/content-height changes and pathname changes, and does not capture pointer or keyboard input. Browser measurements verified top 0%, middle 50%, bottom approximately 100%, gallery expansion and About-route reset. The mobile check was repeated after resize/layout settled and measured exactly 50% against the current scroll ratio. Desktop and mobile screenshots were inspected. Scoped ESLint, `tsc --noEmit` and `git diff --check` passed for this addition; Runtime/Log checks reported no errors. Evidence: `output/header-scroll-progress-20261024/`.
