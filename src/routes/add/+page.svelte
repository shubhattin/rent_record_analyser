<script lang="ts">
  import AddRentData from './AddRentData.svelte';
  import AuthenticatePassword from '~/components/AuthenticatePassword.svelte';
  import { user_info } from '~/state/user.svelte';
  import UserControls from '~/components/UserControls.svelte';
</script>

<svelte:head>
  <title>Add Rent Record</title>
</svelte:head>

{#if !$user_info}
  <AuthenticatePassword />
{:else}
  <div class="flex items-end justify-end">
    <UserControls />
  </div>
  <AddRentData />
{/if}
