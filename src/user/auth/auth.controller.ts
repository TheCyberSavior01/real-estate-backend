import {
  RegisterDto,
  LoginDto,
  generateProductKeyDto,
} from './../dtos/authDto.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { User, UserInfo } from '../user.decorator';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/:userType')
  register(@Body() data: RegisterDto, @Param('userType') userType: UserType) {
    if (userType != 'BUYER') {
      if (!data.productKey) throw new UnauthorizedException();
      const key = `${data.email}-${userType}-${process.env.PRODUCT_KEY}`;

      const isValidKey = bcrypt.compare(key, data.productKey);

      if (!isValidKey) throw new UnauthorizedException();
    }
    return this.authService.register(data, userType);
  }

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Roles(UserType.ADMIN)
  @Post('key')
  generateProductKey(@Body() data: generateProductKeyDto) {
    return this.authService.generateProductKey(data);
  }

  @Get('me')
  getCurrentUser(@User() user: UserInfo) {
    return user;
  }
}
