<script lang="ts">
	export let title: string;
	export let message: string;
</script>

<section
	role="alert"
	class="drac-card-subtle drac-border-yellow drac-w-3xl centered drac-text drac-text-white drac-p-md"
>
	<h2 class="drac-text-bold">{title}</h2>
	<p>{message}</p>
</section>
