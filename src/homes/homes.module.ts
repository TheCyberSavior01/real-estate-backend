import { PrismaModule } from './../prisma/prisma.module';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { HomesController } from './homes.controller';
import { HomesService } from './homes.service';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [PrismaModule],
  controllers: [HomesController],
  providers: [
    HomesService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class HomesModule {}
