const stateDropdown = document.getElementById("state");
const cityDropdown = document.getElementById("city");
const form = document.getElementById("registerForm");
const message = document.getElementById("message");


// ======================================
// LOAD INDIAN STATES
// ======================================

fetch("https://countriesnow.space/api/v0.1/countries/states", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        country: "India"
    })
})
.then(response => response.json())
.then(data => {

    // Clear existing options
    stateDropdown.innerHTML = '<option value="">Select State</option>';

    // Add states
    data.data.states.forEach(state => {

        const option = document.createElement("option");

        option.value = state.name;
        option.textContent = state.name;

        stateDropdown.appendChild(option);
    });

})
.catch(error => {

    console.error("State Load Error:", error);

    stateDropdown.innerHTML =
        '<option value="">Unable to Load States</option>';
});



// ======================================
// LOAD CITIES BASED ON STATE
// ======================================

stateDropdown.addEventListener("change", function () {

    const selectedState = this.value;

    cityDropdown.innerHTML =
        '<option value="">Loading Cities...</option>';

    // If no state selected
    if (!selectedState) {

        cityDropdown.innerHTML =
            '<option value="">Select City</option>';

        return;
    }

    fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            country: "India",
            state: selectedState
        })
    })

    .then(response => response.json())

    .then(data => {

        cityDropdown.innerHTML =
            '<option value="">Select City</option>';

        // Add cities
        data.data.forEach(city => {

            const option = document.createElement("option");

            option.value = city;
            option.textContent = city;

            cityDropdown.appendChild(option);
        });

    })

    .catch(error => {

        console.error("City Load Error:", error);

        cityDropdown.innerHTML =
            '<option value="">Unable to Load Cities</option>';
    });

});



// ======================================
// REGISTER DONOR
// ======================================

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    // Collect form data
    const donorData = {

        name: document.getElementById("name").value.trim(),

        age: document.getElementById("age").value.trim(),

        gender: document.getElementById("gender").value,

        blood_group: document.getElementById("bloodGroup").value,

        contact: document.getElementById("contact").value.trim(),

        email: document.getElementById("email").value.trim(),

        state: document.getElementById("state").value,

        city: document.getElementById("city").value
    };


    // ======================================
    // SIMPLE VALIDATION
    // ======================================

    if (
        !donorData.name ||
        !donorData.age ||
        !donorData.gender ||
        !donorData.blood_group ||
        !donorData.contact ||
        !donorData.email ||
        !donorData.state ||
        !donorData.city
    ) {

        message.innerText = "❌ Please fill all fields";
        message.style.color = "red";

        return;
    }


    // ======================================
    // SEND DATA TO FLASK BACKEND
    // ======================================

    try {

        const response = await fetch("/register_donor", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(donorData)
        });


        // Check server response
        if (!response.ok) {

            throw new Error(
                `Server Error: ${response.status}`
            );
        }


        // Convert response to JSON
        const data = await response.json();

        console.log("Server Response:", data);


        // Success Message
        message.innerText =
            data.message || "❤️ Donor Registered Successfully!";

        message.style.color = "green";
        message.style.fontWeight = "bold";


        // Animation
        message.animate([
            { transform: "scale(1)" },
            { transform: "scale(1.15)" },
            { transform: "scale(1)" }
        ], {
            duration: 500,
            iterations: 1
        });


        // Reset Form
        form.reset();

        cityDropdown.innerHTML =
            '<option value="">Select City</option>';

    }

    catch (error) {

        console.error("Registration Error:", error);

        message.innerText =
            "❌ Registration Failed. Check Backend/Flask Server.";

        message.style.color = "red";
    }

});
