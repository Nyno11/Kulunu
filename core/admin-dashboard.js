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
      {
        id: 'EVT-002',
        title: 'Abuja Music Festival',
        date: '2025-07-28',
        venue: 'Eagle Square, Abuja',
        type: 'physical',
        status: 'live',
        banner: 'assets/img/trend2.jpg',
        ticketsSold: 1850,
        revenue: 9250000,
        createdAt: '2025-06-15'
      },
      {
        id: 'EVT-003',
        title: 'Virtual Business Summit',
        date: '2025-09-10',
        venue: 'Online',
        type: 'virtual',
        status: 'upcoming',
        banner: 'assets/img/trend3.jpg',
        ticketsSold: 520,
        revenue: 2600000,
        createdAt: '2025-07-10'
      },
      {
        id: 'EVT-004',
        title: 'Comedy Night Live',
        date: '2025-06-20',
        venue: 'National Theatre, Lagos',
        type: 'physical',
        status: 'completed',
        banner: 'assets/img/trend4.jpg',
        ticketsSold: 800,
        revenue: 4000000,
        createdAt: '2025-05-01'
      },
      {
        id: 'EVT-005',
        title: 'Startup Pitch Competition',
        date: '2025-10-05',
        venue: 'Tech Hub, Victoria Island',
        type: 'physical',
        status: 'draft',
        banner: 'assets/img/trend5.jpg',
        ticketsSold: 0,
        revenue: 0,
        createdAt: '2025-07-20'
      }
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
  }
};

// =========================
// INITIALIZATION
// =========================
document.addEventListener('DOMContentLoaded', () => {
  initializeData();
  initializeSidebar();
  initializeCharts();
  renderDashboard();
  initializeEventFilters();
  initializeTicketFilters();
  initializeAttendeeFilters();
  initializeSettings();
  initializeSearch();
  initializeNotifications();
});

// Initialize data in localStorage if not present
function initializeData() {
  if (!localStorage.getItem('kulunu_events')) {
    DataStore.saveEvents(DataStore.getDefaultEvents());
  }
  if (!localStorage.getItem('kulunu_tickets')) {
    DataStore.saveTickets(DataStore.getDefaultTickets());
  }
  if (!localStorage.getItem('kulunu_attendees')) {
    DataStore.saveAttendees(DataStore.getDefaultAttendees());
  }
  if (!localStorage.getItem('kulunu_activities')) {
    DataStore.getActivities(); // Creates default
  }
  if (!localStorage.getItem('kulunu_notifications')) {
    localStorage.setItem('kulunu_notifications', JSON.stringify(DataStore.getDefaultNotifications()));
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
  const events = DataStore.getEvents();
  const tickets = DataStore.getTickets();
  const attendees = DataStore.getAttendees();
  const activities = DataStore.getActivities();

  // Update stats
  document.getElementById('totalEvents').textContent = events.length;
  document.getElementById('ticketsSold').textContent = tickets.reduce((sum, t) => sum + t.sold, 0).toLocaleString();
  document.getElementById('totalRevenue').textContent = '₦' + tickets.reduce((sum, t) => sum + (t.price * t.sold), 0).toLocaleString();
  document.getElementById('totalAttendees').textContent = attendees.length.toLocaleString();

  // Update badges
  document.getElementById('eventCount').textContent = events.length;
  document.getElementById('ticketCount').textContent = tickets.reduce((sum, t) => sum + t.sold, 0);

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

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('open');
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
  showToast('Ticket details loaded', 'info');
}

function editTicket(ticketId) {
  showToast('Opening ticket editor...', 'info');
}

function exportTickets() {
  showToast('Exporting ticket data...', 'success');
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
let uploadedBannerData = null; // Store base64 data from file upload

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

// Handle file upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    showToast('File size must be less than 5MB', 'error');
    event.target.value = '';
    return;
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file', 'error');
    event.target.value = '';
    return;
  }

  // Read file and convert to base64
  const reader = new FileReader();
  reader.onload = function (e) {
    uploadedBannerData = e.target.result;

    // Show preview
    const previewImage = document.getElementById('previewImage');
    const previewContainer = document.getElementById('filePreview');
    previewImage.src = uploadedBannerData;
    previewContainer.style.display = 'block';

    // Add hover effect to upload area
    const uploadArea = document.getElementById('fileUploadArea');
    uploadArea.style.borderColor = '#10B981';
    uploadArea.style.background = '#D1FAE5';
  };
  reader.readAsDataURL(file);
}

// Remove file preview
function removeFilePreview() {
  uploadedBannerData = null;
  document.getElementById('filePreview').style.display = 'none';
  document.getElementById('newEventBannerFile').value = '';

  const uploadArea = document.getElementById('fileUploadArea');
  uploadArea.style.borderColor = '#E2E8F0';
  uploadArea.style.background = 'transparent';
}

// Handle create/edit event form submission
const BASE_URL = 'http://192.168.164.21:8080';

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
    const status = document.getElementById('newEventStatus').value;
    const description = document.getElementById('newEventDescription').value.trim();

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
        body: JSON.stringify({ title, date, venue, type, banner_url: banner }),
      });

      const data = await res.json();

      if (!data.success) {
        showToast(data.message || 'Failed to create event.', 'error');
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
      showToast('Server error. Please try again.', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
});

function resetCreateEventModal(form) {
  form.reset();
  delete form.dataset.editId;
  uploadedBannerData = null;
  document.getElementById('filePreview').style.display = 'none';
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
