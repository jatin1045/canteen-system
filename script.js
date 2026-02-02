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

    data.sort((a, b) => new Date(a.date) - new Date(b.date));

    data.forEach(r => {
        total += r.bill;
        rows += `
        <tr>
            <td>${r.date}</td>
            <td>${r.b ? "✔" : "✘"}</td>
            <td>${r.l ? "✔" : "✘"}</td>
            <td>${r.d ? "✔" : "✘"}</td>
            <td>${r.bill}</td>
        </tr>`;
    });

    document.getElementById("records").innerHTML = rows;
    document.getElementById("total").innerText =
        `💰 Total Amount: ₹${total}`;
}



function loadMonthlySummary(data) {
    const monthlyData = {};

    data.forEach(r => {
        const month = r.date.slice(0, 7); // YYYY-MM

        if (!monthlyData[month]) {
            monthlyData[month] = { days: 0, total: 0 };
        }

        if (r.bill > 0) {
            monthlyData[month].days += 1;
            monthlyData[month].total += r.bill;
        }
    });

    let rows = "";
    for (let m in monthlyData) {
        rows += `
        <tr>
            <td>${m}</td>
            <td>${monthlyData[m].days}</td>
            <td>${monthlyData[m].total}</td>
        </tr>`;
    }

    document.getElementById("monthly").innerHTML = rows;
}


loadRecords();

loadMonthlySummary(data);
