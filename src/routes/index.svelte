<script lang="ts">
	import Alert from '$lib/Alert.svelte';
	import Audio, { handleFile } from '$lib/Audio.svelte';
	import Upload from '$lib/Upload.svelte';
	import EditorPanel from '$lib/EditorPanel.svelte';
	import { onMount } from 'svelte';
	import moment from 'moment';
	import { goto } from '$app/navigation';

	moment.locale();

	onMount(() => {
		const statusLine = document.getElementById('status-line');
		// @ts-ignore
		const editor = new MediumEditor('.main-editor', {
			toolbar: false,
			placeholder: false
		});

		editor.subscribe('editableInput', function (event, editable) {
			statusLine.textContent = moment().format('HH:mm:ss');
		});
	});

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

				const audioTokenId = data._id;

				const loader = document.getElementById('main-loader');
				const spinner = document.getElementById('main-loader-spinner');

				loader.style.display = 'none';
				spinner.style.display = 'none';

				goto(`/transcribe/${audioTokenId}`);

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
	<div class="row">
		<div class="col-8">
			<div class="input-group">
				<div class="input-group-text" id="btnGroupAddon">
					<i class="bi bi-link-45deg" />
				</div>
				<input
					type="text"
					class="form-control"
					value=""
					placeholder="..."
					aria-label="Input group example"
					aria-describedby="btnGroupAddon"
					disabled
				/>
			</div>
		</div>
	</div>
	<br />
	<div class="row">
		<Audio src />
	</div>
	<br />
	<div class="card">
		<div class="card-body main-editor" />
	</div>
	<br />
	<EditorPanel editorTrigger token />
</div>

<style>
	*:focus {
		outline: none;
	}
</style>
