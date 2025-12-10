// ('


try {
    const res = await fetch("http://localhost:8080/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "origin": "LOS",
            "destination": "NBO",
            "departureDate": "2025-12-12",
            "returnDate": "2025-12-18",
            "adults": 1,
            "travelClass": "ECONOMY"
        })
    });

    const data = await res.json();
    console.error(data);
    if (!data.success) {
        errorDiv.textContent = data.message;
        errorDiv.classList.remove("d-none");
    } else {
        console.log(data.data['full_name'])
        alert("Login successful! Welcome " + data.data['full_name']);
        // redirect or save token/session here
    }
} catch (err) {
    console.error(err);
    errorDiv.textContent = "Server error";
    errorDiv.classList.remove("d-none");
}



try {
    const res = await fetch("http://localhost:8080/api/airports/autocomplete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "keyword": "LOS"
        })
    });

    const data = await res.json();
    console.error(data);
    if (!data.success) {
        errorDiv.textContent = data.message;
        errorDiv.classList.remove("d-none");
    } else {
        console.log(data.data['full_name'])
        alert("Login successful! Welcome " + data.data['full_name']);
        // redirect or save token/session here
    }
} catch (err) {
    console.error(err);
    errorDiv.textContent = "Server error";
    errorDiv.classList.remove("d-none");
}


