<script lang="ts">
  import AddRentData from './AddRentData.svelte';
  import type { PageData } from './$types';
  import AuthenticatePassword from '~/components/AuthenticatePassword.svelte';
  import { user_info } from '~/state/user.svelte';
  import UserControls from '~/components/UserControls.svelte';

  let { data }: { data: PageData } = $props();

  const users = $derived(data.users);
</script>

<svelte:head>
  <title>Add Rent Record</title>
</svelte:head>

{#if !$user_info}
  <AuthenticatePassword users_data={users} />
{:else}
  <div class="flex items-end justify-end">
    <UserControls />
  </div>
  <AddRentData />
{/if}
