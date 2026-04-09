import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateMessageDto } from '../dtos/create-message.dto';
import type { Request } from 'express';
import { MessageService } from '../services/message.service';
import { UpdateMessageDto } from '../dtos/update-message.dto';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';

@UseGuards(HttpAccessTokenGuard)
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async create(
    @Body() createMessageDto: CreateMessageDto,
    @Req() req: Request,
  ) {
    return await this.messageService.create(createMessageDto, {
      citizenId: req.user.id,
    });
  }

  // @Get()
  // async findAll() {}

  @Get('jurisdiction')
  async getJurisdictionMessages(@Req() req: Request) {
    return await this.messageService.getMessagesByJurisdiction({
      politicianId: req.user.id,
    });
  }

  @Get(':messageId')
  async findOne(@Param('messageId') messageId: string, @Req() req: Request) {
    return await this.messageService.findOne(
      { messageId },
      { politicianId: req.user.id },
    );
  }

  @Put(':messageId')
  async update(
    @Param('messageId') messageId: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @Req() req: Request,
  ) {
    return this.messageService.update({ messageId }, updateMessageDto, {
      politicianId: req.user.id,
    });
  }

  @Post(':messageId/reply')
  async addReply(@Param('messageId') messageId: string, @Req() req: Request) {}
}
