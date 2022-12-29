<script lang="ts">
	import type { Photo } from '../domain/Photo';
	import Link from './Link.svelte';
	import { parseFullSize } from '../domain/Photo';

	export let photo: Photo;

	const size = parseFullSize(photo);
</script>

<section class="drac-text-center">
	<section class="drac-text drac-text-lg drac-text-bold">
		<Link to="/album/{photo.albumId}">Back to album</Link>
	</section>
	<figure class="drac-box centered">
		<img src={photo.url.href} alt="Caption: {photo.title}" loading="lazy" {...size} />
		<figcaption class="drac-text drac-text-pink drac-line-height-2xl">
			{photo.title}
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
</style>
