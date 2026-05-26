// Core Dashboard Controller and State Management

// Helper for initials
function getInitials(name) {
  if (!name) return "US";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name[0].toUpperCase();
}

// Fallback avatar generator registered globally for offline support
window.replaceWithFallbackAvatar = function(imgElement, name, role = 'Viewer') {
  const initials = getInitials(name);
  const fallbackDiv = document.createElement("div");
  fallbackDiv.className = "avatar-fallback";
  fallbackDiv.innerText = initials;
  
  // Set gradient color schemes depending on roles
  let gradient = "linear-gradient(135deg, #71717a, #a1a1aa)"; // Viewer (Slate Gray)
  if (role === "Admin") {
    gradient = "linear-gradient(135deg, #6366f1, #8b5cf6)"; // Admin (Indigo Purple)
  } else if (role === "Editor") {
    gradient = "linear-gradient(135deg, #06b6d4, #10b981)"; // Editor (Cyan Emerald)
  }
  fallbackDiv.style.background = gradient;
  
  // Inherit dimensions/sizing
  if (imgElement.classList.contains("profile-menu-avatar") || imgElement.parentElement.classList.contains("user-snippet")) {
    fallbackDiv.style.width = "36px";
    fallbackDiv.style.height = "36px";
    fallbackDiv.style.fontSize = "0.75rem";
  }
  
  imgElement.replaceWith(fallbackDiv);
};

document.addEventListener("DOMContentLoaded", () => {
  // ----------------------------------------------------
  // STATE MANAGEMENT
  // ----------------------------------------------------
  let users = [...window.DashboardData.users];
  let notifications = [...window.DashboardData.initialNotifications];
  
  // KPI Metrics State
  let currentRevenue = 142.5; // in thousands ($142.5k)
  let currentAcquisitions = 4812;
  let currentLatency = 48; // ms
  
  // Cache DOM Elements
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const toggleIcon = document.getElementById("toggle-icon");
  const mobileToggle = document.getElementById("mobile-toggle");
  
  const searchInput = document.getElementById("member-search-bar");
  const roleFilter = document.getElementById("role-filter-select");
  const membersTableBody = document.getElementById("members-table-body");
  const tableEmptyState = document.getElementById("table-empty");
  
  const notifBellBtn = document.getElementById("notif-bell-btn");
  const notifBadgeDot = document.getElementById("notif-badge-dot");
  const notifDropdown = document.getElementById("notification-dropdown");
  const notifListContainer = document.getElementById("notifications-list-container");
  const markAllReadBtn = document.getElementById("mark-all-read-btn");
  
  const profileTrigger = document.getElementById("profile-trigger");
  const profileDropdown = document.getElementById("profile-dropdown-menu");
  
  const feedItemsList = document.getElementById("feed-items-list");
  const globalSearchBar = document.getElementById("global-search-bar");
  
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const themeToggleIcon = document.getElementById("theme-toggle-icon");

  // ----------------------------------------------------
  // INITIALIZATION
  // ----------------------------------------------------
  const savedTheme = localStorage.getItem("theme");
  const isInitiallyLight = savedTheme === "light";
  
  if (isInitiallyLight) {
    document.body.classList.add("light-mode");
    themeToggleIcon.setAttribute("data-lucide", "moon");
  }

  window.DashboardCharts.init();
  if (isInitiallyLight) {
    window.DashboardCharts.updateTheme(true);
  }

  renderMembersTable();
  renderNotifications();
  generateInitialFeedItems();
  updateBadgeState();
  
  // Create and append backdrop element dynamically for mobile navigation
  const backdrop = document.createElement("div");
  backdrop.className = "sidebar-backdrop";
  document.body.appendChild(backdrop);

  // Trigger Lucide SVG replacements
  lucide.createIcons();

  // ----------------------------------------------------
  // INTERACTIVE FEED SIMULATOR (Live WebSocket/Stream simulation)
  // ----------------------------------------------------
  // Periodically appends realistic events and flows data back into components
  setInterval(() => {
    generateRandomEvent();
  }, 4500);

  function generateInitialFeedItems() {
    // Populate feed widget with 5 pre-existing logs
    for (let i = 0; i < 5; i++) {
      const template = window.DashboardData.eventTemplates[i % window.DashboardData.eventTemplates.length];
      const timeString = `${(i + 1) * 3} mins ago`;
      createFeedItemNode(template, timeString, false);
    }
  }

  function createFeedItemNode(template, timeText, animate = true) {
    const item = document.createElement("div");
    item.className = "feed-item";
    if (!animate) {
      item.style.animation = "none";
    }
    
    const iconColor = template.color;
    const messageText = template.message();
    
    item.innerHTML = `
      <div class="feed-item-icon-wrapper" style="background-color: ${iconColor}20; color: ${iconColor};">
        <i data-lucide="${template.icon}"></i>
      </div>
      <div class="feed-item-body">
        <div class="feed-item-message">${messageText}</div>
        <span class="feed-item-time">${timeText}</span>
      </div>
    `;
    
    // Append to top of container
    feedItemsList.insertBefore(item, feedItemsList.firstChild);
    
    // Prune excessive scroll depth (max 15 logs)
    if (feedItemsList.children.length > 15) {
      feedItemsList.removeChild(feedItemsList.lastChild);
    }
    
    lucide.createIcons({
      attrs: {
        style: "width: 14px; height: 14px;"
      }
    });
  }

  function generateRandomEvent() {
    const templates = window.DashboardData.eventTemplates;
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    // Append feed visual log node
    createFeedItemNode(randomTemplate, "Just now", true);
    
    // Process side-effects (e.g. data pipelines, metrics adjustments)
    const rawMessage = randomTemplate.message();
    const cleanText = rawMessage.replace(/<\/?[^>]+(>|$)/g, ""); // strip HTML for simple notification text
    
    // Add to Top Notifications dropdown state
    const newNotif = {
      id: `notif-${Date.now()}`,
      text: cleanText,
      time: "Just now",
      unread: true,
      type: randomTemplate.type
    };
    notifications.unshift(newNotif);
    
    // Prune notifications stack
    if (notifications.length > 10) {
      notifications.pop();
    }
    
    renderNotifications();
    updateBadgeState();
    
    // Trigger metrics visual updates
    if (randomTemplate.type === "purchase") {
      // Determine simulated plan price
      const isEnterprise = cleanText.includes("Enterprise Plan");
      const addedRevenue = isEnterprise ? 0.199 : 0.049; // in thousands ($199 / $49)
      
      currentRevenue += addedRevenue;
      currentAcquisitions += 1;
      
      // Update stats numbers on card elements
      document.getElementById("stats-revenue").innerText = "$" + (currentRevenue * 1000).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
      document.getElementById("stats-acquisition").innerText = currentAcquisitions.toLocaleString();
      
      // Accumulate new metrics data into December (index 11) for Chart 1
      const histData = window.DashboardData.analyticsHistory;
      histData.revenue[11] += addedRevenue;
      histData.acquisition[11] += 1;
      
      // Call Chart instances updates dynamically without re-rendering everything
      window.DashboardCharts.updateLineData("revenue", histData.revenue[11]);
      window.DashboardCharts.updateLineData("acquisition", histData.acquisition[11]);
      
    } else if (randomTemplate.type === "latency") {
      // Extract latency ms using regex
      const match = cleanText.match(/(\d+)ms/);
      if (match && match[1]) {
        currentLatency = parseInt(match[1]);
        
        const latencyElement = document.getElementById("stats-latency");
        latencyElement.innerText = `${currentLatency}ms`;
        
        // Dynamically style stats color if latency rises
        if (currentLatency > 90) {
          latencyElement.style.color = "var(--color-amber)";
        } else {
          latencyElement.style.color = "var(--text-primary)";
        }
      }
    }
  }

  // ----------------------------------------------------
  // LAYOUT INTERACTION (Sidebar + Collapsible Panels)
  // ----------------------------------------------------
  
  // Collapse sidebar
  sidebarToggle.addEventListener("click", () => {
    if (window.innerWidth <= 868) {
      sidebar.classList.remove("show-mobile");
      backdrop.classList.remove("show");
    } else {
      sidebar.classList.toggle("collapsed");
      const isCollapsed = sidebar.classList.contains("collapsed");
      
      // Update Lucide Toggle icon direction
      if (isCollapsed) {
        toggleIcon.setAttribute("data-lucide", "chevron-right");
      } else {
        toggleIcon.setAttribute("data-lucide", "chevron-left");
      }
      lucide.createIcons();
    }
  });

  // Theme Toggle Action click handler
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const isLightMode = document.body.classList.contains("light-mode");
    
    // Persist preference
    localStorage.setItem("theme", isLightMode ? "light" : "dark");
    
    // Toggle Icon: If light mode, show moon icon. If dark mode, show sun.
    themeToggleIcon.setAttribute("data-lucide", isLightMode ? "moon" : "sun");
    lucide.createIcons();
    
    // Propagate theme update to canvas charts
    window.DashboardCharts.updateTheme(isLightMode);
  });

  // Mobile menu overlay toggle
  mobileToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.add("show-mobile");
    backdrop.classList.add("show");
  });

  backdrop.addEventListener("click", () => {
    sidebar.classList.remove("show-mobile");
    backdrop.classList.remove("show");
  });

  document.addEventListener("click", (e) => {
    if (sidebar.classList.contains("show-mobile") && !sidebar.contains(e.target) && e.target !== mobileToggle) {
      sidebar.classList.remove("show-mobile");
      backdrop.classList.remove("show");
    }
  });

  // Top bar navigation links highlight
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // ----------------------------------------------------
  // NOTIFICATION & PROFILE DROPDOWNS
  // ----------------------------------------------------
  
  notifBellBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    notifDropdown.classList.toggle("show");
    profileDropdown.classList.remove("show");
  });
  
  profileTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle("show");
    notifDropdown.classList.remove("show");
  });
  
  // Close open dropdown popups on click outside
  document.addEventListener("click", () => {
    notifDropdown.classList.remove("show");
    profileDropdown.classList.remove("show");
  });
  
  notifDropdown.addEventListener("click", (e) => e.stopPropagation());
  profileDropdown.addEventListener("click", (e) => e.stopPropagation());

  markAllReadBtn.addEventListener("click", () => {
    notifications.forEach(n => n.unread = false);
    renderNotifications();
    updateBadgeState();
  });

  function updateBadgeState() {
    const unreadCount = notifications.filter(n => n.unread).length;
    if (unreadCount > 0) {
      notifBadgeDot.style.display = "block";
    } else {
      notifBadgeDot.style.display = "none";
    }
  }

  function renderNotifications() {
    notifListContainer.innerHTML = "";
    
    if (notifications.length === 0) {
      notifListContainer.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.8rem;">
          No notifications available
        </div>
      `;
      return;
    }
    
    notifications.forEach(notif => {
      const itemNode = document.createElement("div");
      itemNode.className = `notif-item ${notif.unread ? 'unread' : ''}`;
      
      itemNode.innerHTML = `
        ${notif.unread ? '<div class="notif-item-dot"></div>' : '<div style="width: 6px; flex-shrink:0;"></div>'}
        <div class="notif-item-content">
          <div class="notif-item-text">${notif.text}</div>
          <span class="notif-item-time">${notif.time}</span>
        </div>
      `;
      
      // Click single notification marks it read
      itemNode.addEventListener("click", () => {
        notif.unread = false;
        renderNotifications();
        updateBadgeState();
      });
      
      notifListContainer.appendChild(itemNode);
    });
  }

  // ----------------------------------------------------
  // CHART SERIES TOGGLES
  // ----------------------------------------------------
  const togglePills = document.querySelectorAll(".chart-toggle-pill");
  togglePills.forEach(pill => {
    pill.addEventListener("click", () => {
      const targetSeries = pill.dataset.series;
      
      // Toggle CSS visual status
      pill.classList.toggle("active");
      
      // Trigger Chart dataset toggle
      window.DashboardCharts.toggleSeries(targetSeries);
    });
  });

  // ----------------------------------------------------
  // RBAC USER TABLE CONTROLLER
  // ----------------------------------------------------
  
  // Listeners for filters
  searchInput.addEventListener("input", renderMembersTable);
  roleFilter.addEventListener("change", renderMembersTable);
  
  // Global search filtering integration
  globalSearchBar.addEventListener("input", (e) => {
    const val = e.target.value;
    searchInput.value = val; // mirror input in user table search
    renderMembersTable();
  });

  function renderMembersTable() {
    const query = searchInput.value.toLowerCase().trim();
    const role = roleFilter.value;
    
    // Filter the items list
    const filteredUsers = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
      const matchesRole = role === "all" || user.role === role;
      return matchesSearch && matchesRole;
    });
    
    membersTableBody.innerHTML = "";
    
    if (filteredUsers.length === 0) {
      tableEmptyState.style.display = "flex";
      return;
    }
    
    tableEmptyState.style.display = "none";
    
    filteredUsers.forEach(user => {
      const tr = document.createElement("tr");
      tr.id = `user-row-${user.id}`;
      
      // Setup role class matching styling tags
      const roleClass = user.role.toLowerCase();
      
      // Build cells structure
      tr.innerHTML = `
        <td>
          <div class="user-cell">
            <img src="${user.avatar}" alt="${user.name}" onerror="window.replaceWithFallbackAvatar(this, '${user.name.replace(/'/g, "\\'")}', '${user.role}')">
            <div class="user-cell-info">
              <span class="user-cell-name">${user.name}</span>
              <span class="user-cell-email">${user.email}</span>
            </div>
          </div>
        </td>
        <td>
          <div class="role-select-wrapper">
            <select class="role-select ${roleClass}" data-user-id="${user.id}">
              <option value="Admin" ${user.role === 'Admin' ? 'selected' : ''}>Admin</option>
              <option value="Editor" ${user.role === 'Editor' ? 'selected' : ''}>Editor</option>
              <option value="Viewer" ${user.role === 'Viewer' ? 'selected' : ''}>Viewer</option>
            </select>
          </div>
        </td>
        <td>
          <div class="status-pill-toggle ${user.status.toLowerCase()}" data-user-id="${user.id}">
            <span class="status-indicator-dot"></span>
            <span>${user.status}</span>
          </div>
        </td>
        <td style="text-align: right;">
          <div class="action-btn-group" style="justify-content: flex-end;">
            <button class="action-icon-btn delete" data-user-id="${user.id}" title="Remove Member">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      `;
      
      // 1. Role Change Inline modifier
      const roleSelect = tr.querySelector(".role-select");
      roleSelect.addEventListener("change", (e) => {
        const newRole = e.target.value;
        const oldRole = user.role;
        user.role = newRole;
        
        // Visual class update
        roleSelect.className = `role-select ${newRole.toLowerCase()}`;
        
        // Push notification of the update
        pushAlertNotification(`Role privilege for ${user.name} updated from ${oldRole} to ${newRole}`);
      });
      
      // 2. Status toggle trigger
      const statusToggle = tr.querySelector(".status-pill-toggle");
      statusToggle.addEventListener("click", () => {
        const isCurrentActive = user.status === "Active";
        const newStatus = isCurrentActive ? "Inactive" : "Active";
        user.status = newStatus;
        
        // Update styling
        statusToggle.className = `status-pill-toggle ${newStatus.toLowerCase()}`;
        statusToggle.querySelector("span:not(.status-indicator-dot)").innerText = newStatus;
        
        pushAlertNotification(`Member status for ${user.name} set to ${newStatus}`);
      });
      
      // 3. User delete action
      const deleteBtn = tr.querySelector(".action-icon-btn.delete");
      deleteBtn.addEventListener("click", () => {
        // Trigger visual row slide/fade exit before state splice
        tr.style.opacity = "0";
        tr.style.transform = "translateX(-20px)";
        tr.style.transition = "all 0.3s ease";
        
        setTimeout(() => {
          users = users.filter(u => u.id !== user.id);
          renderMembersTable();
          pushAlertNotification(`Team member ${user.name} removed from workspace`);
        }, 300);
      });
      
      membersTableBody.appendChild(tr);
    });
    
    // Re-render Lucide icons on newly inserted rows elements
    lucide.createIcons({
      attrs: {
        style: "width: 15px; height: 15px;"
      }
    });
  }

  // Push immediate custom feedback messages into logs and notifications
  function pushAlertNotification(messageText) {
    const alertNotif = {
      id: `alert-${Date.now()}`,
      text: messageText,
      time: "Just now",
      unread: true,
      type: "info"
    };
    notifications.unshift(alertNotif);
    renderNotifications();
    updateBadgeState();
    
    // Add to Feed Stream
    const customFeedTemplate = {
      type: "user_mutation",
      icon: "user-cog",
      color: "#818cf8", // pale blue-indigo
      message: () => messageText
    };
    createFeedItemNode(customFeedTemplate, "Just now", true);
  }
});
