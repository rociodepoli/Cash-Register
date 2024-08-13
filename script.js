const cash = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const changeDue = document.getElementById("change-due");
const priceScreen = document.getElementById("price-screen");
const cashDrawerDisplay = document.getElementById("cash-drawer-display");
const btnsContainer = document.querySelector(".btns-container");

let price = 3.26;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];
let totalInDrawer = () =>
  Math.round(cid.reduce((acc, el) => acc + el[1], 0) * 1e2) / 1e2;
let units = {};

changeDue.style.display = "none";

const calculateChange = (change) => {
  let cambio = change;
  const unoPorUno = (camb, unidad, indice) => {
    if (cid[indice][1] / unidad >= parseInt(camb / unidad)) {
      units[cid[indice][0]] =
        Math.round(parseInt(camb / unidad) * unidad * 1e2) / 1e2;

      cid[indice][1] -=
        Math.round(parseInt(camb / unidad) * unidad * 1e2) / 1e2;

      cambio =
        Math.round((cambio - parseInt(camb / unidad) * unidad) * 1e2) / 1e2;
    } else {
      units[cid[indice][0]] = cid[indice][1];
      cambio = Math.round((cambio - cid[indice][1]) * 1e2) / 1e2;
      cid[indice][1] = 0;
    }
  };

  if (cambio / 100 >= 1) {
    unoPorUno(cambio, 100, 8);
  }
  if (cambio / 20 >= 1) {
    unoPorUno(cambio, 20, 7);
  }
  if (cambio / 10 >= 1) {
    unoPorUno(cambio, 10, 6);
  }
  if (cambio / 5 >= 1) {
    unoPorUno(cambio, 5, 5);
  }
  if (cambio / 1 >= 1) {
    unoPorUno(cambio, 1, 4);
  }
  if (cambio / 0.25 >= 1) {
    unoPorUno(cambio, 0.25, 3);
  }
  if (cambio / 0.1 >= 1) {
    unoPorUno(cambio, 0.1, 2);
  }
  if (cambio / 0.05 >= 1) {
    unoPorUno(cambio, 0.05, 1);
  }
  if (cambio / 0.01 >= 1) {
    unoPorUno(cambio, 0.01, 0);
  }
  const keys = Object.keys(units);
  const changeDueSpan = keys.map((key) =>
    units[key] !== 0.0 ? `${key}: $${units[key]}` : null
  );

  if (cambio > 0.0) {
    changeDue.style.display = "block";
    changeDue.innerHTML = `
  <p>Status: INSUFFICIENT_FUNDS</p>`;
  } else {
    if (totalInDrawer() > 0) {
      changeDue.style.display = "block";
      changeDue.innerHTML = `
    <p>Status: OPEN</p>
    ${changeDueSpan.map((el) => `<p>${el}</p>`).join(`<div/>`)}`;
      // resolver decimales de nickel
    } else {
      changeDue.style.display = "block";
      changeDue.innerHTML = `
    <p>Status: CLOSED</p>
     ${changeDueSpan.map((el) => `<p>${el}</p>`).join(`<div/>`)}`;
    }
  }
};

priceScreen.textContent += price;

/*
cambio: 223.35
223.35/100>0? se saca hundreds, cuantos? => parseInt(223.35/100) va a decir cuantos => corroborar que haya esa cantidad en cid=> 
if(cid[8][1]/100 >= parseInt(223.35/100)){
 cambio= 223.35- parseInt(223.35/100)*100
  cid[8][1]-=parseInt(223.35/100)*100
} else{
  223.35-cid[8][1]
  cid[8][1]=0
} =>repetir con 20,10,5,1...
*/

const purchase = (value) => {
  if (value === price) {
    changeDue.style.display = "block";
    changeDue.innerHTML = `<p>No change due - customer paid with exact cash</p>`;
  } else {
    const change = value - price;
    if (change > totalInDrawer()) {
      changeDue.style.display = "block";
      changeDue.innerHTML = `
  <p>Status: INSUFFICIENT_FUNDS</p>`;
    } else {
      calculateChange(change);
    }
  }
};

purchaseBtn.addEventListener("click", () => {
  if (Number(cash.value) < price) {
    alert("Customer does not have enough money to purchase the item");
    cash.value = "";
  } else {
    purchase(Number(cash.value));
    units = {};
    cash.value = "";
  }
});

btnsContainer.addEventListener("click", (event) => {
  if (event.target && event.target.classList.contains("btn")) {
    const buttonValue = event.target.textContent;

    cash.value += buttonValue;
  }
});

cashDrawerDisplay.innerHTML = `
<p><strong>Change in drawer:</strong></p>
<p>Pennies: $${cid[0][1]}</p>
<p>Nickels: $${cid[1][1]}</p>
<p>Dimes: $${cid[2][1]}</p>
<p>Quarters: $${cid[3][1]}</p><p>Ones: $${cid[4][1]}</p>
<p>Fives: $${cid[5][1]}</p>
<p>Tens: $${cid[6][1]}</p>
<p>Twenties: $${cid[7][1]}</p>
<p>Hundreds: $${cid[8][1]}</p>`;
