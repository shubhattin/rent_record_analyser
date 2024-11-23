<script lang="ts">
  import { AppBar, Tooltip } from '@skeletonlabs/skeleton-svelte';
  import { FiEdit } from 'svelte-icons-pack/fi';
  import { RiSystemAddLargeLine } from 'svelte-icons-pack/ri';
  import { BiArrowBack } from 'svelte-icons-pack/bi';
  import ThemeChanger from './ThemeChanger.svelte';
  import Icon from '@tools/Icon.svelte';
  import type { Snippet } from 'svelte';

  let {
    page_name,
    start,
    end
  }: {
    page_name: 'rent' | 'electricity' | 'add' | 'edit' | 'reset_pass';
    start?: Snippet | undefined;
    end?: Snippet | undefined;
  } = $props();
</script>

<AppBar>
  {#snippet lead()}
    {#if page_name !== 'rent' && page_name !== 'electricity'}
      <Tooltip
        contentBase="preset-outlined-tertiary-100-900 px-1 rounded-md text-base"
        positioning={{ placement: 'bottom' }}
        openDelay={100}
      >
        {#snippet trigger()}
          <a class="text-xl" href="/">
            <Icon
              src={BiArrowBack}
              class="-mt-1 mr-1 text-2xl hover:fill-red-700 dark:hover:fill-sky-500"
            />
          </a>
        {/snippet}
        {#snippet content()}Home Page{/snippet}
      </Tooltip>
    {/if}
    {@render start?.()}
  {/snippet}
  <!-- <svelte:fragment slot="headline">
    <slot name="headline"><span></span></slot>
  </svelte:fragment> -->
  {#snippet trail()}
    {#if end}
      {@render end()}
    {:else}
      {#if page_name !== 'add'}
        <Tooltip
          contentBase="preset-outlined-tertiary-100-900 px-1 rounded-md text-base"
          positioning={{ placement: 'bottom' }}
          openDelay={100}
        >
          {#snippet trigger()}
            <a class="text-xl" href="/add">
              <Icon
                src={RiSystemAddLargeLine}
                class="text-2xl hover:fill-zinc-400 active:fill-green-700"
              />
            </a>
          {/snippet}
          {#snippet content()}Add Record{/snippet}
        </Tooltip>
      {/if}
      {#if page_name !== 'edit'}
        <Tooltip
          contentBase="preset-outlined-tertiary-100-900 px-1 rounded-md text-base"
          positioning={{ placement: 'bottom' }}
          openDelay={200}
        >
          {#snippet trigger()}
            <a class="text-xl" href="/list">
              <Icon src={FiEdit} class="text-2xl hover:text-zinc-400 active:text-blue-600" />
            </a>
          {/snippet}
          {#snippet content()}Edit Records{/snippet}
        </Tooltip>
      {/if}
    {/if}
    <ThemeChanger />
  {/snippet}
</AppBar>
