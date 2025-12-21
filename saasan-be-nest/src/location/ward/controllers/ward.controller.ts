import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { WardService } from '../services/ward.service';
import { CreateWardDto } from '../dtos/create-ward.dto';

@UseGuards(HttpAccessTokenGuard)
@Controller('ward')
export class WardController {
  constructor(private readonly wardService: WardService) {}

  @Get()
  async getWards() {}

  @Get('wardId')
  async getWardById() {}

  @HttpCode(201)
  @Post()
  async createWard(@Body() wardData: CreateWardDto) {
    return this.wardService.createWard(wardData);
  }
}
