<script lang="ts">
  import Edit from './Edit.svelte';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { slide } from 'svelte/transition';
  import { FiEdit3 } from 'svelte-icons-pack/fi';
  import Icon from '~/tools/Icon.svelte';
  import { user_info } from '~/state/user.svelte';
  import { createMutation } from '@tanstack/svelte-query';
  import { client } from '~/api/client';

  let { data: ssr_data }: { data: PageData } = $props();

  let data = $state(ssr_data.rent_data);
  let last_id = $state(ssr_data.lastId);
  let last_date = $state(ssr_data.lastDate);
  $effect(() => {
    data = ssr_data.rent_data;
    last_id = ssr_data.lastId;
    last_date = ssr_data.lastDate;
  });

  let editable = $state(false);

  onMount(() => {
    window.addEventListener('beforeunload', function (e) {
      if ((import.meta as any).env.PROD && editable && typeof window !== 'undefined') {
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        e.returnValue = ''; // Chrome requires returnValue to be set
      }
    });
  });

  let fetch_index = 0;
  const FETCH_LIMIT = 20;
  const load_more_data_mut = createMutation({
    mutationFn: async () => {
      const next_data = await client.rent_data.get_paginated_rent_data.query({
        lastDate: last_date,
        lastID: last_id,
        limit: FETCH_LIMIT + fetch_index++ * 4
      });
      return next_data;
    },
    onSuccess(next_data) {
      data = data.concat(next_data.data);
      last_date = next_data.lastDate;
      last_id = next_data.lastID;
    }
  });
</script>

<svelte:head>
  <title>Rent Record Editor</title>
</svelte:head>

<div class="my-8">
  <Edit all_data={data} bind:editable />
  {#if !editable}
    <div class="mt-4 flex items-center justify-center">
      {#if last_date !== null && last_id !== null}
        <button
          class="btn preset-filled-primary-500 px-1.5 py-0.5 text-sm font-semibold"
          disabled={$load_more_data_mut.isPending}
          onclick={async () => {
            await $load_more_data_mut.mutateAsync();
          }}>Load More</button
        >
      {/if}
    </div>
    <div class="mt-6 space-x-1 text-center text-xs text-gray-400 select-none">
      <span>Total Records Fetched:</span>
      <span class="font-semibold">{data.length}</span>
    </div>
  {/if}
</div>
{#if !editable && $user_info && $user_info.role === 'admin'}
  <button
    transition:slide
    class="fixed right-2 bottom-2 cursor-default text-3xl"
    onclick={() => (editable = true)}
  >
    <Icon src={FiEdit3} class="hover:text-blue-500 active:text-red-500" />
  </button>
{/if}
