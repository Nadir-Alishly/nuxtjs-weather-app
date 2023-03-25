import { defineStore } from 'pinia'

export const useLocationStore = defineStore({
	id: 'location-store',
	state: () => {
		return {
			location: "Istanbul",
		}
	},
	actions: {
		changeLocation(value: string) {
			this.location = value
		},
	},
	getters: {
		getLocation: state => state.location,
	},
})