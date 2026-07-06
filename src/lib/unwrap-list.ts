export function unwrapList<T>(data: T[] | { items: T[] }): T[] {
  return Array.isArray(data) ? data : data.items;
}
