<script lang="ts">
	import PhotoGrid from '../components/PhotoGrid.svelte';
	import type { AllPhotos } from '../adapters/inbound/Loaders';

	export let data: AllPhotos;

	$: entries = Object.entries(data?.albums ?? {});
</script>

{#each entries as [albumId, photos] (albumId)}
	<PhotoGrid albumId={Number(albumId)} bind:photos />
{/each}
