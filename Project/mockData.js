// High-fidelity mock data and event templates for SaaS Analytics Dashboard

const MOCK_USERS = [
  {
    id: "usr-1",
    name: "Sarah Jenkins",
    email: "sarah.j@analytics.io",
    role: "Admin",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80"
  },
  {
    id: "usr-2",
    name: "Alex Rivera",
    email: "alex.r@analytics.io",
    role: "Editor",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
  },
  {
    id: "usr-3",
    name: "Emily Chen",
    email: "emily.c@analytics.io",
    role: "Viewer",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80"
  },
  {
    id: "usr-4",
    name: "Marcus Vance",
    email: "marcus.v@analytics.io",
    role: "Editor",
    status: "Inactive",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
  },
  {
    id: "usr-5",
    name: "Leila Patel",
    email: "leila.p@analytics.io",
    role: "Viewer",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
  },
  {
    id: "usr-6",
    name: "David Kross",
    email: "david.k@analytics.io",
    role: "Admin",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&h=120&q=80"
  },
  {
    id: "usr-7",
    name: "Sophia Martinez",
    email: "sophia.m@analytics.io",
    role: "Editor",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80"
  },
  {
    id: "usr-8",
    name: "Michael Chang",
    email: "michael.c@analytics.io",
    role: "Viewer",
    status: "Inactive",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80"
  }
];

const ANALYTICS_HISTORY = {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  revenue: [45.2, 52.8, 61.5, 58.9, 70.4, 85.1, 92.6, 105.3, 98.7, 115.4, 128.9, 142.5], // in thousands USD
  acquisition: [210, 240, 290, 270, 310, 380, 410, 460, 420, 510, 570, 620] // new customers signed up
};

const TRAFFIC_BREAKDOWN = {
  labels: ["Direct", "Organic Search", "Referral", "Social"],
  data: [35, 40, 15, 10],
  colors: [
    "#6366f1", // Electric Indigo
    "#06b6d4", // Cyan
    "#10b981", // Emerald Green
    "#f59e0b"  // Amber
  ]
};

const MOCK_NAMES = ["Oliver", "Emma", "Liam", "Ava", "Noah", "Sophia", "Jackson", "Isabella", "Lucas", "Mia"];
const MOCK_SURNAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
const MOCK_IPS = ["192.168.1.45", "10.0.0.12", "172.16.254.1", "192.168.0.101"];

const EVENT_TEMPLATES = [
  {
    type: "purchase",
    icon: "shopping-cart",
    color: "#10b981", // emerald
    message: () => {
      const name = MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)];
      const plan = Math.random() > 0.4 ? "Pro Plan" : "Enterprise Plan";
      const price = plan === "Pro Plan" ? "49" : "199";
      return `New subscription purchased by <strong>${name}</strong> (${plan} - $${price}/mo)`;
    }
  },
  {
    type: "latency",
    icon: "activity",
    color: "#f59e0b", // amber
    message: () => {
      const ms = Math.floor(Math.random() * 80) + 40; // 40-120ms
      return `Server latency peaked at <span class="metric-alert text-amber">${ms}ms</span> (Region: US-East)`;
    }
  },
  {
    type: "database",
    icon: "database",
    color: "#06b6d4", // cyan
    message: () => "Database backup completed successfully (Size: 4.82 GB, Duration: 12s)"
  },
  {
    type: "user_signup",
    icon: "user-plus",
    color: "#6366f1", // indigo
    message: () => {
      const name = `${MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)]} ${MOCK_SURNAMES[Math.floor(Math.random() * MOCK_SURNAMES.length)]}`;
      return `New user <strong>${name}</strong> registered an account`;
    }
  },
  {
    type: "security_alert",
    icon: "shield-alert",
    color: "#ef4444", // red
    message: () => {
      const ip = MOCK_IPS[Math.floor(Math.random() * MOCK_IPS.length)];
      return `Rate limit warning: Multiple invalid API requests from IP <code class="ip-code">${ip}</code>`;
    }
  },
  {
    type: "pipeline",
    icon: "git-branch",
    color: "#10b981", // emerald
    message: () => {
      const build = Math.floor(Math.random() * 800) + 100;
      return `Deploy pipeline <strong>#${build}</strong> completed successfully in production`;
    }
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    text: "System latency warning resolved (US-East-1)",
    time: "2 mins ago",
    unread: true,
    type: "success"
  },
  {
    id: "notif-2",
    text: "New Administrator role assigned to David Kross",
    time: "15 mins ago",
    unread: true,
    type: "info"
  },
  {
    id: "notif-3",
    text: "Failed login attempt from IP 185.220.101.5",
    time: "1 hour ago",
    unread: false,
    type: "warning"
  }
];

// Export to window object for access in standard scripts
window.DashboardData = {
  users: MOCK_USERS,
  analyticsHistory: ANALYTICS_HISTORY,
  trafficBreakdown: TRAFFIC_BREAKDOWN,
  eventTemplates: EVENT_TEMPLATES,
  initialNotifications: INITIAL_NOTIFICATIONS
};
