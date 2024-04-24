<script lang="ts">
  import type { PageData } from './$types';
  import { preloadData } from '$app/navigation';
  import { MONTH_NAMES, MONTH_NAMES_SHORT, NUMBER_SUFFIX } from '@tools/date';
  import { onMount } from 'svelte';

  export let data: PageData;
  let rent_data = data.rent_data;
  let electricity_data = data.electricity_data;

  $: rent_data = data.rent_data;
  $: electricity_data = data.electricity_data;

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

  const total =
    rent_data.reduce((total, item) => total + item.amount, 0) +
    electricity_data.reduce((total, item) => total + item.amount, 0);

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
    Year {yr}, Total <sup>₹</sup>{amount_yr_list[i_yr] +
      electricity_data
        .filter((item) => item.month.getFullYear() === yr)
        .reduce((total, item) => total + item.amount, 0)}
  </h5>
  <!-- Monthly -->
  {@const [month_list, amount_mn_list] = get_month_list(yr)}
  {#each month_list as mn, i_mn (mn)}
    {@const [date_list, amount_dt_list, ref_list] = get_date_list(yr, mn)}
    <details open={i_mn === 0 && i_yr === 0}>
      <summary style={i_mn === 0 && i_yr === 0 ? 'font-weight: bold;' : ''}>
        {MONTH_NAMES[mn - 1]}, Total = <sup>₹</sup>{amount_mn_list[i_mn] +
          electricity_data
            .filter(
              (item) => item.month.getFullYear() === yr && item.month.getUTCMonth() + 1 === mn
            )
            .reduce((total, item) => total + item.amount, 0)}
      </summary>
      {#each electricity_data as el}
        {@const el_mn = el.month.getUTCMonth() + 1}
        {@const el_yr = el.month.getUTCFullYear()}
        {#if yr === el_yr && el_mn === mn}
          <div>⚡ ₹ {el.amount}</div>
        {/if}
      {/each}
      <!-- DateWise -->
      <table class="table reset_css">
        {#each date_list as dt, i_dt (dt)}
          {@const date = dt.getUTCDate()}
          <tr>
            <td>
              {date}<sup>{date % 10 === 0 ? 'th' : NUMBER_SUFFIX[(date % 10) - 1]}</sup>
            </td>
            <td>
              {MONTH_NAMES_SHORT[dt.getUTCMonth() + 1 - 1]}
            </td>
            <td>
              {@html amount_dt_list[i_dt]
                .map((v, i) => (ref_list[i_dt][i].is_not_verified ? `<u>₹ ${v}</u>` : `₹ ${v}`))
                .join(', ')}
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
