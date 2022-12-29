<script lang="ts">
	export let message: string;

	let detailsOpen = false;

	const toggleDetails = () => {
		detailsOpen = !detailsOpen;
	};
</script>

<section
	role="alert"
	class="drac-card-subtle drac-border-red drac-w-3xl centered drac-text drac-text-white drac-p-md"
>
	<h2 class="drac-text-bold">There was an error loading the page</h2>

	<input
		type="checkbox"
		name="details"
		id="details"
		class="drac-checkbox drac-checkbox-purple"
		checked={detailsOpen}
		on:change={toggleDetails}
	/>
	<label for="details" class="drac-text drac-text-white">
		{#if detailsOpen}
			Hide details
		{:else}
			Show details
		{/if}
	</label>

	{#if detailsOpen}
		<p>
			<code>{message}</code>
		</p>
	{/if}
</section>
