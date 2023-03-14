document.addEventListener('DOMContentLoaded', () => {
	const temp = document.getElementById('temp');
	const date = document.getElementById('date-time');
	const currentLocation = document.getElementById('location');
	const condition = document.getElementById('condition');
	const icon = document.getElementById('icon');
	const windSpeed = document.querySelector('.wind-speed');
	const windStatus = document.querySelector('.wind-status');
	const sunRise = document.querySelector('.sunrise');
	const sunSet = document.querySelector('.sunset');
	const humidity = document.querySelector('.humidity');
	const humidityStatus = document.querySelector('.humidity-status');
	const visibility = document.querySelector('.visibility');
	const visibilityStatus = document.querySelector('.visibility-status');
	const weatherCards = document.querySelector('#weather-cards');
	const searchInput = document.querySelector('#query');
	const searchBtn = document.querySelector('#search-btn');



	let currentCity = "";
	let currentUnit = "c";


	function getDateTime() {
		let now = new Date(),
			hour = now.getHours(),
			minute = now.getMinutes();
		
		let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

		hour = hour % 24;
		if (hour < 10) {
			hour = "0" + hour;
		}
		if (minute < 10) {
			minute = "0" + minute;
		}

		let dayString = days[now.getDay()];
		return `${dayString}, ${hour}:${minute}`
	}

	date.innerText = getDateTime();
		
	setInterval(() => {
		date.innerText = getDateTime();
	}, 1000);

	function getPublicIp() {
			fetch("https://api.ipgeolocation.io/ipgeo?apiKey=13eb6f60efc04a47b731606adb725e2b", {
				method: "GET",
			})
				.then((response) => response.json())
				.then((data) => {
					currentCity = data.city;
					getWeatherData(data.city, currentUnit);
				});
	}
	getPublicIp();


		
	function getWeatherData(city, unit) {
		const apiKey = "b98845271159b4b81535ee503272a158";
		fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`, { method: "GET", })
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				let today = data.list[0];
				temp.innerText = today.main.temp.toFixed(0)
				currentLocation.innerText = data.city.name;
				condition.innerText = today.clouds.all + '%';
				humidity.innerText = today.main.humidity + '%';
				updateHumidityStatus(today.main.humidity);
				visibility.innerText = convertToKm(today.visibility) + ' km';
				updateVisibilityStatus(convertToKm(today.visibility));
				windSpeed.innerText = Math.round(today.wind.speed) + ' m/sec';
				updateWindStatus(today.wind.speed);
				sunRise.innerText = convertTo12HourFormat(data.city.sunrise);
				sunSet.innerText = convertTo12HourFormat(data.city.sunset);
				icon.src = getIcon(today.weather[0].main);
				updateForecast(data.list, unit);
				
			})
			.catch((err) => {
				alert(err);
				alert("City not found");
		});
	}


	function convertToKm(visibility) {
		return (visibility / 1000).toFixed(1);
	}

	function updateHumidityStatus(humidity) {
		if (humidity <= 30) {
			humidityStatus.innerText = 'Low'
		} else if (humidity <= 60) {
			humidityStatus.innerText = 'Moderate';
		} else {
			humidityStatus.innerText = 'High';
		}
	}

	function updateVisibilityStatus(visibility) {
		if (visibility <= 0.3) {
			visibilityStatus.innerText = 'Dense fog';
		} else if (visibility <= 0.16) {
			visibilityStatus.innerText = 'Moderate fog';
		} else if (visibility <= 0.35) {
			visibilityStatus.innerText = 'Light fog';
		} else if (visibility <= 1.13) {
			visibilityStatus.innerText = 'Very light fog';
		} else if (visibility <= 2.16) {
			visibilityStatus.innerText = 'Light mist';
		} else if (visibility <= 5.14) {
			visibilityStatus.innerText = 'Very light mist';
		} else if (visibility <= 10.8) {
			visibilityStatus.innerText = 'Clear air';
		}
	}

	function updateWindStatus(windSpeed) {
		if (windSpeed <= 0.2) {
			visibilityStatus.innerText = 'Calm';
		} else if (windSpeed <= 3.3) {
			windStatus.innerText = 'Quiet';
		} else if (windSpeed <= 5.4) {
			windStatus.innerText = 'Light wind';
		} else if (windSpeed <= 10.7) {
			windStatus.innerText = 'Moderate';
		} else if (windSpeed <= 17.1) {
			windStatus.innerText = 'Storm';
		} else if (windSpeed <= 32.7) {
			windStatus.innerText = 'Hurricane';
		} 
	}

	function convertTo12HourFormat(time) {
		const date = new Date(time * 1000);
		let hours = date.getHours().toString().padStart(2, "0");
		let minutes = date.getMinutes().toString().padStart(2, "0");

		return `${hours}:${minutes}`;
	}

	function getIcon(condition) {
		if (condition === "Clouds") {
			return 'img/clouds.png';
		} else if (condition === 'Thunderstorm') {
			return 'img/thunderstorm.png';
		} else if (condition === 'Drizzle') {
			return 'img/drizzle.png';
		} else if (condition === 'Rain') {
			return 'img/rain.png';
		} else if (condition === 'snow') {
			return 'img/snow.png';
		} else if (condition === 'Fog') {
			return 'img/fog.png';
		} else if (condition === 'Clear') {
			return 'img/sunny.png';
		}
		
	}

	function getDayName(date) {
		let day = new Date(date * 1000);
		let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		
		return days[day.getDay()];
	}


	function updateForecast(data) {
		weatherCards.innerHTML = '';
		let day = 0;
		let numCards = 5;
		
		const forecasts = data.filter(forecast => forecast.dt_txt.includes('12:00'));
		for (let i = 0; i < numCards; i++){
			let card = document.createElement('div');
			card.classList.add('card');

			let dayName =getDayName(forecasts[day].dt);
			

			let dayTemp = Math.round(forecasts[day].main.temp);
			

			let iconCondition = forecasts[day].weather[0].main;
			let iconSrc = getIcon(iconCondition);
			let tempUnit = '°C';
			

			card.innerHTML = `
				<h2 class="day-name">${dayName}</h2>
					<div class="card-icon">
						<img src="${iconSrc}" alt="">
					</div>
					<div class="day-temp">
						<p class="temp">${dayTemp}</p>
						<span class="temp-unit">${tempUnit}</span>
					</div>
			`;

			weatherCards.appendChild(card);
			day++;
		}
		
	}

	searchBtn.addEventListener('click', setQuery);

	function setQuery() {
			currentCity = searchInput.value
			getWeatherData(searchInput.value, currentUnit);
	}
});