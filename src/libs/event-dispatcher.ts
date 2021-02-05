import { createEventDispatcher as createSvelteDispatcher } from 'svelte';

/**
 * Creates a Svelte event dispatcher
 */
export function createEventDispatcher() {
  const dispatcher = createSvelteDispatcher();

  function dispatch(namespace: string, value: Record<string, string | number | boolean>, callback?: () => void) {
    dispatcher(namespace, { ...value });
    callback && callback();
  }

  return {
    dispatch,
  };
}
