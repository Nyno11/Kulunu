
const API_URL_AUTOCOMPLETE = "https://api.kulunu.app/api/airports/autocomplete";

let departureIATA = "";
let arrivalIATA = "";

async function fetchAirports(keyword) {
    const res = await fetch(API_URL_AUTOCOMPLETE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword })
    });
    return res.json();
}

function setupAutocomplete(inputId, dropdownId, onSelect) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);

    input.addEventListener("input", async () => {
        const value = input.value.trim();
        dropdown.innerHTML = "";
        dropdown.style.display = "none";

        if (value.length < 3) return;

        const results = await fetchAirports(value);

        results.forEach(item => {
            const option = document.createElement("div");
            option.textContent = `${item.name} (${item.iataCode})`;
            option.onclick = () => {
                input.value = item.name;
                dropdown.style.display = "none";
                onSelect(item.iataCode);
            };
            dropdown.appendChild(option);
        });

        if (results.length) dropdown.style.display = "block";
    });

    document.addEventListener("click", (e) => {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = "none";
        }
    });
}

setupAutocomplete("departure", "departure-dropdown", (iata) => {
    departureIATA = iata;
});

setupAutocomplete("arrival", "arrival-dropdown", (iata) => {
    arrivalIATA = iata;
});



const searchBtn = document.querySelector(".search-btn");
const flightsList = document.getElementById("flightsList");
const errorDiv = document.getElementById("errorDiv");

searchBtn.addEventListener("click", async () => {


    const loader = document.getElementById('flightSearchLoader');
    const flightsList = document.getElementById('flightsList');
    const errorDiv = document.getElementById('errorDiv');
    if (!searchBtn) return;

    // Utility to toggle loader
    function setLoading(state) {
        if (!loader) return;
        loader.style.display = state ? 'block' : 'none';
        searchBtn.disabled = !!state;
    }

    // Hook into results rendering to hide loader when booking.js updates DOM
    const originalSetInner = flightsList ? flightsList.__lookupSetter__('innerHTML') : null;
    if (flightsList && !flightsList._kulunuObserver) {
        const mo = new MutationObserver(() => setLoading(false));
        mo.observe(flightsList, { childList: true, subtree: false });
        flightsList._kulunuObserver = mo;
    }

    // Also hide when errorDiv shows something
    if (errorDiv && !errorDiv._kulunuObserver) {
        const mo2 = new MutationObserver(() => setLoading(false));
        mo2.observe(errorDiv, { attributes: true, attributeFilter: ['class'], childList: true });
        errorDiv._kulunuObserver = mo2;
    }


    // Clear previous outputs
    if (flightsList) flightsList.innerHTML = '';
    if (errorDiv) { errorDiv.textContent = ''; errorDiv.classList.add('d-none'); }
    setLoading(true);

    try {
        // Trigger existing search logic if present
        // Many implementations bind listeners in core/booking.js; if it's using a button listener itself,
        // let it proceed naturally. We ensure loader stays until DOM updates via observers above.
        // If no external handler exists, we fallback to a simple fetch placeholder to demonstrate loader.

        // If booking.js defines a global function to start search, call it here instead (optional):
        // if (window.startFlightSearch) await window.startFlightSearch();
    } catch (err) {
        if (errorDiv) {
            errorDiv.textContent = 'Failed to search flights. Please try again.';
            errorDiv.classList.remove('d-none');
        }
    } finally {
        // If booking.js updates flightsList or errorDiv, MutationObserver will hide loader.
        // As a safety timeout, hide loader after 15s to avoid indefinite spinner.
        setTimeout(() => setLoading(false), 15000);
    }



    errorDiv.classList.add("d-none");
    flightsList.innerHTML = "";

    // 🔹 collected from previous autocomplete logic
    const origin = departureIATA;     // e.g. "LOS"
    const destination = arrivalIATA;  // e.g. "NBO"

    const departureDate = document.querySelector("input[type='date']").value;
    const returnDate = document.querySelector(".return").value;
    const adults = Number(document.querySelector("select").value);
    const travelClass = "ECONOMY";

    if (!origin || !destination || !departureDate) {
        errorDiv.textContent = "Missing required fields";
        errorDiv.classList.remove("d-none");
        return;
    }

    try {
        const res = await fetch("https://api.kulunu.app/api/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                origin,
                destination,
                departureDate,
                returnDate: returnDate || undefined,
                adults,
                travelClass
            })
        });

        const data = await res.json();

        renderFlights(data);


    } catch (err) {
        console.error(err);
        // errorDiv.textContent = "Server error";
        errorDiv.classList.remove("d-none");
    }
});

function getRating() {
    const bias = Math.random() ** 0.6; // lower = more high ratings
    const rating = 3.5 + bias * (5.0 - 3.5);
    return Number(rating.toFixed(1));
}

function getTimeEmoji(takeOffTime) {
    const hour = new Date(takeOffTime).getHours();
    return (hour >= 18 || hour < 6) ? "🌙" : "☀️";
}

let currentDictionaries = null;

let allAvailableFlights = [];
const options = document.querySelectorAll('.filter-option');
options.forEach(option => {
    option.addEventListener('click', () => {
        options.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        if (!allAvailableFlights || allAvailableFlights.length === 0) return;

        const criteria = option.dataset.filter;
        const sorted = [...allAvailableFlights];

        if (criteria === 'price') {
            // Descending: highest price first
            sorted.sort((a, b) => parseFloat(b.price.total) - parseFloat(a.price.total));
        } else if (criteria === 'rating') {
            // Descending: highest rating first
            sorted.sort((a, b) => (b._rating || 0) - (a._rating || 0));
        } else if (criteria === 'weather') {
            // Descending: treat night as higher; night first
            sorted.sort((a, b) => (b._isNight ? 1 : 0) - (a._isNight ? 1 : 0));
        } else if (criteria === 'time') {
            // Descending: latest departure first
            sorted.sort((a, b) => (b._depTimeMs ?? Date.parse(b.itineraries[0].segments[0].departure.at)) - (a._depTimeMs ?? Date.parse(a.itineraries[0].segments[0].departure.at)));
        }

        // Update in-memory list to reflect current ordering
        allAvailableFlights = sorted;

        renderFlights({ data: sorted, dictionaries: currentDictionaries || undefined });
    });
});


function renderFlights(response) {

    // Clear previous results to avoid accumulating cards on each render
    flightsList.innerHTML = "";

    const offers = response.data;
    // Enrich and store for filtering/sorting later
    const enriched = (offers || []).map(offer => {
        try {
            const seg = offer.itineraries?.[0]?.segments?.[0];
            const depAt = seg?.departure?.at;
            const depMs = depAt ? Date.parse(depAt) : null;
            const rating = offer._rating ?? getRating();
            const isNight = depMs !== null ? (new Date(depMs).getHours() >= 18 || new Date(depMs).getHours() < 6) : false;
            return { ...offer, _rating: rating, _depTimeMs: depMs, _isNight: isNight };
        } catch (_) {
            return { ...offer, _rating: getRating() };
        }
    });
    allAvailableFlights = enriched;

    if (!offers || offers.length === 0) {
        flightsList.innerHTML = "<div class='card m-4 p-3'><p>No flights found</p></div>";
        return;
    }

    const filterBar = document.getElementById("filterBar");
    filterBar.classList.remove("d-none");

    currentDictionaries = response.dictionaries || currentDictionaries;
    const carriers = (response.dictionaries && response.dictionaries.carriers) || (currentDictionaries && currentDictionaries.carriers) || {};


    enriched.forEach(offer => {
        const itinerary = offer.itineraries[0];
        const segment = itinerary.segments[0];

        const airlineCode = segment.carrierCode;
        const airlineName = carriers[airlineCode] || airlineCode;

        const flightCard = document.createElement("div");
        flightCard.className = "flight-card ticket card m-4 p-3";

        flightCard.innerHTML = `
  
      <div class="airline-header ">
        <h3>    <strong>${airlineName}</strong> (${airlineCode} ${segment.number})</h3>
      </div>
          <div>
        ${segment.departure.iataCode}
        (${new Date(segment.departure.at).toLocaleTimeString()})
        →
        ${segment.arrival.iataCode}
        (${new Date(segment.arrival.at).toLocaleTimeString()})
      </div>

      <p><strong>From:</strong> ${segment.departure.iataCode}</p>
      <p><strong>To:</strong> ${segment.arrival.iataCode}</p>
      <div class="flight-info-row">
        <p>🕒 <strong>Time:</strong> ${itinerary.duration.replace("PT", "").replace("H", "h ").replace("M", "m")}</p>
        <p>💰 <strong>Price:</strong> ${offer.price.currency} ${offer.price.total}</p>
  
        <p>⭐ <strong>Rating:</strong> ${offer._rating ?? getRating()}</p>
        <p>  <strong>Weather:</strong>${getTimeEmoji(segment.departure.at)}</p>

      </div>
      <button class="buy-button primary-btn" onclick='bookFlight(${segment})'>Book Now</button>



    `;

        flightsList.appendChild(flightCard);
    });
}


function bookFlight(flight) {
    // Get stored travelers
    const primary = JSON.parse(localStorage.getItem("primaryTraveler"));
    const coTravelers = JSON.parse(localStorage.getItem("coTravelers")) || [];

    // Format passengers
    let passengers = [];
    if (primary) {
        passengers.push({
            name: `${primary.firstName} ${primary.lastName}`,
            type: primary.travelerType
        });
    }
    coTravelers.forEach(c => {
        passengers.push({
            name: `${c.firstName} ${c.lastName}`,
            type: c.travelerType
        });
    });

    // Save booking data
    const bookingData = {
        travelInfo: {
            from: flight.departure.iataCode,
            to: flight.arrival.iataCode,
            date: new Date().toISOString().split("T")[0], // could pull from search form
            // time: flight.time,
            // cabin: "Economy",
            // price: flight.price,
            // airline: flight.airline
        },
        passengers
    };

    localStorage.setItem("bookingData", JSON.stringify(bookingData));
    window.location.href = "confirm.html";
}

// try {
//     const res = await fetch("https://api.kulunu.app/api/airports/autocomplete", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//             "keyword": "LOS"
//         })
//     });

//     const data = await res.json();
//     console.error(data);
//     if (!data.success) {
//         errorDiv.textContent = data.message;
//         errorDiv.classList.remove("d-none");
//     } else {
//         console.log(data.data['full_name'])
//         alert("Login successful! Welcome " + data.data['full_name']);
//         // redirect or save token/session here
//     }
// } catch (err) {
//     console.error(err);
//     errorDiv.textContent = "Server error";
//     errorDiv.classList.remove("d-none");
// }


