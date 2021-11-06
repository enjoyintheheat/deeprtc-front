import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-node';
import dotenv from 'dotenv';

dotenv.config();

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: adapter({
			out: 'build',
			precompress: false,
			env: {
				VITE_API_URL: "http://localhost:8000",
				VITE_BASE_URL: "http://localhost:3000",
			}
		})
	}
};

export default config;
