const user = JSON.parse(localStorage.getItem("currentUser"));
if (!user) window.location.href = "./login.html";

document.getElementById("welcome").innerText =
    `Welcome ${user.name} (Card: ${user.card})`;

const STORAGE_KEY = "canteen_" + user.card;

function saveRecord() {
    const date = document.getElementById("date").value;
    if (!date) return alert("Select a date");

    const record = {
        date,
        b: document.getElementById("b").checked,
        l: document.getElementById("l").checked,
        d: document.getElementById("d").checked
    };

    record.bill =
        (record.b ? 38 : 0) +
        (record.l ? 58 : 0) +
        (record.d ? 58 : 0);

    let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // Prevent duplicate date entry
    data = data.filter(r => r.date !== date);
    data.push(record);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    loadRecords();
}

function loadRecords() {
    let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    let total = 0;
    let rows = "";

    data.forEach(r => {
        total += r.bill;
        rows += `
            <tr>
                <td>${r.date}</td>
                <td>${r.b ? "✔" : "✘"}</td>
                <td>${r.l ? "✔" : "✘"}</td>
                <td>${r.d ? "✔" : "✘"}</td>
                <td>${r.bill}</td>
            </tr>
        `;
    });

    document.getElementById("records").innerHTML = rows;
    document.getElementById("total").innerText =
        `💰 Total Amount: ₹${total}`;

    // 🔥 THIS LINE IS REQUIRED
    loadMonthlySummary(data);
}




function loadMonthlySummary(data) {
    const monthly = {};

    data.forEach(record => {
        if (record.bill === 0) return;

        // Extract YYYY-MM
        const month = record.date.substring(0, 7);

        if (!monthly[month]) {
            monthly[month] = {
                days: 0,
                total: 0
            };
        }

        monthly[month].days += 1;
        monthly[month].total += record.bill;
    });

    let rows = "";

    for (let month in monthly) {
        rows += `
            <tr>
                <td>${month}</td>
                <td>${monthly[month].days}</td>
                <td>${monthly[month].total}</td>
            </tr>
        `;
    }

    document.getElementById("monthly").innerHTML =
        rows || "<tr><td colspan='3'>No data</td></tr>";
}



loadRecords();

loadMonthlySummary(data);

