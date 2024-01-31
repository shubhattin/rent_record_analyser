<script lang="ts">
  const get_pwa_prompt = () => (window as any).pwa_installer;

  const install_PWA = async () => {
    const install_prompt=get_pwa_prompt()
    if (!install_prompt) return;
    await install_prompt.prompt();
  };
</script>

<svelte:head>
  <title>Rent App Installer</title>
  <script>
    window.pwa_installer = null;
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      console.log(event);
      window.pwa_installer = event;
    });
    console.log('Good');
  </script>
</svelte:head>

<!-- {#if event_fired}
  {#if !install_prompt}
    <div>PWA installation not supported</div>
  {:else} -->
    <button on:click={install_PWA}>Install</button>
  <!-- {/if}
{/if} -->
