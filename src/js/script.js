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

/* WEATHER */

async function fetchWeather(){

  try{

    showLoading();

    const unit =
    unitSelect.value;

    const tempUnit =
    unit === "metric"
    ? "celsius"
    : "fahrenheit";

    const windUnit =
    unit === "metric"
    ? "kmh"
    : "mph";

    const url =
    `https://api.open-meteo.com/v1/forecast?
    latitude=${currentLat}
    &longitude=${currentLon}
    &current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m
    &daily=weather_code,temperature_2m_max,temperature_2m_min
    &hourly=temperature_2m,weather_code
    &forecast_days=7
    &timezone=auto
    &temperature_unit=${tempUnit}
    &wind_speed_unit=${windUnit}`
    .replace(/\s/g,"");

    const response =
    await fetch(url);

    const data =
    await response.json();

    renderCurrent(data, unit);

    renderForecast(data);

    renderHourly(data, selectedDayIndex);

    changeBackground(data.current.weather_code);

    hideLoading();

  }catch(error){

    console.log(error);

    hideLoading();

  }

}

/* CURRENT */

function renderCurrent(data, unit){

  const current =
  data.current;

  const weather =
  weatherCodes[current.weather_code]
  || weatherCodes[0];

  document.getElementById("temperature").innerText =
  `${Math.round(current.temperature_2m)}°`;

  document.getElementById("condition").innerText =
  weather[0];

  document.getElementById("weatherIcon").src =
  weather[1];

  document.getElementById("feelsLike").innerText =
  `${Math.round(current.apparent_temperature)}°`;

  document.getElementById("humidity").innerText =
  `${current.relative_humidity_2m}%`;

  document.getElementById("wind").innerText =
  `${current.wind_speed_10m}
  ${unit === "metric" ? "km/h" : "mph"}`;

  document.getElementById("precipitation").innerText =
  `${current.precipitation} mm`;

}

/* FORECAST */

function renderForecast(data){

  forecastGrid.innerHTML = "";

  data.daily.time.forEach((day,index)=>{

    const weather =
    weatherCodes[data.daily.weather_code[index]]
    || weatherCodes[0];

    const card =
    document.createElement("div");

    card.className =
    "forecast-card";

    if(index === selectedDayIndex){
      card.classList.add("active");
    }

    const date =
    new Date(day);

    card.innerHTML = `

      <h3>
        ${date.toLocaleDateString("pt-BR",{
          weekday:"short"
        })}
      </h3>

      <img src="${weather[1]}">

      <p>${weather[0]}</p>

      <strong>
        ${Math.round(data.daily.temperature_2m_max[index])}°
        /
        ${Math.round(data.daily.temperature_2m_min[index])}°
      </strong>

    `;

    card.addEventListener("click",()=>{

      selectedDayIndex = index;

      renderForecast(data);

      renderHourly(data,index);

    });

    forecastGrid.appendChild(card);

  });

}

/* HOURLY */

function renderHourly(data, dayIndex){

  hourlyGrid.innerHTML = "";

  const start =
  dayIndex * 24;

  const end =
  start + 24;

  for(let i=start;i<end;i+=3){

    const weather =
    weatherCodes[data.hourly.weather_code[i]]
    || weatherCodes[0];

    const card =
    document.createElement("div");

    card.className =
    "hour-card";

    card.innerHTML = `

      <h4>
        ${new Date(data.hourly.time[i])
        .toLocaleTimeString("pt-BR",{
          hour:"2-digit",
          minute:"2-digit"
        })}
      </h4>

      <img src="${weather[1]}">

      <p>${weather[0]}</p>

      <div class="hour-temp">
        ${Math.round(data.hourly.temperature_2m[i])}°
      </div>

    `;

    hourlyGrid.appendChild(card);

  }

}

/* GEOLOCATION */

function getUserLocation(){

  navigator.geolocation.getCurrentPosition(async(pos)=>{

    currentLat =
    pos.coords.latitude;

    currentLon =
    pos.coords.longitude;

    fetchWeather();

  });

}

/* FAVORITES */

function saveFavorite(city){

  let favorites =
  JSON.parse(localStorage.getItem("favorites"))
  || [];

  if(!favorites.includes(city)){

    favorites.push(city);

    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );

  }

  renderFavorites();

}

function renderFavorites(){

  favoritesList.innerHTML = "";

  let favorites =
  JSON.parse(localStorage.getItem("favorites"))
  || [];

  favorites.forEach(city=>{

    const item =
    document.createElement("div");

    item.className =
    "favorite-item";

    item.innerText =
    city;

    item.addEventListener("click",()=>{

      searchCity(city);

    });

    favoritesList.appendChild(item);

  });

}

/* BACKGROUND */

function changeBackground(code){

  if(code >= 61){

    document.body.style.background =
    "linear-gradient(to bottom right,#1e293b,#334155,#475569)";

  }else{

    document.body.style.background =
    "linear-gradient(to bottom right,#0f172a,#1e293b,#334155)";

  }

}

/* THEME */

function applyTheme(theme){

  if(theme === "light"){

    document.body.classList.add("light");

    themeIcon.innerHTML = `

      <circle cx="12" cy="12" r="5"></circle>

      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>

      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>

      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>

      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>

    `;

  } else {

    document.body.classList.remove("light");

    themeIcon.innerHTML = `
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"></path>
    `;

  }

}

themeToggle.addEventListener("click",()=>{

  const isLight =
  document.body.classList.contains("light");

  const newTheme =
  isLight ? "dark" : "light";

  localStorage.setItem(
    "theme",
    newTheme
  );

  applyTheme(newTheme);

});

/* EVENTS */

searchBtn.addEventListener("click",()=>{

  const city =
  searchInput.value.trim();

  if(city){
    searchCity(city);
  }

});

searchInput.addEventListener("input",()=>{

  const city =
  searchInput.value.trim();

  if(city.length >= 2){
    searchCity(city);
  }

});

searchInput.addEventListener("keydown",(e)=>{

  if(e.key === "Enter"){
    searchBtn.click();
  }

});

unitSelect.addEventListener("change",()=>{

  if(currentLat && currentLon){
    fetchWeather();
  }

});

locationBtn.addEventListener("click",()=>{

  getUserLocation();

});

clearFavorites.addEventListener("click",()=>{

  localStorage.removeItem("favorites");

  renderFavorites();

});

/* INIT */

renderFavorites();

const savedTheme =
localStorage.getItem("theme") || "dark";

applyTheme(savedTheme);

searchCity("");