<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { type Writable } from 'svelte/store';

  export let modal_open: Writable<boolean>;
  export let cancel_btn_txt: string | null = null!;
  export let confirm_btn_txt: string | null = null!;
  export let onOpen: () => void = null!;
  export let onClose: () => void = null!;

  let modalElement: HTMLElement;
  let opened = false;

  const mode_open_unsubscriber = modal_open.subscribe((value) => {
    if (value && !opened) openModal();
    else if (!value && opened) closeModal();
  });
  onDestroy(() => {
    mode_open_unsubscriber();
  });

  const isOpenClass = 'modal-is-open';
  const openingClass = 'modal-is-opening';
  const closingClass = 'modal-is-closing';
  const animationDuration = 400;
  let visibleModal: HTMLElement | null = null;

  const openModal = () => {
    if (isScrollbarVisible())
      document.documentElement.style.setProperty('--scrollbar-width', getScrollbarWidth() + 'px');
    document.documentElement.classList.add(isOpenClass, openingClass);
    setTimeout(() => {
      visibleModal = modalElement;
      document.documentElement.classList.remove(openingClass);
    }, animationDuration);
    opened = true;
    if (onOpen) onOpen();
  };
  const closeModal = () => {
    visibleModal = null;
    document.documentElement.classList.add(closingClass);
    setTimeout(() => {
      document.documentElement.classList.remove(closingClass, isOpenClass);
      document.documentElement.style.removeProperty('--scrollbar-width');
      opened = false;
      $modal_open = false;
      if (onClose) onClose();
    }, animationDuration);
  };
  const getScrollbarWidth = () => {
    const e = document.createElement('div');
    e.style.visibility = 'hidden';
    e.style.overflow = 'scroll';
    (e.style as any).msOverflowStyle = 'scrollbar';
    document.body.appendChild(e);
    const scrollbarInnerDiv = document.createElement('div');
    e.appendChild(scrollbarInnerDiv);
    const width = e.offsetWidth - scrollbarInnerDiv.offsetWidth;
    e.parentNode?.removeChild(e);
    return width;
  };
  const isScrollbarVisible = () => document.body.scrollHeight > window.screen.height;
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
<dialog bind:this={modalElement} open={opened}>
  <article>
    <!-- svelte-ignore a11y-missing-attribute -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <a aria-label="Close" class="close" on:click={closeModal}> </a>
    <slot />
    {#if cancel_btn_txt || confirm_btn_txt}
      <footer>
        {#if cancel_btn_txt}
          <button class="footer-btn secondary" on:click={closeModal}>{cancel_btn_txt}</button>
        {/if}
        {#if confirm_btn_txt}
          <button class="footer-btn" on:click={closeModal}>{cancel_btn_txt}</button>
        {/if}
      </footer>
    {/if}
  </article>
</dialog>

<style>
  .footer-btn {
    display: inline-block;
    width: fit-content;
  }
</style>
