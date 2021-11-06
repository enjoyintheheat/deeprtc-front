<script lang="ts">
	import { removeHtmlTagsFromText } from '$lib/helpers/clean';
	import { saveText } from '$lib/helpers/save';
	import { onMount } from 'svelte';

	export let token;
	export let editorTrigger: boolean;

	let triggerTimer;

	let editor;

	onMount(() => {
		editor = document.getElementById('main-editor');
	});

	$: onEditorTrigger(editorTrigger);

	function onEditorTrigger(trigger: boolean) {
		clearTimeout(triggerTimer);

		triggerTimer = setTimeout(() => {
			saveTextFn();
		}, 2000);
	}

	function retreiveTextFromEditor(): string | undefined {
		if (!editor) {
			return undefined;
		}

		const text = removeHtmlTagsFromText(editor.textContent);

		if (text === '') {
			return undefined;
		}

		return text;
	}

	function saveTextFn() {
		const text = retreiveTextFromEditor();

		if (!text) {
			return;
		}

		const api = import.meta.env.VITE_API_URL as string;

		saveText(api, text, token);
	}

	function postprocessingAction() {
		const text = retreiveTextFromEditor();

		const editor = document.getElementById('main-editor');

		if (!text) {
			return;
		}

		const formData = new FormData();
		formData.append('text', text);

		fetch('http://34.210.60.197:8080/punct/', {
			method: 'POST',
			body: formData
		}).then(async (response) => {
			const data = await response.json();

			if (!data || !data.res) {
				return;
			}

			editor.textContent = data.res;

			saveTextFn();

			console.log(data);
		});
	}

	function receiveDocFile() {
		const api = import.meta.env.VITE_API_URL;
		const url = `${api}/files/word?token=${token}`;

		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('hidden', 'true');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
</script>

<div class="row">
	<div class="col-6 process-fn">
		<button on:click={receiveDocFile} type="button" class="btn btn-danger">Выгрузить файл</button>
		<button on:click={postprocessingAction} type="button" class="btn btn-danger"
			>Постобработка</button
		>
	</div>
	<div class="col-2 editor-status" />
	<div class="col-4 postaction-fn">
		<span class="badge bg-secondary">
			Изменялся: <span id="status-line">-</span>
		</span>
	</div>
</div>

<style>
	.editor-status {
		text-align: center;
	}

	.postaction-fn {
		text-align: right;
	}

	.process-fn > button {
		background-color: #cc2222;
	}
</style>
