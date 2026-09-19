---
name: responsive-cross-device-ui
description: Build and verify responsive web UI across phone, tablet, and desktop. Use whenever creating or changing user-facing pages, dashboards, forms, marketing sites, or web app interfaces.
---

# Responsive Cross-Device UI

Use this skill whenever building or changing user-facing web UI.

## Build mobile-first

- Start with a single-column small-screen layout, then add complexity at larger breakpoints.
- Use fluid, relative units and the framework's responsive utilities instead of fixed widths that overflow.
- Avoid horizontal page scrolling.
- Ensure buttons and links have comfortable touch targets.
- Keep the base font size readable.
- Do not rely on hover for essential actions.

## Support common widths

Design and verify these ranges:

- Phone: approximately 375–430px
- Tablet: approximately 768px
- Desktop: 1024px and wider

Navigation must collapse or reflow sensibly. Content must reflow rather than clip.

## Handle media safely

- Constrain images, videos, and embeds to their containers.
- Use responsive sizing.
- Prevent large assets from causing overflow.

## Preserve accessibility

- Keep text readable at every width.
- Use visible focus states.
- Maintain sufficient contrast.
- Ensure interactive controls remain usable with touch and keyboard input.

## Verify before reporting completion

Exercise the main screens in a real browser at phone, tablet, and desktop widths.
Do not claim the UI is fully responsive based only on the default preview.

When reporting completion:

- State that the key screens were checked at phone, tablet, and desktop widths.
- Call out any remaining rough edges explicitly.