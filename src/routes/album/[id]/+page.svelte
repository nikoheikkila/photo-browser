<script lang="ts">
	import PhotoGrid from '../../../components/PhotoGrid.svelte';
	import Loading from '../../../components/Loading.svelte';
	import type { PhotoCollectionResponse } from '../../../adapters/inbound/Loaders';

	export let data: PhotoCollectionResponse = {
		photos: []
	};

	$: photos = data.photos || [];
	$: isLoading = photos.length === 0;
</script>

{#if isLoading}
	<Loading message="Loading photos. Please wait..." />
{/if}

<PhotoGrid bind:photos />
