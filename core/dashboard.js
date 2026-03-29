

// ===============================
// PROFILE MODAL
// ===============================

const modal = document.getElementById("profileModal");
const profileForm = document.getElementById("travelInfoForm");
const profileDetails = document.getElementById("profileDetails");

let profileData = null;


// Open Modal
function openModal(edit = false) {

    // If editing, prefill form with saved data
    if (edit && profileData) {
        document.getElementById("title").value = profileData.title;
        document.getElementById("travelerType").value = profileData.travelerType;
        document.getElementById("firstName").value = profileData.firstName;
        document.getElementById("lastName").value = profileData.lastName;
        document.getElementById("middleName").value = profileData.middleName;
        document.getElementById("gender").value = profileData.gender;
        document.getElementById("dob").value = profileData.dob;
        document.getElementById("email").value = profileData.email;
        document.getElementById("phone").value = profileData.phone;
        document.getElementById("nationality").value = profileData.nationality;
        document.getElementById("passportNumber").value = profileData.passportNumber;
        document.getElementById("expiryDate").value = profileData.expiryDate;
    }

    modal.style.display = "flex";
}


// Close Modal
function closeModal() {
    modal.style.display = "none";
}


// Auto open modal on first load
window.addEventListener("load", () => {
    setTimeout(() => {
        openModal();
    }, 2000);
});



const coTravelModal = document.getElementById("coTravelModal");
const coTravelDetails = document.getElementById("coTravelDetails");
const coTravelList = document.getElementById("coTravelList");
const modalTitle = document.getElementById("modalTitle");

let coTravelers = []; // ✅ store travelers globally

// Open & close modal
function openCoTravelModal(index = -1) {
    document.getElementById("editIndex").value = index;

    if (index >= 0) {
        // ✅ Prefill form for editing
        const traveler = coTravelers[index];
        document.getElementById("coTitle").value = traveler.title;
        document.getElementById("coTravelerType").value = traveler.travelerType;
        document.getElementById("coFirstName").value = traveler.firstName;
        document.getElementById("coLastName").value = traveler.lastName;
        document.getElementById("coMiddleName").value = traveler.middleName;
        document.getElementById("coEmail").value = traveler.email;
        document.getElementById("coGender").value = traveler.gender;
        document.getElementById("coPhone").value = traveler.phone;
        document.getElementById("coRelationship").value = traveler.relation;
        document.getElementById("coDob").value = traveler.dob;

        modalTitle.innerHTML = `<i class="bi bi-people"></i> Edit Co-traveler`; // ✅ dynamic title
    } else {
        document.getElementById("coTravelForm").reset();
        modalTitle.innerHTML = `<i class="bi bi-people"></i> Add Co-traveler`; // ✅ reset title
    }

    coTravelModal.style.display = "flex";
}

function closeCoTravelModal() {
    coTravelModal.style.display = "none";
}

// Handle form submit
document.getElementById("coTravelForm").addEventListener("submit", async(e) => {
    e.preventDefault();

      // 1. Retrieve the logged-in user session
    const userSession = JSON.parse(localStorage.getItem('user_session'));

    // Check if user is logged in before proceeding
    if (!userSession || !userSession.token) {
        alert("Session expired. Please login again.");
        window.location.href = "./login.html";
        return;
    }

    
    const index = parseInt(document.getElementById("editIndex").value);

    const traveler = {
        title: document.getElementById("coTitle").value,
        travelerType: document.getElementById("coTravelerType").value,
        firstName: document.getElementById("coFirstName").value,
        lastName: document.getElementById("coLastName").value,
        middleName: document.getElementById("coMiddleName").value,
        email: document.getElementById("coEmail").value,
        gender: document.getElementById("coGender").value,
        phone: document.getElementById("coPhone").value,
        relation: document.getElementById("coRelationship").value,
        dob: document.getElementById("coDob").value,
        nationality: document.getElementById("coNationality").value,
        passport_number: document.getElementById("coPassportNumber").value,
        passport_expiry_date: document.getElementById("coExpiryDate").value
    };

    
 // 2. Gather all form data
    const payload = {
        id_user: userSession.id, // Attaching the owner's ID
        title: document.getElementById("coTitle").value,
        traveler_type: document.getElementById("coTravelerType").value,
        first_name: document.getElementById("coFirstName").value,
        last_name: document.getElementById("coLastName").value,
        middle_name: document.getElementById("coMiddleName").value,
        gender: document.getElementById("coGender").value,
        date_of_birth: document.getElementById("coDob").value,
        email: document.getElementById("coEmail").value,
        mobile_number: document.getElementById("coPhone").value,
        nationality: document.getElementById("coNationality").value,
        passport_number: document.getElementById("coPassportNumber").value,
        passport_expiry_date: document.getElementById("coExpiryDate").value
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
            errorDiv.textContent = data.message || "Failed to save co-traveler info";
            errorDiv.classList.remove("d-none");
        } else {
            alert("Co-traveler information saved successfully!");
            


    if (index >= 0) {
        coTravelers[index] = traveler;
    } else {
        coTravelers.push(traveler);
    }

    renderCoTravelers();
    e.target.reset();
    closeCoTravelModal();

            // Optional: reset the form or redirect
            // document.getElementById("travelInfoForm").reset();
        }
    } catch (err) {
        console.error("Submission error:", err);
        errorDiv.textContent = "Server error. Please try again later.";
        errorDiv.classList.remove("d-none");
    }



});

// Render travelers with Edit & Delete
function renderCoTravelers() {
    coTravelList.innerHTML = "";

    if (coTravelers.length === 0) {
        coTravelDetails.querySelector("p")?.remove();
        const msg = document.createElement("p");
        msg.innerHTML = `You have zero <strong>0</strong> other travelers.`;
        coTravelDetails.insertBefore(msg, coTravelList);
        return;
    } else {
        coTravelDetails.querySelector("p")?.remove();
    }

    coTravelers.forEach((traveler, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
      <strong>${traveler.title} ${traveler.firstName} ${traveler.lastName}</strong> (${traveler.relation}) <br>
      <small>Type: ${traveler.travelerType} | Gender: ${traveler.gender} | Phone: ${traveler.phone}</small><br>
      <small>Email: ${traveler.email} | DOB: ${traveler.dob}</small>
      <div style="margin-top:5px;">
        <span style="color:#0CA6EF;cursor:pointer;" onclick="openCoTravelModal(${index})"><strong>Edit</strong></span>
        &nbsp;|&nbsp;
        <i class="bi bi-trash" style="color:red;cursor:pointer;" onclick="deleteCoTraveler(${index})"></i>
      </div>
    `;
        coTravelList.appendChild(li);
    });
}

function deleteCoTraveler(index) {
    if (confirm("Are you sure you want to delete this co-traveler?")) {
        coTravelers.splice(index, 1);
        renderCoTravelers();
    }
}

// Close modal if clicked outside
window.addEventListener("click", (e) => {
    if (e.target === coTravelModal) closeCoTravelModal();
});

// ===============================
// SAVE PROFILE
// ===============================


// ===============================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ===============================

window.addEventListener("click", function (e) {
    if (e.target === modal) {
        closeModal();
    }
});


document.getElementById("travelInfoForm").addEventListener("submit", async (e) => {
    e.preventDefault();

  // 1. Retrieve the logged-in user session
    const userSession = JSON.parse(localStorage.getItem('user_session'));

    // Check if user is logged in before proceeding
    if (!userSession || !userSession.token) {
        alert("Session expired. Please login again.");
        window.location.href = "./login.html";
        return;
    }

    profileData = {
        title: document.getElementById("title").value,
        travelerType: document.getElementById("travelerType").value,
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        middleName: document.getElementById("middleName").value,
        gender: document.getElementById("gender").value,
        dob: document.getElementById("dob").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        nationality: document.getElementById("nationality").value,
        passportNumber: document.getElementById("passportNumber").value,
        expiryDate: document.getElementById("expiryDate").value
    };

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
            
    // Display on Profile Card
    profileDetails.innerHTML = `
    <div class="detail"><strong>Title:</strong> ${profileData.title}</div>
    <div class="detail"><strong>Traveler Type:</strong> ${profileData.travelerType}</div>
    <div class="detail"><strong>First Name:</strong> ${profileData.firstName}</div>
    <div class="detail"><strong>Last Name:</strong> ${profileData.lastName}</div>
    <div class="detail"><strong>Middle Name:</strong> ${profileData.middleName || "-"}</div>
    <div class="detail"><strong>Gender:</strong> ${profileData.gender}</div>
    <div class="detail"><strong>Date of Birth:</strong> ${profileData.dob}</div>
    <div class="detail"><strong>Email:</strong> ${profileData.email}</div>
    <div class="detail"><strong>Mobile:</strong> ${profileData.phone}</div>
    <div class="detail"><strong>Nationality:</strong> ${profileData.nationality}</div>
    <div class="detail"><strong>Passport No:</strong> ${profileData.passportNumber}</div>
    <div class="detail"><strong>Expiry Date:</strong> ${profileData.expiryDate}</div>
  `;

    closeModal();


            // Optional: reset the form or redirect
            // document.getElementById("travelInfoForm").reset();
        }
    } catch (err) {
        console.error("Submission error:", err);
        errorDiv.textContent = "Server error. Please try again later.";
        errorDiv.classList.remove("d-none");
    }

    
    const errorDiv = document.getElementById("error");
    const successDiv = document.getElementById("success"); // Optional: for success messages

  
   
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



        // // -------- Mock bookings --------
        // const BOOKINGS = [
        //   {
        //     id: "WK123ABC",
        //     lastName: "Okafor",
        //     status: "upcoming",
        //     from: "LOS (Lagos)",
        //     to: "ABV (Abuja)",
        //     date: "2025-09-12",
        //     time: "09:35",
        //     airline: "Air Peace",
        //     pnr: "8Y3KDL"
        //   },
        //   {
        //     id: "WK456DEF",
        //     lastName: "Adebayo",
        //     status: "completed",
        //     from: "ABV (Abuja)",
        //     to: "PHC (Port Harcourt)",
        //     date: "2025-06-03",
        //     time: "14:05",
        //     airline: "Arik Air",
        //     pnr: "M1ZTQX"
        //   },
        //   {
        //     id: "WK789GHI",
        //     lastName: "Okafor",
        //     status: "cancelled",
        //     from: "LOS (Lagos)",
        //     to: "ACC (Accra)",
        //     date: "2025-05-21",
        //     time: "19:15",
        //     airline: "Ibom Air",
        //     pnr: "Q9P2AA"
        //   },
        //   {
        //     id: "WK111JKL",
        //     lastName: "Oluwole",
        //     status: "upcoming",
        //     from: "LOS (Lagos)",
        //     to: "DXB (Dubai)",
        //     date: "2025-10-04",
        //     time: "22:30",
        //     airline: "Qatar Airways",
        //     pnr: "L7N3VR"
        //   }
        // ];

        // // -------- State --------
        // let currentFilter = "upcoming";
        // const $results = document.getElementById('booking-results'); // ✅ fixed
        // const $tabs = document.querySelectorAll('.tab');
        // const $bookingId = document.getElementById('bookingId');
        // const $lastName = document.getElementById('lastName');

        // // -------- Helpers --------
        // function formatDate(iso) {
        //   try {
        //     const d = new Date(iso + "T00:00:00");
        //     return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        //   } catch { return iso }
        // }

        // function render(list) {
        //   $results.innerHTML = '';
        //   if (!list.length) {
        //     $results.innerHTML = `
        //   <div class="empty">
        //     <strong>No trips found.</strong><br/>
        //     Try a different filter or search with your Booking ID & Last Name.
        //   </div>`;
        //     return;
        //   }
        //   const frag = document.createDocumentFragment();
        //   list.forEach(b => {
        //     const el = document.createElement('article');
        //     el.className = 'booking';
        //     el.innerHTML = `
        //   <div class="booking-header">
        //     <div>
        //       <div class="route">${b.from} → ${b.to}</div>
        //       <div class="meta">${b.airline} • ${formatDate(b.date)} • ${b.time}</div>
        //     </div>
        //   </div>`;
        //   });
        // }
   


   
        // const dummyFlights = [
        //   { airline: 'Airpeace', from: 'Abuja', to: 'Lagos', time: '10:30 AM', price: '$120' },
        //   { airline: 'Ibom Air', from: 'Abuja', to: 'Lagos', time: '1:00 PM', price: '$110' },
        //   { airline: 'Flyaero', from: 'Abuja', to: 'Lagos', time: '3:45 PM', price: '$130' }

        // ];

        // function searchFlights() {
        //   const from = document.getElementById('from').value;
        //   const to = document.getElementById('to').value;
        //   const date = document.getElementById('date').value;
        //   const resultsContainer = document.getElementById('results');
        // }
   
