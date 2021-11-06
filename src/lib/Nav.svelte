<script lang="ts">
	import logoSvg from '../../static/small-logo.svg';
	import { goto } from '$app/navigation';

	function audioProcessing() {
		goto('/');
	}

	function subtitleProcessing() {
		goto('/subtitles');
	}
</script>

<div class="container-fluid header-container">
	<div class="row align-items-center" style="height: 100%">
		<div class="col">
			<img class="logo-svg" src={logoSvg} alt="Logo mos.ru" />
			<span class="logo-text">mos.ru</span>
			<span class="logo-description">Официальный сайт Мэра Москвы</span>
		</div>
		<div class="col" />
		<div class="col header-links">
			<span id="transcribe-link" on:click={audioProcessing}>Транскрибация</span>
			<span id="subtitle-link" on:click={subtitleProcessing}>Субтитры</span>
		</div>
	</div>
</div>

<style>
	.header-container {
		padding: 0px 32px;
		background-color: #cc2222;
		color: white;
		height: 40px;
		font-size: 18px;
	}

	.logo-svg {
		padding-bottom: 5px;
		padding-right: 5px;
	}

	.logo-text {
		font-weight: 500;
	}

	.logo-description {
		font-size: 16px;
	}

	.header-links {
		text-align: right;
		font-size: 14px;
	}

	#transcribe-link:hover,
	#subtitle-link:hover {
		cursor: pointer;
		font-weight: bolder;
	}
</style>
