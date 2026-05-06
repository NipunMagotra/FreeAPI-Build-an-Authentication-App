const API_BASE_URL = "https://api.freeapi.app/api/v1";

let isLoading = false;

const elements = {
    loginTab: document.getElementById("loginTab"),
    registerTab: document.getElementById("registerTab"),
    loginForm: document.getElementById("loginForm"),
    registerForm: document.getElementById("registerForm"),
    authSection: document.getElementById("authSection"),
    profileSection: document.getElementById("profileSection"),
    profileContent: document.getElementById("profileContent"),
    messages: document.getElementById("messages"),
    loginBtn: document.getElementById("loginBtn"),
    registerBtn: document.getElementById("registerBtn"),
    logoutBtn: document.getElementById("logoutBtn")
};

function showMessage(text, type = "success") {
    const bgColor = type === "success" ? "bg-green-100 border-green-400 text-green-700" : "bg-red-100 border-red-400 text-red-700";
    elements.messages.innerHTML = `<div class="${bgColor} border px-4 py-3 rounded-md mb-4">${text}</div>`;
    setTimeout(() => elements.messages.innerHTML = "", 5000);
}

function setLoading(button, isLoading) {
    button.disabled = isLoading;
    button.innerHTML = isLoading ? `<span class="animate-spin mr-2">⏳</span> Loading...` : button.id === "loginBtn" ? "Login" : button.id === "registerBtn" ? "Register" : "Logout";
}

function toggleAuthTabs(activeTab) {
    if (activeTab === "login") {
        elements.loginTab.classList.add("text-gray-900", "border-b-2", "border-gray-900");
        elements.loginTab.classList.remove("text-gray-500");
        elements.registerTab.classList.add("text-gray-500");
        elements.registerTab.classList.remove("text-gray-900", "border-b-2", "border-gray-900");
        elements.loginForm.classList.remove("hidden");
        elements.registerForm.classList.add("hidden");
    } else {
        elements.registerTab.classList.add("text-gray-900", "border-b-2", "border-gray-900");
        elements.registerTab.classList.remove("text-gray-500");
        elements.loginTab.classList.add("text-gray-500");
        elements.loginTab.classList.remove("text-gray-900", "border-b-2", "border-gray-900");
        elements.registerForm.classList.remove("hidden");
        elements.loginForm.classList.add("hidden");
    }
}

async function handleLogin(e) {
    e.preventDefault();
    if (isLoading) return;
    isLoading = true;
    setLoading(elements.loginBtn, true);
    
    try {
        const username = document.getElementById("loginUsername").value;
        const password = document.getElementById("loginPassword").value;
        
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
            credentials: "include"
        });
        
        const data = await response.json();
        if (response.ok && data.success) {
            showMessage("Login successful!");
            await fetchCurrentUser();
        } else {
            showMessage(data.message || "Login failed", "error");
        }
    } catch (error) {
        showMessage("An error occurred during login", "error");
    } finally {
        isLoading = false;
        setLoading(elements.loginBtn, false);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    if (isLoading) return;
    isLoading = true;
    setLoading(elements.registerBtn, true);
    
    try {
        const username = document.getElementById("registerUsername").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        const role = document.getElementById("registerRole").value;
        
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password, role }),
            credentials: "include"
        });
        
        const data = await response.json();
        if (response.ok && data.success) {
            showMessage("Registration successful! Please login.");
            toggleAuthTabs("login");
        } else {
            showMessage(data.message || "Registration failed", "error");
        }
    } catch (error) {
        showMessage("An error occurred during registration", "error");
    } finally {
        isLoading = false;
        setLoading(elements.registerBtn, false);
    }
}

async function handleLogout() {
    if (isLoading) return;
    isLoading = true;
    setLoading(elements.logoutBtn, true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/logout`, {
            method: "POST",
            credentials: "include"
        });
        
        const data = await response.json();
        if (response.ok && data.success) {
            showMessage("Logout successful!");
            elements.authSection.classList.remove("hidden");
            elements.profileSection.classList.add("hidden");
            elements.loginForm.reset();
            elements.registerForm.reset();
        } else {
            showMessage(data.message || "Logout failed", "error");
        }
    } catch (error) {
        showMessage("An error occurred during logout", "error");
    } finally {
        isLoading = false;
        setLoading(elements.logoutBtn, false);
    }
}

async function fetchCurrentUser() {
    try {
        const response = await fetch(`${API_BASE_URL}/users/current-user`, {
            credentials: "include"
        });
        
        const data = await response.json();
        if (response.ok && data.success) {
            const user = data.data;
            elements.profileContent.innerHTML = `
                <div class="border-b border-gray-200 py-2"><strong>Username:</strong> ${user.username}</div>
                <div class="border-b border-gray-200 py-2"><strong>Email:</strong> ${user.email}</div>
                <div class="border-b border-gray-200 py-2"><strong>Role:</strong> ${user.role}</div>
                <div class="py-2"><strong>ID:</strong> ${user._id}</div>
            `;
            elements.authSection.classList.add("hidden");
            elements.profileSection.classList.remove("hidden");
        } else {
            elements.authSection.classList.remove("hidden");
            elements.profileSection.classList.add("hidden");
        }
    } catch (error) {
        elements.authSection.classList.remove("hidden");
        elements.profileSection.classList.add("hidden");
    }
}

// Event listeners
elements.loginTab.addEventListener("click", () => toggleAuthTabs("login"));
elements.registerTab.addEventListener("click", () => toggleAuthTabs("register"));
elements.loginForm.addEventListener("submit", handleLogin);
elements.registerForm.addEventListener("submit", handleRegister);
elements.logoutBtn.addEventListener("click", handleLogout);

// Check if user is already logged in on page load
fetchCurrentUser();
