const searchInput =
document.getElementById("searchInput");

const searchBtn =
document.getElementById("searchBtn");

const locationBtn =
document.getElementById("locationBtn");

const searchResults =
document.getElementById("searchResults");

const forecastGrid =
document.getElementById("forecastGrid");

const hourlyGrid =
document.getElementById("hourlyGrid");

const unitSelect =
document.getElementById("unitSelect");

const loading =
document.getElementById("loading");

const themeToggle =
document.getElementById("themeToggle");

const themeIcon =
document.getElementById("themeIcon");

const favoritesList =
document.getElementById("favoritesList");

const clearFavorites =
document.getElementById("clearFavorites");

let currentLat = null;
let currentLon = null;

let selectedDayIndex = 0;

/* WEATHER ICONS */

const weatherCodes = {

  0:[
    "Céu limpo",
    "https://cdn-icons-png.flaticon.com/512/869/869869.png"
  ],

  1:[
    "Poucas nuvens",
    "https://cdn-icons-png.flaticon.com/512/1163/1163661.png"
  ],

  2:[
    "Parcialmente nublado",
    "https://cdn-icons-png.flaticon.com/512/414/414825.png"
  ],

  3:[
    "Nublado",
    "https://cdn-icons-png.flaticon.com/512/414/414927.png"
  ],

  61:[
    "Chuva",
    "https://cdn-icons-png.flaticon.com/512/3351/3351979.png"
  ],

  95:[
    "Tempestade",
    "https://cdn-icons-png.flaticon.com/512/1146/1146860.png"
  ]

};

/* LOADING */

function showLoading(){

  loading.classList.remove("hidden");

}

function hideLoading(){

  loading.classList.add("hidden");

}

/* SEARCH */

async function searchCity(city){

  try{

    showLoading();

    const url =
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=30&language=pt&format=json&countryCode=BR`;

    const response =
    await fetch(url);

    const data =
    await response.json();

    searchResults.innerHTML = "";

    if(!data.results){

      hideLoading();

      return;

    }

    data.results.forEach(place=>{

      const item =
      document.createElement("div");

      item.className =
      "result-item";

      item.innerHTML = `

        <strong>
          ${place.name}
        </strong>

        <span>
          ${place.admin1 || ""}
          - ${place.country}
        </span>

      `;

      item.addEventListener("click",()=>{

        currentLat = place.latitude;
        currentLon = place.longitude;

        document.getElementById("location").innerText =
        `${place.name} - ${place.admin1}, ${place.country}`;

        searchResults.innerHTML = "";

        saveFavorite(place.name);

        fetchWeather();

      });

      searchResults.appendChild(item);

    });

    hideLoading();

  }catch(error){

    console.log(error);

    hideLoading();

  }

}