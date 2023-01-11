<script lang="ts">
	import PhotoGrid from '$components/PhotoGrid.svelte';
	import type { PageData } from './$types';
	import Warning from '$components/Warning.svelte';

	export let data: PageData;

	$: entries = Object.entries(data?.albums ?? {});
	$: isEmptyGallery = entries.length === 0;
</script>

<svelte:head>
	<title>Photo Browser | Home</title>
</svelte:head>

{#if isEmptyGallery}
	<Warning title="No photos in the gallery" message="Please, check back later." />
{/if}

{#each entries as [albumId, photos] (albumId)}
	<PhotoGrid albumId={Number(albumId)} bind:photos />
{/each}
