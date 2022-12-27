<script>
	import Author from './Author.svelte';

	let links = [{ label: 'Home', href: '/' }];
</script>

<header>
	<nav>
		{#each links as link (link.href)}
			<a href={link.href}>{link.label}</a>
		{/each}
	</nav>
	<Author />
</header>

<style>
	header {
		position: fixed;
		width: 100vw;
	}
</style>
