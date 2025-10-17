<script lang="ts">
  import { Popover, Portal } from '@skeletonlabs/skeleton-svelte';
  import type { Snippet } from 'svelte';
  import type { Placement } from '@floating-ui/dom';
  import { cl_join } from '~/tools/cl_join';

  let {
    children,
    popup_state = $bindable(),
    description,
    cancel_func,
    confirm_func,
    close_on_confirm = false,
    contentBase,
    placement,
    class: className,
    triggerBase,
    z_index = 100
  }: {
    children: Snippet;
    confirm_func?: () => void;
    cancel_func?: () => void;
    description: string;
    popup_state: boolean;
    contentBase?: string;
    close_on_confirm?: boolean;
    placement: Placement;
    class?: string;
    triggerBase?: string;
    z_index?: number;
  } = $props();
</script>

<Popover
  open={popup_state}
  onOpenChange={(e) => {
    popup_state = e.open;
  }}
  positioning={{ placement: placement }}
>
  <!-- contentBase={cl_join(
    'card z-70 space-y-2 p-2 rounded-lg shadow-xl dark:bg-surface-900 bg-zinc-100',
    contentBase
  )}
  triggerBase={cl_join(triggerBase)}
  zIndex={z_index!.toString()} -->
  <Popover.Trigger class={cl_join(triggerBase)}>
    {@render children()}
  </Popover.Trigger>
  <Portal>
    <Popover.Positioner class="z-20!">
      <Popover.Content
        class={cl_join(
          contentBase,
          'card dark:bg-surface-900 z-70 space-y-2 rounded-lg bg-zinc-100 p-2 shadow-xl'
        )}
      >
        <div class={cl_join('text-lg font-bold', className)}>{description}</div>
        <div class="space-x-2">
          <button
            class={cl_join(
              'btn dark:bg-surface-700 rounded-lg bg-zinc-500 font-semibold text-white',
              className
            )}
            onclick={() => {
              if (close_on_confirm) popup_state = false;
              confirm_func && confirm_func();
            }}
          >
            Confirm
          </button>
          <button
            onclick={() => {
              popup_state = false;
              cancel_func && cancel_func();
            }}
            class={cl_join(
              'btn preset-outlined-surface-800-200 rounded-lg font-semibold',
              className
            )}
          >
            Cancel
          </button>
        </div>
      </Popover.Content>
    </Popover.Positioner>
  </Portal>
</Popover>
