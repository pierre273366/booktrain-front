const URL = "https://booktrain-back.vercel.app";

// Add cart event listener
function addBooks(tripId) {
  return fetch(`${URL}/carts/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tripId: tripId,
    }),
  })
    .then((response) => response.json())
    .then((data) => data);
}

function addBooksCart() {
  const buttons = document.querySelectorAll(".bookButton");
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    button.addEventListener("click", async () => {
      const tripId = button.dataset.id;
      const addToCart = await addBooks(tripId);
      console.log(addToCart.result);
      if (addToCart.result === true) {
        window.location.replace("./cart.html");
      }
    });
  }
}

// ----- Home - Recherche de trips
// l-> Récupérer les inputs
// l-> GET dans /trips
//     l-> Si le départ ou l'arrivée ou la date ne correspondent à rien ça retourne "Aucun voyage trouvé"
//     l-> Sinon ça va afficher tous les voyages correspondants

function getTrips(departure, arrival, date) {
  return fetch(`${URL}/trips/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      departure: departure,
      arrival: arrival,
      date: date,
    }),
  })
    .then((res) => res.json())
    .then((data) => data);
}

function getInputsValues() {
  const departure = document.querySelector("#inputDeparture").value;
  const arrival = document.querySelector("#inputArrival").value;
  const date = document.querySelector("#inputDate").value;
  return { departure, arrival, date };
}

function createTripRow(trip) {
  const date = new Date(trip.date);
  let dateHours = date.getHours();
  dateHours = dateHours >= 10 ? dateHours : `0${dateHours}`;
  let dateMinutes = date.getMinutes();
  dateMinutes = dateMinutes >= 10 ? dateMinutes : `0${dateMinutes}`;
  return `
    <div class="tripList_row">
        <p>${trip.departure} > ${trip.arrival}</p>
        <p>${dateHours}:${dateMinutes}</p>
        <p>${trip.price}€</p>
        <button class="bookButton button" data-id="${trip._id}">Book</button>
    </div>
    `;
}

function addTripsToList(trips) {
  const tripList = document.querySelector("#tripsList");
  tripList.innerHTML = "";
  for (const trip of trips) {
    tripList.innerHTML += createTripRow(trip);
  }
}

function displayAndHideElements(displayElementId, hideElementIdArr) {
  const displayElement = document.querySelector(`#${displayElementId}`);
  displayElement.classList.remove("hidden");
  for (const hideElementId of hideElementIdArr) {
    const hideElement = document.querySelector(`#${hideElementId}`);
    hideElement.classList.add("hidden");
  }
}

function playAudio() {
  const audio = new Audio("./images/old-train-steam-whistle-256872.mp3");
  audio.play();
}

function searchTrips() {
  const searchButton = document.querySelector("#searchTrip");
  searchButton.addEventListener("click", async () => {
    playAudio();
    const { departure, arrival, date } = getInputsValues();
    const trips = await getTrips(departure, arrival, date);
    if (trips.result) {
      displayAndHideElements("tripsList", ["noTripFound", "timeToBook"]);
      addTripsToList(trips.trips);
      addBooksCart();
    } else {
      displayAndHideElements("noTripFound", ["tripsList", "timeToBook"]);
    }
  });
}

searchTrips();

// const tripdId = this.dataset.id;

// Un bouton book va permettr d'ajouter le voyage correspondant à la base de donnée Cart, il redirige sur la page cart
// l-> POST dans /carts => ajoute

// ----- Cart
// l-> GET dans /carts
//     l-> On affiche un message si la Collection Carts est vide
//     l-> Si il y a des éléments dans le cart, on les affiches

// Un bouton supprimé permet de supprimer individuellement un voyage de la base donnée cart
// l-> DELETE one dans /carts

// -- Un footer
// Le total des tarifs (met à jour lors de la suppression et de l'ajout)
// Bouton purchase
//  l-> Ajouter les éléments du carts à booking -> POST dans /bookings
//  l-> Supprimer tous les éléments du carts -> DELETE many dans /carts
//  l-> Rediriger sur bookings

// ---- Bookings
// l-> GET dans /bookings
//     l-> On affiche un message si la Collection Bookings est vide
//     l-> Si il y a des éléments dans le booking, on les affiches
// On affiche la durée entre "tout de suite" et le départ
