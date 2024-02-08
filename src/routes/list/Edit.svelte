<script lang="ts">
  import { type dtType, dataSchema, sort_data_based_on_date } from '$lib/get_data';
  import { fetch_post } from '@tools/fetch';
  import { z } from 'zod';
  import { writable, type Writable } from 'svelte/store';
  import { slide } from 'svelte/transition';
  import Modal from '@components/Modal.svelte';
  import Spinner from '@components/Spinner.svelte';

  export let data: dtType[];
  export let editable: Writable<boolean>;
  export let passKey: Writable<string>;

  let save_spinner_show = false;

  function deepCopy<T>(source: T): T {
    const jsonString = JSON.stringify(source);
    const copiedObject = JSON.parse(jsonString);
    return copiedObject as T;
  }

  let prev_data = deepCopy(data);
  let save_modal_opened = writable(false);

  let to_change_list = new Set<string>();
  let to_delete_list = new Set<string>();

  $: {
    let changed = new Set<string>();
    for (let i = 0; i < data.length; i++) {
      if (
        (prev_data[i].date !== data[i].date ||
          prev_data[i].amount !== data[i].amount ||
          prev_data[i].month !== data[i].month) &&
        !to_delete_list.has(data[i].key) &&
        dataSchema.safeParse(data[i]).success
      )
        changed.add(data[i].key);
    }
    to_change_list = changed;
  }

  const set_text_from_input = (e: any, func: (val: string) => any) => {
    func(e.currentTarget.textContent);
  };

  const get_key_index_in_data = (key: string, dt: any[] = data) => {
    for (let i = 0; i < data.length; i++) if (data[i].key === key) return i;
    return -1;
  };

  $: is_savable = to_delete_list.size + to_change_list.size !== 0;

  const save_data = async () => {
    if (!is_savable) return;
    const to_change = Array.from(to_change_list).map((key) => data[get_key_index_in_data(key)]);
    const to_delete = Array.from(to_delete_list);
    const req = fetch_post('/api/edit/submit', {
      json: {
        to_delete: to_delete,
        to_change: to_change,
        passKey: $passKey
      }
    });
    save_spinner_show = true;
    const res = await req;
    save_spinner_show = false;
    if (!res.ok) return;
    const { status } = z.object({ status: z.string() }).parse(await res.json());
    if (status === 'success') {
      // trying to do optimistic updates without relying on the sever response of updated data
      let new_data = deepCopy(data);
      for (let dt of to_change) {
        const index = get_key_index_in_data(dt.key, new_data);
        new_data[index] = deepCopy(dt);
      }
      new_data = new_data.filter((dt) => !to_delete.includes(dt.key));
      new_data = sort_data_based_on_date(new_data, -1);

      // resetting values
      data = deepCopy(new_data);
      prev_data = deepCopy(data);
      to_change_list = new Set<string>();
      to_delete_list = new Set<string>();
      $passKey = '';
      $editable = false;
    }
  };
</script>

<Modal
  modal_open={save_modal_opened}
  cancel_btn_txt="❌ Close"
  confirm_btn_txt="✅ Confirm"
  onConfirm={save_data}
>
  <h6>Are you sure to Save Changes ?</h6>
  <strong>
    <div>Edits ➔ {to_change_list.size}, Deletions ➔ {to_delete_list.size}</div>
  </strong>
</Modal>
{#if $editable}
  <div transition:slide>
    <button
      on:click={() => ($save_modal_opened = true)}
      style="width:fit-content; display:inline-block; margin-left:2px;"
      disabled={!is_savable}
    >
      💾 Save
    </button>
    <Spinner show={save_spinner_show} />
  </div>
{/if}
<table role="grid">
  <thead>
    <tr>
      <th scope="col"><strong>Date</strong></th>
      <th scope="col"><strong>Amount</strong></th>
      <th scope="col"><strong>Month</strong></th>
      <th scope="col"><strong class="small">Key</strong></th>
    </tr>
  </thead>
  <tbody>
    {#each data as dt, i (dt.key)}
      {@const to_change_status = to_change_list.has(dt.key)}
      {@const to_delete_status = to_delete_list.has(dt.key)}
      {@const clss = to_delete_status ? 'to_delete' : to_change_status ? 'changed' : ''}
      <tr class={clss}>
        <td
          contenteditable={$editable}
          on:input={(e) => set_text_from_input(e, (val) => (dt.date = val))}>{dt.date}</td
        >
        <td
          contenteditable={$editable}
          on:input={(e) =>
            set_text_from_input(e, (val) => {
              const parse_val = z.coerce.number().int().safeParse(val);
              if (parse_val.success) dt.amount = parse_val.data;
            })}>{dt.amount}</td
        >
        <td
          contenteditable={$editable}
          on:input={(e) => set_text_from_input(e, (val) => (dt.month = val))}>{dt.month}</td
        >
        <td>
          <span class="small">
            {dt.key}
          </span>
          {#if $editable}
            {@const values_edited =
              dt.amount !== prev_data[i].amount ||
              dt.date !== prev_data[i].date ||
              dt.month !== prev_data[i].month}
            {#if !to_delete_status && values_edited}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <span on:click={() => (data[i] = deepCopy(prev_data[i]))}>🔄</span>
            {/if}
            {#if !to_delete_status}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <span
                on:click={() => {
                  to_delete_list.add(dt.key);
                  to_delete_list = to_delete_list;
                }}>❌</span
              >
            {:else}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <span
                on:click={() => {
                  to_delete_list.delete(dt.key);
                  to_delete_list = to_delete_list;
                }}>✅️</span
              >
            {/if}
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .changed {
    border: 2px dashed yellow;
  }
  .to_delete {
    border: 2px dashed #ff0000;
  }
  td {
    outline: none;
  }
  td,
  th {
    text-align: center;
  }
  .small {
    font-size: 0.55rem;
  }
  strong.small {
    font-size: 0.6rem;
  }
</style>
