# Project Specifications: Collaborative Landing Page

This document serves as the "Source of Truth" for our team project. As developers, we refer to this spec sheet to ensure we are building the right thing, using the agreed-upon tools, and staying within scope.

## 🎯 Project Overview
**Name:** SaaS Product Landing Page (fictional product: "DevSync")
**Goal:** Build a modern, responsive single-page landing page to collect email signups for an upcoming developer tool.

## 🛠️ Tech Stack & Constraints
To ensure all team members write compatible code, we must adhere strictly to these technologies:
- **HTML:** Semantic HTML5 (`<header>`, `<nav>`, `<section>`, `<footer>`, etc.)
- **CSS:** Tailwind CSS (loaded via CDN configured in the starter template. Do not write custom CSS in `style.css` unless absolutely necessary for custom animations).
- **Icons:** Heroicons/FontAwesome (SVG inline preferred).
- **Images:** Placeholder image services (e.g., Unsplash Source, Placehold.co) to avoid uploading heavy binary files yet.

## 📐 Design Guidelines
- **Color Palette:**
  - Primary: Indigo/Blue (`text-indigo-600`, `bg-indigo-600`)
  - Backgrounds: Slate (`bg-slate-50` for light sections, `bg-slate-900` for dark sections)
  - Text: Slate (`text-slate-900` for headings, `text-slate-600` for body)
- **Typography:** Sans-serif (Tailwind default `font-sans`).
- **Spacing:** Use Tailwind's standard padding/margins (`p-4`, `m-8`, `py-16`). Sections should have generous vertical padding (`py-20`).

---

## 📋 Component Breakdown (The "Tickets")

The landing page must be built in these distinct horizontal sections. **Each section represents one ticket** to be claimed by a developer.

### TICKET 1: Global Navigation
- **Location:** Top of page, sticky.
- **Content:** Logo on the left (text: "DevSync"), link list in center ("Features", "Testimonials", "Pricing"), "Get Early Access" CTA button on the right.
- **Styling:** White background, subtle bottom shadow, responsive layout (flexbox).

### TICKET 2: Hero Section
- **Location:** Immediately below navigation.
- **Content:** 
  - Massive headline: "Code Together, Without the Chaos."
  - Subheadline: "The ultimate Git collaboration tool for remote teams."
  - Two buttons next to each other: "Start Free Trial" (primary), "Watch Demo" (secondary outline).
- **Styling:** Centered text, large vertical padding (`py-32`), light indigo background gradient.

### TICKET 3: Features Grid
- **Location:** Below Hero.
- **Content:** Section Title ("Why choose DevSync?"), followed by a grid of 3 or 4 feature cards.
- **Card Content:** An icon, a bold title (e.g., "Conflict-Free Merges"), and a short description paragraph.
- **Styling:** CSS Grid (`grid-cols-1 md:grid-cols-3`), cards should have a white background, rounded corners, and a drop shadow.

### TICKET 4: Testimonial & CTA
- **Location:** Below Features.
- **Content:** 
  - A quote: *"This tool saved our team 10 hours a week on code reviews."* - Jane Doe, CTO.
  - A final call to action below the quote: A large email input field and a "Subscribe" button.
- **Styling:** Dark background (`bg-slate-900`), white text, to break up the visual flow.

### TICKET 5: Footer
- **Location:** Bottom of page.
- **Content:** Copyright text, fake links (Privacy Policy, Terms of Service).
- **Styling:** Simple, centered, light gray background (`bg-slate-100`).

---

## 🤝 Collaboration Rules
1. **Never edit `index.html` outside your designated `<section>`.** If building the Hero, do not touch the Footer HTML comments.
2. Ensure your section looks good on both mobile and desktop (use Tailwind `md:` and `lg:` prefixes).
3. If you finish your ticket early, review open Pull Requests before claiming a new ticket.
