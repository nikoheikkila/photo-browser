<script lang="ts">
	import type { Photo } from '../domain/Photo';

	export let photo: Photo;
</script>

<a href="/photo/{photo.id}" data-sveltekit-preload-data="tap">
	<img
		id="photo-{photo.id}"
		src={photo.thumbnailUrl.href}
		alt="Caption: {photo.title}"
		loading="lazy"
	/>
</a>
