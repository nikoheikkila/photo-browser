<script>
    import { photoStore } from "../stores/photos";
    import { onMount } from "svelte";
    import Loading from "../components/Loading.svelte";
    import Error from "../components/Error.svelte";
    import PhotoGrid from "../components/PhotoGrid.svelte";

    let limit = 50;

    const loadPhotos = () => photoStore.load(limit);

    onMount(loadPhotos);
    $: photos = $photoStore.data;
    $: isLoading = $photoStore.loading || photos.length === 0;
    $: error = $photoStore.error;
</script>

{#if isLoading}
  <Loading message="Loading your photos. Please wait..." />
{/if}

{#if error}
  <Error bind:data={error} />
{/if}

{#if !isLoading}
  <PhotoGrid bind:photos />
{/if}
