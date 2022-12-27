<script lang="ts">
	import type { Photo } from '../domain/Photo';
	import Thumbnail from './Thumbnail.svelte';

	export let albumId = '1';
	export let photos: Photo[] = [];
</script>

<p>Showing the latest {photos.length} photos from our collection.</p>

<section class="photo-list">
	<h2>
		Photos from album <a href="/album/{albumId}">{albumId}</a>
	</h2>

	{#each photos as photo (photo.id)}
		<Thumbnail {photo} />
	{/each}
</section>
