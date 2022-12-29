<script>
	import Link from './Link.svelte';

	let links = [{ label: 'Photo Browser', href: '/' }];
</script>

<header class="drac-box drac-w-full drac-bg-black-secondary">
	<nav>
		{#each links as link (link.href)}
			<Link className="drac-text drac-text-bold" to={link.href}>{link.label}</Link>
		{/each}
	</nav>
</header>

<style>
	header {
		position: fixed;
		top: 0;
		padding: 20px;
	}
</style>
