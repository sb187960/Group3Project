---
name: quote-rules
description: Rules, pricing calculation logic, quote preview formatting, and validation standards for lawn care and landscaping quotes.
---

# Lawn Care & Landscaping Quote Rules

This skill governs the calculation logic, data persistence, and formatting for quotes generated for small lawn care and landscaping crews.

## 1. Rate Sheet & Services

The business owner configures base settings stored in browser `localStorage`:
* **Business Info:** Business Name, Phone Number, Email Address.
* **Quote Terms:** Default payment and validity terms (e.g., *"Estimates valid for 14 days. Payment due upon completion of work."*).
* **Minimum Job Charge:** A baseline dollar floor (e.g., `$50.00`) below which no job is dispatched.
* **Service Rates:**
  1. **Mowing:** Billed per 1,000 sq ft of lawn area (e.g., `$12.00 / 1k sq ft`).
  2. **Edging:** Billed per 1,000 sq ft of perimeter lawn area (e.g., `$4.00 / 1k sq ft`).
  3. **Leaf Cleanup:** Billed per 1,000 sq ft of lawn area (e.g., `$8.00 / 1k sq ft`).
  4. **Mulch:** Billed per cubic yard delivered and installed (e.g., `$85.00 / cu yd`).
  5. **Hedge Trimming:** Billed per crew hour (e.g., `$55.00 / hr`).

## 2. Pricing Calculation Logic

### A. Line Items
* **Area-Based Services (Mowing, Edging, Leaf Cleanup):**
  $$\text{Area Units} = \frac{\text{Yard Size (sq ft)}}{1000}$$
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
  * Base total becomes the Minimum Job Charge.
  * The quote preview must display the subtotal, the minimum charge adjustment line, and the resulting total so pricing is transparent.
* If $\text{Subtotal} \ge \text{Minimum Job Charge}$:
  * Base total is equal to the subtotal (no adjustment needed).

### D. Final Rounding to Nearest $5
To simplify field cash/card transactions and provide clean estimates, round the final total to the nearest multiple of $5:
$$\text{Final Total} = \text{Math.round}\left(\frac{\text{Base Total}}{5}\right) \times 5$$

## 3. Quote Preview Format & Standards

Every generated quote must display:
1. **Header / Branding:** Business Name, Phone, Email, and Quote Date.
2. **Customer Details:** Customer Name, Service Address.
3. **Itemized Table:**
   * Service Name
   * Quantity / Dimensions (e.g., `4,200 sq ft (4.2k)`, `2 cu yds`, `1.5 hrs`)
   * Unit Rate
   * Line Total
4. **Totals Breakdown:**
   * Subtotal
   * Minimum Job Charge Adjustment (if applicable)
   * Rounded Final Total
5. **Quote Terms & Conditions:** As defined in the settings.
6. **Site Photos:** Thumbnail gallery of any property photos captured.
7. **Actions:** Print / Save as PDF button (clean 1-page printable layout hiding interactive controls).

## 4. Mobile & Operational Guidelines

* **Target Speed:** Designed for an owner to quote in under 60 seconds from a phone screen.
* **Touch-Friendly:** Large buttons, numeric touch keypads (`inputmode="decimal"` or `inputmode="numeric"`), and clear visual state.
* **No Dependencies:** Zero external build steps, CDNs, or server requirements. Must run directly on GitHub Pages.
* **Sample Data:** Pre-fill with realistic defaults so first-time opening yields an immediate functioning app.
