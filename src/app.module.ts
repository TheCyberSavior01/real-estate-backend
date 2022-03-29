import { UserInterceptor } from './user/user.interceptor';
import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { HomesModule } from './homes/homes.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [PrismaModule, UserModule, HomesModule],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: UserInterceptor },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
