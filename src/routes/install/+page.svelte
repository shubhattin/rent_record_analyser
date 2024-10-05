<script lang="ts">
  import { onMount } from 'svelte';

  let event_fired = $state(false);
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

<div class="my-5 flex justify-center">
  <button
    disabled={!event_fired}
    class="rounded-xl px-2 py-1 text-xl font-bold dark:bg-lime-400 dark:text-amber-900"
    onclick={install_PWA}>Install</button
  >
</div>
