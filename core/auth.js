


const modal = document.getElementById('loginModal');
const openBtn = document.getElementById('openLoginModal');
const closeBtn = document.getElementById('closeLoginModal');

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const forgotForm = document.getElementById('forgotForm');
const verifyForm = document.getElementById('verifyForm');
const resetForm = document.getElementById('resetForm');

const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');

const toSignup = document.getElementById('toSignup');
const toLogin = document.querySelectorAll('#toLogin');
const backToLogin = document.getElementById('backToLogin');

const sendCodeBtn = document.getElementById('sendCodeBtn');
const confirmCodeBtn = document.getElementById('confirmCodeBtn');
const resetPasswordBtn = document.getElementById('resetPasswordBtn');

let email = '';
let verifyCode = '';
// Open modal
openBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

// Close modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
});

// Utility
function hideAllForms() {
    loginForm.classList.remove('active');
    signupForm.classList.remove('active');
    forgotForm.classList.remove('active');
    verifyForm.classList.remove('active');
    resetForm.classList.remove('active');
}

// Tabs
loginTab.addEventListener('click', () => {
    hideAllForms();
    loginForm.classList.add('active');
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
});

signupTab.addEventListener('click', () => {
    hideAllForms();
    signupForm.classList.add('active');
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
});

// Switch links
toSignup.addEventListener('click', e => {
    e.preventDefault();
    signupTab.click();
});

toLogin.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        loginTab.click();
    });
});

// Forgot Password
document.getElementById('toLogin').addEventListener('click', e => {
    e.preventDefault();
    hideAllForms();
    forgotForm.classList.add('active');
    loginTab.classList.remove('active');
    signupTab.classList.remove('active');
});

// Back to login
backToLogin.addEventListener('click', e => {
    e.preventDefault();
    loginTab.click();
});






document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    email = document.getElementById("email").value;
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
            window.location.href = "./index.html";
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
    email = document.getElementById("emailsignup").value;
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
            const userString = JSON.stringify(data.data);

            // 2. Save to LocalStorage (Key, Value)
            localStorage.setItem('user_session', userString);

            // 3. Redirect to dashboard
            window.location.href = "./index.html";
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




document.getElementById("forgotForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    email = document.getElementById("forgotEmail").value;
    const errorDiv = document.getElementById("forgotError");
    errorDiv.classList.add("d-none");

    try {
        const res = await fetch("https://api.kulunu.app/sendresetemail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const data = await res.json();
        console.error(data);
        if (!data.success) {
            errorDiv.textContent = data.message;
            errorDiv.classList.remove("d-none");
        } else {
            // 3. Redirect to dashboard
            forgotForm.classList.remove('active');
            verifyForm.classList.add('active');
            console.log(data);
            alert("Reset email sent successfully!");
            // redirect or save token/session here
        }
    } catch (err) {
        console.error(err);
        errorDiv.textContent = "Server error";
        errorDiv.classList.remove("d-none");
    }
});


document.getElementById("verifyForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const errorDiv = document.getElementById("verifyError");
    errorDiv.classList.add("d-none");
    verifyCode = document.getElementById("verifyCode").value

    if (verifyCode === "") {
        const errorDiv = document.getElementById("verifyError");
        errorDiv.classList.remove("d-none");
        return;
    }

    verifyForm.classList.remove('active');
    resetForm.classList.add('active');
});





document.getElementById("resetForm").addEventListener("submit", async (e) => {

    e.preventDefault();


    const password = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorDiv = document.getElementById("resetError");
    errorDiv.classList.add("d-none");

    try {
        const res = await fetch("https://api.kulunu.app/resetpassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                passwordtoken: verifyCode,
                newpassword: password,
                newpasswordrepeat: confirmPassword,
            })
        });

        const data = await res.json();
        console.error(data);
        if (!data.success) {
            errorDiv.textContent = data.message;
            errorDiv.classList.remove("d-none");
        } else {
            // 3. Redirect to dashboard\
            hideAllForms();
            modal.style.display = 'none';
            console.log(data);
            alert("Password changed successfully!");
            // redirect or save token/session here
        }
    } catch (err) {
        console.error(err);
        errorDiv.textContent = "Server error";
        errorDiv.classList.remove("d-none");
    }
});

//
// resetForm