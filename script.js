const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const weatherInfoSection = document.querySelector('.weather-info');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');

const countryTxt = document.querySelector('.country-text');
const tempTxt = document.querySelector('.temp-text');
const conditionTxt = document.querySelector('.condition-txt');
const humidityTxt = document.querySelector('.humidity-value-txt');
const windTxt = document.querySelector('.wind-value-txt');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const currentDateTxt = document.querySelector('.current-date-text');

const forecastItemsContainer = document.querySelector('.forecast-items-container');

const APIKey = '4e5459611a963874e3420b17e87326c4';

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != '') {
        const city = cityInput.value;
        updateWeatherInfo(city);
        cityInput.value = '';
        cityInput.blur();
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityInput.value.trim() != '') {
        const city = cityInput.value;
        updateWeatherInfo(city);
        cityInput.value = '';
        cityInput.blur();
    }
});

async function getFetchData(endPoint, city) {
    const APIUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${APIKey}&units=metric`;
    const response = await fetch(APIUrl);
    return response.json();
};

function getWeatherIcon(id) {
    if (id <= 232) {
        return 'thunderstorm.svg';
    }
    if (id <= 321) {
        return 'drizzle.svg';
    }
    if (id <= 531) {
        return 'rain.svg';
    }
    if (id <= 622) {
        return 'snow.svg';
    }
    if (id <= 781) {
        return 'atmosphere.svg';
    }
    if (id <= 800) {
        return 'clear.svg';
    } else return 'clouds.svg';
};

function getCurrentDate() {
    const currentDate = new Date();

    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    };
    return currentDate.toLocaleDateString('en-GB', options);

};

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);
    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSection);
        return
    };
    const {
        name: country,
        main: {
            temp,
            humidity
        },
        weather: [{
            id,
            main
        }],
        wind: {
            speed
        }
    } = weatherData;

    countryTxt.textContent = country;
    const tempRound = Math.round(temp);
    tempTxt.textContent = `${tempRound} °C`;
    conditionTxt.textContent = main;
    humidityTxt.textContent = `${humidity}%`;
    const windSpeed = Math.round(speed * 1.609);
    windTxt.textContent = `${windSpeed} km/h`;

    currentDateTxt.textContent = getCurrentDate();
    await updateForecastsInfo(city);

    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;

    showDisplaySection(weatherInfoSection);

};

async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData('forecast', city);
    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];

    forecastItemsContainer.innerHTML = '';

    forecastsData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken)) {
            updateForecastItems(forecastWeather);
        };

    });
};

function updateForecastItems(weatherData) {
    const {
        dt_txt: date,
        weather: [{
            id
        }],
        main: {
            temp
        }
    } = weatherData;

    const dateTaken = new Date(date);
    const dateOption = {
        day: '2-digit',
        month: 'short'
    };
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption);

    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" alt="" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `;
    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem);
};

function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection].forEach(section => {
        section.style.display = 'none'
    });

    section.style.display = 'flex';
};

