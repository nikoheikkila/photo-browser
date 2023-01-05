<script lang="ts">
	import type { Photo } from '$lib/domain/Photo';
	import Link from './Link.svelte';
	import { PhotoCalculator } from '$lib/services/PhotoCalculator';

	export let photo: Photo;

	const size = new PhotoCalculator(photo).parseThumbnailSize();
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
