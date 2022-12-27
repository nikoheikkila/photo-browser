<script lang="ts">
	import PhotoGrid from '../../../components/PhotoGrid.svelte';
	import type { AllPhotos } from '../../../adapters/inbound/Loaders';

	export let data: AllPhotos;

	$: photos = data.photos || [];
	$: albumId = String(photos[0]?.albumId);
</script>

<PhotoGrid bind:albumId bind:photos />
