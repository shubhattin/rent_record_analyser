<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '~/tools/Icon.svelte';
  import { OiDownload24 } from 'svelte-icons-pack/oi';

  let { button_onclick }: { button_onclick?: () => void } = $props();

  let event_fired = $state(true);
  let install_prompt: any | null = null;

  onMount(() => {
    window.addEventListener('beforeinstallprompt', (event) => {
      console.log('guyhuiji');
      event_fired = true;
      event.preventDefault();
      install_prompt = event;
    });
  });

  const install_PWA = async () => {
    if (!event_fired) return;
    await install_prompt!.prompt();
  };
</script>

{#if !event_fired}
  <button
    class="select-none gap-1 rounded-xl px-2 py-1 text-sm outline-none"
    onclick={async () => {
      button_onclick && button_onclick();
      install_PWA();
    }}
  >
    <Icon src={OiDownload24} class="-mt-1 text-base" />
    Install
  </button>
{/if}
