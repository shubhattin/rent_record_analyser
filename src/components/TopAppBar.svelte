<script lang="ts">
  import { AppBar, Tooltip, Popover } from '@skeletonlabs/skeleton-svelte';
  import { FiEdit } from 'svelte-icons-pack/fi';
  import { RiSystemAddLargeLine } from 'svelte-icons-pack/ri';
  import { BiArrowBack } from 'svelte-icons-pack/bi';
  import ThemeChanger from './ThemeChanger.svelte';
  import Icon from '~/tools/Icon.svelte';
  import type { Snippet } from 'svelte';
  import { AiOutlineMenu } from 'svelte-icons-pack/ai';
  import { SiGithub } from 'svelte-icons-pack/si';

  let {
    page_name,
    start,
    end
  }: {
    page_name: 'rent' | 'electricity' | 'add' | 'edit' | 'reset_pass';
    start?: Snippet | undefined;
    end?: Snippet | undefined;
  } = $props();

  let app_bar_popover_status = $state(false);
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
    <Popover
      bind:open={app_bar_popover_status}
      positioning={{ placement: 'left-start' }}
      arrow={false}
      contentBase="card z-50 space-y-2 rounded-lg px-3 py-2 shadow-xl bg-surface-100-900"
      triggerBase="btn m-0 p-0 gap-0 -mt-1 outline-none select-none"
    >
      {#snippet trigger()}
        <Icon
          src={AiOutlineMenu}
          class="text-3xl hover:text-gray-500 active:text-blue-600 dark:hover:text-gray-400 dark:active:text-blue-400"
        />
      {/snippet}
      {#snippet content()}
        <a
          href="https://github.com/shubhattin/rent_record_analyser"
          target="_blank"
          rel="noopener noreferrer"
          class="will-close group flex space-x-1 rounded-md px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700"
          onclick={() => (app_bar_popover_status = false)}
        >
          <Icon
            src={SiGithub}
            class="-mt-1 mr-1 text-2xl group-hover:fill-indigo-700 dark:group-hover:fill-zinc-400"
          />
          <span>Github</span>
        </a>
        <div class="wont-close flex space-x-3 rounded-md px-2 py-1">
          <span class="mt-1">Set Theme</span>
          <ThemeChanger />
        </div>
      {/snippet}
    </Popover>
  {/snippet}
</AppBar>
