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