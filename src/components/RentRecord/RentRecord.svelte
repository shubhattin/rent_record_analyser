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

  const total = data.reduce(
    (total, item) => total + item.amount.reduce((amt, val) => amt + val, 0),
    0
  );
</script>

<!-- Yearly -->
{#each year_list as yr, i_yr (yr)}
  <h5
    style={`margin-bottom: 10px; ${
      i_yr === 0 ? "color: var(--h2-color);" : "color: var(--h6-color);"
    }`}
  >
    Year {yr}, Total <sup>₹</sup>{amount_yr_list[i_yr]}
  </h5>
  <!-- Monthly -->
  {@const [month_list, amount_mn_list] = get_month_list(yr, data)}
  {#each month_list as mn, i_mn (mn)}
    {@const [date_list, amount_dt_list] = get_date_list(yr, mn, data)}
    <details open={i_mn === 0 && i_yr === 0}>
      <summary style={i_mn === 0 && i_yr === 0 ? "font-weight: bold;" : ""}>
        {MONTH_NAMES[mn - 1]}, Total = <sup>₹</sup>{amount_mn_list[i_mn]}
      </summary>
      <!-- DateWise -->
      {#each date_list as dt, i_dt (dt)}
        <div>
          {dt}
          <sup>{dt % 10 === 0 ? "th" : NUMBER_SUFFIX[(dt % 10) - 1]}</sup>{" "}
          {MONTH_NAMES_SHORT[mn - 1]} :-{" "}
          {amount_dt_list[i_dt].map((v) => `₹ ${v}`).join(", ")}
        </div>
      {/each}
    </details>
  {/each}
{/each}
<small>
  Total = ₹ {total}
</small>

<div>
  <a class="add_link" href="/add">
    <div />
  </a>
</div>

<style>
  /* retaining the  color even after open */
  details[open] > summary:not([role]):not(:focus) {
    color: var(--h4-color);
  }
  .add_link {
    position: absolute;
    right: 0;
    bottom: 0;
    height: 15px;
    width: 15px;
    display: block;
    border: 1px solid var(--h6-color);
  }
</style>
