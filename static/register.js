const stateDropdown = document.getElementById("state");
const cityDropdown = document.getElementById("city");
const form = document.getElementById("registerForm");
const message = document.getElementById("message");


// ======================================
// LOAD STATES
// ======================================

async function loadStates() {

    try {

        const response = await fetch(
            "https://countriesnow.space/api/v0.1/countries/states",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    country: "India"
                })
            }
        );

        const result = await response.json();

        console.log("States API:", result);

        stateDropdown.innerHTML =
            '<option value="">Select State</option>';

        // FIXED
        const states = result.data.states;

        states.forEach(state => {

            const option = document.createElement("option");

            option.value = state.name;
            option.textContent = state.name;

            stateDropdown.appendChild(option);
        });

    }

    catch (error) {

        console.error("State Load Error:", error);

        stateDropdown.innerHTML =
            '<option value="">Unable to Load States</option>';
    }
}


// ======================================
// LOAD CITIES
// ======================================

async function loadCities(stateName) {

    try {

        cityDropdown.innerHTML =
            '<option value="">Loading Cities...</option>';

        const response = await fetch(
            "https://countriesnow.space/api/v0.1/countries/state/cities",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    country: "India",
                    state: stateName
                })
            }
        );

        const result = await response.json();

        console.log("Cities API:", result);

        cityDropdown.innerHTML =
            '<option value="">Select City</option>';

        // FIXED
        const cities = result.data;

        cities.forEach(city => {

            const option = document.createElement("option");

            option.value = city;
            option.textContent = city;

            cityDropdown.appendChild(option);
        });

    }

    catch (error) {

        console.error("City Load Error:", error);

        cityDropdown.innerHTML =
            '<option value="">Unable to Load Cities</option>';
    }
}


// ======================================
// STATE CHANGE EVENT
// ======================================

stateDropdown.addEventListener("change", function () {

    const selectedState = this.value;

    if (!selectedState) {

        cityDropdown.innerHTML =
            '<option value="">Select City</option>';

        return;
    }

    loadCities(selectedState);
});


// ======================================
// REGISTER DONOR
// ======================================

form.addEventListener("submit", async function (e) {

    e.preventDefault();

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


    // VALIDATION
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


    try {

        const response = await fetch("/register_donor", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(donorData)
        });


        if (!response.ok) {

            throw new Error(
                `HTTP Error: ${response.status}`
            );
        }


        const data = await response.json();

        console.log("Server Response:", data);


        message.innerText =
            data.message || "❤️ Donor Registered Successfully!";

        message.style.color = "green";


        form.reset();

        cityDropdown.innerHTML =
            '<option value="">Select City</option>';

    }

    catch (error) {

        console.error("Registration Error:", error);

        message.innerText =
            "❌ Registration Failed";

        message.style.color = "red";
    }

});


// ======================================
// INITIAL LOAD
// ======================================

loadStates();
