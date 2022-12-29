<script lang="ts">
	import type { Photo } from '../domain/Photo';
	import Thumbnail from './Thumbnail.svelte';
	import Link from './Link.svelte';

	export let albumId = '1';
	export let photos: Photo[] = [];
</script>

<section class="drac-box drac-w-auto drac-p-lg">
	<h2 class="drac-heading drac-heading-xl drac-text-white drac-text-center">
		Photos from album <Link to="/album/{albumId}">{albumId}</Link>
	</h2>

	<p class="drac-text drac-text-lg drac-text-white drac-text-center">
		{photos.length} photos in album. Click the thumbnails to view the details.
	</p>

	<div class="drac-d-grid">
		{#each photos as photo (photo.id)}
			<Thumbnail {photo} />
		{/each}
	</div>
</section>

<style>
	h2,
	p {
		margin: 40px 0;
	}

	div {
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		grid-gap: 20px;
	}
</style>
