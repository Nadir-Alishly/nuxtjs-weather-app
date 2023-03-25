import { defineStore } from 'pinia'

export const useLoadingStore = defineStore({
	id: 'loading-store',
	state: () => {
		return {
			isLoading: true,
		}
	},
	actions: {
		changeLoadingStatus(value: boolean) {
			this.isLoading = value
		},
	},
	getters: {
		getLoadingStatus: state => state.isLoading,
	},
})