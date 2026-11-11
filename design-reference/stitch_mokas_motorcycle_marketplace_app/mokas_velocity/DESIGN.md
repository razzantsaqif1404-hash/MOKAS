---
name: MOKAS Velocity
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#434655'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006398'
  on-secondary: '#ffffff'
  secondary-container: '#5bb8fe'
  on-secondary-container: '#00476e'
  tertiary: '#006242'
  on-tertiary: '#ffffff'
  tertiary-container: '#007d55'
  on-tertiary-container: '#bdffdb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  title-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system delivers an athletic, high-trust transactional environment engineered specifically for two-wheeled marketplace commerce. It balances the adrenaline and dynamic motion of motorcycling with the institutional clarity of a secure financial platform. The user interface prioritizes radical clarity: high-value mechanical assets require immediate verification, crisp technical readouts, and uncompromised inspectability.

The visual direction merges **Modern Corporate Precision** with **Athletic High-Contrast Dynamics**. Clean structural whites and technical slates form an architectural substrate, while high-octane electric blues drive forward momentum, interactive focus, and trust verification. Interfaces communicate speed without franticness, precision without sterile detachment, and complete transactional confidence for both casual riders and seasoned mechanics.

## Colors

The palette establishes an immediate hierarchy of action, confidence, and asset validation:

- **Primary (`#2563EB`)**: Electric Royal Blue. Powers high-priority transactional actions, instant booking triggers, active step navigation, and prime brand accents.
- **Secondary (`#0284C7`)**: Vibrant Cerulean. Dedicated to informational badges, technical filter states, verified telemetry highlights, and communicative micro-indicators.
- **Tertiary (`#10B981`)**: Precision Emerald. Reserved strictly for verified seller badges, clean title assurances, positive inspection audits, and completed transaction markers.
- **Neutral (`#1E293B`)**: Deep Slate Core. Anchors typographic elements, high-contrast borders, and deep ground surfaces.

### Neutral Layering Tokens
- **Background Canvas**: `#FFFFFF` (pure white for image and spec clarity)
- **Substrate Surface**: `#F8FAFC` (muted canvas for container contrast)
- **Container Raised**: `#FFFFFF` (elevated cards and modals)
- **Border Subtle**: `#E2E8F0` (structural dividers and component boundaries)
- **Border Strong**: `#CBD5E1` (active input fields and structural frames)
- **Text Primary**: `#0F172A`
- **Text Secondary**: `#475569`
- **Text Muted**: `#94A3B8`

## Typography

The type system pairs **Outfit** for structural headers with **Plus Jakarta Sans** for mechanical body data and user interactions.

- **Outfit**: Brings athletic stance, geometric sharpness, and high-energy impact to numerical listings, bike models, price points, and key value metrics.
- **Plus Jakarta Sans**: Provides open counterforms and robust stroke geometry that remains legible under vibrating mobile conditions, outdoor direct sunlight, and glanceable reading.
- Numerical values (displacements such as `650cc`, odometers, prices) must always employ tabular lining properties (`tnum`) when presented within comparison tables, specs sheets, and search results.

## Layout & Spacing

This design system uses an 8pt base grid with a 4pt sub-grid reserved for tight micro-badges, technical indicators, and input controls.

### Form Factor Behavior
- **Mobile (< 640px)**: Primary application viewport. 4-column fluid layout with `1rem` outer canvas padding and `0.75rem` gutters. Listing feed adapts to single-column immersive cards or a compact double-column browse view. Sticky bottom transactional sheet (`space-md` inner padding) handles bids and direct messaging.
- **Tablet (640px – 1024px)**: 8-column layout with `1.5rem` margins. Split view emerges for search filters and feed listings. Vehicle detail screen moves to a 60/40 visual-to-spec layout.
- **Desktop (> 1024px)**: 12-column layout capped at `1280px` max-width. Fixed left filter rail, fluid grid for listings, and multi-image inspection galleries.

## Elevation & Depth

Visual hierarchy uses crisp boundaries paired with soft, cool-tinted ambient illumination. In this marketplace, blurry borders imply ambiguity; structural edge lines combined with soft elevation project engineered confidence.

- **Level 0 (Flat Ground)**: Used for canvas surfaces (`#F8FAFC`). No shadow; separation via `#E2E8F0` hairline strokes.
- **Level 1 (Card Surface)**: Used for listing cards, spec summaries, and message cells. 
  - *Border*: 1px solid `#E2E8F0`
  - *Shadow*: `0 2px 4px -1px rgba(30, 41, 59, 0.04), 0 4px 12px -2px rgba(30, 41, 59, 0.06)`
- **Level 2 (Interactive Floating)**: Used for active filters, elevated search triggers, and verified hover states.
  - *Border*: 1px solid `#CBD5E1`
  - *Shadow*: `0 4px 6px -1px rgba(37, 99, 235, 0.06), 0 10px 20px -3px rgba(30, 41, 59, 0.08)`
- **Level 3 (Overlays & Modals)**: Used for bottom sheets, photo zoom overlays, and authentication dialogues.
  - *Border*: 1px solid `#E2E8F0`
  - *Shadow*: `0 12px 28px -4px rgba(15, 23, 42, 0.14), 0 8px 10px -4px rgba(15, 23, 42, 0.05)`

## Shapes

The design system employs a **Rounded** (Level 2) shape hierarchy. This curvature balances technical structure with approachable modern mobile design:

- **Base Components (Inputs, Primary Buttons, Chips)**: `0.5rem` (`8px`) corner radius.
- **Containers & Listing Cards (`rounded-lg`)**: `1rem` (`16px`) corner radius. Provides frame definition for high-resolution photography without clipping tire profiles or handlebars.
- **Sheets & Modal Surfacing (`rounded-xl`)**: `1.5rem` (`24px`) top corner radius on mobile sliding panels.
- **Pill Exceptions (`9999px`)**: Reserved exclusively for spec badges (e.g., `600cc`, `ABS`, `1-Owner`), status chips, and circular icon triggers.

## Components

### Buttons
- **Primary CTA**: Background `#2563EB`, text `#FFFFFF`, font weight `600`, height `48px` on mobile for tap targets. Active state drops to `#1D4ED8`. Elevation Level 1.
- **Secondary / Technical**: Background `#F8FAFC`, border 1px solid `#CBD5E1`, text `#1E293B`. Hover brings border `#2563EB`.
- **Google Authentication Button**: Background `#FFFFFF`, border 1px solid `#CBD5E1`, text `#1E293B`, official multi-color Google 'G' glyph centered left with equalized spacing. Height `48px`.

### Badges & Chips
- **Verified Seller Badge**: `#10B981` (10% tint background `#ECFDF5`), border 1px solid `#A7F3D0`, text `#065F46`. Includes micro checkmark icon.
- **Bike Specification Badges**: Dense, high-legibility pills. Background `#F1F5F9`, text `#334155`, font `label-sm`, uppercase. Used for engine displacement (`765 CC`), model year (`2023`), and mileage (`4,200 KM`). Accent badges (e.g., `Clean Title`) use `#EFF6FF` background with `#1D4ED8` text.

### Motorcycle Listing Card
- Constructed with a 16:10 aspect ratio image container at the top with a subtle 1px inner overlay stroke to define white bikes against white cards.
- Price displayed in `headline-md` Outfit font in `#0F172A`, paired with an optional monthly estimate in `body-sm`.
- Inline spec strip directly under title displaying `[Year] • [Mileage] • [Displacement]`.
- Floating top-right heart/save button: glass-backed circular pill with backdrop blur (`rgba(255, 255, 255, 0.85)`).

### Form Inputs & Uploaders
- **Text Inputs**: Height `48px`, background `#FFFFFF`, border 1px solid `#E2E8F0`, padding `0 1rem`. Focus state triggers a 2px outer ring in `#2563EB` with an offset of 0px. Floating labels using `label-sm`.
- **Photo Uploader Grid**: High-contrast dashed border (`#94A3B8`), background `#F8FAFC`. Features specialized thumbnail indicators designating required angles: Front 3/4, Odometer, Exhaust, VIN.

### Chat & Negotiation Bubbles
- **Buyer (Outgoing)**: Background `#2563EB`, text `#FFFFFF`, border-bottom-right radius `2px`.
- **Seller (Incoming)**: Background `#F1F5F9`, text `#0F172A`, border-bottom-left radius `2px`.
- **Offer Bubble**: Structured card within chat feed displaying motorcycle snapshot, offered price in bold Outfit font, and immediate dual actions: "Accept Offer" (Emerald) and "Counter" (Slate).

### Review & Trust Cards
- Star ratings utilize solid `#F59E0B` icons paired with numeric values (e.g., `4.9`). Includes transaction confirmation sub-label: "Verified Buyer of Yamaha MT-07".