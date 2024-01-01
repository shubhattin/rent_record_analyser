<script lang="ts">
  import {
    get_year_list,
    type dtType,
    get_month_list,
    MONTH_NAMES,
    get_date_list,
    NUMBER_SUFFIX,
    MONTH_NAMES_SHORT,
  } from "./get_data";

  export let data: dtType[];

  const [year_list, amount_yr_list] = get_year_list(data);
</script>

<!-- Yearly -->
{#each year_list as yr, i_yr (yr)}
  <h5 style="margin-bottom: 10px; color: var(--h2-color);">
    Year {yr}, Total <sup>₹</sup>{amount_yr_list[i_yr]}
  </h5>
  <!-- Monthly -->
  {@const [month_list, amount_mn_list] = get_month_list(yr, data)}
  {#each month_list as mn, i_mn (mn)}
    {@const [date_list, amount_dt_list] = get_date_list(yr, mn, data)}
      <details open={i_mn === 0}>
        <summary style={i_mn === 0 ? "font-weight: bold;" : ""}>
          {MONTH_NAMES[mn - 1]}, Total = <sup>₹</sup>{amount_mn_list[i_mn]}
        </summary>
        <!-- DateWise -->
        {#each date_list as dt, i_dt (dt)}
          <div>
            {dt}
            <sup>{dt % 10 === 0 ? "th" : NUMBER_SUFFIX[(dt % 10) - 1]}</sup
            >{" "}
            {MONTH_NAMES_SHORT[mn - 1]} :-{" "}
            {amount_dt_list[i_dt].map((v) => `₹ ${v}`).join(", ")}
          </div>
        {/each}
      </details>
  {/each}
{/each}

<style>
  /* retaining the  color even after open */
  details[open] > summary:not([role]):not(:focus) {
    color: var(--h4-color);
  }
</style>
