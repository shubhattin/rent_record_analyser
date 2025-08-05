<script lang="ts">
  import { get_utc_date, normaliseDate } from '~/tools/date';
  import { MONTH_NAMES } from '~/tools/date';
  import { onMount } from 'svelte';
  import { slide, scale } from 'svelte/transition';
  import { client_q } from '~/api/client';
  import Icon from '~/tools/Icon.svelte';
  import { RiSystemAddLargeFill, RiSystemAddLargeLine } from 'svelte-icons-pack/ri';
  import { AiOutlineHome } from 'svelte-icons-pack/ai';
  import ConfirmModal from '~/components/PopoverModals/ConfirmModal.svelte';
  import { TrOutlineArrowBigRight } from 'svelte-icons-pack/tr';
  import { OiHome16 } from 'svelte-icons-pack/oi';
  import { TiFlashOutline } from 'svelte-icons-pack/ti';
  import { user_info } from '~/state/user.svelte';

  const todays_date = new Date();
  const current_month = todays_date.getMonth() + 1;
  const current_year = todays_date.getFullYear();

  const get_todays_date = () => {
    const prefix_zeros = (n: number) => `${n < 10 ? '0' : ''}${n}`;
    return `${current_year}-${prefix_zeros(current_month)}-${prefix_zeros(todays_date.getDate())}`;
  };
  let date = $state(get_todays_date());
  let month = $state(
    (() => {
      if (current_month === 1) return 12;
      return current_month - 1;
    })().toString()
  );
  let year = $state(
    (() => {
      if (current_month === 1) return current_year - 1;
      return current_year;
    })().toString()
  );
  let amount = $state<number>(null!);
  let rent_type: 'rent' | 'electricity' = $state('rent');

  const submit_data = client_q.data.add_data.mutation();

  const submit_data_func = async () => {
    if (!date || date === '' || !amount || amount === 0) return;
    const data = {
      rent_type: rent_type,
      date: date,
      amount: amount,
      month: `${year}-${month.padStart(2, '0')}`
    };
    $submit_data.mutate({ data });
  };
  let amount_input_elmt = $state<HTMLInputElement>(null!);

  onMount(() => {
    amount_input_elmt.focus();
  });

  let add_data_modal_state = $state(false);
</script>

{#if !$submit_data.isSuccess}
  <form
    transition:slide
    class="space-y-2"
    onsubmit={(e) => {
      e.preventDefault();
      add_data_modal_state = true;
    }}
  >
    {#if $user_info && $user_info.role === 'admin'}
      <div class="mt-2 space-x-3">
        <label class="inline-flex items-center space-x-2">
          <input
            class="radio rounded-xl"
            type="radio"
            bind:group={rent_type}
            checked
            value="rent"
          />
          <Icon src={OiHome16} class="text-xl" />
          <span class="mt-1">Rent</span>
        </label>
        <label class="inline-flex items-center space-x-2">
          <input class="radio rounded-xl" type="radio" bind:group={rent_type} value="electricity" />
          <Icon src={TiFlashOutline} class="text-xl" />
          <span class="mt-1">Electricity</span>
        </label>
      </div>
    {/if}
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
      min={100}
      bind:value={amount}
      bind:this={amount_input_elmt}
    />
    <button
      class="btn preset-filled-primary-400-600 mt-3 gap-1 rounded-lg px-2 py-1 font-bold text-white"
      disabled={$submit_data.isPending}
      type="submit"
    >
      <Icon src={RiSystemAddLargeFill} class="text-xl" />
      Add Record
    </button>
  </form>
{:else if $submit_data.isSuccess && $submit_data.data.status === 'success'}
  <div transition:scale class="space-y-1.5">
    <a href="/" class="btn preset-filled-primary-300-700 gap-1 rounded-md px-1 py-0">
      <Icon class="-mt-1" src={AiOutlineHome} />
      Home Page
    </a>
    <div class="font-semibold">
      Successfully Added Record of ₹ {amount} dated{' '}
      {normaliseDate(date)}.
    </div>
    <button
      class="btn preset-filled-secondary-300-700 gap-1 rounded-md px-1 py-0"
      onclick={() => {
        // resetting this component
        date = get_todays_date();
        month = current_month.toString();
        year = current_year.toString();
        // @ts-ignore
        amount = null;
        $submit_data.reset();
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

<ConfirmModal
  bind:popup_state={add_data_modal_state}
  close_on_confirm={true}
  confirm_func={() => {
    submit_data_func();
  }}
  title="Are you sure to Add ?"
>
  {#snippet body()}
    <span class="space-x-1">
      <span>₹ {amount}</span>
      <Icon src={TrOutlineArrowBigRight} class="text-lg" />
      <span class="font-bold">{MONTH_NAMES[parseInt(month) - 1]} {year}</span>
    </span>
  {/snippet}
</ConfirmModal>
