export type VendorStatus = 'new' | 'reviewing' | 'approved' | 'rejected';

export interface WaitlistLead {
  id: string;
  name: string | null;
  contact: string;
  platform: string | null;
  role: string | null;
  referral_code: string | null;
  created_at: string;
}

export interface VendorApplication {
  id: string;
  boutique_name: string;
  owner_name: string;
  whatsapp: string;
  location: string | null;
  category: string | null;
  social_handle: string | null;
  stock_size: string | null;
  status: VendorStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerSurvey {
  id: string;
  contact: string | null;
  shopping_habits: string[];
  current_painpoints?: string[];
  online_frustration: string | null;
  style_categories: string[];
  try_on_excitement: string | null;
  ve_excitement?: string | null;
  delivery_area: string | null;
  recommended_vendor?: string | null;
  created_at: string;
}

export interface VendorOperationsSurvey {
  id: string;
  boutique_name: string | null;
  whatsapp: string | null;
  inventory_tracking: string | null;
  double_selling_frequency: string | null;
  delivery_method?: string | null;
  shrinkage_issue?: string | null;
  photography_method?: string | null;
  top_tool_desired: string | null;
  created_at: string;
}

export interface JournalPost {
  id: string;
  title: string;
  slug: string;
  body: string;
  excerpt: string | null;
  author: string | null;
  cover_image_url: string | null;
  category: string | null;
  read_time_minutes: number;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminDashboardStats {
  totalWaitlist: number;
  totalVendorApplications: number;
  pendingVendorApplications: number;
  totalCustomerSurveys: number;
  totalVendorSurveys: number;
  totalJournalPosts: number;
  publishedJournalPosts: number;
  recentLeads: WaitlistLead[];
  recentVendors: VendorApplication[];
}

export interface SurveyAnalyticsData {
  shoppingHabits: { name: string; count: number }[];
  styleCategories: { name: string; count: number }[];
  deliveryAreas: { name: string; count: number }[];
  onlineFrustrations: { name: string; count: number }[];
  tryOnExcitement: { name: string; count: number }[];
  totalResponses: number;
  vendorOperations?: {
    inventoryTracking: { name: string; count: number }[];
    doubleSelling: { name: string; count: number }[];
    deliveryMethods: { name: string; count: number }[];
    topTools: { name: string; count: number }[];
    totalResponses: number;
  };
}
