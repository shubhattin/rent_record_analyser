<script lang="ts">
  import type { PageData } from '../$types';
  import HomePage from '../+page.svelte';

  let { data }: { data: PageData } = $props();
</script>

<HomePage {data} page_name="electricity" />
