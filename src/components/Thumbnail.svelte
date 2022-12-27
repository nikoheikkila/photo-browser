<script lang="ts">
	import type { Photo } from '../domain/Photo';

	export let photo: Photo;
</script>

<div class="drac-box drac-d-inline">
	<a href="/photo/{photo.id}" data-sveltekit-preload-data="tap">
		<img
			class="drac-rounded-2xl drac-p-xxs"
			id="photo-{photo.id}"
			src={photo.thumbnailUrl.href}
			alt="Caption: {photo.title}"
			loading="lazy"
		/>
	</a>
</div>
