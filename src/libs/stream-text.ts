/**
 * Create text stream helper
 */
export function createTextStream(endChar: string) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder('utf-8');

  let queue: string[] = [];

  return {
    encode: (value: string) => encoder.encode(value),
    decode: (value: Uint8Array, done: (value: string) => void) => {
      queue.push(decoder.decode(value));
      if (queue.join('').endsWith(endChar)) {
        done(queue.join(''));
        queue = [];
      }
    },
  };
}
