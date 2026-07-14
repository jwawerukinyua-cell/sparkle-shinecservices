/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Service {
  id: string;
  name: string;
  category: "laundry" | "cleaning" | "other";
  icon: string; // Lucide icon name
  priceType: "fixed" | "starting" | "variable" | "per_sq_meter";
  price: number;
  priceUnit: string; // e.g. "small basket", "per square meter", "house", "quoted"
  description: string;
  benefits: string[];
  isFeatured?: boolean;
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  location: string;
  notes?: string;
  status: "pending" | "approved" | "rescheduled" | "completed" | "cancelled";
  createdAt: string;
  agreedToTerms: boolean;
}

export interface Review {
  id: string;
  reviewerName: string;
  serviceName: string;
  rating: number; // 1 to 5
  reviewText: string;
  approved: boolean;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  incentiveClaimed: string; // e.g. "10% off laundry" or "Free consultation"
  createdAt: string;
}

export interface AppSettings {
  brandName: string;
  tagline: string;
  whatsappNumber: string; // e.g. "254743137081"
  locationText: string; // e.g. "Nanyuki Town & surroundings"
  aboutText: string;
  aboutQuote: string; // her Facebook message
  ownerName: string; // e.g. "Mary Anthony"
  contractTerms: string; // customized terms of service
  incentiveTitle: string; // "Free first delivery" or "10% Off"
  incentiveDescription: string;
  ownerImage?: string; // base64 or URL for the owner's profile picture
}
