/**
 * Get the correct offset of an element in the browser window
 * @param el
 */
export function getOffset(el: HTMLElement) {
  let _x = 0;
  let _y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    (el as any) = el.offsetParent;
  }
  return { top: _y, left: _x };
}

/**
 * Bind a set of events to an element
 * @param element
 * @param events
 */
export function bindEvents(element: HTMLElement, events: Record<string, (event: Event) => void>) {
  const listeners: [string, (event: Event) => void][] = Object.entries(events).map(([event, handler]) => {
    element.addEventListener(event, handler);
    return [event, handler];
  });

  return {
    destroy() {
      listeners.forEach(([event, listener]) => element.removeEventListener(event, listener));
    },
  };
}
