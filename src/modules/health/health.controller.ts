import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import {
  HealthCheck,
  HealthCheckService,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

import { IAppConfig } from '../../config/configuration.interface';
import { RedisHealthIndicator } from './indicators/redis.health';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly microservice: MicroserviceHealthIndicator,
    private readonly redis: RedisHealthIndicator,
    private readonly configService: ConfigService<IAppConfig>,
  ) {}

  /**
   * Liveness — "is the process responding?". Intentionally has no external
   * dependency checks: Docker uses this to decide whether to restart the
   * container, and we don't want a transient Postgres/Redis/Rabbit outage to
   * trigger a restart loop. If the event loop is wedged this won't respond.
   */
  @Get('live')
  @HealthCheck()
  checkLiveness() {
    return this.health.check([]);
  }

  /**
   * Readiness — "can the app actually serve requests?". Verifies every backing
   * service. Meant for humans and future load balancers / uptime monitors.
   */
  @Get('ready')
  @HealthCheck()
  checkReadiness() {
    return this.health.check([
      () => this.db.pingCheck('database', { timeout: 3000 }),
      () => this.redis.isHealthy('redis'),
      () =>
        this.microservice.pingCheck('rabbitmq', {
          transport: Transport.RMQ,
          timeout: 3000,
          options: { urls: [this.buildRabbitUrl()] },
        }),
    ]);
  }

  private buildRabbitUrl(): string {
    const user = this.configService.get('RABBITMQ_USER');
    const password = this.configService.get('RABBITMQ_PASSWORD');
    const host = this.configService.get('RABBITMQ_HOST');
    const port = this.configService.get('RABBITMQ_PORT');
    return `amqp://${user}:${password}@${host}:${port}`;
  }
}
