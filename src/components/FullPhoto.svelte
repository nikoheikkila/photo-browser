<script lang="ts">
	import type { Photo } from '../domain/Photo';

	export let photo: Photo;
</script>

<figure>
	<img src={photo.url.href} alt="Caption: {photo.title}" />
	<figcaption>{photo.title}</figcaption>
</figure>

<footer>
	<a href="/album/{photo.albumId}">Back to album</a>
</footer>

<style>
	footer {
		padding-top: 25px;
	}

	footer > a {
		font-weight: 700;
		text-decoration: none;
	}
</style>
