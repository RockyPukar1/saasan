import { Injectable, Logger } from "@nestjs/common";

export interface CacheItem<T> {
  data: T;
  expiry: number;
  createdAt: number;
}

@Injectable()
export class MemoryCacheService {
  private cache = new Map<string, CacheItem<any>>()
  private readonly logger = new Logger(MemoryCacheService.name)

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    const expiry = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, {
      data,
      expiry,
      createdAt: Date.now()
    })
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear()
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }

  cleanup(): void {
    const now = Date.now();
    let cleaned = 0;
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.logger.log(`Cleaned up ${cleaned} expired cache entries`);
    }
  }
}