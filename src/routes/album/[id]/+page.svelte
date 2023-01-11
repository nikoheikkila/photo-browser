<script lang="ts">
	import PhotoGrid from '$components/PhotoGrid.svelte';
	import Warning from '$components/Warning.svelte';
	import Link from '$components/Link.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: photos = data.photos;
	$: isEmptyAlbum = photos.length === 0;
	$: albumId = data.albumId;
	$: onFirstAlbum = albumId === 1;
</script>

<svelte:head>
	<title>Photo Browser | Photos for album {albumId}</title>
</svelte:head>

{#if isEmptyAlbum}
	<Warning
		title="You stumbled upon an empty album"
		message="Don't worry there will be photos here in the future."
	/>
{:else}
	<PhotoGrid bind:albumId bind:photos />
	<section>
		{#if !onFirstAlbum}
			<Link
				className="drac-btn drac-bg-purple-transparent drac-btn-ghost drac-text-purple drac-m-sm"
				to="/album/{albumId - 1}"
				rel="prev"
			>
				Previous album
			</Link>
		{/if}
		<Link
			className="drac-btn drac-bg-purple-transparent drac-btn-ghost drac-text-purple drac-m-sm"
			to="/album/{albumId + 1}"
			rel="next"
		>
			Next album
		</Link>
	</section>
{/if}

<style>
	section {
		margin-bottom: 120px;
		display: flex;
		justify-content: center;
	}
</style>
