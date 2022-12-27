<script lang="ts">
	import PhotoGrid from '../components/PhotoGrid.svelte';
	import type { GroupedPhotos } from '../adapters/inbound/Loaders';

	export let data: GroupedPhotos;

	$: entries = Object.entries(data.photos);
</script>

{#each entries as [albumId, photos] (albumId)}
	<PhotoGrid bind:albumId bind:photos />
{/each}
