<script type="ts">
    import { createEventDispatcher } from '../../libs/event-dispatcher';

    const dispatcher = createEventDispatcher();

    async function handleKeyDown(event: KeyboardEvent) {
        if (event.ctrlKey) {
            if (event.code === 'KeyC') {
                dispatcher.dispatch('keyEvent', {type: 'connect'});
            } else if (event.code === 'KeyD') {
                dispatcher.dispatch('keyEvent', {type: 'disconnect'});
            }
        }
    }
</script>

<svelte:window on:keydown={handleKeyDown}/>
