<script lang="ts">
  export let data: Error;
</script>

<section>
  <p>There was an error loading the photos</p>
  <p>{data.message}</p>
</section>
