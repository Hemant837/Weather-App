const API_KEY = "995e377bd39f4afa9f0233fa0d735989";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");
const weatherIcon = document.querySelector(".weather-icon");

function kelvinToCelsius(kelvin) {
  return Math.round(kelvin - 273.15);
}

async function checkWeather(cityName) {
  try {
    const weatherData = await axios.get(
      `${BASE_URL}weather?q=${cityName}&appid=${API_KEY}`
    );
    const response = weatherData.data;

    const { name, sys, main, weather, wind, visibility, coord } = response;

    document.querySelector(".location").innerText = `${name}, ${sys.country}`;
    document.querySelector(
      ".humidity-description"
    ).innerText = `${main.humidity}% Humidity`;
    document.querySelector(".pressure-description").innerText = `${(
      main.pressure * 0.02953
    ).toFixed(2)} Hg Pressure`;
    document.querySelector(".temperature").textContent = `${kelvinToCelsius(
      main.temp
    )}°C`;

    const options = { weekday: "long", hour: "numeric", minute: "numeric" };
    const formattedDate = new Date(response.dt * 1000).toLocaleDateString(
      undefined,
      options
    );
    document.querySelector(".current-time").textContent = formattedDate;

    document.querySelector(
      ".max-temp"
    ).innerText = `Max temp: ${kelvinToCelsius(main.temp_max)}°C`;
    document.querySelector(
      ".min-temp"
    ).innerText = `Min temp: ${kelvinToCelsius(main.temp_min)}°C`;

    document.querySelector(
      ".wind-status"
    ).innerText = `Speed: ${wind.speed} Km/h`;
    document.querySelector(".deg").innerText = `Deg: ${wind.deg}°`;

    document.querySelector(".visibility").innerText = `${visibility / 1000} Km`;

    document.querySelector(".latitude").innerText = `Latitude: ${coord.lat}`;
    document.querySelector(".ground").innerText = `Ground: ${(
      main.grnd_level * 0.02953
    ).toFixed(2)} Hg`;
    document.querySelector(".sea").innerText = `Sea: ${(
      main.sea_level * 0.02953
    ).toFixed(2)} Hg`;

    const sunrise = document.querySelector(".sunrise");
    const sunriseTime = new Date(sys.sunrise * 1000).toLocaleTimeString();
    sunrise.innerHTML = `<img class="sunrise-image" src="images/sunrise.png" /><span class="sunrise-text">${sunriseTime}</span>`;

    const sunset = document.querySelector(".sunset");
    const sunsetTime = new Date(sys.sunset * 1000).toLocaleTimeString();
    sunset.innerHTML = `<img class="sunset-image" src="images/sunset.png" /><span class="sunset-text">${sunsetTime}</span>`;

    if (weather[0].main == "Clouds") {
      weatherIcon.src = "images/clouds.png";
    } else if (weather[0].main == "Rain") {
      weatherIcon.src = "images/rain.png";
    } else if (weather[0].main == "Sun") {
      weatherIcon.src = "images/Clear.png";
    }
  } catch (error) {
    console.log("Error fetching current weather:", error);
  }

  // Forecast for 5 days
  try {
    const forecastData = await axios.get(
      `${BASE_URL}forecast?q=${cityName}&appid=${API_KEY}`
    );

    const newResponse = forecastData.data;
    const uniqueForecast = [];

    const fiveDaysForecast = newResponse.list.filter((forecast) => {
      const forecastDate = new Date(forecast.dt_txt).getDate();
      if (!uniqueForecast.includes(forecastDate)) {
        return uniqueForecast.push(forecastDate);
      }
    });

    const cardsGroup = document.querySelector(".forecast-cards");
    cardsGroup.innerHTML = "";
    searchInput.value = "";

    fiveDaysForecast.forEach((weatherItem, index) => {
      if (index !== 0) {
        const cardHTML = `
          <div class="forecast-card">
            <p class="card-text">${weatherItem.dt_txt.split(" ")[0]}</p>
            <img class="card-image" src="https://openweathermap.org/img/wn/${
              weatherItem.weather[0].icon
            }.png" />
          </div>
        `;
        cardsGroup.innerHTML += cardHTML;
      }
    });
  } catch (error) {
    console.log("Error fetching forecast data:", error);
  }
}

searchButton.addEventListener("click", () => {
  checkWeather(searchInput.value);
});
