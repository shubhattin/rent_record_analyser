<script lang="ts">
  import type { PageData } from './$types';
  import { Accordion } from '@skeletonlabs/skeleton-svelte';
  import { preloadData } from '$app/navigation';
  import { MONTH_NAMES, MONTH_NAMES_SHORT, NUMBER_SUFFIX } from '~/tools/date';
  import { onMount } from 'svelte';
  import { cl_join } from '~/tools/cl_join';
  import { TiFlashOutline } from 'svelte-icons-pack/ti';
  import Icon from '~/tools/Icon.svelte';
  import { AiOutlineHome } from 'svelte-icons-pack/ai';
  import { user_info } from '~/state/user.svelte';
  import { get_date_list } from '~/api/routers/rent_filters';
  import { createMutation } from '@tanstack/svelte-query';
  import { client } from '~/api/client';

  let { data: ssr_data }: { data: PageData } = $props();

  let data = $state(ssr_data.data);
  let last_date = $state(ssr_data.lastDate);
  let last_id = $state(ssr_data.lastId);
  $effect(() => {
    data = ssr_data.data;
    last_date = ssr_data.lastDate;
    last_id = ssr_data.lastId;
  });

  let rent_data = $derived(data.rent_data);
  let info_analysis = $derived(data.info_analysis);
  let total = $derived(data.total);

  onMount(() => {
    if (import.meta.env.PROD)
      setTimeout(() => {
        preloadData('/add');
      }, 2000);
  });

  let selected_accordian = $state(['0-0']);

  const load_more_data_mut = createMutation({
    mutationFn: async () => {
      const next_data = await client.rent_data.get_paginated_rent_data_anlysis.query({
        lastDate: last_date,
        lastID: last_id
      });
      return next_data;
    },
    onSuccess(next_data) {
      data = next_data.data;
      last_date = next_data.lastDate;
      last_id = next_data.lastId;
    }
  });
</script>

<svelte:head>
  <title>Rent Record Analyser</title>
  <meta name="description" content="A Simple House Rent Record Analyser" />
</svelte:head>

{#snippet rent_table_list(yr: number, mn: number, type: 'rent' | 'electricity')}
  {#if $user_info}
    {@const date_records = get_date_list(rent_data, yr, mn)}
    <table>
      <tbody>
        {#each date_records as dte, i_dt (i_dt)}
          {@const dt = dte[0].date}
          {#if !date_records[i_dt].every((dt) => dt.rent_type !== type)}
            {@const date = dt.getUTCDate()}
            {@const rent_records_filtered = date_records[i_dt].filter((d) => d.rent_type === type)}
            <tr>
              <td class="px-1 py-0.5 text-start text-sm">
                {date}<sup>{date % 10 === 0 ? 'th' : NUMBER_SUFFIX[(date % 10) - 1]}</sup>
              </td>
              <td class="px-1 py-0.5 text-start text-sm">
                {MONTH_NAMES_SHORT[dt.getUTCMonth() + 1 - 1]}
              </td>
              <td class="space-x-1 px-1 py-0.5 text-start text-sm">
                {#each rent_records_filtered as record, i}
                  <span class:underline={record.is_not_verified}
                    >₹ {record.amount}{#if i !== rent_records_filtered.length - 1},{/if}</span
                  >
                {/each}
              </td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  {/if}
{/snippet}

<div>
  <!-- Yearly -->
  {#each info_analysis.keys() as yr, i_yr (yr)}
    <h5 class="h5 my-3 font-bold">
      Year {yr}, Total <sup>₹</sup>{info_analysis.get(yr)?.amount}
    </h5>
    <Accordion
      collapsible
      multiple
      value={selected_accordian}
      onValueChange={(e) => (selected_accordian = e.value)}
    >
      <!-- Monthly -->
      {#each info_analysis.get(yr)!.months.keys() as mn, i_mn (mn)}
        <Accordion.Item value="{i_yr}-{i_mn}">
          {#snippet control()}
            <span class={cl_join({ 'font-bold': i_mn === 0 && i_yr === 0 })}>
              {MONTH_NAMES[mn - 1]}, Total = <sup>₹</sup>{info_analysis.get(yr)!.months.get(mn)!
                .amount}
            </span>
          {/snippet}
          <!-- DateWise -->
          {#snippet panel()}
            <div class="flex items-center gap-1">
              <Icon src={TiFlashOutline} class="-mt-1 size-5 text-amber-600 dark:text-yellow-300" />
              <span class="text-sm">
                ₹ {info_analysis.get(yr)!.months.get(mn)!.electricity_total}
              </span>
              <!-- ^ Total Electricity -->
            </div>
            {@render rent_table_list(yr, mn, 'electricity')}
            <div class="my-0.5 flex items-center gap-1">
              <Icon
                src={AiOutlineHome}
                class="-mt-1 mr-0.5 size-5 text-blue-600 dark:text-sky-300"
              />
              <span class="text-sm">
                ₹ {info_analysis.get(yr)!.months.get(mn)!.rent_total}
              </span>
              <!-- ^ Total Rent -->
            </div>
            {@render rent_table_list(yr, mn, 'rent')}
          {/snippet}
        </Accordion.Item>
      {/each}
    </Accordion>
  {/each}

  <small>
    Total = ₹ {total}
  </small>
</div>
{#if last_date !== null && last_id !== null}
  <div class="mt-4 flex items-center justify-center">
    <button
      class="btn px-1.5 py-0.5 text-sm font-semibold"
      disabled={$load_more_data_mut.isPending}
      onclick={async () => {
        await $load_more_data_mut.mutateAsync();
      }}>Load More</button
    >
  </div>
{/if}
