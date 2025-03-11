import { Module } from '@nestjs/common';
import { SurrealdbService } from './surrealdb.service';

@Module({
  providers: [SurrealdbService],
  exports: [SurrealdbService],
})
export class SurrealdbModule {}
