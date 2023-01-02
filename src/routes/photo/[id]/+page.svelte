<script lang="ts">
	import type { PageData } from './$types';
	import FullPhoto from '../../../components/FullPhoto.svelte';

	export let data: PageData;

	$: photo = data.photo;
</script>

<svelte:head>
	<title>Photo Browser | Photo - {photo.title}</title>
</svelte:head>

<FullPhoto {photo} />
