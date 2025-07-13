const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currentTab = userTab;
const API_KEY = "3e1368f24eeb4fbe02775376fc52c447";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab) {
    if (clickedTab !== currentTab) {

        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            // if searchform tab is invisible if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            // it mean the currentTab contains search form tab therefore we should visible your weather tab..
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // now we are in your weather tab,then display weather so check local storage first for coordinates,if we have saved then before.
            getfromSessionStorage();

        }
    }
}

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates")
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
    }
    else {
        // it convert a json sting into json object
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
        grantAccessContainer.classList.remove("active");
    }
}

userTab.addEventListener("click", () => {
    // pass clicked tab as  input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    // pass clicked tab as  input parameter
    switchTab(searchTab);
});
// to check if coordinates are already present in session storage



async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    // grant container invisible and loader visible
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    // API Call
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        // 🌐 API returns 404 with success status code
        if (data.cod !== 200) {
            throw new Error("City not found");
        }

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (error) {
        console.error("Error:", error);

        loadingScreen.classList.remove("active");

    }

}
function renderWeatherInfo(weatherInfo) {
    // firstly we have to fetch the element
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[ data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[ data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // optional chaining expression-->user?.address?.zip 
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText =`${weatherInfo?.main?.temp}°C`;
    windspeed.innerText =`${weatherInfo?.wind?.speed}m/s` ;
    humidity.innerText =`${weatherInfo?.main?.humidity}%` ;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        // show an alert for nno geolocation support available
         grantAccessButton.style.display = "none";
        // messageText.innerText = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]")
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value
    if (cityName === "") return;
    else
    fetchSearchWeatherInfo(cityName);
    cityName="";
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
         if (data.cod !== 200) {
           throw new Error("City not found");
         }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (error) {
      loadingScreen.classList.remove("active");
      // apierrormsg.innerText=`${error?.message}`;
      console.error("Fetch error:", error.message);

      loadingScreen.classList.remove("active");
      userInfoContainer.classList.add("active");

      // 👇 Show 404 error image inside weatherIcon img tag
      const cityName = document.querySelector("[data-cityName]");
      const weatherIcon = document.querySelector("[data-weatherIcon]");
      const desc = document.querySelector("[data-weatherDesc]");
      const temp = document.querySelector("[data-temp]");
      const windspeed = document.querySelector("[data-windspeed]");
      const humidity = document.querySelector("[data-humidity]");
      const cloudiness = document.querySelector("[data-cloudiness]");
      const countryIcon = document.querySelector("[data-countryIcon]");

      cityName.innerText = "City Not Found   ";
      weatherIcon.src = "./assets/not-found.png";
      desc.innerText = "--";
      temp.innerText = "--°C";
      windspeed.innerText = "-- m/s";
      humidity.innerText = "--%";
      cloudiness.innerText = "--%";
    countryIcon.src =""
        countryIcon.src = "./assets/not-found.png"; // Optional
    }
}


