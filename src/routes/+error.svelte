<script lang="ts">
  import { page } from '$app/stores';
  import Error from "../components/Error.svelte";
</script>

<Error bind:message={$page.error.message} />
