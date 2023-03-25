// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'nuxt-icon',
		'@pinia/nuxt',
	],
	app: {
		head: {
			title: "Weather App",
			link: [
				{ rel: 'icon', type: 'image/x-icon', href: '/_nuxt/assets/favicon.png' }    
			]
		}
	},
	imports: {
		dirs: ['stores'],
	  },
})
