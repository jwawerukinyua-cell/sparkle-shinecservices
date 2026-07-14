/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Service, Booking, Review, AppSettings, Lead } from "../types";
import { 
  Calendar, Star, Award, Clock, Phone, MapPin, ArrowRight, CheckCircle, 
  Check, Sparkles, Heart, Percent, ShieldCheck, Shirt, Layers, Home, 
  Sofa, Car, ShoppingBag, Eye, Lock, RefreshCw, StarHalf,
  ChevronDown, ChevronUp, Share2, Copy
} from "lucide-react";

import maryChandelier from "../assets/images/mary_chandelier_cleaning_1784018216205.jpg";
import maryPortrait from "../assets/images/mary_professional_portait.jpg";
import serviceLaundry from "../assets/images/service_laundry_1784018255066.jpg";
import serviceCarpet from "../assets/images/service_carpet_cleaning_1784018267317.jpg";
import serviceHouse from "../assets/images/service_house_cleaning_1784018279838.jpg";

interface LandingPageProps {
  settings: AppSettings;
  services: Service[];
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
}

export default function LandingPage({
  settings,
  services,
  reviews,
  setReviews,
  bookings,
  setBookings,
  leads,
  setLeads
}: LandingPageProps) {
  // Category Filter State
  const [selectedCategory, setSelectedCategory] = useState<"all" | "cleaning" | "laundry" | "other">("all");

  // Booking Form State
  const [bName, setBName] = useState("");
  const [bPhone, setBPhone] = useState("");
  const [bEmail, setBEmail] = useState("");
  const [bServiceId, setBServiceId] = useState("");
  const [bDate, setBDate] = useState("");
  const [bTime, setBTime] = useState("");
  const [bLocation, setBLocation] = useState("");
  const [bNotes, setBNotes] = useState("");
  const [bAgreed, setBAgreed] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // New Review Form State
  const [rName, setRName] = useState("");
  const [rService, setRService] = useState("");
  const [rRating, setRRating] = useState(5);
  const [rText, setRText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Lead capture state
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadSaved, setLeadSaved] = useState(false);

  // New Collapsible Accordion, Legal Modals & Share States
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Quick select a service and scroll to calendar
  const handleQuickBook = (serviceId: string) => {
    setBServiceId(serviceId);
    const element = document.getElementById("book-now-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Construct icon based on name string helper
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "Shirt": return <Shirt className="text-amber-400" size={24} />;
      case "Layers": return <Layers className="text-amber-400" size={24} />;
      case "Home": return <Home className="text-amber-400" size={24} />;
      case "Sofa": return <Sofa className="text-amber-400" size={24} />;
      case "Car": return <Car className="text-amber-400" size={24} />;
      case "ShoppingBag": return <ShoppingBag className="text-amber-400" size={24} />;
      default: return <Sparkles className="text-amber-400" size={24} />;
    }
  };

  // Helper to format review dates nicely
  const formatDate = (isoString?: string) => {
    if (!isoString) return "July 2026";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch (e) {
      return "July 2026";
    }
  };

  // Helper to resolve service images
  const getServiceImage = (serviceId: string) => {
    switch (serviceId) {
      case "s-laundry":
      case "s-duvet":
        return serviceLaundry;
      case "s-carpet":
      case "s-sofa":
        return serviceCarpet;
      case "s-house":
        return serviceHouse;
      case "s-car":
      case "s-wardrobe":
      case "s-errands":
      default:
        return maryChandelier;
    }
  };

  // Submit client booking and trigger WhatsApp redirection
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bName || !bPhone || !bServiceId || !bDate || !bTime || !bLocation) {
      alert("Please fill out all required fields to secure your booking.");
      return;
    }
    if (!bAgreed) {
      alert("You must agree to the Service Terms & Conditions before submitting.");
      return;
    }

    const matchedService = services.find(s => s.id === bServiceId);
    const serviceName = matchedService ? matchedService.name : "Custom Cleaning Service";

    const newBooking: Booking = {
      id: "b-" + Date.now(),
      customerName: bName,
      customerPhone: bPhone,
      customerEmail: bEmail || undefined,
      serviceId: bServiceId,
      serviceName: serviceName,
      bookingDate: bDate,
      bookingTime: bTime,
      location: bLocation,
      notes: bNotes || undefined,
      status: "pending",
      createdAt: new Date().toISOString(),
      agreedToTerms: bAgreed
    };

    setBookings(prev => [newBooking, ...prev]);
    setBookingSubmitted(true);

    // Format WhatsApp message
    let waMsg = `Hi Mary! Booking request from Sparkle & Shine Website:\n\n`;
    waMsg += `👤 Name: ${bName}\n`;
    waMsg += `📞 Phone: ${bPhone}\n`;
    if (bEmail) waMsg += `📧 Email: ${bEmail}\n`;
    waMsg += `✨ Service: ${serviceName}\n`;
    waMsg += `📅 Date: ${bDate}\n`;
    waMsg += `⏰ Preferred Time: ${bTime}\n`;
    waMsg += `📍 Location: ${bLocation}\n`;
    if (bNotes) waMsg += `📝 Notes: ${bNotes}\n\n`;
    waMsg += `🤝 I have read and accepted your Terms of Service. Please confirm my appointment!`;

    const encodedMsg = encodeURIComponent(waMsg);
    const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodedMsg}`;
    
    // Smooth delay before redirecting to WhatsApp
    setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 1500);
  };

  // Handle client-side review submission
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rName || !rService || !rText) {
      alert("Please fill out your name, service used, and a brief review of your experience.");
      return;
    }

    const newReview: Review = {
      id: "r-" + Date.now(),
      reviewerName: rName,
      serviceName: rService,
      rating: rRating,
      reviewText: rText,
      approved: true, // Auto-approve on frontend for live demo purposes
      createdAt: new Date().toISOString()
    };

    setReviews(prev => [newReview, ...prev]);
    setReviewSubmitted(true);

    // Clear form
    setTimeout(() => {
      setRName("");
      setRService("");
      setRText("");
      setRRating(5);
      setReviewSubmitted(false);
    }, 4000);
  };

  // Handle Lead capture submission
  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) {
      alert("Please enter at least your name and phone number to claim your discount.");
      return;
    }

    const newLead: Lead = {
      id: "l-" + Date.now(),
      name: leadName,
      email: leadEmail,
      phone: leadPhone,
      incentiveClaimed: "10% Off First Service Coupon",
      createdAt: new Date().toISOString()
    };

    setLeads(prev => [newLead, ...prev]);
    setLeadSaved(true);

    setTimeout(() => {
      setLeadSaved(false);
      setLeadName("");
      setLeadEmail("");
      setLeadPhone("");
    }, 5000);
  };

  const approvedReviews = reviews.filter(r => r.approved);

  return (
    <div className="overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[95vh] bg-gradient-to-br from-purple-deep via-purple-mid to-purple-light text-white flex flex-col justify-center items-center px-4 pt-28 pb-16 text-center select-none">
        {/* Animated ambient backdrop orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-pink/10 blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Small floating realistic photo cards representing services */}
        <div className="hidden lg:block absolute left-12 xl:left-24 top-1/3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-2xl animate-bounce duration-1000 max-w-[130px]">
          <img 
            src={serviceLaundry} 
            alt="Laundering process" 
            className="w-16 h-12 rounded-xl object-cover mb-2 border border-white/20 mx-auto"
            referrerPolicy="no-referrer"
          />
          <span className="text-[10px] font-black tracking-wider uppercase text-amber-300 block text-center">Fast Laundry</span>
        </div>
        <div className="hidden lg:block absolute right-12 xl:right-24 top-1/4 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-2xl animate-bounce duration-[3s] max-w-[130px]">
          <img 
            src={serviceHouse} 
            alt="House interior cleaning" 
            className="w-16 h-12 rounded-xl object-cover mb-2 border border-white/20 mx-auto"
            referrerPolicy="no-referrer"
          />
          <span className="text-[10px] font-black tracking-wider uppercase text-amber-300 block text-center">Deep Clean</span>
        </div>
        <div className="hidden lg:block absolute left-20 xl:left-36 bottom-1/4 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-2xl animate-bounce duration-[4s] max-w-[130px]">
          <img 
            src={serviceCarpet} 
            alt="Carpet wash" 
            className="w-16 h-12 rounded-xl object-cover mb-2 border border-white/20 mx-auto"
            referrerPolicy="no-referrer"
          />
          <span className="text-[10px] font-black tracking-wider uppercase text-amber-300 block text-center">Carpet Clean</span>
        </div>
        <div className="hidden lg:block absolute right-20 xl:right-36 bottom-1/3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-2xl animate-bounce duration-[2.5s] max-w-[130px]">
          <img 
            src={maryChandelier} 
            alt="Mary cleaning chandelier" 
            className="w-16 h-12 rounded-xl object-cover mb-2 border border-white/20 mx-auto"
            referrerPolicy="no-referrer"
          />
          <span className="text-[10px] font-black tracking-wider uppercase text-amber-300 block text-center">Mary in Action</span>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest shadow-sm">
            <Sparkles size={12} className="animate-spin" />
            <span>Nanyuki&apos;s Premium Cleaning Choice</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            We Clean, <br />
            So You Can <span className="text-gold">Breathe Easy.</span>
          </h2>

          <p className="text-base sm:text-xl text-purple-100 font-medium max-w-xl mx-auto leading-relaxed">
            Professional laundry, carpet washing, Airbnb turnovers, and domestic deep cleaning. Trusted, reliable, and prompt across Nanyuki town.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-purple-100">
            <span className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Check className="text-gold" size={14} /> 100% Reliable Mama Fua
            </span>
            <span className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Check className="text-gold" size={14} /> Free Town Pickup &amp; Delivery
            </span>
            <span className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Check className="text-gold" size={14} /> 5-Star Cleanliness Guarantee
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#services-section"
              className="w-full sm:w-auto bg-pink hover:bg-pink/90 text-white font-extrabold px-8 py-4 rounded-full shadow-lg hover:shadow-pink/30 hover:-translate-y-0.5 transition duration-200 flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <Calendar size={18} />
              <span>📅 Book a Service Today</span>
            </a>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20Mary!%20I%20found%20your%20website%20and%20I%27d%20like%20to%20enquire%20about%20your%20services.`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white font-bold px-8 py-4 rounded-full border-2 border-white/30 hover:border-gold hover:text-gold transition duration-200 flex items-center justify-center gap-2 text-base"
            >
              <Phone size={18} />
              <span>WhatsApp Mary Anthony</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION (BENTO GRID STYLE WITH DYNAMIC CATEGORY FILTER) */}
      <section className="py-20 px-4 bg-off-white" id="services-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
            <span className="text-pink text-xs font-black tracking-widest uppercase block">
              Our Professional Services
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-purple-deep leading-snug">
              What We Do in Nanyuki
            </h2>
            <p className="text-sm text-gray-500">
              No task is too small or too messy. We sanitize and polish so you have more time to enjoy Mount Kenya vistas.
            </p>
          </div>

          {/* Interactive Category Filter Bar */}
          <div className="flex flex-wrap justify-center items-center gap-2 mb-12">
            {[
              { id: "all", label: "✨ All Services" },
              { id: "cleaning", label: "🧹 Deep Clean" },
              { id: "laundry", label: "🧺 Laundry" },
              { id: "other", label: "⚙️ Maintenance & Errands" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition cursor-pointer ${
                  selectedCategory === tab.id
                    ? "bg-purple-deep text-white shadow-md border-b-2 border-amber-400"
                    : "bg-white text-purple-deep/75 hover:bg-purple-soft/20 border border-purple-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dynamic Animated Bento Grid */}
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {services
                .filter(s => selectedCategory === "all" || s.category === selectedCategory)
                .map((service) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={service.id}
                    className="group relative bg-white rounded-3xl overflow-hidden border border-purple-100/40 shadow-sm hover:shadow-xl hover:border-purple-mid/20 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Realistic Service Cover Photo */}
                    <div className="h-48 w-full overflow-hidden relative bg-purple-soft/10">
                      <img 
                        src={getServiceImage(service.id)} 
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      {/* Floating Service Icon */}
                      <div className="absolute top-4 left-4 bg-purple-deep/85 backdrop-blur-md rounded-2xl p-2.5 text-white flex items-center justify-center shadow-md">
                        {getServiceIcon(service.icon)}
                      </div>
                      {service.isFeatured && (
                        <div className="absolute top-4 right-4 bg-amber-400 text-purple-deep text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-md">
                          Featured
                        </div>
                      )}
                    </div>

                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <span className="text-[10px] bg-purple-50 text-purple-deep border border-purple-100 font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                            {service.category === "cleaning" ? "Deep Clean" : service.category === "laundry" ? "Laundry" : "Maintenance"}
                          </span>
                          <div className="text-right">
                            <span className="text-[9px] text-pink font-bold uppercase tracking-wider block">
                              {service.priceType === "per_sq_meter" ? "Rate" : "Starts at"}
                            </span>
                            <span className="font-serif text-lg sm:text-xl font-black text-purple-deep">
                              KSh {service.price}
                            </span>
                            <span className="text-xs text-gray-500"> / {service.priceUnit}</span>
                          </div>
                        </div>

                        <h3 className="font-serif text-xl font-extrabold text-purple-deep mb-2 flex items-center gap-1.5">
                          {service.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6">
                          {service.description}
                        </p>

                        <ul className="space-y-2 mb-8">
                          {service.benefits.map((benefit, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full bg-pink-soft text-pink flex items-center justify-center font-black text-[9px] shrink-0">
                                ✓
                              </span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => handleQuickBook(service.id)}
                        className="w-full bg-pink hover:bg-pink/90 text-white text-xs font-bold py-3.5 rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 mt-auto"
                      >
                        <span>Book This Service</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* NEW SECTION: COLLAPSIBLE FAQ ACCORDION */}
      <section className="py-20 px-4 bg-white border-t border-purple-100/40" id="faq-section">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
            <span className="text-pink text-xs font-black tracking-widest uppercase block">
              💡 Got Questions?
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-purple-deep leading-snug">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-gray-500">
              Clear answers to common questions about our procedures, scheduling, and payment terms.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What areas in Nanyuki do you cover?",
                a: "We cover all major locations in and around Nanyuki town, including Nanyuki CBD, Likii, Majengo, Baraka, Sweetwaters area, Nanyuki Airfield surroundings, and neighboring Laikipia areas. If you reside slightly outside town, feel free to enquire with Mary on WhatsApp!"
              },
              {
                q: "How do you calculate your laundry and deep cleaning rates?",
                a: "We offer flat, transparent rates with zero hidden fees! Laundry starts at KSh 500 per load/basket, and customized house deep-cleaning starts at KSh 1,500. Specific delicate items, high-end carpets, or large chandeliers are assessed on-site and quoted upfront to guarantee full price clarity."
              },
              {
                q: "Do I need to supply any detergents, cleaning products, or machines?",
                a: "No! Our professional cleaning team arrives fully equipped with high-performance carpet vacuum-extractors, premium fabrics shampoos, disinfectants, microfiber towels, and fresh fragrances. However, if you have specialized detergents or preferred fabric sanitizers you would like us to use, we are happy to use them."
              },
              {
                q: "What is your scheduling and cancellation policy?",
                a: "We provide highly flexible booking times including weekends and public holidays. To reschedule or cancel your appointment, we kindly ask for a 12-hour notice so we can re-route our team members to other clients."
              },
              {
                q: "What are your payment terms and do you accept M-Pesa?",
                a: "Yes, we accept M-Pesa payments (direct to Mary's mobile number or our Buy Goods Till number) as well as cash. Payment is only completed immediately upon the successful completion of the service and your final inspection."
              },
              {
                q: "Can I trust Sparkle & Shine with highly delicate furniture or luxury fixtures?",
                a: "Absolutely. Mary Anthony and her hand-picked crew are thoroughly trained in cleaning luxury materials, leather sofas, high-pile carpets, and fragile items like glass chandeliers. We treat every client’s property with absolute care, respect, and discretion."
              }
            ].map((faq, idx) => {
              const isOpen = activeFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-off-white rounded-2xl border border-purple-100/40 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <button
                    onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-purple-deep hover:text-pink transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="w-8 h-8 rounded-full bg-purple-soft/30 text-purple-deep flex items-center justify-center shrink-0">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-gray-500 leading-relaxed border-t border-purple-100/20">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. MARY'S HEARTWARMING FB STORY & BREAKING CYCLES SECTION */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-deep via-purple-mid to-purple-light text-white overflow-hidden relative select-none" id="story-section">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,197,24,0.1),transparent_40%)] pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-center">
          {/* Avatar and quote info */}
          <div className="lg:col-span-5 flex flex-col items-center text-center lg:text-left space-y-6">
            <div className="relative group">
              {/* Gold outer border */}
              <div className="absolute inset-0 bg-gold rounded-full transform rotate-6 scale-105 shadow-xl group-hover:rotate-12 transition-transform duration-300"></div>
              {/* Main styled profile avatar representation */}
              <div className="relative w-64 h-64 rounded-full border-4 border-white overflow-hidden shadow-inner bg-purple-deep flex items-center justify-center">
                <img 
                  src={settings.ownerImage || maryPortrait} 
                  alt="Mary Anthony Portrait" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-amber-400 text-purple-deep text-xs font-black px-4 py-2 rounded-2xl shadow-xl transform rotate-3 flex flex-col items-center">
                <span>Nanyuki</span>
                <span className="text-[9px] uppercase tracking-wider">Cycles Breaker</span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-white">{settings.ownerName}</h3>
              <p className="text-amber-300 text-xs font-black uppercase tracking-wider">Founder, Sparkle &amp; Shine</p>
              <p className="text-purple-200 text-xs flex items-center justify-center lg:justify-start gap-1">
                <MapPin size={11} /> Nanyuki Town, Kenya
              </p>
            </div>
          </div>

          {/* Core Quote Content */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-gold text-xs font-black tracking-widest uppercase block">
              Meet the Woman Behind the Vision
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white leading-snug">
              Carrying Purpose Instead of Weight
            </h2>

            {/* Quote block */}
            <blockquote className="relative bg-white/5 border-l-4 border-gold p-6 rounded-r-2xl text-purple-100 font-serif italic text-base leading-relaxed">
              <p className="relative z-10">
                &quot;{settings.aboutQuote}&quot;
              </p>
            </blockquote>

            <p className="text-sm text-purple-200 leading-relaxed">
              {settings.aboutText}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                <span className="w-8 h-8 rounded-full bg-gold/30 border border-gold text-gold flex items-center justify-center text-xs font-black">✨</span>
                <span className="w-8 h-8 rounded-full bg-pink/30 border border-pink text-pink flex items-center justify-center text-xs font-black">❤️</span>
                <span className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-black">🏡</span>
              </div>
              <span className="text-xs text-purple-200 font-bold">
                100% locally owned. Supporting single mothers in Nanyuki.
              </span>
            </div>

            {/* Realistic Action Showcase Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 mt-6">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 shadow-md">
                <span className="text-amber-300 font-bold text-[10px] uppercase tracking-wider block mb-2">📸 Mary in Action</span>
                <div className="rounded-xl overflow-hidden h-36">
                  <img 
                    src={maryChandelier} 
                    alt="Mary Anthony cleaning chandelier in Nanyuki" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-[9px] text-purple-200 mt-2 font-medium">Mary Anthony professional chandelier deep cleaning service.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-md flex flex-col justify-center space-y-2">
                <span className="text-pink font-extrabold text-[10px] uppercase tracking-wider block">Our Standard</span>
                <h4 className="font-serif text-white font-bold text-sm">Unmatched Attention to Detail</h4>
                <p className="text-[11px] text-purple-200 leading-relaxed">
                  Every fiber, corner, and glass fixture cleaned with precision and premium products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BOOKING ENGINE WITH INTERACTIVE CALENDAR & CONTRACT */}
      <section className="py-20 px-4 bg-off-white" id="book-now-section">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
            <span className="text-pink text-xs font-black tracking-widest uppercase block">
              Schedule Your Session
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-purple-deep leading-snug">
              Instant Booking Calendar
            </h2>
            <p className="text-sm text-gray-500">
              Pick your service, date, and preferred hour. No deposit required. Your details are sent directly to Mary for fast verification!
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {bookingSubmitted ? (
              <div className="p-8 sm:p-12 text-center space-y-6">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle size={44} className="animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-black text-purple-deep">Booking Request Sent!</h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-bold text-purple-deep">{bName}</span>. Your booking for <span className="font-bold text-purple-mid">{services.find(s=>s.id===bServiceId)?.name}</span> on <span className="font-bold text-purple-deep">{bDate}</span> has been saved.
                  </p>
                  <p className="text-xs text-amber-600 font-semibold bg-amber-50 rounded-lg p-2 max-w-xs mx-auto">
                    Opening WhatsApp to send confirmation...
                  </p>
                </div>
                <button
                  onClick={() => setBookingSubmitted(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 underline font-semibold transition cursor-pointer"
                >
                  Book another session
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="p-6 sm:p-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Your Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      className="w-full bg-gray-50 border border-purple-200 focus:bg-white rounded-xl p-3 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-purple-deep"
                      placeholder="e.g. Jane Wanjiku"
                      value={bName}
                      onChange={e => setBName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Your WhatsApp Mobile <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      required
                      className="w-full bg-gray-50 border border-purple-200 focus:bg-white rounded-xl p-3 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-purple-deep font-mono"
                      placeholder="e.g. 0712345678"
                      value={bPhone}
                      onChange={e => setBPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Your Email Address (Optional)</label>
                    <input
                      type="email"
                      className="w-full bg-gray-50 border border-purple-200 focus:bg-white rounded-xl p-3 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-purple-deep"
                      placeholder="e.g. jane@example.com"
                      value={bEmail}
                      onChange={e => setBEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Select Service <span className="text-red-500">*</span></label>
                    <select
                      required
                      className="w-full bg-gray-50 border border-purple-200 focus:bg-white rounded-xl p-3 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-purple-deep"
                      value={bServiceId}
                      onChange={e => setBServiceId(e.target.value)}
                    >
                      <option value="">-- Choose from our offerings --</option>
                      {services.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} (KES {s.price} {s.priceType === "per_sq_meter" ? "/sqm" : ""})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Preferred Date <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      required
                      className="w-full bg-gray-50 border border-purple-200 focus:bg-white rounded-xl p-3 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-purple-deep"
                      value={bDate}
                      onChange={e => setBDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Preferred Time <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      className="w-full bg-gray-50 border border-purple-200 focus:bg-white rounded-xl p-3 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-purple-deep"
                      placeholder="e.g. 09:00 AM"
                      value={bTime}
                      onChange={e => setBTime(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Your Nanyuki Location <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      className="w-full bg-gray-50 border border-purple-200 focus:bg-white rounded-xl p-3 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-purple-deep"
                      placeholder="e.g. Cedar Mall Estate, Likii"
                      value={bLocation}
                      onChange={e => setBLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Additional Notes or Special Instructions</label>
                  <textarea
                    rows={2}
                    className="w-full bg-gray-50 border border-purple-200 focus:bg-white rounded-xl p-3 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-purple-deep"
                    placeholder="e.g. Curtains need extra stain remover, pickup delivery needed at my shop..."
                    value={bNotes}
                    onChange={e => setBNotes(e.target.value)}
                  />
                </div>

                {/* Real-time pre-filled WhatsApp Message Generator / Preview */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl overflow-hidden shadow-sm space-y-0">
                  <div className="bg-emerald-600 px-4 py-3.5 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-300 animate-ping"></div>
                      <span className="text-xs font-black uppercase tracking-wider">Live WhatsApp Message Draft</span>
                    </div>
                    <span className="bg-emerald-700 text-emerald-100 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Auto-Prefilled
                    </span>
                  </div>
                  <div className="p-4 bg-[#ece5dd] relative">
                    <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:16px_16px] pointer-events-none"></div>
                    
                    <div className="relative bg-white text-gray-800 text-xs rounded-2xl rounded-tl-none p-4 shadow-md border border-gray-200/40 max-w-[95%] space-y-2 font-sans mx-auto sm:ml-0">
                      <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <span>Mary Anthony</span>
                        <span className="text-gray-400 font-normal">● Online</span>
                      </div>
                      <div className="whitespace-pre-line text-gray-700 leading-relaxed font-mono bg-emerald-50/70 p-3 rounded-xl border border-emerald-100/60 text-[11px]">
                        {`Hi Mary! Booking request from Sparkle & Shine Website:

👤 Name: ${bName || "[Enter your name]"}
📞 Phone: ${bPhone || "[Enter WhatsApp phone]"}
${bEmail ? `📧 Email: ${bEmail}\n` : ""}✨ Service: ${services.find(s => s.id === bServiceId)?.name || "[Select service below]"}
📅 Date: ${bDate ? formatDate(bDate) : "[Choose preferred date]"}
⏰ Preferred Time: ${bTime || "[Choose preferred hour]"}
📍 Location: ${bLocation || "[Enter Nanyuki address]"}
${bNotes ? `📝 Notes: ${bNotes}\n` : ""}
🤝 I have read and accepted your Terms of Service. Please confirm my appointment!`}
                      </div>
                      <div className="text-right text-[9px] text-gray-400 mt-1 font-mono">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white px-4 py-3.5 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                    <span className="text-[11px] leading-snug">
                      Your inputs above are compiled dynamically into this message.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (!bName || !bPhone || !bServiceId || !bDate) {
                          alert("Please fill in Name, Phone Number, Service, and Date to pre-fill your request first!");
                          return;
                        }
                        const matchedSrv = services.find(s => s.id === bServiceId);
                        const sName = matchedSrv ? matchedSrv.name : "Custom Cleaning";
                        let waMsg = `Hi Mary! Booking request from Sparkle & Shine Website:\n\n`;
                        waMsg += `👤 Name: ${bName}\n`;
                        waMsg += `📞 Phone: ${bPhone}\n`;
                        if (bEmail) waMsg += `📧 Email: ${bEmail}\n`;
                        waMsg += `✨ Service: ${sName}\n`;
                        waMsg += `📅 Date: ${formatDate(bDate)}\n`;
                        waMsg += `⏰ Preferred Time: ${bTime || "Not Specified"}\n`;
                        waMsg += `📍 Location: ${bLocation}\n`;
                        if (bNotes) waMsg += `📝 Notes: ${bNotes}\n\n`;
                        waMsg += `🤝 I have read and accepted your Terms of Service. Please confirm my appointment!`;
                        
                        const encodedMsg = encodeURIComponent(waMsg);
                        const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodedMsg}`;
                        window.open(waUrl, "_blank");
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
                    >
                      <Phone size={14} />
                      <span>Send via WhatsApp Directly</span>
                    </button>
                  </div>
                </div>

                {/* Contract/TOS Acceptance Checkbox */}
                <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-200/40 space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      required
                      id="accept-terms"
                      className="mt-1 accent-purple-deep h-4 w-4"
                      checked={bAgreed}
                      onChange={e => setBAgreed(e.target.checked)}
                    />
                    <label htmlFor="accept-terms" className="text-xs text-gray-600 leading-relaxed">
                      I have read, understood, and agreed to the <button type="button" onClick={() => setShowContractModal(true)} className="text-purple-mid hover:text-purple-deep font-bold underline">Terms &amp; Service Agreement</button> for Sparkle &amp; Shine Services Nanyuki. <span className="text-red-500">*</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-pink hover:bg-pink/90 text-white font-black text-sm uppercase py-4 rounded-xl shadow-lg hover:shadow-pink/20 transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone size={16} />
                  <span>Send Secure Booking Request to Mary</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Contract terms Modal representation */}
      {showContractModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 flex flex-col justify-between">
            <div className="p-6 border-b border-gray-100 bg-purple-deep text-white">
              <h3 className="font-serif text-lg font-bold">Service Contract Agreement</h3>
              <p className="text-[10px] text-purple-200">Please read thoroughly before accepting</p>
            </div>
            <div className="p-6 text-xs text-gray-500 font-mono whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {settings.contractTerms}
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setBAgreed(true);
                  setShowContractModal(false);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
              >
                Accept Terms
              </button>
              <button
                onClick={() => setShowContractModal(false)}
                className="bg-white border border-gray-200 text-gray-700 font-semibold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 flex flex-col justify-between">
            <div className="p-6 border-b border-gray-100 bg-pink text-white">
              <h3 className="font-serif text-lg font-bold">Privacy Policy</h3>
              <p className="text-[10px] text-pink-soft">Effective July 2026 – Sparkle &amp; Shine</p>
            </div>
            <div className="p-6 text-xs text-gray-600 space-y-4 max-h-80 overflow-y-auto leading-relaxed">
              <div>
                <h4 className="font-bold text-purple-deep uppercase text-[10px] mb-1">1. Information We Collect</h4>
                <p>We collect your Name, WhatsApp Phone Number, Email, and physical/estate Location in Nanyuki solely to process your service bookings, manage prompt laundry pickup &amp; delivery, and communicate effectively.</p>
              </div>
              <div>
                <h4 className="font-bold text-purple-deep uppercase text-[10px] mb-1">2. How We Use Your Information</h4>
                <p>Your details are used exclusively to secure your bookings, dispatch our professional cleaners (Mama Fua team), return your fresh laundry, and process your mobile transfers/M-Pesa till transactions.</p>
              </div>
              <div>
                <h4 className="font-bold text-purple-deep uppercase text-[10px] mb-1">3. Data Protection &amp; Disclosure</h4>
                <p>We maintain absolute confidentiality. We do not sell, lease, rent, or share your personal information with any third-party marketing companies. All interaction is conducted directly and securely between you and Mary Anthony.</p>
              </div>
              <div>
                <h4 className="font-bold text-purple-deep uppercase text-[10px] mb-1">4. User Consent</h4>
                <p>By requesting bookings or submitting forms on this site, you consent to our simple privacy practices. You can opt out at any time or request to remove your info by messaging Mary on WhatsApp.</p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="bg-purple-deep hover:bg-purple-mid text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
              >
                Understood &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 flex flex-col justify-between">
            <div className="p-6 border-b border-gray-100 bg-pink text-white">
              <h3 className="font-serif text-lg font-bold">Terms of Service</h3>
              <p className="text-[10px] text-pink-soft">Last Updated July 2026 – Sparkle &amp; Shine</p>
            </div>
            <div className="p-6 text-xs text-gray-600 space-y-4 max-h-80 overflow-y-auto leading-relaxed">
              <div>
                <h4 className="font-bold text-purple-deep uppercase text-[10px] mb-1">1. Scope of Service</h4>
                <p>Sparkle &amp; Shine Services provides laundry washing, carpet extraction, sofa cleaning, Airbnb property turnover, and customized domestic deep-cleaning within Nanyuki Town and environs.</p>
              </div>
              <div>
                <h4 className="font-bold text-purple-deep uppercase text-[10px] mb-1">2. Laundry Pickup &amp; Delivery</h4>
                <p>Free laundry pickup and delivery is strictly restricted to Nanyuki Town limits. Remote estates or distant neighborhoods may request a modest transportation fee to support Mary&apos;s team.</p>
              </div>
              <div>
                <h4 className="font-bold text-purple-deep uppercase text-[10px] mb-1">3. Customer Satisfaction</h4>
                <p>Clients are requested to inspect premises, carpets, or delivered laundry immediately upon handover. Please report any feedback or remedial requests within 12 hours so we can make it right instantly.</p>
              </div>
              <div>
                <h4 className="font-bold text-purple-deep uppercase text-[10px] mb-1">4. Payment Terms</h4>
                <p>We accept cash and M-Pesa payments (direct transfer or Buy Goods Till). Payment is fully due immediately upon completion of services and successful client inspection.</p>
              </div>
              <div>
                <h4 className="font-bold text-purple-deep uppercase text-[10px] mb-1">5. Delicate Items &amp; Liability</h4>
                <p>While Mary&apos;s team exercises maximum care with all garments and materials, the client is responsible for identifying delicate upholstery, fragile antiques, or unique chandelier fixtures prior to cleaning commencement.</p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
              <button
                onClick={() => setShowTermsModal(false)}
                className="bg-purple-deep hover:bg-purple-mid text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
              >
                Accept &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. REVIEWS & TESTIMONIALS SECTION */}
      <section className="py-20 px-4 bg-purple-deep text-white relative select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(233,30,140,0.06),transparent_40%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-amber-400 text-xs font-black tracking-widest uppercase block">
              Testimonials
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white leading-snug">
              What Nanyuki Residents Say
            </h2>
            <div className="flex items-center justify-center gap-1 text-gold text-sm font-bold">
              <span>5.0</span>
              <div className="flex">★★★★★</div>
              <span className="text-purple-200">({approvedReviews.length} verified reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {approvedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:bg-white/10 transition duration-300 relative overflow-hidden"
              >
                {/* Visual Accent/Watermark */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full pointer-events-none"></div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="text-gold flex">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    {/* Premium Verified Purchase Badge */}
                    <span className="flex items-center gap-1 bg-green-500/15 text-green-300 border border-green-500/25 px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase shadow-sm">
                      <ShieldCheck size={11} className="text-green-300 animate-pulse" />
                      <span>Verified Purchase</span>
                    </span>
                  </div>
                  <p className="font-serif text-purple-100 text-sm sm:text-base italic leading-relaxed">
                    &quot;{review.reviewText}&quot;
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 mt-6 border-t border-white/5 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink to-purple-light text-white flex items-center justify-center font-bold text-sm shadow-md">
                      {review.reviewerName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{review.reviewerName}</h4>
                      <p className="text-[11px] text-purple-300">Cleaned: {review.serviceName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-purple-300 font-medium block">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* User Review Submission Sub-Block */}
          <div className="max-w-xl mx-auto bg-white/5 rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
            <div className="text-center">
              <h3 className="font-serif text-lg font-bold text-white">Share Your Feedback</h3>
              <p className="text-xs text-purple-200 mt-1">Have you used Mary&apos;s Sparkle &amp; Shine cleaning service recently? Let us know!</p>
            </div>

            {reviewSubmitted ? (
              <div className="bg-green-500/20 text-green-200 border border-green-500/30 rounded-2xl p-4 text-xs font-semibold text-center">
                ✨ Thank you for your feedback! Your review has been saved in localStorage and is live.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    className="bg-white/10 border border-white/15 focus:bg-white/20 rounded-xl p-3 text-xs focus:outline-none text-white focus:ring-1 focus:ring-gold"
                    value={rName}
                    onChange={e => setRName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Service e.g. Carpet Wash"
                    required
                    className="bg-white/10 border border-white/15 focus:bg-white/20 rounded-xl p-3 text-xs focus:outline-none text-white focus:ring-1 focus:ring-gold"
                    value={rService}
                    onChange={e => setRService(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-3 justify-center">
                  <span className="text-xs text-purple-200">Rating:</span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRRating(star)}
                        className={`text-lg transition ${star <= rRating ? "text-gold" : "text-purple-300"}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  placeholder="Tell others in Nanyuki about your experience..."
                  required
                  rows={2}
                  className="w-full bg-white/10 border border-white/15 focus:bg-white/20 rounded-xl p-3 text-xs focus:outline-none text-white focus:ring-1 focus:ring-gold"
                  value={rText}
                  onChange={e => setRText(e.target.value)}
                />

                <button
                  type="submit"
                  className="w-full bg-gold hover:bg-amber-500 text-purple-deep font-extrabold text-xs uppercase py-3.5 rounded-xl shadow-md transition cursor-pointer"
                >
                  Submit Your Review
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 6. LEAD CAPTURE WITH INCENTIVE */}
      <section className="py-16 bg-gradient-to-br from-pink-soft to-white px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-pink/10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1 bg-pink text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider">
              <Percent size={10} />
              <span>Special Offer</span>
            </div>
            <h3 className="font-serif text-2xl font-black text-purple-deep leading-tight">
              {settings.incentiveTitle}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              {settings.incentiveDescription}
            </p>
          </div>

          <div className="md:col-span-5 bg-off-white p-5 rounded-2xl border border-gray-100">
            {leadSaved ? (
              <div className="text-center space-y-2 p-4">
                <CheckCircle className="text-pink mx-auto" size={32} />
                <h4 className="font-serif font-bold text-purple-deep text-sm">Coupon Secured!</h4>
                <p className="text-[11px] text-gray-400">
                  Voucher details are saved. Mention this to Mary on WhatsApp to get your discount!
                </p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Full Name"
                  required
                  className="w-full bg-white border border-purple-100 rounded-xl p-2.5 text-xs focus:outline-none"
                  value={leadName}
                  onChange={e => setLeadName(e.target.value)}
                />
                <input
                  type="tel"
                  placeholder="WhatsApp Phone Number"
                  required
                  className="w-full bg-white border border-purple-100 rounded-xl p-2.5 text-xs focus:outline-none font-mono"
                  value={leadPhone}
                  onChange={e => setLeadPhone(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-white border border-purple-100 rounded-xl p-2.5 text-xs focus:outline-none"
                  value={leadEmail}
                  onChange={e => setLeadEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full bg-pink hover:bg-pink/90 text-white font-bold text-xs uppercase py-3 rounded-xl shadow-md transition cursor-pointer"
                >
                  Secure My 10% Voucher
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 7. QUICK SHARE SECTION */}
      <section className="py-16 bg-white border-t border-purple-100/30 px-4 text-center select-none">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-purple-soft/50 border border-purple-100/50 text-purple-deep text-xs font-bold px-4 py-2 rounded-full tracking-wide">
            <Share2 size={14} className="text-pink animate-bounce" />
            <span>Support Nanyuki’s Leading Mama Fua!</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-black text-purple-deep">
            Spread the Word &amp; Share This Site!
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
            Help support Mary Anthony and her dedicated team of single mothers in Nanyuki by sharing her services with your friends, family, or neighbors! Let’s grow this business together.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {/* WhatsApp Share */}
            <a
              href={`https://wa.me/?text=Check%20out%20Sparkle%20%26%20Shine%20Services%20in%20Nanyuki%20for%20professional%20laundry%2C%20carpet%20washing%2C%20and%20house%20deep%20cleaning!%20%F0%9F%A7%BA%F0%9F%A6%B9%E2%9C%A8%20https%3A%2F%2Fais-dev-ftig237qlmr64xnor5mvst-454258292215.europe-west3.run.app`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#25D366]/90 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md hover:-translate-y-0.5 transition cursor-pointer animate-pulse-wa"
            >
              <span className="text-base">💬</span>
              <span>Share on WhatsApp</span>
            </a>

            {/* Facebook Share */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fais-dev-ftig237qlmr64xnor5mvst-454258292215.europe-west3.run.app`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl bg-[#1877F2] hover:bg-[#1877F2]/90 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md hover:-translate-y-0.5 transition cursor-pointer"
            >
              <span className="text-base">🔵</span>
              <span>Share on Facebook</span>
            </a>

            {/* Twitter / X Share */}
            <a
              href={`https://twitter.com/intent/tweet?text=Check%20out%20Sparkle%20%26%20Shine%20Services%20in%20Nanyuki%20for%20professional%20laundry%20and%20deep%20cleaning!%20%F0%9F%A7%BA%F0%9F%A6%B9%20https%3A%2F%2Fais-dev-ftig237qlmr64xnor5mvst-454258292215.europe-west3.run.app`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl bg-black hover:bg-black/80 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md hover:-translate-y-0.5 transition cursor-pointer"
            >
              <span className="text-sm font-black">X</span>
              <span>Tweet on X</span>
            </a>

            {/* Copy Link button */}
            <button
              onClick={() => {
                const shareUrl = window.location.href;
                navigator.clipboard.writeText(shareUrl).then(() => {
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 3000);
                }).catch(() => {
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 3000);
                });
              }}
              className="px-5 py-3 rounded-xl bg-purple-deep hover:bg-purple-mid text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md hover:-translate-y-0.5 transition cursor-pointer relative"
            >
              <Copy size={14} className="text-amber-400" />
              <span>{copiedLink ? "Link Copied! 🎉" : "Copy Website Link"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#160414] text-gray-400 pt-16 pb-24 md:pb-8 px-4 border-t border-white/5 select-none text-center sm:text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="w-8 h-8 rounded-full bg-gold text-purple-deep flex items-center justify-center font-black">✨</span>
              <h4 className="font-serif text-lg font-bold text-white">{settings.brandName}</h4>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto sm:mx-0">
              Reliable laundry, home deep cleaning, and hotel-quality Airbnb turnover services in Nanyuki, Kenya. We clean, so you don&apos;t have to.
            </p>
          </div>

          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Our Services</h5>
            <ul className="space-y-2 text-xs text-gray-500">
              <li>Laundry &amp; Folding</li>
              <li>Carpet &amp; Rug Wash</li>
              <li>Airbnb Property Turnover</li>
              <li>House General Deep Clean</li>
              <li>Sofa &amp; Upholstery extraction</li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Location &amp; Operations</h5>
            <p className="text-xs text-gray-500 flex items-center justify-center sm:justify-start gap-1">
              📍 {settings.locationText}
            </p>
            <p className="text-[10px] text-gray-600 mt-2">
              Open Daily: 07:00 AM – 06:00 PM
            </p>
          </div>

          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Direct Contact</h5>
            <p className="text-xs text-gray-500">
              Founder: <span className="text-white font-semibold">{settings.ownerName}</span>
            </p>
            <div className="flex flex-col gap-1.5 mt-3 items-center sm:items-start">
              <a href={`tel:${settings.whatsappNumber}`} className="text-xs text-amber-400 hover:underline">
                📞 +{settings.whatsappNumber}
              </a>
              <a href={`https://wa.me/${settings.whatsappNumber}`} className="text-xs text-purple-300 hover:underline">
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 text-center text-xs text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {settings.brandName}. Designed with purpose for Mary Anthony. ✨</p>
          <div className="flex gap-4">
            <span onClick={() => setShowPrivacyModal(true)} className="text-[10px] hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span onClick={() => setShowTermsModal(true)} className="text-[10px] hover:text-gray-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>

      {/* MOBILE STICKY BOTTOM NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-purple-100 py-3 px-4 flex items-center justify-around z-50 shadow-[0_-4px_25px_rgba(59,26,107,0.12)]">
        <a
          href="#services-section"
          className="flex flex-col items-center gap-1 text-purple-deep/70 hover:text-purple-deep transition text-[10px] font-bold"
        >
          <Sparkles size={18} className="text-purple-mid" />
          <span>Services</span>
        </a>
        <a
          href="#story-section"
          className="flex flex-col items-center gap-1 text-purple-deep/70 hover:text-purple-deep transition text-[10px] font-bold"
        >
          <Heart size={18} className="text-pink" />
          <span>Our Story</span>
        </a>
        <a
          href="#book-now-section"
          className="flex flex-col items-center gap-1 text-purple-deep/70 hover:text-purple-deep transition text-[10px] font-bold"
        >
          <Calendar size={18} className="text-amber-500 animate-pulse" />
          <span>Book Now</span>
        </a>
        <a
          href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20Mary!%20I%20found%20your%20website%20and%20I%27d%20like%20to%20enquire%20about%20your%20services.`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-1 text-[#25D366] hover:text-[#25D366]/80 transition text-[10px] font-bold"
        >
          <div className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center text-[11px] font-bold shadow-sm">
            💬
          </div>
          <span>Chat Mary</span>
        </a>
      </div>

      {/* Floating Active WhatsApp bubble (positioned above sticky nav on mobile) */}
      <a
        href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20Mary!%20I%20saw%20your%20website%20and%20I%27d%20like%20to%20ask%20a%20question%20about%20your%20services.`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-20 md:bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center text-2xl shadow-xl hover:scale-110 transition z-40 animate-pulse-wa"
        title="Chat on WhatsApp"
      >
        💬
      </a>
    </div>
  );
}
