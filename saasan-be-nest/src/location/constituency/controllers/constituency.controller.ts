import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ConstituencyService } from '../services/constituency.service';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { CreateConstituencyDto } from '../dtos/create-constituency.dto';

@UseGuards(HttpAccessTokenGuard)
@Controller('constituency')
export class ConstituencyController {
  constructor(private readonly constituencyService: ConstituencyService) {}
  @Get()
  async getConstituencies() {}

  @Get('constituencyId')
  async getConstituencyById() {}

  @HttpCode(201)
  @Post()
  async createConstituency(@Body() constituencyData: CreateConstituencyDto) {
    return this.constituencyService.createConstituency(constituencyData);
  }
}
