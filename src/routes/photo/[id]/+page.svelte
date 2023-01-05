<script lang="ts">
	import FullPhoto from '$components/FullPhoto.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: photo = data.photo;
</script>

<svelte:head>
	<title>Photo Browser | Photo - {photo.title}</title>
</svelte:head>

<FullPhoto {photo} />
