<script lang="ts">
  import { AppBar, Popover, Tooltip } from '@skeletonlabs/skeleton-svelte';
  import ThemeChanger from './ThemeChanger.svelte';
  import Icon from '~/tools/Icon.svelte';
  import { SiGithub } from 'svelte-icons-pack/si';
  import { AiOutlineMenu } from 'svelte-icons-pack/ai';
  import { page } from '$app/stores';
  import { PAGE_TITLES } from '~/state/page_titles';
  import type { Snippet } from 'svelte';
  import { BiArrowBack } from 'svelte-icons-pack/bi';
  import { RiSystemAddLargeLine } from 'svelte-icons-pack/ri';
  import { FiEdit } from 'svelte-icons-pack/fi';
  import { pwa_state } from '~/state/main.svelte';
  import { OiDownload24 } from 'svelte-icons-pack/oi';

  let { start, headline, end }: { start?: Snippet; headline?: Snippet; end?: Snippet } = $props();

  let route_id = $derived($page.route.id as keyof typeof PAGE_TITLES);

  let app_bar_popover_status = $state(false);
</script>

<AppBar>
  {#snippet lead()}
    {#if route_id !== '/'}
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
    {#if start}
      {@render start()}
    {/if}
    {#if headline}
      {@render headline()}
    {:else if route_id in PAGE_TITLES}
      <span class={PAGE_TITLES[route_id as keyof typeof PAGE_TITLES][1]}>
        {PAGE_TITLES[route_id as keyof typeof PAGE_TITLES][0]}
      </span>
    {/if}
    {@render start?.()}
  {/snippet}
  {#snippet trail()}
    {#if end}
      {@render end()}
    {:else}
      {#if route_id !== '/add'}
        <a class="text-xl" href="/add">
          <Icon
            src={RiSystemAddLargeLine}
            class="text-2xl hover:fill-zinc-400 active:fill-green-700"
          />
        </a>
      {/if}
      {#if route_id !== '/list'}
        <a class="text-xl" href="/list">
          <Icon src={FiEdit} class="text-2xl hover:text-zinc-400 active:text-blue-600" />
        </a>
      {/if}
    {/if}
    <Popover
      open={app_bar_popover_status}
      onOpenChange={(e) => (app_bar_popover_status = e.open)}
      positioning={{ placement: 'left-start' }}
      arrow={false}
      contentBase="card z-50 space-y-1 rounded-lg px-3 py-2 shadow-xl bg-surface-100-900"
      triggerBase="btn p-0 gap-0 mt-1 outline-none select-none"
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
          class="group flex space-x-1 rounded-md px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700"
          onclick={() => (app_bar_popover_status = false)}
        >
          <Icon
            src={SiGithub}
            class="-mt-1 mr-1 text-2xl group-hover:fill-indigo-700 dark:group-hover:fill-zinc-400"
          />
          <span>Github</span>
        </a>
        {#if pwa_state.install_event_fired}
          <button
            class="gap-1 px-2 py-1 text-sm outline-none select-none"
            onclick={async () => {
              app_bar_popover_status = false;
              if (pwa_state.install_event_fired && pwa_state.event_triggerer)
                await pwa_state.event_triggerer.prompt();
            }}
          >
            <Icon src={OiDownload24} class="-mt-1 text-base" />
            Install
          </button>
        {/if}
        <div class="flex space-x-3 rounded-md px-2 py-1">
          <span class="mt-1">Set Theme</span>
          <ThemeChanger />
        </div>
      {/snippet}
    </Popover>
  {/snippet}
</AppBar>
