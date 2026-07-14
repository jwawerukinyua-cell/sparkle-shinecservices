# 🌟 Sparkle & Shine Services - Nanyuki Landing Page & Booking Template

A high-converting, mobile-first responsive landing page and automated WhatsApp-integrated booking calendar built for service entrepreneurs in Nanyuki, Kenya.

This system is built as a highly reusable, modular template. You can customize all text, services, pricing, and visual story components simply by updating `config/settings.json`.

## 📁 Repository Structure
```
├── config/
│   └── settings.json       # <-- MAIN CONFIG FILE (Customise everything here!)
├── docs/
│   └── README.md           # This documentation
├── index.html              # Core landing page index file
├── src/
│   ├── App.tsx             # Main application driver with state manager
│   ├── index.css           # Global Tailwind CSS and typography pairing
│   ├── types.ts            # Type definitions (Service, Booking, Review, settings)
│   └── defaultData.ts      # Fresh pre-filled values
├── package.json            # Node.js dependencies
└── vite.config.ts          # Vite configuration
```

## ⚙️ How to Customize (Quick Start)
All business logic is modular and configurable. To change pricing, taglines, or WhatsApp contact phone numbers:
1. Open `config/settings.json`.
2. Update the values inside the `appSettings` block.
3. Modify, delete, or append objects inside the `services` list to display custom services (e.g., Carpet Cleaning, Wardrobe Organizing).
4. Update or filter the `reviews` list with real testimonials to instantly build local trust.

## 🚀 Deployment Instructions
This template is configured to build as an ultra-fast client-side Single Page Application (SPA).
1. **GitHub Pages / Netlify / Vercel**:
   - Push this directory structure to your GitHub repository.
   - Connect the repository to your chosen host.
   - Set the build command to `npm run build` and publishing directory to `dist`.
2. **WhatsApp Integration Engine**:
   - No complex database or messaging server is required! Bookings and enquiries are constructed on-the-fly and passed directly into the official WhatsApp API.
   - On clicking "Send Booking", the system automatically formats a clean summary and opens WhatsApp with Mary's Nanyuki mobile line (`+254743137081`).

---
Crafted with ❤️ for **Mary Anthony** & single mothers breaking cycles in Nanyuki, Kenya.
