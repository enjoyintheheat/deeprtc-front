<script lang="ts" context="module">
	export function handleFile(event) {
		let audio = document.getElementById('audio-file');
		audio.setAttribute('src', event.detail);
	}
</script>

<script>
	export let src;
</script>

<audio {src} id="audio-file" controls />
