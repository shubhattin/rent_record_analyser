<script lang="ts">
  import { ModeWatcher } from 'mode-watcher';
  import '../app.pcss';
</script>

<ModeWatcher />
<div class="container mx-auto">
  <slot />
</div>
