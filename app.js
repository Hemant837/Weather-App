const baseURL = "https://api.openweathermap.org/data/2.5/weather?q=";
const searchBar = document.querySelector(".searchInput");
const searchBtn = document.querySelector(".searchButton");
const weatherImg = document.querySelector(".weatherImage");

async function checkWeather(cityName) {
  try {
    const responses = await axios.get(
      baseURL + cityName + "&appid=995e377bd39f4afa9f0233fa0d735989"
    );
    const response = responses.data;
    console.log(response);

    document.querySelector(".cityName").innerText =
      response.name + ", " + response.sys.country;

    document.querySelector(".humidityDes").innerText =
      response.main.humidity + "% " + "Humdity";

    document.querySelector(".windDes").innerText =
      response.wind.speed + " Km/h" + " Wind";

    document.querySelector(".temperature").textContent =
      Math.round(response.main.temp - 273.15) + "°C";

    if (response.weather[0].main == "Clouds") {
      weatherImg.src = "images/clouds.png";
    }
  } catch (error) {
    console.log(error);
  }
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBar.value);
});
