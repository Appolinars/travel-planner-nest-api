import { createKeyv, Keyv } from '@keyv/redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';

import { IAppConfig } from '../../../config/configuration.interface';

/**
 * Terminus has no built-in Redis indicator that works without `ioredis`.
 * This one reuses `@keyv/redis` (already a dependency) to round-trip a probe
 * key, so we avoid pulling in a second Redis client just for health checks.
 */
@Injectable()
export class RedisHealthIndicator {
  private readonly client: Keyv;

  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    configService: ConfigService<IAppConfig>,
  ) {
    this.client = createKeyv({
      url: `redis://${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`,
      socket: {
        connectTimeout: 3000,
        // Fail fast: don't let a down Redis hold the health request open.
        reconnectStrategy: (retries) =>
          retries > 1 ? new Error('Redis unavailable') : 200,
      },
    });
    // Keyv emits 'error' on connection problems; swallow it so an unhandled
    // event can't crash the process — isHealthy() reports the failure instead.
    this.client.on('error', () => undefined);
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);

    try {
      await this.probe();
      return indicator.up();
    } catch (error) {
      return indicator.down({
        message: error instanceof Error ? error.message : 'Redis unavailable',
      });
    }
  }

  private async probe(): Promise<void> {
    await Promise.race([
      this.client.set('health:redis:ping', Date.now(), 2000),
      this.rejectAfter(3000),
    ]);
  }

  private rejectAfter(ms: number): Promise<never> {
    return new Promise<never>((_, reject) => {
      const timer = setTimeout(
        () => reject(new Error('Redis ping timed out')),
        ms,
      );
      // Don't keep the event loop alive just for this guard timer.
      timer.unref();
    });
  }
}
