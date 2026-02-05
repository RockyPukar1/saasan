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
@Controller('admin/ward')
export class AdminWardController {
  constructor(private readonly wardService: WardService) {}

  @HttpCode(201)
  @Post()
  async createWard(@Body() wardData: CreateWardDto) {
    return this.wardService.createWard(wardData);
  }
}
