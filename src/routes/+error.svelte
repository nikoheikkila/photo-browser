<script lang="ts">
	import { page } from '$app/stores';
	import Error from '../components/Error.svelte';
</script>

{#if $page.error}
	<Error bind:message={$page.error.message} />
{/if}
