<script lang="ts">
  import { get_utc_date, normaliseDate } from '@tools/date';
  import { MONTH_NAMES } from '@tools/date';
  import { onMount } from 'svelte';
  import Spinner from '@components/Spinner.svelte';
  import { slide, scale } from 'svelte/transition';
  import { client_raw } from '@api/client';
  import Icon from '@tools/Icon.svelte';
  import { RiSystemAddLargeLine } from 'svelte-icons-pack/ri';
  import { AiOutlineHome } from 'svelte-icons-pack/ai';
  import { delay } from '@tools/delay';
  import { OiHome16 } from 'svelte-icons-pack/oi';
  import { TiFlashOutline } from 'svelte-icons-pack/ti';

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
    const { status } = await client_raw.data.add_data.mutate({
      data: {
        rent_type: rent_type,
        date: get_utc_date(date),
        amount: amount,
        month: get_utc_date(`${year}-${month}-1`) // 1st day of the month
      }
    });
    await delay(500);
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
    <div class="mt-2 space-x-3">
      <label class="inline-flex items-center space-x-2">
        <input class="radio rounded-xl" type="radio" bind:group={rent_type} checked value="rent" />
        <Icon src={OiHome16} class="text-xl" />
        <span class="mt-1">Rent</span>
      </label>
      <label class="inline-flex items-center space-x-2">
        <input class="radio rounded-xl" type="radio" bind:group={rent_type} value="electricity" />
        <Icon src={TiFlashOutline} class="text-xl" />
        <span class="mt-1">Electricity</span>
      </label>
    </div>
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
    <button type="submit" class="variant-filled-secondary btn rounded-lg px-3 py-1.5 font-semibold">
      <Spinner show={submit_spinner_show} />
      Submit
    </button>
  </form>
{:else if submitted}
  <div transition:scale class="space-y-1.5">
    <a href="/" class="variant-filled-tertiary btn rounded-md px-1 py-[0.12rem]">
      <Icon class="-mt-1" src={AiOutlineHome} />
      Home Page
    </a>
    <div class="font-semibold">
      Successfully Added Record of ₹ {amount} dated{' '}
      {normaliseDate(date)}.
    </div>
    <button
      class="variant-filled-secondary btn rounded-md px-1 py-1"
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
