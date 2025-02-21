import { Module } from '@nestjs/common';
import { Cacheable } from 'cacheable';
import { createKeyv } from '@keyv/redis';
import { ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';

@Module({
  providers: [
    {
      provide: 'CACHE_INSTANCE',
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('REDIS_HOST');
        const port = configService.get<string>('REDIS_PORT');
        const password = configService.get<string>('REDIS_PASSWORD');
        const redisUrl = `redis://:${password}@${host}:${port}`;
        const secondary = createKeyv(redisUrl);
        return new Cacheable({ secondary, ttl: '4h' });
      },
      inject: [ConfigService],
    },
    CacheService,
  ],
  exports: ['CACHE_INSTANCE', CacheService],
})
export class CacheModule {}
