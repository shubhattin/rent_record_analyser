<script lang="ts">
  import type { RentData } from '@tools/db_type';
  import { fetch_post } from '@tools/fetch';
  import { z } from 'zod';
  import { writable, type Writable } from 'svelte/store';
  import { slide } from 'svelte/transition';
  import Modal from '@components/Modal.svelte';
  import Spinner from '@components/Spinner.svelte';

  export let data: RentData[];
  export let editable: Writable<boolean>;
  export let passKey: Writable<string>;

  let save_spinner_show = false;

  const get_date_string = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };
  function deepCopy<T>(value: T, is_array: boolean): T {
    const source = value as any;
    if (is_array)
      return source.map((obj: any) => ({
        ...obj,
        date: new Date(obj.date),
        month: new Date(obj.month)
      })) as T;
    return { ...source, date: new Date(source.date), month: new Date(source.month) } as T;
  }

  let prev_data = deepCopy(data, true);
  let save_modal_opened = writable(false);

  let to_change_list = new Set<number>();
  let to_delete_list = new Set<number>();

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

  $: is_savable = to_delete_list.size + to_change_list.size !== 0;

  const save_data = async () => {
    if (!is_savable) return;
    const to_change = Array.from(to_change_list)
      .filter((id) => !to_delete_list.has(id))
      .map((id) => data[get_key_index_in_data(id)]);
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
      let new_data = deepCopy(data, true);
      for (let dt of to_change) {
        const index = get_key_index_in_data(dt.id, new_data);
        new_data[index] = deepCopy(dt, false);
      }
      new_data = new_data.filter((dt) => !to_delete.includes(dt.id));
      new_data = new_data.sort((dt1, dt2) => {
        const [date1, date2] = [dt1.date, dt2.date];
        const [day1, month1, year1] = [date1.getDate(), date1.getMonth() + 1, date1.getFullYear()];
        const [day2, month2, year2] = [date2.getDate(), date2.getMonth() + 1, date2.getFullYear()];
        if (year1 !== year2) return (year1 - year2) * -1; // -1 for descending order
        if (month1 !== month2) return (month1 - month2) * -1;
        return (day1 - day2) * -1;
      });

      // resetting values
      data = deepCopy(new_data, true);
      prev_data = deepCopy(data, true);
      to_change_list = new Set<number>();
      to_delete_list = new Set<number>();
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
      <th scope="col"><strong class="small">ID</strong></th>
    </tr>
  </thead>
  <tbody>
    {#each data as dt, i (dt.id)}
      {@const to_change_status = to_change_list.has(dt.id)}
      {@const to_delete_status = to_delete_list.has(dt.id)}
      {@const clss = to_delete_status ? 'to_delete' : to_change_status ? 'changed' : ''}
      <tr class={clss}>
        <td
          contenteditable={$editable}
          on:input={(e) =>
            set_val_from_input(e, (val) => {
              const str_val = z
                .string()
                .regex(/^\d{1,2}\/\d{1,2}\/\d{4}$/)
                .safeParse(val);
              if (!str_val.success) return;
              val = str_val.data;
              // val is in dd/mm/yyyy to convert to yyyy-mm-dd
              const vals = val.split('/');
              val = `${vals[2]}-${vals[1]}-${vals[0]}`;
              const parse_val = z.coerce.date().safeParse(val);
              if (parse_val.success) dt.date = parse_val.data;
            })}>{get_date_string(dt.date)}</td
        >
        <td
          contenteditable={$editable}
          on:input={(e) =>
            set_val_from_input(e, (val) => {
              const parse_val = z.coerce.number().int().safeParse(val);
              if (parse_val.success) dt.amount = parse_val.data;
            })}>{dt.amount}</td
        >
        <td
          contenteditable={$editable}
          on:input={(e) =>
            set_val_from_input(e, (val) => {
              const str_val = z
                .string()
                .regex(/^\d{4}-\d{1,2}$/)
                .safeParse(val);
              if (!str_val.success) return;
              val = str_val.data;
              const parse_val = z.coerce.date().safeParse(val + '-1');
              if (parse_val.success) dt.month = parse_val.data;
            })}>{`${dt.month.getFullYear()}-${dt.month.getMonth() + 1}`}</td
        >
        <td>
          <span class="small">
            {dt.id}
          </span>
          {#if $editable}
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
