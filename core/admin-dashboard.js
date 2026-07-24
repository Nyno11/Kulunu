// =========================
// ADMIN DASHBOARD JAVASCRIPT
// =========================

// =========================
// DATA STORE (Using localStorage)
// =========================
const DataStore = {
  // Get all events
  getEvents() {
    const events = localStorage.getItem('kulunu_events');
    return events ? JSON.parse(events) : this.getDefaultEvents();
  },

  // Save events
  saveEvents(events) {
    localStorage.setItem('kulunu_events', JSON.stringify(events));
  },

  // Get all tickets
  getTickets() {
    const tickets = localStorage.getItem('kulunu_tickets');
    return tickets ? JSON.parse(tickets) : this.getDefaultTickets();
  },

  // Save tickets
  saveTickets(tickets) {
    localStorage.setItem('kulunu_tickets', JSON.stringify(tickets));
  },

  // Get all attendees
  getAttendees() {
    const attendees = localStorage.getItem('kulunu_attendees');
    return attendees ? JSON.parse(attendees) : this.getDefaultAttendees();
  },

  // Save attendees
  saveAttendees(attendees) {
    localStorage.setItem('kulunu_attendees', JSON.stringify(attendees));
  },

  // Get activities
  getActivities() {
    const activities = localStorage.getItem('kulunu_activities');
    return activities ? JSON.parse(activities) : this.getDefaultActivities();
  },

  // Save activity
  saveActivity(activity) {
    const activities = this.getActivities();
    activities.unshift(activity);
    if (activities.length > 50) activities.pop(); // Keep last 50
    localStorage.setItem('kulunu_activities', JSON.stringify(activities));
  },

  // Default events data
  getDefaultEvents() {
    return [
      {
        id: 'EVT-001',
        title: 'Lagos Tech Conference 2025',
        date: '2025-08-15',
        venue: 'Lagos International Centre',
        type: 'physical',
        status: 'upcoming',
        banner: 'assets/img/trend1.jpg',
        ticketsSold: 245,
        revenue: 1225000,
        createdAt: '2025-07-01'
      },

    ];
  },

  // Default tickets data
  getDefaultTickets() {
    return [
      { id: 'TKT-001', eventId: 'EVT-001', name: 'VIP Access', type: 'paid', price: 5000, quantity: 100, sold: 85, eventTitle: 'Lagos Tech Conference 2025' },
      { id: 'TKT-002', eventId: 'EVT-001', name: 'Regular', type: 'paid', price: 2500, quantity: 300, sold: 160, eventTitle: 'Lagos Tech Conference 2025' },
      { id: 'TKT-003', eventId: 'EVT-002', name: 'Premium', type: 'paid', price: 10000, quantity: 500, sold: 350, eventTitle: 'Abuja Music Festival' },
      { id: 'TKT-004', eventId: 'EVT-002', name: 'General Admission', type: 'paid', price: 3000, quantity: 2000, sold: 1500, eventTitle: 'Abuja Music Festival' },
      { id: 'TKT-005', eventId: 'EVT-002', name: 'Student', type: 'free', price: 0, quantity: 200, sold: 0, eventTitle: 'Abuja Music Festival' },
      { id: 'TKT-006', eventId: 'EVT-003', name: 'Early Bird', type: 'paid', price: 5000, quantity: 200, sold: 200, eventTitle: 'Virtual Business Summit' },
      { id: 'TKT-007', eventId: 'EVT-003', name: 'Standard', type: 'paid', price: 7500, quantity: 500, sold: 320, eventTitle: 'Virtual Business Summit' },
      { id: 'TKT-008', eventId: 'EVT-004', name: 'VIP', type: 'paid', price: 10000, quantity: 100, sold: 100, eventTitle: 'Comedy Night Live' },
      { id: 'TKT-009', eventId: 'EVT-004', name: 'Regular', type: 'paid', price: 5000, quantity: 700, sold: 700, eventTitle: 'Comedy Night Live' }
    ];
  },

  // Default attendees data
  getDefaultAttendees() {
    const attendees = [];
    const names = ['Chidinma Okafor', 'Emeka Nwosu', 'Fatima Abdullahi', 'Tunde Bakare', 'Ngozi Adeleke', 'Ibrahim Musa', 'Blessing Eze', 'Chukwuemeka Obi', 'Aisha Mohammed', 'Femi Johnson', 'Kemi Williams', 'Yusuf Ibrahim', 'Chioma Okonkwo', 'Daniel Achebe', 'Funmi Lawal'];
    const emails = ['chidinma@email.com', 'emeka@email.com', 'fatima@email.com', 'tunde@email.com', 'ngozi@email.com', 'ibrahim@email.com', 'blessing@email.com', 'chukwuemeka@email.com', 'aisha@email.com', 'femi@email.com', 'kemi@email.com', 'yusuf@email.com', 'chioma@email.com', 'daniel@email.com', 'funmi@email.com'];

    names.forEach((name, i) => {
      attendees.push({
        id: `ATT-${String(i + 1).padStart(3, '0')}`,
        name: name,
        email: emails[i],
        eventId: i < 5 ? 'EVT-001' : i < 10 ? 'EVT-002' : 'EVT-003',
        eventTitle: i < 5 ? 'Lagos Tech Conference 2025' : i < 10 ? 'Abuja Music Festival' : 'Virtual Business Summit',
        ticketType: i % 3 === 0 ? 'VIP' : 'Regular',
        purchaseDate: `2025-07-${String(10 + i).padStart(2, '0')}`,
        status: i % 4 === 0 ? 'checked-in' : i % 3 === 0 ? 'pending' : 'confirmed'
      });
    });

    return attendees;
  },

  // Default activities data
  getDefaultActivities() {
    return [
      { type: 'sale', text: '<strong>Chidinma Okafor</strong> purchased a VIP ticket for Lagos Tech Conference', time: '5 minutes ago' },
      { type: 'event', text: '<strong>Abuja Music Festival</strong> is now live!', time: '2 hours ago' },
      { type: 'sale', text: '<strong>Emeka Nwosu</strong> purchased 3 Regular tickets for Abuja Music Festival', time: '3 hours ago' },
      { type: 'attendee', text: '<strong>Fatima Abdullahi</strong> checked in at Abuja Music Festival', time: '5 hours ago' },
      { type: 'sale', text: '<strong>Tunde Bakare</strong> purchased an Early Bird ticket for Virtual Business Summit', time: '1 day ago' }
    ];
  },

  // Default notifications
  getDefaultNotifications() {
    return [
      { type: 'sale', text: 'New ticket sale: VIP for Lagos Tech Conference', time: '5 min ago', unread: true },
      { type: 'event', text: 'Abuja Music Festival starts in 2 days!', time: '1 hour ago', unread: true },
      { type: 'alert', text: 'Low ticket alert: Only 15 VIP tickets remaining', time: '3 hours ago', unread: true },
      { type: 'sale', text: '5 tickets sold in the last hour', time: '5 hours ago', unread: false },
      { type: 'event', text: 'Virtual Business Summit: 80% tickets sold', time: '1 day ago', unread: false }
    ];
  },

  // ── Ticket Tiers (pools per event) ──────────────────────────────────────────
  getTicketTiers(eventId) {
    const all = JSON.parse(localStorage.getItem('kulunu_ticket_tiers') || '[]');
    return eventId ? all.filter(t => t.eventId === String(eventId)) : all;
  },

  saveTicketTier(tier) {
    const all = JSON.parse(localStorage.getItem('kulunu_ticket_tiers') || '[]');
    const idx = all.findIndex(t => t.id === tier.id);
    if (idx >= 0) all[idx] = tier; else all.push(tier);
    localStorage.setItem('kulunu_ticket_tiers', JSON.stringify(all));
  },

  deleteTicketTier(tierId) {
    const all = JSON.parse(localStorage.getItem('kulunu_ticket_tiers') || '[]');
    localStorage.setItem('kulunu_ticket_tiers', JSON.stringify(all.filter(t => t.id !== tierId)));
  },

  // ── Sold Tickets (individual purchases) ─────────────────────────────────────
  getSoldTickets(eventId) {
    const all = JSON.parse(localStorage.getItem('kulunu_sold_tickets') || '[]');
    return eventId ? all.filter(t => t.eventId === String(eventId)) : all;
  },

  saveSoldTicket(ticket) {
    const all = JSON.parse(localStorage.getItem('kulunu_sold_tickets') || '[]');
    const idx = all.findIndex(t => t.id === ticket.id);
    if (idx >= 0) all[idx] = ticket; else all.push(ticket);
    localStorage.setItem('kulunu_sold_tickets', JSON.stringify(all));
  },

  updateSoldTicketStatus(ticketId, status) {
    const all = JSON.parse(localStorage.getItem('kulunu_sold_tickets') || '[]');
    const ticket = all.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = status;
      if (status === 'checked-in') ticket.checkedInAt = new Date().toISOString();
      localStorage.setItem('kulunu_sold_tickets', JSON.stringify(all));
    }
    return ticket;
  }
};

// =========================
// INITIALIZATION
// =========================
document.addEventListener('DOMContentLoaded', async () => {
  await initializeData();
  initializeSidebar();
  initializeCharts();
  renderDashboard();
  initializeEventFilters();
  initializeTicketFilters();
  initializeAttendeeFilters();
  initializeSettings();
  initializeSearch();
  initializeNotifications();

  // Pull fresh data from backend in the background then re-render with live numbers
  Promise.all([
    fetchSoldTicketsFromAPI(null),
    fetchAllTiersFromAPI(),
  ]).then(() => renderDashboard());
});

const EVENTS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Derive a display status from the DB event
function resolveEventStatus(dbStatus, dateStr) {
  if (dbStatus !== 'active') return dbStatus; // pass through draft, cancelled, etc.
  const today = new Date().toISOString().split('T')[0];
  if (!dateStr || dateStr > today) return 'upcoming';
  if (dateStr === today) return 'live';
  return 'completed';
}

// Fetch events from /admin/events — returns API data only, no dummy fallback
async function fetchAndMergeEvents() {
  const session = window._adminSession || {};
  if (!session.token) return [];

  try {
    const res = await fetch(`${BASE_URL}/admin/events`, {
      headers: { 'Authorization': `Bearer ${session.token}` }
    });

    const data = await res.json();

    if (!data.success || !Array.isArray(data.data)) {
      console.warn('Invalid API response for events:', data);
      return DataStore.getEvents(); // return whatever is cached
    }

    return data.data.map(e => ({
      id: String(e.id_event || e.id),
      title: e.title || '',
      date: e.date || '',
      venue: e.venue || '',
      type: e.type || 'physical',
      status: resolveEventStatus(e.status, e.date),
      banner: e.banner_url || 'assets/img/trend1.jpg',
      ticketsSold: e.tickets_sold || 0,
      revenue: e.revenue || 0,
      description: e.description || '',
      createdAt: e.created_at ? e.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    }));
  } catch (err) {
    console.error('Failed to fetch events from API:', err);
    return DataStore.getEvents(); // return whatever is cached
  }
}

// Wipe any previously cached dummy data so real backend data takes over
function clearDummyData() {
  const dummyEventIds = new Set(['EVT-001', 'EVT-002', 'EVT-003', 'EVT-004']);
  const events = JSON.parse(localStorage.getItem('kulunu_events') || '[]');
  const hadDummy    = events.some(e => dummyEventIds.has(e.id));
  const hadBadId    = events.some(e => !e.id || e.id === 'undefined');
  const missingStats = events.some(e => e.tickets_sold === undefined && e.ticketsSold === undefined);
  if (hadDummy || hadBadId || missingStats) {
    localStorage.removeItem('kulunu_events');
    localStorage.removeItem('kulunu_events_fetched_at');
    localStorage.removeItem('kulunu_tickets');
    localStorage.removeItem('kulunu_ticket_tiers');
    localStorage.removeItem('kulunu_sold_tickets');
    localStorage.removeItem('kulunu_attendees');
    localStorage.removeItem('kulunu_activities');
    localStorage.removeItem('kulunu_notifications');
  }
}

// Initialize data — always fetch fresh events from the backend; never seed dummy data
async function initializeData() {
  clearDummyData();

  const cachedAt = parseInt(localStorage.getItem('kulunu_events_fetched_at') || '0', 10);
  const cacheStale = Date.now() - cachedAt > EVENTS_CACHE_TTL;

  if (!localStorage.getItem('kulunu_events') || cacheStale) {
    const events = await fetchAndMergeEvents();
    DataStore.saveEvents(events);
    localStorage.setItem('kulunu_events_fetched_at', String(Date.now()));
  }

  // Never seed fake tickets or attendees — real data comes from the backend
  if (!localStorage.getItem('kulunu_tickets')) {
    DataStore.saveTickets([]);
  }
  if (!localStorage.getItem('kulunu_attendees')) {
    DataStore.saveAttendees([]);
  }
  if (!localStorage.getItem('kulunu_activities')) {
    localStorage.setItem('kulunu_activities', JSON.stringify([]));
  }
  if (!localStorage.getItem('kulunu_notifications')) {
    localStorage.setItem('kulunu_notifications', JSON.stringify([]));
  }
}

// =========================
// SIDEBAR NAVIGATION
// =========================
function initializeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarClose = document.getElementById('sidebarClose');
  const navItems = document.querySelectorAll('.nav-item');

  // Toggle sidebar on mobile
  sidebarToggle?.addEventListener('click', () => {
    sidebar.classList.add('open');
  });

  sidebarClose?.addEventListener('click', () => {
    sidebar.classList.remove('open');
  });

  // Navigation
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const section = item.dataset.section;
      switchSection(section);

      // Update active state
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // Close sidebar on mobile
      if (window.innerWidth <= 992) {
        sidebar.classList.remove('open');
      }
    });
  });
}

// Switch between sections
function switchSection(sectionId) {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    section.classList.remove('active');
  });

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Update nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.section === sectionId) {
      item.classList.add('active');
    }
  });

  // Re-render charts if analytics section
  if (sectionId === 'analytics') {
    setTimeout(() => initializeAnalyticsCharts(), 100);
  }
}

// =========================
// DASHBOARD RENDERING
// =========================
function renderDashboard() {
  const events   = DataStore.getEvents();
  const tickets  = DataStore.getTickets();
  const sold     = DataStore.getSoldTickets(); // source of truth from backend
  const attendees = DataStore.getAttendees();
  const activities = DataStore.getActivities();

  // Total sold — count individual purchase records (each row = 1 sale of qty)
  const totalSold    = sold.reduce((sum, s) => sum + (Number(s.quantity) || 1), 0);
  const totalRevenue = sold.reduce((sum, s) => sum + (Number(s.price) || 0) * (Number(s.quantity) || 1), 0);

  // Update stats
  document.getElementById('totalEvents').textContent    = events.length;
  document.getElementById('ticketsSold').textContent    = totalSold.toLocaleString();
  document.getElementById('totalRevenue').textContent   = '₦' + totalRevenue.toLocaleString();
  document.getElementById('totalAttendees').textContent = attendees.length.toLocaleString();

  // Update badges
  document.getElementById('eventCount').textContent  = events.length;
  document.getElementById('ticketCount').textContent = totalSold;

  // Render events
  renderEvents(events);

  // Render tickets
  renderTickets(tickets);

  // Render attendees
  renderAttendees(attendees);

  // Render activities
  renderActivities(activities);

  // Render upcoming events
  renderUpcomingEvents(events.filter(e => e.status === 'upcoming' || e.status === 'live').slice(0, 4));

  // Initialize charts
  initializeCharts();
}

// =========================
// EVENTS SECTION
// =========================
function renderEvents(events) {
  const grid = document.getElementById('eventsGrid');
  const emptyState = document.getElementById('eventsEmpty');

  if (events.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.remove('d-none');
    return;
  }

  emptyState.classList.add('d-none');

  grid.innerHTML = events.map(event => `
    <div class="event-card" data-id="${event.id}">
      <img src="${event.banner || 'assets/img/trend1.jpg'}" alt="${event.title}" class="event-card-image" onerror="this.src='https://via.placeholder.com/400x200?text=Event'">
      <div class="event-card-body">
        <span class="event-card-status ${event.status}">${event.status}</span>
        <h3 class="event-card-title">${event.title}</h3>
        <div class="event-card-details">
          <div class="event-card-detail">
            <i class="bi bi-calendar"></i>
            <span>${formatDate(event.date)}</span>
          </div>
          <div class="event-card-detail">
            <i class="bi bi-geo-alt"></i>
            <span>${event.venue}</span>
          </div>
          <div class="event-card-detail">
            <i class="bi bi-building"></i>
            <span>${event.type === 'physical' ? 'Physical' : 'Virtual'}</span>
          </div>
        </div>
        <div class="event-card-footer">
          <div class="event-card-sales">
            <strong>${event.ticketsSold}</strong> tickets sold
          </div>
          <div class="event-card-actions">
            <button class="btn-icon" onclick="viewEvent('${event.id}')" title="View">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn-icon" onclick="editEvent('${event.id}')" title="Edit">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn-icon" onclick="openManageTicketsModal('${event.id}')" title="Manage Tickets" style="color: var(--primary);">
              <i class="bi bi-ticket-perforated"></i>
            </button>
            <button class="btn-icon" onclick="deleteEvent('${event.id}')" title="Delete">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function initializeEventFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      const events = DataStore.getEvents();

      if (filter === 'all') {
        renderEvents(events);
      } else {
        renderEvents(events.filter(e => e.status === filter));
      }
    });
  });
}

function viewEvent(eventId) {
  const events = DataStore.getEvents();
  const event = events.find(e => e.id === eventId);

  if (event) {
    const modal = document.getElementById('eventDetailModal');
    document.getElementById('modalEventTitle').textContent = event.title;
    document.getElementById('modalEventBody').innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <img src="${event.banner || 'assets/img/trend1.jpg'}" alt="${event.title}" class="img-fluid rounded mb-3" onerror="this.src='https://via.placeholder.com/400x200?text=Event'">
        </div>
        <div class="col-md-6">
          <div class="mb-3">
            <label class="text-muted small">Status</label>
            <p><span class="badge ${event.status}">${event.status.toUpperCase()}</span></p>
          </div>
          <div class="mb-3">
            <label class="text-muted small">Date</label>
            <p>${formatDate(event.date)}</p>
          </div>
          <div class="mb-3">
            <label class="text-muted small">Venue</label>
            <p>${event.venue}</p>
          </div>
          <div class="mb-3">
            <label class="text-muted small">Type</label>
            <p>${event.type === 'physical' ? 'Physical Event' : 'Virtual Event'}</p>
          </div>
          <div class="mb-3">
            <label class="text-muted small">Tickets Sold</label>
            <p class="h4">${event.ticketsSold}</p>
          </div>
          <div class="mb-3">
            <label class="text-muted small">Revenue</label>
            <p class="h4 text-success">₦${event.revenue.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <h5>Ticket Types</h5>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Type</th>
                <th>Price</th>
                <th>Sold</th>
                <th>Available</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              ${DataStore.getTickets().filter(t => t.eventId === eventId).map(t => `
                <tr>
                  <td>${t.name}</td>
                  <td><span class="badge ${t.type === 'paid' ? 'bg-primary' : 'bg-success'}">${t.type}</span></td>
                  <td>₦${t.price.toLocaleString()}</td>
                  <td>${t.sold}</td>
                  <td>${t.quantity - t.sold}</td>
                  <td>₦${(t.price * t.sold).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    modal.classList.add('open');
  }
}

function editEvent(eventId) {
  const events = DataStore.getEvents();
  const event = events.find(e => e.id === eventId);

  if (!event) {
    showToast('Event not found', 'error');
    return;
  }

  // Open create event modal and populate with existing data
  openCreateEventModal();

  // Set minimum date to today
  const dateInput = document.getElementById('newEventDate');
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);

  // Populate form fields
  document.getElementById('newEventTitle').value = event.title;
  document.getElementById('newEventDate').value = event.date;
  document.getElementById('newEventVenue').value = event.venue;
  document.getElementById('newEventType').value = event.type;
  document.getElementById('newEventCategory').value = event.category || '';
  document.getElementById('newEventStatus').value = event.status;
  document.getElementById('newEventDescription').value = event.description || '';

  // Set banner - if it's a URL (not base64), use it
  if (event.banner && !event.banner.startsWith('data:')) {
    document.getElementById('newEventBanner').value = event.banner;
    switchBannerTab('url');
  } else {
    switchBannerTab('file');
    // Note: Can't pre-populate file upload, user would need to re-upload
  }

  // Change modal title and button
  document.querySelector('#createEventModal .modal-header h3').textContent = 'Edit Event';
  document.querySelector('#createEventModal button[type="submit"]').textContent = 'Save Changes';

  // Store the event ID for updating
  document.getElementById('createEventForm').dataset.editId = eventId;
}

function deleteEvent(eventId) {
  // Find the event
  const events = DataStore.getEvents();
  const event = events.find(e => e.id === eventId);

  if (!event) {
    showToast('Event not found', 'error');
    return;
  }

  // Confirmation popup
  const confirmDelete = confirm(
    `Are you sure you want to delete "${event.title}"?\n\nThis action cannot be undone.`
  );

  if (!confirmDelete) return;

  try {
    // Remove event from array
    const updatedEvents = events.filter(e => e.id !== eventId);

    // Save updated events
    localStorage.setItem('kulunu_events', JSON.stringify(updatedEvents));

    // Remove related tickets (optional but recommended)
    const tickets = DataStore.getTickets();
    const updatedTickets = tickets.filter(t => t.eventId !== eventId);
    localStorage.setItem('kulunu_tickets', JSON.stringify(updatedTickets));

    // Re-render events
    renderEvents(updatedEvents);

    // Update counts if available
    const eventCount = document.getElementById('eventCount');
    const totalEvents = document.getElementById('totalEvents');

    if (eventCount) {
      eventCount.textContent = updatedEvents.length;
    }

    if (totalEvents) {
      totalEvents.textContent = updatedEvents.length;
    }

    // Show empty state if no events remain
    const emptyState = document.getElementById('eventsEmpty');
    const grid = document.getElementById('eventsGrid');

    if (updatedEvents.length === 0) {
      grid.innerHTML = '';
      emptyState.classList.remove('d-none');
    }

    // Success message
    showToast('Event deleted successfully', 'success');

  } catch (error) {
    console.error('Delete Event Error:', error);
    showToast('Failed to delete event', 'error');
  }
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('open');
}

// =========================
// TICKET MANAGEMENT (ADMIN)
// =========================
let _currentManageEventId = null;
let _currentQRData = null;

async function openManageTicketsModal(eventId) {
  _currentManageEventId = String(eventId);
  const events = DataStore.getEvents();
  const event = events.find(e => e.id === _currentManageEventId);
  if (!event) return;

  document.getElementById('manageTicketsTitle').textContent = `Manage Tickets — ${event.title}`;
  document.getElementById('manageTicketsModal').classList.add('open');
  hideAddTierForm();
  switchTicketMgmtTab('tiers');

  // Try to pull latest tiers from API
  await fetchTiersFromAPI(_currentManageEventId);
  renderTiersList(_currentManageEventId);
}

async function fetchTiersFromAPI(eventId) {
  const session = window._adminSession || {};
  if (!session.token) return;
  try {
    const res = await fetch(`${BASE_URL}/admin/events/${eventId}/tickets`, {
      headers: { 'Authorization': `Bearer ${session.token}` }
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      const legacyTickets = DataStore.getTickets();

      data.data.forEach(t => {
        const tier = {
          id: String(t.id),
          eventId: String(eventId),
          eventTitle: t.event_title || '',
          name: t.name || t.tier_name || '',
          price: Number(t.price) || 0,
          totalQuantity: Number(t.quantity || t.total_quantity) || 0,
          sold: Number(t.sold || t.tickets_sold) || 0,
          description: t.description || '',
          forSale: t.for_sale !== undefined ? t.for_sale : true,
          createdAt: t.created_at ? t.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
        };
        DataStore.saveTicketTier(tier);

        // Keep the legacy kulunu_tickets store in sync so renderTickets shows live counts
        const legacyIdx = legacyTickets.findIndex(lt => lt.id === tier.id);
        const legacyEntry = {
          id: tier.id,
          eventId: tier.eventId,
          eventTitle: tier.eventTitle,
          name: tier.name,
          type: tier.price === 0 ? 'free' : 'paid',
          price: tier.price,
          quantity: tier.totalQuantity,
          sold: tier.sold,
        };
        if (legacyIdx >= 0) legacyTickets[legacyIdx] = legacyEntry;
        else legacyTickets.push(legacyEntry);
      });

      DataStore.saveTickets(legacyTickets);
    }
  } catch (err) {
    console.warn('Could not fetch tiers from API:', err);
  }
}

// Refresh tier sold/available counts for every event the admin owns
async function fetchAllTiersFromAPI() {
  const events = DataStore.getEvents();
  if (!events.length) return;
  await Promise.all(events.map(e => fetchTiersFromAPI(e.id)));
}

async function fetchSoldTicketsFromAPI(eventId) {
  const session = window._adminSession || {};
  if (!session.token) return;
  try {
    const url = eventId
      ? `${BASE_URL}/admin/events/${eventId}/sold-tickets`
      : `${BASE_URL}/admin/sold-tickets`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${session.token}` }
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      const mapped = data.data.map(t => ({
        id:          String(t.id),                  // DB row id — used for check-in API
        ticketCode:  t.ticket_code || String(t.id), // human-readable code shown in UI
        tierId:      String(t.tier_id || ''),
        eventId:     String(t.event_id || eventId || ''),
        eventTitle:  t.event_title || '',
        tierName:    t.tier_name  || t.name || '',
        price:       Number(t.tier_price || t.price) || 0,
        quantity:    Number(t.quantity) || 1,
        buyerName:   t.buyer_name  || '',
        buyerEmail:  t.buyer_email || '',
        buyerPhone:  t.buyer_phone || '',
        purchasedAt: t.purchased_at || t.created_at || new Date().toISOString(),
        status:      t.check_in_status ? 'checked-in' : 'active',
        qrData:      t.qr_data || `KULUNU-TICKET|${t.ticket_code}|${t.event_id}|${t.tier_name}|${t.buyer_email}`
      }));

      if (eventId) {
        // Upsert: merge with existing records for other events
        const all = JSON.parse(localStorage.getItem('kulunu_sold_tickets') || '[]');
        const others = all.filter(s => s.eventId !== String(eventId));
        localStorage.setItem('kulunu_sold_tickets', JSON.stringify([...others, ...mapped]));
      } else {
        // Full replace: backend is the source of truth for the global list
        localStorage.setItem('kulunu_sold_tickets', JSON.stringify(mapped));
      }
    }
  } catch (err) {
    console.warn('Could not fetch sold tickets from API:', err);
  }
}

function switchTicketMgmtTab(tab) {
  document.querySelectorAll('#manageTicketsModal .filter-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  document.getElementById('tiersTab').style.display = tab === 'tiers' ? 'block' : 'none';
  document.getElementById('soldTicketsTab').style.display = tab === 'sold' ? 'block' : 'none';

  if (tab === 'sold') {
    fetchSoldTicketsFromAPI(_currentManageEventId).then(() => {
      renderSoldTicketsList(_currentManageEventId);
    });
  }
}

function renderTiersList(eventId) {
  const tiers = DataStore.getTicketTiers(eventId);
  const container = document.getElementById('tiersList');

  if (tiers.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 40px 0; color: var(--text-muted);">
        <i class="bi bi-ticket-perforated" style="font-size: 48px; display: block; margin-bottom: 12px;"></i>
        <p style="margin: 0; font-size: 15px;">No ticket tiers yet. Add your first tier below.</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Tier Name</th>
            <th>Price</th>
            <th>Total</th>
            <th>Sold</th>
            <th>Available</th>
            <th>On Sale</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${tiers.map(tier => `
            <tr>
              <td>
                <div style="display:flex;align-items:center;gap:10px;">
                  <div class="avatar">${tier.name.charAt(0)}</div>
                  <div>
                    <strong>${tier.name}</strong>
                    ${tier.description ? `<br><small style="color:var(--text-muted);">${tier.description}</small>` : ''}
                  </div>
                </div>
              </td>
              <td>${tier.price === 0 ? '<span class="status-badge free">Free</span>' : '₦' + tier.price.toLocaleString()}</td>
              <td>${tier.totalQuantity.toLocaleString()}</td>
              <td>${tier.sold}</td>
              <td>${(tier.totalQuantity - tier.sold).toLocaleString()}</td>
              <td>
                <label class="toggle" style="margin:0;">
                  <input type="checkbox" ${tier.forSale ? 'checked' : ''} onchange="toggleTierSale('${tier.id}')">
                  <span class="toggle-slider"></span>
                </label>
              </td>
              <td>
                <div class="table-actions">
                  <button class="action-btn view" onclick="showTierQR('${tier.id}')">
                    <i class="bi bi-qr-code"></i> QR
                  </button>
                  <button class="action-btn" style="background:#FEE2E2;color:#991B1B;" onclick="deleteTier('${tier.id}')">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

function renderSoldTicketsList(eventId) {
  const soldTickets = DataStore.getSoldTickets(eventId);
  const container = document.getElementById('soldTicketsTab');

  if (soldTickets.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 40px 0; color: var(--text-muted);">
        <i class="bi bi-receipt" style="font-size: 48px; display: block; margin-bottom: 12px;"></i>
        <p style="margin: 0; font-size: 15px;">No tickets sold yet. Sold tickets appear here after user purchases.</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Ticket Code</th>
            <th>Buyer</th>
            <th>Tier</th>
            <th>Price</th>
            <th>Purchase Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${soldTickets.map(ticket => `
            <tr>
              <td><code style="font-size:12px;background:#F1F5F9;padding:2px 6px;border-radius:4px;">${ticket.ticketCode || ticket.id}</code></td>
              <td>
                <strong>${ticket.buyerName}</strong>
                <br><small style="color:var(--text-muted);">${ticket.buyerEmail}</small>
                ${ticket.buyerPhone ? `<br><small style="color:var(--text-muted);">${ticket.buyerPhone}</small>` : ''}
              </td>
              <td>${ticket.tierName}</td>
              <td>${ticket.price === 0 ? 'Free' : '₦' + ticket.price.toLocaleString()}</td>
              <td>${formatDate(ticket.purchasedAt ? ticket.purchasedAt.split('T')[0] : '')}</td>
              <td><span class="status-badge ${ticket.status}">${ticket.status.replace('-', ' ')}</span></td>
              <td>
                <div class="table-actions">
                  <button class="action-btn view" onclick="showSoldTicketQR('${ticket.id}')">
                    <i class="bi bi-qr-code"></i> QR
                  </button>
                  ${ticket.status !== 'checked-in' ? `
                    <button class="action-btn edit" onclick="checkInTicket('${ticket.id}')">
                      <i class="bi bi-check2"></i> Check-in
                    </button>` : ''}
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

function showAddTierForm() {
  document.getElementById('addTierForm').style.display = 'block';
  document.getElementById('addTierBtn').style.display = 'none';
  document.getElementById('tierName').focus();
}

function hideAddTierForm() {
  const form = document.getElementById('addTierForm');
  if (form) form.style.display = 'none';
  const btn = document.getElementById('addTierBtn');
  if (btn) btn.style.display = 'inline-flex';
  ['tierName', 'tierPrice', 'tierQuantity', 'tierDescription'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

async function saveTier() {
  const name = document.getElementById('tierName').value.trim();
  const price = parseFloat(document.getElementById('tierPrice').value) || 0;
  const quantity = parseInt(document.getElementById('tierQuantity').value);
  const description = document.getElementById('tierDescription').value.trim();

  if (!name) { showToast('Please enter a tier name', 'error'); return; }
  if (!quantity || quantity < 1) { showToast('Please enter a valid quantity (min 1)', 'error'); return; }
  if (price < 0) { showToast('Price cannot be negative', 'error'); return; }

  const eventId = _currentManageEventId;
  const events = DataStore.getEvents();
  const event = events.find(e => e.id === eventId);

  const tier = {
    id: 'TIER-' + Date.now(),
    eventId,
    eventTitle: event ? event.title : '',
    name,
    price,
    totalQuantity: quantity,
    sold: 0,
    description,
    forSale: true,
    createdAt: new Date().toISOString().split('T')[0]
  };

  // Try API
  const session = window._adminSession || {};
  if (session.token) {
    try {
      const res = await fetch(`${BASE_URL}/admin/events/${eventId}/tickets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, price, quantity, description })
      });
      const data = await res.json();
      if (data.success && data.data && data.data.id) {
        tier.id = String(data.data.id);
      }
    } catch (err) {
      console.warn('API tier save failed, using localStorage:', err);
    }
  }

  DataStore.saveTicketTier(tier);

  // Keep legacy tickets store in sync for dashboard stats
  const legacy = DataStore.getTickets();
  legacy.push({
    id: tier.id,
    eventId: tier.eventId,
    name: tier.name,
    type: tier.price === 0 ? 'free' : 'paid',
    price: tier.price,
    quantity: tier.totalQuantity,
    sold: 0,
    eventTitle: tier.eventTitle
  });
  DataStore.saveTickets(legacy);

  hideAddTierForm();
  renderTiersList(eventId);
  renderDashboard();
  showToast(`Tier "${name}" created successfully!`, 'success');

  DataStore.saveActivity({
    type: 'event',
    text: `New ticket tier <strong>${name}</strong> added to ${tier.eventTitle}`,
    time: 'Just now'
  });
}

async function deleteTier(tierId) {
  if (!confirm('Delete this ticket tier? This cannot be undone.')) return;

  const session = window._adminSession || {};
  if (session.token) {
    try {
      const res = await fetch(`${BASE_URL}/admin/tickets/${tierId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.token}` }
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.message || 'Failed to delete tier', 'error');
        return;
      }
    } catch (err) {
      showToast('Server error — could not delete tier', 'error');
      console.error('deleteTier API error:', err);
      return;
    }
  }

  DataStore.deleteTicketTier(tierId);
  DataStore.saveTickets(DataStore.getTickets().filter(t => t.id !== tierId));
  renderTiersList(_currentManageEventId);
  renderDashboard();
  showToast('Ticket tier deleted', 'success');
}

function toggleTierSale(tierId) {
  const all = JSON.parse(localStorage.getItem('kulunu_ticket_tiers') || '[]');
  const tier = all.find(t => t.id === tierId);
  if (!tier) return;
  tier.forSale = !tier.forSale;
  localStorage.setItem('kulunu_ticket_tiers', JSON.stringify(all));
  showToast(tier.forSale ? `"${tier.name}" is now on sale` : `"${tier.name}" hidden from sale`, tier.forSale ? 'success' : 'warning');

  const session = window._adminSession || {};
  if (session.token) {
    fetch(`${BASE_URL}/admin/tickets/${tierId}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${session.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ for_sale: tier.forSale })
    }).catch(err => console.warn('toggleTierSale API failed:', err));
  }
}

function showTierQR(tierId) {
  const tiers = DataStore.getTicketTiers();
  const tier = tiers.find(t => t.id === tierId);
  if (!tier) return;

  const qrData = `KULUNU-TIER|${tier.id}|${tier.eventId}|${tier.name}|${tier.price}`;
  _currentQRData = qrData;

  document.getElementById('qrModalTitle').textContent = `QR Code — ${tier.name}`;
  document.getElementById('ticketQRDetails').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
      <div>
        <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;">Tier</div>
        <div style="font-weight:600;">${tier.name}</div>
      </div>
      <div>
        <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;">Price</div>
        <div style="font-weight:600;">${tier.price === 0 ? 'Free' : '₦' + tier.price.toLocaleString()}</div>
      </div>
      <div>
        <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;">Total Qty</div>
        <div style="font-weight:600;">${tier.totalQuantity.toLocaleString()}</div>
      </div>
      <div>
        <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;">Available</div>
        <div style="font-weight:600;">${(tier.totalQuantity - tier.sold).toLocaleString()}</div>
      </div>
    </div>
    ${tier.eventTitle ? `<div style="font-size:13px;color:var(--text-muted);">Event: <strong style="color:var(--text-primary);">${tier.eventTitle}</strong></div>` : ''}
    <div style="margin-top:10px;font-size:11px;color:var(--text-muted);word-break:break-all;">
      QR data: <code>${qrData}</code>
    </div>`;

  document.getElementById('ticketQRModal').classList.add('open');
  generateQR(qrData, 'ticketQRContainer');
}

function showSoldTicketQR(ticketId) {
  const ticket = DataStore.getSoldTickets().find(t => t.id === ticketId);
  if (!ticket) return;

  const qrData = ticket.qrData || `KULUNU-TICKET|${ticket.id}|${ticket.eventId}|${ticket.tierName}|${ticket.buyerEmail}`;
  _currentQRData = qrData;

  document.getElementById('qrModalTitle').textContent = `Ticket — ${ticket.id}`;
  document.getElementById('ticketQRDetails').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
      <div>
        <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;">Buyer</div>
        <div style="font-weight:600;">${ticket.buyerName}</div>
      </div>
      <div>
        <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;">Email</div>
        <div style="font-weight:600;font-size:13px;">${ticket.buyerEmail}</div>
      </div>
      <div>
        <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;">Tier</div>
        <div style="font-weight:600;">${ticket.tierName}</div>
      </div>
      <div>
        <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;">Status</div>
        <div><span class="status-badge ${ticket.status}">${ticket.status.replace('-', ' ')}</span></div>
      </div>
    </div>
    ${ticket.buyerPhone ? `<div style="font-size:13px;color:var(--text-muted);">Phone: <strong style="color:var(--text-primary);">${ticket.buyerPhone}</strong></div>` : ''}
    <div style="margin-top:10px;font-size:11px;color:var(--text-muted);word-break:break-all;">
      QR data: <code>${qrData}</code>
    </div>`;

  document.getElementById('ticketQRModal').classList.add('open');
  generateQR(qrData, 'ticketQRContainer');
}

function checkInTicket(ticketId) {
  const ticket = DataStore.updateSoldTicketStatus(ticketId, 'checked-in');
  if (!ticket) return;

  renderSoldTicketsList(_currentManageEventId);
  showToast(`${ticket.buyerName} checked in!`, 'success');

  DataStore.saveActivity({
    type: 'attendee',
    text: `<strong>${ticket.buyerName}</strong> checked in at ${ticket.eventTitle}`,
    time: 'Just now'
  });

  // Try API check-in
  const session = window._adminSession || {};
  if (session.token) {
    fetch(`${BASE_URL}/admin/tickets/${ticketId}/check-in`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${session.token}` }
    }).catch(err => console.warn('API check-in failed:', err));
  }
}

function generateQR(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  if (typeof QRCode === 'undefined') {
    container.innerHTML = `
      <div style="width:200px;height:200px;background:#F1F5F9;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:8px;border:2px dashed #CBD5E0;">
        <i class="bi bi-qr-code" style="font-size:48px;color:var(--text-muted);"></i>
        <p style="font-size:12px;color:var(--text-muted);margin-top:8px;">QR library not loaded</p>
      </div>`;
    return;
  }

  new QRCode(container, {
    text: data,
    width: 200,
    height: 200,
    colorDark: '#0B1E33',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });
}

function downloadQRCode() {
  const canvas = document.querySelector('#ticketQRContainer canvas');
  const img = document.querySelector('#ticketQRContainer img');

  if (canvas) {
    const link = document.createElement('a');
    link.download = `kulunu-qr-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } else if (img) {
    const link = document.createElement('a');
    link.download = `kulunu-qr-${Date.now()}.png`;
    link.href = img.src;
    link.click();
  } else {
    showToast('No QR code to download', 'error');
  }
}

// =========================
// TICKETS SECTION
// =========================
function renderTickets(tickets) {
  const tbody = document.getElementById('ticketsTableBody');

  // Update ticket stats
  const totalAvailable = tickets.reduce((sum, t) => sum + t.quantity, 0);
  const totalSold = tickets.reduce((sum, t) => sum + t.sold, 0);
  const totalRemaining = totalAvailable - totalSold;
  const conversionRate = totalAvailable > 0 ? ((totalSold / totalAvailable) * 100).toFixed(1) : 0;

  document.getElementById('totalTicketsAvailable').textContent = totalAvailable.toLocaleString();
  document.getElementById('totalTicketsSoldStat').textContent = totalSold.toLocaleString();
  document.getElementById('totalTicketsRemaining').textContent = totalRemaining.toLocaleString();
  document.getElementById('conversionRate').textContent = conversionRate + '%';

  tbody.innerHTML = tickets.map(ticket => `
    <tr>
      <td>
        <div class="ticket-name">
          <div class="avatar">${ticket.name.charAt(0)}</div>
          <div class="ticket-name-info">
            <strong>${ticket.name}</strong>
            <small>${ticket.id}</small>
          </div>
        </div>
      </td>
      <td>${ticket.eventTitle}</td>
      <td><span class="status-badge ${ticket.type}">${ticket.type}</span></td>
      <td>₦${ticket.price.toLocaleString()}</td>
      <td>${ticket.quantity - ticket.sold}</td>
      <td>${ticket.sold}</td>
      <td>₦${(ticket.price * ticket.sold).toLocaleString()}</td>
      <td>
        <div class="table-actions">
          <button class="action-btn view" onclick="viewTicket('${ticket.id}')">View</button>
          <button class="action-btn edit" onclick="editTicket('${ticket.id}')">Edit</button>
        </div>
      </td>
    </tr>
  `).join('');

  // Populate event filter
  populateEventFilter('ticketEventFilter', tickets);
}

function initializeTicketFilters() {
  const eventFilter = document.getElementById('ticketEventFilter');
  const typeFilter = document.getElementById('ticketTypeFilter');
  const searchInput = document.getElementById('ticketSearch');

  const filterTickets = () => {
    let tickets = DataStore.getTickets();
    const eventVal = eventFilter.value;
    const typeVal = typeFilter.value;
    const searchVal = searchInput.value.toLowerCase();

    if (eventVal) tickets = tickets.filter(t => t.eventId === eventVal);
    if (typeVal) tickets = tickets.filter(t => t.type === typeVal);
    if (searchVal) tickets = tickets.filter(t => t.name.toLowerCase().includes(searchVal) || t.eventTitle.toLowerCase().includes(searchVal));

    renderTickets(tickets);
  };

  eventFilter?.addEventListener('change', filterTickets);
  typeFilter?.addEventListener('change', filterTickets);
  searchInput?.addEventListener('input', filterTickets);
}

function populateEventFilter(selectId, tickets) {
  const select = document.getElementById(selectId);
  if (!select) return;

  const events = DataStore.getEvents();
  const eventIds = [...new Set(tickets.map(t => t.eventId))];

  select.innerHTML = '<option value="">All Events</option>';
  eventIds.forEach(id => {
    const event = events.find(e => e.id === id);
    if (event) {
      select.innerHTML += `<option value="${id}">${event.title}</option>`;
    }
  });
}

function viewTicket(ticketId) {
  const tickets = DataStore.getTickets();
  const ticket = tickets.find(t => t.id === ticketId);
  if (ticket) openManageTicketsModal(ticket.eventId);
}

function editTicket(ticketId) {
  const tickets = DataStore.getTickets();
  const ticket = tickets.find(t => t.id === ticketId);
  if (ticket) {
    openManageTicketsModal(ticket.eventId);
    showToast('Edit the tier from the Manage Tickets panel', 'info');
  }
}

function exportTickets() {
  showToast('Exporting ticket data...', 'success');
}

function switchMainTicketsTab(tab) {
  document.querySelectorAll('[data-tickets-tab]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.ticketsTab === tab);
  });
  document.getElementById('mainTiersTab').style.display = tab === 'tiers' ? 'block' : 'none';
  document.getElementById('mainSoldTab').style.display = tab === 'sold' ? 'block' : 'none';

  if (tab === 'sold') {
    fetchSoldTicketsFromAPI(null).then(() => renderAllSoldTickets());
  }
}

function renderAllSoldTickets(filter = {}) {
  let soldTickets = DataStore.getSoldTickets();

  if (filter.eventId) soldTickets = soldTickets.filter(t => t.eventId === filter.eventId);
  if (filter.status) soldTickets = soldTickets.filter(t => t.status === filter.status);
  if (filter.search) {
    const q = filter.search.toLowerCase();
    soldTickets = soldTickets.filter(t =>
      t.buyerName.toLowerCase().includes(q) ||
      t.buyerEmail.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    );
  }

  const tbody = document.getElementById('allSoldTicketsBody');

  // Populate event filter
  const events = DataStore.getEvents();
  const eventFilter = document.getElementById('soldTicketEventFilter');
  if (eventFilter && eventFilter.options.length <= 1) {
    events.forEach(ev => {
      eventFilter.innerHTML += `<option value="${ev.id}">${ev.title}</option>`;
    });
  }

  if (soldTickets.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text-muted);">
      <i class="bi bi-receipt" style="font-size:32px;display:block;margin-bottom:8px;"></i>
      No sold tickets found
    </td></tr>`;
    return;
  }

  tbody.innerHTML = soldTickets.map(ticket => `
    <tr>
      <td><code style="font-size:12px;background:#F1F5F9;padding:2px 6px;border-radius:4px;">${ticket.id}</code></td>
      <td>
        <div class="ticket-name">
          <div class="avatar">${ticket.buyerName.charAt(0)}</div>
          <div class="ticket-name-info">
            <strong>${ticket.buyerName}</strong>
            <small>${ticket.buyerEmail}</small>
          </div>
        </div>
      </td>
      <td>${ticket.eventTitle}</td>
      <td>${ticket.tierName}</td>
      <td>${ticket.price === 0 ? '<span class="status-badge free">Free</span>' : '₦' + ticket.price.toLocaleString()}</td>
      <td>${formatDate(ticket.purchasedAt ? ticket.purchasedAt.split('T')[0] : '')}</td>
      <td><span class="status-badge ${ticket.status}">${ticket.status.replace('-', ' ')}</span></td>
      <td>
        <div class="table-actions">
          <button class="action-btn view" onclick="showSoldTicketQR('${ticket.id}')">
            <i class="bi bi-qr-code"></i> QR
          </button>
          ${ticket.status !== 'checked-in' ? `
            <button class="action-btn edit" onclick="_checkInFromMain('${ticket.id}')">
              <i class="bi bi-check2"></i>
            </button>` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

function filterAllSoldTickets() {
  renderAllSoldTickets({
    search: document.getElementById('soldTicketSearch')?.value || '',
    eventId: document.getElementById('soldTicketEventFilter')?.value || '',
    status: document.getElementById('soldTicketStatusFilter')?.value || ''
  });
}

function _checkInFromMain(ticketId) {
  const ticket = DataStore.updateSoldTicketStatus(ticketId, 'checked-in');
  if (!ticket) return;
  filterAllSoldTickets();
  showToast(`${ticket.buyerName} checked in!`, 'success');
  DataStore.saveActivity({
    type: 'attendee',
    text: `<strong>${ticket.buyerName}</strong> checked in at ${ticket.eventTitle}`,
    time: 'Just now'
  });
}

// =========================
// ATTENDEES SECTION
// =========================
let currentAttendeePage = 1;
const attendeesPerPage = 10;

function renderAttendees(attendees, page = 1) {
  const tbody = document.getElementById('attendeesTableBody');
  const totalAttendees = attendees.length;
  const totalPages = Math.ceil(totalAttendees / attendeesPerPage);
  const start = (page - 1) * attendeesPerPage;
  const end = start + attendeesPerPage;
  const paginatedAttendees = attendees.slice(start, end);

  tbody.innerHTML = paginatedAttendees.map(attendee => `
    <tr>
      <td>
        <div class="ticket-name">
          <div class="avatar">${attendee.name.charAt(0)}</div>
          <div class="ticket-name-info">
            <strong>${attendee.name}</strong>
            <small>${attendee.id}</small>
          </div>
        </div>
      </td>
      <td>${attendee.email}</td>
      <td>${attendee.eventTitle}</td>
      <td>${attendee.ticketType}</td>
      <td>${formatDate(attendee.purchaseDate)}</td>
      <td><span class="status-badge ${attendee.status}">${attendee.status.replace('-', ' ')}</span></td>
      <td>
        <div class="table-actions">
          <button class="action-btn view" onclick="viewAttendee('${attendee.id}')">View</button>
          <button class="action-btn edit" onclick="markCheckedIn('${attendee.id}')">Check-in</button>
        </div>
      </td>
    </tr>
  `).join('');

  // Update pagination info
  document.getElementById('attendeeStart').textContent = totalAttendees > 0 ? start + 1 : 0;
  document.getElementById('attendeeEnd').textContent = Math.min(end, totalAttendees);
  document.getElementById('attendeeTotal').textContent = totalAttendees;

  // Render pagination
  renderAttendeePagination(page, totalPages);

  // Populate event filter
  populateEventFilter('attendeeEventFilter', attendees);
}

function renderAttendeePagination(currentPage, totalPages) {
  const pagesContainer = document.getElementById('attendeePages');
  const prevBtn = document.getElementById('attendeePrev');
  const nextBtn = document.getElementById('attendeeNext');

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;

  prevBtn.onclick = () => renderAttendees(getFilteredAttendees(), currentPage - 1);
  nextBtn.onclick = () => renderAttendees(getFilteredAttendees(), currentPage + 1);

  let pagesHTML = '';
  for (let i = 1; i <= Math.min(totalPages, 5); i++) {
    pagesHTML += `<button class="page-num ${i === currentPage ? 'active' : ''}" onclick="renderAttendees(getFilteredAttendees(), ${i})">${i}</button>`;
  }
  pagesContainer.innerHTML = pagesHTML;
}

function getFilteredAttendees() {
  let attendees = DataStore.getAttendees();
  const eventFilter = document.getElementById('attendeeEventFilter')?.value;
  const statusFilter = document.getElementById('attendeeStatusFilter')?.value;
  const searchVal = document.getElementById('attendeeSearch')?.value.toLowerCase();

  if (eventFilter) attendees = attendees.filter(a => a.eventId === eventFilter);
  if (statusFilter) attendees = attendees.filter(a => a.status === statusFilter);
  if (searchVal) attendees = attendees.filter(a => a.name.toLowerCase().includes(searchVal) || a.email.toLowerCase().includes(searchVal));

  return attendees;
}

function initializeAttendeeFilters() {
  const eventFilter = document.getElementById('attendeeEventFilter');
  const statusFilter = document.getElementById('attendeeStatusFilter');
  const searchInput = document.getElementById('attendeeSearch');

  const filterAttendees = () => {
    currentAttendeePage = 1;
    renderAttendees(getFilteredAttendees(), 1);
  };

  eventFilter?.addEventListener('change', filterAttendees);
  statusFilter?.addEventListener('change', filterAttendees);
  searchInput?.addEventListener('input', filterAttendees);
}

function viewAttendee(attendeeId) {
  showToast('Attendee details loaded', 'info');
}

function markCheckedIn(attendeeId) {
  const attendees = DataStore.getAttendees();
  const attendee = attendees.find(a => a.id === attendeeId);

  if (attendee) {
    attendee.status = 'checked-in';
    DataStore.saveAttendees(attendees);
    renderAttendees(getFilteredAttendees(), currentAttendeePage);
    showToast(`${attendee.name} marked as checked in`, 'success');

    DataStore.saveActivity({
      type: 'attendee',
      text: `<strong>${attendee.name}</strong> checked in`,
      time: 'Just now'
    });
  }
}

function exportAttendees() {
  showToast('Exporting attendee list...', 'success');
}

// =========================
// ACTIVITIES
// =========================
function renderActivities(activities) {
  const list = document.getElementById('activityList');

  list.innerHTML = activities.slice(0, 5).map(activity => `
    <div class="activity-item">
      <div class="activity-icon ${activity.type}">
        <i class="bi bi-${getActivityIcon(activity.type)}"></i>
      </div>
      <div class="activity-content">
        <p class="activity-text">${activity.text}</p>
        <span class="activity-time">${activity.time}</span>
      </div>
    </div>
  `).join('');
}

function getActivityIcon(type) {
  const icons = {
    sale: 'cash-coin',
    event: 'calendar-check',
    attendee: 'person-check',
    refund: 'arrow-left-circle'
  };
  return icons[type] || 'bell';
}

function renderUpcomingEvents(events) {
  const list = document.getElementById('upcomingEventsList');

  list.innerHTML = events.map(event => `
    <div class="event-item" onclick="viewEvent('${event.id}')">
      <img src="${event.banner || 'assets/img/trend1.jpg'}" alt="${event.title}" class="event-item-image" onerror="this.src='https://via.placeholder.com/64x64?text=E'">
      <div class="event-item-info">
        <h4 class="event-item-title">${event.title}</h4>
        <div class="event-item-meta">
          <span><i class="bi bi-calendar"></i> ${formatDate(event.date)}</span>
          <span><i class="bi bi-geo-alt"></i> ${event.venue}</span>
        </div>
      </div>
      <div class="event-item-stats">
        <span class="event-item-tickets">${event.ticketsSold}</span>
        <span class="event-item-label">tickets sold</span>
      </div>
    </div>
  `).join('');
}

// =========================
// CHARTS
// =========================
let revenueChart = null;
let ticketsChart = null;
let salesPerformanceChart = null;
let ticketTypeChart = null;

function initializeCharts() {
  const revenueCtx = document.getElementById('revenueChart');
  const ticketsCtx = document.getElementById('ticketsChart');

  if (revenueCtx) {
    if (revenueChart) revenueChart.destroy();

    revenueChart = new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
        datasets: [{
          label: 'Revenue',
          data: [120000, 190000, 150000, 250000, 220000, 300000, 280000],
          borderColor: '#0CA6EF',
          backgroundColor: 'rgba(12, 166, 239, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value => '₦' + (value / 1000) + 'k'
            }
          }
        }
      }
    });
  }

  if (ticketsCtx) {
    if (ticketsChart) ticketsChart.destroy();

    ticketsChart = new Chart(ticketsCtx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Tickets Sold',
          data: [45, 62, 38, 85, 72, 95, 58],
          backgroundColor: '#0CA6EF',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}

function initializeAnalyticsCharts() {
  const salesCtx = document.getElementById('salesPerformanceChart');
  const typeCtx = document.getElementById('ticketTypeChart');

  if (salesCtx) {
    if (salesPerformanceChart) salesPerformanceChart.destroy();

    salesPerformanceChart = new Chart(salesCtx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'This Month',
            data: [450000, 620000, 580000, 750000],
            borderColor: '#0CA6EF',
            backgroundColor: 'rgba(12, 166, 239, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Last Month',
            data: [380000, 520000, 490000, 650000],
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: value => '₦' + (value / 1000) + 'k' }
          }
        }
      }
    });
  }

  if (typeCtx) {
    if (ticketTypeChart) ticketTypeChart.destroy();

    const tickets = DataStore.getTickets();
    const vipTickets = tickets.filter(t => t.name.toLowerCase().includes('vip')).reduce((sum, t) => sum + t.sold, 0);
    const regularTickets = tickets.filter(t => t.name.toLowerCase().includes('regular') || t.name.toLowerCase().includes('standard')).reduce((sum, t) => sum + t.sold, 0);
    const freeTickets = tickets.filter(t => t.type === 'free').reduce((sum, t) => sum + t.sold, 0);

    ticketTypeChart = new Chart(typeCtx, {
      type: 'doughnut',
      data: {
        labels: ['VIP', 'Regular', 'Free'],
        datasets: [{
          data: [vipTickets, regularTickets, freeTickets],
          backgroundColor: ['#0CA6EF', '#10B981', '#F59E0B'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  // Render top events
  renderTopEvents();
}

function renderTopEvents() {
  const events = DataStore.getEvents();
  const sortedEvents = [...events].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const list = document.getElementById('topEventsList');

  list.innerHTML = sortedEvents.map((event, index) => `
    <div class="top-event-item">
      <div class="top-event-rank">${index + 1}</div>
      <div class="top-event-info">
        <div class="top-event-title">${event.title}</div>
        <div class="top-event-meta">${event.ticketsSold} tickets sold</div>
      </div>
      <div class="top-event-revenue">
        <div class="top-event-amount">₦${event.revenue.toLocaleString()}</div>
        <div class="top-event-percent">+12% from last month</div>
      </div>
    </div>
  `).join('');
}

// =========================
// NOTIFICATIONS
// =========================
function initializeNotifications() {
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationPanel = document.getElementById('notificationPanel');

  notificationBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationPanel.classList.toggle('open');
    renderNotifications();
  });

  // Close panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!notificationPanel.contains(e.target) && !notificationBtn.contains(e.target)) {
      notificationPanel.classList.remove('open');
    }
  });

  // Mark all as read
  document.querySelector('.mark-all-read')?.addEventListener('click', () => {
    const notifications = JSON.parse(localStorage.getItem('kulunu_notifications') || '[]');
    notifications.forEach(n => n.unread = false);
    localStorage.setItem('kulunu_notifications', JSON.stringify(notifications));
    renderNotifications();
    updateNotificationBadge();
  });
}

function renderNotifications() {
  const notifications = JSON.parse(localStorage.getItem('kulunu_notifications') || '[]');
  const list = document.getElementById('notificationList');

  list.innerHTML = notifications.map(notification => `
    <div class="notification-item-panel ${notification.unread ? 'unread' : ''}">
      <div class="notification-icon-panel ${notification.type}">
        <i class="bi bi-${getNotificationIcon(notification.type)}"></i>
      </div>
      <div class="notification-content-panel">
        <p class="notification-text-panel">${notification.text}</p>
        <span class="notification-time-panel">${notification.time}</span>
      </div>
    </div>
  `).join('');
}

function getNotificationIcon(type) {
  const icons = {
    sale: 'cash-coin',
    event: 'calendar-event',
    alert: 'exclamation-triangle'
  };
  return icons[type] || 'bell';
}

function updateNotificationBadge() {
  const notifications = JSON.parse(localStorage.getItem('kulunu_notifications') || '[]');
  const unreadCount = notifications.filter(n => n.unread).length;
  const badge = document.querySelector('.notification-badge');
  if (badge) {
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';
  }
}

// =========================
// SEARCH
// =========================
function initializeSearch() {
  const searchInput = document.getElementById('globalSearch');

  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length < 2) return;

    const events = DataStore.getEvents();
    const tickets = DataStore.getTickets();
    const attendees = DataStore.getAttendees();

    const matchingEvents = events.filter(ev => ev.title.toLowerCase().includes(query));
    const matchingTickets = tickets.filter(t => t.name.toLowerCase().includes(query) || t.eventTitle.toLowerCase().includes(query));
    const matchingAttendees = attendees.filter(a => a.name.toLowerCase().includes(query) || a.email.toLowerCase().includes(query));

    // For now, just show a toast with results count
    const total = matchingEvents.length + matchingTickets.length + matchingAttendees.length;
    if (total > 0) {
      showToast(`Found ${total} results (${matchingEvents.length} events, ${matchingTickets.length} tickets, ${matchingAttendees.length} attendees)`, 'info');
    }
  });
}

// =========================
// SETTINGS
// =========================
function initializeSettings() {
  const profileForm = document.getElementById('profileForm');

  // Load saved settings
  const savedSettings = JSON.parse(localStorage.getItem('kulunu_settings') || '{}');
  if (savedSettings.name) document.getElementById('settingsName').value = savedSettings.name;
  if (savedSettings.email) document.getElementById('settingsEmail').value = savedSettings.email;
  if (savedSettings.phone) document.getElementById('settingsPhone').value = savedSettings.phone;
  if (savedSettings.org) document.getElementById('settingsOrg').value = savedSettings.org;

  profileForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const settings = {
      name: document.getElementById('settingsName').value,
      email: document.getElementById('settingsEmail').value,
      phone: document.getElementById('settingsPhone').value,
      org: document.getElementById('settingsOrg').value
    };

    localStorage.setItem('kulunu_settings', JSON.stringify(settings));
    showToast('Settings saved successfully!', 'success');

    // Update admin name display
    if (settings.name) {
      document.getElementById('adminName').textContent = settings.name;
    }
  });
}

// =========================
// UTILITY FUNCTIONS
// =========================
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-US', options);
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">
      <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : type === 'warning' ? 'exclamation-circle' : 'info-circle'}"></i>
    </div>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i class="bi bi-x"></i>
    </button>
  `;

  container.appendChild(toast);

  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    window.location.href = 'index.html';
  }
}

// =========================
// CREATE EVENT MODAL
// =========================
let uploadedBannerData = null; // Firebase download URL after upload

function openCreateEventModal() {
  const modal = document.getElementById('createEventModal');
  modal.classList.add('open');

  // Set minimum date to today
  const dateInput = document.getElementById('newEventDate');
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);

  // Reset banner upload state
  uploadedBannerData = null;
  document.getElementById('filePreview').style.display = 'none';
  document.getElementById('newEventBannerFile').value = '';
  document.getElementById('newEventBanner').value = '';
  hideCreateEventError();
  switchBannerTab('url'); // Default to URL tab
}

// Switch between URL and File upload tabs
function switchBannerTab(tab) {
  const urlSection = document.getElementById('bannerUrlSection');
  const fileSection = document.getElementById('bannerFileSection');
  const urlBtn = document.getElementById('urlTabBtn');
  const fileBtn = document.getElementById('fileTabBtn');

  if (tab === 'url') {
    urlSection.style.display = 'block';
    fileSection.style.display = 'none';
    urlBtn.classList.add('active');
    fileBtn.classList.remove('active');
  } else {
    urlSection.style.display = 'none';
    fileSection.style.display = 'block';
    urlBtn.classList.remove('active');
    fileBtn.classList.add('active');
  }
}

// Handle file upload — preview immediately, send to backend for Firebase Storage upload
async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    showToast('File size must be less than 5MB', 'error');
    event.target.value = '';
    return;
  }

  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file', 'error');
    event.target.value = '';
    return;
  }

  // Show local preview immediately
  const previewImage = document.getElementById('previewImage');
  const previewContainer = document.getElementById('filePreview');
  previewImage.src = URL.createObjectURL(file);
  previewContainer.style.display = 'block';

  const uploadArea = document.getElementById('fileUploadArea');
  uploadArea.style.borderColor = '#F59E0B';
  uploadArea.style.background = '#FEF3C7';
  uploadArea.querySelector('p').textContent = 'Uploading…';

  uploadedBannerData = null;

  try {
    const session = window._adminSession || {};
    const formData = new FormData();
    formData.append('banner', file);

    const res = await fetch(`${BASE_URL}/upload-banner`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${session.token}` },
      body: formData,
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Upload failed');

    uploadedBannerData = data.url;
    uploadArea.style.borderColor = '#10B981';
    uploadArea.style.background = '#D1FAE5';
    uploadArea.querySelector('p').textContent = 'Upload complete';
  } catch (err) {
    console.error('Banner upload failed:', err);
    showToast('Image upload failed. Please try again.', 'error');
    removeFilePreview();
  }
}

// Remove file preview
function removeFilePreview() {
  uploadedBannerData = null;
  document.getElementById('filePreview').style.display = 'none';
  document.getElementById('newEventBannerFile').value = '';

  const uploadArea = document.getElementById('fileUploadArea');
  uploadArea.style.borderColor = '#E2E8F0';
  uploadArea.style.background = 'transparent';
  const p = uploadArea.querySelector('p');
  if (p) p.textContent = 'Click to upload or drag and drop';
}

// Handle create/edit event form submission
document.addEventListener('DOMContentLoaded', () => {
  const createEventForm = document.getElementById('createEventForm');

  createEventForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const editId = createEventForm.dataset.editId;
    const isEditing = !!editId;

    const title = document.getElementById('newEventTitle').value.trim();
    const date = document.getElementById('newEventDate').value;
    const venue = document.getElementById('newEventVenue').value.trim();
    const type = document.getElementById('newEventType').value;
    const category = document.getElementById('newEventCategory').value || null;
    const status = document.getElementById('newEventStatus').value;
    const description = document.getElementById('newEventDescription').value.trim();

    // Block submit if a file was chosen but Firebase upload is still in progress
    const fileInput = document.getElementById('newEventBannerFile');
    const fileChosen = fileInput && fileInput.files.length > 0;
    if (fileChosen && !uploadedBannerData) {
      showCreateEventError('Please wait — image is still uploading.');
      return;
    }

    let banner;
    if (uploadedBannerData) {
      banner = uploadedBannerData;
    } else {
      banner = document.getElementById('newEventBanner').value.trim();
      if (!banner && isEditing) {
        const existingEvent = DataStore.getEvents().find(ev => ev.id === editId);
        banner = existingEvent ? existingEvent.banner : 'assets/img/trend1.jpg';
      } else {
        banner = banner || 'assets/img/trend1.jpg';
      }
    }

    if (isEditing) {
      const events = DataStore.getEvents();
      const eventIndex = events.findIndex(ev => ev.id === editId);
      if (eventIndex !== -1) {
        events[eventIndex] = { ...events[eventIndex], title, date, venue, type, status, banner, description };
        DataStore.saveEvents(events);
        DataStore.saveActivity({ type: 'event', text: `<strong>${title}</strong> has been updated`, time: 'Just now' });
        showToast('Event updated successfully!', 'success');
      }
      resetCreateEventModal(createEventForm);
      closeModal('createEventModal');
      renderDashboard();
      switchSection('events');
      return;
    }

    // ── Create new event via API ──────────────────────────────────────────────
    const session = window._adminSession || {};
    if (!session.token) {
      showToast('You must be logged in to create an event.', 'error');
      return;
    }

    const submitBtn = createEventForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating...';

    try {
      const res = await fetch(`${BASE_URL}/create-event`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, date, venue, type, banner_url: banner, category }),
      });

      const data = await res.json();

      if (!data.success) {
        showCreateEventError(data.message || 'Failed to create event.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
      }

      const apiEvent = data.data || {};
      const newEvent = {
        id: String(apiEvent.id || 'EVT-' + Date.now()),
        title: apiEvent.title || title,
        date: apiEvent.date || date,
        venue: apiEvent.venue || venue,
        type: apiEvent.type || type,
        status: apiEvent.status || status,
        banner: apiEvent.banner_url || banner,
        category: apiEvent.category || category,
        ticketsSold: 0,
        revenue: 0,
        description,
        createdAt: apiEvent.created_at ? apiEvent.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      };

      const events = DataStore.getEvents();
      events.push(newEvent);
      DataStore.saveEvents(events);
      DataStore.saveActivity({ type: 'event', text: `<strong>${title}</strong> has been created`, time: 'Just now' });

      showToast('Event created successfully!', 'success');
      resetCreateEventModal(createEventForm);
      closeModal('createEventModal');
      renderDashboard();
      switchSection('events');

    } catch (err) {
      console.error(err);
      showCreateEventError('Server error. Please check your connection and try again.');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
});

function showCreateEventError(msg) {
  const bar = document.getElementById('createEventError');
  const msgEl = document.getElementById('createEventErrorMsg');
  if (!bar || !msgEl) return;
  msgEl.textContent = msg;
  bar.style.display = 'flex';
  bar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideCreateEventError() {
  const bar = document.getElementById('createEventError');
  if (bar) bar.style.display = 'none';
}

function resetCreateEventModal(form) {
  form.reset();
  delete form.dataset.editId;
  uploadedBannerData = null;
  document.getElementById('filePreview').style.display = 'none';
  hideCreateEventError();
  document.querySelector('#createEventModal .modal-header h3').textContent = 'Create New Event';
  document.querySelector('#createEventModal button[type="submit"]').textContent = 'Create Event';
}

// Make functions globally available
window.switchSection = switchSection;
window.viewEvent = viewEvent;
window.editEvent = editEvent;
window.closeModal = closeModal;
window.openCreateEventModal = openCreateEventModal;
window.switchBannerTab = switchBannerTab;
window.handleFileUpload = handleFileUpload;
window.removeFilePreview = removeFilePreview;
window.viewTicket = viewTicket;
window.editTicket = editTicket;
window.exportTickets = exportTickets;
window.viewAttendee = viewAttendee;
window.markCheckedIn = markCheckedIn;
window.exportAttendees = exportAttendees;
window.logout = logout;
window.resetCreateEventModal = resetCreateEventModal;
window.hideCreateEventError = hideCreateEventError;
window.openManageTicketsModal = openManageTicketsModal;
window.switchTicketMgmtTab = switchTicketMgmtTab;
window.showAddTierForm = showAddTierForm;
window.hideAddTierForm = hideAddTierForm;
window.saveTier = saveTier;
window.deleteTier = deleteTier;
window.toggleTierSale = toggleTierSale;
window.showTierQR = showTierQR;
window.showSoldTicketQR = showSoldTicketQR;
window.checkInTicket = checkInTicket;
window.downloadQRCode = downloadQRCode;
window.deleteEvent = deleteEvent;
window.switchMainTicketsTab = switchMainTicketsTab;
window.renderAllSoldTickets = renderAllSoldTickets;
window.filterAllSoldTickets = filterAllSoldTickets;
window._checkInFromMain = _checkInFromMain;
