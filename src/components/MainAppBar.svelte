<script lang="ts">
  import { AppBar, popup } from '@skeletonlabs/skeleton';
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
  <svelte:fragment slot="lead">
    {#if page_name !== 'rent' && page_name !== 'electricity'}
      <a
        class="text-xl"
        href="/"
        use:popup={{
          event: 'hover',
          target: 'home_popup',
          placement: 'bottom'
        }}
      >
        <Icon
          src={BiArrowBack}
          class="-mt-1 mr-1 text-2xl hover:fill-red-700 dark:hover:fill-sky-500"
        />
        <div data-popup="home_popup" class="variant-ghost-tertiary px-1 text-base">
          Home Page
          <div class="bg-surface-100-800-token arrow"></div>
        </div>
      </a>
    {/if}
    {#if start}
      {@render start()}
    {/if}
  </svelte:fragment>
  <!-- <svelte:fragment slot="headline">
    <slot name="headline"><span></span></slot>
  </svelte:fragment> -->
  <svelte:fragment slot="trail">
    {#if end}
      {@render end()}
    {:else}
      {#if page_name !== 'add'}
        <a
          class="text-xl"
          href="/add"
          use:popup={{
            event: 'hover',
            target: 'add_popup',
            placement: 'bottom'
          }}
        >
          <Icon
            src={RiSystemAddLargeLine}
            class="text-2xl hover:fill-zinc-400 active:fill-green-700"
          />
          <div data-popup="add_popup" class="variant-ghost-tertiary px-1 text-base">
            Add Record
            <div class="bg-surface-100-800-token arrow"></div>
          </div>
        </a>
      {/if}
      {#if page_name !== 'edit'}
        <a
          class="text-xl"
          href="/list"
          use:popup={{
            event: 'hover',
            target: 'edit_popup',
            placement: 'bottom'
          }}
        >
          <Icon src={FiEdit} class="text-2xl hover:text-zinc-400 active:text-blue-600" />
          <div data-popup="edit_popup" class="variant-ghost-tertiary px-1 text-base">
            Edit Records
            <div class="bg-surface-100-800-token arrow"></div>
          </div>
        </a>
      {/if}
    {/if}
    <ThemeChanger />
  </svelte:fragment>
</AppBar>
