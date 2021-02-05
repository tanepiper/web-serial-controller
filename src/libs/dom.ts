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
