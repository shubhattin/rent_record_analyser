<script lang="ts">
  import type { PageData } from './$types';
  import {
    Accordion,
    AccordionItem,
    AppBar,
    popup,
    RadioGroup,
    RadioItem
  } from '@skeletonlabs/skeleton';
  import { goto, preloadData } from '$app/navigation';
  import { MONTH_NAMES, MONTH_NAMES_SHORT, NUMBER_SUFFIX } from '@tools/date';
  import { onMount } from 'svelte';
  import { cl_join } from '@tools/cl_join';
  import { OiHome16 } from 'svelte-icons-pack/oi';
  import Icon from '@tools/Icon.svelte';
  import Zap from 'lucide-svelte/icons/zap';
  import { browser } from '$app/environment';
  import MainAppBar from '@components/MainAppBar.svelte';

  export let data: PageData;
  export let page_name: 'rent' | 'electricity' = 'rent';
  let rent_data = data.rent_data;

  $: rent_data = data.rent_data;

  onMount(() => {
    if (import.meta.env.PROD)
      setTimeout(() => {
        preloadData('/add');
        preloadData('/list');
      }, 2000);
  });
  $: {
    if (browser) {
      const new_url = { rent: '/', electricity: '/electricity' }[page_name];
      const current_url = window.location.pathname;
      if (new_url !== current_url) goto(new_url);
    }
  }
  // all lists are already formatted in
  const get_year_list = () => {
    const years: number[] = [];
    const amounts: number[] = [];
    for (let dt of rent_data) {
      const yr = dt.month.getUTCFullYear();
      const index = years.indexOf(yr);
      if (index === -1) {
        years.push(yr);
        amounts.push(dt.amount);
      } else amounts[index] += dt.amount;
    }
    return [years, amounts];
  };

  const get_month_list = (year: number) => {
    const months: number[] = [];
    const amounts: number[] = [];
    for (let dt of rent_data) {
      if (year !== dt.month.getUTCFullYear()) continue;
      const month = dt.month.getUTCMonth() + 1;
      const index = months.indexOf(month);
      if (index === -1) {
        months.push(month);
        amounts.push(dt.amount);
      } else amounts[index] += dt.amount;
    }
    return [months, amounts];
  };

  const get_date_list = (
    year: number,
    month: number
  ): [Date[], number[][], PageData['rent_data'][0][][]] => {
    const dates: Date[] = [];
    const amounts: number[][] = [];
    const refs: PageData['rent_data'][0][][] = [];
    for (let dt of rent_data) {
      if (year !== dt.month.getUTCFullYear()) continue;
      if (month !== dt.month.getUTCMonth() + 1) continue;

      const index = (() => {
        const date = dt.date.toLocaleDateString();
        for (let i = 0; i < dates.length; i++) if (dates[i].toLocaleDateString() === date) return i;
        return -1;
      })();
      if (index === -1) {
        dates.push(dt.date);
        amounts.push([dt.amount]);
        refs.push([dt]);
      } else {
        amounts[index].push(dt.amount);
        refs[index].push(dt);
      }
    }
    return [dates, amounts, refs];
  };

  const [year_list, amount_yr_list] = get_year_list();

  const total = rent_data.reduce((total, item) => total + item.amount, 0);
</script>

<svelte:head>
  <title>Rent Record Analyser</title>
  <meta name="description" content="A Simple House Rent Record Analyser" />
</svelte:head>

<MainAppBar {page_name}>
  <svelte:fragment slot="start">
    <RadioGroup>
      <RadioItem
        bind:group={page_name}
        name="rent_page"
        value="rent"
        class="fill-white active:fill-black"
      >
        <Icon src={OiHome16} class="text-2xl" />
      </RadioItem>
      <RadioItem bind:group={page_name} name="rent_page" value="electricity" class="text-2xl">
        <Zap />
      </RadioItem>
    </RadioGroup>
  </svelte:fragment>
</MainAppBar>
<!-- Yearly -->
{#each year_list as yr, i_yr (yr)}
  <h5 class="h5 mt-3 font-bold">
    Year {yr}, Total <sup>₹</sup>{amount_yr_list[i_yr]}
  </h5>
  <Accordion class="mt-1">
    <!-- Monthly -->
    {@const [month_list, amount_mn_list] = get_month_list(yr)}
    {#each month_list as mn, i_mn (mn)}
      <AccordionItem open={i_mn === 0 && i_yr === 0}>
        <svelte:fragment slot="summary">
          <span class={cl_join({ 'font-bold': i_mn === 0 && i_yr === 0 })}>
            {MONTH_NAMES[mn - 1]}, Total = <sup>₹</sup>{amount_mn_list[i_mn]}
          </span>
        </svelte:fragment>
        <!-- DateWise -->
        <svelte:fragment slot="content">
          {@const [date_list, amount_dt_list, ref_list] = get_date_list(yr, mn)}
          <table>
            {#each date_list as dt, i_dt (dt)}
              {@const date = dt.getUTCDate()}
              <tr>
                <td class="px-1 py-0.5 text-start text-sm">
                  {date}<sup>{date % 10 === 0 ? 'th' : NUMBER_SUFFIX[(date % 10) - 1]}</sup>
                </td>
                <td class="px-1 py-0.5 text-start text-sm">
                  {MONTH_NAMES_SHORT[dt.getUTCMonth() + 1 - 1]}
                </td>
                <td class="px-1 py-0.5 text-start text-sm">
                  {@html amount_dt_list[i_dt]
                    .map((v, i) => (ref_list[i_dt][i].is_not_verified ? `<u>₹ ${v}</u>` : `₹ ${v}`))
                    .join(', ')}
                </td>
              </tr>
            {/each}
          </table>
        </svelte:fragment>
      </AccordionItem>
    {/each}
  </Accordion>
{/each}

<small>
  Total = ₹ {total}
</small>
