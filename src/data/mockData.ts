export interface Editor {
  id: string; // This will be the profile_id from Supabase
  name: string;
  avatar: string;
  workload: number; // Number of active projects
}

export const mockEditors: Editor[] = [
  { id: "editor1", name: "Alice Johnson", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Alice", workload: 2 },
  { id: "editor2", name: "Bob Smith", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Bob", workload: 1 },
  { id: "editor3", name: "Charlie Brown", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Charlie", workload: 3 },
  { id: "editor4", name: "Diana Prince", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Diana", workload: 0 },
];

export interface Manager {
  id: string; // This will be the profile_id from Supabase
  name: string;
  avatar: string;
  clientLoad: number; // Number of clients managed
}

export const mockManagers: Manager[] = [
  { id: "manager1", name: "John Doe", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=John", clientLoad: 2 },
  { id: "manager2", name: "Jane Smith", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Jane", clientLoad: 1 },
  { id: "manager3", name: "Peter Jones", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Peter", clientLoad: 0 },
];

export interface Video {
  id: string;
  client_id: string; // Foreign key to clients table
  assigned_editor_id?: string; // Foreign key to editors table (profile_id)
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

export interface Client {
  id: string;
  name: string;
  contact_email?: string;
  contact_phone?: string;
  monthly_credits: number;
  credits_remaining: number;
  status: "Active" | "On Hold" | "Archived";
  assigned_manager_id?: string; // Foreign key to managers table (profile_id)
  joinDate?: string; // Date client joined
  lastActive?: string; // Last date client had an active project/interaction
  satisfactionRatings?: { month: string; rating: number }[]; // Monthly satisfaction ratings
  // These fields will be handled by Supabase auth and profiles table
  // username?: string;
  // password?: string;
  // videos: Video[]; // Videos will be fetched separately
}

// We will no longer use mockClients directly, but fetch from Supabase
export const mockClients: Client[] = [
  {
    id: "client1",
    name: "Nexus Corp",
    monthly_credits: 10,
    credits_remaining: 7,
    status: "Active",
    assigned_manager_id: "manager1",
    joinDate: "2023-01-15",
    lastActive: "2024-10-25",
    satisfactionRatings: [
      { month: "Jul 24", rating: 4.5 },
      { month: "Aug 24", rating: 4.0 },
      { month: "Sep 24", rating: 4.8 },
      { month: "Oct 24", rating: 4.2 },
    ],
    // Videos will be fetched from the 'projects' table
  },
  {
    id: "client2",
    name: "Innovate Inc.",
    monthly_credits: 5,
    credits_remaining: 3,
    status: "Active",
    assigned_manager_id: "manager1",
    joinDate: "2023-03-01",
    lastActive: "2024-10-20",
    satisfactionRatings: [
      { month: "Jul 24", rating: 3.8 },
      { month: "Aug 24", rating: 4.2 },
      { month: "Sep 24", rating: 4.5 },
      { month: "Oct 24", rating: 4.0 },
    ],
  },
  {
    id: "client3",
    name: "Global Solutions",
    monthly_credits: 3,
    credits_remaining: 0,
    status: "On Hold",
    assigned_manager_id: "manager2",
    joinDate: "2022-11-01",
    lastActive: "2024-08-15",
    satisfactionRatings: [
      { month: "Jul 24", rating: 4.0 },
      { month: "Aug 24", rating: 3.5 },
    ],
  },
  {
    id: "client4",
    name: "QuantumLeap Solutions",
    monthly_credits: 0,
    credits_remaining: 0,
    status: "Archived",
    assigned_manager_id: "manager3",
    joinDate: "2022-05-10",
    lastActive: "2023-12-01",
    satisfactionRatings: [
      { month: "Nov 23", rating: 4.0 },
      { month: "Dec 23", rating: 4.5 },
    ],
  },
];