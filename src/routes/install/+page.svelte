<script lang="ts">
  import { onMount } from 'svelte';

  let event_fired = false;
  let install_prompt: any = null!;

  onMount(() => {
    window.addEventListener('beforeinstallprompt', (event) => {
      event_fired = true;
      event.preventDefault();
      install_prompt = event;
    });
  });

  const install_PWA = async () => {
    if (!event_fired) return;
    await install_prompt.prompt();
  };
</script>

<svelte:head>
  <title>Rent App Installer</title>
</svelte:head>

<button disabled={!event_fired} on:click={install_PWA}>Install</button>
