<script lang="ts">
	import Nav from '$lib/Nav.svelte';
</script>

<Nav />

<main>
	<div id="main-loader" />
	<div id="main-loader-spinner" class="spinner-border text-danger" role="status">
		<span class="visually-hidden">Loading...</span>
	</div>
	<slot />
</main>

<style>
	main {
		position: relative;
		max-width: 56em;
		background-color: white;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
	}

	#main-loader {
		display: none;
		position: absolute;
		z-index: 1000;
		opacity: 0.75;
		width: 100%;
		height: 100%;
		background-color: white;
	}

	#main-loader-spinner {
		display: none;
		position: fixed;
		z-index: 1001;
		margin: auto;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}
</style>
