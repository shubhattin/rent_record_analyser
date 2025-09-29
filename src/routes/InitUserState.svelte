<script lang="ts">
  import { user_info } from '~/state/user.svelte';
  import { useQuery } from 'convex-svelte';
  import { page } from '$app/state';
  import { api } from '~/convex/_generated/api';

  const currentUserResponse = useQuery(api.auth.getCurrentUser, {});

  $user_info = null;
  if (page.data.user_info) $user_info = page.data.currentUser;
  $effect(() => {
    $user_info = !currentUserResponse.isLoading ? currentUserResponse.data : page.data.user_info;
  });
</script>
