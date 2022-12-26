<script lang="ts">
	import type { PageData } from './$types';
	import PhotoGrid from '../components/PhotoGrid.svelte';
	import Loading from '../components/Loading.svelte';

	export let data: PageData = {
		photos: []
	};

	$: photos = data.photos || [];
	$: isLoading = photos.length === 0;
</script>

{#if isLoading}
	<Loading message="Loading photos. Please wait..." />
{/if}

<PhotoGrid bind:photos />
