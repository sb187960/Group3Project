---
name: quote-rules
description: Rules, pricing calculation logic, quote preview formatting, and validation standards for lawn care and landscaping quotes.
---

# Lawn Care & Landscaping Quote Rules

This skill is the team's single source of truth governing calculation logic, data persistence, validation, mobile ergonomics, and layout for quotes generated for small lawn care and landscaping crews.

## 1. Rate Sheet & Services

The business owner configures base settings stored defensively in browser `localStorage`:
* **Business Info:** Business Name, Phone Number, Email Address.
* **Quote Terms:** Default payment and validity terms (e.g., *"Estimates valid for 14 days. Payment due upon completion of work."*).
* **Minimum Job Charge:** A baseline dollar floor (e.g., `$50.00`) below which no job is dispatched.
* **Service Rates:**
  1. **Mowing:** Billed per 1,000 sq ft of lawn area (e.g., `$12.00 / 1k sq ft`).
  2. **Edging:** Billed per 1,000 sq ft of lawn area (e.g., `$4.00 / 1k sq ft`).
  3. **Leaf Cleanup:** Billed per 1,000 sq ft of lawn area (e.g., `$8.00 / 1k sq ft`).
  4. **Mulch:** Billed per cubic yard delivered and installed (e.g., `$85.00 / cu yd`).
  5. **Hedge Trimming:** Billed per crew hour (e.g., `$55.00 / hr`).

## 2. Pricing Calculation Logic

### A. Line Items & Area Rounding Up Rule
* **Area-Based Services (Mowing, Edging, Leaf Cleanup):**
  Lawn area must **always** be rounded **UP to the next 1,000 sq ft**:
  $$\text{Area Units} = \left\lceil \frac{\text{Yard Size (sq ft)}}{1000} \right\rceil$$
  *(Examples: $4,200 \text{ sq ft} \to 5 \text{ units}$; $500 \text{ sq ft} \to 1 \text{ unit}$; $1,000 \text{ sq ft} \to 1 \text{ unit}$; $4,200.5 \text{ sq ft} \to 5 \text{ units}$.)*
  
  $$\text{Item Cost} = \text{Area Units} \times \text{Unit Rate}$$

* **Quantity-Based Services:**
  $$\text{Mulch Cost} = \text{Cubic Yards} \times \text{Rate}_{\text{mulch}}$$
  $$\text{Hedge Trimming Cost} = \text{Crew Hours} \times \text{Rate}_{\text{hedge}}$$

### B. Subtotal
$$\text{Subtotal} = \sum \text{Active Line Items}$$

### C. Minimum Job Charge Rule
* If $\text{Subtotal} < \text{Minimum Job Charge}$:
  * Apply a Minimum Charge adjustment:
    $$\text{Adjustment} = \text{Minimum Job Charge} - \text{Subtotal}$$
  * Base total becomes the Minimum Job Charge floor.
  * The quote preview must display the original subtotal, the minimum charge adjustment line, and an explanatory floor note.
* If $\text{Subtotal} \ge \text{Minimum Job Charge}$:
  * Base total is equal to the subtotal (no minimum adjustment needed).

### D. Final Rounding to Nearest $5
To simplify field cash/card transactions, round the final total to the nearest multiple of $5:
$$\text{Final Total} = \text{Math.round}\left(\frac{\text{Base Total}}{5}\right) \times 5$$

### E. Number & Currency Display Standards
* All monetary values must be formatted to two decimal places with comma thousand separators (e.g., `$1,250.00`, `$12,000.00`).
* Yard size must include comma formatting (e.g., `4,200 sq ft`, `1,000,000 sq ft`).

### F. Mandatory Reference Test Cases
1. **Standard Reference Job ($4,200 \text{ sq ft}$):**
   * Services: Mowing ($12/1k), Edging ($4/1k), 2 cu yds Mulch ($85), 1.5 hrs Hedge ($55)
   * Math: $5 \times \$12 = \$60$; $5 \times \$4 = \$20$; $2 \times \$85 = \$170$; $1.5 \times \$55 = \$82.50$
   * Subtotal: **$332.50** (exceeds $50 min floor)
   * Rounding: $\text{Math.round}(332.50 / 5) \times 5 = \mathbf{\$335.00}$ (Adjustment: $+\$2.50$)
   * **Final Total: $335.00**
2. **Tiny Yard Floor Job ($500 \text{ sq ft}$):**
   * Services: Mowing only ($12/1k)
   * Math: $1 \times \$12 = \$12.00$
   * Minimum Adjustment: $+\$38.00$
   * **Final Total: $50.00**

## 3. Strict Quote Preview Layout Order

Every generated quote must render sections in this exact order:
1. **Header / Branding:** Business Name, Phone, Email, Date, and Quote ID.
2. **Customer Details:** Customer Name, Property Address, Measured Yard Size.
3. **Itemized Table:** Service Description, Quantity/Dimensions (e.g., `4,200 sq ft (5k sq ft)`), Unit Rate, Line Total.
4. **Totals Breakdown:** Subtotal, Minimum Job Charge Adjustment (if applicable), Rounding Adjustment, and Rounded Final Total.
5. **Quote Terms & Conditions:** As configured in the settings.
6. **Site Photos:** Thumbnail gallery of property photos attached.
7. **Action Bar:** Print / Save as PDF, Edit Quote, and Start Fresh (hidden during print).

## 4. Input Validation & Error Handling

* **Zero Native Popups:** Never call `alert()`, `confirm()`, or `prompt()`.
* **Inline Error Messages:** Missing, zero, non-numeric, or negative inputs must immediately display a red inline error message next to the field and block quote generation.
* **Validation Guardrails:**
  * **Customer Name & Address:** Required; reject empty or whitespace-only inputs.
  * **Yard Size:** Required; must be a valid number $> 0$.
  * **Service Selection:** At least one service checkbox must be checked.
  * **Mulch / Hedge Quantities:** If checked, quantity/hours must be $> 0$ (never blank, zero, or negative).
  * **Price Sheet Settings:** Rates and minimum charge must be $\ge 0$ (never blank or negative).
* **Two-Step Confirmations:** Destructive actions (e.g., "Reset to Defaults" or "Start Fresh") must use a 2-tap confirmation pattern (first tap changes label to "Tap again to confirm" with a 3-second auto-revert timer).

## 5. Mobile Ergonomics & Field UX Standards

* **Touch Targets ($\ge 44\text{px}$):** All buttons, tabs, inputs, checkboxes, and thumbnail delete buttons must measure at least $44\text{px} \times 44\text{px}$.
* **iOS Safari Auto-Zoom Prevention:** All `<input>`, `<select>`, and `<textarea>` elements must have `font-size: 16px` (1rem) minimum.
* **375px Mobile Viewport Defense:** Layout must fit cleanly on 375px mobile screens with zero horizontal scrolling. Use `overflow-wrap: anywhere; word-break: break-word;` on all user-supplied text containers.
* **Thumb Steppers:** Provide $\ge 44\text{px}$ $+$ / $-$ stepper buttons next to quantity fields for one-handed operation.
* **Photo Upload Ergonomics:** Do **not** restrict file inputs with `capture="environment"`. Users must be allowed to either snap a live photo or select existing photos from their device library.
* **Defensive LocalStorage:** Wrap all `localStorage.getItem()`, `setItem()`, and `removeItem()` calls in `try/catch` with an in-memory fallback.
* **Single-Page Print Optimization:** `@media print` must strip navigation bars, action buttons, and page borders so the quote fits cleanly on one page.

## 6. Architecture Constraints

* **Three Files Only:** Must consist strictly of `index.html`, `style.css`, and `script.js` in the repository root.
* **Zero Dependencies:** No external build tools, package managers, npm packages, server endpoints, API keys, or external CDN scripts/fonts. Must operate entirely offline or on intermittent cellular connections via GitHub Pages.
