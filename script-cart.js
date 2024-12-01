const URL = "https://booktrain-back.vercel.app";

// ----- Display all cart elements
function getCartElement() {
  return fetch(`${URL}/carts`)
    .then((response) => response.json())
    .then((data) => data);
}

function newCartTrip(cart) {
  const date = new Date(cart.tripId.date);
  let dateDay = date.getDate();
  if (dateDay < 10) {
    dateDay = `0${dateDay}`;
  }
  let dateMonth = date.getMonth();
  dateMonth = dateMonth < 10 ? `0${dateMonth}` : dateMonth;
  let dateHours = date.getHours();
  dateHours = dateHours >= 10 ? dateHours : `0${dateHours}`;
  let dateMinutes = date.getMinutes();
  dateMinutes = dateMinutes >= 10 ? dateMinutes : `0${dateMinutes}`;
  return `
      <div class="tripList_row">
          <p>${cart.tripId.departure} > ${cart.tripId.arrival}</p>
          <p>${dateDay}/${dateMonth}</p>
          <p>${dateHours}:${dateMinutes}</p>
          <p>${cart.tripId.price}€</p>
          <button class="deleteCart button" data-id="${cart._id}">X</button>
      </div>
      `;
}

function displayTripsToCarts(cartElements) {
  const panier = document.querySelector("#panier");
  panier.innerHTML = "";
  for (const cartElement of cartElements) {
    panier.innerHTML += newCartTrip(cartElement);
  }
}

// ----- Calcul total

function totalCart(cartElements) {
  let price = 0;
  cartElements = cartElements.sort((a, b) => a.tripId.date - b.tripId.date);
  for (const cartElement of cartElements) {
    const elementPrice = cartElement.tripId.price;
    price += elementPrice;
  }
  document.querySelector("#total").textContent = price;
}

// ----- Delete cart element
function deleteCart(cartId) {
  return fetch(`${URL}/carts/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cartId: cartId,
    }),
  })
    .then((response) => response.json())
    .then((data) => data);
}

function deleteTrip() {
  const buttons = document.querySelectorAll(".deleteCart");
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    button.addEventListener("click", async (e) => {
      const cartId = e.currentTarget.dataset.id;
      const supp = await deleteCart(cartId);
      if (supp.result) {
        window.location.reload();
      }
    });
  }
}

// ----- Display and hide HTML elements
function displayHideElements(displayElementId, hideElementId) {
  const displayElement = document.querySelector(`#${displayElementId}`);
  const hideElement = document.querySelector(`#${hideElementId}`);
  displayElement.classList.remove("hidden");
  hideElement.classList.add("hidden");
}

// ----- Add to bookings and delete Cart elements
function addCartToBooking(tripId) {
  return fetch(`${URL}/bookings/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tripId: tripId,
    }),
  })
    .then((response) => response.json())
    .then((data) => data);
}

function deleteAllCartElements() {
  return fetch(`${URL}/carts/delete-all`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => data);
}

function addToBooking(trips) {
  const button = document.querySelector(".purchase");
  button.addEventListener("click", async () => {
    for (const trip of trips) {
      await addCartToBooking(trip.tripId);
    }
    await deleteAllCartElements();
    window.location.replace("./bookings.html");
  });
}

// ----- Call all functions
async function callCart() {
  const cartElements = await getCartElement();
  console.log(cartElements);
  if (cartElements.result) {
    displayHideElements("myCart", "noCartElement");
    displayTripsToCarts(cartElements.trips);
    totalCart(cartElements.trips);
    deleteTrip();
    addToBooking(cartElements.trips);
  } else {
    displayHideElements("noCartElement", "myCart");
  }
}

callCart();
