<script lang="ts">
	import Alert from '$lib/Alert.svelte';
	import Audio, { handleFile } from '$lib/Audio.svelte';
	import Upload from '$lib/Upload.svelte';
	import ROEditorPanel from '$lib/ROEditorPanel.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		const statusLine = document.getElementById('status-line');
	});

	let table = '';

	function postprocessingAction(timeSteps) {
		const formData = new FormData();
		formData.append('time_steps', JSON.stringify(timeSteps));

		fetch('http://34.210.60.197:8080/subtitles/', {
			method: 'POST',
			body: new URLSearchParams({
				time_steps: JSON.stringify(timeSteps)
			}),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(async (response) => {
			const data = await response.json();

			if (!data || !data.html) {
				return;
			}

			const loader = document.getElementById('main-loader');
			const spinner = document.getElementById('main-loader-spinner');

			const subtitlesTable = document.getElementById('subtitles-table');

			table = data.html;

			loader.style.display = 'none';
			spinner.style.display = 'none';

			console.log(data);
		});
	}

	function pollToken(event) {
		const token = event.detail;

		const timer = setInterval(() => {
			const api = import.meta.env.VITE_API_URL;

			fetch(`${api}/files/poll-token/${token}`, {
				method: 'GET',
				headers: {
					Accept: 'application/json'
				}
			}).then(async (response) => {
				const data = await response.json();

				if (!data || !data.transcribed) {
					return;
				}

				postprocessingAction(data.time_steps);

				clearInterval(timer);
			});
		}, 5000);
	}
</script>

<svelte:head>
	<title>DeepRTC</title>
</svelte:head>

<div class="container">
	<div class="row">
		<div class="col-6">
			<Alert />
		</div>
		<div class="col-6">
			<Upload on:file={handleFile} on:pollToken={pollToken} />
		</div>
	</div>
	<br />
	<div class="row">
		<Audio src />
	</div>
	<br />
	<div id="subtitles-table" class="row">{@html table}</div>
	<br />
</div>

<style>
	*:focus {
		outline: none;
	}
</style>
