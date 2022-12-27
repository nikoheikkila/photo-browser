<script lang="ts">
	import 'dracula-ui/styles/dracula-ui.css';
	import Navigation from '../components/Navigation.svelte';
	import Title from '../components/Title.svelte';
	import Footer from '../components/Footer.svelte';
</script>

<main>
	<Navigation />
	<Title />
	<slot />
	<Footer />
</main>

<style>
	:global(body) {
		min-height: 100vh;
	}

	:global(a) {
		color: cyan;
		text-decoration: none;
	}

	:global(a:hover, a:visited, a:active) {
		color: cyan;
		text-decoration: cyan wavy underline;
		text-decoration-skip-ink: none;
	}

	:global(.centered) {
		margin: 0 auto;
	}
</style>
