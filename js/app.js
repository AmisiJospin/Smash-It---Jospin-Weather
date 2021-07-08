/*
Author: Jospin AMISI, +265992129078, +265886662568
Url: facebook.com/amissi.hassan
site web: www.jospinamisi.heroku.com
Email:jospinamissi@gmail.com
Version: 1.0.0 - 11.09.2020
*/

// API KEY AND WEBSITE
const api = {
  key: "1cd469e8a92100e206db2a97a0ae4630",
  base: "https://api.openweathermap.org/data/2.5/",
  onecall: "https://api.openweathermap.org/data/2.5/onecall",
};

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const searchbox = document.querySelector(".inputSearch");
searchbox.addEventListener("keypress", setQuery);

function setQuery(evt) {
  if (evt.keyCode == 13) {
    evt.preventDefault();
    getResults(searchbox.value);
  }
}

// LOAD A DEFAULT TEMPERATURE
if (
  document.readyState !== "complete" &&
  document.readyState === "loading" &&
  !document.documentElement.doScroll
) {
  document.addEventListener("DOMContentLoaded", getResults("New york"));
}

function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then((weatherLoc) => {
      return weatherLoc.json();
    })

    .then((weatherLoc) => {
      fetch(
        `${api.onecall}?lat=${weatherLoc.coord.lat}&lon=${weatherLoc.coord.lon}&exclude=minutely&units=metric&APPID=${api.key}`
      )
        .then((weather) => {
          return weather.json();
        })
        .then(displayResults);
    });

  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then((weather) => {
      return weather.json();
    })
    .then(displayCurrentResults);
}

function displayCurrentResults(weather) {
  console.log(weather);

  //NAME OF COUNTRY AND CITY
  let city = document.querySelector(".location-and-date .country-location");
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  // DATE OF TODAY FUNCTION
  let now = new Date();
  let date = document.querySelector(".location-and-date .date");
  date.innerText = dateBuilder(now);

  // HIGHER TEMPERATURE
  let tempHiht = document.querySelector(".temp_max");
  tempHiht.innerText = weather.main.temp_max;

  // LOWER TEMPERATURE
  let tempLow = document.querySelector(".temp_min");
  tempLow.innerText = weather.main.temp_min;

  //GETTING KEYS AND VALUES
  const localStorageObject={
    cityName: city.innerText,
    dateNow: date.innerText,
    temperatureHigh: tempHiht.innerText,
    temperatureLow: tempLow.innerText

  }
  //SAVE TO LOCAL STORAGE
  saveToLocalStorage(localStorageObject);
}

function displayResults(weather) {

  let tempElement = document.querySelector(".current-temperature__value");
  tempElement.innerHTML = `${weather.current.temp} <span>°c</span>`;

  //ICON ID WEATHER
  let iconElement = document.querySelector(
    ".current-temperature__icon-container"
  );

  iconElement.innerHTML = `<img src="./images/icons/${weather.current.weather[0].icon}.png" alt="Icon Weather, ${weather.current.weather[0].description} icon" />`;
  
  //DESCRIPTION OF THE WEATHER
  let descElement = document.querySelector(".current-temperature__summary");
  descElement.innerText = weather.current.weather[0].description;
  var d = new Date();
  let daily_weather = document.querySelector(".next-5-days__container");
  let days_container = "";
  let hourly_weather = document.querySelector(".weather-by-hour__container");
  let hourly_container = "";

  //THE WEATHER OF THE DAY
  for (let index = 0; index < 7; index++) {
    const element = weather.hourly[index];
    var d = new Date(element.dt * 1000);

    hourly_container += `<div class="weather-by-hour__item">
            <div class="weather-by-hour__hour">${d.getHours()} H</div>
            <img src="./images/icons/${
              element.weather[0].icon
            }.png" alt="Mostly sunny" />
            <div>${element.temp}&deg;</div>
          </div>`;
  }

  for (let index = 0; index < weather.daily.length; index++) {
    const element = weather.daily[index];
    var d = new Date(element.dt * 1000);

    days_container += `<div class="next-5-days__row">
            <div class="next-5-days__date">
              ${days[d.getDay()]}
              <div class="next-5-days__label">${d.getDate()}/${d.getMonth()}  </div>
            </div>

            <div class="next-5-days__low">
             ${element.temp.min}&deg;
              <div class="next-5-days__label">Low</div>
            </div>

            <div class="next-5-days__high">
                ${element.temp.max}&deg;
              <div class="next-5-days__label">High</div>
            </div>

            <div class="next-5-days__icon">
              <img src="images/icons/${
                element.weather[0].icon
              }.png" alt="Mostly sunny" />
            </div>

            <div class="next-5-days__rain">
               ${element.humidity}%
              <div class="next-5-days__label">Humidity</div>
            </div>

            <div class="next-5-days__wind">
               ${element.wind_speed} m/s
              <div class="next-5-days__label">Wind</div>
            </div>
             <div class="next-5-days__wind">
               ${element.pressure} hPa
              <div class="next-5-days__label">Pressure</div>
            </div>
             <div class="next-5-days__wind">
               ${element.clouds}%
              <div class="next-5-days__label">Cluds</div>
            </div>
          </div>`;
  }

  daily_weather.innerHTML = days_container;
  hourly_weather.innerHTML = hourly_container;

  //Wind speed.
  let speedElement = document.querySelector(".wind_speed");
  speedElement.innerText = weather.current.wind_speed;

  //Humidity.
  let humidity = document.querySelector(".humidity");
  humidity.innerText = weather.current.humidity;

  // sunrise
  let sunRiseElement = document.querySelector(".sun_rise");
  let sunRiseDateObj = new Date(weather.current.sunrise * 1000);
  // Get hours from the timestamp
  sunRiseHours = sunRiseDateObj.getUTCHours();
  // Get minutes part from the timestamp
  sunRiseMinutes = sunRiseDateObj.getUTCMinutes();
  // Get seconds part from the timestamp
  sunRiseSeconds = sunRiseDateObj.getUTCSeconds();
  formattedTimeSunRise =
    sunRiseHours.toString().padStart(2, "0") +
    ":" +
    sunRiseMinutes.toString().padStart(2, "0") +
    ":" +
    sunRiseSeconds.toString().padStart(2, "0");
  sunRiseElement.innerText = `${formattedTimeSunRise}`;

  // sunset
  let sunSetElement = document.querySelector(".sun_set");
  let sunsetDateObj = new Date(weather.current.sunset * 1000);
  // Get hours from the timestamp
  sunsetHours = sunsetDateObj.getUTCHours();
  // Get minutes part from the timestamp
  sunsetMinutes = sunsetDateObj.getUTCMinutes();
  // Get seconds part from the timestamp
  sunsetSeconds = sunsetDateObj.getUTCSeconds();
  formattedTimeSunSet =
    sunsetHours.toString().padStart(2, "0") +
    ":" +
    sunsetMinutes.toString().padStart(2, "0") +
    ":" +
    sunsetSeconds.toString().padStart(2, "0");

  sunSetElement.innerText = `${formattedTimeSunSet}`;

  //CREATING KEY AND VALUE
  const localStorageObject={
    tempWeather: tempElement.innerHTML,
    iconWeather: iconElement.innerHTML,
    descrWeather: descElement.innerText,
    daiyWeather: daily_weather.innerHTML,
    hourWeather: hourly_weather.innerHTML,
    speedElementNow: speedElement.innerText,
    humidityNow: humidity.innerText,
    sunRiseNow: sunRiseElement.innerText,
    sunSetNow: sunSetElement.innerText

  }

  //SAVE TO LOCAL STORAGE
  saveToLocalStorage(localStorageObject);

}

function dateBuilder(d) {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "Decembre",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}

// FUNCTION TO SAVE INFORMATION TO THE LOCALSTORAGE
function saveToLocalStorage(data) {
  let weatherInfo;

  if (localStorage.getItem('weatherInfo') == null) {
      weatherInfo = []
  } 
  else {
      weatherInfo = JSON.parse(localStorage.getItem('weatherInfo'))
  }
  localStorage.setItem('weatherInfo', JSON.stringify(data));
}


//  FUNCTION FOR GETTING WEATHER INFORMATION FROM LOCAL STORAGE
function displayFromLocalStorage() {
  let weatherInfo;
  if (localStorage.getItem('weatherInfo') === null) {
      return console.log('no weather information in the local storage')
  } else {
      weatherInfo = JSON.parse(localStorage.getItem('weatherInfo'))
  }
  // city location
  cityLocation.innerHTML = weatherInfo.cityName;
  // temperature
  temperature.innerHTML = weatherInfo.temperature;
  // time
  time.innerHTML = weatherInfo.time;
  // weather status
  w.innerHTML = weatherInfo.weather;
  iconic.innerHTML = weatherInfo.icons;
  tableCell[0].innerHTML = weatherInfo.tableCells[0];
  tableCell[1].innerHTML = weatherInfo.tableCells[1];
  tableCell[2].innerHTML = weatherInfo.tableCells[2];
  tableCell[3].innerHTML = weatherInfo.tableCells[3];
}