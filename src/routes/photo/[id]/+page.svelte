<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	$: photo = data.photo;
</script>

{#if photo}
	<img src={photo.url.href} alt="Caption: {photo.title}" />

	<a href="/album/{photo.albumId}">Back to album</a>
{/if}
