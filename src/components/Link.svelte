<script lang="ts">
	import { base } from '$app/paths';
	export let to: string;
	export let className = '';
	export let rel = '';
</script>

<a {rel} class={className} href={base + to} data-sveltekit-preload-data="tap">
	<slot />
</a>
