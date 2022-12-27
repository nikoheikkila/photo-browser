<script lang="ts">
	import type { PageData } from './$types';
	import FullPhoto from '../../../components/FullPhoto.svelte';

	export let data: PageData;

	$: photo = data.photo;
</script>

<FullPhoto {photo} />
