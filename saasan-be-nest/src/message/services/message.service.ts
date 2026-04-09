import { HttpStatus, Injectable } from '@nestjs/common';
import { MessageRepository } from '../repositories/message.repository';
import { JurisdictionService } from 'src/location/services/jurisdiction.service';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { CitizenIdDto } from '../dtos/citizen-id.dto';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { PoliticianIdDto } from 'src/politics/politician/dtos/politician-id.dto';
import { MessageIdDto } from '../dtos/message-id.dto';
import {
  MessageEntity,
  MessageEntry,
  MessageStatus,
} from '../entities/message.entity';
import { UpdateMessageDto } from '../dtos/update-message.dto';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepo: MessageRepository,
    private readonly jurisdictionService: JurisdictionService,
  ) {}

  async create(
    createMessageDto: CreateMessageDto,
    { citizenId }: CitizenIdDto,
  ) {
    // Validate jurisdiction access
    // const hasAccess = await this.jurisdictionService.validateJurisdictionAccess(
    //   { politicianId: createMessageDto.participants.politicianId },
    //   createMessageDto.jurisdiction,
    // );

    // if (!hasAccess)
    //   throw new GlobalHttpException('jurisdiction403', HttpStatus.FORBIDDEN);

    // Create message with initial message
    const messageData = {
      ...createMessageDto,
      participants: {
        ...createMessageDto.participants,
        citizen: {
          id: citizenId,
          name: '', // Would be populated from user service
          email: '', // Would be populated from user service
          location: createMessageDto.jurisdiction,
        },
        politician: {
          id: createMessageDto.participants.politicianId,
          name: '', // Would be populated from politician sevice
        },
      },
    };

    return this.messageRepo.create(messageData);
  }

  async findOne(messageIdDto: MessageIdDto, politicianIdDto: PoliticianIdDto) {
    const message = await this.messageRepo.findOne(messageIdDto);

    if (!message)
      throw new GlobalHttpException('message404', HttpStatus.NOT_FOUND);

    // Verify politician has access to this message
    const hasAccess = await this.validateMessageAccess(
      message,
      politicianIdDto,
    );

    if (!hasAccess)
      throw new GlobalHttpException('message403', HttpStatus.FORBIDDEN);

    return message;
  }

  async update(
    messageIdDto: MessageIdDto,
    updateMessageDto: UpdateMessageDto,
    politicianIdDto: PoliticianIdDto,
  ) {
    const message = await this.messageRepo.findOne(messageIdDto);

    if (!message)
      throw new GlobalHttpException('message404', HttpStatus.NOT_FOUND);

    // Verify politician has access to this message
    const hasAccess = await this.validateMessageAccess(
      message,
      politicianIdDto,
    );

    if (!hasAccess)
      throw new GlobalHttpException('message403', HttpStatus.FORBIDDEN);

    return this.messageRepo.update(messageIdDto, updateMessageDto);
  }

  async addMessageToThread(
    messageIdDto: MessageIdDto,
    messageEntry: MessageEntry,
    politicianIdDto: PoliticianIdDto,
  ) {
    const message = await this.messageRepo.findOne(messageIdDto);

    if (!message)
      throw new GlobalHttpException('message404', HttpStatus.NOT_FOUND);

    // Verify politician has access to this message
    const hasAccess = await this.validateMessageAccess(
      message,
      politicianIdDto,
    );

    if (!hasAccess)
      throw new GlobalHttpException('message403', HttpStatus.FORBIDDEN);

    return this.messageRepo.addMessageToThread(messageIdDto, messageEntry);
  }

  async getMessagesByJurisdiction(policianIdDto: PoliticianIdDto) {
    return await this.messageRepo.findByJurisdiction(policianIdDto);
  }

  async updateStatus(
    messageIdDto: MessageIdDto,
    status: MessageStatus,
    politicianIdDto: PoliticianIdDto,
  ) {
    const message = await this.messageRepo.findOne(messageIdDto);

    if (!message)
      throw new GlobalHttpException('message404', HttpStatus.NOT_FOUND);

    // Verify politician has access to this message
    const hasAccess = await this.validateMessageAccess(
      message,
      politicianIdDto,
    );

    if (!hasAccess)
      throw new GlobalHttpException('message403', HttpStatus.FORBIDDEN);

    return this.messageRepo.update(messageIdDto, { status });
  }

  private async validateMessageAccess(
    message: MessageEntity,
    { politicianId }: PoliticianIdDto,
  ) {
    return message.participants.politician.id.toString() === politicianId;
  }
}
