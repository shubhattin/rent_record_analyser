<script lang="ts">
  import { z } from 'zod';
  import { slide } from 'svelte/transition';
  import { convert_to_dd_mm_yyyy, convert_to_yyyy_mm_dd, pad_month_string } from '~/tools/date';
  import Spinner from '~/components/Spinner.svelte';
  import { client_q } from '~/api/client';
  import type { RentDataPageType } from '~/api/routers/rent_data';
  import ImageSpan from '~/components/ImageSpan.svelte';
  import HomeIcon from '~/components/icons/home.svg';
  import FlashIcon from '~/components/icons/flash.svg';
  import { FiSave } from 'svelte-icons-pack/fi';
  import Icon from '~/tools/Icon.svelte';
  import { AiOutlineClose, AiOutlineUser } from 'svelte-icons-pack/ai';
  import { BiReset } from 'svelte-icons-pack/bi';
  import { TiTick } from 'svelte-icons-pack/ti';
  import { VscAdd } from 'svelte-icons-pack/vsc';
  import { cl_join } from '~/tools/cl_join';
  import { SvelteSet } from 'svelte/reactivity';
  import { Modal, Popover } from '@skeletonlabs/skeleton-svelte';
  import { CgClose } from 'svelte-icons-pack/cg';
  import { deepCopy } from '~/tools/kry';

  let {
    all_data,
    editable = $bindable(),
    prev_data = $bindable()
  }: {
    all_data: RentDataPageType['data'];
    editable: boolean;
    prev_data: RentDataPageType['data'];
  } = $props();

  let data = $state(all_data);
  $effect(() => {
    data = all_data;
  });

  let save_modal_opened = $state(false);

  let to_change_list = $state(new SvelteSet<number>());
  let to_delete_list = $state(new SvelteSet<number>());
  let to_verify_list = $state(new SvelteSet<number>());

  $effect(() => {
    // diff for change in data
    if (editable) {
      let changed = new SvelteSet<number>();
      for (let i = 0; i < data.length; i++) {
        if (
          (prev_data[i].date !== data[i].date ||
            prev_data[i].amount !== data[i].amount ||
            prev_data[i].month !== data[i].month) &&
          !to_delete_list.has(data[i].id) &&
          z
            .object({
              id: z.number().int(),
              amount: z.number().int(),
              date: z.string().date(),
              month: z.string()
            })
            .safeParse(data[i]).success
        )
          changed.add(data[i].id);
      }
      to_change_list = changed;
    }
  });

  const get_key_index_in_data = (id: number, dt: any[] = data) => {
    for (let i = 0; i < data.length; i++) if (data[i].id === id) return i;
    return -1;
  };

  let is_savable = $derived(to_delete_list.size + to_change_list.size + to_verify_list.size !== 0);

  const edit_data = client_q.data.edit_data.mutation();

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
            let new_data = deepCopy(data);
            for (let dt of to_change) {
              const index = get_key_index_in_data(dt.id, new_data);
              new_data[index] = deepCopy(dt);
            }
            new_data = new_data.filter((dt) => !to_delete.includes(dt.id));
            new_data = new_data.sort((dt1, dt2) => dt1.date.localeCompare(dt2.date));

            // resetting values
            data = deepCopy(new_data);
            prev_data = deepCopy(data);
            to_change_list.clear();
            to_delete_list.clear();
            to_verify_list.clear();
            editable = false;
          }
        }
      }
    );
    save_modal_opened = false;
  };
</script>

{#if editable}
  <div transition:slide class="mb-5">
    <button
      ondblclick={() => (save_modal_opened = true)}
      class="btn preset-filled-primary-300-700 inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xl font-bold"
      disabled={!is_savable || $edit_data.isPending}
    >
      <Icon src={FiSave} class="-mt-1 mr-1 text-2xl" />
      Save
    </button>
    <Spinner show={$edit_data.isPending} />
    {#if !$edit_data.isPending}
      <button class="btn p-0" ondblclick={() => window.location.reload()}>
        <Icon src={CgClose} class="text-lg" />
      </button>
    {/if}
  </div>
  <Modal
    open={save_modal_opened}
    onOpenChange={(e) => (save_modal_opened = e.open)}
    contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
    backdropClasses="backdrop-blur-sm"
  >
    {#snippet content()}
      <h6>Are you sure to Save Changes ?</h6>
      <strong>
        <div>
          Edits ➔ {to_change_list.size}, Deletions ➔ {to_delete_list.size}, Verifications ➔ {to_verify_list.size}
        </div>
      </strong>
      <div class="mt-4 flex justify-end space-x-2">
        <button
          onclick={() => (save_modal_opened = false)}
          class="preset-outlined-error-300-700 btn rounded-lg px-2.5 py-1.5">❌ Close</button
        >
        <button
          class="preset-outlined-secondary-300-700 btn rounded-lg px-2.5 py-1.5"
          onclick={save_data_func}
        >
          ✅ Confirm
        </button>
      </div>
    {/snippet}
  </Modal>
{/if}
<div class="table-wrap">
  <table class="table outline-none">
    <thead>
      <tr>
        <th>Date</th>
        <th>Amount</th>
        <th>Month</th>
        <th class="text-xs">Type, ID, User</th>
      </tr>
    </thead>
    <tbody>
      {#each data as dt, i (dt.id)}
        {@const is_verify_request = !!dt.verification_request}
        {@const to_change_status = to_change_list.has(dt.id)}
        {@const to_delete_status = to_delete_list.has(dt.id)}
        {@const to_verify_status = to_verify_list.has(dt.id)}
        {@const clss = to_delete_status
          ? 'ring ring-red-500 ring-inset'
          : to_change_status
            ? 'ring ring-yellow-500 ring-inset'
            : to_verify_status
              ? 'ring ring-green-500 ring-inset'
              : ''}
        {@const is_editable_row = editable && !is_verify_request}
        <tr class={cl_join(clss)}>
          <td>
            {#if !editable}
              {convert_to_dd_mm_yyyy(dt.date, true)}
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
                  const parse_val = z.string().date().safeParse(convert_to_yyyy_mm_dd(value));
                  if (parse_val.success) dt.date = parse_val.data;
                }}
                value={convert_to_dd_mm_yyyy(dt.date)}
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
              {dt.month}
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
                  const parse_val = z
                    .string()
                    .regex(/^\d{4}-\d{2}$/)
                    .safeParse(pad_month_string(value));
                  if (parse_val.success) dt.month = parse_val.data;
                }}
                value={dt.month}
              />
            {/if}
          </td>
          <td class="flex items-center space-x-1">
            <span class="inline-flex items-center">
              {#if dt.rent_type === 'rent'}
                <ImageSpan
                  src={HomeIcon}
                  class="h-4 w-4"
                />{:else if dt.rent_type === 'electricity'}
                <ImageSpan src={FlashIcon} class="h-4 w-4" />{/if}
              <span class="sm:1.5 ml-0.5">
                {dt.id}
              </span>
            </span>
            {#if !editable}
              <Popover
                positioning={{ placement: 'top' }}
                triggerBase="4"
                contentBase="card bg-surface-200-800 px-0.5 sm:px-1.5 py-0.5 rounded-md space-y-4 max-w-[320px]"
                arrow
                arrowBackground="!bg-surface-200 dark:!bg-surface-800"
              >
                {#snippet trigger()}
                  <Icon src={AiOutlineUser} />
                {/snippet}
                {#snippet content()}
                  <div class="space-x-1 text-sm">
                    <span>{dt.user.name.split(' ')[0]}</span>
                    <span class="text-xs text-gray-600 dark:text-gray-400">
                      {dt.user.id.substring(0, 5)}
                    </span>
                  </div>
                {/snippet}
              </Popover>
            {/if}
            {#if is_editable_row}
              {@const values_edited =
                prev_data[i].date !== data[i].date ||
                prev_data[i].amount !== data[i].amount ||
                prev_data[i].month !== data[i].month}
              {#if !to_delete_status && values_edited}
                <button onclick={() => (data[i] = deepCopy(prev_data[i]))}
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
