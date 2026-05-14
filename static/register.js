const stateDropdown = document.getElementById("state");
const cityDropdown = document.getElementById("city");

// ===============================
// LOAD ALL INDIAN STATES
// ===============================

fetch("https://countriesnow.space/api/v0.1/countries/states", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ country: "India" })
})
.then(res => res.json())
.then(data => {
    data.data.states.forEach(state => {
        const option = document.createElement("option");
        option.value = state.name;
        option.textContent = state.name;
        stateDropdown.appendChild(option);
    });
})
.catch(error => console.log("State Load Error:", error));


// ===============================
// LOAD CITIES BASED ON STATE
// ===============================

stateDropdown.addEventListener("change", function () {

    cityDropdown.innerHTML = '<option value="">Select City</option>';

    fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            country: "India",
            state: this.value
        })
    })
    .then(res => res.json())
    .then(data => {
        data.data.forEach(city => {
            const option = document.createElement("option");
            option.value = city;
            option.textContent = city;
            cityDropdown.appendChild(option);
        });
    })
    .catch(error => console.log("City Load Error:", error));
});


// ===============================
// REGISTER DONOR
// ===============================

document.getElementById("registerForm").addEventListener("submit", function (e) {

    e.preventDefault();   // prevent page reload

    const donorData = {
        name: document.getElementById("name").value,
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        blood_group: document.getElementById("bloodGroup").value,
        contact: document.getElementById("contact").value,
        email: document.getElementById("email").value,
        state: document.getElementById("state").value,
        city: document.getElementById("city").value
    };

    fetch("/register_donor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donorData)
    })
    .then(response => response.json())
    .then(data => {

        console.log("Server Response:", data);

        const message = document.getElementById("message");

        // Always show success message
        message.innerText = data.message || "❤️ Registered Successfully!";
        message.style.color = "limegreen";
        message.style.fontWeight = "600";

        // Heartbeat animation
        message.animate([
            { transform: "scale(1)" },
            { transform: "scale(1.2)" },
            { transform: "scale(1)" }
        ], {
            duration: 600,
            iterations: 2
        });

        document.getElementById("registerForm").reset();
        cityDropdown.innerHTML = '<option value="">Select City</option>';
    })
    .catch(error => {
        console.error("Registration Error:", error);

        const message = document.getElementById("message");
        message.innerText = "❌ Something went wrong. Try again.";
        message.style.color = "red";
    });
});
