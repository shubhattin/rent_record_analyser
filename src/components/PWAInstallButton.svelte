<script lang="ts">
  import Icon from '~/tools/Icon.svelte';
  import { OiDownload24 } from 'svelte-icons-pack/oi';
  import { pwa_install_event_fired, pwa_event_triggerer } from '~/state/main';

  let { button_onclick }: { button_onclick?: () => void } = $props();
</script>

{#if $pwa_install_event_fired}
  <button
    class="select-none gap-1 rounded-xl px-2 py-1 text-sm outline-none"
    onclick={async () => {
      button_onclick && button_onclick();
      await $pwa_event_triggerer.prompt();
    }}
  >
    <Icon src={OiDownload24} class="-mt-1 text-base" />
    Install
  </button>
{/if}
