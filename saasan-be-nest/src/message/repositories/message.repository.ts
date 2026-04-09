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
        'participants.politicianId': politicianId,
        messageOrigin: 'report_converted',
      })
      .exec();
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
        lastMessageAt: new Date(),
      },
    );
  }

  async findByJurisdiction({ politicianId }: PoliticianIdDto) {
    // const politician = await this.model.findOne({
    //   'participants.politician.id': politicianId,
    // });

    // if (!politician) return [];

    // const jurisdictionFilter = politician.jurisdiction;
    // return this.model.find(
    //   {
    //     'jurisdiction.provinceId': jurisdictionFilter.provinceId,
    //     'jurisdiction.districtId': jurisdictionFilter.districtId,
    //     'jurisdiction.constituencyId': jurisdictionFilter.constituencyId,
    //     'jurisdiction.municipalityId': jurisdictionFilter.municipalityId,
    //     'jurisdiction.wardId': jurisdictionFilter.wardId,
    //   },
    //   {
    //     lastMessageAt: -1,
    //   },
    // );
    return this.model.find();
  }
}
