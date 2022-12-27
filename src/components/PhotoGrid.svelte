<script lang="ts">
	import type { Photo } from '../domain/Photo';

	export let albumId: number;
	export let photos: Photo[];
</script>

<p>Showing the latest {photos.length} photos from our collection.</p>

<section class="grid photo-list">
	<h2>
		Photos from album <a href="/album/{albumId}">{albumId}</a>
	</h2>
	{#each photos as photo (photo.id)}
		<a href="/photo/{photo.id}" data-sveltekit-preload-data="tap">
			<img src={photo.thumbnailUrl.href} alt="Caption: {photo.title}" loading="lazy" />
		</a>
	{/each}
</section>
