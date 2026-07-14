/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Service, Booking, Review, AppSettings, Lead } from "../types";
import TemplateExporter from "./TemplateExporter";
import { 
  Calendar, DollarSign, Layers, Settings, Star, User, Plus, Trash2, Edit3, 
  Save, CheckCircle, Clock, XCircle, ArrowRight, Phone, MapPin, Sparkles, 
  HelpCircle, Check, Award, Eye, Code, Users
} from "lucide-react";

interface AdminDashboardProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
}

export default function AdminDashboard({
  settings, setSettings,
  services, setServices,
  bookings, setBookings,
  reviews, setReviews,
  leads, setLeads
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"bookings" | "services" | "reviews" | "leads" | "settings" | "export">("bookings");
  
  // States for Editing/Adding Services
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<Partial<Service>>({});
  const [isAddingService, setIsAddingService] = useState(false);

  // States for Rescheduling Bookings
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  // States for editing Settings
  const [settingsForm, setSettingsForm] = useState<AppSettings>({ ...settings });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Statistics calculations
  const totalApprovedBookings = bookings.filter(b => b.status === "approved").length;
  const totalPendingBookings = bookings.filter(b => b.status === "pending").length;
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / (totalReviews || 1);
  
  // Calculate potential revenue (e.g. sum of prices)
  const potentialRevenue = bookings
    .filter(b => b.status !== "cancelled")
    .reduce((acc, b) => {
      const matchService = services.find(s => s.id === b.serviceId);
      if (matchService) {
        // If price is 20 (like carpet), let's assume average 15 sqm (300 KSh)
        if (matchService.priceType === "per_sq_meter") {
          return acc + (matchService.price * 15);
        }
        return acc + matchService.price;
      }
      return acc + 1000; // default average
    }, 0);

  // Booking action handlers
  const handleApproveBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "approved" } : b));
  };

  const handleCancelBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" } : b));
  };

  const handleCompleteBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "completed" } : b));
  };

  const handleOpenReschedule = (booking: Booking) => {
    setReschedulingId(booking.id);
    setRescheduleDate(booking.bookingDate);
    setRescheduleTime(booking.bookingTime);
  };

  const handleSaveReschedule = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { 
      ...b, 
      status: "rescheduled",
      bookingDate: rescheduleDate,
      bookingTime: rescheduleTime
    } : b));
    setReschedulingId(null);
  };

  // Review handlers
  const handleToggleReviewApprove = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: !r.approved } : r));
  };

  const handleDeleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  // Service CRUD handlers
  const handleStartEditService = (service: Service) => {
    setEditingServiceId(service.id);
    setServiceForm(service);
  };

  const handleSaveServiceEdit = () => {
    if (!serviceForm.name || !serviceForm.price) return;
    setServices(prev => prev.map(s => s.id === editingServiceId ? { ...s, ...serviceForm } as Service : s));
    setEditingServiceId(null);
  };

  const handleDeleteService = (id: string) => {
    if (confirm("Are you sure you want to remove this service?")) {
      setServices(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleAddService = () => {
    const newId = "s-" + Date.now();
    const newService: Service = {
      id: newId,
      name: serviceForm.name || "New Premium Service",
      category: serviceForm.category || "cleaning",
      icon: serviceForm.icon || "Sparkles",
      priceType: serviceForm.priceType || "fixed",
      price: serviceForm.price || 1000,
      priceUnit: serviceForm.priceUnit || "session",
      description: serviceForm.description || "Describe the custom service details here...",
      benefits: serviceForm.benefits || ["Professional gear used", "Trained reliable crew", "100% Sparkle promise"],
      isFeatured: serviceForm.isFeatured || false
    };
    setServices(prev => [...prev, newService]);
    setIsAddingService(false);
    setServiceForm({});
  };

  // Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Dashboard Top Header */}
      <div className="bg-gradient-to-r from-purple-deep via-purple-mid to-purple-light text-white py-10 px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400 text-purple-deep text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Admin Area
              </span>
              <span className="text-purple-200 text-xs font-semibold">| Persisted in Local Browser</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold flex items-center gap-2">
              <Sparkles className="text-gold animate-bounce" size={28} />
              <span>Mary's Command Center</span>
            </h1>
            <p className="text-purple-100 text-sm mt-1 max-w-xl">
              Control bookings, manage user testimonials, update carpet/laundry rates, customize the "Broken Cycles" single-mom story, and export final deployment files.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-400 text-purple-deep flex items-center justify-center font-bold text-lg shadow-lg">
              MA
            </div>
            <div>
              <p className="text-xs text-purple-200">Logged in as Founder</p>
              <p className="text-sm font-bold text-white">{settings.ownerName}</p>
              <p className="text-xs text-amber-300">Nanyuki District Manager</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Core Bento Stats */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stat 1 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Potential Revenue</p>
              <h3 className="text-2xl font-black text-purple-deep mt-1 font-mono">
                KSh {potentialRevenue.toLocaleString()}
              </h3>
              <p className="text-xs text-green-600 font-medium mt-1">From active clients</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <DollarSign size={22} />
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Bookings Pipeline</p>
              <h3 className="text-2xl font-black text-purple-deep mt-1 flex items-baseline gap-2">
                <span className="font-mono">{totalPendingBookings}</span>
                <span className="text-xs font-semibold text-gray-400">pending</span>
              </h3>
              <p className="text-xs text-amber-600 font-medium mt-1">Requires your approval</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar size={22} />
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Trust Score</p>
              <h3 className="text-2xl font-black text-purple-deep mt-1 flex items-center gap-1">
                <span className="font-mono">{averageRating.toFixed(1)}</span>
                <span className="text-amber-400 text-sm">★</span>
              </h3>
              <p className="text-xs text-purple-600 font-medium mt-1">Based on {totalReviews} reviews</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-mid flex items-center justify-center">
              <Star size={22} className="fill-current text-purple-mid" />
            </div>
          </div>

          {/* Stat 4 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Discovered Leads</p>
              <h3 className="text-2xl font-black text-purple-deep mt-1 font-mono">
                {leads.length}
              </h3>
              <p className="text-xs text-pink font-medium mt-1">Claimed promo coupons</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-pink-soft text-pink flex items-center justify-center">
              <Users size={22} />
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex items-center overflow-x-auto gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm mb-8">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-3 rounded-xl transition shrink-0 cursor-pointer ${
              activeTab === "bookings" ? "bg-purple-deep text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Calendar size={16} />
            <span>Bookings ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("services")}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-3 rounded-xl transition shrink-0 cursor-pointer ${
              activeTab === "services" ? "bg-purple-deep text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Layers size={16} />
            <span>Customize Services &amp; Pricing</span>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-3 rounded-xl transition shrink-0 cursor-pointer ${
              activeTab === "reviews" ? "bg-purple-deep text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Star size={16} />
            <span>Reviews Moderation</span>
          </button>

          <button
            onClick={() => setActiveTab("leads")}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-3 rounded-xl transition shrink-0 cursor-pointer ${
              activeTab === "leads" ? "bg-purple-deep text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Users size={16} />
            <span>Incoming Leads ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-3 rounded-xl transition shrink-0 cursor-pointer ${
              activeTab === "settings" ? "bg-purple-deep text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Settings size={16} />
            <span>Brand Settings</span>
          </button>

          <button
            onClick={() => setActiveTab("export")}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition shrink-0 cursor-pointer ml-auto ${
              activeTab === "export" ? "bg-amber-500! text-white!" : ""
            }`}
          >
            <Code size={16} />
            <span>Export Config JSON</span>
          </button>
        </div>

        {/* Tab Contents */}

        {/* 1. BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-purple-deep">Booked Appointments</h2>
                <p className="text-xs text-gray-400 mt-0.5">Approve incoming, reschedule dates, and complete active works.</p>
              </div>
              <span className="text-xs font-mono font-bold text-purple-mid bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
                Total Orders: {bookings.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="p-4 pl-6">Client Info</th>
                    <th className="p-4">Service Required</th>
                    <th className="p-4">Desired Time &amp; Day</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">
                        No bookings found. Try booking a service on the home page first!
                      </td>
                    </tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-purple-50/10 transition">
                        <td className="p-4 pl-6">
                          <div className="font-bold text-purple-deep">{booking.customerName}</div>
                          <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Phone size={11} /> {booking.customerPhone}
                          </div>
                          {booking.customerEmail && (
                            <div className="text-xs text-gray-400">{booking.customerEmail}</div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="bg-purple-50 text-purple-deep font-semibold text-xs px-2.5 py-1 rounded-full border border-purple-100">
                            {booking.serviceName}
                          </span>
                        </td>
                        <td className="p-4">
                          {reschedulingId === booking.id ? (
                            <div className="flex flex-col gap-1.5 max-w-[150px]">
                              <input 
                                type="date" 
                                className="border border-purple-300 rounded px-1 text-xs"
                                value={rescheduleDate}
                                onChange={(e) => setRescheduleDate(e.target.value)}
                              />
                              <input 
                                type="text" 
                                className="border border-purple-300 rounded px-1 text-xs" 
                                value={rescheduleTime}
                                placeholder="09:00"
                                onChange={(e) => setRescheduleTime(e.target.value)}
                              />
                              <button 
                                onClick={() => handleSaveReschedule(booking.id)}
                                className="bg-green-600 text-white font-bold text-[10px] py-1 rounded hover:bg-green-700 transition"
                              >
                                Save Date
                              </button>
                            </div>
                          ) : (
                            <div>
                              <div className="font-semibold text-gray-700">{booking.bookingDate}</div>
                              <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <Clock size={11} /> {booking.bookingTime}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="text-xs text-gray-600 max-w-[180px] truncate" title={booking.location}>
                            📍 {booking.location}
                          </div>
                          {booking.notes && (
                            <div className="text-[11px] text-purple-600 italic mt-0.5">
                              &quot;{booking.notes}&quot;
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            booking.status === "approved" ? "bg-green-100 text-green-800" :
                            booking.status === "rescheduled" ? "bg-amber-100 text-amber-800" :
                            booking.status === "completed" ? "bg-purple-100 text-purple-800" :
                            booking.status === "cancelled" ? "bg-red-100 text-red-800" :
                            "bg-blue-100 text-blue-800"
                          }`}>
                            {booking.status === "pending" && <Clock size={10} />}
                            {booking.status === "approved" && <CheckCircle size={10} />}
                            {booking.status === "completed" && <Award size={10} />}
                            <span>{booking.status}</span>
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {booking.status === "pending" && (
                              <button
                                onClick={() => handleApproveBooking(booking.id)}
                                className="bg-green-600 hover:bg-green-700 text-white p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                title="Approve Booking"
                              >
                                <Check size={12} />
                                <span className="hidden md:inline">Approve</span>
                              </button>
                            )}
                            {booking.status !== "completed" && booking.status !== "cancelled" && (
                              <>
                                <button
                                  onClick={() => handleOpenReschedule(booking)}
                                  className="bg-amber-50 hover:bg-amber-100 text-amber-800 p-1.5 rounded-lg text-xs font-semibold border border-amber-200 transition cursor-pointer"
                                  title="Reschedule Date"
                                >
                                  Reschedule
                                </button>
                                <button
                                  onClick={() => handleCompleteBooking(booking.id)}
                                  className="bg-purple-100 hover:bg-purple-200 text-purple-900 p-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                                  title="Mark Completed"
                                >
                                  Done
                                </button>
                              </>
                            )}
                            {booking.status !== "cancelled" && (
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition cursor-pointer"
                                title="Cancel Booking"
                              >
                                <XCircle size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. SERVICES & PRICING */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-purple-deep">Services &amp; Pricing Directory</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Add new offerings, change price metrics, and modify descriptions.</p>
                </div>
                <button
                  onClick={() => {
                    setIsAddingService(true);
                    setEditingServiceId(null);
                    setServiceForm({
                      category: "cleaning",
                      priceType: "fixed",
                      price: 1000,
                      priceUnit: "session",
                      benefits: ["Professional Equipment Used", "100% Sparkle Guarantee"]
                    });
                  }}
                  className="bg-purple-mid hover:bg-purple-deep text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition self-start"
                >
                  <Plus size={14} />
                  <span>Add New Service</span>
                </button>
              </div>

              {/* Service Form for Adding or Editing */}
              {(isAddingService || editingServiceId) && (
                <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-200/50 mb-8 space-y-4">
                  <h3 className="font-bold text-purple-deep text-sm flex items-center gap-1">
                    <Sparkles size={16} className="text-gold" />
                    <span>{isAddingService ? "Define New Service" : "Modify Existing Service"}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Service Name</label>
                      <input
                        type="text"
                        className="w-full bg-white border border-purple-200 rounded-xl p-2.5 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-purple-deep"
                        value={serviceForm.name || ""}
                        onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })}
                        placeholder="e.g. Sofa Steam Scrubbing"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                      <select
                        className="w-full bg-white border border-purple-200 rounded-xl p-2.5 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-purple-deep"
                        value={serviceForm.category || "cleaning"}
                        onChange={e => setServiceForm({ ...serviceForm, category: e.target.value as any })}
                      >
                        <option value="laundry">Laundry Services</option>
                        <option value="cleaning">House &amp; Rug Cleaning</option>
                        <option value="other">Specialty &amp; Errands</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Featured on Home</label>
                      <select
                        className="w-full bg-white border border-purple-200 rounded-xl p-2.5 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-purple-deep"
                        value={serviceForm.isFeatured ? "yes" : "no"}
                        onChange={e => setServiceForm({ ...serviceForm, isFeatured: e.target.value === "yes" })}
                      >
                        <option value="no">Display in All List</option>
                        <option value="yes">Feature prominently in Top Bento</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Pricing Logic</label>
                      <select
                        className="w-full bg-white border border-purple-200 rounded-xl p-2.5 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-purple-deep"
                        value={serviceForm.priceType || "fixed"}
                        onChange={e => setServiceForm({ ...serviceForm, priceType: e.target.value as any })}
                      >
                        <option value="fixed">Fixed Price</option>
                        <option value="starting">Starting From</option>
                        <option value="variable">Variables (Quoted / Call)</option>
                        <option value="per_sq_meter">Per Square Meter</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Amount (KES)</label>
                      <input
                        type="number"
                        className="w-full bg-white border border-purple-200 rounded-xl p-2.5 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-purple-deep font-mono"
                        value={serviceForm.price || 0}
                        onChange={e => setServiceForm({ ...serviceForm, price: parseInt(e.target.value) || 0 })}
                        placeholder="e.g. 500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Unit Label</label>
                      <input
                        type="text"
                        className="w-full bg-white border border-purple-200 rounded-xl p-2.5 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-purple-deep"
                        value={serviceForm.priceUnit || ""}
                        onChange={e => setServiceForm({ ...serviceForm, priceUnit: e.target.value })}
                        placeholder="e.g. small basket, sq. meter, session"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Short Description</label>
                    <textarea
                      rows={2}
                      className="w-full bg-white border border-purple-200 rounded-xl p-2.5 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-purple-deep"
                      value={serviceForm.description || ""}
                      onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })}
                      placeholder="Write brief description of what this service covers..."
                    />
                  </div>

                  <div className="flex items-center gap-3 justify-end pt-2">
                    <button
                      onClick={() => {
                        setIsAddingService(false);
                        setEditingServiceId(null);
                        setServiceForm({});
                      }}
                      className="text-xs font-bold text-purple-mid bg-white border border-purple-200 hover:bg-purple-100/30 px-4 py-2.5 rounded-xl cursor-pointer transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={isAddingService ? handleAddService : handleSaveServiceEdit}
                      className="text-xs font-bold text-white bg-purple-mid hover:bg-purple-deep px-5 py-2.5 rounded-xl cursor-pointer transition flex items-center gap-1 shadow-md"
                    >
                      <Save size={13} />
                      <span>Save Service</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Grid of existing services */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map(service => (
                  <div
                    key={service.id}
                    className={`p-5 rounded-2xl border transition ${
                      editingServiceId === service.id 
                        ? "border-purple-500 bg-purple-50/20" 
                        : "border-gray-100 bg-gray-50/50 hover:border-purple-200 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-deep text-white flex items-center justify-center font-bold text-base">
                          ✨
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif font-bold text-purple-deep text-base">{service.name}</h4>
                            {service.isFeatured && (
                              <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                Featured
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 capitalize">{service.category} Category</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEditService(service)}
                          className="text-purple-mid hover:text-purple-deep hover:bg-purple-100/50 p-2 rounded-lg transition cursor-pointer"
                          title="Edit Service"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition cursor-pointer"
                          title="Delete Service"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-3 leading-relaxed border-b border-gray-100 pb-3">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between gap-4 mt-3 pt-1">
                      <span className="text-xs text-gray-400">Pricing structure:</span>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 block tracking-wider uppercase font-bold">
                          {service.priceType === "per_sq_meter" ? "Per Sqm" : service.priceType}
                        </span>
                        <span className="font-serif text-lg font-black text-purple-deep">
                          KSh {service.price}
                        </span>
                        <span className="text-xs text-gray-500"> / {service.priceUnit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. REVIEWS MODERATION */}
        {activeTab === "reviews" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
            <div className="border-b border-gray-100 pb-4 mb-6">
              <h2 className="font-serif text-xl font-bold text-purple-deep">Customer Feedback Moderation</h2>
              <p className="text-xs text-gray-400 mt-0.5">Toggle visibility of user comments to display them live on your home page.</p>
            </div>

            <div className="space-y-4">
              {reviews.map(review => (
                <div
                  key={review.id}
                  className={`p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                    review.approved ? "border-green-100 bg-green-50/10" : "border-gray-100 bg-gray-50/50 opacity-70"
                  }`}
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-bold text-purple-deep text-sm">{review.reviewerName}</span>
                      <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {review.serviceName}
                      </span>
                      <div className="text-amber-400 flex text-xs">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 italic leading-relaxed">
                      &quot;{review.reviewText}&quot;
                    </p>
                    <span className="text-[10px] text-gray-400 block">
                      Posted on: {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleToggleReviewApprove(review.id)}
                      className={`text-xs font-bold px-4 py-2 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
                        review.approved 
                          ? "bg-green-100 hover:bg-green-200 text-green-800 border-green-200" 
                          : "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-200"
                      }`}
                    >
                      {review.approved ? <Check size={13} /> : <Eye size={13} />}
                      <span>{review.approved ? "Visible" : "Approve & Show"}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2.5 rounded-xl border border-transparent hover:border-red-100 transition cursor-pointer"
                      title="Delete Review"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. LEADS */}
        {activeTab === "leads" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
            <div className="border-b border-gray-100 pb-4 mb-6">
              <h2 className="font-serif text-xl font-bold text-purple-deep">Captured Local Leads</h2>
              <p className="text-xs text-gray-400 mt-0.5">Prospects who claimed the 10% OFF discount code or free consult.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="p-4 pl-6">Prospect Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">WhatsApp / Mobile</th>
                    <th className="p-4">Claimed Incentive</th>
                    <th className="p-4 pr-6 text-right">Registered On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-purple-50/10 transition">
                      <td className="p-4 pl-6 font-bold text-purple-deep">{lead.name}</td>
                      <td className="p-4 font-mono text-xs">{lead.email}</td>
                      <td className="p-4">{lead.phone}</td>
                      <td className="p-4">
                        <span className="bg-pink-soft text-pink font-bold text-xs px-2.5 py-1 rounded-full border border-pink/10">
                          {lead.incentiveClaimed}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right text-xs text-gray-400">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. BRAND SETTINGS */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-purple-deep">Business Configuration Settings</h2>
                <p className="text-xs text-gray-400 mt-0.5">Changes made here automatically update throughout the live consumer page.</p>
              </div>
              <button
                type="submit"
                className="bg-purple-mid hover:bg-purple-deep text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
              >
                Save All Changes
              </button>
            </div>

            {settingsSaved && (
              <div className="bg-green-50 text-green-800 border border-green-200 rounded-2xl p-4 text-xs font-semibold flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                <span>Brand settings successfully updated and saved in local storage! Refresh to see final results.</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Brand Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-purple-200 rounded-xl p-3 text-sm mt-1 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-deep"
                  value={settingsForm.brandName}
                  onChange={e => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">WhatsApp Primary Number (for messages)</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    +
                  </span>
                  <input
                    type="text"
                    className="w-full bg-gray-50 border border-purple-200 rounded-xl p-3 pl-6 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-deep font-mono"
                    value={settingsForm.whatsappNumber}
                    onChange={e => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    placeholder="254743137081"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Primary Tagline / Mission Message</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-purple-200 rounded-xl p-3 text-sm mt-1 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-deep"
                value={settingsForm.tagline}
                onChange={e => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Nanyuki District / Service Location</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-purple-200 rounded-xl p-3 text-sm mt-1 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-deep"
                  value={settingsForm.locationText}
                  onChange={e => setSettingsForm({ ...settingsForm, locationText: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Founder / Owner Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-purple-200 rounded-xl p-3 text-sm mt-1 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-deep"
                  value={settingsForm.ownerName}
                  onChange={e => setSettingsForm({ ...settingsForm, ownerName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">About Mary — Main Description Bio</label>
              <textarea
                rows={3}
                className="w-full bg-gray-50 border border-purple-200 rounded-xl p-3 text-sm mt-1 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-deep"
                value={settingsForm.aboutText}
                onChange={e => setSettingsForm({ ...settingsForm, aboutText: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                <span>Mary's Unshakable Purpose Message (from Facebook post)</span>
                <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase">Cycles Breaker</span>
              </label>
              <textarea
                rows={3}
                className="w-full bg-gray-50 border border-purple-200 rounded-xl p-3 text-sm mt-1 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-deep font-serif italic text-purple-950"
                value={settingsForm.aboutQuote}
                onChange={e => setSettingsForm({ ...settingsForm, aboutQuote: e.target.value })}
              />
              <p className="text-[10px] text-gray-400 mt-1">
                * This represents Mary Anthony's poignant story about carrying purpose instead of weight, single motherhood, and the unyielding promise to secure financial freedom.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Incentive Box Title</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-purple-200 rounded-xl p-3 text-sm mt-1 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-deep"
                  value={settingsForm.incentiveTitle}
                  onChange={e => setSettingsForm({ ...settingsForm, incentiveTitle: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Incentive Box Description</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-purple-200 rounded-xl p-3 text-sm mt-1 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-deep"
                  value={settingsForm.incentiveDescription}
                  onChange={e => setSettingsForm({ ...settingsForm, incentiveDescription: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Custom Booking Contract / Terms of Service (TOS)</label>
              <textarea
                rows={4}
                className="w-full bg-gray-50 border border-purple-200 rounded-xl p-3 text-sm mt-1 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-deep font-mono text-xs"
                value={settingsForm.contractTerms}
                onChange={e => setSettingsForm({ ...settingsForm, contractTerms: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="submit"
                className="bg-purple-deep hover:bg-purple-mid text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition cursor-pointer"
              >
                Save All Changes
              </button>
            </div>
          </form>
        )}

        {/* 6. TEMPLATE EXPORT HUB */}
        {activeTab === "export" && (
          <TemplateExporter
            settings={settings}
            services={services}
            reviews={reviews}
          />
        )}
      </div>
    </div>
  );
}
