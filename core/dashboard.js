document.getElementById("travelInfoForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const errorDiv = document.getElementById("error");
    const successDiv = document.getElementById("success"); // Optional: for success messages

    // 1. Retrieve the logged-in user session
    const userSession = JSON.parse(localStorage.getItem('user_session'));

    // Check if user is logged in before proceeding
    if (!userSession || !userSession.token) {
        alert("Session expired. Please login again.");
        window.location.href = "./login.html";
        return;
    }

    // 2. Gather all form data
    const payload = {
        id_user: userSession.id, // Attaching the owner's ID
        title: document.getElementById("title").value,
        traveler_type: document.getElementById("travelerType").value,
        first_name: document.getElementById("firstName").value,
        last_name: document.getElementById("lastName").value,
        middle_name: document.getElementById("middleName").value,
        gender: document.getElementById("gender").value,
        date_of_birth: document.getElementById("dob").value,
        email: document.getElementById("email").value,
        mobile_number: document.getElementById("phone").value,
        nationality: document.getElementById("nationality").value,
        passport_number: document.getElementById("passportNumber").value,
        passport_expiry_date: document.getElementById("expiryDate").value
    };

    try {
        // 3. Submit to your backend endpoint
        const res = await fetch("https://api.kulunu.app/add-traveler", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Pass the token to verify the user is allowed to save data
                "Authorization": `Bearer ${userSession.token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
            errorDiv.textContent = data.message || "Failed to save traveler info";
            errorDiv.classList.remove("d-none");
        } else {
            alert("Traveler information saved successfully!");
            // Optional: reset the form or redirect
            // document.getElementById("travelInfoForm").reset();
        }
    } catch (err) {
        console.error("Submission error:", err);
        errorDiv.textContent = "Server error. Please try again later.";
        errorDiv.classList.remove("d-none");
    }
});

const BOOKINGS = [
    {
        id: "WK123ABC",
        lastName: "Okafor",
        status: "upcoming",
        from: "LOS (Lagos)",
        to: "ABV (Abuja)",
        date: "2025-09-12",
        time: "09:35",
        airline: "Air Peace",
        pnr: "8Y3KDL"
    },
    {
        id: "WK456DEF",
        lastName: "Adebayo",
        status: "completed",
        from: "ABV (Abuja)",
        to: "PHC (Port Harcourt)",
        date: "2025-06-03",
        time: "14:05",
        airline: "Arik Air",
        pnr: "M1ZTQX"
    },
    {
        id: "WK789GHI",
        lastName: "Okafor",
        status: "cancelled",
        from: "LOS (Lagos)",
        to: "ACC (Accra)",
        date: "2025-05-21",
        time: "19:15",
        airline: "Ibom Air",
        pnr: "Q9P2AA"
    },
    {
        id: "WK111JKL",
        lastName: "Oluwole",
        status: "upcoming",
        from: "LOS (Lagos)",
        to: "DXB (Dubai)",
        date: "2025-10-04",
        time: "22:30",
        airline: "Qatar Airways",
        pnr: "L7N3VR"
    }
];

// -------- State --------
let currentFilter = "upcoming";
const $results = document.getElementById('booking-results'); // ✅ fixed
const $tabs = document.querySelectorAll('.tab');
const $bookingId = document.getElementById('bookingId');
const $lastName = document.getElementById('lastName');

// -------- Helpers --------
function formatDate(iso) {
    try {
        const d = new Date(iso + "T00:00:00");
        return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return iso }
}

function render(list) {
    $results.innerHTML = '';
    if (!list.length) {
        $results.innerHTML = `
          <div class="empty">
            <strong>No trips found.</strong><br/>
            Try a different filter or search with your Booking ID & Last Name.
          </div>`;
        return;
    }
    const frag = document.createDocumentFragment();
    list.forEach(b => {
        const el = document.createElement('article');
        el.className = 'booking';
        el.innerHTML = `
          <div class="booking-header">
            <div>
              <div class="route">${b.from} → ${b.to}</div>
              <div class="meta">${b.airline} • ${formatDate(b.date)} • ${b.time}</div>
            </div>
            <span class="badge ${b.status}">${b.status[0].toUpperCase() + b.status.slice(1)}</span>
          </div>
          <div class="booking-body">
            <div><strong>Booking ID:</strong> ${b.id}</div>
            <div><strong>PNR:</strong> ${b.pnr}</div>
            <div><strong>Passenger:</strong> ${b.lastName}</div>
          </div>
          <div class="booking-actions">
            <button class="btn small gray" data-action="invoice" data-id="${b.id}">Download Invoice</button>
            <button class="btn small ${b.status === 'completed' || b.status === 'cancelled' ? 'ghost' : 'primary'}" 
                    ${b.status !== 'upcoming' ? 'disabled' : ''} 
                    data-action="change" data-id="${b.id}">Change Flight</button>
          </div>
        `;
        frag.appendChild(el);
    });
    $results.appendChild(frag);
}

function applyFilter() {
    let visible = BOOKINGS.filter(b => currentFilter === 'all' ? true : b.status === currentFilter);
    const id = $bookingId.value.trim().toLowerCase();
    const ln = $lastName.value.trim().toLowerCase();
    if (id) visible = visible.filter(b => b.id.toLowerCase() === id);
    if (ln) visible = visible.filter(b => b.lastName.toLowerCase() === ln);
    render(visible);
}

// -------- Events --------
$tabs.forEach(t => t.addEventListener('click', () => {
    $tabs.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    currentFilter = t.dataset.filter;
    applyFilter();
}));

document.getElementById('findBtn').addEventListener('click', applyFilter);
document.getElementById('resetBtn').addEventListener('click', () => {
    $bookingId.value = '';
    $lastName.value = '';
    currentFilter = 'upcoming';
    $tabs.forEach(x => x.classList.toggle('active', x.dataset.filter === 'upcoming'));
    applyFilter();
});

$results.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    const map = {
        invoice: `Preparing invoice PDF for ${id}...`,
        change: `Starting change flow for ${id} (date/route)...`,
    };
    alert(map[action] || 'Action clicked');
});

// Initial render
applyFilter();

function saveProfileToStorage(data) {
    localStorage.setItem("primaryTraveler", JSON.stringify(data));
}

function saveCoTravelersToStorage() {
    localStorage.setItem("coTravelers", JSON.stringify(coTravelers));
}


// Hook co-travel save
document.getElementById("coTravelForm").addEventListener("submit", () => {
    saveCoTravelersToStorage();
});
