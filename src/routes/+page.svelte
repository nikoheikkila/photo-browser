<script lang="ts">
	import PhotoGrid from '../components/PhotoGrid.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: entries = Object.entries(data?.albums ?? {});
</script>

<svelte:head>
	<title>Photo Browser | Home</title>
</svelte:head>

{#each entries as [albumId, photos] (albumId)}
	<PhotoGrid albumId={Number(albumId)} bind:photos />
{/each}
