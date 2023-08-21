const baseURL = "https://api.openweathermap.org/data/2.5/";
const searchBar = document.querySelector(".searchInput");
const searchBtn = document.querySelector(".searchButton");
const weatherImg = document.querySelector(".weatherImage");

async function checkWeather(cityName) {
  try {
    const weatherData = await axios.get(
      baseURL +
        "weather?q=" +
        cityName +
        "&appid=995e377bd39f4afa9f0233fa0d735989"
    );
    const response = weatherData.data;
    console.log(response);

    document.querySelector(".cityName").innerText =
      response.name + ", " + response.sys.country;

    document.querySelector(".humidityDes").innerText =
      response.main.humidity + "% " + "Humdity";

    document.querySelector(".pressure").innerText =
      (response.main.pressure * 0.02953).toFixed(2) + " Hg Pressure";

    document.querySelector(".temperature").textContent =
      Math.round(response.main.temp - 273.15) + "°C";

    const options = { weekday: "long", hour: "numeric", minute: "numeric" };
    const formattedDate = new Date(response.dt * 1000).toLocaleDateString(
      undefined,
      options
    );

    document.querySelector(".time").textContent = formattedDate;

    document.querySelector(".max-temp").innerText =
      "Max temp: " + Math.round(response.main.temp_max - 273.15) + "°C";

    document.querySelector(".min-temp").innerText =
      "Min temp: " + Math.round(response.main.temp_max - 273.15) + "°C";

    document.querySelector(".wind-status").innerText =
      "Speed: " + response.wind.speed + " Km/h";

    document.querySelector(".deg").innerText =
      "Deg: " + response.wind.deg + "°";

    document.querySelector(".visibility").innerText =
      response.visibility / 1000 + " Km";

    document.querySelector(".latitude").innerText =
      "Latitude: " + response.coord.lat;

    document.querySelector(".ground").innerText =
      "Ground: " + (response.main.grnd_level * 0.02953).toFixed(2) + " Hg";

    document.querySelector(".sea").innerText =
      "Sea: " + (response.main.sea_level * 0.02953).toFixed(2) + " Hg";

    document.querySelector(".longitude").innerText =
      "Longitude: " + response.coord.lon;

    const sunrise = document.querySelector(".sunrise");
    const sunriseTime = new Date(
      response.sys.sunrise * 1000
    ).toLocaleTimeString();

    sunrise.innerHTML =
      `<img class="sunrise-image" src="images/sunrise.png" />` +
      `<span class="sunrise-text">${sunriseTime}</span>`;

    const sunset = document.querySelector(".sunset");
    const sunsetTime = new Date(
      response.sys.sunset * 1000
    ).toLocaleTimeString();

    sunset.innerHTML =
      `<img class="sunset-image" src="images/sunset.png" />` +
      `<span class="sunset-text">${sunsetTime}</span>`;

    if (response.weather[0].main == "Clouds") {
      weatherImg.src = "images/clouds.png";
    } else if (response.weather[0].main == "Rain") {
      weatherImg.src = "images/rain.png";
    }
  } catch (error) {
    console.log(error);
  }

  // forcast of 5 days
  try {
    const forecastData = await axios.get(
      baseURL +
        "forecast?q=" +
        cityName +
        "&appid=995e377bd39f4afa9f0233fa0d735989"
    );

    const newResponse = forecastData.data;
    // console.log(newResponse);
    const uniqueForecast = [];

    const fiveDaysForecast = newResponse.list.filter((forecast) => {
      const forcastDate = new Date(forecast.dt_txt).getDate();

      if (!uniqueForecast.includes(forcastDate)) {
        return uniqueForecast.push(forcastDate);
      }
    });
    console.log(fiveDaysForecast);

    const cardsGroup = document.querySelector(".cards-group1");
    cardsGroup.innerHTML = "";
    searchBar.value = "";

    fiveDaysForecast.forEach((weatherItem, index) => {
      if (index !== 0) {
        const cardHTML = `
          <div class="card1">
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
    console.log(error);
  }
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBar.value);
});
