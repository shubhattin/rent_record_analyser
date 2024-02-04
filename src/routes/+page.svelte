<script lang="ts">
  import { get_year_list, type dtType, get_month_list, get_date_list } from '$lib/get_data';
  import { MONTH_NAMES, NUMBER_SUFFIX, MONTH_NAMES_SHORT } from '@tools/date';
  import type { PageData } from './$types';
  import { preloadData } from '$app/navigation';
  import { onMount } from 'svelte';

  export let data: PageData;
  let rent_data = data.rent_data;
  $: rent_data = data.rent_data;

  const [year_list, amount_yr_list] = get_year_list(rent_data);

  const total = rent_data.reduce((total, item) => total + item.amount, 0);

  onMount(() => {
    if (import.meta.env.PROD)
      setTimeout(() => {
        preloadData('/add');
        preloadData('/list');
      }, 2000);
  });
</script>

<svelte:head>
  <title>Rent Record Analyser</title>
  <meta name="description" content="A Simple House Rent Record Analyser" />
</svelte:head>

<!-- Yearly -->
{#each year_list as yr, i_yr (yr)}
  <h5
    style={`margin-bottom: 10px; ${
      i_yr === 0 ? 'color: var(--h2-color);' : 'color: var(--h6-color);'
    }`}
  >
    Year {yr}, Total <sup>₹</sup>{amount_yr_list[i_yr]}
  </h5>
  <!-- Monthly -->
  {@const [month_list, amount_mn_list] = get_month_list(yr, rent_data)}
  {#each month_list as mn, i_mn (mn)}
    {@const [date_list, amount_dt_list, actual_month_list] = get_date_list(yr, mn, rent_data)}
    <details open={i_mn === 0 && i_yr === 0}>
      <summary style={i_mn === 0 && i_yr === 0 ? 'font-weight: bold;' : ''}>
        {MONTH_NAMES[mn - 1]}, Total = <sup>₹</sup>{amount_mn_list[i_mn]}
      </summary>
      <!-- DateWise -->
      <table class="table reset_css">
        {#each date_list as dt, i_dt (dt)}
          <tr>
            <td>
              {dt}<sup>{dt % 10 === 0 ? 'th' : NUMBER_SUFFIX[(dt % 10) - 1]}</sup>
            </td>
            <td>
              {MONTH_NAMES_SHORT[actual_month_list[i_dt] - 1]}
            </td>
            <td>
              {amount_dt_list[i_dt].map((v) => `₹ ${v}`).join(', ')}
            </td>
          </tr>
        {/each}
      </table>
    </details>
  {/each}
{/each}
<small>
  Total = ₹ {total}
</small>

<div class="links">
  <a href="/list">✏️</a>
  <a href="/add">➕</a>
</div>

<style lang="scss">
  /* retaining the  color even after open */
  details[open] > summary:not([role]):not(:focus) {
    color: var(--h4-color);
  }
  .links {
    position: fixed;
    right: 0;
    bottom: 0;
    font-size: 1.25rem;
  }
  .reset_css {
    all: unset;
  }
  details {
    margin-bottom: 0.4rem;
    padding-bottom: 0.5rem;

    summary {
      margin-bottom: 0.45rem;
      padding-top: 0.1rem;
    }
  }
  .table {
    display: table;
    td {
      padding-left: 0.25rem;
      padding-right: 0.25rem;
      padding-top: 0.1rem;
      padding-bottom: 0.1rem;
      text-align: start;
      font-size: 0.875rem;
    }
    tr {
      display: table-row;
    }

    td {
      display: table-cell;
    }
  }
</style>
