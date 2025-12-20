// Run this script at the top of your dashboard.html

// 1. Get the string back
const storedUser = localStorage.getItem('user_session');

if (storedUser) {
    // 2. Turn it back into an Object
    const user = JSON.parse(storedUser);

    console.log(user);
    console.log("Welcome back, " + user.full_name);

    // Example: Display user name in the UI
    document.getElementById('username-display').innerText = user.full_name;

    // You can now access the token for API calls
    const authToken = user.token;

} else {
    // 3. No user found? Kick them back to login
    window.location.href = "/index.html";
}
