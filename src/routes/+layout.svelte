<script lang="ts">
  import { ModeWatcher } from 'mode-watcher';
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
  import { storePopup } from '@skeletonlabs/skeleton';
  import '../app.pcss';

  // set up the floating UI for popups
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<ModeWatcher />
<div class="container mx-auto">
  <slot />
</div>
