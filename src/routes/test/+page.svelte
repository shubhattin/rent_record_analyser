<script lang="ts">
  import { createQuery, useQueryClient } from '@tanstack/svelte-query';
  import { delay } from '@tools/delay';

  let search = 'me';

  const queryClient = useQueryClient();
  const query = createQuery({
    queryKey: ['todos', search],
    queryFn: async () => {
      // gen a random number btw 700 and 2000
      const tm = Math.floor(Math.random() * (1500 - 700 + 1)) + 700;
      console.log(`Time for ${search}: ${tm / 1000}s`);
      await delay(tm);
      return [
        { id: 1, text: 'Do the laundry - ' + search },
        { id: 2, text: 'Do the dishes - ' + search },
        { id: 3, text: 'Do the lawn - ' + search }
      ];
    }
  });

  $: {
    search &&
      queryClient.invalidateQueries({
        queryKey: ['todos']
      });
  }
</script>

<svelte:head>
  <title>Test</title>
</svelte:head>

<div class="my-2 text-xl font-semibold">
  <div class="my-3">
    <input type="text" class="input w-40" bind:value={search} placeholder="Value" />
  </div>
  {#if $query.data}
    {#each $query.data as todo}
      <div>{todo.text}</div>
    {/each}
  {:else}
    <div>Loading...</div>
  {/if}
</div>
