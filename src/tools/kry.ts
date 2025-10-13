import { Buffer } from 'buffer';

export const search_with_key = <T, K extends keyof T>(key: K, value: T[K], data_list: T[]) => {
  // this function can also be used in frontend despite of this file using node modules (using treeshaking)
  for (let i = 0; i < data_list.length; i++) if (data_list[i][key] === value) return i;
  return -1;
};

export const get_val_with_key = <T, K extends keyof T>(key: K, value: T[K], data_list: T[]) => {
  const index = search_with_key(key, value, data_list);
  if (index !== -1) return data_list[index];
};

export const str_to_array_buffer = (str: string) => {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};
export const array_buffer_to_str = (buff: ArrayBuffer) => {
  return Array.from(new Uint8Array(buff))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};
export const str_to_bin_str = (value: string) => {
  const codeUnits = new Uint16Array(value.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = value.charCodeAt(i);
  }
  return String.fromCharCode(...new Uint8Array(codeUnits.buffer));
};
export const bin_str_to_str = (binary: string) => {
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return String.fromCharCode(...new Uint16Array(bytes.buffer));
};
/** `encode=false` by default */
export const to_base64 = (str: string, encode = false) => {
  if (encode) str = str_to_bin_str(str);
  str = Buffer.from(str, 'utf-8').toString('base64');
  return str;
};
/** `decode=false` by default */
export const from_base64 = (str: string, decode = false) => {
  str = Buffer.from(str, 'base64').toString('utf-8');
  try {
    if (decode) str = bin_str_to_str(str);
  } catch {}
  return str;
};

export const get_possibily_not_undefined = <T>(val: T | null, fallback_val: T | null = null) => {
  if (val === undefined || val === null) val = fallback_val;
  return val!;
};
export const copy_text_to_clipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export function dataURLToBlob(dataURL: string) {
  const byteString = atob(dataURL.split(',')[1]);
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  const buffer = new ArrayBuffer(byteString.length);
  const intArray = new Uint8Array(buffer);

  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }

  return new Blob([buffer], { type: mimeString });
}

export function copy_plain_object<T>(obj: T) {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export function get_permutations(range: [number, number], count: number = 1): number[][] {
  const [start, end] = range;
  const numbers: number[] = Array.from({ length: end - start + 1 }, (_, i) => i + start);
  function shuffle(array: number[]): number[] {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  const permutations: number[][] = [];
  for (let i = 0; i < count; i++) {
    permutations.push(shuffle(numbers));
  }
  return permutations;
}

export function get_textarea_height(text: string, single_line_height: number, min_line: number) {
  const height = Math.max(min_line, text.split('\n').length) * single_line_height;
  return `${height}rem`;
}

/**
 * Creates a deep copy of a value, handling nested objects, arrays, Dates,
 * RegExps, Maps, Sets, and circular references.
 * @param value The value to deep copy
 * @param hash (Internal) Used to track circular references
 * @returns A deep copy of the input value
 */
export function deepCopy<T>(value: T, hash = new WeakMap()): T {
  // Handle primitive types and null/undefined
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // Handle circular references
  if (hash.has(value)) {
    return hash.get(value);
  }

  // Handle Date objects
  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  // Handle RegExp objects
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as T;
  }

  // Handle Map objects
  if (value instanceof Map) {
    const copy = new Map();
    hash.set(value, copy);
    value.forEach((val, key) => {
      copy.set(deepCopy(key, hash), deepCopy(val, hash));
    });
    return copy as T;
  }

  // Handle Set objects
  if (value instanceof Set) {
    const copy = new Set();
    hash.set(value, copy);
    value.forEach((val) => {
      copy.add(deepCopy(val, hash));
    });
    return copy as T;
  }

  // Handle Arrays
  if (Array.isArray(value)) {
    const copy: unknown[] = [];
    hash.set(value, copy);
    for (let i = 0; i < value.length; i++) {
      copy[i] = deepCopy(value[i], hash);
    }
    return copy as T;
  }

  // Handle Objects
  const result: Record<string, unknown> = {};
  hash.set(value, result);
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      result[key] = deepCopy(value[key], hash);
    }
  }
  return result as T;
}
