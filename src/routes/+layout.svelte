<script lang="ts">
	import Navigation from '../components/Navigation.svelte';

	let title = 'Fantastic Photos and Where to Find Them';
</script>

<Navigation />
<main>
	<h1>{title}</h1>
	<slot />
</main>

<style>
	:global(body) {
		font-family: 'Sentient', serif;
	}

	:global(h1, h2, h3) {
		font-family: 'Kalam', cursive;
		text-align: center;
	}

	h1 {
		font-size: 3.5rem;
		margin: 60px 0;
	}
</style>
