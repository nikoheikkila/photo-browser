<script lang="ts">
	import type { Photo } from '$lib/domain/Photo';
	import Link from './Link.svelte';
	import { PhotoCalculator } from '$lib/services/PhotoCalculator';

	export let photo: Photo;

	const { width, height } = new PhotoCalculator(photo).parseFullSize();
</script>

<section class="drac-text-center">
	<section class="drac-text drac-text-lg drac-text-bold">
		<Link to="/album/{photo.albumId}">Back to album</Link>
	</section>
	<figure class="drac-box centered">
		<img src={photo.url.href} alt="Caption: {photo.title}" {width} {height} />
		<figcaption role="caption" class="drac-text drac-text-pink drac-line-height-2xl">
			<span>{photo.title}</span>
			<span>{width} by {height} pixels</span>
		</figcaption>
	</figure>
</section>

<style>
	figure {
		margin-top: 50px;
	}

	img {
		border: 10px solid var(--white);
	}

	figcaption span {
		display: block;
	}
</style>
