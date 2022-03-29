import { PrismaModule } from './../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [PrismaModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class UserModule {}
