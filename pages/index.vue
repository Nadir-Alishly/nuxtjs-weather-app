<template>
	<transition name="fade">
		<div class="loading-screen" v-if="loadingStore.isLoading">
			<Icon name="svg-spinners:ring-resize"/>
		</div>
	</transition>
	
	<div v-if="!loadingStore.isLoading">
		<div class="bg">
			<img src="~/assets/images/bg.png"/>
		</div>
		<div class="animation">
			<transition name="fade" mode="out-in">
				<img :key="weatherDataStore.getCurrentWeather.desc" :src="`/_nuxt/assets/gifs/${getGif(weatherDataStore.getCurrentWeather.desc)}`"/>
			</transition>
		</div>
		<div class="info">
			<transition name="fade" mode="out-in">
				<h2 :key="Math.round(weatherDataStore.getCurrentWeather.temp)">{{ Math.round(weatherDataStore.getCurrentWeather.temp) }}°</h2>
			</transition>
			<transition name="fade" mode="out-in">
				<h3 :key="weatherDataStore.getCurrentWeather.desc">{{ weatherDataStore.getCurrentWeather.desc }}</h3>
			</transition>
			<transition name="fade" mode="out-in">
				<p :key="weatherDataStore.getCurrentWeather.wind">wind {{ weatherDataStore.getCurrentWeather.wind }} meter/sec</p>
			</transition>
			<transition name="fade" mode="out-in">
				<p :key="weatherDataStore.getCurrentWeather.humidity">humidity {{ weatherDataStore.getCurrentWeather.humidity }}%</p>
			</transition>
			<transition name="fade" mode="out-in">
				<p :key="weatherDataStore.getCurrentWeather.rain">rain {{ weatherDataStore.getCurrentWeather.rain }} mm</p>
			</transition>
			
			<form @submit.prevent="handleSubmit">
				<input class="text-input" type="text" name="locationInput" placeholder="location" required><br>
				<input class="submit-button" type="submit" value="Change Location">
			</form>
		</div>
		<div class="location">
			<Icon name="ic:baseline-location-on"/>
			<transition name="fade" mode="out-in">
				<h3 :key="locationStore.getLocation">{{ locationStore.getLocation }}</h3>
			</transition>
		</div>
		<div class="date">
			<transition name="fade" mode="out-in">
				<p :key="weatherDataStore.getCurrentWeather.dt" class="day">{{ getDay(weatherDataStore.getCurrentWeather.dt) }}</p>
			</transition>
			<transition name="fade" mode="out-in">
				<p :key="weatherDataStore.getCurrentWeather.dt" class="month">{{ getMonth(weatherDataStore.getCurrentWeather.dt) }}</p>
			</transition>
		</div>
		<transition name="fade" mode="out-in">
			<div :key="weatherDataStore.getForecastWeather" class="forecast">
				<li v-for="i in weatherDataStore.getForecastWeather">
					<h3>{{ Math.round(i.temp) }}°</h3>
					<Icon :name="getIcon(i.desc)" />
					<p>{{ getTime(i.dt) }}</p>
					<p>{{ getDay(i.dt) }} {{ getMonth(i.dt) }}</p>
				</li>
			</div>
		</transition>
	</div>
	
	
</template>

<script setup>

	onMounted( async () => {
		await nextTick( async () => {
	
			let initialLocation = "Istanbul"
			let coords = await cityNameToCoords(initialLocation)
			if(coords) {
				locationStore.changeLocation(coords.name)
				await getWeatherData(coords.lat, coords.lon)
			}
			loadingStore.changeLoadingStatus(false)
		})
	})

	const API_KEY = "b47a344ec949ced5b57bad108f10d18e"
	const loadingStore = useLoadingStore()
	const locationStore = useLocationStore()
	const weatherDataStore = useWeatherDataStore()

	const monthNames = ["January", "February", "March", "April", "May", "June",
  	"July", "August", "September", "October", "November", "December"]

	const iconNames = {'Clear': 'wi:day-sunny', 'Clouds': 'wi:cloudy', 'Rain': 'wi:rain', 'Drizzle': 'wi:sprinkle', 'Snow': 'wi:snow', 'Thunderstorm': 'wi:thunderstorm'}
	const gifNames = {'Clear': 'sunny.gif', 'Clouds': 'clouds.gif', 'Rain': 'rain.gif', 'Drizzle': 'drizzle.gif', 'Snow': 'snow.gif', 'Thunderstorm': 'thunderstorm.gif'}

	const cityNameToCoords = async (cityName) => {
		const { data } = await useFetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${API_KEY}`)
		if(data._value[0] == undefined) {
			alert("could not find city with that name")
			return false
		}
		else {
			let name = data._value[0].name
			let lat = data._value[0].lat
			let lon = data._value[0].lon
			return {"name" : name, "lat" : lat, "lon" : lon}
		}
	}

	const getWeatherData = async (lat, lon) => {
		const { data } = await useFetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
		let newWeatherData = []
		data._value.list.forEach(element => {
			let rain = 0
			if(element.rain) {
				rain = element.rain['3h']
			}
			let obj = {'dt': element.dt, 'desc': element.weather[0].main, 'temp': element.main.temp, 'wind': element.wind.speed, 'humidity': element.main.humidity, 'rain': rain}
			newWeatherData.push(obj)
		})

		weatherDataStore.changeWeatherData(newWeatherData)
	}
	
	const getTime = (unix) => {
		let date = new Date(parseFloat(unix) * 1000)
		return `${date.getHours()}:00`
	}

	const getDay = (unix) => {
		let date = new Date(parseFloat(unix) * 1000)
		return date.getDate()
	}

	const getMonth = (unix) => {
		let date = new Date(parseFloat(unix) * 1000)
		return monthNames[date.getMonth()]
	}

	const getIcon = (desc) => {
		let conditions = Object.keys(iconNames)
		let conditionExists = false
		conditions.forEach( condition => {
			if (desc == condition) {
				conditionExists = true
			}
		})

		if(conditionExists) {
			return iconNames[desc]
		}
		else {
			return 'wi:fog'
		}
	}

	const getGif = (desc) => {
		let conditions = Object.keys(gifNames)
		let conditionExists = false
		conditions.forEach( condition => {
			if (desc == condition) {
				conditionExists = true
			}
		})

		if(conditionExists) {
			return gifNames[desc]
		}
		else {
			return 'fog.gif'
		}
	}

	const handleSubmit = async (e) => {
		let newLocation = e.target.elements.locationInput.value

		let coords = await cityNameToCoords(newLocation)
		if(coords) {
			locationStore.changeLocation(coords.name)
			getWeatherData(coords.lat, coords.lon)
		}
		
	}

</script>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;800&display=swap');

	body {
		padding: 0;
		margin: 0;
		overflow-x: hidden;
		font-family: 'Poppins', sans-serif;
		color: #343A55;
		background-color: #C2CBD7;
	}

	.loading-screen {
		width: 100vw;
		height: 100vh;
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #C2CBD7;
		z-index: 10;
	}

	.loading-screen svg {
		font-size: 5vw;
		color: #343A55;
	}

	.fade-enter-active, .fade-leave-active {
  		transition: opacity .5s ease-in-out;
	}

	.fade-enter-from, .fade-leave-to {
 		opacity: 0 !important;
	}

	.bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		z-index: -1;
	}

	.bg img {
		width: 100%;
	}

	.animation {
		position: absolute;
		width: 27vw;
		left: 17.1vw;
		top: 0;
		z-index: -2;
	}

	.animation img {
		width: 100%;
	}

	.info {
		position: absolute;
		top: 5vw;
		left: 50vw;
	}

	.info h2 {
		font-size: 8vw;
		margin: 0;
		color: #607E55;
	}

	.info h3 {
		font-size: 3vw;
		margin: 0;
	}

	.info p {
		font-size: 1.5vw;
		margin: 0.5vw 0;
	}

	.info form {
		margin-top: 3vw;
	}

	.info form .text-input {
		color: #343A55;
		font-size: 1.5vw;
		border: none;
		border-bottom: #343A55 .2vw solid;
		background-color: transparent;
		width: 10vw;
		padding: .2vw;
	}

	.info form .text-input:focus {
		outline: none;
	}

	.info form .text-input::placeholder {
		color: #343A55;
		opacity: 50%;
	}

	.info form .submit-button {
		color: #fff;
		background-color: #343A55;
		font-size: 1vw;
		padding: .5vw;
		border: none;
		border-radius: .2vw;
		margin-top: .5vw;
		cursor: pointer;
		transition: .2s ease-in-out;
	}

	.info form .submit-button:hover {
		background-color: #657FAA;
	}

	.info form .submit-button:active {
		background-color: #343A55;
	}

	.location {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		top: 8vw;
		width: 20vw;
		left: 77vw;
	}

	.location * {
		margin: 0;
		font-size: 1.5vw;
	}


	.date {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 7vw;
		height: 4vw;
		top: 19vw;
		left: 83.6vw;
	}

	.date p {
		margin: 0;
	}

	.date .day {
		font-size: 1.8vw;
	}

	.date .month {
		font-size: 1vw;
	}

	.forecast {
		position: absolute;
		width: 95vw;
		display: flex;
		top: 52vw;
		left: 2.5vw;
		overflow-x: auto;
		padding-bottom: 2vw;
	}

	.forecast li {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 15vw;
		list-style-type: none;
		flex-shrink: 0;
	}

	.forecast li h3{
		font-size: 2vw;
		margin: .5vw;
		color: #607E55;
	}

	.forecast li svg {
		font-size: 5vw;
	}

	.forecast li::before {
		content: '';
		position: absolute;
		width: 6vw;
		height: .2vw;
		top: 6.25vw;
		transform: translateX(-5vw);
		background-color: #343A55;
	}

	.forecast li::after {
		content: '';
		position: absolute;
		width: 6vw;
		height: .2vw;
		top: 6.25vw;
		transform: translateX(5vw);
		background-color: #343A55;
	}

	.forecast li p {
		font-size: 1vw;
		margin: .2vw;
	}

</style>