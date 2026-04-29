import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  MessageEntity,
  MessageEntityDocument,
  MessageEntry,
  MessageEntrySenderType,
} from '../entities/message.entity';
import { Model, Types } from 'mongoose';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { UpdateMessageDto } from '../dtos/update-message.dto';
import { MessageIdDto } from '../dtos/message-id.dto';
import { PoliticianIdDto } from 'src/politics/politician/dtos/politician-id.dto';
import { ReportIdDto } from 'src/report/dtos/report-id.dto';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(MessageEntity.name)
    private readonly model: Model<MessageEntityDocument>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const newMessage = new this.model({
      ...createMessageDto,
      lastMessageAt: new Date(),
      messages: createMessageDto.initialMessage
        ? [
            {
              senderId: createMessageDto.participants.citizenId,
              senderType: MessageEntrySenderType.CITIZEN,
              content: createMessageDto.initialMessage.content,
              createdAt: new Date(),
            },
          ]
        : [],
    });

    return newMessage.save();
  }

  async findOne({ messageId }: MessageIdDto) {
    return this.model.findById(messageId);
  }

  async update(
    { messageId }: MessageIdDto,
    updateMessageDto: UpdateMessageDto,
  ) {
    return this.model.updateOne(
      {
        _id: messageId,
      },
      updateMessageDto,
    );
  }

  async findBySourceReport(politicianId: string) {
    return this.model
      .find({
        'participants.politician.id': {
          $in: this.getPoliticianIdCandidates(politicianId),
        },
        messageOrigin: 'report_converted',
      })
      .exec();
  }

  async findOneBySourceReport({ reportId }: ReportIdDto) {
    return this.model.findOne({ sourceReportId: reportId }).exec();
  }

  async addMessageToThread(
    { messageId }: MessageIdDto,
    messageEntry: MessageEntry,
  ) {
    const newEntry = {
      ...messageEntry,
      createdAt: new Date(),
    };

    return this.model.updateOne(
      { _id: new Types.ObjectId(messageId) },
      {
        $push: { messages: newEntry },
        $set: { lastMessageAt: new Date() },
      },
    );
  }

  async findByJurisdiction({ politicianId }: PoliticianIdDto) {
    return this.model
      .find({
        'participants.politician.id': {
          $in: this.getPoliticianIdCandidates(politicianId),
        },
      })
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .exec();
  }

  async findByPoliticianId(politicianId: string) {
    return this.model
      .find({
        'participants.politician.id': {
          $in: this.getPoliticianIdCandidates(politicianId),
        },
      })
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .exec();
  }

  private getPoliticianIdCandidates(politicianId: string) {
    if (!Types.ObjectId.isValid(politicianId)) {
      return [politicianId];
    }

    return [politicianId, new Types.ObjectId(politicianId)];
  }
}
