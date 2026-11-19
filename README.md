# Quotes for Lawn Care Crews in Under a Minute

A mobile-first web app that lets owners of small lawn care and landscaping crews create a professional, priced quote from their own price sheet, right from the curb.

Built for **INSY 3331: Artificial Intelligence for Business, University of Texas at Arlington, Fall 2026.**

---

## THE PROBLEM

Owners of small lawn care and landscaping crews write quotes by hand at night after a full day of work. Pricing each yard from memory and formatting a quote takes time. Homeowners usually get more than one bid, so slow quotes lose jobs to whoever answers first.

---

## WHAT IT DOES

1. **Set up your price sheet once:** Your business info, quote terms, minimum job charge baseline ($50 default), and custom rates for all 7 core services.
2. **Measure on aerial photos:** Trace property boundaries on high-resolution USGS aerial photos to calculate yard size automatically, with multi-area tracing (front and back yards), point undo, and an offline manual fallback.
3. **Instant quotes in under 60 seconds:** Itemized line items, subtotal, floor adjustment (if applicable), and nearest $5 cash rounding calculated from your rates in a clean format.
4. **Bilingual English / Spanish:** Switch instantly between English and Spanish with complete translation of all screens, placeholders, modals, toasts, and customer estimates.
5. **Send to customer from the curb:** Open pre-populated SMS text messages, emails, or copy plain-text estimates directly to your clipboard, or print/save as a clean, single-page PDF.
6. **Saved estimates & sales pipeline:** Track quote statuses across Pending, Won, and Lost stages with 3-day follow-up reminder alerts and real-time closing rate metrics.

---

## TRY IT IN TWO MINUTES

1. Open the live app on a phone or laptop. There is nothing to install and no login.
2. Go to the **Price Sheet** tab. It is pre-filled with realistic sample rates, so you can leave it as is or customize it.
3. Go to the **Yard & Services** tab and tap **Fill Sample**, or enter this standard reference job:
   * **Yard size:** 4,200 sq ft
   * **Services:** Mowing, Edging, Mulch (2 cubic yards), Hedge trimming (1.5 hours)
4. Tap **Generate Quote Preview**. The total should be **$335.00** ($332.50 subtotal rounded to nearest $5).
5. Tap **Print / Save as PDF** to view the customer-ready quote, or tap **Text Estimate** to see the curbside message.

---

## PRICING RULES

All rates come from the owner's price sheet:
* **Area-Based Services:** Lawn area is always rounded **UP to the next 1,000 sq ft** (e.g., 4,200 sq ft is billed as 5 units; 500 sq ft is billed as 1 unit).
* **Quantity-Based Services:** Mulch is billed per cubic yard delivered and installed; hedge trimming is billed per crew hour.
* **Minimum Job Charge Floor:** If the calculated subtotal is below the minimum job charge ($50 baseline), the total is raised to the floor with an explanatory note on the quote.
* **Nearest $5 Rounding:** The final total is rounded to the nearest multiple of $5 to streamline field cash and electronic payments.

### Default Baseline Rates (7 Services)
1. **Mowing:** $12.00 per 1,000 sq ft
2. **Edging:** $4.00 per 1,000 sq ft
3. **Leaf Cleanup:** $8.00 per 1,000 sq ft
4. **Turf Fertilization:** $9.00 per 1,000 sq ft
5. **Overseeding & Winter Rye Grass:** $18.00 per 1,000 sq ft
6. **Mulch Delivery & Install:** $85.00 per cubic yard
7. **Hedge & Shrub Trimming:** $55.00 per crew hour
* **Minimum Job Charge:** $50.00 baseline floor

---

## BUILT WITH

* **HTML5, CSS3, and JavaScript only:** Zero external build steps, zero package managers, and zero runtime dependencies.
* **Hosting:** Static GitHub Pages. Everything executes in the user's browser.
* **Persistence:** Browser `localStorage` with defensive `try/catch` handling and in-memory fallback.
* **Canvas Photo Compression:** Downscales and compresses photo attachments to prevent local storage quota limits.
* **Mapping:** OpenStreetMap and USGS aerial photo imagery with Turf.js polygon geospatial math.
* **Antigravity Customization:** Governed by our shared team skill in `.agents/skills/quote-rules/SKILL.md`.

---

## PROJECT FILES

* `index.html`: App structure, bilingual elements, and screen templates
* `style.css`: Mobile-first responsive layout (375px–1280px), 44px touch targets, and single-page print stylesheet
* `script.js`: Pricing engine, aerial photo lot tracer, translation dictionary, and pipeline storage
* `README.md`: This documentation file
* `.agents/skills/quote-rules/SKILL.md`: Team skill defining exact pricing logic, worked test cases, and quality standards

---

## TEAM SKILL

The file `.agents/skills/quote-rules/SKILL.md` holds our single source of truth for every build iteration: what the product does, technical constraints, pricing calculation formulas, the worked reference example, quote preview ordering, and field ergonomics. Every agent and team member follows it so the app remains consistent.

---

## DATA AND PRIVACY

The app uses synthetic (made-up) data only. Sample customers have obviously fake names and addresses. Price sheets and quotes are stored solely in the user's browser `localStorage`. Nothing is transmitted to external servers. Attached site photos are for job documentation only and are not uploaded or analyzed. This repository contains no passwords, API keys, or real customer information.

**TEAM:** Leyla, Daniela, Maritza, Shane

---

## KNOWN LIMITATIONS

Yard size can be typed by hand or traced on USGS aerial photos (updated periodically). Data is saved locally per device and browser (localStorage), so quotes made on a phone will not appear on a laptop.
