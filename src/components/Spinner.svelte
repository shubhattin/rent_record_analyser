<script lang="ts">
  export let show: boolean;
  export let remove_when_hidden = false; // this is to determine that wheter the spnner will be DOM or not
  export let spinner_color_change = false;
</script>

{#if !remove_when_hidden || show}
  <span class="spinner indicator" class:spinner_color_change style:opacity={show ? '1' : '0'} />
{/if}

<style>
  .spinner {
    width: 24px;
    height: 24px;
    border: 3.5px solid white;
    margin-top: -5px;
    margin-bottom: -5px;
    margin-right: 1px;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }
  .indicator {
    opacity: 0;
    transition: opacity 200ms ease-in;
  }
  @media only screen and (prefers-color-scheme: dark) {
    .spinner_color_change {
      border-color: white;
    }
  }
  .spinner_color_change {
    border-color: #1d1919;
  }
  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
