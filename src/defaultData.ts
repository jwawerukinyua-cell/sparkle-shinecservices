/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Service, Review, AppSettings, Booking, Lead } from "./types";

export const defaultSettings: AppSettings = {
  brandName: "Sparkle & Shine Services",
  tagline: "We Clean, Organize & Take Care — So You Don't Have To!",
  whatsappNumber: "254743137081",
  locationText: "Nanyuki Town, Laikipia County & Surroundings",
  ownerName: "Mary Anthony",
  aboutText: "I choose to carry purpose. I am building this cleaning business with tireless hands but an unshakable vision—to break generational cycles, create financial freedom, and show my daughter that our story doesn't end where it began. Every small step matters, and when you trust Sparkle & Shine, you are supporting a local woman-led business built on absolute excellence.",
  aboutQuote: "They say the firstborn carries the weight of the family. I choose to carry purpose instead. I'm building my cleaning business with tired hands but an unshakable vision—to break generational cycles, create financial freedom, and show my daughter that our story doesn't end where it began. Every small step matters. 🏡✨❤️",
  contractTerms: "By booking a service, you agree to the following Terms of Service:\n1. Access to Property: The client will provide Sparkle & Shine team members with full access to the cleaning site at the scheduled time.\n2. Cancellation Policy: Any cancellation or rescheduling must be requested at least 12 hours prior to the booked time.\n3. Payment Terms: Payment is due immediately upon completion of the service via Cash, M-Pesa, or pre-approved bank transfer.\n4. Liability: While we take maximum care of your garments and furniture, any delicate items or pre-existing damages should be pointed out to our staff before cleaning starts.",
  incentiveTitle: "CLAIM YOUR FREE CONSULTATION & 10% OFF!",
  incentiveDescription: "First-time client in Nanyuki? Enter your name and contact details below, and we'll send you a voucher code for 10% OFF your first service or a free home laundry estimate!"
};

export const defaultServices: Service[] = [
  {
    id: "s-laundry",
    name: "Laundry & Folding",
    category: "laundry",
    icon: "Shirt",
    priceType: "starting",
    price: 500,
    priceUnit: "small basket",
    description: "Your clothes handled with extreme care: wash, dry, iron, fold, and steam fresh. Pickup and delivery available.",
    benefits: ["Thorough stain treatment", "Fabric softener and fresh scent", "Hand or machine wash options", "Neatly folded and stacked"],
    isFeatured: true
  },
  {
    id: "s-carpet",
    name: "Carpet & Rug Cleaning",
    category: "cleaning",
    icon: "Layers",
    priceType: "per_sq_meter",
    price: 20,
    priceUnit: "sq. meter",
    description: "Deep extract, sanitization, and dust removal. Bring life and vibrant colors back to your floor rugs and carpets.",
    benefits: ["Fair pricing (KSh 20/sqm)", "Removes deep dirt & allergens", "Eliminates odor and bacteria", "Dries rapidly within 24 hours"],
    isFeatured: true
  },
  {
    id: "s-house",
    name: "House General & Deep Clean",
    category: "cleaning",
    icon: "Home",
    priceType: "starting",
    price: 1500,
    priceUnit: "session",
    description: "Top-to-bottom domestic cleaning. Dusting, vacuuming, disinfection, polishing surfaces, bathroom and kitchen deep scrub.",
    benefits: ["Spotless kitchen appliances", "Disinfected toilets & showers", "Mopped floors and sparkling glass", "Flexible weekend or daily slots"],
    isFeatured: true
  },
  {
    id: "s-sofa",
    name: "Sofa & Couch Deep Cleaning",
    category: "cleaning",
    icon: "Sofa",
    priceType: "fixed",
    price: 2500,
    priceUnit: "5-seater couch",
    description: "Upholstery extraction to lift grease, spills, pet hair, and odors out of fabric and leather seating systems.",
    benefits: ["No chemical residue left", "Stain extraction & vacuuming", "Sanitizes deep padding fibers", "Prolongs sofa lifecycle"],
    isFeatured: false
  },
  {
    id: "s-car",
    name: "Mobile Car Detail Cleaning",
    category: "other",
    icon: "Car",
    priceType: "fixed",
    price: 1200,
    priceUnit: "car",
    description: "We come directly to your compound! Thorough interior vacuuming, dashboard polish, glass finish, and exterior power washing.",
    benefits: ["We bring our own equipment", "Tire polish & shine included", "Engine block wiping", "No travel fee in Nanyuki Town"],
    isFeatured: false
  },
  {
    id: "s-wardrobe",
    name: "Wardrobe & Closet Organization",
    category: "other",
    icon: "Sparkles",
    priceType: "starting",
    price: 1000,
    priceUnit: "wardrobe",
    description: "Declutter, organize, fold, and maximize your closet spaces beautifully so you can find any outfit instantly.",
    benefits: ["Seasonal clothing sorting", "Color-coded hanger setup", "Decluttering consultation", "Folding methods like Marie Kondo"],
    isFeatured: false
  },
  {
    id: "s-duvet",
    name: "Duvet & Bedding Sanitize",
    category: "laundry",
    icon: "Bed",
    priceType: "fixed",
    price: 600,
    priceUnit: "duvet",
    description: "Deep clean and hot sanitize bulky duvets, heavy comforters, sleeping bags, and thick wool pillows.",
    benefits: ["High-heat allergen sanitizing", "Removes bed mites & smells", "Softened fluffy fiber finish", "Same-day turnover option"],
    isFeatured: false
  },
  {
    id: "s-errands",
    name: "Daily Errands & Deliveries",
    category: "other",
    icon: "ShoppingBag",
    priceType: "variable",
    price: 300,
    priceUnit: "task",
    description: "Need shopping, grocery pickup, gas cylinder refills, or courier drops in Nanyuki? We save you time.",
    benefits: ["Fast, trusted local runner", "Live updates on WhatsApp", "Low rates starting at KSh 300", "Reliable tracking of receipts"],
    isFeatured: false
  }
];

export const defaultReviews: Review[] = [
  {
    id: "r-1",
    reviewerName: "Grace Wanjiru",
    serviceName: "Laundry & Folding",
    rating: 5,
    reviewText: "Mary picked up my baskets of clothes in the morning and returned them in the evening smelling like absolute heaven. Ironed, sorted by color, and perfectly folded. Outstanding service in Nanyuki!",
    approved: true,
    createdAt: "2026-06-15T10:00:00Z"
  },
  {
    id: "r-2",
    reviewerName: "David Kimathi",
    serviceName: "Carpet & Rug Cleaning",
    rating: 5,
    reviewText: "I was about to buy a new living room rug because of coffee stains and pet odors. Sparkle & Shine cleaned it at just KSh 20 per square meter, and it looks brand new! Highly cost-effective and meticulous.",
    approved: true,
    createdAt: "2026-06-20T14:30:00Z"
  },
  {
    id: "r-3",
    reviewerName: "Sarah Al-Amin",
    serviceName: "Airbnb Turnover Cleaning",
    rating: 5,
    reviewText: "Mary is a life-saver for my short-term rentals near Mount Kenya Safari Club. Spotless linen, perfect bathroom setup, and reliable turnaround times. My guests constantly leave 5-star cleanliness reviews!",
    approved: true,
    createdAt: "2026-07-02T09:15:00Z"
  },
  {
    id: "r-4",
    reviewerName: "John Kamau",
    serviceName: "Sofa & Couch Deep Cleaning",
    rating: 5,
    reviewText: "Prompt, honest, and hardworking. They brought heavy-duty vacuum extenders and steam washers to my house. The dust that came out of our couch was unbelievable. Recommended for single parents and busy families.",
    approved: true,
    createdAt: "2026-07-10T16:00:00Z"
  }
];

export const defaultBookings: Booking[] = [
  {
    id: "b-901",
    customerName: "Kamau Njoroge",
    customerPhone: "254711223344",
    customerEmail: "kamau@nanyukihaven.com",
    serviceId: "s-carpet",
    serviceName: "Carpet & Rug Cleaning",
    bookingDate: "2026-07-18",
    bookingTime: "09:00",
    location: "Cedar Mall area, Block B",
    notes: "Needs two large floor rugs cleaned. 12 square meters total.",
    status: "approved",
    createdAt: "2026-07-13T11:20:00Z",
    agreedToTerms: true
  },
  {
    id: "b-902",
    customerName: "Lucy Mwende",
    customerPhone: "254755667788",
    customerEmail: "lucymwende@gmail.com",
    serviceId: "s-laundry",
    serviceName: "Laundry & Folding",
    bookingDate: "2026-07-19",
    bookingTime: "11:00",
    location: "Likii Estate, Nanyuki",
    notes: "Please pick up two big baskets of baby clothes. Gentle detergent needed.",
    status: "pending",
    createdAt: "2026-07-14T08:45:00Z",
    agreedToTerms: true
  },
  {
    id: "b-903",
    customerName: "Peter Ochieng",
    customerPhone: "254799001122",
    customerEmail: "peter.o@mountkenya.org",
    serviceId: "s-house",
    serviceName: "House General & Deep Clean",
    bookingDate: "2026-07-21",
    bookingTime: "14:00",
    location: "Nanyuki Airfield Lane",
    notes: "Deep clean needed for a 2-bedroom house before new tenants move in.",
    status: "pending",
    createdAt: "2026-07-14T10:10:00Z",
    agreedToTerms: true
  }
];

export const defaultLeads: Lead[] = [
  {
    id: "l-1",
    name: "Fatima Noor",
    email: "fatima@gmail.com",
    phone: "254722334455",
    incentiveClaimed: "10% Off First Laundry Service",
    createdAt: "2026-07-12T15:20:00Z"
  },
  {
    id: "l-2",
    name: "Douglas Mwenda",
    email: "doug.m@outlook.com",
    phone: "254700998877",
    incentiveClaimed: "Free Consultation Coupon",
    createdAt: "2026-07-13T17:40:00Z"
  }
];
