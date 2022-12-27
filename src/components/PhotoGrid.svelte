<script lang="ts">
	import type { Photo } from '../domain/Photo';

	export let photos: Photo[];
</script>

<p>Showing the latest {photos.length} photos from our collection.</p>

<section class="grid photo-list">
	{#each photos as photo (photo.id)}
		<a href="/photo/{photo.id}" data-sveltekit-preload-data="tap">
			<img src={photo.thumbnailUrl.href} alt="Caption: {photo.title}" loading="lazy" />
		</a>
	{/each}
</section>
