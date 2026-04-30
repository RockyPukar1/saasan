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
import { MessageEntrySenderType } from '../entities/message.entity';
import { ReportIdDto } from 'src/report/dtos/report-id.dto';
import { Types } from 'mongoose';
import { PoliticianRepository } from 'src/politics/politician/repositories/politician.repository';
import { UserRepository } from 'src/user/repositories/user.repository';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepo: MessageRepository,
    private readonly jurisdictionService: JurisdictionService,
    private readonly politicianRepo: PoliticianRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async create(
    createMessageDto: CreateMessageDto,
    { citizenId }: CitizenIdDto,
  ) {
    const politicianIds = [
      createMessageDto.participants.politicianId,
      ...(createMessageDto.participants.politicianIds || []),
    ].filter(Boolean);

    const uniquePoliticianIds = [...new Set(politicianIds)];
    const politicians = uniquePoliticianIds.length
      ? await this.politicianRepo.findManyByIds(uniquePoliticianIds)
      : [];
    const primaryPoliticianId =
      createMessageDto.participants.politicianId || uniquePoliticianIds[0];
    const primaryPolitician =
      politicians.find(
        (politician) => politician._id.toString() === primaryPoliticianId,
      ) || politicians[0];
    const citizen = await this.userRepo.findById({ userId: citizenId });

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
          name: citizen?.email?.split('@')[0] || 'Citizen',
          email: citizen?.email || '',
          location: createMessageDto.jurisdiction,
        },
        politician: {
          id: primaryPolitician?._id?.toString() || primaryPoliticianId,
          name: primaryPolitician?.fullName || 'Representative',
        },
        politicians: politicians.map((politician) => ({
          id: politician._id.toString(),
          name: politician.fullName,
        })),
      },
    };

    return this.messageRepo.create(messageData);
  }

  async findOne(messageIdDto: MessageIdDto, politicianIdDto: PoliticianIdDto) {
    const message = await this.messageRepo.findOne(messageIdDto);

    if (!message)
      throw new GlobalHttpException('message404', HttpStatus.NOT_FOUND);

    const hasAccess = await this.validateMessageAccess(message, {
      politicianId: politicianIdDto.politicianId,
    });

    if (!hasAccess)
      throw new GlobalHttpException('message403', HttpStatus.FORBIDDEN);

    return message;
  }

  async findBySourceReport(
    reportIdDto: ReportIdDto,
    actor: {
      role: string;
      userId: string;
      politicianId?: string;
    },
  ) {
    const message = await this.messageRepo.findOneBySourceReport(reportIdDto);

    if (!message)
      throw new GlobalHttpException('message404', HttpStatus.NOT_FOUND);

    const hasAccess = await this.validateMessageAccess(message, actor);

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

    const hasAccess = await this.validateMessageAccess(message, {
      politicianId: politicianIdDto.politicianId,
    });

    if (!hasAccess)
      throw new GlobalHttpException('message403', HttpStatus.FORBIDDEN);

    return this.messageRepo.update(messageIdDto, updateMessageDto);
  }

  async addMessageToThread(
    messageIdDto: MessageIdDto,
    messageEntry: MessageEntry,
    actor: {
      role: string;
      userId: string;
      politicianId?: string;
    },
  ) {
    const message = await this.messageRepo.findOne(messageIdDto);

    if (!message)
      throw new GlobalHttpException('message404', HttpStatus.NOT_FOUND);

    const hasAccess = await this.validateMessageAccess(message, actor);

    if (!hasAccess)
      throw new GlobalHttpException('message403', HttpStatus.FORBIDDEN);

    return this.messageRepo.addMessageToThread(messageIdDto, messageEntry);
  }

  async addReply(
    messageIdDto: MessageIdDto,
    reply: {
      content: string;
      attachments?: Array<{
        fileName: string;
        fileType: string;
        fileUrl: string;
      }>;
    },
    actor: {
      role: string;
      userId: string;
      politicianId?: string;
    },
  ) {
    const senderType =
      actor.role === 'politician'
        ? MessageEntrySenderType.POLITICIAN
        : actor.role === 'admin'
          ? MessageEntrySenderType.STAFF
          : MessageEntrySenderType.CITIZEN;

    await this.addMessageToThread(
      messageIdDto,
      {
        _id: new Types.ObjectId(),
        senderId: new Types.ObjectId(actor.politicianId || actor.userId),
        senderType,
        content: reply.content,
        attachments:
          reply.attachments?.map((attachment) => ({
            _id: new Types.ObjectId(),
            ...attachment,
            uploadedBy: actor.userId,
            uploadedAt: new Date(),
          })) || [],
        isInternal: actor.role === 'admin',
      },
      actor,
    );

    return this.messageRepo.findOne(messageIdDto);
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
    actor: {
      role?: string;
      userId?: string;
      politicianId?: string;
    },
  ) {
    if (actor.role === 'admin') return true;

    if (actor.role === 'citizen') {
      return message.participants.citizen.id.toString() === actor.userId;
    }

    const assignedPoliticianIds = [
      message.participants.politician?.id,
      ...(message.participants.politicians?.map((politician) => politician.id) ||
        []),
    ]
      .filter(Boolean)
      .map((politicianId) => politicianId.toString());

    return assignedPoliticianIds.includes(actor.politicianId || '');
  }
}
