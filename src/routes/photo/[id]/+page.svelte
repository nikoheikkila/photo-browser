<script lang="ts">
  import type { PageData} from "./$types";
  export let data: PageData = {
    photo: null,
  }

  $: photo = data.photo;
</script>

{#if photo}
  <img src={photo.url} alt="Caption: {photo.title}" />
{/if}
