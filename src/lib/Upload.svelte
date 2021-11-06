<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let form: HTMLElement;

	function onDragEnter(event: Event) {
		event.preventDefault();
		event.stopPropagation();

		if (form.classList.contains('is-dragover')) {
			return;
		}

		form.classList.add('is-dragover');
	}

	function onDragLeave(event: Event) {
		event.preventDefault();
		event.stopPropagation();

		if (!form.classList.contains('is-dragover')) {
			return;
		}

		form.classList.remove('is-dragover');
	}

	function onFileInput() {
		const fileObj = this.files[0];

		onFileUpload(fileObj);
	}

	function onFileChange(event) {
		const fileObj = event.dataTransfer.files[0];

		onFileUpload(fileObj);
	}

	function onFileUpload(fileObj) {
		const loader = document.getElementById('main-loader');
		const spinner = document.getElementById('main-loader-spinner');

		loader.style.display = 'block';
		spinner.style.display = 'block';

		const file = URL.createObjectURL(fileObj);

		const formData = new FormData();

		formData.append('audio_file', fileObj);

		const api = import.meta.env.VITE_API_URL;

		fetch(`${api}/files/`, {
			method: 'POST',
			body: formData
		}).then(async (response) => {
			const data = await response.json();

			if (!data || !data.id) {
				return;
			}

			dispatch('file', file);
			dispatch('pollToken', data.id);
		});

		return false;
	}
</script>

<form
	bind:this={form}
	on:dragenter={onDragEnter}
	on:dragover={onDragEnter}
	on:dragleave={onDragLeave}
	on:dragend={onDragLeave}
	on:drop={onFileChange}
	class="box has-advanced-upload"
	method="post"
	action=""
	enctype="multipart/form-data"
>
	<div class="box__input">
		<svg
			class="box__icon"
			xmlns="http://www.w3.org/2000/svg"
			width="50"
			height="43"
			viewBox="0 0 50 43"
			><path
				d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"
			/></svg
		>
		<input on:change={onFileInput} class="box__file" type="file" name="file" id="file" />
		<label for="file"
			><strong>Выберите файл</strong><br /><span class="box__dragndrop">
				или перенесите сюда</span
			>.</label
		>
	</div>
	<div class="box__uploading">Загрузка…</div>
	<div class="box__success">Успешно!</div>
	<div class="box__error">Ошибка! <span />.</div>
</form>

<style>
	.box__dragndrop,
	.box__uploading,
	.box__success,
	.box__error {
		display: none;
	}

	.box {
		font-size: 16px;
		background-color: #c8dadf;
		position: relative;
		padding: 25px;
		max-height: 183.5px;
	}

	.box.has-advanced-upload {
		outline: 2px dashed #92b0b3;
		outline-offset: -10px;
		-webkit-transition: outline-offset 0.15s ease-in-out, background-color 0.15s linear;
		transition: outline-offset 0.15s ease-in-out, background-color 0.15s linear;
	}

	.box.has-advanced-upload .box__icon {
		width: 100%;
		height: 60px;
		fill: #92b0b3;
		display: block;
		margin-bottom: 20px;
	}

	.box.has-advanced-upload .box__dragndrop {
		display: inline;
	}

	.box__file + label {
		width: 100%;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
		display: inline-block;
		overflow: hidden;
		text-align: center;
	}

	.box__file {
		display: none;
	}

	:global(.is-dragover) {
		outline-offset: -20px !important;
		outline-color: #c8dadf !important;
		background-color: #fff !important;
	}
</style>
