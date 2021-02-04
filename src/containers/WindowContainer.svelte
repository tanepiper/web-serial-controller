<script lang="ts">
  export let title = 'Web Serial Controller';

  export let width = '640px';
  export let height = '480px';
  export let margin = '0 auto';

  export let minimize = true;
  export let maximize = true;
  export let close = true;
  export let showStatusBar = true;
  export let display = true;
  export let classes = '';
  export let isModal = false;

  export let isDraggable = true;
  export let positionX = 0;
  export let positionY = 0;

  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  let element;

  function dragMouseDown(e) {
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    element.style.top = element.offsetTop - pos2 + 'px';
    element.style.left = element.offsetLeft - pos1 + 'px';
  }

  function closeDragElement(el) {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (close && event.code === 'Escape') {
      display = false;
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

{#if display}
  <div
    bind:this={element}
    class="window"
    class:modal={isModal}
    class:draggable={isDraggable}
    style="--window-width: {width}; --window-height: {height}; --window-margin: {margin} --position-x: {positionX} --position-y: {positionY}"
  >
    <div class="title-bar" on:mousedown={dragMouseDown}>
      <div class="title-bar-text">{title}</div>
      <div class="title-bar-controls">
        {#if minimize}
          <button class="title-button minimize" aria-label="Minimize" />
        {/if}
        {#if maximize}
          <button class="title-button maximize" aria-label="Maximize" />
        {/if}
        {#if close}
          <button class="title-button close" aria-label="Close" on:click={() => (display = !display)} />
        {/if}
      </div>
    </div>

    <div class="window-body content">
      <slot>Default Window Container</slot>
    </div>

    {#if showStatusBar}
      <div class="status-bar">
        <p class="status-bar-field">
          <slot name="status1" />
        </p>
        <p class="status-bar-field">
          <slot name="status2" />
        </p>
        <p class="status-bar-field">
          <slot name="status3" />
        </p>
      </div>
    {/if}
  </div>
{/if}

<style type="scss">
  .window {
    width: var(--window-width);
    min-height: var(--window-height);
    margin: var(--window-margin);
  }

  .draggable {
    position: absolute;
    z-index: 100;
    top: calc(25%);
    left: calc(25%);
  }

  .title-bar {
    cursor: pointer;
  }

  .content {
    min-height: calc(var(--window-height) - 1rem);
  }

  //.modal {
  //  position: absolute;
  //  top: 50%;
  //  left: 50%;
  //  margin-top: -50px;
  //  margin-left: -50px;
  //}
</style>
