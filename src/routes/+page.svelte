<script>
    import { photoStore } from "../stores/photos";
    import { onMount } from "svelte";

    let limit = 50;

    const loadPhotos = () => photoStore.load(limit);

    onMount(loadPhotos);
    $: photos = $photoStore.data;
    $: isLoading = $photoStore.loading || photos.length === 0;
    $: error = $photoStore.error ? $photoStore.error.message : '';
</script>

<h1>Photo Browser</h1>

{#if isLoading}
  <p>Loading your photos. Please wait...</p>
{/if}

{#if error}
  <p>There was an error loading the photos</p>
  <small>{error}</small>
{/if}

{#if !isLoading}
  <main class="photo-list">
    <p>This is an example collection of photos from our backend.</p>
    <section class="grid">

      {#each photos as photo (photo.id)}
        <a href={photo.url} target="_blank" rel="noopener noreferrer">
          <img src={photo.thumbnailUrl} alt="Caption: {photo.title}">
        </a>
      {/each}

    </section>
  </main>
{/if}
