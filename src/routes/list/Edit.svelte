<script lang="ts">
  import { z } from 'zod';
  import { slide } from 'svelte/transition';
  import { clone_date, get_date_string, get_utc_date_string, sort_date_helper } from '@tools/date';
  import Spinner from '@components/Spinner.svelte';
  import { client, setJwtToken } from '@api/client';
  import type { PageData } from './$types';
  import ImageSpan from '@components/ImageSpan.svelte';
  import HomeIcon from '@components/icons/home.svg';
  import FlashIcon from '@components/icons/flash.svg';
  import { FiSave } from 'svelte-icons-pack/fi';
  import Icon from '@tools/Icon.svelte';
  import { AiOutlineClose } from 'svelte-icons-pack/ai';
  import { BiReset } from 'svelte-icons-pack/bi';
  import { TiTick } from 'svelte-icons-pack/ti';
  import { VscAdd } from 'svelte-icons-pack/vsc';
  import { cl_join } from '@tools/cl_join';
  import Modal from '@components/Modal.svelte';
  import { SvelteSet } from 'svelte/reactivity';

  let { all_data, editable = $bindable() }: { all_data: PageData; editable: boolean } = $props();

  let data = $state(all_data.rent_data);
  $effect(() => {
    data = all_data.rent_data;
  });
  let verification_request_ids = $state(all_data.verification_requests);
  $effect(() => {
    verification_request_ids = all_data.verification_requests;
  });

  let save_modal_opened = $state(false);

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
  // svelte-ignore state_referenced_locally
  let prev_data = $state(deepCopy(data, true));

  let to_change_list = $state(new SvelteSet<number>());
  let to_delete_list = $state(new SvelteSet<number>());
  let to_verify_list = $state(new SvelteSet<number>());

  $effect(() => {
    if (editable) {
      let changed = new SvelteSet<number>();
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
  });

  const set_val_from_input = (e: any, func: (val: string) => any) => {
    func(e.currentTarget.textContent);
  };

  const get_key_index_in_data = (id: number, dt: any[] = data) => {
    for (let i = 0; i < data.length; i++) if (data[i].id === id) return i;
    return -1;
  };

  let is_savable = $derived(to_delete_list.size + to_change_list.size + to_verify_list.size !== 0);

  const edit_data = client.data.edit_data.mutation();

  const save_data_func = async () => {
    if (!is_savable) return;
    const to_change = Array.from(to_change_list).map((id) => data[get_key_index_in_data(id)]);
    const to_delete = Array.from(to_delete_list);
    const to_verify = Array.from(to_verify_list);
    $edit_data.mutate(
      { to_change, to_delete, to_verify },
      {
        onSuccess: (_data) => {
          if (_data.status === 'success') {
            // trying to do optimistic updates without relying on the sever response of updated data
            let new_data = deepCopy(data, true);
            for (let dt of to_change) {
              const index = get_key_index_in_data(dt.id, new_data);
              new_data[index] = deepCopy(dt, false);
            }
            new_data = new_data.filter((dt) => !to_delete.includes(dt.id));
            new_data = new_data.sort((dt1, dt2) => sort_date_helper(dt1, dt2, 'date', -1));
            verification_request_ids = verification_request_ids.filter(
              (v) => !to_verify_list.has(v)
            );

            // resetting values
            data = deepCopy(new_data, true);
            prev_data = deepCopy(data, true);
            to_change_list.clear();
            to_delete_list.clear();
            to_verify_list.clear();
            setJwtToken('');
            editable = false;
          }
        }
      }
    );
  };
</script>

<Modal
  bind:modal_open={save_modal_opened}
  cancel_btn_txt="❌ Close"
  confirm_btn_txt="✅ Confirm"
  onConfirm={save_data_func}
>
  <h6>Are you sure to Save Changes ?</h6>
  <strong>
    <div>
      Edits ➔ {to_change_list.size}, Deletions ➔ {to_delete_list.size}, Verifications ➔ {to_verify_list.size}
    </div>
  </strong>
</Modal>

{#if editable}
  <div transition:slide class="mb-5">
    <button
      onclick={() => (save_modal_opened = true)}
      class="variant-filled-secondary btn inline-flex items-center rounded-lg px-3 py-1.5 text-xl font-bold"
      disabled={!is_savable}
    >
      <Icon src={FiSave} class="-mt-1 mr-1" />
      Save
    </button>
    <Spinner show={$edit_data.isPending} />
  </div>
{/if}
<div class="table-container">
  <table class="table-hover table text-center outline-none">
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
        {@const is_editable_row = editable && !is_verify_request}
        <tr class={cl_join(clss)}>
          <td>
            {#if !editable}
              {get_date_string(dt.date)}
            {:else}
              <input
                type="text"
                class="input w-24 p-1 text-sm"
                oninput={({ currentTarget: { value } }) => {
                  const str_val = z
                    .string()
                    .regex(/^\d{1,2}\/\d{1,2}\/\d{4}$/)
                    .safeParse(value);
                  if (!str_val.success) {
                    // dt.date = clone_date(prev_data[i].date);
                    return;
                  }
                  value = str_val.data;
                  // val is in dd/mm/yyyy to convert to yyyy-mm-dd
                  const vals = value.split('/');
                  value = get_utc_date_string(`${vals[2]}-${vals[1]}-${vals[0]}`);
                  const parse_val = z.coerce.date().safeParse(value);
                  if (parse_val.success) dt.date = parse_val.data;
                }}
                value={get_date_string(dt.date)}
              />
            {/if}
          </td>
          <td>
            {#if !editable}
              <span class:underline={is_verify_request}>{dt.amount}</span>
            {:else}
              <input
                class:underline={is_verify_request}
                type="number"
                step={100}
                class="input w-16 p-1 text-sm"
                oninput={({ currentTarget: { value } }) => {
                  const parse_val = z.coerce.number().int().safeParse(value);
                  if (parse_val.success) dt.amount = parse_val.data;
                }}
                value={dt.amount}
              />
            {/if}
          </td>
          <td>
            {#if !editable}
              {`${dt.month.getUTCFullYear()}-${dt.month.getUTCMonth() + 1}`}
            {:else}
              <input
                type="text"
                class="input w-20 p-1 text-sm"
                oninput={({ currentTarget: { value } }) => {
                  const str_val = z
                    .string()
                    .regex(/^\d{4}-\d{1,2}$/)
                    .safeParse(value);
                  if (!str_val.success) {
                    // dt.month=clone_date(prev_data[i].clo)
                    return;
                  }
                  value = str_val.data;
                  const parse_val = z.coerce.date().safeParse(get_utc_date_string(value + '-1'));
                  if (parse_val.success) dt.month = parse_val.data;
                }}
                value={`${dt.month.getUTCFullYear()}-${dt.month.getUTCMonth() + 1}`}
              />
            {/if}
          </td>
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
                <button onclick={() => (data[i] = deepCopy(prev_data[i], false))}
                  ><Icon src={BiReset} class="-mt-2 text-xl hover:fill-amber-600" /></button
                >
              {/if}
              {#if !to_delete_status}
                <button
                  onclick={() => {
                    to_delete_list.add(dt.id);
                  }}
                  ><Icon
                    src={AiOutlineClose}
                    class="-mt-2 fill-[red] text-xl hover:fill-red-400"
                  /></button
                >
              {:else}
                <button
                  onclick={() => {
                    to_delete_list.delete(dt.id);
                  }}
                  ><Icon
                    src={TiTick}
                    class="-mt-2 fill-green-600 text-xl hover:fill-green-500 dark:fill-green-400 dark:hover:fill-green-500"
                  /></button
                >
              {/if}
            {/if}
            {#if editable && is_verify_request}
              {#if !to_verify_status}
                <button
                  onclick={() => {
                    to_verify_list.add(dt.id);
                  }}
                  ><Icon
                    src={VscAdd}
                    class="-mt-2 fill-blue-600 text-xl hover:fill-sky-500 dark:fill-sky-500 dark:hover:fill-sky-300"
                  /></button
                >
              {:else}
                <button
                  onclick={() => {
                    to_verify_list.delete(dt.id);
                  }}
                  ><Icon
                    src={AiOutlineClose}
                    class="-mt-2 fill-[red] text-xl hover:fill-red-400"
                  /></button
                >
              {/if}
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style lang="postcss">
  .changed {
    @apply ring ring-inset ring-yellow-500;
  }
  .to_delete {
    @apply ring ring-inset ring-red-500;
  }
  .to_verify {
    @apply ring ring-inset ring-green-500;
  }
</style>
