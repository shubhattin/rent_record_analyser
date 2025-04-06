<script lang="ts">
  import Edit from './Edit.svelte';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { slide } from 'svelte/transition';
  import { FiEdit3 } from 'svelte-icons-pack/fi';
  import Icon from '~/tools/Icon.svelte';
  import { user_info } from '~/state/user.svelte';

  let { data }: { data: PageData } = $props();

  let editable = $state(false);

  onMount(() => {
    window.addEventListener('beforeunload', function (e) {
      if ((import.meta as any).env.PROD && editable && typeof window !== 'undefined') {
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        e.returnValue = ''; // Chrome requires returnValue to be set
      }
    });
  });
</script>

<svelte:head>
  <title>Rent Record Editor</title>
</svelte:head>

<div class="my-8">
  <Edit all_data={data} bind:editable />
</div>
{#if !editable && $user_info && $user_info.user_type === 'admin'}
  <button
    transition:slide
    class="fixed right-2 bottom-2 cursor-default text-3xl"
    onclick={() => (editable = true)}
  >
    <Icon src={FiEdit3} class="hover:text-blue-500 active:text-red-500" />
  </button>
{/if}
