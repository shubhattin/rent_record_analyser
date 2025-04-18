<script lang="ts">
  import { cl_join } from '~/tools/cl_join';
  import { onMount, untrack, type Snippet } from 'svelte';
  import { scale, slide } from 'svelte/transition';
  import { AiOutlineClose } from 'svelte-icons-pack/ai';
  import Icon from '~/tools/Icon.svelte';

  let {
    modal_open = $bindable(),
    children,
    cancel_btn_txt,
    confirm_btn_txt,
    onOpen,
    onClose,
    onConfirm
  }: {
    modal_open: boolean;
    children: Snippet;
    cancel_btn_txt?: string;
    confirm_btn_txt?: string;
    onOpen?: () => void;
    onClose?: () => void;
    onConfirm?: () => void;
  } = $props();

  let modalElement = $state<HTMLElement>(null!);
  let opened = $state(false);

  const lockScroll = () => {
    document.body.style.overflow = 'hidden';
  };

  const unlockScroll = () => {
    document.body.style.overflow = '';
  };

  $effect(() => {
    const _opened = untrack(() => opened);
    if (modal_open && !_opened) openModal();
    else if (!modal_open && _opened) closeModal();
  });

  const animationDuration = 400;
  let is_closing = $state(false); // to fix transition not being displayed while exiting
  let visibleModal = $state<HTMLElement | undefined>(undefined);

  const openModal = () => {
    if (opened) return;
    setTimeout(() => {
      visibleModal = modalElement;
    }, animationDuration);
    opened = true;
    lockScroll();
    if (onOpen) onOpen();
  };
  const closeModal = () => {
    if (!opened) return;
    visibleModal = undefined;
    is_closing = true;
    setTimeout(() => {
      opened = false;
      is_closing = false;
      unlockScroll();
      modal_open = false;
      if (onClose) onClose();
    }, animationDuration);
  };
  onMount(() => {
    document.addEventListener('click', (e) => {
      if (visibleModal && !visibleModal.querySelector('article')?.contains(e.target as Node)) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && visibleModal) {
        closeModal();
      }
    });
  });
</script>

<!-- Modal -->
<div
  transition:slide
  bind:this={modalElement}
  class={cl_join(
    'bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black transition-all duration-400',
    !opened && 'bg-opacity-0 hidden'
  )}
>
  {#if opened && !is_closing}
    <div
      in:scale={{ duration: animationDuration }}
      out:slide={{ duration: animationDuration }}
      class="mx-3 max-w-screen-lg"
    >
      <article class="rounded-lg bg-white p-3 pt-0 shadow-lg dark:bg-gray-800">
        <div class="flex justify-end">
          <button
            aria-label="Close"
            class="cursor-pointer text-gray-500 hover:text-gray-700"
            onclick={closeModal}><Icon src={AiOutlineClose} /></button
          >
        </div>
        {@render children()}
        {#if cancel_btn_txt || confirm_btn_txt}
          <footer class="mt-4 flex justify-end space-x-2">
            {#if cancel_btn_txt}
              <button class="variant-outline-error btn rounded-lg px-2.5 py-2" onclick={closeModal}
                >{cancel_btn_txt}</button
              >
            {/if}
            {#if confirm_btn_txt}
              <button
                class="variant-filled-secondary btn rounded-lg px-2.5 py-2"
                onclick={() => {
                  closeModal();
                  if (onConfirm) onConfirm();
                }}>{confirm_btn_txt}</button
              >
            {/if}
          </footer>
        {/if}
      </article>
    </div>
  {/if}
</div>
