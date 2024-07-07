<script lang="ts">
  import { z } from 'zod';
  import { writable, type Writable } from 'svelte/store';
  import { slide } from 'svelte/transition';
  import { clone_date, get_date_string, get_utc_date_string, sort_date_helper } from '@tools/date';
  import Modal from '@components/Modal.svelte';
  import Spinner from '@components/Spinner.svelte';
  import { client, setJwtToken } from '@api/client';
  import type { PageData } from './$types';
  import ImageSpan from '@components/ImageSpan.svelte';
  import HomeIcon from '@components/icons/home.svg';
  import FlashIcon from '@components/icons/flash.svg';

  export let all_data: PageData;
  export let editable: Writable<boolean>;

  let data = all_data.rent_data;
  let verification_request_ids = all_data.verification_requests;
  $: data = all_data.rent_data;
  $: verification_request_ids = all_data.verification_requests;

  let save_spinner_show = false;

  function deepCopy<T>(value: T, is_array: boolean): T {
    const source = value as any;
    if (is_array)
      return source.map((obj: any) => ({
        ...obj,
        date: clone_date(obj.date),
        month: clone_date(obj.month)
      })) as T;
    return { ...source, date: clone_date(source.date), month: clone_date(source.month) } as T;
  }

  let prev_data = deepCopy(data, true);
  let save_modal_opened = writable(false);

  let to_change_list = new Set<number>();
  let to_delete_list = new Set<number>();
  let to_verify_list = new Set<number>();

  $: {
    if (editable) {
      let changed = new Set<number>();
      for (let i = 0; i < data.length; i++) {
        if (
          (get_date_string(prev_data[i].date) !== get_date_string(data[i].date) ||
            prev_data[i].amount !== data[i].amount ||
            get_date_string(prev_data[i].month) !== get_date_string(data[i].month)) &&
          !to_delete_list.has(data[i].id) &&
          z
            .object({
              id: z.number().int(),
              amount: z.number().int(),
              date: z.date(),
              month: z.date()
            })
            .safeParse(data[i]).success
        )
          changed.add(data[i].id);
      }
      to_change_list = changed;
    }
  }

  const set_val_from_input = (e: any, func: (val: string) => any) => {
    func(e.currentTarget.textContent);
  };

  const get_key_index_in_data = (id: number, dt: any[] = data) => {
    for (let i = 0; i < data.length; i++) if (data[i].id === id) return i;
    return -1;
  };

  $: is_savable = to_delete_list.size + to_change_list.size + to_verify_list.size !== 0;

  const save_data = async () => {
    if (!is_savable) return;
    const to_change = Array.from(to_change_list).map((id) => data[get_key_index_in_data(id)]);
    const to_delete = Array.from(to_delete_list);
    save_spinner_show = true;
    const { status } = await client.data.edit_data.mutate({
      to_verify: Array.from(to_verify_list),
      to_delete: to_delete,
      to_change: to_change
    });
    save_spinner_show = false;
    if (status === 'success') {
      // trying to do optimistic updates without relying on the sever response of updated data
      let new_data = deepCopy(data, true);
      for (let dt of to_change) {
        const index = get_key_index_in_data(dt.id, new_data);
        new_data[index] = deepCopy(dt, false);
      }
      new_data = new_data.filter((dt) => !to_delete.includes(dt.id));
      new_data = new_data.sort((dt1, dt2) => sort_date_helper(dt1, dt2, 'date', -1));
      verification_request_ids = verification_request_ids.filter((v) => !to_verify_list.has(v));

      // resetting values
      data = deepCopy(new_data, true);
      prev_data = deepCopy(data, true);
      to_change_list = new Set<number>();
      to_delete_list = new Set<number>();
      to_verify_list = new Set<number>();
      setJwtToken('');
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
    <div>
      Edits ➔ {to_change_list.size}, Deletions ➔ {to_delete_list.size}, Verifications ➔ {to_verify_list.size}
    </div>
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
<div class="table-container">
  <table class="table table-hover text-center outline-none">
    <thead>
      <tr>
        <th class="text-center">Date</th>
        <th class="text-center">Amount</th>
        <th class="text-center">Month</th>
        <th class="text-center text-xs">Type, User, ID</th>
      </tr>
    </thead>
    <tbody>
      {#each data as dt, i (dt.id)}
        {@const is_verify_request = verification_request_ids.includes(dt.id)}
        {@const to_change_status = to_change_list.has(dt.id)}
        {@const to_delete_status = to_delete_list.has(dt.id)}
        {@const to_verify_status = to_verify_list.has(dt.id)}
        {@const clss = to_delete_status
          ? 'to_delete'
          : to_change_status
            ? 'changed'
            : to_verify_status
              ? 'to_verify'
              : ''}
        {@const is_editable_row = $editable && !is_verify_request}
        <tr class={clss}>
          <td
            contenteditable={is_editable_row}
            on:input={(e) =>
              set_val_from_input(e, (val) => {
                const str_val = z
                  .string()
                  .regex(/^\d{1,2}\/\d{1,2}\/\d{4}$/)
                  .safeParse(val);
                if (!str_val.success) {
                  // dt.date = clone_date(prev_data[i].date);
                  return;
                }
                val = str_val.data;
                // val is in dd/mm/yyyy to convert to yyyy-mm-dd
                const vals = val.split('/');
                val = get_utc_date_string(`${vals[2]}-${vals[1]}-${vals[0]}`);
                const parse_val = z.coerce.date().safeParse(val);
                if (parse_val.success) dt.date = parse_val.data;
              })}>{get_date_string(dt.date)}</td
          >
          <td
            contenteditable={is_editable_row}
            on:input={(e) =>
              set_val_from_input(e, (val) => {
                const parse_val = z.coerce.number().int().safeParse(val);
                if (parse_val.success) dt.amount = parse_val.data;
                // else dt.amount=prev_data[i].amount
              })}
          >
            <span class:underline={is_verify_request}>{dt.amount}</span>
          </td>
          <td
            contenteditable={is_editable_row}
            on:input={(e) =>
              set_val_from_input(e, (val) => {
                const str_val = z
                  .string()
                  .regex(/^\d{4}-\d{1,2}$/)
                  .safeParse(val);
                if (!str_val.success) {
                  // dt.month=clone_date(prev_data[i].clo)
                  return;
                }
                val = str_val.data;
                const parse_val = z.coerce.date().safeParse(get_utc_date_string(val + '-1'));
                if (parse_val.success) dt.month = parse_val.data;
              })}>{`${dt.month.getUTCFullYear()}-${dt.month.getUTCMonth() + 1}`}</td
          >
          <td>
            <span class="small inline-flex items-center">
              {#if dt.rent_type === 'rent'}
                <ImageSpan
                  src={HomeIcon}
                  class="h-4 w-4"
                />{:else if dt.rent_type === 'electricity'}
                <ImageSpan src={FlashIcon} class="h-4 w-4" />{/if}, {dt.user_id || 'NA'}, {dt.id}
            </span>
            {#if is_editable_row}
              {@const values_edited =
                get_date_string(prev_data[i].date) !== get_date_string(data[i].date) ||
                prev_data[i].amount !== data[i].amount ||
                get_date_string(prev_data[i].month) !== get_date_string(data[i].month)}
              {#if !to_delete_status && values_edited}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <span on:click={() => (data[i] = deepCopy(prev_data[i], false))}>🔄</span>
              {/if}
              {#if !to_delete_status}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <span
                  on:click={() => {
                    to_delete_list.add(dt.id);
                    to_delete_list = to_delete_list;
                  }}>❌</span
                >
              {:else}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <span
                  on:click={() => {
                    to_delete_list.delete(dt.id);
                    to_delete_list = to_delete_list;
                  }}>✅️</span
                >
              {/if}
            {/if}
            {#if $editable && is_verify_request}
              {#if !to_verify_status}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <span
                  on:click={() => {
                    to_verify_list.add(dt.id);
                    to_verify_list = to_verify_list;
                  }}>➕</span
                >
              {:else}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <span
                  on:click={() => {
                    to_verify_list.delete(dt.id);
                    to_verify_list = to_verify_list;
                  }}>❌</span
                >
              {/if}
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .changed {
    border: 2px dashed yellow;
  }
  .to_delete {
    border: 2px dashed #ff0000;
  }
  .to_verify {
    border: 2px dashed lightgreen;
  }
</style>
