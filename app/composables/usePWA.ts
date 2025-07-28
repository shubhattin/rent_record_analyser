export const usePWA = () => {
  const installEventFired = ref(false);
  const eventTriggerer = ref<any>(null);

  const setupPWAInstallListener = () => {
    if (import.meta.client) {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        eventTriggerer.value = event;
        installEventFired.value = true;
      });
    }
  };

  const promptInstall = async () => {
    if (eventTriggerer.value) {
      await eventTriggerer.value.prompt();
      const result = await eventTriggerer.value.userChoice;
      if (result.outcome === 'accepted') {
        installEventFired.value = false;
        eventTriggerer.value = null;
      }
    }
  };

  return {
    installEventFired: readonly(installEventFired),
    eventTriggerer: readonly(eventTriggerer),
    setupPWAInstallListener,
    promptInstall
  };
};
