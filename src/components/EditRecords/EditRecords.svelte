<script lang="ts">
  import type { dtType } from "@components/get_data";
  export let data: dtType[];

  let prev_data = JSON.parse(JSON.stringify(data));

  let changed_records = new Set<string>();
  let to_delete_records = new Set<string>();

  $: {
    let changed = new Set<string>();
    for (let i = 0; i < data.length; i++) {
      // console.log(prev_data[i],data[i])
      if (
        prev_data[i].date !== data[i].date ||
        prev_data[i].amount !== data[i].amount ||
        prev_data[i].month !== data[i].month
      )
        changed.add(data[i].key);
    }
    changed_records = changed;
  }

  const get_parse_int = (str: any) => parseInt(str);
</script>

<table role="grid">
  <thead>
    <tr>
      <th scope="col"><strong>Date</strong></th>
      <th scope="col"><strong>Amount</strong></th>
      <th scope="col"><strong>Month</strong></th>
      <th scope="col"><strong>Key</strong></th>
    </tr>
  </thead>
  <tbody>
    {#each data as dt, i}
      {@const changed_status = changed_records.has(dt.key)}
      {@const to_delete_status = to_delete_records.has(dt.key)}
      {@const clss = to_delete_status
        ? "to_delete"
        : changed_status
          ? "changed"
          : ""}
      <tr class={clss}>
        <td contenteditable="true" bind:textContent={dt.date}>{dt.date}</td>
        <td
          contenteditable="true"
          on:input={(e) =>
            (dt.amount = get_parse_int(e.currentTarget.textContent))}
          >{dt.amount}</td
        >
        <td contenteditable="true" bind:textContent={dt.month}>{dt.month}</td>
        <td
          >{dt.key}
          {#if !to_delete_status}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span
              on:click={() => {
                to_delete_records.add(dt.key);
                to_delete_records = to_delete_records;
              }}>❌</span
            >
          {:else}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span
              on:click={() => {
                to_delete_records.delete(dt.key);
                to_delete_records = to_delete_records;
              }}>✅️</span
            >
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .changed {
    border: 2px solid yellow;
  }
  .to_delete {
    border: 2px solid #ff0000;
  }
  td {
    outline: none;
  }
</style>
