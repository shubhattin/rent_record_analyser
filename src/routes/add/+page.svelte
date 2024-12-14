<script lang="ts">
  import AddRentData from './AddRentData.svelte';
  import type { PageData } from './$types';
  import AuthenticatePassword from '~/components/AuthenticatePassword.svelte';
  import MainAppBar from '~/components/TopAppBar.svelte';

  let { data }: { data: PageData } = $props();

  const users = $derived(data.users);

  let pass_unlocked = $state(false);
</script>

<svelte:head>
  <title>Add Rent Record</title>
</svelte:head>
<MainAppBar page_name="add">
  {#snippet start()}
    <h4 class="text-xl font-bold text-indigo-800 dark:text-blue-300">Add New Entry</h4>
  {/snippet}
</MainAppBar>
<AuthenticatePassword users_data={users} bind:is_verified={pass_unlocked} />
{#if pass_unlocked}
  <AddRentData />
{/if}
