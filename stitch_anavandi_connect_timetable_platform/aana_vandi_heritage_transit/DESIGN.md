---
name: Aana Vandi Heritage Transit
colors:
  surface: '#fff8f5'
  surface-dim: '#e6d7cf'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ea'
  surface-container: '#faebe3'
  surface-container-high: '#f4e5dd'
  surface-container-highest: '#efe0d8'
  on-surface: '#211a15'
  on-surface-variant: '#5a403e'
  inverse-surface: '#372f29'
  inverse-on-surface: '#fdeee6'
  outline: '#8e706d'
  outline-variant: '#e2bebb'
  surface-tint: '#b52526'
  primary: '#950913'
  on-primary: '#ffffff'
  primary-container: '#b82828'
  on-primary-container: '#ffd2cd'
  inverse-primary: '#ffb3ac'
  secondary: '#7e5700'
  on-secondary: '#ffffff'
  secondary-container: '#fdb72f'
  on-secondary-container: '#6c4a00'
  tertiary: '#703c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#925000'
  on-tertiary-container: '#ffd4b3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb3ac'
  on-primary-fixed: '#410003'
  on-primary-fixed-variant: '#920511'
  secondary-fixed: '#ffdeac'
  secondary-fixed-dim: '#ffba38'
  on-secondary-fixed: '#281900'
  on-secondary-fixed-variant: '#604100'
  tertiary-fixed: '#ffdcc2'
  tertiary-fixed-dim: '#ffb77a'
  on-tertiary-fixed: '#2e1500'
  on-tertiary-fixed-variant: '#6d3a00'
  background: '#fff8f5'
  on-background: '#211a15'
  surface-variant: '#efe0d8'
typography:
  display-lg:
    fontFamily: Epilogue
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Epilogue
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Epilogue
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Epilogue
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: '0'
  headline-md:
    fontFamily: Epilogue
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Epilogue
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
This design system draws direct inspiration from the legendary vintage Ashok Leyland state transport buses of Kerala—affectionately known as the "Aana Vandi" (Elephant Vehicle). The brand personality is grounded, industrious, warmly nostalgic, and relentlessly reliable. It evokes the sensory journey of early morning mist on winding highland ghat roads, metal luggage racks, ticket punch clippers, and the unmistakable rumble of a heritage motor traversing monsoon-drenched highways.

The aesthetic philosophy fuses **Tactile Heritage Industrialism** with modern utilitarian clarity. Rather than resorting to novelty retro kitsch or cold corporate minimalism, this system utilizes sturdy proportions, mechanical precision, warm dust-tempered tones, and tactile physical affordances. The experience balances historic romance with ergonomic transit-grade readability and effortless usability.

## Colors
The palette extracts its soul directly from the iconic two-tone livery of the vintage Leyland fleet under Kerala's sunset skies:

- **Primary (`#B82828`)**: Heritage Scarlet / Crimson Brick. The sturdy, unyielding paint of the lower chassis and mudguards. Used for primary CTAs, critical brand touchpoints, badges, active progress states, and structural anchors.
- **Secondary (`#F5B027`)**: Ochre Canopy Amber. The warm yellow roof, brow, and window frame tone. Serves as high-visibility accents, highlight tags, notification banners, and key status badges.
- **Tertiary (`#D9822B`)**: Dusty Sepia Ochre / Road Dust Sunset. The middle transition hue seen on warm sunset horizons and cast metal fittings. Used for supporting indicators, secondary actions, and warm decorative dividers.
- **Neutral (`#2D2520`)**: Cast Iron & Tire Tread Black. A deeply warm charcoal derived from tire rubber and cast iron chassis frames. Used for high-contrast primary typography and grounded border elements.
- **Background & Canvas (`#FFF8ED`)**: Vintage Off-White Cream. Reminiscent of paper transit passes, rolled destination scrolls, and vintage lettering backdrops. Replaces sterile cool whites with nostalgic warmth.
- **Accent Glow (`#FFE066`)**: Headlight Beam Golden Glow. Used exclusively for luminous focus rings, alert stars, and micro-interactions.

## Typography
Typography channels the spirit of hand-painted route signboards, stamped bus ticket receipts, and cast metal engine badges:

- **Display & Headlines (`Epilogue`)**: Provides chunky geometric presence, muscular weight, and strong mechanical personality that mirrors the stamped metal lettering and Ashok Leyland emblem aesthetics.
- **Body (`Work Sans`)**: Offers clean, legible, humanized neo-grotesque characteristics that retain legibility across complex transport schedules, fare listings, and descriptive articles.
- **Labels & Data Readouts (`JetBrains Mono`)**: Directly references vintage conductor punched tickets, mechanical fare meters, license plates (`KL-05 4735`), and schedule timetables with precise spacing and technical authenticity.

## Layout & Spacing
The layout structure follows a strict, mechanical grid inspired by vehicular chassis architecture and slatted bus louvers:

- **Grid Framework**: 12-column responsive fluid grid on desktop (1024px+), 8 columns on tablet (768px - 1023px), and 4 columns on mobile (< 768px).
- **Rhythm**: Rhythm is anchored to an 8px baseline (`0.5rem`). Spacing tokens emphasize physical structural alignment: compact spacing within card groups mimics the condensed window slats, while expansive outer margins echo wide cross-country highways.
- **Breakpoints & Adaptation**: On mobile viewports, cards flatten out to full width with side-to-side border containment, collapsing margins to `1rem` and gutters to `0.75rem` to maximize touch targets while preserving dense informational density.

## Elevation & Depth
In alignment with the tactile coach-building craft of vintage transport, this system rejects airy, weightless floatation in favor of **Tonal Layering with Grounded Cast Shadows**:

- **Physicality**: Surfaces sit firmly on physical tiers. Depth is articulated through heavy, warm-toned contact shadows (`rgba(45, 37, 32, 0.12)`) shifted vertically downward, imitating sunlight beating down on the bus bonnet.
- **Borders & Insets**: Containers employ solid 1px or 1.5px warm-charcoal outlines (`#2D2520` at 15–25% opacity) to evoke riveted body panels and steel window casings.
- **Recessed Surfaces**: Input wells, terminal readouts, and ticket-stub counters utilize subtle inset drop shadows paired with slightly darker cream fills (`#F3EBDD`), giving them the appearance of stamped metal dash panels.
- **Focus & Glow**: High-priority interactive elevations cast a directional, warm amber aura (`rgba(245, 176, 39, 0.45)`), evoking the penetrating beam of round Lucas headlights through hill fog.

## Shapes
The shape philosophy leans on industrial durability: **Level 1 (Soft)**.

- **Base Radius (`0.25rem` / `4px`)**: Buttons, badges, input fields, and chips possess gently eased industrial corners—reminiscent of sheet metal bends and heavy rubber seals rather than modern bubble shapes.
- **Container Radius (`0.5rem` / `8px`)**: Large structural panels, journey overview cards, and modal dialogs use tight, robust corners that mirror the iconic curved rectangular windows of the Leyland bodywork.
- **Pills**: Used strictly for route number indicators (`KL-05`, `TS 730`) and destination sign scrolls, referencing authentic bus scrollboards.

## Components

### Buttons
- **Primary**: Rich Crimson Scarlet (`#B82828`) background with Cream (`#FFF8ED`) high-contrast text, 1.5px solid bottom ridge (`#871818`) simulating a pressable mechanical switch. Hover deepens background; active state depresses the button by 1px.
- **Secondary**: Ochre Yellow (`#F5B027`) fill with Dark Charcoal (`#2D2520`) text. Ideal for reservation triggers, search queries, and route filters.
- **Outline / Depot Variant**: Transparent background, 1.5px warm charcoal border, uppercase mono lettering.

### Chips & Badges
- Modeled after stamped depot tokens and route sign boards.
- Compact padding (`0.25rem` `0.75rem`), mono uppercase font (`label-md`), 2px roundedness.
- Fast passenger/express tags use Amber (`#F5B027`) with dark ink; ordinary/rural tags use Sepia Sand (`#E8C17A`).

### Cards & Ticket Modules
- Built with crisp borders and dual-surface tiers: header strip colored in Ochre Yellow or Deep Crimson with off-white card body.
- Perforated divider lines (dashed 1.5px warm charcoal borders) simulate conductor tear-off paper tickets.
- High-priority journey cards feature a small yellow reflector accent strip along the left vertical edge.

### Inputs & Forms
- Off-white textured canvas fill (`#F8F0E3`) with a distinct 1.5px stroke in `#2D2520` (opacity 30%).
- Focused inputs snap to a crisp `#B82828` border accompanied by an amber headlight glow ring (`rgba(245, 176, 39, 0.35)`).
- Input labels rendered in `label-lg` monospaced style to evoke maintenance logs and logistics paperwork.

### Selection Controls (Checkboxes & Radios)
- Square-profile check containers with softened corners (`2px`).
- Checked states fill with Crimson (`#B82828`) and present an off-white mechanical tick mark.
- Radio buttons feature concentric cast-iron concentric rings with an amber center core.