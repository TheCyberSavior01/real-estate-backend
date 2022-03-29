import { Prisma, UserType } from '@prisma/client';
import { HomesService } from './homes.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { User, UserInfo } from '../user/user.decorator';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('homes')
export class HomesController {
  constructor(private readonly homeService: HomesService) {}

  @Get()
  getAllHomes() {
    return this.homeService.getAllHomes();
  }

  @Get(':id')
  getHomeById(@Param('id') id: string) {
    return this.homeService.getHomeById(+id);
  }

  @Roles(UserType.SELLER)
  @Post()
  createHome(@Body() data: Prisma.HomeCreateInput, @User() user: UserInfo) {
    return this.homeService.createHome(data, user.id);
  }

  @Roles(UserType.SELLER)
  @Put(':id')
  async updateHome(
    @Param('id') id: number,
    @Body() data: Prisma.HomeUpdateInput,
    @User() user,
  ) {
    const seller = await this.homeService.getSellerByHomeId(id);

    if (seller.id !== user.id) throw new UnauthorizedException();

    return this.homeService.updateHome(id, data);
  }

  @Roles(UserType.SELLER)
  @Delete(':id')
  async deleteHome(@Param('id') id: number, @User() user) {
    const seller = await this.homeService.getSellerByHomeId(+id);

    console.log('seller: ', seller);
    console.log('user: ', user.id);
    if (seller.id !== user.id) throw new UnauthorizedException();

    return this.homeService.deleteHome(+id);
  }
}
