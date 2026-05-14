const stateDropdown = document.getElementById("state");
const cityDropdown = document.getElementById("city");


// ======================================
// LOAD STATES
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

    if (!data.data || !data.data.states) {
        console.log("States not found");
        return;
    }

    data.data.states.forEach(state => {

        const option = document.createElement("option");

        option.value = state.name;
        option.textContent = state.name;

        stateDropdown.appendChild(option);

    });

})

.catch(error => {
    console.log("State Load Error:", error);
});




// ======================================
// LOAD CITIES
// ======================================

stateDropdown.addEventListener("change", function () {

    cityDropdown.innerHTML =
        '<option value="">Select City</option>';

    if (!this.value) return;

    fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            country: "India",
            state: this.value
        })

    })

    .then(response => response.json())

    .then(data => {

        if (!data.data) {
            console.log("Cities not found");
            return;
        }

        data.data.forEach(city => {

            const option = document.createElement("option");

            option.value = city;
            option.textContent = city;

            cityDropdown.appendChild(option);

        });

    })

    .catch(error => {
        console.log("City Load Error:", error);
    });

});




// ======================================
// REGISTER DONOR
// ======================================

document.getElementById("registerForm")
.addEventListener("submit", function (e) {

    e.preventDefault();

    const donorData = {

        name:
            document.getElementById("name").value,

        age:
            document.getElementById("age").value,

        gender:
            document.getElementById("gender").value,

        blood_group:
            document.getElementById("bloodGroup").value,

        contact:
            document.getElementById("contact").value,

        email:
            document.getElementById("email").value,

        state:
            document.getElementById("state").value,

        city:
            document.getElementById("city").value

    };


    fetch("/register_donor", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(donorData)

    })

    .then(response => response.json())

    .then(data => {

        console.log("Server Response:", data);

        const message =
            document.getElementById("message");


        message.innerText =
            data.message || "❤️ Registered Successfully!";

        message.style.color = "limegreen";

        message.style.fontWeight = "600";


        // Animation

        message.animate([

            { transform: "scale(1)" },

            { transform: "scale(1.1)" },

            { transform: "scale(1)" }

        ], {

            duration: 500,
            iterations: 2

        });


        // Reset form

        document.getElementById("registerForm").reset();

        cityDropdown.innerHTML =
            '<option value="">Select City</option>';

    })

    .catch(error => {

        console.log("Registration Error:", error);

        const message =
            document.getElementById("message");

        message.innerText =
            "❌ Something went wrong. Try again.";

        message.style.color = "red";

    });

});
