<script lang="ts">
  import { onMount } from 'svelte';

  let event_fired = false;
  let install_prompt: any = null!;

  onMount(() => {
    window.addEventListener('beforeinstallprompt', (event) => {
      event_fired = true;
      event.preventDefault();
      console.log(event);
      install_prompt = event;
    });
  });

  const install_PWA = async () => {
    if (!install_prompt) return;
    await install_prompt.prompt();
  };
</script>

<svelte:head>
  <title>Rent App Installer</title>
</svelte:head>

{#if event_fired}
  {#if !install_prompt}
    <div>PWA installation not supported</div>
  {:else}
    <button on:click={install_PWA}>Install</button>
  {/if}
{/if}
