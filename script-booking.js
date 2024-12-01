const URL = "https://booktrain-back.vercel.app";

function getBookings() {
  return fetch(`${URL}/bookings`)
    .then((response) => response.json())
    .then((data) => data);
}

function getDifferences(date, currentDate) {
  let delta = Math.abs(date - currentDate) / 1000;

  // calculate (and subtract) whole days
  let days = Math.floor(delta / 86400);
  delta -= days * 86400;

  // calculate (and subtract) whole hours
  let hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  // calculate (and subtract) whole minutes
  let minutes = Math.floor(delta / 60) % 60;

  return { days, hours, minutes };
}

function departureDelay(date) {
  const currentDate = new Date();
  const { days, hours, minutes } = getDifferences(date, currentDate);
  if (date > currentDate) {
    return `Departure in ${days} days ${hours} hours ${minutes} minutes`;
  }
  if (days === 0 && hours === 0) {
    return `Leaving now`;
  }
  if (date < currentDate) {
    return `Already gone`;
  }
}

function createTripRow(trip) {
  const date = new Date(trip.tripId.date);
  const dateHours = date.getHours();

  let dateDay = date.getDate();
  if (dateDay < 10) {
    dateDay = `0${dateDay}`;
  }
  let dateMonth = date.getMonth();
  dateMonth = dateMonth < 10 ? `0${dateMonth}` : dateMonth;
  let dateHoursDisplay = date.getHours();
  dateHoursDisplay =
    dateHoursDisplay >= 10 ? dateHoursDisplay : `0${dateHoursDisplay}`;
  let dateMinutes = date.getMinutes();
  dateMinutes = dateMinutes >= 10 ? dateMinutes : `0${dateMinutes}`;
  const alreadyGoneOpacity = date < new Date() ? "style='opacity: 0.5'" : "";
  return `
    <div class="tripList_row" ${alreadyGoneOpacity}>
        <p>${trip.tripId.departure} > ${trip.tripId.arrival}</p>
        <p>${dateDay}/${dateMonth}</p>
        <p>${dateHoursDisplay}:${dateMinutes}</p>
        <p>${trip.tripId.price}€</p>
        <p>${departureDelay(date)}</p>
    </div>
    `;
}

function addTripsToList(trips) {
  const tripList = document.querySelector("#bookingList");
  trips = trips.sort((a, b) => a.tripId.date - b.tripId.date);
  tripList.innerHTML = "";
  for (const trip of trips) {
    tripList.innerHTML += createTripRow(trip);
  }
}

function disaplayHideElements(displayElementId, hideElementId) {
  const displayElement = document.querySelector(`#${displayElementId}`);
  const hideElement = document.querySelector(`#${hideElementId}`);
  displayElement.classList.remove("hidden");
  hideElement.classList.add("hidden");
}

async function displayBookings() {
  const bookings = await getBookings();
  if (bookings.result) {
    addTripsToList(bookings.trips);
    disaplayHideElements("myBookings", "cardBooking");
  } else {
    disaplayHideElements("cardBooking", "myBookings");
  }
}

displayBookings();
