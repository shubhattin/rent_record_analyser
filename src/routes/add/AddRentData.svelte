<script lang="ts">
  import { normaliseDate } from '@tools/date';
  import { fetch_post } from '@tools/fetch';
  import { MONTH_NAMES } from '@tools/date';
  import { onMount } from 'svelte';
  import { z } from 'zod';
  import { slide, scale } from 'svelte/transition';

  export let passKey: string;

  const todays_date = new Date();
  const current_month = todays_date.getMonth() + 1;
  const current_year = todays_date.getFullYear();

  const get_todays_date = () => {
    const prefix_zeros = (n: number) => `${n < 10 ? '0' : ''}${n}`;
    return `${current_year}-${prefix_zeros(current_month)}-${prefix_zeros(todays_date.getDate())}`;
  };
  let date = get_todays_date();
  let month = current_month.toString();
  let year = current_year.toString();
  let amount: number;
  let errorStatus = false;
  let submitted = false;

  const sumbit_data = async () => {
    if (!date || date === '' || !amount || amount === 0) return;
    const req = fetch_post('/api/add/submit', {
      json: {
        key: passKey,
        date: normaliseDate(date),
        amount: amount,
        month: `${month}-${year}`
      }
    });
    const res = await req;
    if (!res.ok) return;
    const { status } = z.object({ status: z.string() }).parse(await res.json());
    if (status === 'success') {
      submitted = true;
    }
  };

  let amount_input_elmt: HTMLInputElement;

  onMount(() => {
    amount_input_elmt.focus();
  });
</script>

<section>
  <h4>Add New Entry</h4>
  {#if !errorStatus && !submitted}
    <form transition:slide on:submit|preventDefault={sumbit_data}>
      <input type="date" required bind:value={date} />
      <div class="grid">
        <label>
          Month
          <select bind:value={month}>
            {#each MONTH_NAMES as mn_nm, i}
              <option value={`${i + 1}`}>{mn_nm}</option>
            {/each}
          </select>
        </label>
        <label>
          Year
          <select bind:value={year}>
            <option value={`${current_year - 1}`}>{current_year - 1}</option>
            <option value={`${current_year}`}>{current_year}</option>
            <option value={`${current_year + 1}`}>{current_year + 1}</option>
          </select>
        </label>
      </div>
      <input
        type="number"
        placeholder="Amount"
        required
        bind:value={amount}
        bind:this={amount_input_elmt}
      />
      <input type="submit" value="Sumbit" />
    </form>
  {:else if errorStatus}
    <input
      type="text"
      readonly
      aria-invalid="true"
      value="Cannot Add Record before the Last Date"
    />
  {:else if submitted}
    <div transition:scale>
      <a href="/">
        <button style="width:fit-content;">Home Page</button>
      </a>
      <div>
        <strong>
          Successfully Added Record of ₹ {amount} dated{' '}
          {normaliseDate(date)}.
        </strong>
      </div>
      <br />
      <!-- svelte-ignore a11y-missing-attribute -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <a
        style="width:fit-content;"
        on:click|preventDefault={() => {
          // resetting this component
          date = get_todays_date();
          month = current_month.toString();
          year = current_year.toString();
          // @ts-ignore
          amount = null;
          errorStatus = false;
          submitted = false;
          setTimeout(() => {
            amount_input_elmt.focus();
          }, 300);
        }}>Add More</a
      >
    </div>
  {/if}
</section>