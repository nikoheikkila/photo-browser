<script lang="ts">
	import type { Photo } from '../domain/Photo';
	import Link from './Link.svelte';
	import { parseThumbnailSize } from '../domain/Photo';

	export let photo: Photo;

	const size = parseThumbnailSize(photo);
</script>

<section class="drac-box drac-d-inline">
	<Link to="/photo/{photo.id}">
		<img
			class="drac-rounded-2xl drac-p-xxs"
			id="photo-{photo.id}"
			src={photo.thumbnailUrl.href}
			alt="Caption: {photo.title}"
			loading="lazy"
			{...size}
		/>
	</Link>
</section>
