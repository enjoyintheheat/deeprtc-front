<script context="module">
	export async function load({ page: { params }, fetch }) {
		const id = params.id;

		return {
			props: {
				id
			}
		};
	}
</script>

<script lang="ts">
	import Alert from '$lib/Alert.svelte';
	import Audio, { handleFile } from '$lib/Audio.svelte';
	import Upload from '$lib/Upload.svelte';
	import EditorPanel from '$lib/EditorPanel.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import moment from 'moment';

	export let id;

	let audioSrc;
	let editorTrigger = false;

	let linkValue;

	moment.locale();

	onMount(() => {
		const baseUrl = import.meta.env.VITE_API_URL;
		const url = `${baseUrl}/files/poll-token/${id}`;
		const transcribeInput = document.getElementById('transcribe-link');

		const frontUrl = import.meta.env.VITE_BASE_URL;

		linkValue = `${frontUrl}/transcribe/${id}`;

		const mainEditor = document.getElementById('main-editor');

		fetch(url, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		}).then(async (resp) => {
			const data = await resp.json();
			mainEditor.textContent = data.text;
			audioSrc = `${baseUrl}/media/${data.file_name}`;
		});

		const statusLine = document.getElementById('status-line');
		// @ts-ignore
		const editor = new MediumEditor('.main-editor', {
			toolbar: false,
			placeholder: false
		});

		editor.subscribe('editableInput', function (event, editable) {
			statusLine.textContent = moment().format('HH:mm:ss');

			editorTrigger = !editorTrigger;
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
					id="transcribe-link"
					type="text"
					value={linkValue}
					class="form-control"
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
		<Audio src={audioSrc} />
	</div>
	<br />
	<div class="card">
		<div id="main-editor" class="card-body main-editor" />
	</div>
	<br />
	<EditorPanel {editorTrigger} token={id} />
</div>

<style>
	*:focus {
		outline: none;
	}
</style>
