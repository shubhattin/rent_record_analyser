<script lang="ts">
  import { AppBar, RadioGroup, RadioItem, popup } from '@skeletonlabs/skeleton';
  import { FiEdit } from 'svelte-icons-pack/fi';
  import { RiSystemAddLargeLine } from 'svelte-icons-pack/ri';
  import ModeChanger from './ModeChanger.svelte';
  import Icon from '@tools/Icon.svelte';
  import type { page_types } from './page_types';

  export let page_name: page_types;
</script>

<AppBar>
  <svelte:fragment slot="lead">
    <slot name="start" />
  </svelte:fragment>
  <!-- <svelte:fragment slot="headline">
    <slot name="headline"><span></span></slot>
  </svelte:fragment> -->
  <svelte:fragment slot="trail">
    <slot name="end">
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
          <Icon src={FiEdit} class="text-2xl" />
          <div data-popup="edit_popup" class="variant-ghost-tertiary px-1 text-base">
            Edit Records
            <div class="bg-surface-100-800-token arrow" />
          </div>
        </a>
      {/if}
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
          <Icon src={RiSystemAddLargeLine} class="text-2xl" />
          <div data-popup="add_popup" class="variant-ghost-tertiary px-1 text-base">
            Add Record
            <div class="bg-surface-100-800-token arrow" />
          </div>
        </a>
      {/if}
    </slot>
    <ModeChanger />
  </svelte:fragment>
</AppBar>
