import {
  RegisterDto,
  LoginDto,
  generateProductKeyDto,
} from './../dtos/authDto.dto';
import { PrismaService } from './../../prisma/prisma.service';
import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async register(
    { email, password, phone, name }: RegisterDto,
    userType: UserType,
  ) {
    const userExist = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (userExist) {
      throw new ConflictException();
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = this.prismaService.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          user_type: userType,
        },
      });

      const token = await this.generateJWT((await user).name, (await user).id);
      return token;
    }
  }

  async login({ email, password }: LoginDto) {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) throw new HttpException('incorrenct credentials!', 400);

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) throw new HttpException('incorrect credentials', 404);

    const token = await this.generateJWT(user.name, user.id);
    return token;
  }

  generateProductKey({ email, userType }: generateProductKeyDto) {
    const key = `${email}-${userType}-${process.env.PRODUCT_KEY}`;

    return bcrypt.hash(key, 10);
  }

  private generateJWT(name, id) {
    return jwt.sign(
      {
        name,
        id,
      },
      process.env.JWT_KEY,
      {
        expiresIn: 7200,
      },
    );
  }
}
