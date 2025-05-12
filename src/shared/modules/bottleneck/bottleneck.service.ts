import { Injectable } from '@nestjs/common';
import Bottleneck from 'bottleneck';

@Injectable()
export class BottleneckService {
  private limiters = new Map<string, Bottleneck>();

  build(key: string, options: Bottleneck.ConstructorOptions): Bottleneck {
    if (!this.limiters.has(key)) {
      this.limiters.set(key, new Bottleneck(options));
    }

    return this.limiters.get(key)!;
  }
}
