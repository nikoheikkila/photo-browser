<script>
	let links = [{ label: 'Photo Browser', href: '/' }];
</script>

<header class="drac-bg-black-secondary">
	<nav>
		{#each links as link (link.href)}
			<a class="drac-text drac-text-bold" href={link.href}>{link.label}</a>
		{/each}
	</nav>
</header>

<style>
	header {
		position: fixed;
		top: 0;
		width: 100%;
		padding: 20px;
	}
</style>
