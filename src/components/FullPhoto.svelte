<script lang="ts">
	import type { Photo } from '../domain/Photo';
	import Link from './Link.svelte';

	export let photo: Photo;
</script>

<section class="drac-text-center">
	<figure>
		<img class="drac-rounded-xl" src={photo.url.href} alt="Caption: {photo.title}" />
		<figcaption class="drac-text drac-text-pink drac-line-height-2xl">
			{photo.title}
		</figcaption>
	</figure>

	<footer class="drac-text drac-text-bold">
		<Link to="/album/{photo.albumId}">Back to album</Link>
	</footer>
</section>
