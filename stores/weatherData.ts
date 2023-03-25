import { defineStore } from 'pinia'

export const useWeatherDataStore = defineStore({
	id: 'weather-data-store',
	state: () => {
		return {
			weatherData : []
		}
	},
	actions: {
		changeWeatherData(value = []) {
			this.weatherData = value
		}
	},
	getters: {
		getCurrentWeather: state => state.weatherData[0],
		getForecastWeather: state => state.weatherData.slice(1)
	},
})