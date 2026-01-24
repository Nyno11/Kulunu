



document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorDiv = document.getElementById("error");
    errorDiv.classList.add("d-none");

    try {
        const res = await fetch("https://api.kulunu.app/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        console.error(data);
        if (!data.success) {
            errorDiv.textContent = data.message;
            errorDiv.classList.remove("d-none");
        } else {
            // 1. Convert object to JSON string
            const userString = JSON.stringify(data.data);

            // 2. Save to LocalStorage (Key, Value)
            localStorage.setItem('user_session', userString);

            // 3. Redirect to dashboard
            window.location.href = "./dashboard.html";
            console.log(data);
            console.log(data.data['full_name'])
            alert("Login successful! Welcome " + data.data['full_name']);
            // redirect or save token/session here
        }
    } catch (err) {
        console.error(err);
        errorDiv.textContent = "Server error";
        errorDiv.classList.remove("d-none");
    }
});



document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const full_name = document.getElementById("fullnamesignup").value;
    const email = document.getElementById("emailsignup").value;
    const password = document.getElementById("passwordsignup").value;
    const errorDiv = document.getElementById("error");
    errorDiv.classList.add("d-none");

    try {
        const res = await fetch("https://api.kulunu.app/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ full_name, email, password, role: "customer" })
        });

        const data = await res.json();
        console.error(data);
        if (!data.success) {
            errorDiv.textContent = data.message;
            errorDiv.classList.remove("d-none");
        } else {
            console.log(data.data['full_name'])
            alert("Signup successful! Welcome " + data.data['full_name']);
            // redirect or save token/session here
        }
    } catch (err) {
        console.error(err);
        errorDiv.textContent = "Server error";
        errorDiv.classList.remove("d-none");
    }
});
