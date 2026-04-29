# Kulunu Admin Dashboard - Event Organizer Platform

## Overview
A sophisticated, modern admin dashboard for event organizers to manage events, sell tickets, track attendees, and analyze performance. Built with vanilla HTML, CSS, and JavaScript with a focus on user experience and functionality.

## Features

### 📊 Dashboard Overview
- **Real-time Statistics**: Total events, tickets sold, revenue, and attendees
- **Interactive Charts**: Revenue trends and ticket sales visualization
- **Recent Activity Feed**: Live updates on sales, check-ins, and event updates
- **Upcoming Events**: Quick view of upcoming and live events

### 🎪 Events Management
- **Create Events**: Easy event creation with all essential details
- **Event Status**: Track events as Draft, Upcoming, Live, or Completed
- **Event Filtering**: Filter events by status (All, Upcoming, Live, Completed, Draft)
- **Event Details**: View comprehensive event information including ticket breakdown
- **Quick Actions**: Edit and manage events directly from the dashboard

### 🎫 Ticket Management
- **Ticket Overview**: Total available, sold, remaining tickets and conversion rate
- **Ticket Types**: Support for Paid and Free tickets
- **Ticket Table**: Comprehensive view with filtering and search
- **Revenue Tracking**: Real-time revenue calculation per ticket
- **Export Functionality**: Export ticket data for reporting

### 👥 Attendees Management
- **Attendee List**: Complete attendee database with pagination
- **Status Tracking**: Confirmed, Pending, Checked-in statuses
- **Check-in System**: Mark attendees as checked-in with one click
- **Search & Filter**: Find attendees by name, email, event, or status
- **Export List**: Export attendee data for event coordination

### 📈 Analytics & Reports
- **Sales Performance**: Compare current vs previous period performance
- **Ticket Distribution**: Visual breakdown of ticket types (VIP, Regular, Free)
- **Top Performing Events**: Ranking of events by revenue
- **Time-based Filters**: Analyze data over different time periods

### ⚙️ Settings
- **Profile Management**: Update organizer information
- **Notification Preferences**: Control email and push notifications
- **Toggle Controls**: Easy on/off switches for various settings

## Technical Features

### 🎨 Design
- **Modern UI/UX**: Clean, professional interface with smooth animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Sidebar**: Professional navigation with clear visual hierarchy
- **Color-coded Status**: Easy-to-understand status indicators
- **Interactive Elements**: Hover effects, transitions, and micro-interactions

### 💾 Data Management
- **LocalStorage**: Persistent data storage without backend requirements
- **Sample Data**: Pre-populated with realistic demo data
- **Data Persistence**: All changes saved automatically
- **Easy Integration**: Ready to connect to real backend APIs

### 📱 Navigation
- **Sidebar Navigation**: Quick access to all major sections
- **Mobile Menu**: Hamburger menu for mobile devices
- **Breadcrumb-free**: Single-page application feel
- **Smooth Transitions**: Animated section switching

### 🔔 Notifications
- **Real-time Alerts**: Notification panel for important updates
- **Unread Indicators**: Badge showing unread notification count
- **Mark as Read**: Clear all notifications with one click
- **Toast Messages**: Non-intrusive success/error feedback

### 🔍 Search
- **Global Search**: Search across events, tickets, and attendees
- **Instant Results**: Real-time filtering as you type
- **Result Summary**: Shows count of matching items

## Getting Started

### 1. Access the Dashboard
Open `admin-dashboard.html` in your web browser. No server required!

### 2. Explore the Interface
- **Overview**: Start here to see your dashboard statistics
- **Events**: View and manage all your events
- **Tickets**: Track ticket sales and availability
- **Attendees**: Manage event attendees and check-ins
- **Analytics**: Deep dive into performance metrics
- **Settings**: Configure your profile and preferences

### 3. Create Your First Event
1. Click "Create Event" button in the header
2. Fill in event details (title, date, venue, type)
3. Upload event banner (optional)
4. Click "Create Event" to save
5. You'll be redirected to Event Management to add tickets

### 4. Manage Tickets
1. Go to Events section
2. Click on an event to view details
3. Add different ticket types (VIP, Regular, Free)
4. Set prices and quantities
5. Monitor sales in real-time

### 5. Track Attendees
1. Navigate to Attendees section
2. Use filters to find specific attendees
3. Mark attendees as checked-in at the event
4. Export attendee list for event coordination

## Data Structure

### Events
```javascript
{
  id: "EVT-001",
  title: "Event Title",
  date: "2025-08-15",
  venue: "Event Venue",
  type: "physical|virtual",
  status: "draft|upcoming|live|completed",
  banner: "image_url",
  ticketsSold: 0,
  revenue: 0,
  createdAt: "2025-07-01"
}
```

### Tickets
```javascript
{
  id: "TKT-001",
  eventId: "EVT-001",
  name: "VIP Access",
  type: "paid|free",
  price: 5000,
  quantity: 100,
  sold: 0,
  eventTitle: "Event Title"
}
```

### Attendees
```javascript
{
  id: "ATT-001",
  name: "Attendee Name",
  email: "email@example.com",
  eventId: "EVT-001",
  eventTitle: "Event Title",
  ticketType: "VIP",
  purchaseDate: "2025-07-10",
  status: "confirmed|pending|checked-in"
}
```

## Customization

### Colors
The dashboard uses CSS variables for easy theming. Modify these in `assets/css/admin-dashboard.css`:

```css
:root {
  --primary: #0CA6EF;        /* Main brand color */
  --success: #10B981;        /* Success/green */
  --warning: #F59E0B;        /* Warning/yellow */
  --danger: #EF4444;         /* Danger/red */
  --bg-sidebar: #0B1E33;     /* Sidebar background */
}
```

### Adding Real Backend
To connect to a real backend:

1. Replace `DataStore` methods with API calls
2. Update data fetching in `initializeData()`
3. Modify save operations to use `fetch()` or `axios`
4. Add authentication and authorization
5. Implement real-time updates with WebSockets

### Extending Features
- Add QR code generation for tickets
- Implement email notifications
- Add payment gateway integration
- Create attendee check-in mobile app
- Add advanced reporting and exports
- Implement user roles and permissions

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance
- **Fast Loading**: Optimized CSS and JavaScript
- **Minimal Dependencies**: Only Chart.js for analytics
- **Efficient Rendering**: Virtual scrolling for large datasets
- **Responsive Images**: Lazy loading for event banners

## Security Considerations
For production use:
- Implement proper authentication
- Add CSRF protection
- Sanitize all user inputs
- Use HTTPS in production
- Implement rate limiting
- Add data validation on backend

## Contributing
This is a demonstration project. For production use:
1. Add comprehensive error handling
2. Implement proper testing
3. Add accessibility features (ARIA labels)
4. Optimize for performance
5. Add internationalization support

## License
This project is created for demonstration purposes.

## Support
For questions or issues:
1. Check the code comments for inline documentation
2. Review the DataStore implementation for data structure
3. Examine CSS variables for styling customization

---

**Built with ❤️ for Event Organizers**

*Version 1.0.0 - July 2025*