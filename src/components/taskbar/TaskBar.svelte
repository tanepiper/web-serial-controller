<script type="ts">
  export let height = '40';
</script>

<div class="taskbar">
  <div class="main-section" />
</div>

<style type="scss">
  :root {
    --dark-color: #245edb;
    --light-color: #0c8dea;
  }

  .taskbar {
    position: absolute;
    display: flex;
    z-index: 100;
    bottom: 0;
    left: 0;
    width: 100%;

    .main-section {
      height: 40px;
      flex-grow: 1;
      background: linear-gradient(
          to bottom,
          var(--dark-color) 0%,
          #3f8cf3 9%,
          var(--dark-color) 18%,
          var(--dark-color) 92%,
          #333 100%
        )
        center/cover no-repeat;
    }
  }
</style>
