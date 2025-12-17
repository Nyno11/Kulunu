
const API_URL_AUTOCOMPLETE = "http://localhost:8080/api/airports/autocomplete";

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
        const res = await fetch("http://localhost:8080/api/search", {
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
        errorDiv.textContent = "Server error";
        errorDiv.classList.remove("d-none");
    }
});



function renderFlights(response) {

    const offers = response.data;
    const carriers = response.dictionaries.carriers;

    if (!offers || offers.length === 0) {
        flightsList.innerHTML = "<p>No flights found</p>";
        return;
    }

    offers.forEach(offer => {
        const itinerary = offer.itineraries[0];
        const segment = itinerary.segments[0];

        const airlineCode = segment.carrierCode;
        const airlineName = carriers[airlineCode] || airlineCode;

        const flightCard = document.createElement("div");
        flightCard.className = "flight-card ticket";

        flightCard.innerHTML = `
  
      <div class="airline-header">
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

      </div>
      <button class="buy-button" onclick='bookFlight(${segment})'>Book Now</button>



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
//     const res = await fetch("http://localhost:8080/api/airports/autocomplete", {
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


