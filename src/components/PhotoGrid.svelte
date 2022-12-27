<script lang="ts">
	import type { Photo } from '../domain/Photo';
	import Thumbnail from './Thumbnail.svelte';

	export let albumId = '1';
	export let photos: Photo[] = [];
</script>

<section class="drac-box drac-w-8xl drac-p-md centered">
	<h2 class="drac-heading drac-heading-xl drac-text-white drac-text-center">
		Photos from album <a href="/album/{albumId}">{albumId}</a>
	</h2>

	<p class="drac-text drac-text-lg drac-text-white drac-text-center">
		{photos.length} photos in album. Click the thumbnails to view the details.
	</p>

	{#each photos as photo (photo.id)}
		<Thumbnail {photo} />
	{/each}
</section>

<style>
	h2,
	p {
		margin: 40px 0;
	}

	.centered {
		margin: 0 auto;
	}
</style>
