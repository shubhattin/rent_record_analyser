<script lang="ts">
  import { get_utc_date, normaliseDate } from '@tools/date';
  import { MONTH_NAMES } from '@tools/date';
  import { onMount } from 'svelte';
  import Spinner from '@components/Spinner.svelte';
  import { slide, scale } from 'svelte/transition';
  import { client } from '@api/client';
  import Icon from '@tools/Icon.svelte';
  import { RiSystemAddLargeLine } from 'svelte-icons-pack/ri';
  import { AiOutlineHome } from 'svelte-icons-pack/ai';

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
  let submitted = false;
  let rent_type: 'rent' | 'electricity' = 'rent';

  const submit_data = async () => {
    if (!date || date === '' || !amount || amount === 0) return;
    submit_spinner_show = true;
    const { status } = await client.data.add_data.mutate({
      data: {
        rent_type: rent_type,
        date: get_utc_date(date),
        amount: amount,
        month: get_utc_date(`${year}-${month}-1`) // 1st day of the month
      }
    });
    submit_spinner_show = false;
    if (status === 'success') submitted = true;
  };
  let amount_input_elmt: HTMLInputElement;

  onMount(() => {
    amount_input_elmt.focus();
  });
</script>

{#if !submitted}
  <form transition:slide on:submit|preventDefault={submit_data} class="space-y-2">
    <label class="label">
      <span>Rent Type</span>
      <select class="select" bind:value={rent_type}>
        <option value="rent" selected>🏠 Rent</option>
        <option value="electricity">⚡ Electricity</option>
      </select>
    </label>
    <label class="label">
      <span>Date</span>
      <input class="input" type="date" required bind:value={date} />
    </label>
    <label class="label">
      <span>Month</span>
      <select class="select" bind:value={month}>
        {#each MONTH_NAMES as mn_nm, i}
          <option value={`${i + 1}`}>{mn_nm}</option>
        {/each}
      </select>
    </label>
    <label class="label">
      <span>Year</span>
      <select class="select" bind:value={year}>
        <option value={`${current_year - 1}`}>{current_year - 1}</option>
        <option value={`${current_year}`}>{current_year}</option>
        <option value={`${current_year + 1}`}>{current_year + 1}</option>
      </select>
    </label>
    <input
      class="input"
      type="number"
      placeholder="Amount"
      required
      bind:value={amount}
      bind:this={amount_input_elmt}
    />
    <button
      type="submit"
      class="rounded-lg bg-secondary-700 py-2 pr-4 font-semibold text-white dark:text-white"
    >
      <Spinner show={submit_spinner_show} />
      Submit
    </button>
  </form>
{:else if submitted}
  <div transition:scale class="space-y-1.5">
    <a href="/" class="rounded-md bg-tertiary-600 p-1 text-white dark:text-white">
      <Icon class="-mt-1" src={AiOutlineHome} />
      Home Page
    </a>
    <div class="font-semibold">
      Successfully Added Record of ₹ {amount} dated{' '}
      {normaliseDate(date)}.
    </div>
    <button
      class="rounded-md bg-secondary-600 px-1 text-white dark:text-white"
      on:click={() => {
        // resetting this component
        date = get_todays_date();
        month = current_month.toString();
        year = current_year.toString();
        // @ts-ignore
        amount = null;
        submitted = false;
        setTimeout(() => {
          amount_input_elmt.focus();
        }, 300);
      }}
    >
      <Icon class="-my-2" src={RiSystemAddLargeLine} />
      Add More
    </button>
  </div>
{/if}
