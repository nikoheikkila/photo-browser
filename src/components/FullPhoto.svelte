<script lang="ts">
	import type { Photo } from '../domain/Photo';

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
		<a href="/album/{photo.albumId}">Back to album</a>
	</footer>
</section>
