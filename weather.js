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

function getPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCurrentLocation);
}

function getSearchLocation(event) {
  event.preventDefault();
  let searchCity = document.querySelector("#search-city").value;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${searchCity}&key=${apiKey}&units=metric`;
  let apiUrlForecast = `https://api.shecodes.io/weather/v1/forecast?query=${searchCity}&key=${apiKey}&units=metric`;
  axios.get(`${apiUrl}`).then(updateHTML);
  axios.get(`${apiUrlForecast}`).then(displayForecast);
}

function getCurrentLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}&units=metric`;
  let apiUrlForecast = `https://api.shecodes.io/weather/v1/forecast?lon=${lon}&lat=${lat}&key=${apiKey}&units=metric`;
  axios.get(`${apiUrl}`).then(updateHTML);
  axios.get(`${apiUrlForecast}`).then(displayForecast);
}

function updateHTML(response) {
  currentTemperature.innerHTML = `${Math.round(
    response.data.temperature.current
  )}`;
  celciusTemperature = response.data.temperature.current;
  currentCity.innerHTML = `${response.data.city}, ${response.data.country}`;
  currentConditions.innerHTML = response.data.condition.description;
  currentWind.innerHTML = `${Math.round(response.data.wind.speed)}`;
  currentHumidity.innerHTML = response.data.temperature.humidity;

  changeBackground(response.data.condition.icon);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let fahrenheitTemperature = (celciusTemperature * 9) / 5 + 32;
  currentTemperature.innerHTML = Math.round(fahrenheitTemperature);
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  currentTemperature.innerHTML = Math.round(celciusTemperature);
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
}

function displayForecast(response) {
  console.log(response.data.daily);
  let forecast = document.querySelector("#weather-forecast");

  let forecastHTML = `<div class="row">`;
  let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
                <div class="col-sm-2 week-forecast">
                    <div class="card text-center">
                        <div class="card-header">${day}</div>
                        <img src="images/sun-light-rain.svg" class="card-img" alt="...">
                        <div class="card-body">
                            <p class="card-text">11° | 7°</p>
                        </div>
                    </div>
                </div>

            `;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecast.innerHTML = forecastHTML;
}

function changeBackground(backgroundConditions) {
  let background = document.querySelector("#background");

  if (
    backgroundConditions === "clear-sky-day" ||
    backgroundConditions === "clear-sky-night"
  ) {
    background.style.backgroundImage = "url(images/clear-sky.jpg)";
  }
  if (
    backgroundConditions === "few-clouds-day" ||
    backgroundConditions === "few-clouds-night"
  ) {
    background.style.backgroundImage = "url(images/few-clouds.jpg)";
  }
  if (
    backgroundConditions === "scattered-clouds-day" ||
    backgroundConditions === "scattered-clouds-night"
  ) {
    background.style.backgroundImage = "url(images/scattered-clouds.jpg)";
  }
  if (
    backgroundConditions === "broken-clouds-day" ||
    backgroundConditions === "broken-clouds-night"
  ) {
    background.style.backgroundImage = "url(images/broken-clouds.jpg)";
  }
  if (
    backgroundConditions === "shower-rain-day" ||
    backgroundConditions === "shower-rain-night"
  ) {
    background.style.backgroundImage = "url(images/shower-rain.jpg)";
  }
  if (
    backgroundConditions === "rain-day" ||
    backgroundConditions === "rain-night"
  ) {
    background.style.backgroundImage = "url(images/light-rain.jpg)";
  }
  if (
    backgroundConditions === "thunderstorm-day" ||
    backgroundConditions === "thunderstorm-night"
  ) {
    background.style.backgroundImage = "url(images/thunderstorm.jpg)";
  }
  if (
    backgroundConditions === "snow-day" ||
    backgroundConditions === "snow-night"
  ) {
    background.style.backgroundImage = "url(images/snow.jpg)";
  }
  if (
    backgroundConditions === "mist-day" ||
    backgroundConditions === "mist-night"
  ) {
    background.style.backgroundImage = "url(images/mist.jpg)";
  }
}

let apiKey = "b3eab6a64o8ab3a5f894296f5209at9d";
let currentCity = document.querySelector("#city");
let currentConditions = document.querySelector("#conditions");
let currentWind = document.querySelector("#wind");
let currentHumidity = document.querySelector("#humidity");
let currentTemperature = document.querySelector("#current-temp");
let celciusTemperature = null;

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", getSearchLocation);

let gpsLocation = document.querySelector("#gps-location");
gpsLocation.addEventListener("click", getPosition);

navigator.geolocation.getCurrentPosition(getCurrentLocation);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);
