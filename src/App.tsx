/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import AdminDashboard from "./components/AdminDashboard";
import { Service, Booking, Review, AppSettings, Lead } from "./types";
import { 
  defaultSettings, defaultServices, defaultReviews, defaultBookings, defaultLeads 
} from "./defaultData";
import { Sparkles, Layout, ShieldAlert, ArrowLeftRight, HelpCircle, Code } from "lucide-react";

export default function App() {
  const [view, setView] = useState<"client" | "admin">("client");

  // Stateful templates initialized from localStorage or defaults
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem("sns_settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem("sns_services");
    return saved ? JSON.parse(saved) : defaultServices;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem("sns_reviews");
    return saved ? JSON.parse(saved) : defaultReviews;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem("sns_bookings");
    return saved ? JSON.parse(saved) : defaultBookings;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem("sns_leads");
    return saved ? JSON.parse(saved) : defaultLeads;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("sns_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("sns_services", JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem("sns_reviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem("sns_bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("sns_leads", JSON.stringify(leads));
  }, [leads]);

  // Reset demo back to clean defaults helper
  const handleResetDemo = () => {
    if (confirm("Are you sure you want to reset all modifications back to Mary's pristine default template?")) {
      localStorage.removeItem("sns_settings");
      localStorage.removeItem("sns_services");
      localStorage.removeItem("sns_reviews");
      localStorage.removeItem("sns_bookings");
      localStorage.removeItem("sns_leads");
      setSettings(defaultSettings);
      setServices(defaultServices);
      setReviews(defaultReviews);
      setBookings(defaultBookings);
      setLeads(defaultLeads);
      alert("All parameters have been reset successfully!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-off-white">
      {/* Dynamic Demo Control Bar */}
      <div className="bg-amber-400 text-purple-deep px-4 py-2 text-center text-xs font-black flex items-center justify-center gap-2 sm:gap-6 flex-wrap shadow-inner">
        <span className="flex items-center gap-1">
          <Sparkles size={13} className="animate-spin" />
          <span>Interactive Template Customizer &amp; Builder</span>
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView(view === "client" ? "admin" : "client")}
            className="bg-purple-deep hover:bg-purple-mid text-white px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase transition flex items-center gap-1 shadow cursor-pointer"
          >
            <ArrowLeftRight size={10} />
            <span>Switch to {view === "client" ? "Admin Area" : "Live Landing Page"}</span>
          </button>
          <button
            onClick={handleResetDemo}
            className="text-purple-deep/75 hover:text-purple-deep hover:underline transition font-bold text-[10px]"
          >
            Reset Default Values
          </button>
        </div>
      </div>

      {/* Floating View Indicator and Header Controller */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 shadow-sm select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-purple-deep text-white flex items-center justify-center font-black shadow-md">
              ✨
            </span>
            <div>
              <h1 className="font-serif text-sm sm:text-base font-extrabold text-purple-deep leading-tight">
                {settings.brandName}
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {settings.locationText.split(",")[0]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("client")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                view === "client" 
                  ? "bg-purple-deep text-white shadow-md" 
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Layout size={14} />
              <span className="hidden sm:inline">Visitor View</span>
            </button>
            <button
              onClick={() => setView("admin")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                view === "admin" 
                  ? "bg-purple-deep text-white shadow-md" 
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Code size={14} />
              <span>Admin Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Core View Area */}
      <main className="flex-1">
        {view === "client" ? (
          <LandingPage
            settings={settings}
            services={services}
            reviews={reviews}
            setReviews={setReviews}
            bookings={bookings}
            setBookings={setBookings}
            leads={leads}
            setLeads={setLeads}
          />
        ) : (
          <AdminDashboard
            settings={settings}
            setSettings={setSettings}
            services={services}
            setServices={setServices}
            bookings={bookings}
            setBookings={setBookings}
            reviews={reviews}
            setReviews={setReviews}
            leads={leads}
            setLeads={setLeads}
          />
        )}
      </main>
    </div>
  );
}
