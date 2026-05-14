const stateDropdown = document.getElementById("state");
const cityDropdown = document.getElementById("city");

// Load States
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
});

// Load Cities when state changes
stateDropdown.addEventListener("change", function() {

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
    });
});


// Search Donors
function searchDonors() {

    const blood = document.getElementById("bloodGroup").value;
    const state = document.getElementById("state").value;
    const city = document.getElementById("city").value;

    fetch("/search_donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blood, state, city })
    })
    .then(res => res.json())
    .then(data => {

        const results = document.getElementById("results");
        results.innerHTML = "";

        if (data.length === 0) {
            results.innerHTML = `
                <tr>
                    <td colspan="7">No donors found</td>
                </tr>
            `;
            return;
        }

        data.forEach(donor => {
           results.innerHTML += `
<tr>
    <td>${donor.name}</td>
    <td><span class="blood-badge">${donor.blood_group}</span></td>
    <td>${donor.age}</td>
    <td>${donor.gender}</td>
    <td>${donor.contact}</td>
    <td>${donor.email}</td>
    <td class="status available">Available</td>
</tr>
`;
        });

    });  // ✅ THIS WAS MISSING

}  // ✅ function closed properly
