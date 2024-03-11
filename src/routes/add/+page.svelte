<script lang="ts">
  import AddRentData from './AddRentData.svelte';
  import type { PageData } from './$types';
  import AuthenticatePassword from '@components/AuthenticatePassword.svelte';
  import { writable } from 'svelte/store';

  export let data: PageData;

  $: users = data.users;

  let pass_unlocked = writable(false);
  let jwt_token = writable('');
</script>

<svelte:head>
  <title>Add Rent Record</title>
</svelte:head>
<AuthenticatePassword users_data={users} {jwt_token} is_verified={pass_unlocked} />
{#if $pass_unlocked}
  <AddRentData jwt_token={$jwt_token} />
{/if}
