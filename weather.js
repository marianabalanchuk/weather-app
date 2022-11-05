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

function formatForecastDay(timestamp) {
  let forecastDate = new Date(timestamp * 1000);
  let forecastDay = forecastDate.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[forecastDay];
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

function calculateFahrenheitTemperature(celciusTemperature) {
  let fahrenheitTemperature = (Math.round(celciusTemperature) * 9) / 5 + 32;
  return Math.round(fahrenheitTemperature);
}

function calculateCelsiusTemperature(fahrenheitTemperature) {
  let celciusTemperature = ((fahrenheitTemperature - 32) * 5) / 9;
  return Math.round(celciusTemperature);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();

  if (isfahrenheitClicked) return;
  currentTemperature.innerHTML =
    calculateFahrenheitTemperature(celciusTemperature);
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

  let forecastMaxTemperatureArray = document.querySelectorAll(
    ".forecastMaxTemperature"
  );
  let forecastMinTemperatureArray = document.querySelectorAll(
    ".forecastMinTemperature"
  );

  forecastMaxTemperatureArray.forEach(function (forecastMaxTemperature) {
    forecastMaxTemperature.innerHTML = calculateFahrenheitTemperature(
      forecastMaxTemperature.innerHTML
    );
  });

  forecastMinTemperatureArray.forEach(function (forecastMinTemperature) {
    forecastMinTemperature.innerHTML = calculateFahrenheitTemperature(
      forecastMinTemperature.innerHTML
    );
  });
  isfahrenheitClicked = true;
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  if (!isfahrenheitClicked) return;
  currentTemperature.innerHTML = Math.round(celciusTemperature);
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");

  let forecastMaxTemperatureArray = document.querySelectorAll(
    ".forecastMaxTemperature"
  );
  let forecastMinTemperatureArray = document.querySelectorAll(
    ".forecastMinTemperature"
  );

  forecastMaxTemperatureArray.forEach(function (forecastMaxTemperature) {
    forecastMaxTemperature.innerHTML = calculateCelsiusTemperature(
      forecastMaxTemperature.innerHTML
    );
  });

  forecastMinTemperatureArray.forEach(function (forecastMinTemperature) {
    forecastMinTemperature.innerHTML = calculateCelsiusTemperature(
      forecastMinTemperature.innerHTML
    );
  });

  isfahrenheitClicked = false;
}

function displayForecast(response) {
  let forecastData = response.data.daily;
  let forecast = document.querySelector("#weather-forecast");

  let forecastHTML = `<div class="row">`;

  forecastData.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML += `
                <div class="col-sm-2 week-forecast">
                    <div class="card text-center">
                        <div class="card-header">${formatForecastDay(
                          forecastDay.time
                        )}</div>
                        <img src=${
                          forecastDay.condition.icon_url
                        } class="card-img" alt="...">
                        <div class="card-body">
                            <p class="card-text">
                            <span class="forecastMaxTemperature">${Math.round(
                              forecastDay.temperature.maximum
                            )}</span>° 
                            | 
                            <span class="forecastMinTemperature">${Math.round(
                              forecastDay.temperature.minimum
                            )}</span>°
                            </p>
                        </div>
                    </div>
                </div>

            `;
    }
  });

  forecastHTML += `</div>`;
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
let isfahrenheitClicked = false;

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", getSearchLocation);

let gpsLocation = document.querySelector("#gps-location");
gpsLocation.addEventListener("click", getPosition);

navigator.geolocation.getCurrentPosition(getCurrentLocation);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);
