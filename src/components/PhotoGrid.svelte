<script lang="ts">
	import type { Photo } from '../domain/Photo';
	import Thumbnail from './Thumbnail.svelte';

	export let albumId = '1';
	export let photos: Photo[] = [];
</script>

<h2>
	Photos from album <a href="/album/{albumId}">{albumId}</a>
</h2>

<p>{photos.length} photos in album. Click the thumbnail to view the details.</p>

{#each photos as photo (photo.id)}
	<Thumbnail {photo} />
{/each}

<style>
	h2,
	p {
		text-align: center;
		margin: 40px 0;
	}
</style>
