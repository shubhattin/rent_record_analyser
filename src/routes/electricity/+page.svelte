<script lang="ts">
  import type { PageData } from '../$types';
  import HomePage from '../+page.svelte';

  export let data: PageData;
</script>

<HomePage {data} electricity_page={true} />
