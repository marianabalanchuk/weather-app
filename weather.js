// Calculating Date and Time

function formatDate(dateNow) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let currentDay = days[dateNow.getDay()];
  let currentMonth = months[dateNow.getMonth()];
  let currentDate = dateNow.getDate();

  let formattedDate = `${currentDay}, ${currentMonth} ${currentDate}`;

  return formattedDate;
}

let dateNow = new Date();

let currentDate = document.querySelector("#date");
currentDate.innerHTML = formatDate(dateNow);

let currentTime = document.querySelector("#time");

let hour = dateNow.getHours();
if (hour < 10) {
  hour = `0${hour}`;
}

let minutes = dateNow.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}

currentTime.innerHTML = `${hour}:${minutes}`;

// Calculating Date and Time

function getSearchLocation(event) {
  event.preventDefault();
  let searchCity = document.querySelector("#search-city").value;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=metric&appid=${apiKey}`;
  axios.get(`${apiUrl}`).then(updateHTML);
}

function getPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCurrentLocation);
}

function getCurrentLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(`${apiUrl}`).then(updateHTML);
}

function updateHTML(response) {
  console.log(response.data);
  currentTemperature.innerHTML = `${Math.round(response.data.main.temp)}`;
  currentCity.innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  currentConditions.innerHTML = response.data.weather[0].description;
  currentWind.innerHTML = `${Math.round(response.data.wind.speed)}`;
  currentHumidity.innerHTML = response.data.main.humidity;
}

let apiKey = "7a00a4fb22b18bae5dbea39280ad220a";
let currentCity = document.querySelector("#city");
let currentConditions = document.querySelector("#conditions");
let currentWind = document.querySelector("#wind");
let currentHumidity = document.querySelector("#humidity");
let currentTemperature = document.querySelector("#current-temp");

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", getSearchLocation);

let gpsLocation = document.querySelector("#gps-location");
gpsLocation.addEventListener("click", getPosition);

navigator.geolocation.getCurrentPosition(getCurrentLocation);
