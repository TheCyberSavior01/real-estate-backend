import { PrismaService } from './../prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserInfo } from 'src/user/user.decorator';

@Injectable()
export class HomesService {
  constructor(private readonly prismaService: PrismaService) {}

  getAllHomes() {
    return this.prismaService.home.findMany();
  }

  getHomeById(id: number) {
    return this.prismaService.home.findUnique({ where: { id } });
  }

  createHome(
    {
      address,
      number_of_bedrooms,
      number_of_bathrooms,
      city,
      price,
      property_type,
      land_size,
    }: Prisma.HomeCreateInput,
    userId: number,
  ) {
    return this.prismaService.home.create({
      data: {
        address,
        number_of_bedrooms,
        number_of_bathrooms,
        city,
        price,
        land_size,
        property_type,
        sellerId: userId,
      },
    });
  }

  updateHome(id: number, data: Prisma.HomeUpdateInput) {
    return this.prismaService.home.update({ data, where: { id } });
  }

  deleteHome(id: number) {
    return this.prismaService.home.delete({ where: { id } });
  }

  async getSellerByHomeId(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: { id },
      select: {
        seller: {
          select: {
            name: true,
            email: true,
            id: true,
          },
        },
      },
    });

    if (!home) throw new NotFoundException();

    return home.seller;
  }
}
