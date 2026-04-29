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
import { AddReplyDto } from '../dtos/add-reply.dto';
import { ReportIdDto } from 'src/report/dtos/report-id.dto';

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
    const requestUser = req.user as any;
    return await this.messageService.getMessagesByJurisdiction({
      politicianId: requestUser.politicianId || requestUser.id,
    });
  }

  @Get('report/:reportId')
  async findBySourceReport(@Param() param: ReportIdDto, @Req() req: Request) {
    const requestUser = req.user as any;
    return await this.messageService.findBySourceReport(param, {
      role: requestUser.role,
      userId: requestUser.id,
      politicianId: requestUser.politicianId || requestUser.id,
    });
  }

  @Get(':messageId')
  async findOne(@Param('messageId') messageId: string, @Req() req: Request) {
    const requestUser = req.user as any;
    return await this.messageService.findOne(
      { messageId },
      { politicianId: requestUser.politicianId || requestUser.id },
    );
  }

  @Put(':messageId')
  async update(
    @Param('messageId') messageId: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @Req() req: Request,
  ) {
    const requestUser = req.user as any;
    return this.messageService.update({ messageId }, updateMessageDto, {
      politicianId: requestUser.politicianId || requestUser.id,
    });
  }

  @Post(':messageId/reply')
  async addReply(
    @Param('messageId') messageId: string,
    @Body() addReplyDto: AddReplyDto,
    @Req() req: Request,
  ) {
    const requestUser = req.user as any;
    return await this.messageService.addReply({ messageId }, addReplyDto, {
      role: requestUser.role,
      userId: requestUser.id,
      politicianId: requestUser.politicianId || requestUser.id,
    });
  }
}
