# Homepage Project-Photo Motion

Reviewed 2026-10-08. Design research for a professional, restrained maker-portfolio homepage. This is a motion
direction, not an implementation spec.

## Initial recommendation

Use a **manual, cinematic crossfade** as the default hero treatment: one project photo at a time, a short restrained
opacity transition, and persistent previous/next controls plus a direct project link. Keep the project title and
caption steady rather than animating them with the image. Do not auto-advance by default. This gives the work visual
focus without making the visitor wait or introducing continuous movement. If auto-advance is later judged necessary,
provide a persistent pause/resume control and stop while the page is hidden.

## Prototype comparison

The development-only previews deliberately start A and B with seven-second auto-advance so the requested motion can
be evaluated without extra setup. Both expose pause/play controls, pause on hover or focus, and suspend rotation when
offscreen or the tab is hidden. Reduced-motion users start paused with transitions disabled. C is manual-only.
The comparison is archived on the local `prototype/hero-motion` branch.

## Selected direction

On 2026-10-08, the owner selected **A, cinematic fade**, and explicitly chose to keep seven-second automatic
rotation with pause controls. The production homepage retains A's split layout, uncropped photos, and one-second
crossfade of the photo and caption. The introduction stays steady. Manual selection or keyboard focus stops
rotation until Play is selected; hovering, leaving the viewport, and hiding the tab suspend rotation temporarily.
Reduced-motion users start paused with transitions disabled. The comparison switcher and variants B/C are removed
from the production code. This owner-approved decision supersedes the initial manual-only recommendation above.

## Three approaches

| Approach                    | Motion and character                                                                                       | When it fits                                                                        | Trade-off                                                                                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cinematic crossfade**     | One full-bleed or framed image fades gently into the next; typography stays still.                         | A few strong photographs should make a calm, polished first impression.             | Changes can be subtle, but the current project may be overlooked if it advances without user intent.                                              |
| **Editorial sliding split** | The image and project details occupy distinct panels; a short horizontal slide hands off between projects. | The maker wants the craft story and image to feel like a designed editorial spread. | More directional movement and more simultaneous changing content; avoid autoplay and remove the slide motion for reduced-motion preferences.      |
| **Horizontal project rail** | Several project cards remain visible in a horizontally browsable row; user scrolls or selects a card.      | Project discovery matters more than a single, immersive hero image.                 | Less cinematic and may take more vertical space; ensure the rail is visibly scrollable and keyboard-operable rather than implying hidden content. |

These motion descriptions and fit assessments are design recommendations, not requirements from the cited standards.

## Source-backed accessibility facts

- WAI recommends a labeled region and typically representing carousel items as a list. It says carousel functions,
  including navigation, must be keyboard-operable; changes should be communicated to assistive technology; and focus
  should be managed clearly. [WAI carousel structure](https://www.w3.org/WAI/tutorials/carousels/structure/)
  and [WAI carousel overview](https://www.w3.org/WAI/tutorials/carousels/).
- WAI's carousel example uses semantic previous/next buttons, announces the current item in a polite live region, and
  does not move focus when previous/next is activated. Its animation guidance recommends a stop/resume button and
  pausing on hover and keyboard focus. It also describes hiding the transitioning item from assistive technology
  until the transition ends. [WAI functionality](https://www.w3.org/WAI/tutorials/carousels/functionality/) and
  [WAI animations](https://www.w3.org/WAI/tutorials/carousels/animations/).
- WCAG 2.2 SC 2.2.2 (Level A) requires a user mechanism to pause, stop, or hide automatically-started moving,
  blinking, or scrolling content that lasts **more than five seconds** and is presented alongside other content,
  unless an exception applies. It has a separate rule for automatically updating information.
  [Understanding SC 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).
- WCAG 2.2 SC 2.3.3 (Level AAA) says motion animation triggered by interaction can be disabled unless essential.
  The guidance identifies the user-agent or operating-system reduced-motion preference as one way to reduce
  unnecessary animation. [Understanding SC 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html).
- The `prefers-reduced-motion` media feature detects a user's operating-system preference to reduce motion.
  [MDN: `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).
- The Page Visibility API exposes whether a document is visible, including the `visibilitychange` event.
  [MDN: Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API).
- Responsive image markup can provide alternative image sources for different display conditions. The `<img>` element
  supports intrinsic `width` and `height` and lazy loading for images that should wait until needed.
  [MDN: responsive images](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images) and
  [MDN: `<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img).

## Implementation recommendations

These are design recommendations based on the source facts above:

- Keep navigation available and understandable: label the carousel region; use real buttons for previous/next; show
  the active position (for example, “2 of 5”); keep focus on the activated control; and announce user-selected
  changes politely. Treat the whole photo as a project link only if its destination is clear.
- Prefer manual navigation. If auto-advance is introduced, provide an always-available pause/resume button, pause on
  keyboard focus and pointer hover, stop when the document becomes hidden, and do not restart unexpectedly after a
  user pauses. A brief fade alone does not remove the need to evaluate the WCAG rule: repeated automatic movement can
  run for more than five seconds.
- For reduced motion, make the transition instantaneous or use a restrained non-motion state change; do not replace a
  horizontal slide with another substantial movement. Apply the preference to CSS transitions and any scripted
  animation.
- Keep only one active photo visually prominent; make the caption readable against the image; maintain a stable
  image frame; and ensure controls remain visible at mobile sizes. Avoid parallax, zoom-pans, and layered motion for
  this restrained direction.
- Serve appropriately sized responsive images, reserve their rendered dimensions to avoid layout shifts, and defer
  offscreen project photos where practical. Prioritize the initial hero image; do not preload every slide. Prefer
  existing CSS and browser APIs over adding a carousel dependency.

## Sources

- [WAI: Carousels tutorial](https://www.w3.org/WAI/tutorials/carousels/)
- [WAI: Carousel structure](https://www.w3.org/WAI/tutorials/carousels/structure/)
- [WAI: Carousel functionality](https://www.w3.org/WAI/tutorials/carousels/functionality/)
- [WAI: Carousel animations](https://www.w3.org/WAI/tutorials/carousels/animations/)
- [W3C: WCAG 2.2, Understanding SC 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- [W3C: WCAG 2.2, Understanding SC 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- [MDN: `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [MDN: Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
- [MDN: Responsive images](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images)
- [MDN: `<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img)
