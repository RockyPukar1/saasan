import { Global, HttpStatus, Injectable } from '@nestjs/common';
import { VoteDto } from '../dtos/vote.dto';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { PollRepository } from '../repositories/poll.repository';
import { PollVoteRepository } from '../repositories/poll-vote.repository';
import { PollOptionRepository } from '../repositories/poll-option.repository';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { CreatePollDto } from '../dtos/create-poll.dto';
import { PollIdDto } from '../dtos/poll-id.dto';
import { Connection, Types } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class PollService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly pollRepo: PollRepository,
    private readonly pollVoteRepo: PollVoteRepository,
    private readonly pollOptionRepo: PollOptionRepository,
  ) {}

  async getAll() {
    const data = await this.pollRepo.getAll();
    return ResponseHelper.success(data, 'Polls fetched successfully');
  }

  async getPollById({ pollId }: PollIdDto) {
    const poll = await this.doesPollExists({
      _id: pollId,
    })
      .populate('options', '_id voteCount text')
      .lean();
    if (!poll) throw new GlobalHttpException('poll404', HttpStatus.NOT_FOUND);

    return ResponseHelper.success(poll, 'Poll data fetched successfully');
  }

  async create({ options, ...pollData }: CreatePollDto) {
    const poll = await this.pollRepo.create(pollData);

    if (options.length) {
      const optionsPromises = options.map((text) =>
        this.pollOptionRepo.create({
          pollId: poll._id.toString(),
          text,
        }),
      );

      const createdOptionsIds = (await Promise.all(optionsPromises)).map(
        (option) => option._id.toString(),
      );

      await this.pollRepo.updateOne(poll._id.toString(), {
        options: createdOptionsIds,
      });
    }
  }

  async vote(userId: string, { pollId, optionId }: VoteDto) {
    const existingPoll = await this.pollRepo.findById(pollId);
    if (!existingPoll) {
      throw new GlobalHttpException('poll404', HttpStatus.NOT_FOUND);
    }

    const optionExists = existingPoll.options.find(
      (opt) => opt.toString() === optionId,
    );
    if (!optionExists) {
      throw new GlobalHttpException('pollOption404', HttpStatus.NOT_FOUND);
    }

    const registerVote = await this.registerVote(userId, {
      pollId,
      optionId,
    });

    if (registerVote) {
      const updatedPoll = await this.pollRepo
        .findOne({ pollId, userId })
        .populate('options', '_id voteCount text percentage')
        .lean();

      return ResponseHelper.success(updatedPoll, 'Vote recorded successfully');
    } else {
      throw new GlobalHttpException(
        'vote505',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private doesPollExists(filter: any) {
    return this.pollRepo.findOne(filter);
  }

  private async registerVote(userId: string, { pollId, optionId }: VoteDto) {
    const session = await this.connection.startSession();

    try {
      await session.withTransaction(async () => {
        await this.pollRepo.incrTotalVotes(pollId, session);
        await this.pollVoteRepo.create({ pollId, optionId });
        await this.pollOptionRepo.incrVoteCount({ pollId, optionId }, session);
      });
    } catch (error) {
      throw error;
    } finally {
      await session.endSession();
    }

    return true;
  }
}
