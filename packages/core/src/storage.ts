export interface StorageAdapter {
  get<T>(key: string, defaultValue: T): Promise<T>;
  set<T>(key: string, value: T): Promise<void>;
  subscribe?(listener: (key: string, newValue: unknown) => void): () => void;
}

/**
 * In-memory storage adapter for unit tests and local simulations.
 */
export class MemoryStorageAdapter implements StorageAdapter {
  private store = new Map<string, unknown>();
  private listeners = new Set<(key: string, newValue: unknown) => void>();

  async get<T>(key: string, defaultValue: T): Promise<T> {
    if (this.store.has(key)) {
      return this.store.get(key) as T;
    }
    return defaultValue;
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.store.set(key, value);
    this.listeners.forEach((listener) => listener(key, value));
  }

  subscribe(listener: (key: string, newValue: unknown) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  clear(): void {
    this.store.clear();
  }
}
