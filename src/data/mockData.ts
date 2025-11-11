export interface Editor {
  id: string; // This will be the profile_id from Supabase
  name: string;
  avatar: string;
  workload: number; // Number of active projects
}

export interface Manager {
  id: string; // This will be the profile_id from Supabase
  name: string;
  avatar: string;
  clientLoad: number; // Number of clients managed
}

export interface Video {
  id: string;
  client_id: string; // Foreign key to profiles table (client role)
  assigned_editor_id?: string; // Foreign key to profiles table (editor role)
  title: string;
  description?: string;
  raw_files_link?: string;
  instructions_link?: string;
  current_status: string; // 'Requested', 'Scripting', 'Editing', 'Review', 'Need Changes', 'Approved', 'Completed'
  credits_cost: number;
  priority: string; // 'Low', 'Medium', 'High', 'Urgent'
  submission_timestamp: string; // ISO string
  initial_deadline_timestamp: string; // ISO string
  adjusted_deadline_timestamp: string; // ISO string
  delivery_timestamp?: string; // ISO string, set when project is approved/completed
  draft_link?: string;
  final_delivery_link?: string;
  thumbnailUrl?: string; // For display purposes, might not be in DB directly
  notes: string[]; // Client-facing notes
  internalNotes?: string[]; // Internal team notes
  satisfactionRating?: number; // 1-5 rating from client
  projectType?: string; // e.g., "Ad", "Explainer", "Social Media"
}

export interface Client { // This now represents a profile with a 'client' role
  id: string; // This will be the auth.users.id
  name: string; // Combined first_name and last_name
  contact_email?: string; // From profiles.email
  contact_phone?: string; // From profiles.contact_phone
  monthly_credits: number; // From profiles.monthly_credits
  credits_remaining: number; // From profiles.credits_remaining
  status: "Active" | "On Hold" | "Archived"; // From profiles.status
  assigned_manager_id?: string; // Foreign key to profiles table (manager role)
  joinDate?: string; // Date client joined
  lastActive?: string; // Last date client had an active project/interaction
  satisfactionRatings?: { month: string; rating: number }[]; // Monthly satisfaction ratings (might be fetched from another table or computed)
  activeProjects?: number; // Computed property
  unassignedTasks?: number; // Computed property
}

// We will no longer use mockClients, mockEditors, or mockManagers directly, but fetch from Supabase profiles table
// The structure of mockClients is kept for type compatibility in components that still expect it,
// but the data itself will come from Supabase.
export const mockClients: Client[] = []; // Empty array as data will be fetched