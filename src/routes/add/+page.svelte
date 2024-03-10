<script lang="ts">
  import AddRentData from './AddRentData.svelte';
  import type { PageData } from './$types';
  import AuthenticatePassword from '@components/AuthenticatePassword.svelte';
  import { writable } from 'svelte/store';

  export let data: PageData;

  $: users = data.users;

  let selected_user = writable(1); // 1st user(admin)
  let pass_unlocked = writable(false);
  let password = writable('');
</script>

<svelte:head>
  <title>Add Rent Record</title>
</svelte:head>
<AuthenticatePassword
  users_data={users}
  user_id={selected_user}
  is_verified={pass_unlocked}
  {password}
/>
{#if $pass_unlocked}
  <AddRentData password={$password} user_id={$selected_user} />
{/if}
