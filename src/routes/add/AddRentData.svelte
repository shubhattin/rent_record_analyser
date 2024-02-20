<script lang="ts">
  import { get_utc_date, normaliseDate } from '@tools/date';
  import { MONTH_NAMES } from '@tools/date';
  import { onMount } from 'svelte';
  import Spinner from '@components/Spinner.svelte';
  import { slide, scale } from 'svelte/transition';
  import { client } from '@api/client';

  export let passKey: string;

  const todays_date = new Date();
  const current_month = todays_date.getMonth() + 1;
  const current_year = todays_date.getFullYear();
  let submit_spinner_show = false;

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

  const submit_data = async () => {
    if (!date || date === '' || !amount || amount === 0) return;
    submit_spinner_show = true;
    const { status } = await client.add_data.submit_data.mutate({
      password: passKey,
      date: get_utc_date(date),
      amount: amount,
      month: get_utc_date(`${year}-${month}-1`) // 1st day of the month
    });
    submit_spinner_show = false;
    if (status === 'success') submitted = true;
  };
  let amount_input_elmt: HTMLInputElement;

  onMount(() => {
    amount_input_elmt.focus();
  });
</script>

<section>
  <h4>Add New Entry</h4>
  {#if !errorStatus && !submitted}
    <form transition:slide on:submit|preventDefault={submit_data}>
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
      <button type="submit">
        <Spinner show={submit_spinner_show} />
        Submit
      </button>
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
