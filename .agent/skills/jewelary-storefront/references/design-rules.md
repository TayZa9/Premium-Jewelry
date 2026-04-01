# Design Rules

## Visual Direction

Keep the experience premium and editorial, not generic ecommerce boilerplate.

Prefer:
- large serif headings
- light but deliberate body copy
- gold accents used sparingly
- generous whitespace
- subtle, confident motion

Avoid:
- crowded UI
- bright primary colors
- playful or overly casual patterns
- generic dashboard styling leaking into storefront pages

## Interaction Style

Animations should feel smooth and restrained. Favor fades, translate-y reveals, image scaling, and polished hover transitions.

Buttons should feel intentional:
- uppercase or tracked labels are already part of the design language
- high-contrast primary actions
- outline-to-fill transitions work well here

## Responsive Expectations

Verify both desktop and mobile layouts after changes.

Pay extra attention to:
- fixed header spacing
- cart slide-over height and scroll behavior
- product gallery thumbnail overflow
- hero copy wrapping

## Data-Wiring Guidance

When replacing mock data with API data, preserve the same visual contract first:
- keep card proportions
- keep formatted prices stable
- keep image fallback behavior explicit

Only refactor the presentation layer further after the live data path is stable.
