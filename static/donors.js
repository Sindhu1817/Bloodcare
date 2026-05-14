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
// SEARCH DONORS
// ======================================

function searchDonors() {

    const blood =
        document.getElementById("bloodGroup").value;

    const state =
        document.getElementById("state").value;

    const city =
        document.getElementById("city").value;


    fetch("/search_donors", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            blood,
            state,
            city
        })

    })

    .then(response => response.json())

    .then(data => {

        const results =
            document.getElementById("results");

        results.innerHTML = "";


        // NO DONORS

        if (!data || data.length === 0) {

            results.innerHTML = `
                <tr>
                    <td colspan="7">
                        No donors found
                    </td>
                </tr>
            `;

            return;
        }


        // SHOW DONORS

        data.forEach(donor => {

            results.innerHTML += `

                <tr>

                    <td>${donor.name}</td>

                    <td>
                        <span class="blood-badge">
                            ${donor.blood_group}
                        </span>
                    </td>

                    <td>${donor.age}</td>

                    <td>${donor.gender}</td>

                    <td>${donor.contact}</td>

                    <td>${donor.email}</td>

                    <td class="status available">
                        Available
                    </td>

                </tr>

            `;

        });

    })

    .catch(error => {

        console.log("Search Error:", error);

        document.getElementById("results").innerHTML = `

            <tr>
                <td colspan="7">
                    Something went wrong
                </td>
            </tr>

        `;

    });

}
