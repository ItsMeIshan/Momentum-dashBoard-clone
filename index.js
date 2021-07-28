
const body = document.getElementById("body");
const imageAuthor = document.getElementById("image-author");
const authorInsta = document.getElementById("author-insta");
const defaultUrl = "https://images.unsplash.com/photo-1471958680802-1345a694ba6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDcwNDN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjY0MTIzNTQ&ixlib=rb-1.2.1&q=80&w=1080";
const cryptoCoin = document.getElementById("crypto");
const cryptoInfo = document.getElementById("crypto-header");
const cryptoIncrease = document.getElementById("increase");
const cryptoDecrease = document.getElementById("decrease");
const weatherSection = document.getElementById("weather");
const time = document.getElementById("time");
const options = document.getElementById("search-select");
const searchBar = document.getElementById("search");
let searchQuery = "";
let wallpaperChoice = "nature";
let coinName = "bitcoin";
let selectedCategory = "";

//default fetch for wallpaper
getWallpaper(wallpaperChoice);
//default fetch for CryptoCoins
getCryptoCoin(coinName);
//default search bar will be disabled
if(selectedCategory === "") {
    searchBar.disabled = true;
}
//selecting category for search
options.addEventListener("change", ()=>{
    selectedCategory = options.value;
    if(selectedCategory === "") {
        searchBar.disabled = true;
    }else{
        searchBar.disabled = false;
    }
})
//event for search
searchBar.addEventListener("change", (e) => {
   searchQuery = e.target.value;
   if(selectedCategory === "wallpaper"){
       getWallpaper(searchQuery);
   }
   else if(selectedCategory === "CryptoCurrency") {
       getCryptoCoin(searchQuery);
   } 
})



//live Update Time!
setInterval(function () {
    const timeReal = new Date();
    let timeString = timeReal.toLocaleTimeString("en-in", {timeStyle: "medium", timeZone: "IST"});
    time.textContent = timeString.toUpperCase();
}, 1000);

function getWallpaper(choice) {
    fetch(`https://api.unsplash.com/photos/random/?client_id=IGHD4Tzlfx9qHexgx-aIcIWwPExeOw6uBJj_PJXeoiM&orientation=landscape&query=${choice}`)
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        let url = data.urls.full;
        let username = data.user.name;
        let instaUsername = data.user.instagram_username;
        console.log(url);
        body.style.backgroundImage = `url("${url}")`
        imageAuthor.innerHTML = `
        By: ${username}`
        authorInsta.innerHTML =`
        <a id="author-insta"
        href="https://instagram.com/${instaUsername}"
        target="_blank"
        rel="noopener"
        ><img
          src="./img/instagram.png"
          width="25px"
          height="25px"
          alt="instagram"
      /></a>
        `;
        //throw Error("to test default background")
    })
    .catch(error => {
        console.log(error);
        body.style.backgroundImage = `url("${defaultUrl}")`
    })
}
function getCryptoCoin(coinName){
    document.getElementById("crypto-header").classList.remove("error");
    document.getElementById("error-text").textContent = "";
    fetch(`https://api.coingecko.com/api/v3/coins/${coinName}`)
        .then(response => {
            if (!response.ok) {
                throw Error("Coin data not available");
            }
            return response.json();
        })
        .then(data =>{
            console.log(data);
            let image = data.image.small;
            let name = data.name;
            let currentPrice = data.market_data.current_price.inr;
            let highPrice = data.market_data.high_24h.inr;
            let lowPrice = data.market_data.low_24h.inr;
            let highPriceElement = document.getElementById("highPriceElement");
            let lowPriceElement = document.getElementById("lowPriceElement");
            cryptoCoin.innerHTML = `
            <img src="${image}" alt="${name} image" />
            <span>${name}</span>
            `
            highPriceElement.textContent = ` ₹ ${highPrice}`;
            lowPriceElement.textContent = ` ₹ ${lowPrice}`; 
        })
        .catch(error => {
            document.getElementById("error-text").textContent = error;
            document.getElementById("crypto-header").classList.add("error");
            console.log(error)
        })}

function weatherForecast(latitude, longitude){
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=67b30adb434855ae0979a0e7671dd3d4`)
    .then(response => {
        if (!response.ok) {
            throw Error("Weather data not available");
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        let weatherInfo = data.weather;
        weatherSection.innerHTML = `
        <img src="http://openweathermap.org/img/wn/${weatherInfo[0].icon}@2x.png" alt="${weatherInfo[0].description}" />
        <span class="main-temp">${Math.round(data.main.temp)} ºC</span>
        <span class="weather-info">${weatherInfo[0].main}</span>
        <span class="temp-section">Feels like ${Math.round(data.main.feels_like)} ºC</span>
        <span class="city-country">${data.name}, ${data.sys.country}</span>
        `
    })
    .catch(error => console.log(error))
    console.log(`${latitude} ${longitude}`);
}
navigator.geolocation.getCurrentPosition((position) => {
    weatherForecast(position.coords.latitude, position.coords.longitude);
});    

