<script lang="ts">
  import AddRentData from './AddRentData.svelte';
  import type { PageData } from './$types';
  import AuthenticatePassword from '~/components/AuthenticatePassword.svelte';

  let { data }: { data: PageData } = $props();

  const users = $derived(data.users);

  let pass_unlocked = $state(false);
</script>

<svelte:head>
  <title>Add Rent Record</title>
</svelte:head>
<AuthenticatePassword users_data={users} bind:is_verified={pass_unlocked} />
{#if pass_unlocked}
  <AddRentData />
{/if}
