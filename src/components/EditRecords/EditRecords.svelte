<script lang="ts">
  import type { dtType } from '@components/get_data';
  import Edit from './Edit.svelte';
  import { fetch_post } from '@tools/fetch';
  import { z } from 'zod';
  import { writable } from 'svelte/store';
  import { slide, scale } from 'svelte/transition';

  export let data: dtType[];

  let editable = writable(false);
  let pass_enterer_status = false;
  let passKey = writable('');

  $: {
    if ((import.meta as any).env.PROD && $editable && typeof window !== 'undefined')
      window.addEventListener('beforeunload', function (e) {
        // Cancel the event
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        // Chrome requires returnValue to be set
        e.returnValue = '';
      });
  }
  const check_pass = async () => {
    if ($passKey === '') return;
    const req = fetch_post('/api/edit/verify_pass', {
      json: {
        key: $passKey
      }
    });
    const resp = await req;
    if (!resp.ok) {
      $passKey = '';
      return;
    }
    const { verified } = z.object({ verified: z.boolean() }).parse(await resp.json());
    if (!verified) $passKey = '';
    else {
      pass_enterer_status = false;
      $editable = true;
    }
  };
</script>

{#if !$editable}
  {#if pass_enterer_status}
    <form on:submit|preventDefault={check_pass} class="grid" transition:slide>
      <input type="password" bind:value={$passKey} placeholder="गूढपद" required />
      <input type="submit" value="Submit" />
    </form>
  {:else}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div in:scale class="edit_btn" on:click={() => (pass_enterer_status = true)}>✏️</div>
  {/if}
{/if}

<Edit {data} {editable} {passKey} />

<style>
  .edit_btn {
    font-size: 1.25rem;
  }
</style>
