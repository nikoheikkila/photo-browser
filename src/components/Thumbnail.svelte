<script lang="ts">
	import type { Photo } from '../domain/Photo';
	import Link from './Link.svelte';

	export let photo: Photo;
</script>

<section class="drac-box drac-d-inline">
	<Link to="/photo/{photo.id}">
		<img
			class="drac-rounded-2xl drac-p-xxs"
			id="photo-{photo.id}"
			src={photo.thumbnailUrl.href}
			alt="Caption: {photo.title}"
			loading="lazy"
		/>
	</Link>
</section>
