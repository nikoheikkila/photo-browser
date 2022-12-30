<script lang="ts">
	export let message: string;
</script>

<section
	role="alert"
	class="drac-card-subtle drac-border-red drac-w-3xl centered drac-text drac-text-white drac-p-md"
>
	<h2 class="drac-text-bold">There was an error loading the page</h2>
	<p>{message}</p>
</section>
