<script lang="ts">
  import '../app.pcss';
</script>

<div class="container mx-auto">
  <slot />
</div>
<svelte:head>
  <script>
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    )
      document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  </script>
</svelte:head>
