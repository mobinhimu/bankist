"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Rayhan Uddin Mobin",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-30T09:48:16.867Z",
    "2023-05-28T18:00:00.000Z",
    "2023-04-26T18:00:00.000Z",
    "2023-04-26T18:00:00.000Z",
    "2015-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2010-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "fr-FR",
};

const account2 = {
  owner: "Borhan Uddin Himon",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2023-05-28T18:00:00.000Z",
    "2023-04-26T18:00:00.000Z",
    "2018-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2015-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2010-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Rafi Al Mahmud",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2023-05-24T18:00:00.000Z",
    "2019-12-25T06:04:23.907Z",
    "2023-05-28T18:00:00.000Z",
    "2023-04-26T18:00:00.000Z",
    "2017-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
    "2010-06-25T18:49:59.371Z",
  ],
  currency: "CAD",
  locale: "en-CA",
};

const account4 = {
  owner: "Tanvir Hasan Zisan",
  movements: [48530, -19000, 79600, -50569, 35990],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2023-05-28T18:00:00.000Z",
    "2023-04-26T18:00:00.000Z",
    "2023-05-28T18:00:00.000Z",
    "2023-05-24T18:00:00.000Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "JPY",
  locale: "ja-JP",
};
const account5 = {
  owner: "Takiya Sharmin Tonni",
  movements: [150000, 19000, -80700, 585660, -9790],
  interestRate: 1,
  pin: 5555,
  movementsDates: [
    "2023-05-28T18:00:00.000Z",
    "2023-04-26T18:00:00.000Z",
    "2023-05-24T18:00:00.000Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "ITL",
  locale: "it-IT",
};

let accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// Global Variable
let currentUser,
  loanTimeOut,
  sort = false,
  balanceInterval,
  timerLogoutInterval;

// Creating UserName
accounts.forEach((account) => {
  account.userName = account.owner
    .toLocaleLowerCase()
    .split(" ")
    .map((name) => name[0])
    .join("");
});

////////////////////////////////////////////////////////
// Balance Date
const balanceDate = function (locale) {
  const timer = () => {
    labelDate.textContent = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(new Date());
  };

  balanceInterval = setInterval(timer, 1000);
};

// formatting balance
const formattingBalance = function (
  money = 0,
  currency = "EUR",
  locale = "fr-FR"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(money);
};

const timerLogout = function () {
  let time = 600;

  const tick = () => {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String(Math.trunc(time % 60)).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      containerApp.style.opacity = 0;
      labelWelcome.textContent = "Log in to get started";
      clearInterval(timer);
    }
    console.log(time);
    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////////////////////////////
// Container Movements Function
const movementsFunction = (account, sorted) => {
  containerMovements.innerHTML = "";

  const mov = sort ? sorted : account?.movements;

  mov?.forEach((mov, i) => {
    let time;

    let days =
      new Date().getTime() - new Date(account.movementsDates[i]).getTime();
    const day = Math.abs(Math.trunc(days / (1000 * 3600 * 24))) + 1;

    if (day === 1) {
      time = "Today";
    } else if (day === 2) {
      time = "Yesterday";
    } else if (day <= 7) {
      time = `${day} Days Ago`;
    } else {
      time = new Intl.DateTimeFormat(account.locale).format(
        new Date(account.movementsDates[i])
      );
    }

    const movementsHTML = `<div class="movements__row">
    <div class="movements__type movements__type--${
      mov > 0 ? "deposit" : "withdrawal"
    }">
      ${i + 1} ${mov > 0 ? "deposit" : "withdrawal"}
    </div>
    
    <div class="movements__date">${time}</div>

    <div class="movements__value">${formattingBalance(
      mov,
      account?.currency,
      account?.locale
    )}</div>
  </div>;
`.replace(";", "");

    containerMovements.insertAdjacentHTML("afterbegin", movementsHTML);
  });
};

// Update Balance value
const updateBalance = function (account) {
  account.balance = account?.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formattingBalance(
    account?.balance,
    account?.currency,
    account?.locale
  )}`;
};

// Calculate Summary Value And Display UI
const calculateSummary = function (account) {
  // Deposit
  const sumIn = account?.movements
    .filter((mov) => mov > 0)
    .reduce((acc, dep) => acc + dep, 0);

  // Withdraw
  const sumOut = account?.movements
    .filter((mov) => mov < 0)
    .map((wit) => Math.abs(wit))
    .reduce((acc, wit) => acc + wit, 0);

  // Interest
  const interest = account?.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .reduce((acc, dep) => acc + dep, 0);

  // Display Summary
  labelSumIn.textContent = `${formattingBalance(
    sumIn,
    account?.currency,
    account?.locale
  )} `;
  labelSumOut.textContent = `${formattingBalance(
    sumOut,
    account?.currency,
    account?.locale
  )} `;
  labelSumInterest.textContent = `${formattingBalance(
    interest,
    account?.currency,
    account?.locale
  )}`;
};

// Update UI
const updateUI = function (account) {
  movementsFunction(account);
  calculateSummary(account);
  updateBalance(account);
};

// Login Current User
btnLogin.addEventListener("click", (eve) => {
  eve.preventDefault();

  const inputUserName = String(inputLoginUsername.value).trim();
  const inputPin = +inputLoginPin.value;

  currentUser = accounts.find(
    (account) => inputUserName === account.userName && inputPin === account.pin
  );
  let welcome;

  if (new Date().getHours() >= 5 && new Date().getHours() < 12) {
    welcome = "Good Morning";
  } else if (new Date().getHours() >= 12 && new Date().getHours() < 17) {
    welcome = "Good Afternoon";
  } else if (new Date().getHours() >= 17 && new Date().getHours() < 19) {
    welcome = "Good Evening";
  } else {
    welcome = "Good Night";
  }

  // Welcome Message
  if (currentUser) {
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `${welcome} , ${
      currentUser?.owner.split(" ")[0]
    }`;
  } else {
    alert("User Not Found 😿");
    containerApp.style.opacity = 0;
  }

  inputLoginUsername.value = inputLoginPin.value = "";

  // Update UI
  updateUI(currentUser);

  // Balance Date
  if (balanceInterval) clearInterval(balanceInterval);
  balanceDate(currentUser.locale);

  // logout timer
  if (timerLogoutInterval) clearInterval(timerLogoutInterval);
  timerLogoutInterval = timerLogout();
});

// Transfer Money
btnTransfer.addEventListener("click", (eve) => {
  eve.preventDefault();

  const inputTransferToValue = inputTransferTo.value.trim();
  const inputTransferAmountValue = +inputTransferAmount.value;

  if (
    inputTransferAmountValue > 0 &&
    inputTransferToValue !== currentUser?.userName &&
    inputTransferAmountValue <= currentUser?.balance
  ) {
    const moneyReceiver = accounts.find(
      (account) => account.userName === inputTransferToValue
    );

    currentUser?.movements.push(+`-${inputTransferAmountValue}`);
    moneyReceiver?.movements.push(inputTransferAmountValue);

    currentUser.movementsDates.push(new Date().toISOString());
    moneyReceiver?.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentUser);
  }

  inputTransferTo.value = inputTransferAmount.value = "";

  // logout timer
  clearInterval(timerLogoutInterval);
  timerLogoutInterval = timerLogout();
});

// Requesting For Loan
btnLoan.addEventListener("click", (eve) => {
  eve.preventDefault();

  const inputLoanAmountValue = +inputLoanAmount.value;
  const loanTimer = () => {
    if (currentUser) {
      currentUser.movements.push(inputLoanAmountValue);
      currentUser.movementsDates.push(new Date().toISOString());
      // Update UI
      updateUI(currentUser);
    }
  };

  if (loanTimeOut) clearTimeout(loanTimeOut);
  loanTimeOut = setTimeout(loanTimer, 3000);

  inputLoanAmount.value = "";

  // logout timer
  clearInterval(timerLogoutInterval);
  timerLogoutInterval = timerLogout();
});

//Close Account
btnClose.addEventListener("click", (eve) => {
  eve.preventDefault();

  const inputCloseUsernameValue = inputCloseUsername.value.trim();
  const inputClosePinValue = +inputClosePin.value;

  if (
    (currentUser?.userName === inputCloseUsernameValue,
    currentUser?.pin === inputClosePinValue)
  ) {
    const currentUserIndex = accounts.findIndex(
      (account) =>
        inputClosePinValue === account.pin &&
        inputCloseUsernameValue === account.userName
    );

    accounts.splice(currentUserIndex, 1);
    containerApp.style.opacity = 0;

    // logout timer
    clearInterval(timerLogoutInterval);
  }

  // Balance Date
  if (balanceInterval) clearInterval(balanceInterval);

  inputCloseUsername.value = inputClosePin.value = "";
});

// Sorting Movements
btnSort.addEventListener("click", () => {
  let sorted;
  if (sort) {
    sorted = currentUser?.movements;
    sort = false;
  } else {
    sorted = currentUser?.movements.slice().sort((a, b) => a - b);
    sort = true;
  }

  // Movements sorted
  movementsFunction(currentUser, sorted);

  // logout timer
  clearInterval(timerLogoutInterval);
  timerLogoutInterval = timerLogout();
});
