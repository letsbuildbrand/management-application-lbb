export interface Editor {
  id: string;
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
  id: string;
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
  title: string;
  description: string;
  thumbnailUrl: string;
  currentStatus: string;
  updates: { timestamp: string; message: string; status: "pending" | "in-progress" | "completed" | "review" | "feedback" }[];
  notes: string[];
  assignedEditorId?: string;
  internalNotes?: string[];
  deliveryDate?: string; // Expected delivery date
  actualDeliveryDate?: string; // Actual delivery date
  satisfactionRating?: number; // 1-5 rating from client
  projectType?: string; // e.g., "Ad", "Explainer", "Social Media"
}

export interface Client {
  id: string;
  name: string;
  activeProjects: number;
  unassignedTasks: number;
  status: "Active" | "On Hold" | "Archived";
  videos: Video[];
  assignedManagerId?: string; // New: ID of the assigned manager
  username?: string; // For prototype client accounts
  password?: string; // For prototype client accounts
  joinDate: string; // Date client joined
  lastActive: string; // Last date client had an active project/interaction
  satisfactionRatings: { month: string; rating: number }[]; // Monthly satisfaction ratings
}

export const mockClients: Client[] = [
  {
    id: "client1",
    name: "Nexus Corp",
    activeProjects: 3,
    unassignedTasks: 1,
    status: "Active",
    assignedManagerId: "manager1",
    username: "nexus_user",
    password: "password123",
    joinDate: "2023-01-15",
    lastActive: "2024-10-25",
    satisfactionRatings: [
      { month: "Jul 24", rating: 4.5 },
      { month: "Aug 24", rating: 4.0 },
      { month: "Sep 24", rating: 4.8 },
      { month: "Oct 24", rating: 4.2 },
    ],
    videos: [
      {
        id: "v1",
        title: "Q3 Brand Campaign Ad",
        description: "Promotional video for the Q3 product launch.",
        thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOnXkN9U0vyMwqiACQTcSDpB98U8jnV1S8aq8UabdfPE-GMTWycc5-7aT_2uuYRyw1okkrq4qqsQP115HSLy-hpoVQi3cerRG7pL4Bl_p6Yh2mYZVhQgtuHzIvbkoP2dUXCRcqnAoSX5s48k_Bm1Bz5lM3SYjTGzhJ9bsbBiM-dY3Klfwa1Q1zG1byZeSlJ1-19wLXlJ7tymkeg5E80rlf4Uz_DQ1a_0Prkd2zipgBjOuHv2ICt87jSglu1VSxAvv499SLrq7pzHXv",
        currentStatus: "Requested",
        updates: [
          { timestamp: "2024-10-20 10:00 AM", message: "Video request submitted.", status: "pending" },
        ],
        notes: ["Please ensure the new logo is prominently featured."],
        internalNotes: ["New request, needs assignment."],
        deliveryDate: "2024-11-10",
        projectType: "Ad",
      },
      {
        id: "v2",
        title: "Product Launch Video",
        description: "An animated video explaining the features of the new product.",
        thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIu0iAYDEOt7Y6XnCxUMYQAmKK4YRVUOHZQmqyRdNWL9Or1jEqS8f3E-ClCdU9-2B1eKkGQtrnmvLhmDVsj1w4YlYAuz1cpFB0HENbGBDQ0g5fEpA1htERd989G0-12xg5yu8TGdfMB-nMl_sWXvOHVkokBZZanMLplppk8b5NBINz5lzx5TPPbykJZfC1Az42VOeiAAXZFOErB4rsARJX4yZ9UZUVkVxBABpJx8Xjt92TOJo4GRllUS_L7oZoVAIYyUyG6lJYstrM",
        currentStatus: "Editing",
        updates: [
          { timestamp: "2024-10-15 11:00 AM", message: "Video concept approved.", status: "completed" },
          { timestamp: "2024-10-16 01:00 PM", message: "Initial animation draft completed.", status: "in-progress" },
        ],
        notes: [],
        assignedEditorId: "editor2",
        internalNotes: ["Waiting for client assets."],
        deliveryDate: "2024-11-05",
        projectType: "Explainer",
      },
      {
        id: "v3",
        title: "Social Media Snippets",
        description: "Short videos for social media promotion.",
        thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQLYpvdAgFBgCiOcVMz0nJh1R9h9CcJNxbUjmIlagIAAI6nc6hTv1g6TTXceuaedf8v0YCVulbYTeff5FiifpfKioG5oYniwUBUm6XzJ-7aycTduSeV62nvTtOQklTo3TkQDdLF2_tmzfbawDL5u8WduugiKip3BXRBrGJgCRDVX4Z59layIh3GdOLt8OJCBwvv04bUBlbshSLtmgYOJwwxKt6adPp_OdVZskgNSV7j8AMy5iDvB-IMFopD_OPL4shGC02cE4Zu41p",
        currentStatus: "Awaiting Feedback",
        updates: [
          { timestamp: "2024-10-10 09:00 AM", message: "Project initiated.", status: "pending" },
          { timestamp: "2024-10-12 03:00 PM", message: "Draft sent for review.", status: "review" },
        ],
        notes: ["Looks good, just need to adjust the music volume in the intro."],
        assignedEditorId: "editor1",
        internalNotes: ["Follow up with client for feedback by EOD."],
        deliveryDate: "2024-10-28",
        projectType: "Social Media",
      },
    ],
  },
  {
    id: "client2",
    name: "Innovate Inc.",
    activeProjects: 2,
    unassignedTasks: 0,
    status: "Active",
    assignedManagerId: "manager1",
    username: "innovate_user",
    password: "password123",
    joinDate: "2023-03-01",
    lastActive: "2024-10-20",
    satisfactionRatings: [
      { month: "Jul 24", rating: 3.8 },
      { month: "Aug 24", rating: 4.2 },
      { month: "Sep 24", rating: 4.5 },
      { month: "Oct 24", rating: 4.0 },
    ],
    videos: [
      {
        id: "v4",
        title: "Company Overview",
        description: "A video introducing Innovate Inc. to new clients.",
        thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxmnYdQIObb4QKkEZsoehB_hG4KfblP2-u8XmVDmgyQQPd9XpFRcCGZSLAYMVIyuWkF7kzw6_jBM4KsjVFV9AoU6gbWt78A9hbmcQMMWNxLBQvGCX2NJf_4RSYwmSOMtIZow_3MfU3QJng_mAFw9h4utGDH7l07EL2Y_8vOqNxnUD5cFLdcY2ho3hCHtG-VbY284bKiSea6t8InHj0Nyrma76JB0wNTSsbyekKAF5WCS7wllj-mmPOpOTFHIrlE59TBLbJH7kt5Z6p",
        currentStatus: "Completed",
        updates: [
          { timestamp: "2024-09-20 09:00 AM", message: "Project started.", status: "pending" },
          { timestamp: "2024-09-25 02:00 PM", message: "All videos filmed.", status: "in-progress" },
          { timestamp: "2024-09-30 11:00 AM", message: "Final edits approved.", status: "completed" },
          { timestamp: "2024-10-01 10:00 AM", message: "Project delivered.", status: "completed" },
        ],
        notes: [],
        assignedEditorId: "editor3",
        internalNotes: ["Archived project."],
        deliveryDate: "2024-10-01",
        actualDeliveryDate: "2024-10-01",
        satisfactionRating: 5,
        projectType: "Overview",
      },
      {
        id: "v5",
        title: "Testimonial Compilation",
        description: "Compilation of client testimonials.",
        thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_s5y2ZtGyGGSskVMSsw_H6jcxMOQFEmR67ohyClIOqzEbZcXulmI25oBi5Kd_B7dRuFgbkoYUU-nyNi4QEVvVtXqiCizcRE-hT-344Y-HZ3N1jgTxzLcYWs-G6Y0fPl1u5DBNc-otBTdvZk9oW8NKe5ljJ2pI-HhEn65QkQpYJf2L7znT_soB4ksZ_gsC3PjFnn-kfkUuv2agH6IR5hyXp0VhcwukL45ORp3oUrNZZ1gkGx6GxNcwmGXMBWvCY-tEbSTKAsBZAeCB",
        currentStatus: "Editing",
        updates: [
          { timestamp: "2024-10-05 10:00 AM", message: "Footage collected.", status: "in-progress" },
          { timestamp: "2024-10-10 01:00 PM", message: "First cut complete.", status: "in-progress" },
        ],
        notes: ["Ensure smooth transitions between testimonials."],
        assignedEditorId: "editor1",
        internalNotes: ["Editor needs to focus on this next week."],
        deliveryDate: "2024-11-15",
        projectType: "Testimonial",
      },
    ],
  },
  {
    id: "client3",
    name: "Global Solutions",
    activeProjects: 1,
    unassignedTasks: 0,
    status: "On Hold",
    assignedManagerId: "manager2",
    username: "global_user",
    password: "password123",
    joinDate: "2022-11-01",
    lastActive: "2024-08-15",
    satisfactionRatings: [
      { month: "Jul 24", rating: 4.0 },
      { month: "Aug 24", rating: 3.5 },
    ],
    videos: [
      {
        id: "v6",
        title: "Company Culture Video",
        description: "Video showcasing the company culture.",
        thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQLYpvdAgFBgCiOcVMz0nJh1R9h9CcJNxbUjmIlagIAAI6nc6hTv1g6TTXceuaedf8v0YCVulbYTeff5FiifpfKioG5oYniwUBUm6XzJ-7aycTduSeV62nvTtOQklTo3TkQDdLF2_tmzfbawDL5u8WduugiKip3BXRBrGJgCRDVX4Z59layIh3GdOLt8OJCBwvv04bUBlbshSLtmgYOJwwxKt6adPp_OdVZskgNSV7j8AM5iDvB-IMFopD_OPL4shGC02cE4Zu41p",
        currentStatus: "Completed",
        updates: [
          { timestamp: "2024-08-01 09:00 AM", message: "Project started.", status: "pending" },
          { timestamp: "2024-08-15 02:00 PM", message: "Final delivery.", status: "completed" },
        ],
        notes: [],
        assignedEditorId: "editor2",
        internalNotes: ["Client paused new projects."],
        deliveryDate: "2024-08-15",
        actualDeliveryDate: "2024-08-15",
        satisfactionRating: 4,
        projectType: "Culture",
      },
    ],
  },
  {
    id: "client4",
    name: "QuantumLeap Solutions",
    activeProjects: 0,
    unassignedTasks: 0,
    status: "Archived",
    assignedManagerId: "manager3",
    username: "quantum_user",
    password: "password123",
    joinDate: "2022-05-10",
    lastActive: "2023-12-01",
    satisfactionRatings: [
      { month: "Nov 23", rating: 4.0 },
      { month: "Dec 23", rating: 4.5 },
    ],
    videos: [
      {
        id: "v7",
        title: "Year-End Review",
        description: "Summary video for the annual review.",
        thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQLYpvdAgFBgCiOcVMz0nJh1R9h9CcJNxbUjmIlagIAAI6nc6hTv1g6TTXceuaedf8v0YCVulbYTeff5FiifpfKioG5oYniwUBUm6XzJ-7aycTduSeV62nvTtOQklTo3TkQDdLF2_tmzfbawDL5u8WduugiKip3BXRBrGJgCRDVX4Z59layIh3GdOLt8OJCBwvv04bUBlbshSLtmgYOJwwxKt6adPp_OdVZskgNSV7j8AM5iDvB-IMFopD_OPL4shGC02cE4Zu41p",
        currentStatus: "Completed",
        updates: [
          { timestamp: "2023-11-01 09:00 AM", message: "Project started.", status: "pending" },
          { timestamp: "2023-12-01 02:00 PM", message: "Final delivery.", status: "completed" },
        ],
        notes: [],
        assignedEditorId: "editor4",
        internalNotes: ["Client moved to archived status."],
        deliveryDate: "2023-12-01",
        actualDeliveryDate: "2023-12-01",
        satisfactionRating: 4,
        projectType: "Review",
      },
    ],
  },
];