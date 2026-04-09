import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PoliticianService } from '../services/politician.service';
import { PoliticianIdDto } from '../dtos/politician-id.dto';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';

@UseGuards(HttpAccessTokenGuard)
@Controller('admin/politician')
export class AdminPoliticianController {
  constructor(private readonly politicianService: PoliticianService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post(':politicianId/create-account')
  async createAccount(@Param() politicianIdDto: PoliticianIdDto) {
    await this.politicianService.createAccount(politicianIdDto);
  }
}
