// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'nuxt-icon',
		'@pinia/nuxt',
	],
	imports: {
		dirs: ['stores'],
	  },
})
