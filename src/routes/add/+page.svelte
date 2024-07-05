<script lang="ts">
  import AddRentData from './AddRentData.svelte';
  import type { PageData } from './$types';
  import AuthenticatePassword from '@components/AuthenticatePassword.svelte';
  import { writable } from 'svelte/store';
  import MainAppBar from '@components/MainAppBar.svelte';

  export let data: PageData;

  $: users = data.users;

  let pass_unlocked = writable(false);
</script>

<svelte:head>
  <title>Add Rent Record</title>
</svelte:head>
<MainAppBar page_name={'add'}>
  <h4 slot="start" class="mb-2.5 text-xl font-bold">Add New Entry</h4>
</MainAppBar>
<div class="font-bold text-orange-600 dark:text-yellow-500">Authentication</div>
<AuthenticatePassword users_data={users} is_verified={pass_unlocked} />
{#if $pass_unlocked}
  <AddRentData />
{/if}
