let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const form = document.getElementById("expenseForm");
const message = document.getElementById("message");

function showMoney(number) {
    return "LKR " + Number(number).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const type = document.getElementById("type").value;
    const description = document.getElementById("description").value.trim();
    const amountText = document.getElementById("amount").value;
    const amount = Number(amountText);
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    if (
        description === "" ||
        amountText === "" ||
        isNaN(amount) ||
        amount <= 0 ||
        category === "" ||
        date === ""
    ) {
        message.textContent =
            "Please fill in every field. Amount must be above zero.";
        return;
    }

    const transaction = {
        type: type,
        description: description,
        amount: amount,
        category: category,
        date: date
    };

    transactions.push(transaction);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    form.reset();
    message.textContent = "";
    showTransactions();
});

document.getElementById("clearForm").addEventListener("click", function() {
    form.reset();
    message.textContent = "";
});

document.getElementById("filter").addEventListener("change", showTransactions);

document.getElementById("search").addEventListener("input", showTransactions);

function showTransactions() {
    const rows = document.getElementById("rows");
    const filter = document.getElementById("filter").value;
    const search = document.getElementById("search").value.toLowerCase();

    let totalIncome = 0;
    let totalExpenses = 0;

    rows.innerHTML = "";

    transactions.forEach(function(transaction, index) {
        if (transaction.type === "Income") {
            totalIncome = totalIncome + Number(transaction.amount);
        } else {
            totalExpenses = totalExpenses + Number(transaction.amount);
        }

        const correctType =
            filter === "All" || transaction.type === filter;

        const words =
            (transaction.description + " " + transaction.category).toLowerCase();

        const correctSearch = words.includes(search);

        if (!correctType || !correctSearch) {
            return;
        }

        const row = document.createElement("tr");

        const dateCell = document.createElement("td");
        dateCell.textContent = transaction.date;
        row.appendChild(dateCell);

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = transaction.description;
        row.appendChild(descriptionCell);

        const typeCell = document.createElement("td");
        typeCell.textContent = transaction.type;
        row.appendChild(typeCell);

        const categoryCell = document.createElement("td");
        categoryCell.textContent = transaction.category;
        row.appendChild(categoryCell);

        const amountCell = document.createElement("td");

        if (transaction.type === "Income") {
            amountCell.textContent = "+ " + showMoney(transaction.amount);
        } else {
            amountCell.textContent = "- " + showMoney(transaction.amount);
        }

        row.appendChild(amountCell);

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "btn btn-danger btn-sm";

        deleteButton.addEventListener("click", function() {
            transactions.splice(index, 1);

            localStorage.setItem("transactions", JSON.stringify(transactions));

            showTransactions();
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        rows.appendChild(row);
    });

    if (rows.children.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 6;
        cell.textContent = "No transactions found.";
        cell.className = "text-center text-muted";

        row.appendChild(cell);
        rows.appendChild(row);
    }

    document.getElementById("incomeTotal").textContent =
        showMoney(totalIncome);

    document.getElementById("expenseTotal").textContent =
        showMoney(totalExpenses);

    document.getElementById("balanceTotal").textContent =
        showMoney(totalIncome - totalExpenses);
}

showTransactions();