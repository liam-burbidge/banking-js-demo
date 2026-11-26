const customer = {
  name: "Sarah Jones",
  accountNumber: "ACC1001",
  accountType: "Current",
  balance: 2500,
};

const transactions = [];

const reviewThreshold = 750;

// DOM elements
const depositButton = document.querySelector("#depositButton");
const withdrawButton = document.querySelector("#withdrawButton");
const customerElement = document.querySelector("#customer");
const account = document.querySelector("#account");
const accountTypeElement = document.querySelector("#accountType");
const balanceElement = document.querySelector("#balance");
const statusElement = document.querySelector("#status");
const amountInput = document.querySelector("#amountInput");
const transactionList = document.querySelector("#transactionList");

// Display account details
customerElement.innerHTML = `
  <span class="card-label">Customer</span>
  <span class="card-value">${customer.name}</span>
`;

account.innerHTML = `
  <span class="card-label">Account Number</span>
  <span class="card-value">${customer.accountNumber}</span>
`;

accountTypeElement.innerHTML = `
  <span class="card-label">Account Type</span>
  <span class="card-value">${customer.accountType}</span>
`;

// Helpers
const updateBalance = () => {
  balanceElement.innerHTML = `
    <span class="card-label">Balance</span>
    <span class="card-value balance-value">
      £${customer.balance.toFixed(2)}
    </span>
  `;
};

const updateStatus = () => {
  statusElement.style.color = "";

  if (customer.balance >= 1000) {
    statusElement.textContent = "Account status: Healthy";
  } else if (customer.balance >= 500) {
    statusElement.textContent = "Account status: Monitor";
  } else {
    statusElement.textContent = "Account status: Low balance";
  }
};

const displayTransactions = () => {
  transactionList.innerHTML = "";

  transactions.forEach((transaction) => {
    const item = document.createElement("li");

    item.textContent = `${transaction.type}: £${transaction.amount.toFixed(2)}`;

    if (transaction.review) {
      item.textContent += " - REVIEW REQUIRED";
      item.style.color = "red";
      item.style.fontWeight = "bold";
    }

    transactionList.appendChild(item);
  });
};

const showError = (message) => {
  statusElement.textContent = message;
  statusElement.style.color = "red";
};

const getAmount = () => {
  const amount = Number(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    showError("Please enter a valid amount");
    return null;
  }

  return amount;
};

const addTransaction = (type, amount) => {
  let requiresReview = false;

  if (amount >= reviewThreshold) {
    requiresReview = true;
  }

  transactions.push({
    type: type,
    amount: amount,
    review: requiresReview,
  });

  displayTransactions();
};

// Deposit
depositButton.addEventListener("click", () => {
  const amount = getAmount();

  if (amount === null) {
    return;
  }

  customer.balance += amount;

  addTransaction("Deposit", amount);

  updateBalance();
  updateStatus();

  amountInput.value = "";
});

// Withdraw
withdrawButton.addEventListener("click", () => {
  const amount = getAmount();

  if (amount === null) {
    return;
  }

  if (amount > customer.balance) {
    showError("Transaction Declined: Insufficient Funds");
    return;
  }

  customer.balance -= amount;

  addTransaction("Withdrawal", amount);

  updateBalance();
  updateStatus();

  amountInput.value = "";
});

// Initial page load
updateBalance();
updateStatus();
displayTransactions();
