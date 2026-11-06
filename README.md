Quotes for Lawn Care Crews in Under a Minute

A mobile-first web app that lets owners of small lawn care and landscaping crews create a professional, priced quote from their own price sheet, right from the curb.


Built for INSY 3331: Artificial Intelligence for Business, University of Texas at Arlington, Fall 2026.

THE PROBLEM

Owners of small lawn care and landscaping crews write quotes by hand at night after a full day of work. Pricing each yard from memory and formatting a quote takes time. Homeowners usually get more than one bid, so slow quotes lose jobs to whoever answers first.

WHAT IT DOES

Set up your price sheet once: your business info, quote terms, minimum job charge, and your own rates for each service.
Create a quote: enter the customer, yard size, and services, and attach photos of the property.
Get an instant quote: line items, subtotal, and total calculated from your rates, in the same clean format every time.
Print it or save it as a PDF to send to the customer.

TRY IT IN TWO MINUTES

Open the live app on a phone or laptop. There is nothing to install and no login.
Go to the Price Sheet tab. It is pre-filled with sample rates, so you can leave it as is.
Go to the New Quote tab and tap Fill Fake Sample, or enter this sample yard: Yard size: 4,200 sq ft Services: Mowing, Edging, Mulch (2 cubic yards), Hedge trimming (1.5 hours)
Tap Generate Quote Preview. The total should be $335.00.
Tap Print / Save as PDF to see the customer-ready quote.

PRICING RULES

All rates come from the owner's price sheet. Mowing, edging, and leaf cleanup are priced per 1,000 sq ft, with the yard size rounded up to the next 1,000 sq ft. Mulch is priced per cubic yard, and hedge trimming per hour, using the quantity entered. If the subtotal is below the minimum job charge, the total is raised to the minimum and a note appears on the quote. The final total is rounded to the nearest $5.

Default sample rates: Mowing: $12 per 1,000 sq ft Edging: $4 per 1,000 sq ft Leaf cleanup: $8 per 1,000 sq ft Mulch: $85 per cubic yard Hedge trimming: $55 per hour Minimum job charge: $50

BUILT WITH

HTML, CSS, and JavaScript only. There is no server, no build step, and no frameworks. GitHub Pages for hosting. Everything runs in the browser. localStorage to save the price sheet and quotes on the owner's own device. Google Antigravity to build each iteration, guided by our team skill.

PROJECT FILES

index.html: app layout and screens style.css: mobile-first styles and print layout script.js: pricing engine, storage, and screen logic README.md: this file .agents/skills/quote-rules/SKILL.md: our team skill with design, pricing, and quality rules

TEAM SKILL

The file .agents/skills/quote-rules/SKILL.md holds our shared rules for every build iteration: what the product does, technical limits, pricing rules with a worked reference example, the quote format, design rules, and data rules. Every team member's agent follows it, so the app stays consistent no matter who is building.

DATA AND PRIVACY

The app uses synthetic (made-up) data only. Sample customers have obviously fake names and addresses. Price sheets and quotes are stored only in the user's own browser. Nothing is sent to a server. Photos are attached to quotes for documentation only. They are not uploaded or analyzed. This repository contains no passwords, API keys, or real customer information.

TEAM: Leyla, Daniela, Maritza, Shane


KNOWN LIMITATIONS

Yard size is entered by hand. The app does not measure yards from photos or maps. Data is saved per device and browser, so quotes made on a phone will not appear on a laptop.
